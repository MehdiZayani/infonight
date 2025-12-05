"use client";

import React from 'react';

interface RetroGameWrapperProps {
  children: React.ReactNode;
  isRetroMode: boolean;
}

export default function RetroGameWrapper({ children, isRetroMode }: RetroGameWrapperProps) {
  // If not in retro mode, just return children without any wrapper
  if (!isRetroMode) {
    return <>{children}</>;
  }

  // Retro mode - show arcade cabinet
  return (
    <div className="min-h-screen bg-black p-4 flex items-center justify-center">
      {/* Outer arcade cabinet frame */}
      <div className="w-full max-w-5xl">
        {/* Top marquee */}
        <div className="bg-gradient-to-r from-red-600 via-yellow-400 to-red-600 px-6 py-3 rounded-t-lg border-4 border-black">
          <p className="text-center font-bold text-black text-2xl pixel-font animate-glow-pulse">
            ► LE DÉFI NIRD ◄
          </p>
        </div>

        {/* Main screen */}
        <div className="retro-screen rounded-lg overflow-hidden">
          <div className="relative z-10">
            {children}
          </div>
          <div className="absolute inset-0 pointer-events-none z-20 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-transparent animate-scanlines" />
          </div>
        </div>

        {/* Bottom control panel */}
        <div className="bg-gray-800 border-4 border-black rounded-b-lg p-4">
          <div className="grid grid-cols-3 gap-3">
            {/* Left speaker */}
            <div className="flex justify-center">
              <div className="w-12 h-16 bg-black rounded border-2 border-red-600">
                <div className="grid grid-cols-2 gap-1 p-2 h-full">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-red-900 rounded-full opacity-60" />
                  ))}
                </div>
              </div>
            </div>

            {/* Center info */}
            <div className="flex flex-col items-center justify-center">
              <p className="text-yellow-400 text-xs font-bold pixel-font">SCORE NIRD</p>
              <p className="text-green-400 text-2xl font-bold font-mono">0000</p>
            </div>

            {/* Right speaker */}
            <div className="flex justify-center">
              <div className="w-12 h-16 bg-black rounded border-2 border-red-600">
                <div className="grid grid-cols-2 gap-1 p-2 h-full">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-red-900 rounded-full opacity-60" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer text */}
          <p className="text-center text-red-500 text-xs font-bold pixel-font mt-3">
            INSERT COIN TO CONTINUE
          </p>
        </div>
      </div>

      {/* CRT glow effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-50" />
      </div>
    </div>
  );
}
