const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add CSS rules for .ui-icon-mask, .category-icon-mask, and .category-select-wrap
const cssAnchor = `.goal-icon-mask {`;
const newCss = `.ui-icon-mask,
    .category-icon-mask {
      display: inline-block;
      width: 20px;
      height: 20px;
      background-color: currentColor;
      -webkit-mask-repeat: no-repeat;
      -webkit-mask-position: center;
      -webkit-mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
      mask-size: contain;
      vertical-align: middle;
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    .category-select-wrap {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .category-select-wrap select {
      width: 100%;
      padding-left: 40px !important;
      margin-bottom: 0 !important;
    }
    .category-select-preview {
      position: absolute;
      left: 12px;
      width: 20px;
      height: 20px;
      pointer-events: none;
      z-index: 2;
      color: var(--text);
    }
    .goal-icon-mask {`;

content = content.replace(cssAnchor, newCss);

// 2. Update modeToggle in HTML
content = content.replace(
  '<div class="pill" id="modeToggle" title="Ganti Tema">🌙</div>',
  '<div class="pill" id="modeToggle" title="Ganti Tema"><span id="modeToggleIcon" class="ui-icon-mask" style="width:16px;height:16px;-webkit-mask-image:url(\'assets/icons/ui/moon.svg\');mask-image:url(\'assets/icons/ui/moon.svg\');" aria-hidden="true"></span></div>'
);

// 3. Update Beranda shortcut cards
content = content.replace(
  '<span style="font-size:22px;">🧠</span>',
  '<span class="ui-icon-mask" style="width:24px;height:24px;color:var(--accent-3);-webkit-mask-image:url(\'assets/icons/ui/should-buy.svg\');mask-image:url(\'assets/icons/ui/should-buy.svg\');" aria-hidden="true"></span>'
);
content = content.replace(
  '<span style="font-size:22px;">💝</span>',
  '<span class="ui-icon-mask" style="width:24px;height:24px;color:var(--accent);-webkit-mask-image:url(\'assets/icons/ui/wishlist.svg\');mask-image:url(\'assets/icons/ui/wishlist.svg\');" aria-hidden="true"></span>'
);
content = content.replace(
  '<span style="font-size:22px;">📊</span>',
  '<span class="ui-icon-mask" style="width:24px;height:24px;color:#8b5cf6;-webkit-mask-image:url(\'assets/icons/ui/analytics.svg\');mask-image:url(\'assets/icons/ui/analytics.svg\');" aria-hidden="true"></span>'
);

// 4. Update Backup & Restore buttons
content = content.replace(
  '<button class="btn-secondary" id="btnExport">⬇️ Download Backup</button>',
  '<button class="btn-secondary" id="btnExport">Download Backup</button>'
);
content = content.replace(
  '<button class="btn-primary" id="btnImport">⬆️ Restore Backup</button>',
  '<button class="btn-primary" id="btnImport">Restore Backup</button>'
);

// 5. Update Wishlist buttons & headers
content = content.replace(
  '<button class="btn-secondary" id="btnSaveToWishlist">💝 Simpan ke Wishlist</button>',
  '<button class="btn-secondary" id="btnSaveToWishlist">Simpan ke Wishlist</button>'
);
content = content.replace(
  '<div style="font-weight:700; font-size:18px;">💝 Wishlist</div>',
  '<div style="font-weight:700; font-size:18px; display:flex; align-items:center; gap:6px;"><span class="ui-icon-mask" style="width:20px;height:20px;-webkit-mask-image:url(\'assets/icons/ui/wishlist.svg\');mask-image:url(\'assets/icons/ui/wishlist.svg\');" aria-hidden="true"></span>Wishlist</div>'
);

// 6. Update Budget & Analytics headers
content = content.replace(
  '<div style="font-weight:700; font-size:18px;">📊 Budget Bulanan</div>',
  '<div style="font-weight:700; font-size:18px; display:flex; align-items:center; gap:6px;"><span class="ui-icon-mask" style="width:20px;height:20px;-webkit-mask-image:url(\'assets/icons/ui/budget.svg\');mask-image:url(\'assets/icons/ui/budget.svg\');" aria-hidden="true"></span>Budget Bulanan</div>'
);
content = content.replace(
  '<button type="button" class="btn-tertiary small-btn" id="btnPrevMonth" style="padding:6px 12px; min-height:36px;">◀</button>',
  '<button type="button" class="btn-tertiary small-btn" id="btnPrevMonth" style="padding:6px 12px; min-height:36px;">←</button>'
);
content = content.replace(
  '<button type="button" class="btn-tertiary small-btn" id="btnNextMonth" style="padding:6px 12px; min-height:36px;">▶</button>',
  '<button type="button" class="btn-tertiary small-btn" id="btnNextMonth" style="padding:6px 12px; min-height:36px;">→</button>'
);
content = content.replace(
  '<div style="font-weight:700; font-size:18px;">📊 Analytics & Insights</div>',
  '<div style="font-weight:700; font-size:18px; display:flex; align-items:center; gap:6px;"><span class="ui-icon-mask" style="width:20px;height:20px;-webkit-mask-image:url(\'assets/icons/ui/analytics.svg\');mask-image:url(\'assets/icons/ui/analytics.svg\');" aria-hidden="true"></span>Analytics & Insights</div>'
);

