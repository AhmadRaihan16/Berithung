const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const icon192 = path.join(rootDir, 'assets', 'icon-192.png');
const icon512 = path.join(rootDir, 'assets', 'icon-512.png');
const resDir = path.join(rootDir, 'android', 'app', 'src', 'main', 'res');

if (!fs.existsSync(resDir)) {
  console.log('android res dir not found yet');
  process.exit(0);
}

const mipmaps = [
  'mipmap-mdpi',
  'mipmap-hdpi',
  'mipmap-xhdpi',
  'mipmap-xxhdpi',
  'mipmap-xxxhdpi'
];

mipmaps.forEach(folder => {
  const targetDir = path.join(resDir, folder);
  if (fs.existsSync(targetDir)) {
    const iconSource = folder === 'mipmap-xxxhdpi' ? icon192 : icon192;
    fs.copyFileSync(iconSource, path.join(targetDir, 'ic_launcher.png'));
    fs.copyFileSync(iconSource, path.join(targetDir, 'ic_launcher_round.png'));
    fs.copyFileSync(iconSource, path.join(targetDir, 'ic_launcher_foreground.png'));
  }
});

console.log('✓ Android mipmap icons updated with Berithung logo.');
