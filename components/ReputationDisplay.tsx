"use client";

import React from 'react';
import { ReputationState, STAKEHOLDER_INFO, getReputationLabel, getOverallReputation, StakeholderGroup } from '../data/reputation';

interface ReputationDisplayProps {
  reputation: ReputationState;
  showDetails?: boolean;
  compact?: boolean;
}

export function ReputationDisplay({ reputation, showDetails = true, compact = false }: ReputationDisplayProps) {
  const overall = getOverallReputation(reputation);
  const overallLabel = getReputationLabel(overall);

  const stakeholders: StakeholderGroup[] = ['eleves', 'enseignants', 'parents', 'academie'];

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-lg">{overallLabel.emoji}</span>
        <div className="flex gap-1">
          {stakeholders.map(key => {
            const value = reputation[key];
            return (
              <div
                key={key}
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                style={{
                  backgroundColor: value >= 65 ? '#22c55e' : value >= 50 ? '#3b82f6' : value >= 35 ? '#f59e0b' : '#ef4444',
                }}
                title={`${STAKEHOLDER_INFO[key].name}: ${value}%`}
              >
                {STAKEHOLDER_INFO[key].icon}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-xl p-4 border-2 border-amber-400">
      {/* Overall reputation */}
      <div className="text-center mb-4">
        <div className="text-4xl mb-1">{overallLabel.emoji}</div>
        <h3 className="font-bold text-amber-900">Réputation globale</h3>
        <div className="flex items-center justify-center gap-2">
          <span className={`font-bold ${overallLabel.color}`}>{overallLabel.label}</span>
          <span className="text-amber-600">({overall}%)</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-amber-300 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${overall}%`,
            background: overall >= 65 ? 'linear-gradient(to right, #22c55e, #16a34a)' :
                       overall >= 50 ? 'linear-gradient(to right, #3b82f6, #2563eb)' :
                       overall >= 35 ? 'linear-gradient(to right, #f59e0b, #d97706)' :
                       'linear-gradient(to right, #ef4444, #dc2626)',
          }}
        />
      </div>

      {/* Individual stakeholders */}
      {showDetails && (
        <div className="grid grid-cols-2 gap-3">
          {stakeholders.map(key => {
            const value = reputation[key];
            const info = STAKEHOLDER_INFO[key];
            const label = getReputationLabel(value);

            return (
              <div key={key} className="bg-amber-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{info.icon}</span>
                  <span className="font-semibold text-amber-900 text-sm">{info.name}</span>
                </div>
                
                {/* Mini progress bar */}
                <div className="h-2 bg-amber-200 rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${value}%`,
                      background: value >= 65 ? '#22c55e' :
                                 value >= 50 ? '#3b82f6' :
                                 value >= 35 ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className={label.color}>{label.emoji} {label.label}</span>
                  <span className="text-amber-600">{value}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Mini reputation indicator for top bar
interface MiniReputationProps {
  reputation: ReputationState;
  onClick?: () => void;
}

export function MiniReputation({ reputation, onClick }: MiniReputationProps) {
  const overall = getOverallReputation(reputation);
  const label = getReputationLabel(overall);

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-gradient-to-b from-purple-500 to-purple-700 px-3 py-2 rounded-xl border-2 border-purple-800 hover:from-purple-400 hover:to-purple-600 transition-all group"
      title="Voir la réputation détaillée"
    >
      <span className="text-xl group-hover:scale-110 transition-transform">{label.emoji}</span>
      <div className="text-left">
        <p className="text-xs text-purple-200">Réputation</p>
        <p className="text-sm font-bold text-white">{overall}%</p>
      </div>
    </button>
  );
}

// Reputation change notification
interface ReputationChangeProps {
  changes: {
    group: StakeholderGroup;
    oldValue: number;
    newValue: number;
  }[];
  isVisible: boolean;
}

export function ReputationChangeNotification({ changes, isVisible }: ReputationChangeProps) {
  if (!isVisible || changes.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className="bg-gradient-to-b from-purple-600 to-purple-800 rounded-xl p-3 shadow-lg border-2 border-purple-400">
        <h4 className="text-white font-bold text-sm mb-2">📊 Changements de réputation</h4>
        <div className="space-y-1">
          {changes.map(({ group, oldValue, newValue }) => {
            const diff = newValue - oldValue;
            const info = STAKEHOLDER_INFO[group];
            return (
              <div key={group} className="flex items-center gap-2 text-sm">
                <span>{info.icon}</span>
                <span className="text-purple-200">{info.name}</span>
                <span className={diff >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {diff >= 0 ? '+' : ''}{diff}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ReputationDisplay;
