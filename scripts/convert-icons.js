const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const icons = [16, 32, 48, 128];
const srcDir = path.join(__dirname, '..', 'icons');

async function convert() {
  for (const size of icons) {
    const svgPath = path.join(srcDir, `icon-${size}.svg`);
    const outPath = path.join(srcDir, `icon-${size}.png`);
    if (!fs.existsSync(svgPath)) {
      console.warn('Missing', svgPath);
      continue;
    }
    console.log('Converting', svgPath, '→', outPath);
    try {
      await sharp(svgPath)
        .resize(size, size, { fit: 'contain' })
        .png({ quality: 90 })
        .toFile(outPath);
    } catch (err) {
      console.error('Failed to convert', svgPath, err);
    }
  }
}

convert().then(() => console.log('Done')).catch(err => console.error(err));
