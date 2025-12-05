"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Props {
  onStart: () => void;
  directorName: string;
  schoolName: string;
}

export default function GameIntro({ onStart, directorName, schoolName }: Props) {
  const [step, setStep] = useState(0);

  const introSteps = [
    {
      title: `Bienvenue, ${directorName}`,
      content: `Vous venez d'être nommé(e) à la tête du **${schoolName}**, un établissement de 800 élèves situé en périphérie d'une grande ville française.`,
      icon: "🏫",
      image: "/images/intro-welcome.png",
    },
    {
      title: "La Situation",
      content: "L'établissement fait face à de nombreux défis numériques : matériel vieillissant, logiciels coûteux, dépendance aux géants du numérique, et une empreinte carbone préoccupante.",
      icon: "⚠️",
      image: "/images/intro-situation.png",
    },
    {
      title: "Votre Mission",
      content: "En tant que directeur, vous devrez prendre **10 décisions stratégiques** qui façonneront l'avenir numérique de l'école. Chaque choix impactera votre budget et des indicateurs secrets...",
      icon: "🎯",
      image: "/images/intro-mission.png",
    },
    {
      title: "Les Enjeux Cachés",
      content: "Vos décisions affecteront le **Score NIRD** (Numérique Responsable) et la **Dépendance Big Tech**. Ces indicateurs resteront masqués pendant le jeu. Appuyez sur **Pause** pour les consulter !",
      icon: "🔮",
      image: "/images/intro-enjeux.png",
    },
    {
      title: "Prêt(e) à Relever le Défi ?",
      content: `Le **${schoolName}** compte sur vous. Vos décisions aujourd'hui construiront l'école de demain. Bonne chance, **${directorName}** !`,
      icon: "🚀",
      image: "/images/intro-start.png",
    },
  ];

  const currentStep = introSteps[step];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // ignore typing in inputs/textareas/contentEditable
      const tgt = e.target as HTMLElement | null;
      const tag = tgt?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tgt?.isContentEditable) return;

      if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (step < introSteps.length - 1) {
          setStep((s) => Math.min(introSteps.length - 1, s + 1));
        } else {
          onStart();
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [step, onStart, introSteps.length]);

  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-2">
        {line.split('**').map((part, j) => 
          j % 2 === 1 ? <strong key={j} className="text-cyan-600">{part}</strong> : part
        )}
      </p>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background image - changes with step */}
      <div className="absolute inset-0 z-0 transition-opacity duration-500">
        <Image
          src={currentStep.image}
          alt="Background"
          fill
          className="object-cover opacity-25"
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

      <div className="relative max-w-2xl w-full z-20">
        {/* Progress indicators */}
        <div className="mb-6 flex justify-center gap-2">
          {introSteps.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i <= step
                  ? 'bg-emerald-500 scale-110'
                  : 'bg-amber-900/50'
              }`}
            />
          ))}
        </div>

        {/* Main card - Wood frame */}
        <div className="bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-3xl p-2 shadow-2xl border-4 border-amber-950">
          <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-2xl overflow-hidden">
            
            {/* Header with icon */}
            <div className="bg-gradient-to-b from-amber-600 to-amber-800 p-1">
              <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 p-6 text-center">
                <div className="text-5xl mb-3 animate-bounce">{currentStep.icon}</div>
                <h2 className="text-2xl font-bold text-white">{currentStep.title}</h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="bg-gradient-to-b from-amber-200 to-amber-300 rounded-xl p-5 border-2 border-amber-400 min-h-[120px]">
                <div className="text-amber-900 leading-relaxed">
                  {formatContent(currentStep.content)}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-6 gap-4">
                <button
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className={`flex-1 ${step === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="bg-gradient-to-b from-amber-600 to-amber-800 rounded-xl p-1 border-2 border-amber-900">
                    <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg py-3 px-4">
                      <span className="font-bold text-amber-900">← Précédent</span>
                    </div>
                  </div>
                </button>

                {step < introSteps.length - 1 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="flex-1"
                  >
                    <div className="bg-gradient-to-b from-amber-600 to-amber-800 rounded-xl p-1 border-2 border-amber-900 hover:from-amber-500 hover:to-amber-700 transition-all">
                      <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-lg py-3 px-4">
                        <span className="font-bold text-white">Suivant →</span>
                      </div>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={onStart}
                    className="flex-1"
                  >
                    <div className="bg-gradient-to-b from-amber-600 to-amber-800 rounded-xl p-1 border-2 border-amber-900 hover:from-amber-500 hover:to-amber-700 transition-all animate-pulse">
                      <div className="bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-lg py-3 px-4">
                        <span className="font-bold text-white">Commencer !</span>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative leaves */}
        <div className="absolute -top-3 -left-3 text-3xl transform -rotate-45">🌿</div>
        <div className="absolute -top-3 -right-3 text-3xl transform rotate-45">🌿</div>

        {/* Skip button - repositioned above bottom emoji */}
        {step < introSteps.length - 1 && (
          <button
            type="button"
            onClick={onStart}
            className="mt-4 w-full text-amber-600 hover:text-amber-400 text-sm transition-colors relative z-10"
          >
            Passer l&apos;introduction →
          </button>
        )}

        {/* Keyboard: space advances the intro (next step) or starts when on last step */}

        {/* Bottom decorative element */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-2xl pointer-events-none">🌱</div>
      </div>
    </div>
  );
}
