import { NextResponse, type NextRequest } from "next/server";
import { loadEquipment, type EquipmentResponse } from "@/lib/cameraDesigner/estimate/equipmentData";
import { routing } from "@/i18n/routing";

// Оборудование для сметы (SAT Camera Designer, этап D): подбор и цены — lib/cameraDesigner/estimate/equipmentData.
// Ссылки на документы производителя наружу не отдаём.

export type { EquipmentResponse };

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const locale = (routing.locales as readonly string[]).includes(sp.get("locale") || "") ? (sp.get("locale") as string) : routing.defaultLocale;
  const { body, failed } = await loadEquipment(locale);
  // при сбое API не кэшируем — иначе неполный подбор жил бы 5 минут
  return NextResponse.json(body, { headers: { "X-Robots-Tag": "noindex", "Cache-Control": failed ? "no-store" : "public, max-age=300" } });
}
