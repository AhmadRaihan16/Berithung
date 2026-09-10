// scripts/test-v15.js
// Automated verification suite for Berithung v1.5.0 logic and guards

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== Berithung v1.5.0 Test Suite ===\n');

// 1. Read index.html and extract the main script
const htmlPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>[\s\S]*?<script>([\s\S]*?)<\/script>/);
if (!scriptMatch || !scriptMatch[2]) {
  console.error('Could not extract main script from index.html');
  process.exit(1);
}
const mainScript = scriptMatch[2];

// 2. Setup mock browser environment
const storage = {};
const mockLocalStorage = {
  getItem: (k) => (k in storage ? storage[k] : null),
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; },
  clear: () => { for (let k in storage) delete storage[k]; }
};

let lastToast = null;
const elements = {};
function getMockElement(id) {
  if (!elements[id]) {
    elements[id] = {
      id,
      value: '',
      textContent: '',
      innerHTML: '',
      style: {},
      classList: {
        add: () => {},
        remove: () => {},
        toggle: () => {},
        contains: () => false
      },
      addEventListener: () => {},
      querySelectorAll: () => [],
      querySelector: () => null,
      setAttribute: () => {},
      getAttribute: () => null
    };
  }
  return elements[id];
}

const mockDocument = {
  getElementById: (id) => getMockElement(id),
  querySelector: (sel) => getMockElement(sel),
  querySelectorAll: () => [],
  createElement: (tag) => getMockElement(tag),
  body: getMockElement('body'),
  documentElement: getMockElement('html'),
  addEventListener: () => {}
};

const sandbox = {
  console: console,
  window: {
    location: { reload: () => {} },
    matchMedia: () => ({ matches: false, addEventListener: () => {} }),
    addEventListener: () => {}
  },
  document: mockDocument,
  localStorage: mockLocalStorage,
  navigator: { userAgent: 'NodeTest', share: null },
  showToast: (msg) => { lastToast = msg; },
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  Date: Date,
  Math: Math,
  Number: Number,
  String: String,
  Array: Array,
  Object: Object,
  parseInt: parseInt,
  parseFloat: parseFloat,
  isNaN: isNaN,
  isFinite: isFinite,
  JSON: JSON
};
sandbox.window.document = mockDocument;
sandbox.window.localStorage = mockLocalStorage;

// Run script in sandbox
try {
  vm.createContext(sandbox);
  // Remove self-invoking initializers that depend heavily on full DOM render
  // But run function definitions
  vm.runInContext(mainScript, sandbox);
} catch (e) {
  // If render() fails due to DOM mocks, we can still test the data logic functions
  // Let's check which error occurred
  if (!sandbox.saveIncomeItem) {
    console.error('Error initializing sandbox:', e.message);
    process.exit(1);
  }
}

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

// Reset storage with base v1.4 structure
function resetData() {
  storage['savings_app_v3'] = JSON.stringify({
    budget: 3000000,
    budgets: { '2026-09': 3000000 },
    expenses: [
      { id: 101, amount: 150000, category: 'Makanan', date: '2026-09-02', note: 'Makan siang' },
      { id: 102, amount: 50000, category: 'Transport', date: '2026-09-03', note: 'Bensin' }
    ],
    incomes: [],
    recurringExpenses: [],
    goals: [],
    emergency: { current: 1000000, target: 5000000 }
  });
}

console.log('--- Acceptance Test 1 & 2: Income CRUD & Month Filtering ---');
resetData();
sandbox.saveIncomeItem({
  name: 'Gaji Bulanan',
  amount: 4000000,
  category: 'Gaji',
  date: '2026-09-01'
});
sandbox.saveIncomeItem({
  name: 'Projek Freelance',
  amount: 500000,
  category: 'Freelance',
  date: '2026-09-05'
});
sandbox.saveIncomeItem({
  name: 'Bonus Oktober',
  amount: 1000000,
  category: 'Bonus',
  date: '2026-10-01'
});

