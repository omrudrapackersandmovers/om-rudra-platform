const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '../../..');
async function main() {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.json'), 'utf8'));
  const target = path.join(root, 'frontend/website/public/images/places');
  fs.mkdirSync(target, { recursive: true });
  for (const item of manifest) {
    const master = path.join(__dirname, `${item.slug}.png`);
    const base = path.join(target, `${item.slug}-v2`);
    await sharp(master).webp({ quality: 82 }).toFile(`${base}.webp`);
    for (const width of [320, 640, 960, 1536]) {
      await sharp(master).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`${base}-${width}w.webp`);
    }
  }
  console.log(`${manifest.length} location images and responsive variants exported`);
}
main().catch(error => { console.error(error); process.exit(1); });
