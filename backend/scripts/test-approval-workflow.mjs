import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../dist/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const API_URL = 'http://localhost:3001/api';
const SOCKET_URL = 'http://localhost:3001';

let io;
try {
  const mod = await import('../../my-app/node_modules/socket.io-client/build/esm/index.js');
  io = mod.io;
} catch {}

// Colors for output
const green = (t) => `\x1b[32m${t}\x1b[0m`;
const red = (t) => `\x1b[31m${t}\x1b[0m`;
const cyan = (t) => `\x1b[36m${t}\x1b[0m`;
const bold = (t) => `\x1b[1m${t}\x1b[0m`;

let passedCount = 0;
let failedCount = 0;


function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ${green('✓')} ${testName}`);
    passedCount++;
  } else {
    console.error(`  ${red('✗')} ${testName}: ${details}`);
    failedCount++;
  }
}

async function runTests() {
  console.log(bold('\n======================================================'));
  console.log(bold('🚀 STARTING ADMIN APPROVAL WORKFLOW INTEGRATION TESTS'));
  console.log(bold('======================================================\n'));

  const timestamp = Date.now();
  const testPhonePending = `+1212${Math.floor(1000000 + Math.random() * 9000000)}`;
  const testEmailPending = `pending_applicant_${timestamp}@test.com`;
  const testPhoneReject = `+1312${Math.floor(1000000 + Math.random() * 9000000)}`;
  const testEmailReject = `reject_applicant_${timestamp}@test.com`;
  const testPassword = 'Password123!';

  let adminToken = '';
  let pendingUserId = '';
  let rejectUserId = '';

  // Step 0: Connect Socket.IO to verify real-time events
  let socket = null;
  const socketEvents = [];
  if (io) {
    console.log(cyan('Connecting Socket.IO client...'));
    socket = io(SOCKET_URL, { transports: ['websocket'] });
    socket.on('registration:pending', (data) => socketEvents.push({ event: 'registration:pending', data }));
    socket.on('registration:approved', (data) => socketEvents.push({ event: 'registration:approved', data }));
    socket.on('registration:rejected', (data) => socketEvents.push({ event: 'registration:rejected', data }));
    await new Promise((r) => setTimeout(r, 600));
  }

  // =========================================================================
  // TEST 1: Register new user -> receives default status PENDING, no active token
  // =========================================================================
  console.log(cyan('\n--- Test 1: New User Registration Default Status ---'));
  const regRes = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Alice Approval Test',
      phone: testPhonePending,
      email: testEmailPending,
      password: testPassword,
      address: '742 Evergreen Terrace',
      city: 'New York',
    }),
  });

  const regData = await regRes.json();
  assert(regRes.status === 201 || regRes.status === 200, 'Registration endpoint responds 200/201');
  assert(regData.status === 'PENDING', 'New registered user receives PENDING status');
  assert(regData.token === null, 'No session JWT token issued for pending user');
  assert(
    regData.message.includes('awaiting admin review'),
    'Confirmation message states registration is awaiting admin review'
  );
  pendingUserId = regData.user?.id;

  // =========================================================================
  // TEST 2: Pending user cannot log in
  // =========================================================================
  console.log(cyan('\n--- Test 2: Login Blocked for PENDING Account ---'));
  const loginPendingRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phoneOrEmail: testEmailPending,
      password: testPassword,
    }),
  });

  const loginPendingData = await loginPendingRes.json();
  assert(loginPendingRes.status === 401, 'Login fails with HTTP 401 Unauthorized');
  assert(
    loginPendingData.message.toLowerCase().includes('pending') ||
    loginPendingData.message.toLowerCase().includes('awaiting admin review'),
    'Login error message explains account is awaiting administrator approval'
  );

  // =========================================================================
  // TEST 3: Public / Safe registration status checker
  // =========================================================================
  console.log(cyan('\n--- Test 3: Public Registration Status Checker ---'));
  const statusCheckRes = await fetch(
    `${API_URL}/auth/registration-status?identifier=${encodeURIComponent(testEmailPending)}`
  );
  const statusCheckData = await statusCheckRes.json();
  assert(statusCheckRes.ok, 'Status checker responds 200 OK');
  assert(statusCheckData.status === 'PENDING', 'Status checker correctly reports PENDING');
  assert(!statusCheckData.password, 'Password hash is NEVER exposed in status check');

  // =========================================================================
  // TEST 4: Existing Admin Log in (Existing user compatibility)
  // =========================================================================
  console.log(cyan('\n--- Test 4: Existing Admin Login & Permissions Preservation ---'));
  const adminEmail = 'admin@freeproducts.online';
  const adminPassword = 'AdminPassword123!';
  const hashedAdminPassword = bcrypt.hashSync(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedAdminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
    create: {
      name: 'Super Admin Test',
      email: adminEmail,
      phone: '+18005550199',
      password: hashedAdminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      verified: true,
    },
  });

  const adminRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phoneOrEmail: adminEmail,
      password: adminPassword,
    }),
  });

  const adminData = await adminRes.json();
  assert(adminRes.ok && Boolean(adminData.token), 'Existing Administrator logs in successfully without lockout');
  adminToken = adminData.token;

  // =========================================================================
  // TEST 5: Admin reviews pending registrations list and count
  // =========================================================================
  console.log(cyan('\n--- Test 5: Admin Views Pending Registrations List & Count ---'));
  const countRes = await fetch(`${API_URL}/users/pending/count`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const countData = await countRes.json();
  assert(countRes.ok && typeof countData.count === 'number' && countData.count >= 1, 'Admin gets pending count >= 1');

  const pendingListRes = await fetch(`${API_URL}/users/pending`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const pendingListData = await pendingListRes.json();
  assert(pendingListRes.ok, 'Admin retrieves pending registrations table');
  const foundUser = pendingListData.users?.find((u) => u.id === pendingUserId);
  assert(Boolean(foundUser), 'Newly registered user appears in admin pending queue');
  assert(foundUser?.status === 'PENDING', 'User status in queue is confirmed PENDING');

  // =========================================================================
  // TEST 6: Admin approves user -> status ACTIVE -> user can log in
  // =========================================================================
  console.log(cyan('\n--- Test 6: Admin Approves User Registration ---'));
  const approveRes = await fetch(`${API_URL}/users/${pendingUserId}/approve`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const approveData = await approveRes.json();
  assert(approveRes.ok, 'Admin approve endpoint returns 200 OK');
  assert(approveData.user?.status === 'ACTIVE', 'Approved user status changed to ACTIVE');
  assert(Boolean(approveData.user?.reviewedAt), 'Review timestamp (reviewedAt) recorded');
  assert(Boolean(approveData.user?.reviewedBy), 'Reviewer identity (reviewedBy) recorded');

  // Test login for now-approved user:
  const loginApprovedRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phoneOrEmail: testEmailPending,
      password: testPassword,
    }),
  });
  const loginApprovedData = await loginApprovedRes.json();
  assert(loginApprovedRes.ok, 'Now-approved user can log in successfully');
  assert(loginApprovedData.token && loginApprovedData.user?.status === 'ACTIVE', 'Valid session JWT token issued for approved user');

  // =========================================================================
  // TEST 7: Register User B & Reject -> status REJECTED -> blocked login with reason
  // =========================================================================
  console.log(cyan('\n--- Test 7: Admin Rejects User Registration ---'));
  const regRejectRes = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Bob Rejection Test',
      phone: testPhoneReject,
      email: testEmailReject,
      password: testPassword,
    }),
  });
  const regRejectData = await regRejectRes.json();
  rejectUserId = regRejectData.user?.id;
  assert(regRejectData.status === 'PENDING', 'User B registered with PENDING status');

  const rejectionReason = 'Selfie photo blurry and does not match identity document';
  const rejectRes = await fetch(`${API_URL}/users/${rejectUserId}/reject`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason: rejectionReason }),
  });
  const rejectData = await rejectRes.json();
  assert(rejectRes.ok, 'Admin reject endpoint returns 200 OK');
  assert(rejectData.user?.status === 'REJECTED', 'User B status changed to REJECTED');
  assert(rejectData.user?.rejectionReason === rejectionReason, 'Rejection reason successfully persisted');

  // Attempt login for rejected user:
  const loginRejectRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phoneOrEmail: testEmailReject,
      password: testPassword,
    }),
  });
  const loginRejectData = await loginRejectRes.json();
  assert(loginRejectRes.status === 401, 'Login for REJECTED user blocked with 401');
  assert(
    loginRejectData.message.includes('not approved') && loginRejectData.message.includes(rejectionReason),
    'Login error informs user registration was not approved with specific reason'
  );

  // =========================================================================
  // TEST 8: Authorization Enforcement: Non-admins blocked from review APIs
  // =========================================================================
  console.log(cyan('\n--- Test 8: Non-Admin Authorization Guard Enforcement ---'));
  const nonAdminToken = loginApprovedData.token;

  const unauthorizedPendingRes = await fetch(`${API_URL}/users/pending`, {
    headers: { Authorization: `Bearer ${nonAdminToken}` },
  });
  assert(unauthorizedPendingRes.status === 403, 'Non-admin blocked from listing pending registrations (403)');

  const unauthorizedApproveRes = await fetch(`${API_URL}/users/${rejectUserId}/approve`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${nonAdminToken}` },
  });
  assert(unauthorizedApproveRes.status === 403, 'Non-admin blocked from approving registrations (403)');

  const unauthenticatedApproveRes = await fetch(`${API_URL}/users/${rejectUserId}/approve`, {
    method: 'PATCH',
  });
  assert(unauthenticatedApproveRes.status === 401, 'Unauthenticated user blocked with 401');

  if (socket) socket.disconnect();
  await prisma.$disconnect();

  // Summary
  console.log(bold('\n======================================================'));
  console.log(bold(`TEST RESULTS: ${green(passedCount + ' PASSED')}, ${failedCount > 0 ? red(failedCount + ' FAILED') : '0 FAILED'}`));
  console.log(bold('======================================================\n'));

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error(red('Test execution failed:'), err);
  process.exit(1);
});
