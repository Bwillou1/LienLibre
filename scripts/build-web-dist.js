const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'web-dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const filesToCopy = [
  'index.html',
  'badge.html',
  'alertes.html',
  'credits.html',
  'remerciements.html',
  'liseuse.html',
  'lite.html',
  'policies.html',
  'politiques.html',
  'favicon.svg',
  'icon.svg',
  'og-image.png',
  'og-image.svg',
  'manifest.json',
  'sw.js',
  'worker.js',
  'whitelist.js',
  'blocklist.js'
];

const dirsToCopy = [
  'js',
  'extension'
];

for (const file of filesToCopy) {
  const src = path.join(rootDir, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

for (const dir of dirsToCopy) {
  const src = path.join(rootDir, dir);
  const dest = path.join(distDir, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
  }
}

// Aliases
if (fs.existsSync(path.join(distDir, 'liseuse.html'))) {
  fs.copyFileSync(path.join(distDir, 'liseuse.html'), path.join(distDir, 'ereader.html'));
}
if (fs.existsSync(path.join(distDir, 'index.html'))) {
  fs.copyFileSync(path.join(distDir, 'index.html'), path.join(distDir, 'viewer.html'));
  fs.copyFileSync(path.join(distDir, 'index.html'), path.join(distDir, 'offline.html'));
}

console.log('✅ web-dist built successfully for Tauri frontendDist');
