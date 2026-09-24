import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const ignoredDirectories = new Set(['.git', '.npm-cache', 'node_modules', 'test-results']);
const textExtensions = new Set(['.cjs', '.css', '.html', '.js', '.jsx', '.json', '.md', '.mjs', '.svg', '.ts', '.tsx', '.txt']);

const detectors = [
  /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{16,}\b/g,
  /\b(?:OPENAI_API_KEY|VITE_[A-Z0-9_]*KEY)\s*[:=]\s*["']?[^\s"'`;},\]]{8,}/gi,
  /\bAuthorization\b.{0,40}\bBearer\s+[A-Za-z0-9._~-]{16,}/gi,
];

export function containsSecret(text) {
  return detectors.some(pattern => {
    pattern.lastIndex = 0;
    return pattern.test(text);
  });
}

function isTextFile(path) {
  const name = path.split(/[\\/]/).at(-1);
  return name.startsWith('.env') || textExtensions.has(extname(name).toLowerCase());
}

async function collectFiles(path, files) {
  let info;
  try {
    info = await stat(path);
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }

  if (info.isDirectory()) {
    if (ignoredDirectories.has(path.split(/[\\/]/).at(-1))) return;
    for (const entry of await readdir(path)) await collectFiles(resolve(path, entry), files);
    return;
  }

  if (isTextFile(path)) files.push(path);
}

async function main() {
  const inputs = process.argv.slice(2);
  const roots = inputs.length ? inputs.map(input => resolve(projectRoot, input)) : [projectRoot];
  const files = [];
  for (const root of roots) await collectFiles(root, files);

  const unsafeFiles = [];
  for (const file of files) {
    const content = await readFile(file, 'utf8');
    if (containsSecret(content)) unsafeFiles.push(relative(projectRoot, file));
  }

  if (unsafeFiles.length) {
    console.error(`Secret scan failed in ${unsafeFiles.length} file(s):`);
    for (const file of unsafeFiles) console.error(`- ${file}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Secret scan passed (${files.length} text files checked).`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) await main();
