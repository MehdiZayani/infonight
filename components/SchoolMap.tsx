"use client";

import React, { useState } from 'react';
import { SCENARIO } from '../data/scenario';

interface MapZone {
  id: number;
  name: string;
  icon: string;
  description: string;
  category: 'left' | 'right';
}

// Map zones corresponding to scenario steps - organized as book pages
const MAP_ZONES: MapZone[] = [
  { id: 1, name: "Équipements", icon: "💻", description: "Parc informatique", category: 'left' },
  { id: 2, name: "Logiciels", icon: "📦", description: "Suite bureautique", category: 'left' },
  { id: 3, name: "Réseau", icon: "📡", description: "Infrastructure Wi-Fi", category: 'left' },
  { id: 4, name: "ENT", icon: "🎓", description: "Espace numérique", category: 'left' },
  { id: 5, name: "Formation", icon: "👩‍🏫", description: "Personnel enseignant", category: 'left' },
  { id: 6, name: "Sécurité", icon: "🔒", description: "RGPD & données", category: 'right' },
  { id: 7, name: "Innovation", icon: "🚀", description: "Projets pédagogiques", category: 'right' },
  { id: 8, name: "Web", icon: "🌐", description: "Présence en ligne", category: 'right' },
  { id: 9, name: "Écologie", icon: "🌱", description: "Impact environnemental", category: 'right' },
  { id: 10, name: "Stratégie", icon: "🏛️", description: "Vision globale", category: 'right' },
];

interface Props {
  currentStepId: number;
  completedSteps: number[];
  onZoneClick?: (stepId: number) => void;
  isInteractive?: boolean;
  schoolName: string;
  isRetroMode?: boolean;
}

