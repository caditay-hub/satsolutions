import { describe, expect, it } from "vitest";
import opticsData from "../../../data/cameraOptics.json";
import { EXAMPLE_CAMERA, EXAMPLE_ROOMS, EXAMPLE_SIZE, exampleCoverage, exampleProject, isExampleId } from "./example";
import { parseProject } from "./project";

describe("пример проекта (превью на главной)", () => {
  it("углы камеры — снимок справочника cameraOptics.json (verified)", () => {
    const c = (opticsData as unknown as { cameras: { slug: string; status: string; widthPx: number; heightPx: number; variants: { hfovDeg: number[]; vfovDeg: number[] | null; focalMm: number[] | null }[] }[] })
      .cameras.find((x) => x.slug === EXAMPLE_CAMERA.slug)!;
    expect(c).toBeTruthy();
    expect(c.status).toBe("verified");
    expect([c.widthPx, c.heightPx]).toEqual([EXAMPLE_CAMERA.nx, EXAMPLE_CAMERA.ny]);
    expect(c.variants[0].hfovDeg).toEqual(EXAMPLE_CAMERA.variants[0].hfovDeg);
    expect(c.variants[0].vfovDeg).toEqual(EXAMPLE_CAMERA.variants[0].vfovDeg);
    expect(c.variants[0].focalMm).toEqual(EXAMPLE_CAMERA.variants[0].focalMm);
  });

  it("проект проходит тот же разбор, что файл .satplan", () => {
    const p = exampleProject();
    const back = parseProject(JSON.parse(JSON.stringify(p)));
    expect(back).not.toBeNull();
    expect(back!.cams).toHaveLength(3);
    expect(back!.walls).toHaveLength(2);
    expect(back!.zones).toHaveLength(1);
    expect(back!.rack).toEqual(p.rack);
  });

  it("камеры смотрят внутрь своих помещений, помещения закрывают здание", () => {
    const p = exampleProject();
    for (const c of p.cams) {
      expect(c.x).toBeGreaterThan(0); expect(c.x).toBeLessThan(EXAMPLE_SIZE.w);
      expect(c.y).toBeGreaterThan(0); expect(c.y).toBeLessThan(EXAMPLE_SIZE.h);
      expect(c.tiltDeg).toBeGreaterThan(0); expect(c.tiltDeg).toBeLessThan(45);
    }
    expect(EXAMPLE_ROOMS.reduce((s, r) => s + r.w * r.h, 0)).toBe(EXAMPLE_SIZE.w * EXAMPLE_SIZE.h);
  });

  it("покрытие зоны охраны считается и правдоподобно", () => {
    const k = exampleCoverage();
    expect(k).toBeGreaterThan(0.5);
    expect(k).toBeLessThan(1);
  });

  it("только известные примеры", () => {
    expect(isExampleId("office")).toBe(true);
    expect(isExampleId("../x")).toBe(false);
    expect(isExampleId(undefined)).toBe(false);
  });
});
