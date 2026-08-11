import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const extensions = new Set([
  '.cjs',
  '.css',
  '.js',
  '.jsx',
  '.mjs',
  '.scss',
  '.ts',
  '.tsx',
]);
const excludedDirectories = new Set([
  'coverage',
  'demo-dist',
  'dist',
  'node_modules',
]);
const limit = 200;

const filesIn = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (
      excludedDirectories.has(entry.name) ||
      (entry.isDirectory() && entry.name.startsWith('.'))
    ) {
      return [];
    }
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });

const countCodeLines = (source) => {
  let inBlockComment = false;
  return source.split(/\r?\n/).reduce((count, line) => {
    let code = '';
    for (let index = 0; index < line.length; index += 1) {
      const pair = line.slice(index, index + 2);
      if (inBlockComment) {
        if (pair === '*/') {
          inBlockComment = false;
          index += 1;
        }
      } else if (pair === '/*') {
        inBlockComment = true;
        index += 1;
      } else if (pair === '//') {
        break;
      } else {
        code += line[index];
      }
    }
    return code.trim() ? count + 1 : count;
  }, 0);
};

const oversized = filesIn(root)
  .filter((file) => extensions.has(extname(file)))
  .map((file) => ({ file, lines: countCodeLines(readFileSync(file, 'utf8')) }))
  .filter(({ lines }) => lines > limit);

if (oversized.length) {
  for (const { file, lines } of oversized) {
    console.error(`${file.slice(root.length + 1)}: ${lines} code lines`);
  }
  process.exitCode = 1;
} else {
  console.log(`All hand-written code files are within ${limit} code lines.`);
}
