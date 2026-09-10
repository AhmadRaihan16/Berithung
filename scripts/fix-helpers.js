const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let raw = fs.readFileSync(filePath, 'utf8');
const isCRLF = raw.includes('\r\n');
let content = raw.replace(/\r\n/g, '\n');

// 1. Insert UI_ICONS and helpers right after renderGoalIconHtml
const anchor = `    function renderGoalIconHtml(val, size, extraStyle) {
      const key = getCanonicalGoalKey(val);
      const src = GOAL_ICONS[key] || GOAL_ICONS.money;
      const px = size || 24;
      const style = \`width:\${px}px;height:\${px}px;-webkit-mask-image:url('\${src}');mask-image:url('\${src}');\${extraStyle || ''}\`;
      return \`<span class="goal-icon-mask" style="\${style}" role="img" aria-label="\${key}"></span>\`;
    }`;

const registries = `    function renderGoalIconHtml(val, size, extraStyle) {
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

if (content.includes(anchor)) {
  content = content.replace(anchor, registries);
  console.log('Successfully inserted registries and helpers!');
} else {
  console.error('Anchor not found!');
}

// 2. Fix openExpenseModal catSelect options & preview
const oldSelectBlock = `      var catSelect = document.getElementById('selectExpenseCategory');
      catSelect.innerHTML = EXPENSE_CATEGORIES.map(function(c) {
        return '<option value="' + escapeHtml(c.id) + '">' + c.emoji + ' ' + escapeHtml(c.label) + '</option>';
      }).join('');`;

const newSelectBlock = `      var catSelect = document.getElementById('selectExpenseCategory');
      catSelect.innerHTML = EXPENSE_CATEGORIES.map(function(c) {
        return '<option value="' + escapeHtml(c.id) + '">' + escapeHtml(c.label) + '</option>';
      }).join('');

      function updateCatPreview() {
        var preview = document.getElementById('expenseCategoryIconPreview');
        if (preview && catSelect) {
          var k = getCategoryKey(catSelect.value);
          var src = CATEGORY_ICONS[k] || CATEGORY_ICONS.other;
          preview.style.webkitMaskImage = "url('" + src + "')";
          preview.style.maskImage = "url('" + src + "')";
        }
      }
      catSelect.onchange = updateCatPreview;
      updateCatPreview();`;

if (content.includes(oldSelectBlock)) {
  content = content.replace(oldSelectBlock, newSelectBlock);
  console.log('Successfully updated catSelect in openExpenseModal!');
} else {
  console.error('oldSelectBlock not found!');
}

if (isCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('index.html updated successfully.');
