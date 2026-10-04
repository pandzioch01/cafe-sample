import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const source = process.argv[2];
if (!source) throw new Error('Usage: node scripts/prepare-images.mjs <download-directory>');

// Original files downloaded from the photo pages listed in docs/IMAGE_CREDITS.md.
const files = {
  hero: 'pexels-alohaphotostudio-13689951.jpg',
  coffee: 'photo-1611564494260-6f21b80af7ea.jpg',
  cake: 'pexels-geraud-pfeiffer-6607317.jpg',
  interior: 'pexels-dcope-39894914.jpg',
  croissant: 'pexels-szymon-shields-1503561-35974896.jpg',
  matcha: 'photo-1717603545758-88cc454db69b.jpg',
};
await mkdir('public/images', { recursive: true });
const manifest = {};
for (const [name, file] of Object.entries(files)) {
  const landscape = name === 'hero' || name === 'interior';
  manifest[name] = {};
  for (const [size, width] of [['large', 1440], ['small', 640]]) {
    const height = landscape ? Math.round(width * 2 / 3) : width;
    const result = await sharp(path.join(source, file))
      .rotate()
      .resize(width, height, { fit: 'cover', position: 'centre' })
      .webp({ quality: 84, effort: 6 })
      .toFile(`public/images/${name}-${size}.webp`);
    manifest[name][size] = { width: result.width, height: result.height, bytes: result.size };
  }
}
await writeFile('docs/image-manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
console.log(manifest);
