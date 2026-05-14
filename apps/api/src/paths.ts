import path from "path";
import { fileURLToPath } from "url";

export const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const uploadsDir = path.join(packageRoot, "uploads");
export const uploadsImagesDir = path.join(uploadsDir, "images");

