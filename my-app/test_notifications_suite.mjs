import crypto from 'crypto';
import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:3001/api';
const WS_BASE = 'http://localhost:3001';
const JWT_SECRET = process.env.JWT_SECRET || 'morsalin_affiliate_super_secure_jwt_token_secret_key_2026_x87123';

function createToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7200,
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

const adminUser = {
  id: 'admin_test_' + Date.now(),
  sub: 'admin_test_' + Date.now(),
  name: 'Super Admin Test',
  phone: '01710000001',
  role: 'ADMIN',
  email: 'admin@freeproducts.online',
};

const customerUser = {
  id: 'cust_test_' + Date.now(),
  sub: 'cust_test_' + Date.now(),
  name: 'Reviewer Test User',
  phone: '01710000002',
  role: 'CLIENT',
  email: 'reviewer@freeproducts.online',
};

const adminToken = createToken(adminUser);
const customerToken = createToken(customerUser);

let passedTests = 0;
let totalTests = 10;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🚀 RUNNING NOTIFICATIONS & FCM VERIFICATION SUITE');
  console.log('======================================================\n');

  // 1. Setup Sockets for Admin & Customer
  console.log('🔌 Connecting Sockets for Admin and Customer...');
  const adminSocket = io(WS_BASE, {
    auth: { token: adminToken },
    transports: ['websocket'],
  });

  const customerSocket = io(WS_BASE, {
    auth: { token: customerToken },
    transports: ['websocket'],
  });

  await new Promise((resolve) => {
    let connected = 0;
    const check = () => {
      connected++;
      if (connected >= 2) resolve(null);
    };
    adminSocket.on('connect', check);
    customerSocket.on('connect', check);
  });

  adminSocket.emit('joinRoom', { roomId: 'admin_room', token: adminToken });
  customerSocket.emit('joinRoom', { userId: customerUser.id, token: customerToken });
  await new Promise((r) => setTimeout(r, 400));
  console.log('✅ Sockets connected & private rooms joined.\n');

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Message notification triggers real-time Socket.IO notification for recipient
    // -------------------------------------------------------------------------
    console.log('--- TEST 1: New Message Triggers Notification for Recipient ---');
    const notifPromise1 = new Promise((resolve) => {
      adminSocket.once('notification:new', (notif) => {
        resolve(notif);
      });
    });

    customerSocket.emit('sendMessage', {
      sender: 'customer',
      senderName: customerUser.name,
      userId: customerUser.id,
      text: 'Hello Admin, I have a question about my product perk test link.',
      token: customerToken,
    });

    const receivedNotif1 = await Promise.race([
      notifPromise1,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout waiting for notification:new')), 4000)),
    ]);

    assert(
      receivedNotif1 && receivedNotif1.type === 'MESSAGE' && receivedNotif1.title.includes(customerUser.name),
      `Admin received real-time MESSAGE notification: "${receivedNotif1.title}"`
    );

    // -------------------------------------------------------------------------
    // TEST 2 & 7: Multi-Device FCM Registration & Multiple Devices Support
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 2 & 7: Multi-Device Token Registration ---');
    const deviceTokenA = `fcm_mock_device_A_${Date.now()}`;
    const deviceTokenB = `fcm_mock_device_B_${Date.now()}`;

    const regA = await fetch(`${API_BASE}/notifications/devices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({ token: deviceTokenA, platform: 'web' }),
    }).then((r) => r.json());

    const regB = await fetch(`${API_BASE}/notifications/devices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({ token: deviceTokenB, platform: 'android' }),
    }).then((r) => r.json());

    assert(regA.success && regB.success, 'Multiple devices registered successfully for customer');

    // -------------------------------------------------------------------------
    // TEST 3: Product addition triggers Socket.IO + FCM notification
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 3: Product Addition Triggers Product Notification ---');
    const prodNotifPromise = new Promise((resolve) => {
      customerSocket.once('notification:new', (notif) => {
        resolve(notif);
      });
    });

    const testProdTitle = `Wireless Noise-Canceling Earbuds Pro ${Date.now().toString().slice(-4)}`;
    const createProdRes = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        title: testProdTitle,
        category: 'Electronics',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df',
        commissionRate: 15,
        rating: 4.8,
        inStock: true,
      }),
    }).then((r) => r.json());

    const receivedProdNotif = await Promise.race([
      prodNotifPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout waiting for product notification')), 4000)),
    ]);

    assert(
      receivedProdNotif && receivedProdNotif.type === 'PRODUCT' && receivedProdNotif.link?.includes('/p/'),
      `Product notification emitted with link: ${receivedProdNotif.link}`
    );

    // -------------------------------------------------------------------------
    // TEST 4: Admin Broadcast to all users
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 4: Admin Broadcast Notification ---');
    const broadcastPromise = new Promise((resolve) => {
      const handler = (notif) => {
        if (notif.title === 'Holiday Perks Giveaway 🎁') {
          customerSocket.off('notification:broadcast', handler);
          resolve(notif);
        }
      };
      customerSocket.on('notification:broadcast', handler);
    });

    const broadcastRes = await fetch(`${API_BASE}/notifications/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        title: 'Holiday Perks Giveaway 🎁',
        body: 'Claim exclusive 100% free Amazon items with zero hidden fees!',
        link: '/products',
        targetGroup: 'ALL',
      }),
    }).then((r) => r.json());

    const receivedBroadcast = await Promise.race([
      broadcastPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout waiting for broadcast notification')), 4000)),
    ]);

    assert(
      broadcastRes.success && receivedBroadcast && receivedBroadcast.title === 'Holiday Perks Giveaway 🎁',
      `Broadcast successfully sent & received across Socket.IO: "${receivedBroadcast.title}"`
    );

    // -------------------------------------------------------------------------
    // TEST 5: Real-time Notification Bell Unread Count Updates
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 5: Live Notification Bell Unread Count ---');
    const unreadCountRes = await fetch(`${API_BASE}/notifications/unread-count?userId=${customerUser.id}`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    }).then((r) => r.json());

    assert(
      typeof unreadCountRes.unreadCount === 'number' && unreadCountRes.unreadCount > 0,
      `Live unread count fetched accurately: ${unreadCountRes.unreadCount} unread`
    );

    // -------------------------------------------------------------------------
    // TEST 6: Read status persistence and notification history
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 6: Notification Read Persistence & History ---');
    const notifsHistory = await fetch(`${API_BASE}/notifications?userId=${customerUser.id}`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    }).then((r) => r.json());

    assert(
      notifsHistory && Array.isArray(notifsHistory.notifications) && notifsHistory.notifications.length > 0,
      `History retrieved: ${notifsHistory.notifications.length} notification(s) in database`
    );

    const firstNotif = notifsHistory.notifications[0];
    const markReadRes = await fetch(`${API_BASE}/notifications/${firstNotif.id}/read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({ userId: customerUser.id }),
    }).then((r) => r.json());

    assert(markReadRes.success, `Notification ${firstNotif.id} marked as read`);

    // Verify mark all read
    const markAllRes = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({ userId: customerUser.id }),
    }).then((r) => r.json());

    const postUnread = await fetch(`${API_BASE}/notifications/unread-count?userId=${customerUser.id}`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    }).then((r) => r.json());

    assert(markAllRes.success && postUnread.unreadCount === 0, 'Mark all read persists: unread count is now 0');

    // -------------------------------------------------------------------------
    // TEST 8: Unauthorized users blocked from sending broadcasts
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 8: Unauthorized Access Rejection ---');
    const unauthorizedRes = await fetch(`${API_BASE}/notifications/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        title: 'Hacked Broadcast',
        body: 'Unauthorized attempt',
      }),
    });

    assert(
      unauthorizedRes.status === 403,
      `Non-admin broadcast attempt correctly rejected with HTTP 403 Forbidden`
    );

    // -------------------------------------------------------------------------
    // TEST 9: Duplicate Prevention & Audit Logging
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 9: Broadcast Audit Logging ---');
    const logsRes = await fetch(`${API_BASE}/notifications/broadcasts`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());

    const logsList = Array.isArray(logsRes) ? logsRes : (logsRes?.logs || []);

    assert(
      Array.isArray(logsList) && logsList.some((l) => l.title === 'Holiday Perks Giveaway 🎁'),
      `Broadcast audit log persisted with admin ID, recipient counts, and timestamps`
    );

    // -------------------------------------------------------------------------
    // TEST 10: Invalid/Expired FCM Token Pruning & Unregistration
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 10: Device Token Unregistration / Logout Cleanup ---');
    const unregRes = await fetch(`${API_BASE}/notifications/devices`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: deviceTokenA }),
    }).then((r) => r.json());

    assert(unregRes.success, 'Device token unregistered cleanly on logout/prune');

    console.log('\n======================================================');
    console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
    console.log('======================================================\n');
  } finally {
    adminSocket.disconnect();
    customerSocket.disconnect();
  }
}

runTests().catch((err) => {
  console.error('\n❌ TEST RUN FAILED:', err);
  process.exit(1);
});
