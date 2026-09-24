import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const source = process.argv[2];
if (!source) throw new Error('Usage: node scripts/prepare-images.mjs <generated-image-directory>');
const files = {
  hero: 'exec-9c427497-df11-445d-bda8-dd3638ed7d93.png',
  coffee: 'exec-15370d4e-7ba9-4afa-aca1-acdbe68260b5.png',
  cake: 'exec-58deca7a-2eff-480f-8c7e-044498561f72.png',
  interior: 'exec-b99c79b3-a89f-469e-a95f-0d26540f8a5e.png',
  croissant: 'exec-9fa06105-b65a-4d8f-a0cc-6dce84493783.png',
  matcha: 'exec-e2a8b7ef-01b9-4f21-960c-95da7a72b321.png',
};
await mkdir('public/images', { recursive: true });
const manifest = {};
for (const [name, file] of Object.entries(files)) {
  manifest[name] = {};
  for (const [size, width] of [['large', 1440], ['small', 640]]) {
    const result = await sharp(path.join(source, file)).resize({ width }).webp({ quality: 84, effort: 6 }).toFile(`public/images/${name}-${size}.webp`);
    manifest[name][size] = { width: result.width, height: result.height, bytes: result.size };
  }
}
await writeFile('docs/image-manifest.json', JSON.stringify(manifest, null, 2));
console.log(manifest);