// 7. Update Cooling modal header & button
content = content.replace(
  '<div style="font-weight:700; font-size:16px;">⏳ Cooling Period</div>',
  '<div style="font-weight:700; font-size:16px; display:flex; align-items:center; gap:6px;"><span class="ui-icon-mask" style="width:18px;height:18px;-webkit-mask-image:url(\'assets/icons/ui/cooling.svg\');mask-image:url(\'assets/icons/ui/cooling.svg\');" aria-hidden="true"></span>Cooling Period</div>'
);
content = content.replace(
  '<button class="btn-secondary" id="btnCoolingSave">💝 Simpan ke Wishlist</button>',
  '<button class="btn-secondary" id="btnCoolingSave">Simpan ke Wishlist</button>'
);

// 8. Update Wishlist bought success icon & confirm modal icon
content = content.replace(
  '<div style="font-size:40px; margin-bottom:8px;">🛍️</div>',
  '<div style="margin-bottom:8px; display:flex; justify-content:center;"><span class="category-icon-mask" style="width:40px;height:40px;color:var(--accent);-webkit-mask-image:url(\'assets/icons/categories/shopping.svg\');mask-image:url(\'assets/icons/categories/shopping.svg\');" aria-hidden="true"></span></div>'
);
content = content.replace(
  '<div id="confirmModalIcon" style="width:48px; height:48px; border-radius:50%; background:var(--badge-red-bg); color:var(--danger); display:flex; align-items:center; justify-content:center; margin:0 auto 12px; font-size:24px;">⚠️</div>',
  '<div id="confirmModalIcon" style="width:48px; height:48px; border-radius:50%; background:var(--badge-red-bg); color:var(--danger); display:flex; align-items:center; justify-content:center; margin:0 auto 12px;"><span class="ui-icon-mask" style="width:24px;height:24px;-webkit-mask-image:url(\'assets/icons/ui/alert.svg\');mask-image:url(\'assets/icons/ui/alert.svg\');" aria-hidden="true"></span></div>'
);

// 9. Update selectExpenseCategory in expenseModal (Option B)
content = content.replace(
  '<select id="selectExpenseCategory" style="margin-bottom:10px;"></select>',
  `<div class="category-select-wrap">
        <span id="expenseCategoryIconPreview" class="category-icon-mask category-select-preview" aria-hidden="true"></span>
        <select id="selectExpenseCategory"></select>
      </div>`
);
content = content.replace(
  '<button type="button" class="btn-danger" id="btnExpenseModalDelete">🗑️ Hapus Pengeluaran</button>',
  '<button type="button" class="btn-danger" id="btnExpenseModalDelete">Hapus Pengeluaran</button>'
);

// 10. Inject UI_ICONS, CATEGORY_ICONS, CATEGORY_MAP and helpers right after GOAL_ICONS
const goalIconsEnd = `    function renderGoalIconHtml(val, size, extraStyle) {
      const key = getCanonicalGoalKey(val);
      const src = GOAL_ICONS[key] || GOAL_ICONS.money;
      const px = size || 24;
      const style = \`width:\${px}px;height:\${px}px;-webkit-mask-image:url('\${src}');mask-image:url('\${src}');\${extraStyle || ''}\`;
      return \`<span class="goal-icon-mask" style="\${style}" role="img" aria-label="\${key}"></span>\`;
    }`;

const newRegistries = `    function renderGoalIconHtml(val, size, extraStyle) {
      const key = getCanonicalGoalKey(val);
      const src = GOAL_ICONS[key] || GOAL_ICONS.money;
      const px = size || 24;
      const style = \`width:\${px}px;height:\${px}px;-webkit-mask-image:url('\${src}');mask-image:url('\${src}');\${extraStyle || ''}\`;
      return \`<span class="goal-icon-mask" style="\${style}" role="img" aria-label="\${key}"></span>\`;
    }

    const UI_ICONS = {
      shouldBuy: 'assets/icons/ui/should-buy.svg',
      analytics: 'assets/icons/ui/analytics.svg',
      dailyAverage: 'assets/icons/ui/daily-average.svg',
      comparison: 'assets/icons/ui/comparison.svg',
      category: 'assets/icons/ui/category.svg',
      wishlist: 'assets/icons/ui/wishlist.svg',
      budget: 'assets/icons/ui/budget.svg',
      trendUp: 'assets/icons/ui/trend-up.svg',
      trendDown: 'assets/icons/ui/trend-down.svg',
      alert: 'assets/icons/ui/alert.svg',
      cooling: 'assets/icons/ui/cooling.svg',
      checkCircle: 'assets/icons/ui/check-circle.svg',
      xCircle: 'assets/icons/ui/x-circle.svg',
      sun: 'assets/icons/ui/sun.svg',
      moon: 'assets/icons/ui/moon.svg'
    };

    const CATEGORY_ICONS = {
      food: 'assets/icons/categories/food.svg',
      transport: 'assets/icons/categories/transport.svg',
      shopping: 'assets/icons/categories/shopping.svg',
      entertainment: 'assets/icons/categories/entertainment.svg',
      bills: 'assets/icons/categories/bills.svg',
      education: 'assets/icons/categories/education.svg',
      health: 'assets/icons/categories/health.svg',
      other: 'assets/icons/categories/other.svg'
    };

    const CATEGORY_MAP = {
      'makanan': 'food',
      'food': 'food',
      'transportasi': 'transport',
      'transport': 'transport',
      'belanja': 'shopping',
      'shopping': 'shopping',
      'hiburan': 'entertainment',
      'entertainment': 'entertainment',
      'tagihan': 'bills',
      'bills': 'bills',
      'pendidikan': 'education',
      'education': 'education',
      'kesehatan': 'health',
      'health': 'health',
      'lainnya': 'other',
      'other': 'other'
    };

    function getCategoryKey(val) {
      if (!val) return 'other';
      const clean = String(val).trim().toLowerCase();
      return CATEGORY_MAP[clean] || (CATEGORY_ICONS[clean] ? clean : 'other');
    }

    function renderCategoryIconHtml(val, size, extraStyle) {
      const key = getCategoryKey(val);
      const src = CATEGORY_ICONS[key] || CATEGORY_ICONS.other;
      const px = size || 20;
      const style = \`width:\${px}px;height:\${px}px;-webkit-mask-image:url('\${src}');mask-image:url('\${src}');\${extraStyle || ''}\`;
      return \`<span class="category-icon-mask" style="\${style}" role="img" aria-hidden="true"></span>\`;
    }

    function renderUiIconHtml(val, size, extraStyle) {
      const src = UI_ICONS[val] || UI_ICONS.category;
      const px = size || 20;
      const style = \`width:\${px}px;height:\${px}px;-webkit-mask-image:url('\${src}');mask-image:url('\${src}');\${extraStyle || ''}\`;
      return \`<span class="ui-icon-mask" style="\${style}" role="img" aria-hidden="true"></span>\`;
    }`;

