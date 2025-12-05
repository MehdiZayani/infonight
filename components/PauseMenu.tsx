"use client";

import React from 'react';
import { ReputationDisplay } from './ReputationDisplay';
import { ReputationState } from '../data/reputation';

interface GameState {
  budget: number;
  scoreNIRD: number;
  dependance: number;
  currentStepId: number | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  onQuit: () => void;
  gameState: GameState;
  schoolName: string;
  directorName: string;
  reputation?: ReputationState;
  isMuted?: boolean;
  onToggleMute?: () => void;
  musicVolume?: number;
  onMusicVolumeChange?: (volume: number) => void;
  isRetroMode?: boolean;
}

export default function PauseMenu({ isOpen, onClose, onRestart, onQuit, gameState, schoolName, directorName, reputation, isMuted, onToggleMute, musicVolume = 0.4, onMusicVolumeChange, isRetroMode = false }: Props) {
  if (!isOpen) return null;

  const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));
  const score = clamp(Math.round(gameState.scoreNIRD));
  const depend = clamp(Math.round(gameState.dependance));

  const getScoreColor = (value: number) => {
    if (value >= 70) return 'from-emerald-400 to-emerald-600';
    if (value >= 40) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getDependColor = (value: number) => {
    if (value >= 70) return 'from-red-400 to-red-600';
    if (value >= 40) return 'from-orange-400 to-orange-600';
    return 'from-emerald-400 to-emerald-600';
  };

  // Mode rétro : style arcade 8-bit
  if (isRetroMode) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center pixel-font">
        {/* Backdrop with scanlines */}
        <div className="absolute inset-0 bg-black/90" onClick={onClose}>
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.8) 2px, rgba(0, 0, 0, 0.8) 4px)'
            }}
          />
        </div>

        {/* Retro arcade menu */}
        <div className="relative animate-in zoom-in-95 duration-200 w-full max-w-2xl mx-4">
          {/* Pixel frame */}
          <div className="bg-black border-4 border-purple-500 p-1">
            <div className="border-2 border-cyan-400 p-4">
              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-cyan-400 mb-2 animate-pulse">⏸ PAUSE ⏸</h2>
                <p className="text-purple-300 text-sm">{schoolName}</p>
                <p className="text-green-400 text-xs">PLAYER: {directorName}</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-yellow-900 border-2 border-yellow-400 p-2 text-center">
                  <span className="text-yellow-400 text-xs block">GOLD</span>
                  <span className={`font-bold ${gameState.budget >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(gameState.budget)}
                  </span>
                </div>
                <div className="bg-green-900 border-2 border-green-400 p-2 text-center">
                  <span className="text-green-400 text-xs block">NIRD</span>
                  <span className="text-green-300 font-bold">{score}/100</span>
                </div>
                <div className="bg-orange-900 border-2 border-orange-400 p-2 text-center">
                  <span className="text-orange-400 text-xs block">DEP</span>
                  <span className="text-orange-300 font-bold">{depend}/100</span>
                </div>
              </div>

              {/* Music volume */}
              <div className="bg-purple-900 border-2 border-purple-400 p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🎵</span>
                  <span className="text-purple-300 text-sm">MUSIC VOL</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">🔇</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.round((musicVolume || 0.4) * 100)}
                    onChange={(e) => onMusicVolumeChange?.(parseInt(e.target.value) / 100)}
                    className="flex-1 h-2 bg-black rounded appearance-none cursor-pointer accent-purple-500"
                    disabled={isMuted}
                  />
                  <span className="text-purple-400">🔊</span>
                  <span className="text-purple-300 text-sm w-12 text-right">{Math.round((musicVolume || 0.4) * 100)}%</span>
                </div>
              </div>

              {/* Sound toggle */}
              {onToggleMute && (
                <button
                  onClick={onToggleMute}
                  className="w-full bg-cyan-900 border-2 border-cyan-400 p-2 mb-2 flex items-center justify-between hover:bg-cyan-800 transition-all"
                >
                  <span className="text-cyan-300">{isMuted ? '🔇' : '🔊'} SOUND FX</span>
                  <span className={`px-2 py-0.5 text-xs font-bold ${isMuted ? 'bg-red-600 text-red-200' : 'bg-green-600 text-green-200'}`}>
                    {isMuted ? 'OFF' : 'ON'}
                  </span>
                </button>
              )}

              {/* Menu buttons */}
              <div className="space-y-2">
                <button
                  onClick={onClose}
                  className="w-full bg-green-900 border-2 border-green-400 py-3 text-green-300 font-bold hover:bg-green-800 hover:text-green-200 transition-all active:scale-95"
                >
                  ▶ RESUME
                </button>
                <button
                  onClick={onRestart}
                  className="w-full bg-yellow-900 border-2 border-yellow-400 py-3 text-yellow-300 font-bold hover:bg-yellow-800 hover:text-yellow-200 transition-all active:scale-95"
                >
                  ↻ RESTART
                </button>
                <button
                  onClick={onQuit}
                  className="w-full bg-red-900 border-2 border-red-400 py-3 text-red-300 font-bold hover:bg-red-800 hover:text-red-200 transition-all active:scale-95"
                >
                  ✕ QUIT
                </button>
              </div>

              {/* Hint */}
              <p className="text-center text-purple-400 text-xs mt-3 animate-pulse">
                PRESS [ESC] TO RESUME
              </p>
            </div>
          </div>

          {/* Pixel corners */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-purple-500" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-500" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu - Wood style - Two columns layout */}
      <div className="relative animate-in zoom-in-95 duration-200 w-full max-w-4xl mx-4">
        {/* Main wood frame */}
        <div className="bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-3xl p-2 shadow-2xl border-4 border-amber-950">
          <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-2xl p-6">
            
            {/* Header with cyan banner */}
            <div className="relative -mt-10 mb-4">
              <div className="bg-gradient-to-b from-amber-600 to-amber-800 rounded-xl p-1 border-2 border-amber-900 mx-auto w-fit">
                <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-lg px-8 py-2">
                  <h2 className="text-xl font-bold text-white text-center">PAUSE</h2>
                </div>
              </div>
            </div>

            {/* School and director name */}
            <div className="text-center mb-4">
              <p className="text-amber-800 font-semibold">{schoolName}</p>
              <p className="text-amber-600 text-sm">Directeur: {directorName}</p>
            </div>

            {/* Two columns layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left column - Stats */}
              <div className="space-y-4">
                {/* Stats section */}
                <div className="bg-gradient-to-b from-amber-200 to-amber-300 rounded-xl p-4 border-2 border-amber-400">
                  <h3 className="text-sm font-bold text-amber-900 mb-3 text-center uppercase tracking-wide">
                    Vos Statistiques
                  </h3>
                  
                  <div className="space-y-3">
                    {/* Budget */}
                    <div className="bg-amber-100 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">💰</span>
                        <span className="font-semibold text-amber-900">Budget</span>
                      </div>
                      <span className={`font-bold text-lg ${gameState.budget >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(gameState.budget)}
                      </span>
                    </div>

                    {/* Score NIRD */}
                    <div className="bg-amber-100 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🌱</span>
                          <span className="font-semibold text-amber-900">Score NIRD</span>
                        </div>
                        <span className="font-bold text-emerald-700">{score}/100</span>
                      </div>
                      <div className="bg-amber-300 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getScoreColor(score)} transition-all`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <p className="text-xs text-amber-700 mt-1 italic">Plus c&apos;est haut, mieux c&apos;est !</p>
                    </div>

                    {/* Dépendance */}
                    <div className="bg-amber-100 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">⛓️</span>
                          <span className="font-semibold text-amber-900">Dépendance</span>
                        </div>
                        <span className={`font-bold ${depend <= 30 ? 'text-emerald-700' : depend <= 60 ? 'text-orange-600' : 'text-red-700'}`}>
                          {depend}/100
                        </span>
                      </div>
                      <div className="bg-amber-300 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getDependColor(depend)} transition-all`}
                          style={{ width: `${depend}%` }}
                        />
                      </div>
                      <p className="text-xs text-amber-700 mt-1 italic">Plus c&apos;est bas, mieux c&apos;est !</p>
                    </div>
                  </div>
                </div>

                {/* Reputation section */}
                {reputation && (
                  <div>
                    <ReputationDisplay reputation={reputation} showDetails={true} />
                  </div>
                )}
              </div>

              {/* Right column - Actions */}
              <div className="space-y-4">
                {/* Music Volume Control */}
                <div className="bg-amber-100 rounded-lg p-4 border-2 border-amber-300">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🎵</span>
                    <span className="font-semibold text-amber-900">Musique de fond</span>
                  </div>
                  
                  {/* Volume slider */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-amber-700">🔇</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={Math.round((musicVolume || 0.4) * 100)}
                      onChange={(e) => {
                        const vol = parseInt(e.target.value) / 100;
                        onMusicVolumeChange?.(vol);
                      }}
                      className="flex-1 h-2 bg-amber-300 rounded-lg appearance-none cursor-pointer accent-amber-600"
                      disabled={isMuted}
                    />
                    <span className="text-sm text-amber-700">🔊</span>
                  </div>
                  
                  {/* Volume percentage display */}
                  <div className="text-center mt-2">
                    <span className="text-sm font-bold text-amber-900">
                      {Math.round((musicVolume || 0.4) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Sound toggle */}
                {onToggleMute && (
                  <button
                    onClick={onToggleMute}
                    className="w-full bg-gradient-to-b from-amber-200 to-amber-300 rounded-xl p-3 border-2 border-amber-400 flex items-center justify-between hover:from-amber-100 hover:to-amber-200 transition-all"
                  >
                    <span className="font-semibold text-amber-900 flex items-center gap-2">
                      {isMuted ? '🔇' : '🔊'} Sons
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${isMuted ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                      {isMuted ? 'OFF' : 'ON'}
                    </span>
                  </button>
                )}

                {/* Menu buttons */}
                <div className="space-y-2">
                  {/* Resume button */}
                  <button
                    onClick={onClose}
                    className="w-full bg-gradient-to-b from-amber-600 to-amber-800 rounded-xl p-1 border-2 border-amber-900 hover:from-amber-500 hover:to-amber-700 transition-all active:scale-98"
                  >
                    <div className="bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-lg py-3 px-4">
                      <span className="font-bold text-white text-lg flex items-center justify-center gap-2">
                        Reprendre
                      </span>
                    </div>
                  </button>

                  {/* Restart button */}
                  <button
                    onClick={onRestart}
                    className="w-full bg-gradient-to-b from-amber-600 to-amber-800 rounded-xl p-1 border-2 border-amber-900 hover:from-amber-500 hover:to-amber-700 transition-all active:scale-98"
                  >
                    <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg py-3 px-4">
                      <span className="font-bold text-amber-900 flex items-center justify-center gap-2">
                        Recommencer
                      </span>
                    </div>
                  </button>

                  {/* Quit button */}
                  <button
                    onClick={onQuit}
                    className="w-full bg-gradient-to-b from-amber-600 to-amber-800 rounded-xl p-1 border-2 border-amber-900 hover:from-amber-500 hover:to-amber-700 transition-all active:scale-98"
                  >
                    <div className="bg-gradient-to-b from-red-400 to-red-600 rounded-lg py-3 px-4">
                      <span className="font-bold text-white flex items-center justify-center gap-2">
                        Quitter
                      </span>
                    </div>
                  </button>
                </div>

                {/* Keyboard hint */}
                <p className="text-center text-amber-600 text-xs">
                  Appuyez sur <kbd className="px-2 py-1 bg-amber-300 rounded text-amber-800 font-mono">Échap</kbd> pour reprendre
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative leaves */}
        <div className="absolute -top-3 -left-3 text-3xl transform -rotate-45">🌿</div>
        <div className="absolute -top-3 -right-3 text-3xl transform rotate-45">🌿</div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-2xl">🌱</div>
      </div>
    </div>
  );
}