const septIncomes = sandbox.getIncomesForMonth('2026-09');
const septTotal = sandbox.getMonthlyIncomeTotal('2026-09');
const octTotal = sandbox.getMonthlyIncomeTotal('2026-10');

assert(septIncomes.length === 2, 'September has exactly 2 incomes');
assert(septTotal === 4500000, 'September income total is Rp 4.500.000');
assert(octTotal === 1000000, 'October income total is Rp 1.000.000');

console.log('\n--- Acceptance Test 3: Income Deletion ---');
const freelanceId = septIncomes.find(i => i.name === 'Projek Freelance').id;
sandbox.deleteIncomeItem(freelanceId);
const septTotalAfterDel = sandbox.getMonthlyIncomeTotal('2026-09');
assert(septTotalAfterDel === 4000000, 'Income after deleting freelance is Rp 4.000.000');

console.log('\n--- Acceptance Test 4: Recurring Template CRUD ---');
sandbox.saveRecurringExpense({
  name: 'Internet WiFi',
  amount: 300000,
  category: 'Tagihan',
  dueDay: 10
});
sandbox.saveRecurringExpense({
  name: 'Spotify Family',
  amount: 50000,
  category: 'Hiburan',
  dueDay: 15
});

const recurringList = sandbox.getRecurringExpenses();
assert(recurringList.length === 2, 'Two recurring expense templates created');
const wifiItem = recurringList.find(r => r.name === 'Internet WiFi');
const spotifyItem = recurringList.find(r => r.name === 'Spotify Family');
assert(wifiItem && wifiItem.amount === 300000 && wifiItem.dueDay === 10, 'Internet WiFi template attributes correct');
assert(spotifyItem && spotifyItem.amount === 50000 && spotifyItem.dueDay === 15, 'Spotify template attributes correct');

console.log('\n--- Acceptance Test 5: Recurring Status Logic ---');
// Simulating today as 10th of September 2026
const statusWifi = sandbox.getRecurringStatus(wifiItem, '2026-09');
assert(statusWifi.status === 'due_today' || statusWifi.status === 'unpaid' || statusWifi.status === 'overdue', 'Status returns a valid state: ' + statusWifi.status);

console.log('\n--- Acceptance Test 6, Guard 1 & Guard 3: Mark as Paid ---');
const paidRes = sandbox.markRecurringAsPaid(wifiItem.id, '2026-09');
assert(paidRes === true, 'markRecurringAsPaid returns true on success');

const isPaidSept = sandbox.isRecurringPaidForMonth(wifiItem.id, '2026-09');
assert(isPaidSept === true, 'isRecurringPaidForMonth returns true for 2026-09');

const isPaidOct = sandbox.isRecurringPaidForMonth(wifiItem.id, '2026-10');
assert(isPaidOct === false, 'isRecurringPaidForMonth returns false for 2026-10');

// Check expense created
const dataAfterPay = sandbox.getData();
const createdExpense = dataAfterPay.expenses.find(e => e.recurringExpenseId === wifiItem.id && e.recurringOccurrence === '2026-09');
assert(createdExpense !== undefined, 'Expense record created with recurringExpenseId and recurringOccurrence');
assert(createdExpense.amount === 300000, 'Created expense has amount Rp 300.000');
assert(createdExpense.recurringOccurrence === '2026-09', 'Guard 1: recurringOccurrence is local YYYY-MM');

console.log('\n--- Acceptance Test 7, Guard 2 & Guard 11: Duplicate Prevention ---');
const secondPayRes = sandbox.markRecurringAsPaid(wifiItem.id, '2026-09');
assert(secondPayRes === false, 'Duplicate markRecurringAsPaid returns false');
const toastEl = sandbox.document.getElementById('toast');
assert(toastEl && toastEl.textContent.includes('sudah dibayar untuk bulan ini'), 'Guard 11: User-facing toast shown when already paid: "' + toastEl.textContent + '"');
const matchingExpenses = sandbox.getData().expenses.filter(e => e.recurringExpenseId === wifiItem.id && e.recurringOccurrence === '2026-09');
assert(matchingExpenses.length === 1, 'Guard 2: Exactly 1 expense exists, no duplication occurred');

