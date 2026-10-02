const sharp = require('sharp');
const fs = require('fs');

async function processImage() {
  const input = 'src/assets/images/truth_foundation_logo_1785562616008.jpg';
  
  // Trim the whitespace
  const cropped = await sharp(input)
    .trim({
      background: { r: 255, g: 255, b: 255, alpha: 1 },
      threshold: 15,
    })
    .toBuffer();

  const metadata = await sharp(cropped).metadata();
  console.log("Trimmed size:", metadata.width, metadata.height);

  const size = Math.min(metadata.width, metadata.height);
  
  const circleSvg = `<svg width="${size}" height="${size}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
  </svg>`;

  const finalBuffer = await sharp(cropped)
    .resize(size, size, { fit: 'cover' })
    .composite([{
      input: Buffer.from(circleSvg),
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  // Save the favicons
  await sharp(finalBuffer).resize(16, 16).toFile('public/favicon-16.png');
  await sharp(finalBuffer).resize(32, 32).toFile('public/favicon-32.png');
  await sharp(finalBuffer).resize(48, 48).toFile('public/favicon-48.png');
  await sharp(finalBuffer).resize(180, 180).toFile('public/apple-touch-icon.png');
  await sharp(finalBuffer).resize(256, 256).toFile('public/logo-256.png');
  
  console.log("Done generating favicons");
}
processImage().catch(console.error);
