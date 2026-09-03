const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'www');

// Clean & recreate www
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy index.html
const indexSrc = path.join(rootDir, 'index.html');
const indexDest = path.join(distDir, 'index.html');
if (fs.existsSync(indexSrc)) {
  fs.copyFileSync(indexSrc, indexDest);
}

// Copy manifest.json if exists
const manifestSrc = path.join(rootDir, 'manifest.json');
const manifestDest = path.join(distDir, 'manifest.json');
if (fs.existsSync(manifestSrc)) {
  fs.copyFileSync(manifestSrc, manifestDest);
}

// Copy assets recursively
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDirRecursive(path.join(rootDir, 'assets'), path.join(distDir, 'assets'));

console.log('✓ Build webDir "www" complete. Clean runtime files prepared.');