console.log('\n--- Acceptance Test 8, Guard 4: Historical Isolation on Template Edit/Delete ---');
// Edit WiFi template to Rp 350.000
sandbox.saveRecurringExpense({
  id: wifiItem.id,
  name: 'Internet WiFi High Speed',
  amount: 350000,
  category: 'Tagihan',
  dueDay: 12
});
// Re-read expense
const historicalExpense = sandbox.getData().expenses.find(e => e.recurringExpenseId === wifiItem.id && e.recurringOccurrence === '2026-09');
assert(historicalExpense.amount === 300000, 'Guard 4: Historical expense amount remains Rp 300.000 after editing template to Rp 350.000');

console.log('\n--- Acceptance Test 9, Guard 5: active:false Item Handling ---');
// Deactivate Spotify
sandbox.saveRecurringExpense({
  id: spotifyItem.id,
  name: spotifyItem.name,
  amount: spotifyItem.amount,
  category: spotifyItem.category,
  dueDay: spotifyItem.dueDay,
  active: false
});
const unpaidBefore = sandbox.getUnpaidRecurringExpenses('2026-09');
assert(unpaidBefore.every(r => r.active !== false), 'Guard 5: Inactive recurring items excluded from getUnpaidRecurringExpenses');
assert(sandbox.getUnpaidRecurringTotal('2026-09') === 0, 'Guard 5: Unpaid recurring total is 0 (WiFi paid, Spotify inactive)');

// Reactivate Spotify
sandbox.saveRecurringExpense({
  id: spotifyItem.id,
  name: spotifyItem.name,
  amount: spotifyItem.amount,
  category: spotifyItem.category,
  dueDay: spotifyItem.dueDay,
  active: true
});
assert(sandbox.getUnpaidRecurringTotal('2026-09') === 50000, 'Unpaid recurring total is 50000 when Spotify active');

console.log('\n--- Acceptance Test 10, Guard 6: dueDay Validation (1-28) ---');
const invalidDueHigh = sandbox.saveRecurringExpense({ name: 'Gym', amount: 200000, category: 'Kesehatan', dueDay: 30 });
const invalidDueLow = sandbox.saveRecurringExpense({ name: 'Gym', amount: 200000, category: 'Kesehatan', dueDay: 0 });
const invalidDueStr = sandbox.saveRecurringExpense({ name: 'Gym', amount: 200000, category: 'Kesehatan', dueDay: 'abc' });
const validDue = sandbox.saveRecurringExpense({ name: 'Gym', amount: 200000, category: 'Kesehatan', dueDay: 28 });
assert(invalidDueHigh === false, 'Guard 6: dueDay 30 rejected at logic level');
assert(invalidDueLow === false, 'Guard 6: dueDay 0 rejected at logic level');
assert(invalidDueStr === false, 'Guard 6: dueDay "abc" rejected at logic level');
assert(validDue === true, 'Guard 6: dueDay 28 accepted at logic level');

console.log('\n--- Acceptance Test 11, Guard 7: Amount Validation (Finite Positive Number) ---');
assert(sandbox.saveIncomeItem({ name: 'Minus', amount: -1000, category: 'Gaji' }) === false, 'Guard 7: Negative income rejected');
assert(sandbox.saveIncomeItem({ name: 'Zero', amount: 0, category: 'Gaji' }) === false, 'Guard 7: Zero income rejected');
assert(sandbox.saveIncomeItem({ name: 'NaN', amount: NaN, category: 'Gaji' }) === false, 'Guard 7: NaN income rejected');
assert(sandbox.saveRecurringExpense({ name: 'Minus', amount: -50000, category: 'Tagihan', dueDay: 5 }) === false, 'Guard 7: Negative recurring rejected');
assert(sandbox.saveRecurringExpense({ name: 'Zero', amount: 0, category: 'Tagihan', dueDay: 5 }) === false, 'Guard 7: Zero recurring rejected');

