import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const upload = path.join(root, "upload");
fs.mkdirSync(upload, { recursive: true });

for (let i = 1; i <= 9; i++) {
  const srcName = `ship${i}.jpeg`;
  const src = path.join(
    root,
    fs.existsSync(path.join(root, srcName)) ? srcName : "ship1.jpeg",
  );
  const dest = path.join(upload, `ship${i}.webp`);
  fs.copyFileSync(src, dest);
}

console.log("OK — fichiers dans upload/ :");
console.log(fs.readdirSync(upload).join(", "));