content = content.replace(goalIconsEnd, newRegistries);

// 11. Update applyTheme modeToggle
content = content.replace(
  `if (modeToggle) modeToggle.textContent = shouldDark ? '☀️' : '🌙';`,
  `if (modeToggle) {
        const toggleIcon = document.getElementById('modeToggleIcon');
        if (toggleIcon) {
          const iconSrc = shouldDark ? 'assets/icons/ui/sun.svg' : 'assets/icons/ui/moon.svg';
          toggleIcon.style.webkitMaskImage = "url('" + iconSrc + "')";
          toggleIcon.style.maskImage = "url('" + iconSrc + "')";
        }
      }`
);

// 12. Update badge Target Tercapai in renderGoalCard
content = content.replace(
  `meta = \`<div class="badge">✅ Target Tercapai</div>`,
  `meta = \`<div class="badge">\${renderUiIconHtml('checkCircle', 12, 'margin-right:4px;')}Target Tercapai</div>`
);

// 13. Update empty celengan illustrations (lines 1246, 1264)
content = content.replace(
  `<div class="empty-illustration">🐷</div>`,
  `<div class="empty-illustration"><span style="display:inline-block; width:40px; height:40px; background-color:currentColor; -webkit-mask:url('assets/icons/celengan.png') no-repeat center/contain; mask:url('assets/icons/celengan.png') no-repeat center/contain; opacity:0.6;" aria-hidden="true"></span></div>`
);
content = content.replace(
  `<div class="empty-illustration">🐷</div>`,
  `<div class="empty-illustration"><span style="display:inline-block; width:40px; height:40px; background-color:currentColor; -webkit-mask:url('assets/icons/celengan.png') no-repeat center/contain; mask:url('assets/icons/celengan.png') no-repeat center/contain; opacity:0.6;" aria-hidden="true"></span></div>`
);

// 14. Update EXPENSE_CATEGORIES array
const oldExpCats = `    const EXPENSE_CATEGORIES = [
      { id: 'Makanan', label: 'Makanan', emoji: '🍔' },
      { id: 'Transportasi', label: 'Transportasi', emoji: '🚗' },
      { id: 'Belanja', label: 'Belanja', emoji: '🛍️' },
      { id: 'Hiburan', label: 'Hiburan', emoji: '🎮' },
      { id: 'Tagihan', label: 'Tagihan', emoji: '📱' },
      { id: 'Pendidikan', label: 'Pendidikan', emoji: '📚' },
      { id: 'Kesehatan', label: 'Kesehatan', emoji: '❤️' },
      { id: 'Lainnya', label: 'Lainnya', emoji: '📦' }
    ];`;

const newExpCats = `    const EXPENSE_CATEGORIES = [
      { id: 'Makanan', label: 'Makanan', key: 'food' },
      { id: 'Transportasi', label: 'Transportasi', key: 'transport' },
      { id: 'Belanja', label: 'Belanja', key: 'shopping' },
      { id: 'Hiburan', label: 'Hiburan', key: 'entertainment' },
      { id: 'Tagihan', label: 'Tagihan', key: 'bills' },
      { id: 'Pendidikan', label: 'Pendidikan', key: 'education' },
      { id: 'Kesehatan', label: 'Kesehatan', key: 'health' },
      { id: 'Lainnya', label: 'Lainnya', key: 'other' }
    ];`;
content = content.replace(oldExpCats, newExpCats);

// 15. Update overWarn text
content = content.replace(
  `overWarn.textContent = '⚠️ Melebihi budget ' + formatRupiah(summary.overAmount);`,
  `overWarn.innerHTML = renderUiIconHtml('alert', 14, 'margin-right:4px;') + 'Melebihi budget ' + formatRupiah(summary.overAmount);`
);

// 16. Update btnCopyPrevBudget text
content = content.replace(
  `? '<button type="button" class="btn-tertiary" id="btnCopyPrevBudget" style="margin-top:8px;">📋 Gunakan budget ' + formatMonthYear(prevYM) + ' (' + formatRupiah(prevBudget) + ')</button>'`,
  `? '<button type="button" class="btn-tertiary" id="btnCopyPrevBudget" style="margin-top:8px;">Gunakan budget ' + formatMonthYear(prevYM) + ' (' + formatRupiah(prevBudget) + ')</button>'`
);

