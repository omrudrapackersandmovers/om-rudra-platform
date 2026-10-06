// Run with @napi-rs/canvas available through NODE_PATH or installed locally.
// Exports the approved vector artwork; never resizes the generated raster concept.
const fs = require('node:fs');
const path = require('node:path');
const { createCanvas, Path2D, GlobalFonts } = require('@napi-rs/canvas');
const root = path.resolve(__dirname, '../..');
const out = path.join(__dirname, 'exports');
fs.mkdirSync(out, { recursive: true });
GlobalFonts.registerFromPath(path.join(__dirname, 'fonts/sora.woff2'), 'Sora');
GlobalFonts.registerFromPath(path.join(__dirname, 'fonts/inter.woff2'), 'Inter');
const master = fs.readFileSync(path.join(root, 'frontend/website/public/images/logo-horizontal-red-v1.svg'), 'utf8');
const geometry = master.match(/<g[^>]*>([\s\S]*?)<\/g>/)[1];
const paths = [...geometry.matchAll(/d="([^"]+)"/g)].map(m => new Path2D(m[1]));
function symbol(ctx, x, y, size, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(size / 128, size / 128);
  ctx.fillStyle = color; paths.forEach(p => ctx.fill(p)); ctx.restore();
}
function lockup(ctx, x, y, width, color, markColor = color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(width / 540, width / 540);
  symbol(ctx, 0, 0, 144, markColor);
  ctx.fillStyle = color; ctx.font = '700 48px Sora'; ctx.fillText('Om Rudra', 150, 72);
  ctx.font = '600 29px Inter'; ctx.fillText('Packers and Movers', 152, 111);
  ctx.restore();
}
function png(name, width, height, draw) {
  const canvas = createCanvas(width, height); draw(canvas.getContext('2d'));
  fs.writeFileSync(path.join(out, name), canvas.toBuffer('image/png'));
}
for (const [variant, color] of [['red', '#b51b35'], ['white', '#ffffff'], ['charcoal', '#141416']]) {
  fs.writeFileSync(path.join(out, `symbol-${variant}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><g fill="${color}">${geometry}</g></svg>`);
  for (const size of [16, 24, 32, 48, 64, 128, 180, 192, 256, 512, 1024]) {
    png(`symbol-${variant}-${size}.png`, size, size, ctx => symbol(ctx, 0, 0, size, color));
  }
  for (const width of [320, 640, 1080, 2160]) {
    png(`lockup-${variant}-${width}.png`, width, Math.round(width * 144 / 540), ctx => lockup(ctx, 0, 0, width, variant === 'red' ? '#141416' : color, color));
  }
}
for (const variant of ['horizontal', 'reverse']) {
  fs.copyFileSync(path.join(root, `frontend/website/public/images/logo-${variant}-red-v1.svg`), path.join(out, `lockup-${variant}.svg`));
}
for (const size of [192, 512, 1080]) {
  png(`avatar-${size}.png`, size, size, ctx => { ctx.fillStyle = '#b51b35'; ctx.fillRect(0, 0, size, size); symbol(ctx, size * .1, size * .1, size * .8, '#ffffff'); });
}
for (const size of [192, 512]) {
  png(`app-maskable-${size}.png`, size, size, ctx => { ctx.fillStyle = '#b51b35'; ctx.fillRect(0, 0, size, size); symbol(ctx, size * .2, size * .2, size * .6, '#ffffff'); });
}
png('apple-touch-icon.png', 180, 180, ctx => { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 180, 180); symbol(ctx, 9, 9, 162, '#b51b35'); });
png('social-share-1200x630.png', 1200, 630, ctx => { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 1200, 630); lockup(ctx, 140, 192, 920, '#141416', '#b51b35'); ctx.fillStyle = '#b51b35'; ctx.fillRect(0, 614, 1200, 16); });
// ICO directory with PNG payloads, preserving crisp native 16/32/48 px variants.
const sizes = [16, 32, 48]; const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = header.length; const payloads = sizes.map((size, i) => {
  const data = fs.readFileSync(path.join(out, `symbol-red-${size}.png`)); const pos = 6 + 16 * i;
  header[pos] = size; header[pos + 1] = size; header.writeUInt16LE(1, pos + 4); header.writeUInt16LE(32, pos + 6);
  header.writeUInt32LE(data.length, pos + 8); header.writeUInt32LE(offset, pos + 12); offset += data.length; return data;
});
fs.writeFileSync(path.join(out, 'favicon.ico'), Buffer.concat([header, ...payloads]));
const appAssets = ['symbol-red.svg', 'symbol-charcoal.svg', 'symbol-red-32.png', 'symbol-red-64.png', 'symbol-red-192.png', 'symbol-red-512.png', 'lockup-horizontal.svg', 'lockup-reverse.svg', 'lockup-red-1080.png', 'app-maskable-192.png', 'app-maskable-512.png', 'apple-touch-icon.png', 'social-share-1200x630.png'];
for (const app of ['website', 'admin-panel']) {
  const publicDir = path.join(root, `frontend/${app}/public`); const dest = path.join(publicDir, 'brand'); fs.mkdirSync(dest, { recursive: true });
  appAssets.forEach(name => fs.copyFileSync(path.join(out, name), path.join(dest, name)));
  fs.copyFileSync(path.join(out, 'favicon.ico'), path.join(publicDir, 'favicon.ico'));
  fs.copyFileSync(path.join(out, 'symbol-red.svg'), path.join(publicDir, 'favicon.svg'));
}
console.log(`Exported ${fs.readdirSync(out).length} logo files and synced both apps.`);