console.log('\n--- Acceptance Test 12, Guard 9: Projected Budget & Negative Remaining ---');
// Total expenses currently: 150.000 + 50.000 + 300.000 (WiFi) = 500.000
// Budget = 3.000.000 -> Remaining = 2.500.000
// Unpaid recurring: Spotify (50.000) + Gym (200.000) = 250.000
// Projected remaining = 2.500.000 - 250.000 = 2.250.000
const projNormal = sandbox.getProjectedBudget('2026-09');
assert(projNormal.projectedRemaining === 2250000, 'Projected remaining calculates accurately: Rp ' + projNormal.projectedRemaining);
assert(projNormal.isOverProjected === false, 'isOverProjected is false when surplus');

// Set tight budget to test negative projectedRemaining
const curData = sandbox.getData();
curData.budgets['2026-09'] = 600000; // Remaining = 100.000, Unpaid = 250.000 -> Projected = -150.000
sandbox.saveData(curData);
const projTight = sandbox.getProjectedBudget('2026-09');
assert(projTight.projectedRemaining === -150000, 'Guard 9: projectedRemaining is negative (-150000) and NOT clamped to 0');
assert(projTight.isOverProjected === true, 'isOverProjected is true when negative');

console.log('\n--- Acceptance Test 13, Guard 10: Backward Compatibility on Missing Fields ---');
const oldBackup = {
  budget: 2000000,
  budgets: { '2026-08': 2000000 },
  expenses: [{ id: 1, amount: 10000, category: 'Lainnya', date: '2026-08-01' }],
  goals: []
  // Note: NO incomes, NO recurringExpenses
};
storage['savings_app_v3'] = JSON.stringify(oldBackup);
const migratedData = sandbox.getData();
assert(Array.isArray(migratedData.incomes) && migratedData.incomes.length === 0, 'Guard 10: incomes fallback to empty array');
assert(Array.isArray(migratedData.recurringExpenses) && migratedData.recurringExpenses.length === 0, 'Guard 10: recurringExpenses fallback to empty array');
assert(sandbox.getMonthlyIncomeTotal('2026-08') === 0, 'No errors calling getMonthlyIncomeTotal on old data');
assert(sandbox.getUnpaidRecurringTotal('2026-08') === 0, 'No errors calling getUnpaidRecurringTotal on old data');
assert(sandbox.getProjectedBudget('2026-08').projectedRemaining === 1990000, 'getProjectedBudget works smoothly on old data');

console.log('\n--- Acceptance Test 14: Arus Kas (Cashflow) Metrics ---');
resetData();
sandbox.saveIncomeItem({ name: 'Gaji', amount: 5000000, category: 'Gaji', date: '2026-09-01' });
// Expenses in resetData: 150.000 + 50.000 = 200.000
const cf = sandbox.getMonthlyCashflow('2026-09');
assert(cf.income === 5000000, 'Cashflow income is 5000000');
assert(cf.expense === 200000, 'Cashflow expense is 200000');
assert(cf.net === 4800000, 'Cashflow net is 4800000');
assert(cf.savingsRate === 96, 'Cashflow savingsRate is 96%');

console.log('\n--- Acceptance Test 15: Strict Decoupling ---');
const finalData = sandbox.getData();
assert(finalData.emergency.current === 1000000, 'Emergency fund remains decoupled and untouched');
assert(finalData.emergency.target === 5000000, 'Emergency target remains untouched');
assert(typeof finalData.budget === 'number', 'Budget remains separate number');

console.log('\n=====================================');
console.log(`TOTAL: ${passed} PASSED, ${failed} FAILED`);
console.log('=====================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\n✓ ALL ACCEPTANCE CRITERIA AND GUARDS VERIFIED SUCCESSFULLY!');
  process.exit(0);
}
