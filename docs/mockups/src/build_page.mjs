// Собирает макет страницы: подставляет фото из репозитория как data URI.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dir = path.dirname(fileURLToPath(import.meta.url));
const S = __dir;
const U = path.join(__dir, "../../../apps/api/uploads/images");
const uri = (f) => {
  const ext = f.split(".").pop();
  const mime = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" }[ext];
  return `data:${mime};base64,${fs.readFileSync(`${U}/${f}`).toString("base64")}`;
};
const map = {
  HERO: "42e16c55-cb2f-4723-a4fb-c53644440752.jpg",
  P1: "fa56063e-b057-4c7a-a6e5-0e5c20aec3ed.webp",
  P2: "30763b76-584e-4630-8b65-5ddbf1f830e3.webp",
  P3: "0018eb71-ccf0-4d51-adf9-292c48842d77.webp",
  E1: "69c4b6d7-cf1b-419c-934c-df666e91f9d5.jpg",
};
let html = fs.readFileSync(`${S}/page_template.html`, "utf8");
for (const [k, f] of Object.entries(map)) html = html.split(`{{${k}}}`).join(uri(f));
fs.writeFileSync(path.join(__dir, "../service-cctv.html"), html);
console.log("bytes:", html.length);