// 17. Update empty budget month illustration
content = content.replace(
  `'<div style="font-size:36px; margin-bottom:6px;">📅</div>' +`,
  `'<div style="margin-bottom:8px; display:flex; justify-content:center;"><span class="ui-icon-mask" style="width:36px;height:36px;opacity:0.6;-webkit-mask-image:url(\\'assets/icons/ui/daily-average.svg\\');mask-image:url(\\'assets/icons/ui/daily-average.svg\\');" aria-hidden="true"></span></div>' +`
);

// 18. Update over-budget-card in budget
content = content.replace(
  `? '<div class="over-budget-card">⚠️ <strong>OVER BUDGET!</strong> Melebihi budget ' + formatRupiah(summary.overAmount) + '</div>'`,
  `? '<div class="over-budget-card">' + renderUiIconHtml('alert', 16, 'margin-right:6px;') + '<strong>OVER BUDGET!</strong> Melebihi budget ' + formatRupiah(summary.overAmount) + '</div>'`
);

// 19. Update renderCategoryFilters
content = content.replace(
  `html += '<button type="button" class="cat-filter-btn ' + active + '" data-cat="' + escapeHtml(c.id) + '">' + c.emoji + ' ' + escapeHtml(c.label) + '</button>';`,
  `html += '<button type="button" class="cat-filter-btn ' + active + '" data-cat="' + escapeHtml(c.id) + '">' + renderCategoryIconHtml(c.id, 16, 'margin-right:6px;') + escapeHtml(c.label) + '</button>';`
);

// 20. Update renderCategorySummary
content = content.replace(
  `var catObj = EXPENSE_CATEGORIES.find(function(c) { return c.id === item.category; }) || { emoji: '📦', label: item.category };`,
  `var catObj = EXPENSE_CATEGORIES.find(function(c) { return c.id === item.category; }) || { id: item.category, label: item.category };`
);
content = content.replace(
  `'<span style="font-size:18px;">' + catObj.emoji + '</span>' +`,
  `renderCategoryIconHtml(catObj.id, 20) +`
);

// 21. Update renderExpenseList
content = content.replace(
  `var catObj = EXPENSE_CATEGORIES.find(function(c) { return c.id === e.category; }) || { emoji: '📦', label: e.category };`,
  `var catObj = EXPENSE_CATEGORIES.find(function(c) { return c.id === e.category; }) || { id: e.category, label: e.category };`
);
content = content.replace(
  `'<span style="font-size:24px;">' + catObj.emoji + '</span>' +`,
  `renderCategoryIconHtml(catObj.id, 24) +`
);

// 22. Update openExpenseModal (Option B dropdown with preview)
const oldModalCatCode = `      catSelect.innerHTML = EXPENSE_CATEGORIES.map(function(c) {
        return '<option value="' + escapeHtml(c.id) + '">' + c.emoji + ' ' + escapeHtml(c.label) + '</option>';
      }).join('');`;

const newModalCatCode = `      catSelect.innerHTML = EXPENSE_CATEGORIES.map(function(c) {
        return '<option value="' + escapeHtml(c.id) + '">' + escapeHtml(c.label) + '</option>';
      }).join('');
      
      function updateCatPreview() {
        var preview = document.getElementById('expenseCategoryIconPreview');
        if (preview) {
          var k = getCategoryKey(catSelect.value);
          var src = CATEGORY_ICONS[k] || CATEGORY_ICONS.other;
          preview.style.webkitMaskImage = "url('" + src + "')";
          preview.style.maskImage = "url('" + src + "')";
        }
      }
      catSelect.onchange = updateCatPreview;`;

content = content.replace(oldModalCatCode, newModalCatCode);

// Also after setting catSelect.value in edit and new mode: call updateCatPreview()
content = content.replace(
  `catSelect.value = exp.category || 'Makanan';`,
  `catSelect.value = exp.category || 'Makanan';\n          updateCatPreview();`
);
content = content.replace(
  `catSelect.value = 'Makanan';\n        document.getElementById('inputExpenseDate').value = getLocalDateISO();`,
  `catSelect.value = 'Makanan';\n        updateCatPreview();\n        document.getElementById('inputExpenseDate').value = getLocalDateISO();`
);

// 23. Update toast messages
content = content.replace(`showToast('Tersimpan ke Wishlist 💝');`, `showToast('Tersimpan ke Wishlist');`);
content = content.replace(`showToast('Ditandai sebagai dibeli 🛍️');`, `showToast('Ditandai sebagai dibeli');`);
content = content.replace(`showToast('Siap disimpan atau dibagikan 📦');`, `showToast('Siap disimpan atau dibagikan');`);

