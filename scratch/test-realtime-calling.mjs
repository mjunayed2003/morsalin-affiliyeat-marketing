import { io } from 'socket.io-client';

const BACKEND_URL = 'http://localhost:3001';

async function runTests() {
  console.log('🧪 Starting Chat Real-time Delivery, Seen Status & WebRTC Calling Test...');

  // 1. Create Customer Socket
  const customerSocket = io(BACKEND_URL, {
    transports: ['websocket'],
    forceNew: true,
  });

  // 2. Create Admin Socket
  const adminSocket = io(BACKEND_URL, {
    transports: ['websocket'],
    forceNew: true,
  });

  await Promise.all([
    new Promise((resolve) => customerSocket.on('connect', resolve)),
    new Promise((resolve) => adminSocket.on('connect', resolve)),
  ]);

  console.log('✅ Both sockets connected to Socket.IO successfully.');

  // Join rooms
  const custUserId = 'test_cust_' + Date.now();
  customerSocket.emit('joinRoom', { userId: custUserId });
  adminSocket.emit('joinRoom', { roomId: 'admin_room' });

  await new Promise((r) => setTimeout(r, 600));

  // TEST 1: Send Message & Status Flow (Sent -> Delivered -> Seen)
  console.log('\n--- TEST 1: Message Flow (Sent -> Delivered -> Seen) ---');
  let deliveredPromiseResolve;
  const deliveredPromise = new Promise((resolve) => {
    deliveredPromiseResolve = resolve;
  });

  let seenPromiseResolve;
  const seenPromise = new Promise((resolve) => {
    seenPromiseResolve = resolve;
  });

  customerSocket.on('messageDelivered', (data) => {
    console.log('📬 Customer received messageDelivered event:', data);
    deliveredPromiseResolve(data);
  });

  customerSocket.on('messageSeen', (data) => {
    console.log('👀 Customer received messageSeen event:', data);
    seenPromiseResolve(data);
  });

  customerSocket.on('messagesRead', (data) => {
    console.log('👀 Customer received messagesRead event:', data);
    seenPromiseResolve(data);
  });

  const sentMessage = await new Promise((resolve) => {
    customerSocket.emit(
      'sendMessage',
      {
        sender: 'customer',
        senderName: 'Test Customer',
        text: 'Hello, this is a test message for read receipts!',
        userId: custUserId,
      },
      (ack) => resolve(ack)
    );
  });

  console.log('📤 Message Sent acknowledgement received:', {
    id: sentMessage.id,
    status: sentMessage.status,
    sender: sentMessage.sender,
  });

  if (sentMessage.status !== 'SENT') {
    throw new Error(`Expected initial status SENT, got: ${sentMessage.status}`);
  }

  // Admin marks message as delivered
  console.log('🚚 Admin emitting messageDelivered...');
  adminSocket.emit('messageDelivered', {
    ids: [sentMessage.id],
    userId: custUserId,
  });

  const deliveredData = await deliveredPromise;
  if (!deliveredData.ids.includes(sentMessage.id)) {
    throw new Error('Delivered event does not include sent message ID');
  }
  console.log('✅ Message successfully transitioned to DELIVERED!');

  // Admin opens conversation and marks message as seen
  console.log('👀 Admin emitting markAsSeen (opening thread)...');
  adminSocket.emit('markAsSeen', {
    ids: [sentMessage.id],
    userId: custUserId,
  });

  const seenData = await seenPromise;
  if (!seenData.ids.includes(sentMessage.id)) {
    throw new Error('Seen event does not include sent message ID');
  }
  console.log('✅ Message successfully transitioned to SEEN with seenAt:', seenData.seenAt);

  // TEST 2: Voice Calling WebRTC Signaling Flow
  console.log('\n--- TEST 2: WebRTC Voice Calling Signaling Flow ---');

  let incomingCallPromiseResolve;
  const incomingCallPromise = new Promise((resolve) => {
    incomingCallPromiseResolve = resolve;
  });

  let webrtcOfferPromiseResolve;
  const webrtcOfferPromise = new Promise((resolve) => {
    webrtcOfferPromiseResolve = resolve;
  });

  let callAcceptedPromiseResolve;
  const callAcceptedPromise = new Promise((resolve) => {
    callAcceptedPromiseResolve = resolve;
  });

  let webrtcAnswerPromiseResolve;
  const webrtcAnswerPromise = new Promise((resolve) => {
    webrtcAnswerPromiseResolve = resolve;
  });

  let iceCandidatePromiseResolve;
  const iceCandidatePromise = new Promise((resolve) => {
    iceCandidatePromiseResolve = resolve;
  });

  let callEndedPromiseResolve;
  const callEndedPromise = new Promise((resolve) => {
    callEndedPromiseResolve = resolve;
  });

  adminSocket.on('incomingAudioCall', (callData) => {
    console.log('📞 Admin received incomingAudioCall:', callData);
    incomingCallPromiseResolve(callData);
  });

  adminSocket.on('webrtcOffer', (offerData) => {
    console.log('📡 Admin received webrtcOffer:', { callId: offerData.callId, hasSdp: Boolean(offerData.sdp) });
    webrtcOfferPromiseResolve(offerData);
  });

  customerSocket.on('audioCallAccepted', (data) => {
    console.log('📞 Customer received audioCallAccepted:', data);
    callAcceptedPromiseResolve(data);
  });

  customerSocket.on('webrtcAnswer', (answerData) => {
    console.log('📡 Customer received webrtcAnswer:', { callId: answerData.callId, hasSdp: Boolean(answerData.sdp) });
    webrtcAnswerPromiseResolve(answerData);
  });

  adminSocket.on('webrtcIceCandidate', (candData) => {
    console.log('🧊 Admin received webrtcIceCandidate:', { callId: candData.callId, candidate: candData.candidate });
    iceCandidatePromiseResolve(candData);
  });

  customerSocket.on('audioCallEnded', (data) => {
    console.log('📞 Customer received audioCallEnded:', data);
    callEndedPromiseResolve(data);
  });

  // Customer starts audio call
  const testCallId = `call_test_${Date.now()}`;
  console.log('📞 Customer initiating audio call...');
  customerSocket.emit('startAudioCall', {
    callId: testCallId,
    callerName: 'Test Customer',
    callerRole: 'customer',
  });

  const incomingCallData = await incomingCallPromise;
  console.log('✅ Admin received incoming call notification for call:', incomingCallData.callId);

  // Customer emits SDP offer
  console.log('📡 Customer sending WebRTC Offer...');
  customerSocket.emit('webrtcOffer', {
    callId: incomingCallData.callId,
    sdp: { type: 'offer', sdp: 'v=0\r\no=- 123456 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\nm=audio 50000 RTP/AVP 111\r\n' },
  });

  const offerData = await webrtcOfferPromise;
  console.log('✅ Admin received WebRTC Offer successfully.');

  // Admin accepts audio call
  console.log('📞 Admin accepting audio call...');
  adminSocket.emit('acceptAudioCall', {
    callId: incomingCallData.callId,
    callerId: custUserId,
  });

  await callAcceptedPromise;
  console.log('✅ Customer received call accepted notification!');

  // Admin emits SDP answer
  console.log('📡 Admin sending WebRTC Answer...');
  adminSocket.emit('webrtcAnswer', {
    callId: incomingCallData.callId,
    sdp: { type: 'answer', sdp: 'v=0\r\no=- 654321 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\nm=audio 50000 RTP/AVP 111\r\n' },
  });

  await webrtcAnswerPromise;
  console.log('✅ Customer received WebRTC Answer successfully.');

  // Customer sends ICE Candidate
  console.log('🧊 Customer sending WebRTC ICE Candidate...');
  customerSocket.emit('webrtcIceCandidate', {
    callId: incomingCallData.callId,
    candidate: { candidate: 'candidate:1 1 UDP 2130706431 192.168.1.1 50000 typ host', sdpMid: '0', sdpMLineIndex: 0 },
  });

  await iceCandidatePromise;
  console.log('✅ Admin received WebRTC ICE Candidate successfully.');

  // Admin ends audio call
  console.log('📞 Admin ending audio call...');
  adminSocket.emit('endAudioCall', {
    callId: incomingCallData.callId,
    durationSeconds: 15,
  });

  const endData = await callEndedPromise;
  console.log('✅ Customer received audioCallEnded event with duration:', endData.durationSeconds);

  // Clean up sockets
  customerSocket.disconnect();
  adminSocket.disconnect();

  console.log('\n🎉 ALL REAL-TIME SEEN RECEIPT & WEBRTC CALLING TESTS PASSED PERFECTLY!\n');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
