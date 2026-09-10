const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');
const emojiRegex = /(\p{Extended_Pictographic}|\p{Emoji_Presentation})/gu;

const list = [];
lines.forEach((l, idx) => {
  const m = l.match(emojiRegex);
  if (m) {
    list.push({ line: idx + 1, emojis: Array.from(new Set(m)).join(' '), text: l.trim() });
  }
});

const outPath = path.join(__dirname, 'audit_emojis.json');
fs.writeFileSync(outPath, JSON.stringify(list, null, 2));
console.log('Audited ' + list.length + ' lines with emojis.');
