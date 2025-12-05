"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

interface GameEndProps {
  directorName: string;
  schoolName: string;
  budget: number;
  scoreNIRD: number;
  dependance: number;
  onRetroGame: () => void;
  onQuit: () => void;
}

export default function GameEnd({ 
  directorName, 
  schoolName, 
  budget, 
  scoreNIRD, 
  dependance,
  onRetroGame,
  onQuit 
}: GameEndProps) {
  const [displayedScore, setDisplayedScore] = useState(0);
  const [displayedDependance, setDisplayedDependance] = useState(0);

  // Generate starfield once (pure computation using seeded values)
  const stars = useMemo(() => {
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    return [...Array(50)].map((_, i) => ({
      left: seededRandom(i * 1.1) * 100,
      top: seededRandom(i * 1.3) * 100,
      opacity: seededRandom(i * 1.5) * 0.7 + 0.3,
      delay: seededRandom(i * 1.7) * 3,
    }));
  }, []);

  // Animate score counter
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (displayedScore < scoreNIRD) {
      interval = setInterval(() => {
        setDisplayedScore(prev => Math.min(prev + 5, scoreNIRD));
      }, 20);
    }
    return () => clearInterval(interval);
  }, [scoreNIRD, displayedScore]);

  // Animate dependance counter
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (displayedDependance < dependance) {
      interval = setInterval(() => {
        setDisplayedDependance(prev => Math.min(prev + 5, dependance));
      }, 20);
    }
    return () => clearInterval(interval);
  }, [dependance, displayedDependance]);

  const getNIRDRating = () => {
    if (scoreNIRD >= 80 && dependance <= 20) return '🏆 CHAMPION NIRD';
    if (scoreNIRD >= 60 && dependance <= 40) return '⭐ EXCELLENT';
    if (scoreNIRD >= 40 && dependance <= 60) return '✓ RÉUSSI';
    if (scoreNIRD >= 20) return '⚠️ PARTIEL';
    return '❌ À AMÉLIORER';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Starfield effect */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              opacity: star.opacity,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* Main card - Victory theme */}
        <div className="bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-3xl p-2 shadow-2xl border-4 border-amber-950">
          <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-2xl overflow-hidden">
            
            {/* Header with Victory/Defeat Image */}
            <div className="bg-gradient-to-b from-amber-600 to-amber-800 p-1">
              <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 p-6 text-center">
                {/* Victory/Defeat Image */}
                <div className="relative w-full h-48 mb-4 mx-auto">
                  <Image
                    src={scoreNIRD >= 60 && dependance <= 40 ? '/images/end-victory.png' : '/images/end-defeat.png'}
                    alt={scoreNIRD >= 60 && dependance <= 40 ? 'Victoire !' : 'Défaite...'}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {scoreNIRD >= 60 && dependance <= 40 ? '🎊 VICTOIRE ! 🎊' : '💔 DÉFAITE... 💔'}
                </h2>
                <p className="text-cyan-100 font-semibold">Merci, {directorName}</p>
              </div>
            </div>

            {/* Results */}
            <div className="p-8">
              {/* School name */}
              <div className="text-center mb-6">
                <p className="text-amber-700 text-lg font-bold">{schoolName}</p>
              </div>

              {/* Score display */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* NIRD Score */}
                <div className="bg-gradient-to-b from-emerald-200 to-emerald-300 rounded-xl p-6 border-2 border-emerald-400 text-center">
                  <p className="text-amber-900 font-semibold text-sm mb-2">Score NIRD</p>
                  <p className="text-5xl font-bold text-emerald-700 tabular-nums">
                    {displayedScore}
                  </p>
                  <p className="text-xs text-emerald-800 mt-2">/100</p>
                </div>

                {/* Dépendance */}
                <div className="bg-gradient-to-b from-orange-200 to-orange-300 rounded-xl p-6 border-2 border-orange-400 text-center">
                  <p className="text-amber-900 font-semibold text-sm mb-2">Dépendance</p>
                  <p className="text-5xl font-bold text-orange-700 tabular-nums">
                    {displayedDependance}
                  </p>
                  <p className="text-xs text-orange-800 mt-2">/100 (moins c&apos;est mieux)</p>
                </div>
              </div>

              {/* Budget */}
              <div className="bg-gradient-to-b from-cyan-200 to-cyan-300 rounded-xl p-4 border-2 border-cyan-400 text-center mb-8">
                <p className="text-amber-900 font-semibold text-sm mb-2">💰 Budget Restant</p>
                <p className={`text-3xl font-bold tabular-nums ${budget >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(budget)}
                </p>
              </div>

              {/* Rating */}
              <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl p-6 border-2 border-purple-400 text-center mb-8">
                <p className="text-3xl font-bold mb-2">{getNIRDRating()}</p>
                <div className="flex justify-center gap-2 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-2xl ${i < Math.ceil(scoreNIRD / 20) ? '⭐' : '☆'}`} />
                  ))}
                </div>
                <p className="text-amber-900 font-semibold text-sm">
                  {scoreNIRD >= 80 && dependance <= 20
                    ? 'Vous avez établi un modèle d\'excellence NIRD !'
                    : scoreNIRD >= 60 && dependance <= 40
                    ? 'Excellent travail pour la transition numérique responsable !'
                    : scoreNIRD >= 40
                    ? 'Bonne démarche, mais il y a encore du travail !'
                    : 'Votre établissement a besoin d\'une refonte numérique...'}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {/* Retro gaming button */}
                <button
                  onClick={onRetroGame}
                  className="w-full bg-gradient-to-b from-amber-600 to-amber-800 rounded-xl p-1 border-2 border-amber-900 hover:from-amber-500 hover:to-amber-700 transition-all active:scale-98"
                >
                  <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg py-3 px-4">
                    <span className="font-bold text-white text-lg flex items-center justify-center gap-2">
                      👾 Mini-jeu Rétro-Gaming 👾
                    </span>
                  </div>
                </button>

                {/* Menu principal button */}
                <button
                  onClick={onQuit}
                  className="w-full bg-gradient-to-b from-amber-600 to-amber-800 rounded-xl p-1 border-2 border-amber-900 hover:from-amber-500 hover:to-amber-700 transition-all"
                >
                  <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg py-3 px-4">
                    <span className="font-bold text-amber-900 flex items-center justify-center gap-2">
                      Retour au Menu
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 text-4xl transform -rotate-45">⚜️</div>
        <div className="absolute -top-4 -right-4 text-4xl transform rotate-45">⚜️</div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-3xl">🏆</div>
      </div>
    </div>
  );
}
