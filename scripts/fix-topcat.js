const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let raw = fs.readFileSync(filePath, 'utf8');
const isCRLF = raw.includes('\r\n');
let content = raw.replace(/\r\n/g, '\n');

// 1. Remove emoji from getCategoryBreakdown
content = content.replace(
  `        return {
          id: catId,
          label: catObj.label,
          emoji: catObj.emoji,
          amount: amount,
          pct: pct
        };`,
  `        return {
          id: catId,
          label: catObj.label,
          amount: amount,
          pct: pct
        };`
);

// 2. Fix topCatText in Analytics Pola Pengeluaran
content = content.replace(
  `var topCatText = topCat ? (topCat.emoji + ' ' + escapeHtml(topCat.label)) : '-';`,
  `var topCatText = topCat ? ('<span style="display:inline-flex; align-items:center; vertical-align:middle; margin-right:4px;">' + renderCategoryIconHtml(topCat.id, 16) + '</span>' + escapeHtml(topCat.label)) : '-';`
);

if (isCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed topCatText and getCategoryBreakdown.');
