const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let raw = fs.readFileSync(filePath, 'utf8');
const isCRLF = raw.includes('\r\n');
let content = raw.replace(/\r\n/g, '\n');

// Replace EXPENSE_CATEGORIES
const oldCats = `    const EXPENSE_CATEGORIES = [
      { id: 'Makanan', label: 'Makanan', emoji: '🍔' },
      { id: 'Transportasi', label: 'Transportasi', emoji: '🚗' },
      { id: 'Belanja', label: 'Belanja', emoji: '🛍️' },
      { id: 'Hiburan', label: 'Hiburan', emoji: '🎮' },
      { id: 'Tagihan', label: 'Tagihan', emoji: '📱' },
      { id: 'Pendidikan', label: 'Pendidikan', emoji: '📚' },
      { id: 'Kesehatan', label: 'Kesehatan', emoji: '❤️' },
      { id: 'Lainnya', label: 'Lainnya', emoji: '📦' }
    ];`;

const newCats = `    const EXPENSE_CATEGORIES = [
      { id: 'Makanan', label: 'Makanan', key: 'food' },
      { id: 'Transportasi', label: 'Transportasi', key: 'transport' },
      { id: 'Belanja', label: 'Belanja', key: 'shopping' },
      { id: 'Hiburan', label: 'Hiburan', key: 'entertainment' },
      { id: 'Tagihan', label: 'Tagihan', key: 'bills' },
      { id: 'Pendidikan', label: 'Pendidikan', key: 'education' },
      { id: 'Kesehatan', label: 'Kesehatan', key: 'health' },
      { id: 'Lainnya', label: 'Lainnya', key: 'other' }
    ];`;

if (content.includes(oldCats)) {
  content = content.replace(oldCats, newCats);
  console.log('Successfully replaced EXPENSE_CATEGORIES');
} else {
  console.log('Still could not find oldCats');
}

// Replace compIcon
const oldComp = `      // 2. PERBANDINGAN BULAN
      var compIcon = comp.direction === 'up' ? '📈' : (comp.direction === 'down' ? '📉' : '⚖️');
      var compSub = comp.hasComparison
        ? '<div class="muted" style="font-size:12px; margin-top:4px;">' + formatMonthYear(ym) + ' (' + formatRupiah(comp.curTotal) + ') vs ' + formatMonthYear(comp.prevYM) + ' (' + formatRupiah(comp.prevTotal) + ')</div>'
        : '';
      html += '<div class="card" style="margin-bottom:12px;">' +
        '<div style="display:flex; align-items:flex-start; gap:10px;">' +
          '<span style="font-size:22px;">' + compIcon + '</span>' +`;

const newComp = `      // 2. PERBANDINGAN BULAN
      var compIconKey = comp.direction === 'up' ? 'trendUp' : (comp.direction === 'down' ? 'trendDown' : 'comparison');
      var compSub = comp.hasComparison
        ? '<div class="muted" style="font-size:12px; margin-top:4px;">' + formatMonthYear(ym) + ' (' + formatRupiah(comp.curTotal) + ') vs ' + formatMonthYear(comp.prevYM) + ' (' + formatRupiah(comp.prevTotal) + ')</div>'
        : '';
      html += '<div class="card" style="margin-bottom:12px;">' +
        '<div style="display:flex; align-items:flex-start; gap:10px;">' +
          '<span style="display:flex; align-items:center; justify-content:center; flex-shrink:0;">' + renderUiIconHtml(compIconKey, 24) + '</span>' +`;

if (content.includes(oldComp)) {
  content = content.replace(oldComp, newComp);
  console.log('Successfully replaced oldComp');
} else {
  console.log('Still could not find oldComp');
}

if (isCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Saved with proper line endings.');
