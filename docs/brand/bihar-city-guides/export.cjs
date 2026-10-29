const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const target = path.resolve(__dirname, '../../../frontend/website/public/images/places');
async function main() {
  fs.mkdirSync(target, { recursive: true });
  for (const slug of ['patna', 'gaya', 'muzaffarpur', 'bhagalpur']) {
    const source = path.join(__dirname, `${slug}.png`);
    const base = path.join(target, `${slug}-guide-v2`);
    await sharp(source).resize(1536, 864, { fit: 'cover' }).webp({ quality: 82 }).toFile(`${base}.webp`);
    for (const width of [320, 640, 960, 1536]) {
      await sharp(source).resize(width, Math.round(width * 9 / 16), { fit: 'cover' }).webp({ quality: 82 }).toFile(`${base}-${width}w.webp`);
    }
  }
  console.log('Exported four destination images with responsive variants.');
}
main().catch(error => { console.error(error); process.exit(1); });
