import { readFileSync, writeFileSync, existsSync } from 'fs';
const DIR = new URL('./', import.meta.url).pathname;
let html = readFileSync(DIR + 'presentation.html', 'utf8');
let count = 0, missing = [];
html = html.replace(/\.\/captures\/([A-Za-z0-9_\-]+\.png)/g, (m, file) => {
  const p = DIR + 'captures/' + file;
  if (!existsSync(p)) { missing.push(file); return m; }
  const b64 = readFileSync(p).toString('base64');
  count++;
  return `data:image/png;base64,${b64}`;
});
writeFileSync(DIR + 'schooly-presentation.html', html);
console.log(`Images intégrées : ${count}`);
if (missing.length) console.log('Manquantes :', missing.join(', '));
