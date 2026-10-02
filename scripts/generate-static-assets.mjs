import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LOGO = resolve(root, 'src/assets/images/truth_foundation_logo_1785562616008.jpg');
const HERO = resolve(root, 'src/assets/images/hero_child_longing_meal.jpg');
const OUT = resolve(root, 'public');

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const done = (name) => (info) => console.log(`${name}  ${kb(info.size)}`);

async function favicons() {
  await Promise.all(
    [16, 32, 48].map((size) =>
      sharp(LOGO)
        .resize(size, size)
        .png({ compressionLevel: 9, palette: true })
        .toFile(resolve(OUT, `favicon-${size}.png`))
        .then(done(`favicon-${size}.png`))
    )
  );

  await sharp(LOGO).resize(180, 180).png({ compressionLevel: 9 })
    .toFile(resolve(OUT, 'apple-touch-icon.png'))
    .then(done('apple-touch-icon.png'));

  await sharp(LOGO).resize(256, 256).png({ compressionLevel: 9 })
    .toFile(resolve(OUT, 'logo-256.png'))
    .then(done('logo-256.png'));
}

async function ogImage() {
  const W = 1200;
  const H = 630;
  const BADGE = 140;
  const PAD = 40;

  const svg = (w, h, body) => Buffer.from(`<svg width="${w}" height="${h}">${body}</svg>`);

  const circle = svg(BADGE, BADGE, `<circle cx="${BADGE / 2}" cy="${BADGE / 2}" r="${BADGE / 2}" fill="#fff"/>`);
  const ring = svg(
    BADGE + 12,
    BADGE + 12,
    `<circle cx="${(BADGE + 12) / 2}" cy="${(BADGE + 12) / 2}" r="${(BADGE + 12) / 2 - 3}" fill="none" stroke="#da8a24" stroke-width="6"/>`
  );
  const shade = svg(
    W,
    H,
    `<defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#0a2240" stop-opacity="0.75"/><stop offset="0.5" stop-color="#0a2240" stop-opacity="0"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/>`
  );

  const badge = await sharp(LOGO)
    .resize(BADGE, BADGE)
    .composite([{ input: circle, blend: 'dest-in' }])
    .png()
    .toBuffer();

  await sharp(HERO)
    .resize(W, H, { fit: 'cover', position: 'attention' })
    .composite([
      { input: shade, top: 0, left: 0 },
      { input: ring, top: H - PAD - BADGE - 6, left: PAD - 6 },
      { input: badge, top: H - PAD - BADGE, left: PAD },
    ])
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toFile(resolve(OUT, 'og-image.jpg'))
    .then(done('og-image.jpg'));
}

await mkdir(OUT, { recursive: true });
await favicons();
await ogImage();
