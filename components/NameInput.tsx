"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface Props {
  onSubmit: (directorName: string, schoolName: string) => void;
}

export default function NameInput({ onSubmit }: Props) {
  const [directorName, setDirectorName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [step, setStep] = useState<'director' | 'school'>('director');

  const handleDirectorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (directorName.trim()) {
      setStep('school');
    }
  };

  const handleSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (schoolName.trim()) {
      onSubmit(directorName.trim(), schoolName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/name-input.png"
          alt="Background"
          fill
          className="object-cover opacity-30"
          priority
        />
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative z-20">
        {/* Main wood frame */}
        <div className="bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-3xl p-2 shadow-2xl border-4 border-amber-950">
          <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-2xl overflow-hidden min-w-[400px]">
            
            {/* Header */}
            <div className="bg-gradient-to-b from-amber-600 to-amber-800 p-1">
              <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 p-4 text-center">
                <div className="text-4xl mb-2">
                  {step === 'director' ? '👤' : '🏫'}
                </div>
                <h2 className="text-xl font-bold text-white">
                  {step === 'director' ? 'Qui êtes-vous ?' : 'Votre établissement'}
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === 'director' ? (
                <form onSubmit={handleDirectorSubmit}>
                  <div className="bg-gradient-to-b from-amber-200 to-amber-300 rounded-xl p-4 border-2 border-amber-400 mb-4">
                    <label className="block text-amber-900 font-semibold mb-2">
                      Entrez votre nom, Directeur :
                    </label>
                    <input
                      type="text"
                      value={directorName}
                      onChange={(e) => setDirectorName(e.target.value)}
                      placeholder="Ex: Nathem"
                      className="w-full px-4 py-3 rounded-lg bg-amber-50 border-2 border-amber-400 text-amber-900 placeholder-amber-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!directorName.trim()}
                    className={`w-full transition-all ${!directorName.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="bg-gradient-to-b from-amber-600 to-amber-800 rounded-xl p-1 border-2 border-amber-900 hover:from-amber-500 hover:to-amber-700">
                      <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-lg py-3 px-4">
                        <span className="font-bold text-white">Continuer →</span>
                      </div>
                    </div>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSchoolSubmit}>
                  <div className="bg-gradient-to-b from-amber-200 to-amber-300 rounded-xl p-4 border-2 border-amber-400 mb-2">
                    <p className="text-amber-700 text-sm mb-3">
                      Bienvenue, <span className="font-bold text-amber-900">{directorName}</span> ! 👋
                    </p>
                    <label className="block text-amber-900 font-semibold mb-2">
                      Quel est le nom de votre établissement ?
                    </label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="Ex: Polytechnique"
                      className="w-full px-4 py-3 rounded-lg bg-amber-50 border-2 border-amber-400 text-amber-900 placeholder-amber-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setStep('director')}
                      className="flex-1"
                    >
                      <div className="bg-gradient-to-b from-amber-600 to-amber-800 rounded-xl p-1 border-2 border-amber-900">
                        <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg py-3 px-4">
                          <span className="font-bold text-amber-900">← Retour</span>
                        </div>
                      </div>
                    </button>

                    <button
                      type="submit"
                      disabled={!schoolName.trim()}
                      className={`flex-1 transition-all ${!schoolName.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="bg-gradient-to-b from-amber-600 to-amber-800 rounded-xl p-1 border-2 border-amber-900 hover:from-amber-500 hover:to-amber-700">
                        <div className="bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-lg py-3 px-4">
                          <span className="font-bold text-white">Commencer</span>
                        </div>
                      </div>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-3 -left-3 text-3xl transform -rotate-45">🌿</div>
        <div className="absolute -top-3 -right-3 text-3xl transform rotate-45">🌿</div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-2xl">🌱</div>
      </div>
    </div>
  );
}
