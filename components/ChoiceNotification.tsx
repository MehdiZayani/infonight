"use client";

import React from 'react';
import { Choice } from '../data/scenario';

interface Props {
  choice: Choice | null;
  isVisible: boolean;
}

export default function ChoiceNotification({ choice, isVisible }: Props) {
  if (!choice || !isVisible) return null;

  const formatCost = (cost: number) => {
    const formatted = new Intl.NumberFormat('fr-FR').format(Math.abs(cost));
    return cost >= 0 ? `+${formatted} €` : `-${formatted} €`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="animate-in zoom-in-95 fade-in duration-300 pointer-events-auto">
        {/* Glass card notification - centered */}
        <div className="bg-black/60 backdrop-blur-xl rounded-3xl p-1 shadow-2xl border border-white/20">
          <div className="bg-gradient-to-b from-white/10 to-white/5 rounded-3xl p-6 min-w-[350px]">
            {/* Success icon */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full mb-3 shadow-lg shadow-emerald-500/30">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-xl font-bold text-white">Décision validée</h3>
            </div>

            {/* Choice name */}
            <div className="text-center mb-4">
              <span className="text-lg font-semibold text-amber-300">{choice.label}</span>
            </div>

            {/* Impact badge */}
            <div className="flex justify-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${choice.cost >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                <span className="text-lg">💰</span>
                <span className="font-bold">{formatCost(choice.cost)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
