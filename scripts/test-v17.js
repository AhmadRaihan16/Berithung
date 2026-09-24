// scripts/test-v17.js
// Automated verification suite for Berithung v1.7.0 Savings Streak & Smart Local Notifications

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== Berithung v1.7.0 Savings Streak & Smart Local Notifications Test Suite ===\n');

// 1. Read index.html and extract the main script
const htmlPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>[\s\S]*?<script>([\s\S]*?)<\/script>/);
if (!scriptMatch || !scriptMatch[2]) {
  console.error('Could not extract main script from index.html');
  process.exit(1);
}
const mainScript = scriptMatch[2];

// 2. Setup mock browser & Capacitor environment
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
      checked: false,
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

// Mock Capacitor LocalNotifications
let scheduledNotifications = [];
let cancelledNotificationIds = [];
let mockPermissionState = 'granted';
let isNativePlatformActive = true;

const mockLocalNotifications = {
  checkPermissions: async () => ({ display: mockPermissionState }),
  requestPermissions: async () => ({ display: mockPermissionState }),
  schedule: async (opts) => {
    if (opts && Array.isArray(opts.notifications)) {
      for (const n of opts.notifications) {
        scheduledNotifications.push(n);
      }
    }
    return { notifications: opts.notifications };
  },
  cancel: async (opts) => {
    if (opts && Array.isArray(opts.notifications)) {
      for (const n of opts.notifications) {
        cancelledNotificationIds.push(n.id);
        scheduledNotifications = scheduledNotifications.filter(x => x.id !== n.id);
      }
    }
  }
};