// 24. Update Wishlist badges (lines 2493-2504)
content = content.replace(
  `if (status === 'waiting') return '<span class="badge-blue">⏳ Cooling Period</span>';`,
  `if (status === 'waiting') return '<span class="badge-blue">' + renderUiIconHtml('cooling', 11, 'margin-right:4px;') + 'Cooling Period</span>';`
);
content = content.replace(
  `if (status === 'ready') return '<span class="badge">✅ Siap Diputuskan</span>';`,
  `if (status === 'ready') return '<span class="badge">' + renderUiIconHtml('checkCircle', 11, 'margin-right:4px;') + 'Siap Diputuskan</span>';`
);
content = content.replace(
  `if (status === 'bought') return '<span class="badge">🛍️ Dibeli</span>';`,
  `if (status === 'bought') return '<span class="badge">' + renderCategoryIconHtml('shopping', 11, 'margin-right:4px;') + 'Dibeli</span>';`
);
content = content.replace(
  `if (status === 'cancelled') return '<span class="badge-gray">❌ Dibatalkan</span>';`,
  `if (status === 'cancelled') return '<span class="badge-gray">' + renderUiIconHtml('xCircle', 11, 'margin-right:4px;') + 'Dibatalkan</span>';`
);
content = content.replace(
  `if (status === 'AMAN') return '<span class="badge">✅ AMAN</span>';`,
  `if (status === 'AMAN') return '<span class="badge">' + renderUiIconHtml('checkCircle', 11, 'margin-right:4px;') + 'AMAN</span>';`
);
content = content.replace(
  `if (status === 'PERLU DIPERTIMBANGKAN') return '<span class="badge-amber">⚠️ PERTIMBANGKAN</span>';`,
  `if (status === 'PERLU DIPERTIMBANGKAN') return '<span class="badge-amber">' + renderUiIconHtml('alert', 11, 'margin-right:4px;') + 'PERTIMBANGKAN</span>';`
);
content = content.replace(
  `if (status === 'SEBAIKNYA TUNDA') return '<span class="badge-red">🚫 TUNDA</span>';`,
  `if (status === 'SEBAIKNYA TUNDA') return '<span class="badge-red">' + renderUiIconHtml('xCircle', 11, 'margin-right:4px;') + 'TUNDA</span>';`
);
content = content.replace(
  `if (status === 'TIDAK CUKUP') return '<span class="badge-gray">⛔ TDK CUKUP</span>';`,
  `if (status === 'TIDAK CUKUP') return '<span class="badge-gray">' + renderUiIconHtml('alert', 11, 'margin-right:4px;') + 'TDK CUKUP</span>';`
);

// 25. Update Wishlist stats header
content = content.replace(
  `return '<div style="font-weight:700; margin-bottom:10px; font-size:14px;">📊 Statistik Bulan Ini</div>' +`,
  `return '<div style="font-weight:700; margin-bottom:10px; font-size:14px; display:flex; align-items:center; gap:6px;">' + renderUiIconHtml('analytics', 16) + 'Statistik Bulan Ini</div>' +`
);

// 26. Update empty wishlist illustration
content = content.replace(
  `<div class="empty"><div class="empty-illustration">💝</div><div>Belum ada barang di Wishlist.</div>`,
  `<div class="empty"><div class="empty-illustration"><span class="ui-icon-mask" style="width:36px;height:36px;opacity:0.6;-webkit-mask-image:url(\\'assets/icons/ui/wishlist.svg\\');mask-image:url(\\'assets/icons/ui/wishlist.svg\\');" aria-hidden="true"></span></div><div>Belum ada barang di Wishlist.</div>`
);

// 27. Update Wishlist section titles
content = content.replace(
  `html += '<div class="section-title" style="color:var(--accent-2); margin-top:0;">✅ Siap Diputuskan (' + ready.length + ')</div>';`,
  `html += '<div class="section-title" style="color:var(--accent-2); margin-top:0; display:flex; align-items:center; gap:6px;">' + renderUiIconHtml('checkCircle', 14) + 'Siap Diputuskan (' + ready.length + ')</div>';`
);
content = content.replace(
  `html += '<div class="section-title">⏳ Cooling Period (' + waiting.length + ')</div>';`,
  `html += '<div class="section-title" style="display:flex; align-items:center; gap:6px;">' + renderUiIconHtml('cooling', 14) + 'Cooling Period (' + waiting.length + ')</div>';`
);
content = content.replace(
  `html += '<div class="section-title">📋 Selesai (' + done.length + ')</div>';`,
  `html += '<div class="section-title">Selesai (' + done.length + ')</div>';`
);

// 28. Update Wishlist cards & detail
content = content.replace(
  `var reachedBadge = live.isReached ? ' <span class="badge" style="font-size:10px; padding:2px 6px;">🎯 Target tercapai</span>' : '';`,
  `var reachedBadge = live.isReached ? ' <span class="badge" style="font-size:10px; padding:2px 6px;">' + renderUiIconHtml('checkCircle', 10, 'margin-right:3px;') + 'Target tercapai</span>' : '';`
);
content = content.replace(
  `'<div class="muted" style="font-size:13px; padding:6px 0;">⚠️ Celengan tidak tersedia (sudah dihapus).</div>';`,
  `'<div class="muted" style="font-size:13px; padding:6px 0; display:flex; align-items:center; gap:6px;">' + renderUiIconHtml('alert', 14) + 'Celengan tidak tersedia (sudah dihapus).</div>';`
);
content = content.replace(
  `'<button type="button" class="btn-secondary" id="btnWishlistBuy">🛍️ Masih Ingin Beli</button>' +`,
  `'<button type="button" class="btn-secondary" id="btnWishlistBuy">Masih Ingin Beli</button>' +`
);
content = content.replace(
  `'<button type="button" class="btn-danger" id="btnWishlistCancel">❌ Batal Beli</button>' +`,
  `'<button type="button" class="btn-danger" id="btnWishlistCancel">Batal Beli</button>' +`
);
content = content.replace(
  `'<div style="margin-top:' + (isReady ? '8' : '12') + 'px;"><button type="button" class="btn-danger" id="btnWishlistDelete">🗑️ Hapus dari Wishlist</button></div>';`,
  `'<div style="margin-top:' + (isReady ? '8' : '12') + 'px;"><button type="button" class="btn-danger" id="btnWishlistDelete">Hapus dari Wishlist</button></div>';`
);
content = content.replace(
  `div.innerHTML = '⚠️ <strong>Barang ini sudah ada di Wishlist</strong> (Status: ' + statusLabel + ')' +`,
  `div.innerHTML = '<div style="display:flex; align-items:center; gap:6px;">' + renderUiIconHtml('alert', 16) + '<strong>Barang ini sudah ada di Wishlist</strong> (Status: ' + statusLabel + ')</div>' +`
);
content = content.replace(
  `<div><div class="muted">Sumber Dana</div><div style="font-weight:600;">📊 Budget Bulanan (\${formatMonthYear(curYM)})</div></div>`,
  `<div><div class="muted">Sumber Dana</div><div style="font-weight:600; display:flex; align-items:center; gap:6px;">\${renderUiIconHtml('budget', 16)} Budget Bulanan (\${formatMonthYear(curYM)})</div></div>`
);
content = content.replace(
  `goalEmoji: g.emoji || '🎯',`,
  `goalEmoji: g.emoji || 'money',`
);

