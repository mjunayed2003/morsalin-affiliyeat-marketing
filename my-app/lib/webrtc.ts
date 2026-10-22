/**
 * WebRTC Audio Calling Service
 * Handles STUN/TURN configuration, microphone capture, peer connection lifecycle,
 * SDP offer/answer exchanges, ICE candidate handling, and audio stream routing.
 */

export interface WebRtcCallbacks {
  onIceCandidate: (candidate: RTCIceCandidate) => void;
  onRemoteStream: (stream: MediaStream) => void;
  onConnectionStateChange: (state: RTCPeerConnectionState) => void;
  onError?: (error: Error) => void;
}

export function getIceServers(): RTCIceServer[] {
  const servers: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ];

  // Optional TURN server credentials from environment variables
  const turnUrl = process.env.NEXT_PUBLIC_TURN_URL;
  const turnUsername = process.env.NEXT_PUBLIC_TURN_USERNAME;
  const turnPassword = process.env.NEXT_PUBLIC_TURN_PASSWORD;

  if (turnUrl) {
    const turnServer: RTCIceServer = { urls: turnUrl };
    if (turnUsername) turnServer.username = turnUsername;
    if (turnPassword) turnServer.credential = turnPassword;
    servers.push(turnServer);
  }

  return servers;
}

/**
 * Capture microphone audio stream with noise suppression & echo cancellation
 */
export async function getMicrophoneAudioStream(): Promise<MediaStream> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    throw new Error('Your browser does not support audio calling (getUserMedia unavailable).');
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: false,
    });
    return stream;
  } catch (err: any) {
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      throw new Error('Microphone access was denied. Please allow microphone permissions in your browser to make or receive voice calls.');
    }
    if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      throw new Error('No microphone hardware detected on your device.');
    }
    if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
      throw new Error('Microphone is in use by another application.');
    }
    throw new Error(err.message || 'Could not access microphone.');
  }
}

/**
 * Create RTCPeerConnection with callbacks
 */
export function createPeerConnection(callbacks: WebRtcCallbacks): RTCPeerConnection {
  const config: RTCConfiguration = {
    iceServers: getIceServers(),
    iceCandidatePoolSize: 10,
  };

  const pc = new RTCPeerConnection(config);

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      callbacks.onIceCandidate(event.candidate);
    }
  };

  pc.ontrack = (event) => {
    if (event.streams && event.streams[0]) {
      callbacks.onRemoteStream(event.streams[0]);
    } else if (event.track) {
      const inboundStream = new MediaStream([event.track]);
      callbacks.onRemoteStream(inboundStream);
    }
  };

  pc.onconnectionstatechange = () => {
    callbacks.onConnectionStateChange(pc.connectionState);
  };

  pc.oniceconnectionstatechange = () => {
    if (pc.iceConnectionState === 'failed') {
      pc.restartIce();
    }
  };

  return pc;
}

/**
 * Attach local audio stream tracks to peer connection
 */
export function addStreamToPeerConnection(pc: RTCPeerConnection, stream: MediaStream) {
  stream.getAudioTracks().forEach((track) => {
    pc.addTrack(track, stream);
  });
}

/**
 * Create SDP Offer (Caller side)
 */
export async function createWebRtcOffer(pc: RTCPeerConnection): Promise<RTCSessionDescriptionInit> {
  const offer = await pc.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: false,
  });
  await pc.setLocalDescription(offer);
  return offer;
}

/**
 * Accept SDP Offer and Create SDP Answer (Receiver side)
 */
export async function createWebRtcAnswer(
  pc: RTCPeerConnection,
  offerSdp: RTCSessionDescriptionInit
): Promise<RTCSessionDescriptionInit> {
  await pc.setRemoteDescription(new RTCSessionDescription(offerSdp));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  return answer;
}

/**
 * Apply remote SDP Answer (Caller side)
 */
export async function applyWebRtcAnswer(
  pc: RTCPeerConnection,
  answerSdp: RTCSessionDescriptionInit
): Promise<void> {
  if (pc.signalingState !== 'stable') {
    await pc.setRemoteDescription(new RTCSessionDescription(answerSdp));
  }
}

/**
 * Add incoming ICE Candidate or queue if remote description isn't set yet
 */
export async function addIceCandidateSafely(
  pc: RTCPeerConnection,
  candidate: RTCIceCandidateInit,
  queue: RTCIceCandidateInit[]
): Promise<void> {
  try {
    if (pc.remoteDescription && pc.remoteDescription.type) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } else {
      queue.push(candidate);
    }
  } catch (e) {
    console.warn('ICE candidate addition skipped or delayed:', e);
  }
}

/**
 * Drain queued ICE candidates once remote description is set
 */
export async function drainIceCandidateQueue(
  pc: RTCPeerConnection,
  queue: RTCIceCandidateInit[]
): Promise<void> {
  while (queue.length > 0) {
    const cand = queue.shift();
    if (cand) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(cand));
      } catch (e) {
        console.warn('Queued ICE candidate application notice:', e);
      }
    }
  }
}

/**
 * Full WebRTC resource cleanup
 */
export function cleanupWebRtc(
  pc: RTCPeerConnection | null,
  localStream: MediaStream | null,
  remoteAudioElement?: HTMLAudioElement | null
) {
  if (localStream) {
    try {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
    } catch {}
  }

  if (pc) {
    try {
      pc.ontrack = null;
      pc.onicecandidate = null;
      pc.onconnectionstatechange = null;
      pc.oniceconnectionstatechange = null;
      pc.close();
    } catch {}
  }

  if (remoteAudioElement) {
    try {
      remoteAudioElement.srcObject = null;
    } catch {}
  }
}

/**
 * Toggle microphone mute state on local stream
 */
export function toggleMicrophone(localStream: MediaStream | null, enabled?: boolean): boolean {
  if (!localStream) return false;
  let active = false;
  localStream.getAudioTracks().forEach((track) => {
    track.enabled = enabled !== undefined ? enabled : !track.enabled;
    active = track.enabled;
  });
  return active;
}
