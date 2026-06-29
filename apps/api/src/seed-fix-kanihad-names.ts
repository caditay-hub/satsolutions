import "dotenv/config";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

const NAMES: Record<string, string> = {
  "2cbf1ea6-bd27-4c0d-9d3e-27ded431245f": "Кабель FTP-KANIHAD 5-катег (внутренний чёрный) 4*2*0,5 305 метр",
  "82dc6dc7-e266-40f9-9f5a-3d5859db9456": "Кабель KKV-KANIHAD 2*0,35 300 метр",
  "062c3430-b974-4daf-aea3-9093d5c58a60": "Кабель UTP-KANIHAD 5-катег (внутренний оранжевый) 4*2*0,5 305 метр",
  "73906953-82ae-444e-9752-3a0bceb53dc4": "Кабель UTP-KANIHAD 6-катег (наружный чёрный) 4*2*0,56 305 метр",
};

async function main() {
  initModels();
  await connectDb();
  for (const [id, name] of Object.entries(NAMES)) {
    const p = await Product.findByPk(id);
    if (!p) { console.log("[fix-names] NOT FOUND", id); continue; }
    p.name = name;
    await p.save();
    console.log("[fix-names] OK", id.slice(0, 8), "->", name);
  }
  process.exit(0);
}

main().catch((e) => { console.error("[fix-names] FAILED:", e); process.exit(1); });
