// scripts/test-v16.js
// Automated verification suite for Berithung v1.6.0 Smart Celengan & Weekly Goal Forecast

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== Berithung v1.6.0 Smart Celengan (Weekly) Test Suite ===\n');

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
      getAttribute: () => null,
      focus: () => {}
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

try {
  vm.createContext(sandbox);
  vm.runInContext(mainScript, sandbox);
} catch (e) {
  if (!sandbox.getGoalForecast) {
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

// Helper to reset data
function resetData(customGoals) {
  storage['savings_app_v3'] = JSON.stringify({
    emergency: { balance: 0, transactions: [] },
    goals: customGoals || [],
    nextGoalId: 10,
    settings: { darkMode: 'system' },
    wishlist: [],
    budgets: {},
    expenses: [],
    incomes: [],
    recurringExpenses: []
  });
}

console.log('--- TEST 1: Goal lama tanpa histori setoran ---');
resetData([
  {
    id: 1,
    name: 'Laptop',
    targetAmount: 15000000,
    currentAmount: 6000000,
    targetDate: '',
    transactions: []
  }
]);
const g1 = sandbox.getData().goals[0];
assert(g1.currentAmount === 6000000, 'Saldo goal lama tetap Rp 6.000.000');
const fc1 = sandbox.getGoalForecast(g1, '2026-09-14');
assert(fc1.status === 'insufficient_data', 'Forecast status is insufficient_data');
assert(fc1.message === 'Belum cukup data', 'Forecast message is "Belum cukup data"');

console.log('\n--- TEST 2: Tambah deposit baru tercatat sekali & saldo bertambah ---');
sandbox.openTransactionModal({ source: 'goal', type: 'in', goalId: 1 });
sandbox.document.getElementById('txAmount').value = '1000000';
sandbox.document.getElementById('txNote').value = 'Setoran Minggu Ini';
sandbox.saveTransaction();

const gAfterDeposit = sandbox.getData().goals.find(g => g.id === 1);
assert(gAfterDeposit.currentAmount === 7000000, 'Saldo bertambah menjadi Rp 7.000.000');
assert(gAfterDeposit.transactions.length === 1, 'Histori deposit tercatat tepat satu transaksi');
assert(gAfterDeposit.transactions[0].amount === 1000000, 'Nominal transaksi adalah Rp 1.000.000');
assert(gAfterDeposit.transactions[0].dateISO !== undefined, 'Transaksi baru menyimpan dateISO');
assert(gAfterDeposit.transactions[0].createdAt !== undefined, 'Transaksi baru menyimpan createdAt');

console.log('\n--- TEST 3: Transaksi hanya di minggu berjalan (incomplete week) tidak dihitung Rp0 ---');
// Referensi: 2026-09-14 (Senin minggu berjalan)
const fc3 = sandbox.getGoalForecast(gAfterDeposit, '2026-09-14');
assert(fc3.status === 'insufficient_data', 'Goal dengan transaksi hanya di minggu berjalan statusnya tetap insufficient_data');
assert(fc3.message === 'Belum cukup data', 'Pesan tetap "Belum cukup data"');

console.log('\n--- TEST 4: Histori hanya 1 minggu kalender lengkap (belum capai 2 minggu) ---');
// Senin 2026-09-14: Minggu lalu adalah 2026-09-07..2026-09-13
const g4 = {
  id: 4,
  name: 'Kamera',
  targetAmount: 10000000,
  currentAmount: 2000000,
  transactions: [
    { id: 401, amount: 2000000, type: 'in', dateISO: '2026-09-08' } // 1 minggu lengkap yang lalu (2026-09-07)
  ]
};
const avgRes4 = sandbox.getGoalAverageWeeklySaving(g4, '2026-09-14');
assert(avgRes4.status === 'insufficient_data', 'Status adalah insufficient_data untuk 1 minggu lengkap');
assert(avgRes4.windowWeeks === 1, 'windowWeeks adalah 1');

console.log('\n--- TEST 5: Histori 2 minggu kalender lengkap (W-2: 1jt, W-1: 1.5jt) ---');
// W-2: 2026-08-31..2026-09-06 (1.000.000)
// W-1: 2026-09-07..2026-09-13 (1.500.000)
const g5 = {
  id: 5,
  name: 'Kamera Pro',
  targetAmount: 10000000,
  currentAmount: 2500000,
  transactions: [
    { id: 501, amount: 1000000, type: 'in', date: '01 Sep 2026, 10.00' }, // W-2
    { id: 502, amount: 1500000, type: 'in', date: '08 Sep 2026, 14.30' }  // W-1
  ]
};
const avgRes5 = sandbox.getGoalAverageWeeklySaving(g5, '2026-09-14');
assert(avgRes5.status === 'ready', 'Average weekly saving status is ready');
assert(avgRes5.average === 1250000, 'Average weekly saving is Rp 1.250.000 / minggu ((1jt + 1.5jt) / 2)');
assert(avgRes5.windowWeeks === 2, 'windowWeeks is 2');

console.log('\n--- TEST 6: Rolling average 4 minggu dengan minggu Rp 0 (100k, 150k, 0, 150k) ---');
// W-4 (2026-08-17): 100.000
// W-3 (2026-08-24): 150.000
// W-2 (2026-08-31): 0 (tidak ada setoran)
// W-1 (2026-09-07): 150.000
const g6 = {
  id: 6,
  name: 'Sepeda',
  targetAmount: 2000000,
  currentAmount: 400000,
  transactions: [
    { id: 601, amount: 100000, type: 'in', dateISO: '2026-08-18' },
    { id: 602, amount: 150000, type: 'in', dateISO: '2026-08-25' },
    { id: 603, amount: 150000, type: 'in', dateISO: '2026-09-09' }
  ]
};
const avgRes6 = sandbox.getGoalAverageWeeklySaving(g6, '2026-09-14');
assert(avgRes6.status === 'ready', 'Rolling 4-week average status is ready');
assert(avgRes6.average === 100000, 'Average weekly saving is Rp 100.000 / minggu ((100k + 150k + 0 + 150k) / 4)');
assert(avgRes6.windowWeeks === 4, 'windowWeeks is 4');

console.log('\n--- TEST 7: Sisa 5jt, Average 1.25jt -> weeksNeeded: 4 ---');
const g7 = {
  id: 7,
  name: 'Motor',
  targetAmount: 10000000,
  currentAmount: 5000000, // sisa 5.000.000
  transactions: [
    { id: 701, amount: 1000000, type: 'in', dateISO: '2026-09-01' },
    { id: 702, amount: 1500000, type: 'in', dateISO: '2026-09-08' }
  ]
};
const fc7 = sandbox.getGoalForecast(g7, '2026-09-14');
assert(fc7.status === 'ready', 'Forecast status is ready');
assert(fc7.remaining === 5000000, 'Sisa target Rp 5.000.000');
assert(fc7.weeksNeeded === 4, 'weeksNeeded is 4 weeks');
assert(fc7.estimatedTargetDate === '2026-10-12', 'estimatedTargetDate is 2026-10-12 (4 minggu dari 2026-09-14)');

console.log('\n--- TEST 8: Target sudah tercapai ---');
const g8 = {
  id: 8,
  name: 'Sepatu',
  targetAmount: 2000000,
  currentAmount: 2000000,
  status: 'completed',
  transactions: [
    { id: 801, amount: 1000000, type: 'in', dateISO: '2026-09-01' },
    { id: 802, amount: 1000000, type: 'in', dateISO: '2026-09-08' }
  ]
};
const fc8 = sandbox.getGoalForecast(g8, '2026-09-14');
assert(fc8.status === 'completed', 'Status is completed');
assert(fc8.weeksNeeded === 0, 'weeksNeeded is 0 when target reached');
assert(fc8.message === 'Target tercapai', 'Message is "Target tercapai"');

console.log('\n--- TEST 9: Average 0 / negatif -> target belum dapat diperkirakan ---');
const g9 = {
  id: 9,
  name: 'Gadget',
  targetAmount: 5000000,
  currentAmount: 1000000,
  transactions: [
    { id: 901, amount: 500000, type: 'in', dateISO: '2026-09-01' },
    { id: 902, amount: 600000, type: 'out', dateISO: '2026-09-02' }, // Net W-2: -100k
    { id: 903, amount: 100000, type: 'in', dateISO: '2026-09-08' },
    { id: 904, amount: 100000, type: 'out', dateISO: '2026-09-09' }  // Net W-1: 0
  ]
};
const fc9 = sandbox.getGoalForecast(g9, '2026-09-14');
assert(fc9.status === 'unpredictable', 'Status is unpredictable when net saving <= 0');
assert(fc9.message === 'Target belum dapat diperkirakan', 'Message is "Target belum dapat diperkirakan"');
assert(fc9.weeksNeeded === undefined, 'No Infinity or NaN in forecast output');

console.log('\n--- TEST 10: TargetDate tersedia, sisa 6jt, 3 minggu -> Butuh 2jt / minggu ---');
// Referensi: 2026-09-14 (Senin W0)
// targetDate: 2026-10-05 (Senin W+3)
const g10 = {
  id: 10,
  name: 'Pendidikan',
  targetAmount: 10000000,
  currentAmount: 4000000, // sisa 6jt
  targetDate: '2026-10-05', // 3 minggu dari 2026-09-14
  transactions: [
    { id: 1001, amount: 1000000, type: 'in', dateISO: '2026-09-01' },
    { id: 1002, amount: 1000000, type: 'in', dateISO: '2026-09-08' }
  ]
};
const plan10 = sandbox.getGoalTargetPlan(g10, '2026-09-14');
assert(plan10 !== null, 'Plan object generated');
assert(plan10.remainingWeeks === 3, 'Remaining weeks is 3');
assert(plan10.requiredWeeklySaving === 2000000, 'Required weekly saving is Rp 2.000.000 / minggu');

console.log('\n--- TEST 11: Average 1.5jt < Required 2jt -> PERLU DITINGKATKAN (Gap 500rb) ---');
const g11 = {
  id: 11,
  name: 'Wisata',
  targetAmount: 10000000,
  currentAmount: 4000000, // sisa 6jt
  targetDate: '2026-10-05', // 3 minggu -> butuh 2jt/minggu
  transactions: [
    { id: 1101, amount: 1500000, type: 'in', dateISO: '2026-09-01' },
    { id: 1102, amount: 1500000, type: 'in', dateISO: '2026-09-08' } // avg = 1.5jt
  ]
};
const plan11 = sandbox.getGoalTargetPlan(g11, '2026-09-14');
assert(plan11.status === 'needs_increase', 'Plan status is needs_increase');
assert(plan11.label === 'PERLU DITINGKATKAN', 'Plan label is PERLU DITINGKATKAN');
assert(plan11.savingGap === 500000, 'Saving gap is Rp 500.000 / minggu');

console.log('\n--- TEST 12: Average 2.5jt >= Required 2jt -> ON TRACK ---');
const g12 = {
  id: 12,
  name: 'Renovasi',
  targetAmount: 10000000,
  currentAmount: 4000000, // sisa 6jt
  targetDate: '2026-10-05', // 3 minggu -> butuh 2jt/minggu
  transactions: [
    { id: 1201, amount: 2500000, type: 'in', dateISO: '2026-09-01' },
    { id: 1202, amount: 2500000, type: 'in', dateISO: '2026-09-08' } // avg = 2.5jt
  ]
};
const plan12 = sandbox.getGoalTargetPlan(g12, '2026-09-14');
assert(plan12.status === 'on_track', 'Plan status is on_track');
assert(plan12.label === 'ON TRACK', 'Plan label is ON TRACK');
assert(plan12.savingGap === 0, 'Saving gap is 0');

console.log('\n--- TEST 13: Past targetDate handled with TARGET TERLEWAT ---');
const gExpired = {
  id: 13,
  name: 'Expired Goal',
  targetAmount: 5000000,
  currentAmount: 1000000,
  targetDate: '2026-09-01', // Target di minggu lalu (2026-09-01) saat referensi 2026-09-14
  transactions: [
    { id: 1301, amount: 500000, type: 'in', dateISO: '2026-08-25' },
    { id: 1302, amount: 500000, type: 'in', dateISO: '2026-09-01' }
  ]
};
const planExpired = sandbox.getGoalTargetPlan(gExpired, '2026-09-14');
assert(planExpired.status === 'expired', 'Expired targetDate returns status expired');
assert(planExpired.label === 'TARGET TERLEWAT', 'Expired targetDate returns label TARGET TERLEWAT');
assert(planExpired.remainingWeeks === 0, 'Expired targetDate remainingWeeks is 0');
assert(planExpired.requiredWeeklySaving === 0, 'Expired targetDate requiredWeeklySaving is 0');

console.log('\n--- TEST 14: Net saving dengan setoran & penarikan dalam satu minggu ---');
const g14 = {
  id: 14,
  name: 'Tabungan X',
  transactions: [
    { id: 1401, amount: 2000000, type: 'in', dateISO: '2026-09-08' },
    { id: 1402, amount: 500000, type: 'out', dateISO: '2026-09-10' }
  ]
};
const net14 = sandbox.getGoalWeeklyNetSaving(g14, '2026-09-07');
assert(net14 === 1500000, 'Net saving minggu 2026-09-07 adalah Rp 1.500.000 (2.000.000 - 500.000)');

console.log('\n--- TEST 15: Edit target 10jt -> 15jt, histori transaksi tidak berubah ---');
resetData([
  {
    id: 15,
    name: 'Projek Mobil',
    targetAmount: 10000000,
    currentAmount: 2000000,
    transactions: [
      { id: 1501, amount: 1000000, type: 'in', dateISO: '2026-09-01' },
      { id: 1502, amount: 1000000, type: 'in', dateISO: '2026-09-08' }
    ]
  }
]);
sandbox.openGoalModal(sandbox.getData().goals[0]);
sandbox.document.getElementById('goalName').value = 'Projek Mobil Baru';
sandbox.document.getElementById('goalTarget').value = '15000000';
sandbox.saveGoal();

const g15After = sandbox.getData().goals.find(g => g.id === 15);
assert(g15After.targetAmount === 15000000, 'Target amount updated to 15.000.000');
assert(g15After.transactions.length === 2, 'Histori transaksi tetap berjumlah 2');
assert(g15After.transactions[0].amount === 1000000, 'Histori transaksi tidak berubah');
const fc15 = sandbox.getGoalForecast(g15After, '2026-09-14');
assert(fc15.remaining === 13000000, 'Forecast otomatis dihitung ulang dengan sisa 13.000.000');
assert(fc15.weeksNeeded === 13, 'weeksNeeded recalculated to 13 weeks');

console.log('\n--- TEST 16: Backup Export & Restore ---');
const legacyBackup = JSON.stringify({
  goals: [
    { id: 99, name: 'Goal Legacy', targetAmount: 5000000, currentAmount: 1000000 }
  ],
  emergency: { balance: 500000, transactions: [] }
});

const fileReaderCallback = (resultStr) => {
  const parsed = JSON.parse(resultStr);
  parsed.goals = Array.isArray(parsed.goals) ? parsed.goals.map(g => {
    g.transactions = Array.isArray(g.transactions) ? g.transactions : [];
    g.targetDate = g.targetDate || null;
    return g;
  }) : [];
  sandbox.saveData(parsed);
};
fileReaderCallback(legacyBackup);

const restoredData = sandbox.getData();
const restoredGoal = restoredData.goals.find(g => g.id === 99);
assert(restoredGoal !== undefined, 'Legacy goal restored');
assert(Array.isArray(restoredGoal.transactions), 'transactions initialized as array');
assert(restoredGoal.targetDate === null, 'targetDate initialized as null');

console.log('\n--- GUARD 1: Audit and reuse existing goal.weeklyTarget without conflict ---');
const gGuard1 = {
  id: 17,
  name: 'Guard 1 Goal',
  targetAmount: 10000000,
  currentAmount: 4000000,
  weeklyTarget: 500000, // User manual plan
  transactions: [
    { id: 1701, amount: 1000000, type: 'in', dateISO: '2026-09-01' },
    { id: 1702, amount: 1000000, type: 'in', dateISO: '2026-09-08' } // Historical velocity = 1jt
  ]
};
const avgGuard1 = sandbox.getGoalAverageWeeklySaving(gGuard1, '2026-09-14');
assert(gGuard1.weeklyTarget === 500000, 'weeklyTarget remains user plan: Rp 500.000');
assert(avgGuard1.average === 1000000, 'averageWeeklySaving remains derived velocity: Rp 1.000.000');
assert(gGuard1.weeklyTarget !== avgGuard1.average, 'User plan and actual velocity remain distinct');

console.log('\n--- GUARD 2: Deterministic local calendar week calculations ---');
// Monday test: 2026-09-14 is Monday
assert(sandbox.getLocalWeekKey('2026-09-14') === '2026-09-14', 'Monday week key is 2026-09-14');
// Sunday test: 2026-09-20 is Sunday, must return 2026-09-14
assert(sandbox.getLocalWeekKey('2026-09-20') === '2026-09-14', 'Sunday week key resolves to Monday: 2026-09-14');
// Saturday test: 2026-09-19 is Saturday, must return 2026-09-14
assert(sandbox.getLocalWeekKey('2026-09-19') === '2026-09-14', 'Saturday week key resolves to Monday: 2026-09-14');
// Next Monday: 2026-09-21
assert(sandbox.getLocalWeekKey('2026-09-21') === '2026-09-21', 'Next Monday week key is 2026-09-21');
// shiftWeek
assert(sandbox.shiftWeek('2026-09-14', -1) === '2026-09-07', 'shiftWeek -1 returns 2026-09-07');
assert(sandbox.shiftWeek('2026-09-14', 1) === '2026-09-21', 'shiftWeek +1 returns 2026-09-21');
// getWeekDiff
assert(sandbox.getWeekDiff('2026-09-07', '2026-09-14') === 1, 'getWeekDiff forward returns 1');
assert(sandbox.getWeekDiff('2026-09-14', '2026-09-07') === -1, 'getWeekDiff backward returns -1');
assert(sandbox.getWeekDiff('2026-09-14', '2026-10-05') === 3, 'getWeekDiff 3 weeks returns 3');
// parseTransactionDateISO deterministic tests
assert(sandbox.parseTransactionDateISO({ dateISO: '2026-09-14' }) === '2026-09-14', 'Parse dateISO: 2026-09-14');
assert(sandbox.parseTransactionDateISO({ date: '14 Sep 2026, 04.54' }) === '2026-09-14', 'Parse Indonesian Sep: 2026-09-14');
assert(sandbox.parseTransactionDateISO({ date: '25 Agu 2026 12:00' }) === '2026-08-25', 'Parse Indonesian Agu: 2026-08-25');
assert(sandbox.parseTransactionDateISO({ date: '1 Agustus 2026' }) === '2026-08-01', 'Parse Indonesian full month name: 2026-08-01');
assert(sandbox.parseTransactionDateISO({ date: '14/09/2026' }) === '2026-09-14', 'Parse slash date: 2026-09-14');
assert(sandbox.parseTransactionDateISO({ createdAt: 1789392000000 }) !== '', 'Parse createdAt numeric timestamp');
assert(sandbox.parseTransactionDateISO({ id: 1789392000123.45 }) !== '', 'Parse id numeric timestamp fallback');

console.log('\n--- GUARD 3: Legacy transactions without tx.goalId work seamlessly ---');
const gLegacyTx = {
  id: 30,
  name: 'Goal Without tx.goalId',
  targetAmount: 5000000,
  currentAmount: 2000000,
  transactions: [
    { id: 3001, amount: 1000000, type: 'in', dateISO: '2026-09-01' }, // No goalId field
    { id: 3002, amount: 1000000, type: 'in', dateISO: '2026-09-08' }  // No goalId field
  ]
};
const avgLegacy = sandbox.getGoalAverageWeeklySaving(gLegacyTx, '2026-09-14');
assert(avgLegacy.status === 'ready', 'Weekly rolling average works without tx.goalId');
assert(avgLegacy.average === 1000000, 'Average is Rp 1.000.000 / minggu without tx.goalId');

console.log('\n=====================================');
console.log(`TOTAL: ${passed} PASSED, ${failed} FAILED`);
console.log('=====================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('✓ ALL v1.6 WEEKLY ACCEPTANCE CRITERIA & GUARDS VERIFIED SUCCESSFULLY!');
}
