'use client';

import React from 'react';
import { 
  FaPhone, 
  FaPhoneSlash, 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaVolumeHigh,
  FaShieldHalved
} from 'react-icons/fa6';
import { AudioCallState } from '@/app/types';

interface AudioCallModalProps {
  callState: AudioCallState | null;
  onAccept: () => void;
  onReject: () => void;
  onEnd: () => void;
  onToggleMute: () => void;
}

export const AudioCallModal: React.FC<AudioCallModalProps> = ({
  callState,
  onAccept,
  onReject,
  onEnd,
  onToggleMute,
}) => {
  if (!callState) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isIncoming = callState.status === 'incoming';
  const isCalling = callState.status === 'calling';
  const isConnected = callState.status === 'connected';

  return (
    <div className="fixed inset-0 z-70 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-slate-900 border border-emerald-500/30 w-full max-w-sm rounded-3xl p-6 text-white text-center shadow-2xl overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-[#1b3b2b]/50 rounded-full blur-3xl pointer-events-none" />

        {/* Top Status */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold mb-6">
          <FaShieldHalved className="w-3.5 h-3.5" />
          <span>FreeProducts.online Audio Call</span>
        </div>

        {/* Caller Avatar & Ringing Animation */}
        <div className="relative w-28 h-28 mx-auto mb-5 flex items-center justify-center">
          {(isIncoming || isCalling) && (
            <>
              <span className="absolute inset-0 rounded-full border-2 border-emerald-400/50 animate-ping opacity-60" />
              <span className="absolute -inset-2 rounded-full border border-emerald-400/30 animate-pulse" />
            </>
          )}

          {isConnected && (
            <div className="absolute -inset-2 rounded-full border-2 border-emerald-500/40 animate-pulse" />
          )}

          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1b3b2b] to-emerald-950 border-2 border-emerald-400 flex items-center justify-center shadow-lg text-white">
            <FaVolumeHigh className="w-10 h-10 text-emerald-300" />
          </div>
        </div>

        {/* Caller Information */}
        <h3 className="text-xl font-bold tracking-tight text-white mb-1">
          {callState.callerName || 'Support Desk'}
        </h3>
        <p className="text-xs text-slate-400 mb-6 font-mono">
          {isIncoming && 'Incoming Audio Call...'}
          {isCalling && 'Calling Support Desk...'}
          {isConnected && (
            <span className="text-emerald-400 font-bold">
              Connected • {formatDuration(callState.durationSeconds)}
            </span>
          )}
        </p>

        {/* Connected Voice Waves Visualizer */}
        {isConnected && (
          <div className="flex items-center justify-center gap-1.5 h-8 mb-6">
            {[40, 75, 55, 90, 65, 80, 45, 85, 60].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-emerald-400 rounded-full animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDelay: `${i * 120}ms`,
                  animationDuration: '800ms',
                }}
              />
            ))}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-5 pt-2">
          {/* Case 1: Incoming Call (Accept / Decline) */}
          {isIncoming && (
            <>
              <button
                type="button"
                onClick={onReject}
                className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-rose-950/40 cursor-pointer transition-all"
                title="Decline Call"
              >
                <FaPhoneSlash className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onAccept}
                className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-emerald-950/40 cursor-pointer transition-all animate-bounce"
                title="Accept Call"
              >
                <FaPhone className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Case 2: Calling / Outgoing (Cancel) */}
          {isCalling && (
            <button
              type="button"
              onClick={onEnd}
              className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-rose-950/40 cursor-pointer transition-all"
              title="Cancel Call"
            >
              <FaPhoneSlash className="w-5 h-5" />
            </button>
          )}

          {/* Case 3: Connected (Mute / End Call) */}
          {isConnected && (
            <>
              <button
                type="button"
                onClick={onToggleMute}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                  callState.isMuted
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
                title={callState.isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {callState.isMuted ? (
                  <FaMicrophoneSlash className="w-5 h-5" />
                ) : (
                  <FaMicrophone className="w-5 h-5" />
                )}
              </button>

              <button
                type="button"
                onClick={onEnd}
                className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-rose-950/40 cursor-pointer transition-all"
                title="End Call"
              >
                <FaPhoneSlash className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