export default function SchoolMap({ currentStepId, completedSteps, onZoneClick, isInteractive = false, schoolName, isRetroMode = false }: Props) {
  const [hoveredZone, setHoveredZone] = useState<number | null>(null);

  const getZoneStatus = (zoneId: number) => {
    if (completedSteps.includes(zoneId)) return 'completed';
    if (zoneId === currentStepId) return 'current';
    if (zoneId === currentStepId + 1) return 'next';
    return 'locked';
  };

  const leftZones = MAP_ZONES.filter(z => z.category === 'left');
  const rightZones = MAP_ZONES.filter(z => z.category === 'right');

  // Retro zone card renderer
  const renderRetroZoneCard = (zone: MapZone) => {
    const status = getZoneStatus(zone.id);
    const canClick = isInteractive && (status === 'current' || status === 'completed');

    return (
      <div
        key={zone.id}
        className={`relative cursor-${canClick ? 'pointer' : 'default'} transition-all duration-200 hover:scale-105`}
        onClick={() => canClick && onZoneClick?.(zone.id)}
      >
        <div className={`
          bg-black border-2 p-2
          ${status === 'completed' ? 'border-green-400' : ''}
          ${status === 'current' ? 'border-yellow-400 animate-pulse' : ''}
          ${status === 'next' ? 'border-cyan-400' : ''}
          ${status === 'locked' ? 'border-gray-600 opacity-50' : ''}
        `}>
          {/* Icon */}
          <div className="text-center mb-1">
            <span className="text-2xl">{zone.icon}</span>
          </div>
          {/* Name */}
          <p className={`text-xs text-center font-bold uppercase
            ${status === 'completed' ? 'text-green-400' : ''}
            ${status === 'current' ? 'text-yellow-400' : ''}
            ${status === 'next' ? 'text-cyan-400' : ''}
            ${status === 'locked' ? 'text-gray-500' : ''}
          `}>
            {zone.name}
          </p>
          {/* Status badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold">
            {status === 'completed' && <span className="text-green-400">✓</span>}
            {status === 'current' && <span className="text-yellow-400">{zone.id}</span>}
            {status === 'next' && <span className="text-cyan-400">{zone.id}</span>}
            {status === 'locked' && <span className="text-gray-500">🔒</span>}
          </div>
        </div>
      </div>
    );
  };

  // Mode rétro
  if (isRetroMode) {
    return (
      <div className="relative w-full h-full min-h-[400px] flex items-center justify-center p-2 pt-14 overflow-visible pixel-font">
        {/* Background */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.8) 2px, rgba(0, 0, 0, 0.8) 4px)'
            }}
          />
        </div>

        {/* Main container */}
        <div className="relative z-10 w-full max-w-4xl">
          {/* Pixel frame */}
          <div className="bg-black border-4 border-purple-500 p-1">
            <div className="border-2 border-cyan-400 p-4">
              {/* Header */}
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold text-cyan-400 mb-1">🗺️ STAGE SELECT 🗺️</h1>
                <p className="text-purple-300 text-sm">{schoolName}</p>
              </div>

              {/* Two columns */}
              <div className="grid grid-cols-2 gap-4">
                {/* Left column */}
                <div>
                  <div className="bg-purple-900 border-2 border-purple-400 px-3 py-1 mb-3 text-center">
                    <span className="text-purple-300 text-sm font-bold">INFRASTRUCTURE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {leftZones.map(renderRetroZoneCard)}
                  </div>
                </div>

                {/* Right column */}
                <div>
                  <div className="bg-green-900 border-2 border-green-400 px-3 py-1 mb-3 text-center">
                    <span className="text-green-300 text-sm font-bold">DÉVELOPPEMENT</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {rightZones.map(renderRetroZoneCard)}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 bg-gray-900 border-2 border-gray-600 p-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-cyan-400 text-sm">PROGRESS:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => (
                      <div
                        key={step}
                        className={`w-6 h-3 border transition-all ${
                          completedSteps.includes(step)
                            ? 'bg-green-400 border-green-300'
                            : step === currentStepId
                            ? 'bg-yellow-400 border-yellow-300 animate-pulse'
                            : 'bg-gray-800 border-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-green-400 font-bold">{completedSteps.length}/10</span>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-4 mt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-400 border border-green-300" />
                    <span className="text-green-400">CLEAR</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-400 border border-yellow-300" />
                    <span className="text-yellow-400">NOW</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-800 border border-gray-600" />
                    <span className="text-gray-400">LOCKED</span>
                  </div>
                </div>
              </div>
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

  const renderZoneCard = (zone: MapZone) => {
    const status = getZoneStatus(zone.id);
    const scenarioStep = SCENARIO.find(s => s.id === zone.id);
    const isHovered = hoveredZone === zone.id;
    const canClick = isInteractive && (status === 'current' || status === 'completed');

    return (
      <div
        key={zone.id}
        className={`relative cursor-${canClick ? 'pointer' : 'default'} transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}
        onMouseEnter={() => setHoveredZone(zone.id)}
        onMouseLeave={() => setHoveredZone(null)}
        onClick={() => canClick && onZoneClick?.(zone.id)}
      >
        {/* Card frame - golden ornate style */}
        <div className={`
          relative rounded-lg md:rounded-2xl overflow-hidden
          ${status === 'completed' ? 'ring-2 md:ring-4 ring-emerald-400 shadow-lg shadow-emerald-500/30' : ''}
          ${status === 'current' ? 'ring-2 md:ring-4 ring-amber-400 animate-pulse shadow-lg shadow-amber-500/30' : ''}
          ${status === 'next' ? 'ring-1 md:ring-2 ring-amber-600/50' : ''}
          ${status === 'locked' ? 'opacity-50 grayscale' : ''}
        `}>
          {/* Golden border frame */}
          <div className="absolute inset-0 rounded-lg md:rounded-2xl border-2 md:border-4 border-amber-600/80 pointer-events-none z-10" 
            style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.3) 0%, transparent 50%, rgba(251,191,36,0.3) 100%)'
            }}
          />
          
          {/* Inner ornate border - hidden on mobile */}
          <div className="hidden md:block absolute inset-1 rounded-xl border-2 border-amber-700/40 pointer-events-none z-10" />

          {/* Card content */}
          <div className="relative bg-gradient-to-br from-amber-100 via-amber-50 to-amber-100 p-2 md:p-4">
            {/* Parchment texture overlay */}
            <div className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`
              }}
            />

            {/* Status badge */}
            <div className={`absolute -top-1 -right-1 w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold shadow-lg z-20
              ${status === 'completed' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : ''}
              ${status === 'current' ? 'bg-gradient-to-br from-amber-400 to-amber-600' : ''}
              ${status === 'next' ? 'bg-gradient-to-br from-cyan-400 to-cyan-600' : ''}
              ${status === 'locked' ? 'bg-gradient-to-br from-gray-400 to-gray-600' : ''}
            `}>
              {status === 'completed' ? '✓' : status === 'locked' ? '🔒' : zone.id}
            </div>

            {/* Icon in ornate circle */}
            <div className="relative mx-auto w-10 h-10 md:w-16 md:h-16 mb-1 md:mb-3">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 md:border-4 border-amber-600/60" 
                style={{
                  background: 'linear-gradient(180deg, rgba(251,191,36,0.4) 0%, rgba(180,83,9,0.4) 100%)'
                }}
              />
              <div className="absolute inset-0.5 md:inset-1 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center">
                <span className="text-lg md:text-3xl drop-shadow-sm">{zone.icon}</span>
              </div>
            </div>

            {/* Zone name */}
            <h3 className="text-amber-900 font-bold text-center text-xs md:text-sm mb-0.5 md:mb-1 drop-shadow-sm leading-tight">
              {zone.name}
            </h3>

            {/* Description - hidden on mobile */}
            <p className="text-amber-700/80 text-xs text-center hidden md:block">
              {zone.description}
            </p>

            {/* Progress bar for current */}
            {status === 'current' && (
              <div className="mt-2 bg-amber-200 rounded-full h-1 md:h-1.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 w-1/2 animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* Hover tooltip - displays above the card */}
        {isHovered && scenarioStep && (
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-56 pointer-events-none">
            <div className="bg-amber-950/95 backdrop-blur-md rounded-xl p-3 border-2 border-amber-600/50 shadow-2xl">
              <p className="text-amber-100 text-xs font-medium mb-1">{scenarioStep.title}</p>
              <p className="text-amber-300/80 text-xs">{scenarioStep.description}</p>
              {status === 'current' && (
                <p className="text-amber-400 text-xs font-bold mt-2">⚡ Décision en attente</p>
              )}
            </div>
            {/* Arrow pointing down */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-3 h-3 bg-amber-950/95 rotate-45 border-r-2 border-b-2 border-amber-600/50" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full min-h-[400px] md:min-h-[600px] flex items-center justify-center p-2 md:p-4 pt-14 md:pt-16 overflow-visible">
      {/* Background blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95 backdrop-blur-sm" />

      {/* Decorative vines - top (hidden on mobile) */}
      <div className="absolute top-0 left-0 right-0 h-16 hidden md:flex justify-between items-start pointer-events-none z-30">
        <div className="text-5xl transform -rotate-45 -translate-x-2 translate-y-2">🌿</div>
        <div className="flex gap-4 mt-2">
          <span className="text-3xl">🌿</span>
          <span className="text-3xl transform rotate-180">🌿</span>
        </div>
        <div className="text-5xl transform rotate-45 translate-x-2 translate-y-2">🌿</div>
      </div>

      {/* Decorative vines - bottom (hidden on mobile) */}
      <div className="absolute bottom-0 left-0 right-0 h-16 hidden md:flex justify-between items-end pointer-events-none z-30">
        <div className="text-4xl transform rotate-45 -translate-x-2 -translate-y-2">🌿</div>
        <div className="text-4xl transform -rotate-45 translate-x-2 -translate-y-2">🌿</div>
      </div>

      {/* Main book container */}
      <div className="relative z-10 w-full max-w-5xl mx-2 md:mx-0">
        {/* Book binding shadow - hidden on mobile */}
        <div className="hidden md:block absolute inset-0 bg-amber-950 rounded-3xl transform translate-y-2 translate-x-1 opacity-50" />
        
        {/* Book outer frame - wood texture */}
        <div className="relative rounded-xl md:rounded-3xl p-1 md:p-2 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #8B4513 0%, #654321 25%, #8B4513 50%, #654321 75%, #8B4513 100%)'
          }}
        >
          {/* Book inner frame */}
          <div className="relative rounded-lg md:rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #D4A574 0%, #C4956A 50%, #B8865A 100%)'
            }}
          >
            {/* Book spine shadow in center - hidden on mobile */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 z-20 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.3) 60%, transparent 100%)'
              }}
            />

            {/* Top ribbon banner */}
            <div className="relative z-30 flex justify-center -mt-0.5 md:-mt-1">
              <div className="relative">
                {/* Ribbon tails - hidden on mobile */}
                <div className="hidden md:block absolute -left-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-amber-700 to-amber-600"
                  style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)' }}
                />
                <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-l from-amber-700 to-amber-600"
                  style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }}
                />
                {/* Main ribbon */}
                <div className="relative bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 px-3 md:px-8 py-1 md:py-2 rounded-sm shadow-lg">
                  <div className="absolute inset-0 border-t-2 border-amber-400/50" />
                  <h1 className="text-amber-100 font-bold text-xs md:text-lg tracking-wide drop-shadow-md flex items-center gap-1 md:gap-2">
                    <span>🏫</span>
                    <span className="truncate max-w-[120px] md:max-w-none">{schoolName}</span>
                  </h1>
                </div>
              </div>
            </div>

            {/* Book pages container - stack on mobile, side by side on desktop */}
            <div className="flex flex-col md:flex-row">
              {/* Left page */}
              <div className="flex-1 p-3 md:p-6 relative"
                style={{
                  background: 'linear-gradient(135deg, #F5E6D3 0%, #EDD9C0 50%, #E5CCB0 100%)'
                }}
              >
                {/* Page texture */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`
                  }}
                />

                {/* Page curl effect */}
                <div className="absolute bottom-0 left-0 w-12 h-12 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.1) 50%)'
                  }}
                />

                {/* Section title banner */}
                <div className="relative mb-6 flex justify-center">
                  <div className="relative">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-r from-amber-600 to-amber-500"
                      style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)' }}
                    />
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-l from-amber-600 to-amber-500"
                      style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }}
                    />
                    <div className="bg-gradient-to-b from-amber-500 to-amber-700 px-6 py-1.5 rounded-sm shadow-md">
                      <h2 className="text-amber-100 font-bold text-sm tracking-wider">INFRASTRUCTURE</h2>
                    </div>
                  </div>
                </div>

                {/* Left page zones - responsive grid */}
                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-2 gap-2 md:gap-4">
                  {leftZones.map(renderZoneCard)}
                </div>
              </div>

              {/* Spine divider on mobile */}
              <div className="md:hidden h-2 w-full bg-gradient-to-r from-amber-200 via-amber-900/30 to-amber-200" />

              {/* Right page */}
              <div className="flex-1 p-3 md:p-6 relative"
                style={{
                  background: 'linear-gradient(225deg, #F5E6D3 0%, #EDD9C0 50%, #E5CCB0 100%)'
                }}
              >
                {/* Page texture */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`
                  }}
                />

                {/* Page curl effect */}
                <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none"
                  style={{
                    background: 'linear-gradient(225deg, transparent 50%, rgba(0,0,0,0.1) 50%)'
                  }}
                />

                {/* Section title banner */}
                <div className="relative mb-6 flex justify-center">
                  <div className="relative">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-r from-amber-600 to-amber-500"
                      style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)' }}
                    />
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-l from-amber-600 to-amber-500"
                      style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }}
                    />
                    <div className="bg-gradient-to-b from-amber-500 to-amber-700 px-6 py-1.5 rounded-sm shadow-md">
                      <h2 className="text-amber-100 font-bold text-sm tracking-wider">DÉVELOPPEMENT</h2>
                    </div>
                  </div>
                </div>

                {/* Right page zones - responsive grid */}
                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-2 gap-2 md:gap-4">
                  {rightZones.map(renderZoneCard)}
                </div>
              </div>
            </div>

            {/* Bottom progress section */}
            <div className="relative z-20 px-3 md:px-8 py-2 md:py-4"
              style={{
                background: 'linear-gradient(180deg, #E5CCB0 0%, #D4B896 100%)'
              }}
            >
              {/* Progress banner */}
              <div className="flex items-center justify-center gap-2 md:gap-4">
                <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-transparent via-amber-700/50 to-amber-700/50" />
                
                <div className="flex items-center gap-2 md:gap-3 bg-gradient-to-b from-amber-600 to-amber-800 px-2 md:px-4 py-1 md:py-2 rounded-lg shadow-lg border border-amber-500/30">
                  <span className="text-amber-200 text-xs md:text-sm font-medium hidden sm:inline">Progression</span>
                  <div className="flex gap-0.5 md:gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => (
                      <div
                        key={step}
                        className={`w-3 md:w-6 h-1.5 md:h-2 rounded-full transition-all ${
                          completedSteps.includes(step)
                            ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-sm shadow-emerald-500/50'
                            : step === currentStepId
                            ? 'bg-gradient-to-r from-amber-300 to-amber-400 animate-pulse'
                            : 'bg-amber-900/40'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-amber-100 font-bold text-xs md:text-base">{completedSteps.length}/10</span>
                </div>

                <div className="hidden md:block flex-1 h-px bg-gradient-to-l from-transparent via-amber-700/50 to-amber-700/50" />
              </div>

              {/* Legend - hidden on small mobile */}
              <div className="hidden sm:flex justify-center gap-3 md:gap-6 mt-2 md:mt-3">
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 ring-1 md:ring-2 ring-emerald-400" />
                  <span className="text-amber-800 text-xs">Terminé</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 ring-1 md:ring-2 ring-amber-400 animate-pulse" />
                  <span className="text-amber-800 text-xs">En cours</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 opacity-50" />
                  <span className="text-amber-800 text-xs">Verrouillé</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative corner ornaments */}
        <div className="absolute -top-2 -left-2 text-3xl transform -rotate-12">⚜️</div>
        <div className="absolute -top-2 -right-2 text-3xl transform rotate-12">⚜️</div>
        <div className="absolute -bottom-2 -left-2 text-3xl transform rotate-12">⚜️</div>
        <div className="absolute -bottom-2 -right-2 text-3xl transform -rotate-12">⚜️</div>
      </div>

      {/* Top bar with icons like in reference - hidden on small mobile */}
      <div className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 z-40 hidden sm:block">
        <div className="flex items-center gap-1 md:gap-2 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full px-2 md:px-4 py-1 md:py-2 border md:border-2 border-amber-600 shadow-lg">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <span className="text-xs md:text-sm">🌱</span>
          </div>
          {/* Progress bar */}
          <div className="w-16 md:w-32 h-2 md:h-3 bg-amber-950 rounded-full overflow-hidden border border-amber-600/50">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
              style={{ width: `${(completedSteps.length / 10) * 100}%` }}
            />
          </div>
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <span className="text-xs md:text-sm">💰</span>
          </div>
        </div>
      </div>
    </div>
  );
}
