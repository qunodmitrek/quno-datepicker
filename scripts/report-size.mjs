import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const artifacts = [
  ['Picker JavaScript', 'dist/quno-datepicker.js'],
  ['Picker CSS', 'dist/quno-datepicker.css'],
  ['Date input JavaScript', 'dist/date-input.js'],
  ['Date input CSS', 'dist/date-input.css'],
];

const format = (bytes) => `${(bytes / 1000).toFixed(2)} kB`;
let rawTotal = 0;
let gzipTotal = 0;

for (const [label, path] of artifacts) {
  const contents = await readFile(path);
  const gzipBytes = gzipSync(contents).byteLength;
  rawTotal += contents.byteLength;
  gzipTotal += gzipBytes;
  console.log(
    `${label.padEnd(10)} ${format(contents.byteLength).padStart(9)} raw  ${format(gzipBytes).padStart(9)} gzip`,
  );
}

console.log(
  `${'Total'.padEnd(10)} ${format(rawTotal).padStart(9)} raw  ${format(gzipTotal).padStart(9)} gzip`,
);
console.log('Preact is external and not included in these totals.');