// 29. Update Budget status badges (getBudgetAnalyticsSummary)
content = content.replace(
  `statusBadgeHtml = '<span class="badge-red">🚨 OVER BUDGET</span>';`,
  `statusBadgeHtml = '<span class="badge-red">' + renderUiIconHtml('alert', 10, 'margin-right:3px;') + 'OVER BUDGET</span>';`
);
content = content.replace(
  `statusBadgeHtml = '<span class="badge">✅ AMAN</span>';`,
  `statusBadgeHtml = '<span class="badge">' + renderUiIconHtml('checkCircle', 10, 'margin-right:3px;') + 'AMAN</span>';`
);
content = content.replace(
  `statusBadgeHtml = '<span class="badge-blue">ℹ️ TERKENDALI</span>';`,
  `statusBadgeHtml = '<span class="badge-blue">TERKENDALI</span>';`
);
content = content.replace(
  `statusBadgeHtml = '<span class="badge-amber">⚠️ WASPADA</span>';`,
  `statusBadgeHtml = '<span class="badge-amber">' + renderUiIconHtml('alert', 10, 'margin-right:3px;') + 'WASPADA</span>';`
);
content = content.replace(
  `var catObj = EXPENSE_CATEGORIES.find(function(c) { return c.id === catId; }) || { id: catId, label: catId, emoji: '📦' };`,
  `var catObj = EXPENSE_CATEGORIES.find(function(c) { return c.id === catId; }) || { id: catId, label: catId };`
);
content = content.replace(
  `emoji: g.emoji || '🎯',`,
  `emoji: g.emoji || 'money',`
);

// 30. Update getPrioritizedInsights
const oldInsights = `      if (budgetSummary.isOverBudget) {
        insights.push({
          priority: 1,
          icon: '🚨',
          type: 'danger',
          title: 'Melebihi Budget',
          text: 'Pengeluaran bulan ini melebihi budget sebesar ' + formatRupiah(budgetSummary.overAmount) + ' (' + budgetSummary.pct + '% terpakai).'
        });
      }

      if (comp.hasComparison && comp.direction === 'up' && comp.pct >= 15) {
        insights.push({
          priority: 2,
          icon: '📈',
          type: 'warning',
          title: 'Peningkatan Pengeluaran',
          text: 'Pengeluaran naik ' + comp.pct + '% dibanding ' + formatMonthYear(comp.prevYM) + ' (' + formatRupiah(comp.curTotal) + ' vs ' + formatRupiah(comp.prevTotal) + ').'
        });
      } else if (comp.hasComparison && comp.direction === 'down' && comp.pct <= -10) {
        insights.push({
          priority: 2,
          icon: '📉',
          type: 'success',
          title: 'Penghematan Efektif',
          text: 'Bagus! Pengeluaran turun ' + Math.abs(comp.pct) + '% dibanding bulan lalu.'
        });
      }

      if (budgetSummary.hasBudget && !budgetSummary.isOverBudget && budgetSummary.pct >= 75) {
        insights.push({
          priority: 3,
          icon: '⚠️',
          type: 'warning',
          title: 'Budget Menipis',
          text: budgetSummary.pct + '% budget bulan ini sudah digunakan. Tersisa ' + formatRupiah(budgetSummary.remainingBudget) + '.'
        });
      }

      if (topCat && topCat.pct >= 25) {
        insights.push({
          priority: 4,
          icon: topCat.emoji,
          type: 'info',
          title: 'Kategori Terbesar',
          text: topCat.label + ' mendominasi ' + topCat.pct + '% dari pengeluaran (' + formatRupiah(topCat.amount) + ').'
        });
      }

      if (dailyAvg > 0) {
        insights.push({
          priority: 5,
          icon: '📅',
          type: 'neutral',
          title: 'Rata-rata Harian',
          text: 'Rata-rata pengeluaranmu bulan ini adalah ' + formatRupiah(dailyAvg) + ' / hari.'
        });
      }

      if (goalsData.activeGoals.length > 0) {
        var almostThere = goalsData.activeGoals.find(function(g) { return g.pct >= 70 && g.pct < 100; });
        if (almostThere) {
          insights.push({
            priority: 6,
            icon: almostThere.emoji,
            type: 'success',
            title: 'Celengan Hampir Tercapai',
            text: 'Celengan ' + escapeHtml(almostThere.name) + ' sudah mencapai ' + almostThere.pct + '% (' + formatRupiah(almostThere.current) + ').'
          });
        }
      }

      if (wishlistData.cancelledCount > 0 && wishlistData.avoidedAmount > 0) {
        insights.push({
          priority: 7,
          icon: '🛡️',
          type: 'success',
          title: 'Impulse Protection',
          text: wishlistData.cancelledCount + ' pembelian dibatalkan via Wishlist (hemat ' + formatRupiah(wishlistData.avoidedAmount) + ').'
        });
      }`;

