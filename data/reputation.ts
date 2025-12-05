// Reputation system for different stakeholder groups

export type StakeholderGroup = 'eleves' | 'enseignants' | 'parents' | 'academie';

export interface ReputationState {
  eleves: number;      // Students satisfaction (0-100)
  enseignants: number; // Teachers satisfaction (0-100)
  parents: number;     // Parents satisfaction (0-100)
  academie: number;    // Academic authorities satisfaction (0-100)
}

export interface ReputationImpact {
  eleves?: number;
  enseignants?: number;
  parents?: number;
  academie?: number;
}

// Initial reputation state (neutral)
export const INITIAL_REPUTATION: ReputationState = {
  eleves: 50,
  enseignants: 50,
  parents: 50,
  academie: 50,
};

// Reputation impacts for each choice in each step
export const REPUTATION_IMPACTS: Record<string, Record<string, ReputationImpact>> = {
  // Step 1: Equipment
  '1': {
    'a': { eleves: 15, enseignants: 10, parents: -5, academie: 5 },      // New premium: students love it, parents worried about cost
    'b': { eleves: -5, enseignants: 5, parents: 15, academie: 15 },      // Reconditioned: eco-responsible, parents happy
    'c': { eleves: 5, enseignants: 0, parents: 5, academie: -5 },        // Leasing: neutral
  },
  // Step 2: Software
  '2': {
    'a': { eleves: 10, enseignants: 15, parents: 5, academie: -10 },     // MS365: familiar but not sovereign
    'b': { eleves: -10, enseignants: -5, parents: 10, academie: 20 },    // Libre: sovereignty, harder to use
    'c': { eleves: 0, enseignants: 5, parents: 10, academie: 10 },       // Hybrid: compromise
  },
  // Step 3: Network
  '3': {
    'a': { eleves: 5, enseignants: 10, parents: 0, academie: -10 },      // Cisco: performance but cloud
    'b': { eleves: 0, enseignants: -10, parents: 5, academie: 20 },      // On-premise: more work for teachers
    'c': { eleves: -5, enseignants: 5, parents: 0, academie: 5 },        // Orange: convenient
  },
  // Step 4: ENT
  '4': {
    'a': { eleves: 5, enseignants: 5, parents: 15, academie: -5 },       // Pronote: parents know it
    'b': { eleves: 0, enseignants: 10, parents: 5, academie: 5 },        // École Directe: balanced
    'c': { eleves: -5, enseignants: -5, parents: -5, academie: 20 },     // Karuta: sovereign but harder
  },
  // Step 5: Training
  '5': {
    'a': { eleves: 5, enseignants: 15, parents: 5, academie: -5 },       // Microsoft certs: teachers happy
    'b': { eleves: 10, enseignants: 10, parents: 10, academie: 15 },     // Internal ambassadors: everyone happy
    'c': { eleves: 0, enseignants: -5, parents: -5, academie: 5 },       // MOOCs: less engagement
  },
  // Step 6: RGPD
  '6': {
    'a': { eleves: -5, enseignants: -5, parents: 10, academie: 20 },     // Full audit: compliance
    'b': { eleves: 0, enseignants: 5, parents: 10, academie: 15 },       // Mutualized DPO
    'c': { eleves: 0, enseignants: 5, parents: -10, academie: -15 },     // Minimum: risky
  },
  // Step 7: Pédagogie
  '7': {
    'a': { eleves: 20, enseignants: 10, parents: 10, academie: 5 },      // 3D printer: students love it
    'b': { eleves: 5, enseignants: 15, parents: 5, academie: 15 },       // Pedagogical server
    'c': { eleves: 15, enseignants: 5, parents: -5, academie: -10 },     // Startup: modern but risky
  },
  // Step 8: Website
  '8': {
    'a': { eleves: 5, enseignants: -5, parents: 15, academie: 5 },       // Agency: pretty but dependent
    'b': { eleves: 0, enseignants: 0, parents: 10, academie: 5 },        // WordPress
    'c': { eleves: 20, enseignants: 15, parents: 5, academie: 20 },      // Student project: educational
  },
  // Step 9: Bilan
  '9': {
    'a': { eleves: 5, enseignants: 5, parents: 15, academie: 20 },       // Full report: transparency
    'b': { eleves: 0, enseignants: 5, parents: 10, academie: 10 },       // ADEME tool
    'c': { eleves: 0, enseignants: 0, parents: -10, academie: -15 },     // Greenwashing
  },
  // Step 10: Pérennisation
  '10': {
    'a': { eleves: 5, enseignants: 10, parents: 15, academie: 25 },      // Label NIRD
    'b': { eleves: 10, enseignants: -5, parents: -10, academie: -20 },   // Partnership: dependency
    'c': { eleves: 5, enseignants: 15, parents: 10, academie: 20 },      // Consortium: solidarity
  },
};

// Get reputation label based on score
export function getReputationLabel(score: number): { label: string; emoji: string; color: string } {
  if (score >= 80) return { label: 'Excellent', emoji: '🌟', color: 'text-yellow-400' };
  if (score >= 65) return { label: 'Très bon', emoji: '😊', color: 'text-green-400' };
  if (score >= 50) return { label: 'Satisfaisant', emoji: '😐', color: 'text-blue-400' };
  if (score >= 35) return { label: 'Méfiant', emoji: '😕', color: 'text-orange-400' };
  return { label: 'Hostile', emoji: '😠', color: 'text-red-400' };
}

// Get overall reputation
export function getOverallReputation(reputation: ReputationState): number {
  return Math.round(
    (reputation.eleves + reputation.enseignants + reputation.parents + reputation.academie) / 4
  );
}

// Apply reputation impact
export function applyReputationImpact(
  current: ReputationState,
  impact: ReputationImpact
): ReputationState {
  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  return {
    eleves: clamp(current.eleves + (impact.eleves || 0)),
    enseignants: clamp(current.enseignants + (impact.enseignants || 0)),
    parents: clamp(current.parents + (impact.parents || 0)),
    academie: clamp(current.academie + (impact.academie || 0)),
  };
}

// Get stakeholder info
export const STAKEHOLDER_INFO: Record<StakeholderGroup, { name: string; icon: string; description: string }> = {
  eleves: {
    name: 'Élèves',
    icon: '👨‍🎓',
    description: 'Les élèves apprécient les outils modernes et innovants.',
  },
  enseignants: {
    name: 'Enseignants',
    icon: '👩‍🏫',
    description: 'Les enseignants privilégient les outils pratiques et la formation.',
  },
  parents: {
    name: 'Parents',
    icon: '👪',
    description: 'Les parents valorisent la sécurité, la transparence et les économies.',
  },
  academie: {
    name: 'Académie',
    icon: '🏛️',
    description: 'L\'académie favorise la souveraineté numérique et la conformité.',
  },
};
