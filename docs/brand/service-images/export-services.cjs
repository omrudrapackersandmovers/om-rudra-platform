const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '../../..');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.json'), 'utf8'));
const target = path.join(root, 'frontend/website/public/images/services');
async function main() {
  for (const item of manifest) {
    const master = path.join(__dirname, `${item.slug}.png`);
    if (!fs.existsSync(master)) throw new Error(`Missing source: ${master}`);
    const info = await sharp(master).metadata();
    const base = path.join(target, `${item.slug}-v2`);
    await sharp(master).resize({ width: 1536, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`${base}.webp`);
    for (const width of [320, 640, 960, 1536]) {
      await sharp(master).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`${base}-${width}w.webp`);
    }
    console.log(`${item.slug}: ${info.width}x${info.height}, responsive WebP exported`);
  }
  await sharp(path.join(__dirname, 'home-shifting.png')).resize(768, 960, { fit: 'cover', position: 'centre' }).webp({ quality: 82 }).toFile(path.join(target, 'home-shifting-mobile-v2.webp'));
}
main().catch(error => { console.error(error); process.exit(1); });