const newInsights = `      if (budgetSummary.isOverBudget) {
        insights.push({
          priority: 1,
          iconType: 'ui',
          iconKey: 'alert',
          type: 'danger',
          title: 'Melebihi Budget',
          text: 'Pengeluaran bulan ini melebihi budget sebesar ' + formatRupiah(budgetSummary.overAmount) + ' (' + budgetSummary.pct + '% terpakai).'
        });
      }

      if (comp.hasComparison && comp.direction === 'up' && comp.pct >= 15) {
        insights.push({
          priority: 2,
          iconType: 'ui',
          iconKey: 'trendUp',
          type: 'warning',
          title: 'Peningkatan Pengeluaran',
          text: 'Pengeluaran naik ' + comp.pct + '% dibanding ' + formatMonthYear(comp.prevYM) + ' (' + formatRupiah(comp.curTotal) + ' vs ' + formatRupiah(comp.prevTotal) + ').'
        });
      } else if (comp.hasComparison && comp.direction === 'down' && comp.pct <= -10) {
        insights.push({
          priority: 2,
          iconType: 'ui',
          iconKey: 'trendDown',
          type: 'success',
          title: 'Penghematan Efektif',
          text: 'Bagus! Pengeluaran turun ' + Math.abs(comp.pct) + '% dibanding bulan lalu.'
        });
      }

      if (budgetSummary.hasBudget && !budgetSummary.isOverBudget && budgetSummary.pct >= 75) {
        insights.push({
          priority: 3,
          iconType: 'ui',
          iconKey: 'alert',
          type: 'warning',
          title: 'Budget Menipis',
          text: budgetSummary.pct + '% budget bulan ini sudah digunakan. Tersisa ' + formatRupiah(budgetSummary.remainingBudget) + '.'
        });
      }

      if (topCat && topCat.pct >= 25) {
        insights.push({
          priority: 4,
          iconType: 'category',
          iconKey: topCat.id,
          type: 'info',
          title: 'Kategori Terbesar',
          text: topCat.label + ' mendominasi ' + topCat.pct + '% dari pengeluaran (' + formatRupiah(topCat.amount) + ').'
        });
      }

      if (dailyAvg > 0) {
        insights.push({
          priority: 5,
          iconType: 'ui',
          iconKey: 'dailyAverage',
          type: 'neutral',
          title: 'Rata-rata Harian',
          text: 'Rata-rata pengeluaranmu bulan ini adalah ' + formatRupiah(dailyAvg) + ' / hari.'
        });
      }

      if (goalsData.activeGoals.length > 0) {
        var almostThere = goalsData.activeGoals.find(function(g) { return g.pct >= 70 && g.pct < 100; });
        if (almostThere) {
          insights.push({
            priority: 6,
            iconType: 'goal',
            iconKey: almostThere.emoji,
            type: 'success',
            title: 'Celengan Hampir Tercapai',
            text: 'Celengan ' + escapeHtml(almostThere.name) + ' sudah mencapai ' + almostThere.pct + '% (' + formatRupiah(almostThere.current) + ').'
          });
        }
      }

      if (wishlistData.cancelledCount > 0 && wishlistData.avoidedAmount > 0) {
        insights.push({
          priority: 7,
          iconType: 'emergency',
          iconKey: 'emergency',
          type: 'success',
          title: 'Impulse Protection',
          text: wishlistData.cancelledCount + ' pembelian dibatalkan via Wishlist (hemat ' + formatRupiah(wishlistData.avoidedAmount) + ').'
        });
      }`;

content = content.replace(oldInsights, newInsights);

// 31. Update trend chart tooltip and trend card
content = content.replace(
  `? '<span class="badge-red" style="padding:2px 6px;font-size:10px;">🚨 OVER BUDGET</span>'`,
  `? '<span class="badge-red" style="padding:2px 6px;font-size:10px;">' + renderUiIconHtml('alert', 10, 'margin-right:3px;') + 'OVER BUDGET</span>'`
);
content = content.replace(
  `statusEl.innerHTML = '<span class="badge-red" style="padding:2px 6px;font-size:10px;">🚨 OVER BUDGET</span>';`,
  `statusEl.innerHTML = '<span class="badge-red" style="padding:2px 6px;font-size:10px;">' + renderUiIconHtml('alert', 10, 'margin-right:3px;') + 'OVER BUDGET</span>';`
);
content = content.replace(
  `badgeHtml = '<span class="badge-red" style="font-size:11px; padding:3px 8px;">🚨 OVER BUDGET</span>';`,
  `badgeHtml = '<span class="badge-red" style="font-size:11px; padding:3px 8px;">' + renderUiIconHtml('alert', 10, 'margin-right:3px;') + 'OVER BUDGET</span>';`
);

// 32. Update over-budget warning in Analytics summary
content = content.replace(
  `? '<div class="over-budget-card" style="margin-top:10px;">⚠️ Pengeluaran melebihi budget sebesar ' + formatRupiah(bSummary.overAmount) + '!</div>'`,
  `? '<div class="over-budget-card" style="margin-top:10px;">' + renderUiIconHtml('alert', 16, 'margin-right:6px;') + 'Pengeluaran melebihi budget sebesar ' + formatRupiah(bSummary.overAmount) + '!</div>'`
);

