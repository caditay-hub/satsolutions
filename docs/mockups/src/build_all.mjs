import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dir = path.dirname(fileURLToPath(import.meta.url));
const S = __dir;
const U = path.join(__dir, "../../../apps/api/uploads/images");
const uri = (f) => { const ext = f.split(".").pop(); const mime = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" }[ext]; return `data:${mime};base64,${fs.readFileSync(`${U}/${f}`).toString("base64")}`; };
const IMG = {
  cam: uri("42e16c55-cb2f-4723-a4fb-c53644440752.jpg"),
  cctv1: uri("fa56063e-b057-4c7a-a6e5-0e5c20aec3ed.webp"),
  cctv2: uri("30763b76-584e-4630-8b65-5ddbf1f830e3.webp"),
  cctv3: uri("0018eb71-ccf0-4d51-adf9-292c48842d77.webp"),
  home: uri("fa56063e-b057-4c7a-a6e5-0e5c20aec3ed.webp"),
  home2: uri("30763b76-584e-4630-8b65-5ddbf1f830e3.webp"),
  net: uri("f923d16f-2bc9-4a47-a95d-d34f3db72bc6.webp"),
  fiber: uri("f923d16f-2bc9-4a47-a95d-d34f3db72bc6.webp"),
  net2: uri("edd52aa5-f51f-4e30-91d0-47ea03e6d6a9.webp"),
  bar: uri("0018eb71-ccf0-4d51-adf9-292c48842d77.webp"),
  bar2: uri("40e49c17-c0a0-4f23-b500-6071c867773f.webp"),
  bus: uri("6bf8d6af-51fb-48c9-85fa-7b58b98c45ba.webp"),
  city: uri("844587a1-82fb-4901-9d23-9e81d0d7eb06.webp"),
};
IMG.bar2 = IMG.bar; // второе фото шлагбаума не подошло, дублируем въезд
const data = fs.readFileSync(`${S}/pages.json`, "utf8").replace(/<\/script/gi, "<\\/script");
let html = fs.readFileSync(`${S}/all_pages_template.html`, "utf8");
html = html.replace("{{DATA}}", data).replace("{{IMG}}", JSON.stringify(IMG));
fs.writeFileSync(path.join(__dir, "../all-service-pages.html"), html);
console.log("bytes:", html.length);