const sandbox = {
  console: console,
  window: {
    location: { reload: () => {} },
    matchMedia: () => ({ matches: false, addEventListener: () => {} }),
    addEventListener: () => {},
    Capacitor: {
      isNativePlatform: () => isNativePlatformActive,
      Plugins: {
        LocalNotifications: mockLocalNotifications
      }
    }
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
  console.error('Error initializing sandbox:', e.message);
  process.exit(1);
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
function resetData(customGoals, customSettings) {
  scheduledNotifications = [];
  cancelledNotificationIds = [];
  storage['savings_app_v3'] = JSON.stringify({
    emergency: { balance: 0, transactions: [] },
    goals: customGoals || [],
    nextGoalId: 10,
    settings: customSettings || {
      darkMode: 'system',
      goalNotifications: { enabled: true, reminderDay: 'sabtu', reminderTime: '19:00' }
    },
    wishlist: [],
    budgets: {},
    expenses: [],
    incomes: [],
    recurringExpenses: []
  });
}

// Reference Date: Wednesday 2026-09-16 (WeekKey = '2026-09-14')
// Completed weeks:
// W-3: 2026-08-24
// W-2: 2026-08-31
// W-1: 2026-09-07
// Current week: 2026-09-14
const refDate = '2026-09-16';

async function runAllTests() {
  console.log('--- TEST 1: 3 Completed Weeks SUCCESS -> Current streak: 3, Best: 3 ---');
  const g1 = {
    id: 1,
    name: 'Motor',
    targetAmount: 10000000,
    currentAmount: 500000,
    weeklyTarget: 150000,
    weeklyTargetHistory: [{ target: 150000, effectiveFromWeek: '2026-08-24' }],
    transactions: [
      { id: 101, amount: 150000, type: 'in', dateISO: '2026-08-25' }, // W-3 (150k >= 150k)
      { id: 102, amount: 200000, type: 'in', dateISO: '2026-09-01' }, // W-2 (200k >= 150k)
      { id: 103, amount: 150000, type: 'in', dateISO: '2026-09-08' }  // W-1 (150k >= 150k)
    ]
  };
  const curStreak1 = sandbox.getGoalCurrentStreak(g1, refDate);
  const bestStreak1 = sandbox.getGoalBestStreak(g1, refDate);
  assert(curStreak1 === 3, 'Current streak is 3');
  assert(bestStreak1 === 3, 'Best streak is 3');

  console.log('\n--- TEST 2: Weeks 150k, 200k, 50k, 150k -> Current: 1, Best: 2 ---');
  const g2 = {
    id: 2,
    name: 'Laptop',
    targetAmount: 10000000,
    currentAmount: 550000,
    weeklyTarget: 150000,
    weeklyTargetHistory: [{ target: 150000, effectiveFromWeek: '2026-08-17' }],
    transactions: [
      { id: 201, amount: 150000, type: 'in', dateISO: '2026-08-18' }, // W-4
      { id: 202, amount: 200000, type: 'in', dateISO: '2026-08-25' }, // W-3
      { id: 203, amount: 50000, type: 'in', dateISO: '2026-09-01' },  // W-2 (FAILED)
      { id: 204, amount: 150000, type: 'in', dateISO: '2026-09-08' }  // W-1 (SUCCESS)
    ]
  };
  assert(sandbox.getGoalCurrentStreak(g2, refDate) === 1, 'Current streak is 1 (W-1 SUCCESS, W-2 breaks)');
  assert(sandbox.getGoalBestStreak(g2, refDate) === 2, 'Best streak is 2 (W-4 and W-3 consecutive)');

  console.log('\n--- TEST 3: Current incomplete week 0 does not break streak ---');
  const g3 = {
    id: 3,
    name: 'Liburan',
    targetAmount: 5000000,
    currentAmount: 600000,
    weeklyTarget: 150000,
    weeklyTargetHistory: [{ target: 150000, effectiveFromWeek: '2026-08-17' }],
    transactions: [
      { id: 301, amount: 150000, type: 'in', dateISO: '2026-08-18' },
      { id: 302, amount: 150000, type: 'in', dateISO: '2026-08-25' },
      { id: 303, amount: 150000, type: 'in', dateISO: '2026-09-01' },
      { id: 304, amount: 150000, type: 'in', dateISO: '2026-09-08' }
    ]
  };
  assert(sandbox.getGoalCurrentStreak(g3, refDate) === 4, 'Current streak stays 4 despite 0 deposit this week');

  console.log('\n--- TEST 4: Current week 100k / 150k -> 67% progress, 50k remaining ---');
  const g4 = {
    id: 4,
    name: 'Kamera',
    targetAmount: 5000000,
    currentAmount: 100000,
    weeklyTarget: 150000,
    weeklyTargetHistory: [{ target: 150000, effectiveFromWeek: '2026-09-14' }],
    transactions: [
      { id: 401, amount: 100000, type: 'in', dateISO: '2026-09-15' }
    ]
  };
  const p4 = sandbox.getGoalWeeklyProgress(g4, refDate);
  assert(p4.currentWeekSaving === 100000, 'Current week saving is Rp 100.000');
  assert(p4.progressPct === 67, 'Progress is 67%');
  assert(p4.remaining === 50000, 'Remaining is Rp 50.000');
  assert(p4.isTargetMet === false, 'isTargetMet is false');

  console.log('\n--- TEST 5: Current week reaches 150k -> Target reached ---');
  const g5 = {
    id: 5,
    name: 'Ponsel',
    targetAmount: 5000000,
    currentAmount: 150000,
    weeklyTarget: 150000,
    weeklyTargetHistory: [{ target: 150000, effectiveFromWeek: '2026-09-14' }],
    transactions: [
      { id: 501, amount: 150000, type: 'in', dateISO: '2026-09-15' }
    ]
  };
  const p5 = sandbox.getGoalWeeklyProgress(g5, refDate);
  const sum5 = sandbox.getGoalStreakSummary(g5, refDate);
  assert(p5.isTargetMet === true, 'isTargetMet is true');
  assert(p5.remaining === 0, 'Remaining is 0');
  assert(sum5.message === 'Target minggu ini tercapai.', 'Message indicates target reached');

  console.log('\n--- TEST 6: Deposit 200k, Withdraw 100k, Target 150k -> Net 100k (FAILED) ---');
  const g6 = {
    id: 6,
    name: 'Sepeda',
    targetAmount: 2000000,
    currentAmount: 100000,
    weeklyTarget: 150000,
    weeklyTargetHistory: [{ target: 150000, effectiveFromWeek: '2026-09-07' }],
    transactions: [
      { id: 601, amount: 200000, type: 'in', dateISO: '2026-09-08' },
      { id: 602, amount: 100000, type: 'out', dateISO: '2026-09-09' }
    ]
  };
  const net6 = sandbox.getGoalWeeklyNetSaving(g6, '2026-09-07');
  assert(net6 === 100000, 'Net saving is Rp 100.000 (200k - 100k)');
  assert(sandbox.getGoalCurrentStreak(g6, refDate) === 0, 'W-1 net 100k < 150k is FAILED, streak is 0');

  console.log('\n--- TEST 7: weeklyTarget 0 / null -> Streak disabled gracefully ---');
  const g7 = {
    id: 7,
    name: 'Tabungan Bebas',
    targetAmount: 1000000,
    currentAmount: 300000,
    weeklyTarget: null,
    transactions: [{ id: 701, amount: 100000, type: 'in', dateISO: '2026-09-08' }]
  };
  const sum7 = sandbox.getGoalStreakSummary(g7, refDate);
  assert(sum7.isValid === false, 'Streak is not valid');
  assert(sum7.message === 'Atur target mingguan untuk mengaktifkan Savings Streak.', 'Friendly prompt displayed');

  console.log('\n--- TEST 8: Legacy goal without history -> Streak 0, no fake historical streak ---');
  const g8 = {
    id: 8,
    name: 'Goal Lama',
    targetAmount: 5000000,
    currentAmount: 2000000,
    weeklyTarget: 100000,
    transactions: []
  };
  assert(sandbox.getGoalCurrentStreak(g8, refDate) === 0, 'Current streak is 0 without transactions');
  assert(sandbox.getGoalBestStreak(g8, refDate) === 0, 'Best streak is 0 without transactions');

  console.log('\n--- TEST 9: Notification disabled -> No reminder scheduled ---');
  resetData([g4], { darkMode: 'system', goalNotifications: { enabled: false } });
  await sandbox.NotificationService.scheduleWeeklyReminder(g4, sandbox.getData().settings);
  assert(scheduledNotifications.length === 0, 'No notification scheduled when disabled');

  console.log('\n--- TEST 10: Permission denied -> Graceful fallback, no crash ---');
  mockPermissionState = 'denied';
  resetData([g4], { darkMode: 'system', goalNotifications: { enabled: true, reminderDay: 'sabtu', reminderTime: '19:00' } });
  await sandbox.NotificationService.scheduleWeeklyReminder(g4, sandbox.getData().settings);
  assert(true, 'Permission denied handled safely without crash');
  mockPermissionState = 'granted';

  console.log('\n--- TEST 11: Notification enabled & target not met -> Reminder scheduled ---');
  resetData([g4]);
  await sandbox.NotificationService.scheduleWeeklyReminder(g4, sandbox.getData().settings, refDate);
  assert(scheduledNotifications.length === 1, 'Reminder notification scheduled');
  assert(scheduledNotifications[0] && scheduledNotifications[0].id === sandbox.getGoalReminderNotificationId(4), 'Deterministic reminder ID matches');
  assert(scheduledNotifications[0] && scheduledNotifications[0].body.includes('Rp 50.000'), 'Notification mentions remaining Rp 50.000');

  console.log('\n--- TEST 12: Target then reached -> Pending reminder cancelled ---');
  await sandbox.NotificationService.scheduleWeeklyReminder(g5, sandbox.getData().settings);
  assert(cancelledNotificationIds.includes(sandbox.getGoalReminderNotificationId(5)), 'Pending reminder cancelled when target reached');

  console.log('\n--- TEST 13: Goal deleted -> Notifications for goal cancelled ---');
  cancelledNotificationIds = [];
  await sandbox.NotificationService.cancelGoalNotifications(4);
  assert(cancelledNotificationIds.includes(sandbox.getGoalReminderNotificationId(4)), 'Reminder ID cancelled');
  assert(cancelledNotificationIds.includes(sandbox.getGoalCompletionNotificationId(4)), 'Completion ID cancelled');

  console.log('\n--- TEST 14: Completion notification does not duplicate in same week ---');
  resetData();
  const g14 = {
    id: 14,
    name: 'iPad',
    targetAmount: 5000000,
    currentAmount: 0,
    weeklyTarget: 100000,
    weeklyTargetHistory: [{ target: 100000, effectiveFromWeek: sandbox.getLocalWeekKey() }],
    transactions: [],
    lastCompletedNoticeWeek: null
  };
  sandbox.getData().goals.push(g14);
  scheduledNotifications = [];

  // 1st deposit: 50k (prev: 0, new: 50k) -> below target, no notice
  await sandbox.NotificationService.checkAndNotifyCompletion(g14, 0, 50000);
  assert(scheduledNotifications.length === 0, 'No completion notice at 50k/100k');

  // 2nd deposit: +60k (prev: 50k, new: 110k) -> crosses target!
  await sandbox.NotificationService.checkAndNotifyCompletion(g14, 50000, 110000);
  assert(scheduledNotifications.length === 1, 'Completion notice sent on crossing target');
  assert(g14.lastCompletedNoticeWeek === sandbox.getLocalWeekKey(), 'lastCompletedNoticeWeek set to current week');

  // 3rd deposit in same week: +50k (prev: 110k, new: 160k) -> should NOT duplicate!
  await sandbox.NotificationService.checkAndNotifyCompletion(g14, 110000, 160000);
  assert(scheduledNotifications.length === 1, 'No duplicate completion notice on further deposit');

  console.log('\n--- TEST 15: Web browser fallback -> Works without Capacitor errors ---');
  isNativePlatformActive = false; // Simulate web environment
  assert(sandbox.NotificationService.isSupported() === false, 'NotificationService.isSupported is false on web');
  await sandbox.NotificationService.scheduleWeeklyReminder(g14, {});
  await sandbox.NotificationService.checkAndNotifyCompletion(g14, 0, 100000);
  assert(true, 'Web browser fallback executed without throwing errors');
  isNativePlatformActive = true;

  console.log('\n--- GUARD 1 & TEST 16: Legacy goal with transactions but NO weeklyTargetHistory ---');
  const gLegacy = {
    id: 16,
    name: 'Legacy Camera',
    targetAmount: 10000000,
    currentAmount: 1500000,
    weeklyTarget: 500000,
    transactions: [
      { id: 1601, amount: 500000, type: 'in', dateISO: '2026-08-25' },
      { id: 1602, amount: 500000, type: 'in', dateISO: '2026-09-01' },
      { id: 1603, amount: 500000, type: 'in', dateISO: '2026-09-08' }
    ]
  };
  assert(sandbox.getGoalWeeklyTargetForWeek(gLegacy, '2026-08-24') === null, 'Historical target is null for untracked week');
  assert(sandbox.getGoalWeeklyTargetForWeek(gLegacy, '2026-09-07') === null, 'Historical target is null for untracked week W-1');
  assert(sandbox.getGoalCurrentStreak(gLegacy, refDate) === 0, 'No fake current streak for legacy untracked goal');
  assert(sandbox.getGoalBestStreak(gLegacy, refDate) === 0, 'No fake best streak for legacy untracked goal');

  console.log('\n--- GUARD 2 & TEST 17: Changing weeklyTarget this week does not alter previous history ---');
  const gTargetChange = {
    id: 17,
    name: 'Upgrade Goal',
    targetAmount: 10000000,
    currentAmount: 300000,
    weeklyTarget: 500000,
    weeklyTargetHistory: [
      { target: 100000, effectiveFromWeek: '2026-08-24' },
      { target: 500000, effectiveFromWeek: '2026-09-14' }
    ],
    transactions: [
      { id: 1701, amount: 100000, type: 'in', dateISO: '2026-08-25' },
      { id: 1702, amount: 100000, type: 'in', dateISO: '2026-09-01' },
      { id: 1703, amount: 100000, type: 'in', dateISO: '2026-09-08' }
    ]
  };
  assert(sandbox.getGoalCurrentStreak(gTargetChange, refDate) === 3, 'Previous completed weeks maintain their target: streak remains 3');
  assert(sandbox.getGoalBestStreak(gTargetChange, refDate) === 3, 'Best streak remains 3');

  console.log('\n--- GUARD 3 & TEST 18: Non-numeric goal ID produces valid deterministic 32-bit ID ---');
  const stringId = 'custom_goal_uuid_9999';
  const baseId = sandbox.getGoalNotificationBaseId(stringId);
  const reminderId = sandbox.getGoalReminderNotificationId(stringId);
  const completionId = sandbox.getGoalCompletionNotificationId(stringId);
  assert(typeof baseId === 'number' && Number.isInteger(baseId), 'Base ID is an integer');
  assert(baseId > 0 && baseId < 200000000, 'Base ID is within safe 32-bit positive integer range');
  assert(reminderId > 0 && reminderId < 2147483647, 'Reminder ID fits in 32-bit signed int');
  assert(completionId > 0 && completionId < 2147483647, 'Completion ID fits in 32-bit signed int');
  assert(sandbox.getGoalNotificationBaseId(stringId) === baseId, 'Hash is deterministic');

  console.log('\n--- GUARD 4 & TEST 19: Completion notification cannot repeat after withdraw -> deposit recrossing ---');
  const gRecross = {
    id: 19,
    name: 'Volatile Goal',
    targetAmount: 5000000,
    currentAmount: 0,
    weeklyTarget: 100000,
    weeklyTargetHistory: [{ target: 100000, effectiveFromWeek: sandbox.getLocalWeekKey() }],
    transactions: [],
    lastCompletedNoticeWeek: null
  };
  scheduledNotifications = [];
  await sandbox.NotificationService.checkAndNotifyCompletion(gRecross, 0, 100000);
  assert(scheduledNotifications.length === 1, 'First crossing triggers notification');
  assert(gRecross.lastCompletedNoticeWeek === sandbox.getLocalWeekKey(), 'Notice week marked');

  // User withdraws: net becomes 50k
  // User deposits again: net becomes 120k (50k -> 120k)
  await sandbox.NotificationService.checkAndNotifyCompletion(gRecross, 50000, 120000);
  assert(scheduledNotifications.length === 1, 'Recrossing in same week does NOT trigger second notification');

  console.log('\n--- TEST 20: Backup Export & Restore preserves notification settings & weeklyTargetHistory ---');
  const backupPayload = {
    goals: [gTargetChange],
    emergency: { balance: 100000, transactions: [] },
    settings: {
      darkMode: 'dark',
      goalNotifications: { enabled: true, reminderDay: 'minggu', reminderTime: '20:00' }
    }
  };
  storage['savings_app_v3'] = JSON.stringify(backupPayload);
  const loadedData = sandbox.getData();
  assert(loadedData.settings.goalNotifications.enabled === true, 'Backup preserves goalNotifications.enabled');
  assert(loadedData.settings.goalNotifications.reminderDay === 'minggu', 'Backup preserves reminderDay');
  assert(loadedData.goals[0].weeklyTargetHistory.length === 2, 'Backup preserves weeklyTargetHistory');

  console.log('\n--- TEST 21: UI HTML Output Check ---');
  const streakHtml = sandbox.renderSavingsStreakDetailHtml(g1);
  assert(streakHtml.includes('STREAK NABUNG'), 'Detail HTML includes STREAK NABUNG header');
  assert(streakHtml.includes('Streak Saat Ini'), 'Detail HTML includes Streak Saat Ini');
  assert(streakHtml.includes('Streak Terbaik'), 'Detail HTML includes Streak Terbaik');
  assert(!streakHtml.includes('undefined') && !streakHtml.includes('NaN'), 'No undefined or NaN in streak HTML');

  const disabledStreakHtml = sandbox.renderSavingsStreakDetailHtml(g7);
  assert(disabledStreakHtml.includes('Atur target mingguan untuk mengaktifkan Savings Streak.'), 'Disabled state renders prompt');

  console.log('\n=====================================');
  console.log(`TOTAL: ${passed} PASSED, ${failed} FAILED`);
  console.log('=====================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('✓ ALL v1.7 SAVINGS STREAK & SMART NOTIFICATION TESTS PASSED SUCCESSFULLY!\n');
  }
}

runAllTests().catch(err => {
  console.error('Test runner failure:', err);
  process.exit(1);
});