// 33. Update empty analytics illustration
content = content.replace(
  `'<div style="font-size:36px; margin-bottom:8px;">📝</div>' +`,
  `'<div style="margin-bottom:8px; display:flex; justify-content:center;"><span class="ui-icon-mask" style="width:36px;height:36px;opacity:0.6;-webkit-mask-image:url(\\'assets/icons/ui/analytics.svg\\');mask-image:url(\\'assets/icons/ui/analytics.svg\\');" aria-hidden="true"></span></div>' +`
);

// 34. Update comparison card in Analytics
const oldCompCard = `      // 2. PERBANDINGAN BULAN
      var compIcon = comp.direction === 'up' ? '📈' : (comp.direction === 'down' ? '📉' : '⚖️');
      var compSub = comp.hasComparison
        ? '<div class="muted" style="font-size:12px; margin-top:4px;">' + formatMonthYear(ym) + ' (' + formatRupiah(comp.curTotal) + ') vs ' + formatMonthYear(comp.prevYM) + ' (' + formatRupiah(comp.prevTotal) + ')</div>'
        : '';
      html += '<div class="card" style="margin-bottom:12px;">' +
        '<div style="display:flex; align-items:flex-start; gap:10px;">' +
          '<span style="font-size:22px;">' + compIcon + '</span>' +`;

const newCompCard = `      // 2. PERBANDINGAN BULAN
      var compIconKey = comp.direction === 'up' ? 'trendUp' : (comp.direction === 'down' ? 'trendDown' : 'comparison');
      var compSub = comp.hasComparison
        ? '<div class="muted" style="font-size:12px; margin-top:4px;">' + formatMonthYear(ym) + ' (' + formatRupiah(comp.curTotal) + ') vs ' + formatMonthYear(comp.prevYM) + ' (' + formatRupiah(comp.prevTotal) + ')</div>'
        : '';
      html += '<div class="card" style="margin-bottom:12px;">' +
        '<div style="display:flex; align-items:flex-start; gap:10px;">' +
          '<span style="display:flex; align-items:center; justify-content:center; flex-shrink:0;">' + renderUiIconHtml(compIconKey, 24) + '</span>' +`;

content = content.replace(oldCompCard, newCompCard);

// 35. Update Pola Pengeluaran: Kategori Terbesar (DYNAMIC SVG)
const oldTopCatCode = `        var topCat = catBreakdown.topCategory;
        var topCatText = topCat ? (topCat.emoji + ' ' + escapeHtml(topCat.label)) : '-';
        var topCatSub = topCat ? (formatRupiah(topCat.amount) + ' (' + topCat.pct + '%)') : '-';`;

const newTopCatCode = `        var topCat = catBreakdown.topCategory;
        var topCatText = topCat ? ('<span style=\"display:inline-flex; align-items:center; vertical-align:middle; margin-right:4px;\">' + renderCategoryIconHtml(topCat.id, 16) + '</span>' + escapeHtml(topCat.label)) : '-';
        var topCatSub = topCat ? (formatRupiah(topCat.amount) + ' (' + topCat.pct + '%)') : '-';`;

content = content.replace(oldTopCatCode, newTopCatCode);

// 36. Update Breakdown Kategori in Analytics
content = content.replace(
  `'<div><span style="font-size:16px; margin-right:6px;">' + cat.emoji + '</span><strong>' + escapeHtml(cat.label) + '</strong></div>' +`,
  `'<div><span style="display:inline-flex; align-items:center; vertical-align:middle; margin-right:6px;">' + renderCategoryIconHtml(cat.id, 18) + '</span><strong>' + escapeHtml(cat.label) + '</strong></div>' +`
);

// 37. Update insights rendering loop in renderAnalytics
const oldInsightLoop = `        insights.forEach(function(item) {
          html += '<div class="insight-card insight-' + item.type + '">' +
            '<div style="display:flex; align-items:flex-start; gap:10px;">' +
              '<span style="font-size:22px; flex-shrink:0;">' + item.icon + '</span>' +
              '<div class="flex-1">' +
                '<div style="font-weight:700; font-size:14px;">' + escapeHtml(item.title) + '</div>' +
                '<div style="font-size:13px; color:var(--text); margin-top:2px; line-height:1.4;">' + escapeHtml(item.text) + '</div>' +
              '</div>' +
            '</div>' +
          '</div>';
        });`;

const newInsightLoop = `        insights.forEach(function(item) {
          var iconHtml = '';
          if (item.iconType === 'category') {
            iconHtml = renderCategoryIconHtml(item.iconKey, 22);
          } else if (item.iconType === 'goal') {
            iconHtml = renderGoalIconHtml(item.iconKey, 22);
          } else if (item.iconType === 'emergency') {
            iconHtml = '<span class="emergency-icon-sm" style="width:22px;height:22px;" aria-hidden="true"></span>';
          } else {
            iconHtml = renderUiIconHtml(item.iconKey, 22);
          }
          html += '<div class="insight-card insight-' + item.type + '">' +
            '<div style="display:flex; align-items:flex-start; gap:10px;">' +
              '<span style="display:flex; align-items:center; justify-content:center; flex-shrink:0;">' + iconHtml + '</span>' +
              '<div class="flex-1">' +
                '<div style="font-weight:700; font-size:14px;">' + escapeHtml(item.title) + '</div>' +
                '<div style="font-size:13px; color:var(--text); margin-top:2px; line-height:1.4;">' + escapeHtml(item.text) + '</div>' +
              '</div>' +
            '</div>' +
          '</div>';
        });`;

content = content.replace(oldInsightLoop, newInsightLoop);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated index.html with custom SVGs!');
