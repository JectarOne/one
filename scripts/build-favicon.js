// Regenerate the raster favicons from favicon.svg (single source of truth).
// Run: npm run build:favicon
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const svg = fs.readFileSync(path.join(ROOT, "favicon.svg"));

(async () => {
  await sharp(svg, { density: 384 })
    .resize(32, 32)
    .png({ compressionLevel: 9, palette: true })
    .toFile(path.join(ROOT, "favicon-32x32.png"));
  await sharp(svg, { density: 384 })
    .resize(180, 180)
    .png({ compressionLevel: 9 })
    .toFile(path.join(ROOT, "apple-touch-icon.png"));
  const a = fs.statSync(path.join(ROOT, "favicon-32x32.png")).size;
  const b = fs.statSync(path.join(ROOT, "apple-touch-icon.png")).size;
  console.log(`favicon-32x32.png ${a} bytes, apple-touch-icon.png ${b} bytes`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
