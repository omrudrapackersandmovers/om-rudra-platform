// Run with @napi-rs/canvas available (installed locally or through NODE_PATH).
const fs = require('node:fs');
const path = require('node:path');
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const root = path.resolve(__dirname, '../..');
GlobalFonts.registerFromPath(path.join(__dirname, 'fonts/sora.woff2'), 'Sora');
GlobalFonts.registerFromPath(path.join(__dirname, 'fonts/inter.woff2'), 'Inter');
async function main() {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, 1200, 630);
  const photo = await loadImage(path.join(__dirname, 'social-preview/home-moving-source.png'));
  const h = photo.height, w = h * 520 / 630;
  ctx.drawImage(photo, (photo.width - w) / 2, 0, w, h, 680, 0, 520, 630);
  const logo = await loadImage(path.join(root, 'frontend/website/public/brand/lockup-horizontal.svg'));
  ctx.drawImage(logo, 56, 46, 390, 390 * logo.height / logo.width);
  ctx.fillStyle = '#B51B35'; ctx.font = '600 18px Inter';
  ctx.fillText('BASED IN PATNA', 56, 223);
  ctx.fillStyle = '#141416'; ctx.font = '700 53px Sora';
  ctx.fillText('Your next move,', 52, 300);
  ctx.fillText('planned with care.', 52, 368);
  ctx.fillStyle = '#5B5F6B'; ctx.font = '400 23px Inter';
  ctx.fillText('Home shifting · Office relocation', 56, 424);
  ctx.fillText('Packing · Vehicle transport', 56, 459);
  ctx.fillStyle = '#B51B35'; ctx.fillRect(56, 500, 255, 55);
  ctx.fillStyle = '#FFFFFF'; ctx.font = '600 21px Inter';
  ctx.fillText('Get a moving quote', 79, 535);
  ctx.fillStyle = '#5B5F6B'; ctx.font = '400 18px Inter';
  ctx.fillText('omrudrapackersandmovers.com', 56, 595);
  ctx.fillStyle = '#B51B35'; ctx.fillRect(0, 622, 1200, 8);
  const output = path.join(root, 'frontend/website/public/brand/social-preview-moving-v2.png');
  fs.writeFileSync(output, canvas.toBuffer('image/png'));
  console.log(output);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
