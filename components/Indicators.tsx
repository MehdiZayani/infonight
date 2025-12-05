"use client";

import React from 'react';
import { SCENARIO } from '../data/scenario';

interface GameState {
  budget: number;
  scoreNIRD: number;
  dependance: number;
  currentStepId: number | null;
}

const formatEuro = (amount: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);

interface Props {
  gameState: GameState;
  onPause: () => void;
  schoolName: string;
  onMapToggle?: () => void;
  completedSteps?: number;
  isRetroMode?: boolean;
}

export default function Indicators({ gameState, onPause, schoolName, onMapToggle, completedSteps = 0, isRetroMode = false }: Props) {
  const currentStep = SCENARIO.find(s => s.id === gameState.currentStepId);

  // Mode rétro : style arcade 8-bit
  if (isRetroMode) {
    return (
      <div className="fixed top-0 left-0 right-0 z-40 flex flex-col items-center pixel-font">
        {/* Retro arcade bar */}
        <div className="relative mt-2 md:mt-4 mx-2 md:mx-0">
          {/* Pixel art frame */}
          <div className="relative p-1 bg-black">
            <div className="absolute inset-0 border-4 border-purple-500" style={{ imageRendering: 'pixelated' }} />
            
            {/* Scanline effect overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10 z-10"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.8) 2px, rgba(0, 0, 0, 0.8) 4px)'
              }}
            />

            <div className="relative bg-gray-900 border-2 border-cyan-400 px-3 md:px-6 py-2 md:py-4">
              <div className="flex items-center gap-2 md:gap-4">
                
                {/* School name - retro style */}
                <div className="hidden lg:flex items-center gap-2 bg-purple-900 border-2 border-purple-400 px-4 py-2">
                  <span className="text-xl">🏫</span>
                  <span className="text-purple-300 font-bold text-sm uppercase tracking-wider">{schoolName}</span>
                </div>

                {/* Separator */}
                <div className="hidden lg:block w-1 h-10 bg-cyan-400" />

                {/* Budget - coin counter style */}
                <div className="flex items-center gap-2 bg-yellow-900 border-2 border-yellow-400 px-3 py-2">
                  <span className="text-lg animate-pulse">💰</span>
                  <div className="flex flex-col">
                    <span className="text-yellow-400 text-xs uppercase">GOLD</span>
                    <span className={`font-bold text-sm tabular-nums ${gameState.budget >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatEuro(gameState.budget)}
                    </span>
                  </div>
                </div>

                {/* Progress - XP bar style */}
                <div className="hidden sm:flex items-center gap-2 bg-green-900 border-2 border-green-400 px-3 py-2">
                  <span className="text-lg">⭐</span>
                  <div className="flex flex-col">
                    <span className="text-green-400 text-xs uppercase">LEVEL</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 md:w-28 h-4 bg-black border border-green-600">
                        <div 
                          className="h-full bg-green-400 transition-all duration-300"
                          style={{ width: `${(completedSteps / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-green-300 font-bold text-sm">{completedSteps}/10</span>
                    </div>
                  </div>
                </div>

                {/* Map button - retro */}
                {onMapToggle && (
                  <button
                    onClick={onMapToggle}
                    className="flex items-center gap-1 bg-cyan-900 border-2 border-cyan-400 px-3 py-2 hover:bg-cyan-800 active:scale-95 transition-all"
                    title="Voir la carte"
                  >
                    <span className="text-lg">🗺️</span>
                    <span className="text-cyan-300 font-bold text-sm uppercase hidden md:inline">MAP</span>
                  </button>
                )}

                {/* Separator */}
                <div className="hidden md:block w-1 h-10 bg-cyan-400" />

                {/* Pause button - arcade style */}
                <button
                  onClick={onPause}
                  className="w-10 h-10 md:w-12 md:h-12 bg-red-900 border-2 border-red-400 flex items-center justify-center hover:bg-red-800 active:scale-95 transition-all"
                  title="PAUSE (ESC)"
                >
                  <span className="text-red-300 font-bold text-xl">⏸</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pixel corners */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-purple-500" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-500" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-500" />
        </div>

        {/* Retro step info bubble */}
        {currentStep && (
          <div className="relative mt-3 mx-4 max-w-2xl">
            <div className="bg-black border-4 border-cyan-400 px-4 py-3 relative">
              {/* Scanlines */}
              <div className="absolute inset-0 pointer-events-none opacity-5"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.8) 2px, rgba(0, 0, 0, 0.8) 4px)'
                }}
              />
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-900 border-2 border-purple-400 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">{currentStep.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-purple-400 text-xs">STAGE {currentStep.id}</span>
                    <span className="text-cyan-400 font-bold text-sm uppercase">{currentStep.title}</span>
                  </div>
                  <p className="text-green-300 text-xs leading-relaxed">{currentStep.description}</p>
                </div>
              </div>
              {/* Pixel pointer */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-cyan-400 rotate-45" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex flex-col items-center">
      {/* Main fantasy bar */}
      <div className="relative mt-2 md:mt-4 mx-2 md:mx-0">
        {/* Decorative vines on sides - hidden on mobile */}
        <div className="absolute -left-16 top-1/2 -translate-y-1/2 text-5xl transform -rotate-45 hidden lg:block">🌿</div>
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 text-5xl transform rotate-45 hidden lg:block">🌿</div>

        {/* Wood frame outer */}
        <div className="relative rounded-3xl p-2 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #8B4513 0%, #654321 25%, #8B4513 50%, #654321 75%, #8B4513 100%)'
          }}
        >
          {/* Inner golden frame */}
          <div className="relative rounded-2xl overflow-hidden border-3 border-amber-600/50"
            style={{
              background: 'linear-gradient(180deg, #D4A574 0%, #C4956A 50%, #B8865A 100%)',
              borderWidth: '3px'
            }}
          >
            {/* Parchment texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`
              }}
            />

            <div className="relative flex items-center gap-2 md:gap-4 px-3 md:px-6 py-2 md:py-4">
              
              {/* School name in ribbon - hidden on mobile */}
              <div className="relative hidden lg:block">
                <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-amber-700 to-amber-600"
                  style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)' }}
                />
                <div className="bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 px-6 py-2.5 rounded-sm shadow-md border-t border-amber-400/30">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏫</span>
                    <span className="text-amber-100 font-bold text-lg drop-shadow-sm">{schoolName}</span>
                  </div>
                </div>
                <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-l from-amber-700 to-amber-600"
                  style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }}
                />
              </div>

              {/* Separator - hidden on mobile */}
              <div className="hidden lg:block w-px h-14 bg-gradient-to-b from-transparent via-amber-800/50 to-transparent mx-3" />

              {/* Budget display - golden coin style (responsive) */}
              <div className="relative group">
                <div className="flex items-center gap-2 md:gap-3 bg-gradient-to-b from-amber-200 to-amber-300 rounded-xl md:rounded-2xl px-2 md:px-5 py-2 md:py-3 border-2 border-amber-600/60 shadow-inner">
                  {/* Coin icon */}
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 flex items-center justify-center border-2 md:border-3 border-yellow-600 shadow-md">
                    <span className="text-base md:text-2xl">💰</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-amber-700 text-xs md:text-sm font-medium hidden sm:block">Budget</span>
                    <span className={`font-bold text-sm md:text-xl drop-shadow-sm ${gameState.budget >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                      {formatEuro(gameState.budget)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar - green gem style (responsive) */}
              <div className="relative group hidden sm:block">
                <div className="flex items-center gap-2 md:gap-4 bg-gradient-to-b from-amber-200 to-amber-300 rounded-xl md:rounded-2xl px-2 md:px-5 py-2 md:py-3 border-2 border-amber-600/60 shadow-inner">
                  {/* Green gem icon */}
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-emerald-300 via-emerald-400 to-emerald-600 flex items-center justify-center border-2 md:border-3 border-emerald-600 shadow-md">
                    <span className="text-base md:text-2xl">🌱</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-amber-700 text-xs md:text-sm font-medium hidden md:block">Progression</span>
                    {/* Progress bar */}
                    <div className="w-20 md:w-36 h-4 md:h-6 bg-amber-900/30 rounded-full overflow-hidden border-2 border-amber-700/50">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 transition-all duration-500 relative"
                        style={{ width: `${(completedSteps / 10) * 100}%` }}
                      >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
                      </div>
                    </div>
                  </div>
                  <span className="text-amber-900 font-bold text-sm md:text-lg">{completedSteps}/10</span>
                </div>
              </div>

              {/* Map button - scroll style (responsive) */}
              {onMapToggle && (
                <button
                  onClick={onMapToggle}
                  className="relative group"
                  title="Voir la carte de l'établissement"
                >
                  <div className="flex items-center gap-1 md:gap-3 bg-gradient-to-b from-amber-200 to-amber-300 hover:from-amber-100 hover:to-amber-200 rounded-xl md:rounded-2xl px-2 md:px-5 py-2 md:py-3 border-2 border-amber-600/60 shadow-inner transition-all active:scale-95">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-400 to-cyan-600 flex items-center justify-center border-2 md:border-3 border-cyan-600 shadow-md">
                      <span className="text-base md:text-2xl">🗺️</span>
                    </div>
                    <span className="text-amber-900 font-bold text-sm md:text-lg hidden md:inline">Carte</span>
                  </div>
                </button>
              )}

              {/* Separator - hidden on small screens */}
              <div className="hidden md:block w-px h-14 bg-gradient-to-b from-transparent via-amber-800/50 to-transparent mx-1 md:mx-3" />

              {/* Pause button - gear style (responsive) */}
              <button
                onClick={onPause}
                className="relative group"
                title="Pause (Échap)"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 hover:from-amber-100 hover:to-amber-300 flex items-center justify-center border-2 md:border-3 border-amber-600 shadow-lg transition-all active:scale-95">
                  {/* Gear decoration */}
                  <div className="absolute inset-1 md:inset-1.5 rounded-full border md:border-2 border-amber-600/30" />
                  <span className="text-xl md:text-3xl">⚙️</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Decorative corner ornaments - smaller on mobile */}
        <div className="absolute -top-1 -left-1 md:-top-2 md:-left-2 text-sm md:text-xl text-amber-600 hidden sm:block">⚜️</div>
        <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-sm md:text-xl text-amber-600 hidden sm:block">⚜️</div>
        <div className="absolute -bottom-1 -left-1 md:-bottom-2 md:-left-2 text-sm md:text-xl text-amber-600 hidden sm:block">⚜️</div>
        <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 text-sm md:text-xl text-amber-600 hidden sm:block">⚜️</div>
      </div>

      {/* Cloud/Bubble with current step title and description */}
      {currentStep && (
        <div className="relative mt-3 mx-4 max-w-2xl">
          {/* Cloud shape */}
          <div className="relative">
            {/* Main cloud bubble */}
            <div className="relative bg-gradient-to-b from-white via-amber-50 to-amber-100 rounded-3xl px-6 py-4 shadow-xl border-2 border-amber-300/50"
              style={{
                boxShadow: '0 8px 32px rgba(180, 130, 80, 0.3), inset 0 2px 8px rgba(255,255,255,0.8)'
              }}
            >
              {/* Parchment texture overlay */}
              <div className="absolute inset-0 rounded-3xl opacity-10 pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`
                }}
              />

              {/* Cloud decorative bumps */}
              <div className="absolute -top-3 left-8 w-8 h-8 bg-gradient-to-b from-white to-amber-50 rounded-full border-2 border-amber-300/50 shadow-md" />
              <div className="absolute -top-4 left-20 w-10 h-10 bg-gradient-to-b from-white to-amber-50 rounded-full border-2 border-amber-300/50 shadow-md" />
              <div className="absolute -top-3 right-16 w-9 h-9 bg-gradient-to-b from-white to-amber-50 rounded-full border-2 border-amber-300/50 shadow-md" />
              <div className="absolute -top-2 right-6 w-6 h-6 bg-gradient-to-b from-white to-amber-50 rounded-full border-2 border-amber-300/50 shadow-md" />

              {/* Content */}
              <div className="relative flex items-start gap-4">
                {/* Step icon in ornate circle */}
                <div className="flex-shrink-0">
                  <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-full border-4 border-amber-500/60"
                      style={{
                        background: 'linear-gradient(180deg, rgba(251,191,36,0.4) 0%, rgba(180,83,9,0.4) 100%)'
                      }}
                    />
                    <div className="absolute inset-1 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shadow-inner">
                      <span className="text-2xl">{currentStep.icon}</span>
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-amber-300 shadow-md">
                      {currentStep.id}
                    </div>
                  </div>
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0">
                  {/* Title ribbon */}
                  <div className="relative inline-block mb-2">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-amber-600 to-amber-500"
                      style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)' }}
                    />
                    <h2 className="bg-gradient-to-b from-amber-500 to-amber-700 px-4 py-1 rounded-sm text-amber-100 font-bold text-sm shadow-md">
                      {currentStep.title}
                    </h2>
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-l from-amber-600 to-amber-500"
                      style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }}
                    />
                  </div>

                  {/* Description */}
                  <p className="text-amber-800 text-sm leading-relaxed">
                    {currentStep.description}
                  </p>
                </div>
              </div>

              {/* Pointer/tail at top center connecting to bar */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gradient-to-b from-white to-amber-50 rotate-45 border-l-2 border-t-2 border-amber-300/50" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
