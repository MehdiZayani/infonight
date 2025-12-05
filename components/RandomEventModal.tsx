"use client";

import React, { useState, useEffect } from 'react';
import { RandomEvent, RandomEventChoice, getEventTypeColor, getEventTypeLabel } from '../data/randomEvents';
import { ParticleSystem } from './Animations';

interface RandomEventModalProps {
  event: RandomEvent;
  onChoice: (choice: RandomEventChoice) => void;
  directorName: string;
  isRetroMode?: boolean;
}

export function RandomEventModal({ event, onChoice, directorName, isRetroMode = false }: RandomEventModalProps) {
  const [selectedChoice, setSelectedChoice] = useState<RandomEventChoice | null>(null);
  const [phase, setPhase] = useState<'intro' | 'choices' | 'consequence'>('intro');
  const [displayText, setDisplayText] = useState('');

  // Typewriter effect for description
  useEffect(() => {
    if (phase === 'intro') {
      let index = 0;
      const text = event.description;
      setDisplayText('');
      
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setTimeout(() => setPhase('choices'), 500);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [phase, event.description]);

  // Typewriter for consequence
  useEffect(() => {
    if (phase === 'consequence' && selectedChoice) {
      let index = 0;
      const text = selectedChoice.consequence;
      setDisplayText('');
      
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [phase, selectedChoice]);

  const handleChoiceSelect = (choice: RandomEventChoice) => {
    setSelectedChoice(choice);
    setPhase('consequence');
  };

  const handleContinue = () => {
    if (selectedChoice) {
      onChoice(selectedChoice);
    }
  };

  const typeColor = getEventTypeColor(event.type);
  const typeLabel = getEventTypeLabel(event.type);

  // Retro type colors
  const getRetroTypeColor = () => {
    switch (event.type) {
      case 'crisis': return { border: 'border-red-400', bg: 'bg-red-900', text: 'text-red-400' };
      case 'opportunity': return { border: 'border-green-400', bg: 'bg-green-900', text: 'text-green-400' };
      case 'neutral': return { border: 'border-cyan-400', bg: 'bg-cyan-900', text: 'text-cyan-400' };
      default: return { border: 'border-purple-400', bg: 'bg-purple-900', text: 'text-purple-400' };
    }
  };

  // Mode rétro
  if (isRetroMode) {
    const retroColors = getRetroTypeColor();
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pixel-font">
        {/* Backdrop with scanlines */}
        <div className="absolute inset-0 bg-black/90">
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.8) 2px, rgba(0, 0, 0, 0.8) 4px)'
            }}
          />
        </div>

        {/* Particles */}
        {event.type === 'crisis' && <ParticleSystem type="magic" intensity="high" />}
        {event.type === 'opportunity' && <ParticleSystem type="sparkles" intensity="medium" />}

        {/* Retro Modal */}
        <div className="relative w-full max-w-2xl animate-in zoom-in-95 fade-in duration-300">
          {/* Pixel frame */}
          <div className={`bg-black border-4 ${retroColors.border} p-1`}>
            <div className="border-2 border-cyan-400 p-4">
              
              {/* Header */}
              <div className="text-center mb-4">
                {/* Event type badge */}
                <div className={`inline-block ${retroColors.bg} border-2 ${retroColors.border} px-4 py-1 mb-3`}>
                  <span className={`${retroColors.text} text-sm font-bold uppercase`}>⚡ {typeLabel} ⚡</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-cyan-400 flex items-center justify-center gap-2">
                  <span className="text-3xl">{event.icon}</span>
                  <span>{event.title}</span>
                </h2>
              </div>

              {/* Content based on phase */}
              {phase === 'intro' && (
                <div className="bg-gray-900 border-2 border-gray-600 p-4 mb-4 min-h-[100px]">
                  <p className="text-green-400 text-lg leading-relaxed">
                    {displayText}
                    <span className="animate-pulse text-cyan-400">_</span>
                  </p>
                </div>
              )}

              {phase === 'choices' && (
                <>
                  <div className="bg-gray-900 border-2 border-gray-600 p-4 mb-4">
                    <p className="text-green-400 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="mb-3">
                    <p className="text-purple-400 text-center text-sm">
                      {directorName}, SELECT YOUR ACTION:
                    </p>
                  </div>

                  {/* Choices */}
                  <div className="space-y-2">
                    {event.choices.map((choice, index) => (
                      <button
                        key={choice.id}
                        onClick={() => handleChoiceSelect(choice)}
                        className="w-full text-left bg-gray-900 hover:bg-gray-800 border-2 border-yellow-400 hover:border-yellow-300 p-3 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-yellow-600 border border-yellow-400 flex items-center justify-center text-black font-bold text-sm shrink-0">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-yellow-400 group-hover:text-yellow-300 text-sm">
                              {choice.label}
                            </h3>
                            <p className="text-gray-400 text-xs mt-1">
                              {choice.description}
                            </p>
                            {/* Impact indicators */}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {choice.budgetImpact !== 0 && (
                                <span className={`text-xs px-2 py-0.5 border ${choice.budgetImpact > 0 ? 'border-green-400 text-green-400' : 'border-red-400 text-red-400'}`}>
                                  {choice.budgetImpact > 0 ? '+' : ''}{choice.budgetImpact}€
                                </span>
                              )}
                              {choice.scoreNIRDImpact !== 0 && (
                                <span className={`text-xs px-2 py-0.5 border ${choice.scoreNIRDImpact > 0 ? 'border-cyan-400 text-cyan-400' : 'border-orange-400 text-orange-400'}`}>
                                  NIRD {choice.scoreNIRDImpact > 0 ? '+' : ''}{choice.scoreNIRDImpact}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-yellow-400 group-hover:text-yellow-300 group-hover:translate-x-1 transition-all">
                            ▶
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {phase === 'consequence' && selectedChoice && (
                <>
                  {/* Selected choice recap */}
                  <div className="bg-purple-900 border-2 border-purple-400 p-3 mb-3">
                    <p className="text-purple-300 text-xs">SELECTED:</p>
                    <p className="text-purple-400 font-bold text-sm">{selectedChoice.label}</p>
                  </div>

                  {/* Consequence */}
                  <div className="bg-gray-900 border-2 border-cyan-400 p-4 mb-4 min-h-[60px]">
                    <p className="text-cyan-400 leading-relaxed italic">
                      &quot;{displayText}&quot;
                      {displayText.length < selectedChoice.consequence.length && (
                        <span className="animate-pulse">_</span>
                      )}
                    </p>
                  </div>

                  {/* Impact summary */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className={`border p-2 text-center ${selectedChoice.budgetImpact >= 0 ? 'border-green-400' : 'border-red-400'}`}>
                      <p className="text-gray-500 text-xs">GOLD</p>
                      <p className={`font-bold text-sm ${selectedChoice.budgetImpact >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedChoice.budgetImpact > 0 ? '+' : ''}{selectedChoice.budgetImpact}
                      </p>
                    </div>
                    <div className={`border p-2 text-center ${selectedChoice.scoreNIRDImpact >= 0 ? 'border-cyan-400' : 'border-orange-400'}`}>
                      <p className="text-gray-500 text-xs">NIRD</p>
                      <p className={`font-bold text-sm ${selectedChoice.scoreNIRDImpact >= 0 ? 'text-cyan-400' : 'text-orange-400'}`}>
                        {selectedChoice.scoreNIRDImpact > 0 ? '+' : ''}{selectedChoice.scoreNIRDImpact}
                      </p>
                    </div>
                    <div className={`border p-2 text-center ${selectedChoice.dependanceImpact <= 0 ? 'border-green-400' : 'border-red-400'}`}>
                      <p className="text-gray-500 text-xs">DEP</p>
                      <p className={`font-bold text-sm ${selectedChoice.dependanceImpact <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedChoice.dependanceImpact > 0 ? '+' : ''}{selectedChoice.dependanceImpact}
                      </p>
                    </div>
                    <div className="border border-purple-400 p-2 text-center">
                      <p className="text-gray-500 text-xs">REP</p>
                      <p className="font-bold text-sm text-purple-400">~</p>
                    </div>
                  </div>

                  {/* Continue button */}
                  <button
                    onClick={handleContinue}
                    className={`w-full ${retroColors.bg} border-2 ${retroColors.border} ${retroColors.text} font-bold py-3 px-6 hover:opacity-80 transition-all active:scale-95`}
                  >
                    CONTINUE ▶
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Pixel corners */}
          <div className={`absolute -top-1 -left-1 w-3 h-3 ${retroColors.bg.replace('bg-', 'bg-').replace('-900', '-500')}`} style={{ backgroundColor: event.type === 'crisis' ? '#ef4444' : event.type === 'opportunity' ? '#22c55e' : '#06b6d4' }} />
          <div className={`absolute -top-1 -right-1 w-3 h-3`} style={{ backgroundColor: event.type === 'crisis' ? '#ef4444' : event.type === 'opportunity' ? '#22c55e' : '#06b6d4' }} />
          <div className={`absolute -bottom-1 -left-1 w-3 h-3`} style={{ backgroundColor: event.type === 'crisis' ? '#ef4444' : event.type === 'opportunity' ? '#22c55e' : '#06b6d4' }} />
          <div className={`absolute -bottom-1 -right-1 w-3 h-3`} style={{ backgroundColor: event.type === 'crisis' ? '#ef4444' : event.type === 'opportunity' ? '#22c55e' : '#06b6d4' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Particles based on event type */}
      {event.type === 'crisis' && <ParticleSystem type="magic" intensity="high" />}
      {event.type === 'opportunity' && <ParticleSystem type="sparkles" intensity="medium" />}

      {/* Modal */}
      <div className="relative w-full max-w-2xl animate-in zoom-in-95 fade-in duration-300">
        {/* Outer frame */}
        <div className={`bg-gradient-to-b ${typeColor} rounded-3xl p-2 shadow-2xl`}>
          {/* Inner parchment */}
          <div className="bg-gradient-to-b from-amber-100 via-amber-50 to-amber-100 rounded-2xl p-6">
            
            {/* Header */}
            <div className="text-center mb-6">
              {/* Event type badge */}
              <div className={`inline-block bg-gradient-to-r ${typeColor} px-4 py-1 rounded-full mb-3`}>
                <span className="text-white text-sm font-bold">{typeLabel}</span>
              </div>

              {/* Title with icon */}
              <h2 className="text-3xl font-bold text-amber-900 flex items-center justify-center gap-3">
                <span className="text-4xl">{event.icon}</span>
                {event.title}
              </h2>
            </div>

            {/* Content based on phase */}
            {phase === 'intro' && (
              <div className="bg-amber-200/50 rounded-xl p-4 mb-6 min-h-[100px]">
                <p className="text-amber-900 text-lg leading-relaxed">
                  {displayText}
                  <span className="animate-pulse">|</span>
                </p>
              </div>
            )}

            {phase === 'choices' && (
              <>
                <div className="bg-amber-200/50 rounded-xl p-4 mb-6">
                  <p className="text-amber-900 text-lg leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-amber-700 font-semibold mb-3 text-center">
                    {directorName}, que décidez-vous ?
                  </p>
                </div>

                {/* Choices */}
                <div className="space-y-3">
                  {event.choices.map((choice, index) => (
                    <button
                      key={choice.id}
                      onClick={() => handleChoiceSelect(choice)}
                      className="w-full text-left bg-gradient-to-r from-amber-200 to-amber-300 hover:from-amber-300 hover:to-amber-400 rounded-xl p-4 border-2 border-amber-400 hover:border-amber-500 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-amber-900 group-hover:text-amber-800">
                            {choice.label}
                          </h3>
                          <p className="text-amber-700 text-sm">
                            {choice.description}
                          </p>
                          {/* Impact indicators */}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {choice.budgetImpact !== 0 && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${choice.budgetImpact > 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                {choice.budgetImpact > 0 ? '+' : ''}{choice.budgetImpact}€
                              </span>
                            )}
                            {choice.scoreNIRDImpact !== 0 && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${choice.scoreNIRDImpact > 0 ? 'bg-cyan-200 text-cyan-800' : 'bg-orange-200 text-orange-800'}`}>
                                NIRD {choice.scoreNIRDImpact > 0 ? '+' : ''}{choice.scoreNIRDImpact}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-amber-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all">
                          →
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {phase === 'consequence' && selectedChoice && (
              <>
                {/* Selected choice recap */}
                <div className="bg-amber-300/50 rounded-xl p-4 mb-4">
                  <p className="text-amber-800 text-sm">Vous avez choisi :</p>
                  <p className="text-amber-900 font-bold">{selectedChoice.label}</p>
                </div>

                {/* Consequence */}
                <div className="bg-gradient-to-b from-amber-200 to-amber-300 rounded-xl p-4 mb-6 min-h-[80px]">
                  <p className="text-amber-900 text-lg leading-relaxed italic">
                    &quot;{displayText}&quot;
                    {displayText.length < selectedChoice.consequence.length && (
                      <span className="animate-pulse">|</span>
                    )}
                  </p>
                </div>

                {/* Impact summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className={`rounded-lg p-3 text-center ${selectedChoice.budgetImpact >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p className="text-xs text-gray-600">Budget</p>
                    <p className={`font-bold ${selectedChoice.budgetImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedChoice.budgetImpact > 0 ? '+' : ''}{selectedChoice.budgetImpact}€
                    </p>
                  </div>
                  <div className={`rounded-lg p-3 text-center ${selectedChoice.scoreNIRDImpact >= 0 ? 'bg-cyan-100' : 'bg-orange-100'}`}>
                    <p className="text-xs text-gray-600">Score NIRD</p>
                    <p className={`font-bold ${selectedChoice.scoreNIRDImpact >= 0 ? 'text-cyan-600' : 'text-orange-600'}`}>
                      {selectedChoice.scoreNIRDImpact > 0 ? '+' : ''}{selectedChoice.scoreNIRDImpact}
                    </p>
                  </div>
                  <div className={`rounded-lg p-3 text-center ${selectedChoice.dependanceImpact <= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p className="text-xs text-gray-600">Dépendance</p>
                    <p className={`font-bold ${selectedChoice.dependanceImpact <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedChoice.dependanceImpact > 0 ? '+' : ''}{selectedChoice.dependanceImpact}
                    </p>
                  </div>
                  <div className="rounded-lg p-3 text-center bg-purple-100">
                    <p className="text-xs text-gray-600">Réputation</p>
                    <p className="font-bold text-purple-600">Variable</p>
                  </div>
                </div>

                {/* Continue button */}
                <button
                  onClick={handleContinue}
                  className={`w-full bg-gradient-to-r ${typeColor} text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-all`}
                >
                  Continuer →
                </button>
              </>
            )}
          </div>
        </div>

        {/* Decorative corners */}
        <div className="absolute -top-2 -left-2 text-3xl">⚡</div>
        <div className="absolute -top-2 -right-2 text-3xl">⚡</div>
      </div>
    </div>
  );
}

export default RandomEventModal;
