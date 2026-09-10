const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, '..', 'assets', 'icons', 'ui');
const catDir = path.join(__dirname, '..', 'assets', 'icons', 'categories');
if (!fs.existsSync(uiDir)) fs.mkdirSync(uiDir, { recursive: true });
if (!fs.existsSync(catDir)) fs.mkdirSync(catDir, { recursive: true });

const svgs = {
  // UI SVGs
  'ui/analytics.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="20" x2="18" y2="10" />
  <line x1="12" y1="20" x2="12" y2="4" />
  <line x1="6" y1="20" x2="6" y2="14" />
  <path d="M3 20h18" />
</svg>`,

  'ui/daily-average.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="4" width="18" height="17" rx="3" />
  <line x1="16" y1="2" x2="16" y2="5" />
  <line x1="8" y1="2" x2="8" y2="5" />
  <line x1="3" y1="9" x2="21" y2="9" />
  <circle cx="12" cy="15" r="2" />
</svg>`,

  'ui/comparison.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 3v18" />
  <path d="M5 6h14" />
  <path d="M5 6l-3 6h6l-3-6z" />
  <path d="M19 6l-3 6h6l-3-6z" />
  <path d="M8 21h8" />
</svg>`,

  'ui/category.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="7" height="7" rx="1.5" />
  <rect x="14" y="3" width="7" height="7" rx="1.5" />
  <rect x="14" y="14" width="7" height="7" rx="1.5" />
  <rect x="3" y="14" width="7" height="7" rx="1.5" />
</svg>`,

  'ui/wishlist.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
</svg>`,

  'ui/budget.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="5" width="18" height="14" rx="3" />
  <path d="M3 10h18" />
  <circle cx="16" cy="14.5" r="1.5" />
</svg>`,

  'ui/trend-up.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
  <polyline points="17 6 23 6 23 12" />
</svg>`,

  'ui/trend-down.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
  <polyline points="17 18 23 18 23 12" />
</svg>`,

  'ui/alert.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
  <line x1="12" y1="9" x2="12" y2="13" />
  <circle cx="12" cy="17" r="1" fill="black" />
</svg>`,

  'ui/cooling.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 2h14M5 22h14" />
  <path d="M19 2v4a5 5 0 0 1-2 4l-3 2 3 2a5 5 0 0 1 2 4v4H5v-4a5 5 0 0 1 2-4l3-2-3-2a5 5 0 0 1-2-4V2z" />
</svg>`,

  'ui/check-circle.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="9" />
  <polyline points="8.5 12 11 14.5 16 9.5" />
</svg>`,

  'ui/x-circle.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="9" />
  <line x1="9" y1="9" x2="15" y2="15" />
  <line x1="15" y1="9" x2="9" y2="15" />
</svg>`,

  'ui/sun.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="4" />
  <line x1="12" y1="2" x2="12" y2="5" />
  <line x1="12" y1="19" x2="12" y2="22" />
  <line x1="2" y1="12" x2="5" y2="12" />
  <line x1="19" y1="12" x2="22" y2="12" />
  <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" />
  <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
  <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" />
  <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" />
</svg>`,

  'ui/moon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
</svg>`,

  // Category SVGs
  'categories/food.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 11a8 8 0 0 1 16 0H4z" />
  <path d="M4 14h16" />
  <rect x="5" y="17" width="14" height="3" rx="1.5" />
</svg>`,

  'categories/transport.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 16l1.5-6.5A2 2 0 0 1 8.5 8h7a2 2 0 0 1 2 1.5L19 16" />
  <rect x="3" y="14" width="18" height="4" rx="2" />
  <circle cx="7" cy="18" r="2" />
  <circle cx="17" cy="18" r="2" />
</svg>`,

  'categories/shopping.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
  <line x1="3" y1="6" x2="21" y2="6" />
  <path d="M16 10a4 4 0 0 1-8 0" />
</svg>`,

  'categories/entertainment.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="2" y="6" width="20" height="12" rx="6" />
  <line x1="6" y1="12" x2="10" y2="12" />
  <line x1="8" y1="10" x2="8" y2="14" />
  <circle cx="15" cy="12" r="1" fill="black" />
  <circle cx="18" cy="10" r="1" fill="black" />
</svg>`,

  'categories/bills.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 3h16v18l-3-2-3 2-2-2-2 2-3-2-3 2V3z" />
  <line x1="8" y1="8" x2="16" y2="8" />
  <line x1="8" y1="12" x2="16" y2="12" />
  <line x1="8" y1="16" x2="12" y2="16" />
</svg>`,

  'categories/education.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
</svg>`,

  'categories/health.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  <line x1="12" y1="8" x2="12" y2="14" stroke-width="2.5" />
  <line x1="9" y1="11" x2="15" y2="11" stroke-width="2.5" />
</svg>`,

  'categories/other.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
  <path d="m3.3 7 8.7 5 8.7-5" />
  <path d="M12 22V12" />
</svg>`
};

for (const [relPath, content] of Object.entries(svgs)) {
  const target = path.join(__dirname, '..', 'assets', 'icons', relPath);
  fs.writeFileSync(target, content.trim() + '\n', 'utf8');
  console.log('Created:', relPath);
}
console.log('All SVGs generated successfully.');
