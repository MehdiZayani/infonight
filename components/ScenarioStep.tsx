"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { SCENARIO, Choice } from '../data/scenario';

interface GameState {
  budget: number;
  scoreNIRD: number;
  dependance: number;
  currentStepId: number | null;
}

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

interface Props {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onRestart: () => void;
  onChoiceMade: (choice: Choice) => void;
  schoolName: string;
  directorName: string;
  isRetroMode?: boolean;
}

// Transition screen component
interface TransitionProps {
  choice: Choice;
  nextStep: typeof SCENARIO[0] | null;
  currentStep: typeof SCENARIO[0];
  onComplete: () => void;
  directorName: string;
  isRetroMode?: boolean;
}

// Narration texts for transitions
const getNarration = (stepId: number, choiceId: string, fallback: string): string => {
  const narrations: Record<string, Record<string, string>> = {
    '1': {
      'a': "Les cartons arrivent. Cinquante ordinateurs flambant neufs, dernier cri. Les élèves sont impressionnés, mais quelque part, vous pensez aux anciens appareils qui finiront en décharge...",
      'b': "L'équipe de reconditionnement installe les machines avec soin. Ces ordinateurs ont une seconde vie, et votre budget respire. Un choix responsable.",
      'c': "Le contrat de leasing est signé. Flexibilité assurée, mais vous êtes désormais lié à ce fournisseur pour trois ans..."
    },
    '2': {
      'a': "Les licences Microsoft 365 sont activées. Teams, Word, Excel... tout est familier. Mais vos données traversent maintenant l'Atlantique.",
      'b': "LibreOffice s'installe sur chaque poste. Certains râlent au début, mais l'économie est considérable et vos données restent en France.",
      'c': "Un compromis subtil. Le meilleur des deux mondes, peut-être. Ou les inconvénients des deux ?"
    },
    '3': {
      'a': "Les bornes Cisco Meraki clignotent partout. Le réseau est impeccable, géré depuis le cloud. Mais à quel prix, chaque année ?",
      'b': "Votre équipe technique prend le contrôle total du réseau. C'est plus de travail, mais quelle indépendance !",
      'c': "Orange s'occupe de tout. Pratique, mais vous dépendez maintenant de leur réactivité..."
    },
    '4': {
      'a': "Pronote est installé. Les parents sont contents, ils connaissent déjà. Mais changer sera difficile maintenant...",
      'b': "École Directe offre plus de flexibilité. Un bon choix équilibré.",
      'c': "Karuta, l'ENT libre de l'Éducation Nationale. Souverain, personnalisable, mais il faudra former les équipes."
    },
    '5': {
      'a': "Certificats Microsoft en poche, vos enseignants maîtrisent les outils... propriétaires.",
      'b': "Vos ambassadeurs numériques essaiment leurs connaissances. La compétence reste dans l'établissement.",
      'c': "Les MOOCs sont lancés. Certains progressent vite, d'autres décrochent..."
    },
    '6': {
      'a': "L'audit est terminé. Vous êtes en conformité totale. Le rapport fait 200 pages.",
      'b': "Le DPO mutualisé met en place des solutions pérennes. Les autres établissements vous remercient.",
      'c': "Le minimum est fait. Espérons que la CNIL ne passe pas de sitôt..."
    },
    '7': {
      'a': "L'imprimante 3D ronronne déjà. Les élèves créent leurs premiers prototypes. L'innovation est en marche !",
      'b': "Le serveur pédagogique est opérationnel. Les projets des élèves y sont hébergés en sécurité.",
      'c': "La startup EdTech s'installe. Des outils modernes, mais combien de temps resteront-ils ?"
    },
    '8': {
      'a': "Le nouveau site est magnifique. Mais pour modifier une virgule, il faut appeler l'agence...",
      'b': "WordPress tourne bien. Vos équipes peuvent le mettre à jour. Presque.",
      'c': "Les élèves de SNT sont fiers : ils ont codé le site de leur école ! Un projet pédagogique exemplaire."
    },
    '9': {
      'a': "Le bilan carbone est sur la table du CA. Transparent, complet, crédible. Les parents applaudissent.",
      'b': "L'outil ADEME donne des résultats honnêtes. Pas parfait, mais sincère.",
      'c': "La communication met en avant vos succès. Les échecs ? Quels échecs ?"
    },
    '10': {
      'a': "Le label Numérique Responsable est en vue. Une reconnaissance nationale pour votre engagement.",
      'b': "Le partenariat est signé. Équipements gratuits, mais à quel prix pour votre indépendance ?",
      'c': "Le consortium est créé. Ensemble, les établissements sont plus forts. Une nouvelle ère commence."
    }
  };
  
  return narrations[stepId.toString()]?.[choiceId] || fallback;
};

// Narration texts for transitions - Part 2 (what happens after)
const getAfterNarration = (stepId: number, choiceId: string): string => {
  const afterNarrations: Record<string, Record<string, string>> = {
    '1': {
      'a': "Les semaines passent. Les machines tournent bien, mais chaque fois que vous voyez la facture d'électricité, vous vous demandez si c'était le bon choix...",
      'b': "Trois mois plus tard, pas une seule panne. Les techniciens du reconditionnement avaient raison : ces machines ont encore de belles années devant elles.",
      'c': "Le premier trimestre s'achève. Les machines fonctionnent, mais vous recevez déjà des emails pour le renouvellement du contrat..."
    },
    '2': {
      'a': "Les enseignants s'adaptent vite. Trop vite, peut-être. Ils ne jurent plus que par Teams et OneDrive. Le retour en arrière sera difficile.",
      'b': "Quelques semaines de grognements, puis le silence. LibreOffice fait le travail. Et ces 3700€ économisés serviront ailleurs.",
      'c': "Le compromis tient la route. Ce n'est parfait pour personne, mais acceptable pour tous."
    },
    '3': {
      'a': "Le Wi-Fi couvre enfin tout l'établissement. Les élèves rangent leurs forfaits 4G. Mais cette facture mensuelle...",
      'b': "Votre technicien devient une star. Il maîtrise le réseau comme personne. Pourvu qu'il ne parte pas...",
      'c': "Orange répond au téléphone en moins de 10 minutes. C'est déjà ça."
    },
    '4': {
      'a': "Les parents adorent. Les profs s'y sont mis. Pronote règne en maître. Pour le meilleur et pour le pire.",
      'b': "Un bon équilibre. Les parents comprennent l'interface, les profs gardent une marge de manœuvre.",
      'c': "Karuta demande du temps, mais quelle liberté ! Votre équipe commence à créer ses propres modules."
    },
    '5': {
      'a': "Vos enseignants brillent lors des certifications. Microsoft les félicite. Vous aussi, officiellement.",
      'b': "La salle des profs bourdonne. Les ambassadeurs forment, échangent, innovent. Une vraie dynamique collective.",
      'c': "Certains ont terminé 5 MOOCs. D'autres n'ont pas commencé le premier. La fracture numérique persiste."
    },
    '6': {
      'a': "Le rapport trône sur votre bureau. 200 pages de conformité. Le CA est rassuré, votre budget l'est moins.",
      'b': "Le réseau de DPO fonctionne. Les bonnes pratiques circulent entre établissements. Une vraie communauté.",
      'c': "Pour l'instant, ça passe. Mais vous savez que ce n'est qu'une question de temps..."
    },
    '7': {
      'a': "Le FabLab ne désemplit pas. Les élèves créent, expérimentent, échouent, recommencent. L'esprit maker souffle.",
      'b': "Le serveur ronronne dans son local climatisé. Les projets s'accumulent. Une vraie mémoire numérique.",
      'c': "La startup a de bonnes idées. Mais leurs conditions changent chaque trimestre..."
    },
    '8': {
      'a': "Le site fait sensation. Mais pour corriger une faute de frappe, il faut attendre trois jours et payer 50€.",
      'b': "WordPress demande de l'attention. Mises à jour, sécurité, sauvegardes... Un nouveau métier.",
      'c': "Les élèves de SNT sont passés au journal local. 'Ils ont codé le site de leur lycée'. Quelle fierté !"
    },
    '9': {
      'a': "Le bilan carbone circule. Transparent, honnête, parfois cruel. Mais c'est le début du changement.",
      'b': "L'outil ADEME révèle des surprises. Ces vieux serveurs consomment plus que prévu...",
      'c': "La plaquette est belle. Très belle. Peut-être trop belle pour être vraie ?"
    },
    '10': {
      'a': "Le dossier de labellisation avance. Votre établissement pourrait devenir une référence nationale.",
      'b': "Les équipements arrivent, gratuits. Avec eux, des conditions d'utilisation de 47 pages...",
      'c': "Le premier conseil du consortium se réunit. Ensemble, vous pesez. Ensemble, vous décidez."
    }
  };
  
  return afterNarrations[stepId.toString()]?.[choiceId] || "Le temps passe, les conséquences de vos choix se font sentir...";
};

function TransitionScreen({ choice, nextStep, currentStep, onComplete, directorName, isRetroMode = false }: TransitionProps) {
  const [phase, setPhase] = useState<'narration' | 'consequence' | 'reflection'>('narration');
  const [fadeIn, setFadeIn] = useState(true);
  const [textIndex, setTextIndex] = useState(0);
  const [afterTextIndex, setAfterTextIndex] = useState(0);
  
  const narrationText = getNarration(currentStep.id, choice.id, choice.consequence);
  const afterNarrationText = getAfterNarration(currentStep.id, choice.id);
  const words = narrationText.split(' ');
  const afterWords = afterNarrationText.split(' ');

  // Skip with Space key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete]);

  // Typewriter effect for first narration
  useEffect(() => {
    if (phase === 'narration' && textIndex < words.length) {
      const timer = setTimeout(() => {
        setTextIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [textIndex, words.length, phase]);

  // Typewriter effect for reflection
  useEffect(() => {
    if (phase === 'reflection' && afterTextIndex < afterWords.length) {
      const timer = setTimeout(() => {
        setAfterTextIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [afterTextIndex, afterWords.length, phase]);

  useEffect(() => {
    // Phase 1: Narration for 4.5s
    const timer1 = setTimeout(() => {
      setFadeIn(false);
    }, 4500);

    // Phase 2: Consequence/Impact 
    const timer2 = setTimeout(() => {
      setPhase('consequence');
      setFadeIn(true);
    }, 4800);

    // Phase 2 end
    const timer3 = setTimeout(() => {
      setFadeIn(false);
    }, 7300);

    // Phase 3: Reflection narration
    const timer4 = setTimeout(() => {
      setPhase('reflection');
      setFadeIn(true);
    }, 7600);

    // Final complete
    const timer5 = setTimeout(() => {
      onComplete();
    }, 11500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  // Get impact icons based on choice effects
  const getImpactIcons = () => {
    const icons = [];
    if (choice.cost < 0) icons.push({ icon: '💸', label: `${choice.cost.toLocaleString()} €`, color: 'text-red-700', bg: 'from-red-200 to-red-300' });
    if (choice.cost > 0) icons.push({ icon: '💰', label: `+${choice.cost.toLocaleString()} €`, color: 'text-emerald-700', bg: 'from-emerald-200 to-emerald-300' });
    if (choice.scoreNIRD > 0) icons.push({ icon: '🌱', label: `NIRD +${choice.scoreNIRD}`, color: 'text-emerald-700', bg: 'from-emerald-200 to-emerald-300' });
    if (choice.scoreNIRD < 0) icons.push({ icon: '🍂', label: `NIRD ${choice.scoreNIRD}`, color: 'text-red-700', bg: 'from-red-200 to-red-300' });
    if (choice.dependance > 0) icons.push({ icon: '⛓️', label: `Dépendance +${choice.dependance}`, color: 'text-orange-700', bg: 'from-orange-200 to-orange-300' });
    if (choice.dependance < 0) icons.push({ icon: '🔓', label: `Liberté +${Math.abs(choice.dependance)}`, color: 'text-cyan-700', bg: 'from-cyan-200 to-cyan-300' });
    return icons;
  };

  // Retro impact icons
  const getRetroImpactIcons = () => {
    const icons = [];
    if (choice.cost < 0) icons.push({ icon: '💸', label: `${choice.cost.toLocaleString()}€`, color: 'text-red-400', border: 'border-red-400' });
    if (choice.cost > 0) icons.push({ icon: '💰', label: `+${choice.cost.toLocaleString()}€`, color: 'text-green-400', border: 'border-green-400' });
    if (choice.scoreNIRD > 0) icons.push({ icon: '🌱', label: `NIRD +${choice.scoreNIRD}`, color: 'text-cyan-400', border: 'border-cyan-400' });
    if (choice.scoreNIRD < 0) icons.push({ icon: '🍂', label: `NIRD ${choice.scoreNIRD}`, color: 'text-orange-400', border: 'border-orange-400' });
    if (choice.dependance > 0) icons.push({ icon: '⛓️', label: `DEP +${choice.dependance}`, color: 'text-orange-400', border: 'border-orange-400' });
    if (choice.dependance < 0) icons.push({ icon: '🔓', label: `FREE +${Math.abs(choice.dependance)}`, color: 'text-cyan-400', border: 'border-cyan-400' });
    return icons;
  };

  // MODE RETRO
  if (isRetroMode) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center pixel-font">
        {/* Background with scanlines */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.8) 2px, rgba(0, 0, 0, 0.8) 4px)'
            }}
          />
        </div>

        {/* Content */}
        <div className={`relative z-10 text-center px-6 max-w-3xl w-full transition-all duration-500 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          
          {phase === 'narration' && (
            <div className="space-y-4">
              {/* Chapter header */}
              <div className="bg-purple-900 border-2 border-purple-400 px-6 py-2 inline-block">
                <span className="text-purple-300 text-sm">STAGE {currentStep.id}</span>
                <span className="text-purple-400 mx-2">|</span>
                <span className="text-cyan-400 font-bold">{currentStep.title}</span>
              </div>

              {/* Director icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-cyan-900 border-4 border-cyan-400 flex items-center justify-center">
                  <span className="text-4xl">👤</span>
                </div>
              </div>

              {/* Narration text - terminal style */}
              <div className="bg-gray-900 border-2 border-green-400 p-6 text-left">
                <div className="flex items-center gap-2 mb-3 text-green-600 text-xs">
                  <span>▶</span>
                  <span>NARRATIVE.LOG</span>
                </div>
                <p className="text-green-400 text-lg leading-relaxed">
                  {words.slice(0, textIndex).join(' ')}
                  {textIndex < words.length && <span className="animate-pulse text-cyan-400">_</span>}
                </p>
              </div>

              {/* Director name */}
              <div className="text-purple-400 text-sm">
                — {directorName}, PLAYER THOUGHTS
              </div>
            </div>
          )}

          {phase === 'consequence' && (
            <div className="space-y-4">
              {/* Impact header */}
              <div className="bg-yellow-900 border-2 border-yellow-400 px-6 py-2 inline-block">
                <span className="text-yellow-400 font-bold">⚡ IMPACT REPORT ⚡</span>
              </div>

              {/* Choice title */}
              <div className="flex justify-center items-center gap-4">
                <div className="w-16 h-16 bg-yellow-900 border-2 border-yellow-400 flex items-center justify-center">
                  <span className="text-3xl">{currentStep.icon}</span>
                </div>
                <h2 className="text-2xl font-bold text-yellow-400">
                  {choice.label}
                </h2>
              </div>

              {/* Impact cards */}
              <div className="flex justify-center gap-3 flex-wrap">
                {getRetroImpactIcons().map((impact, i) => (
                  <div key={i} className={`bg-black border-2 ${impact.border} px-4 py-2 flex items-center gap-2`}>
                    <span className="text-xl">{impact.icon}</span>
                    <span className={`font-bold text-sm ${impact.color}`}>{impact.label}</span>
                  </div>
                ))}
              </div>

              {/* Consequence text */}
              <div className="bg-gray-900 border-2 border-cyan-400 p-4">
                <p className="text-cyan-400">{choice.consequence}</p>
              </div>
            </div>
          )}

          {phase === 'reflection' && (
            <div className="space-y-4">
              {/* Time passing header */}
              <div className="bg-green-900 border-2 border-green-400 px-6 py-2 inline-block">
                <span className="text-green-400 font-bold">⏳ TIME PASSES... ⏳</span>
              </div>

              {/* Thinking icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-900 border-4 border-green-400 flex items-center justify-center">
                  <span className="text-4xl">🤔</span>
                </div>
              </div>

              {/* Reflection text */}
              <div className="bg-gray-900 border-2 border-green-400 p-6 text-left">
                <div className="flex items-center gap-2 mb-3 text-green-600 text-xs">
                  <span>▶</span>
                  <span>REFLECTION.LOG</span>
                </div>
                <p className="text-green-400 text-lg leading-relaxed">
                  {afterWords.slice(0, afterTextIndex).join(' ')}
                  {afterTextIndex < afterWords.length && <span className="animate-pulse text-cyan-400">_</span>}
                </p>
              </div>

              {/* Next step hint */}
              {nextStep && (
                <div className="bg-purple-900 border-2 border-purple-400 px-4 py-2 inline-flex items-center gap-3">
                  <span className="text-purple-300 text-sm">NEXT STAGE:</span>
                  <div className="w-8 h-8 bg-purple-800 border border-purple-400 flex items-center justify-center">
                    <span className="text-lg">{nextStep.icon}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Progress bar - retro style */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="bg-black border-2 border-gray-600 p-2 flex gap-2">
            <div className={`w-16 h-3 border transition-all ${phase === 'narration' ? 'bg-purple-400 border-purple-300' : 'bg-gray-800 border-gray-600'}`} />
            <div className={`w-16 h-3 border transition-all ${phase === 'consequence' ? 'bg-yellow-400 border-yellow-300' : 'bg-gray-800 border-gray-600'}`} />
            <div className={`w-16 h-3 border transition-all ${phase === 'reflection' ? 'bg-green-400 border-green-300' : 'bg-gray-800 border-gray-600'}`} />
          </div>
        </div>

        {/* Skip button - retro */}
        <button 
          onClick={onComplete}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 border-2 border-cyan-400 px-4 py-2 hover:bg-gray-800 transition-all active:scale-95"
        >
          <span className="text-cyan-400 text-sm">SKIP</span>
          <span className="text-cyan-600 text-xs ml-2">[SPACE]</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background image - changes based on phase */}
      <div className="absolute inset-0">
        <Image
          src={phase === 'reflection' && nextStep ? nextStep.image : currentStep.image}
          alt="Scene"
          fill
          className="object-cover transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/80 via-amber-900/70 to-amber-950/80" />
      </div>

      {/* Decorative vines corners */}
      <div className="absolute top-4 left-4 text-5xl transform -rotate-45 opacity-60">🌿</div>
      <div className="absolute top-4 right-4 text-5xl transform rotate-45 opacity-60">🌿</div>
      <div className="absolute bottom-4 left-4 text-5xl transform rotate-45 opacity-60">🌿</div>
      <div className="absolute bottom-4 right-4 text-5xl transform -rotate-45 opacity-60">🌿</div>

      {/* Content */}
      <div className={`relative z-10 text-center px-6 max-w-4xl w-full transition-all duration-500 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        {phase === 'narration' && (
          <div className="space-y-6">
            {/* Chapter ribbon banner */}
            <div className="relative inline-block">
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-amber-800 to-amber-700"
                style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)' }}
              />
              <div className="bg-gradient-to-b from-amber-600 via-amber-700 to-amber-800 px-8 py-3 rounded-sm shadow-xl border-t-2 border-amber-400/40">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📖</span>
                  <span className="text-amber-100 font-bold text-lg tracking-wide">Chapitre {currentStep.id} — {currentStep.title}</span>
                </div>
              </div>
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-l from-amber-800 to-amber-700"
                style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }}
              />
            </div>

            {/* Director in ornate frame */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-4 border-amber-600"
                  style={{
                    background: 'linear-gradient(180deg, rgba(251,191,36,0.4) 0%, rgba(180,83,9,0.4) 100%)'
                  }}
                />
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center border-2 border-amber-500">
                  <span className="text-5xl">👤</span>
                </div>
                {/* Decorative corners */}
                <div className="absolute -top-2 -left-2 text-lg">⚜️</div>
                <div className="absolute -top-2 -right-2 text-lg">⚜️</div>
              </div>
            </div>

            {/* Narration text in parchment scroll */}
            <div className="relative">
              {/* Scroll top decoration */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-gradient-to-b from-amber-700 to-amber-800 rounded-t-full" />
              
              {/* Main parchment */}
              <div className="relative rounded-2xl p-2 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #8B4513 0%, #654321 25%, #8B4513 50%, #654321 75%, #8B4513 100%)'
                }}
              >
                <div className="bg-gradient-to-b from-amber-100 via-amber-50 to-amber-100 rounded-xl p-8 border-2 border-amber-300/50"
                  style={{
                    boxShadow: 'inset 0 2px 10px rgba(180, 130, 80, 0.3)'
                  }}
                >
                  {/* Parchment texture */}
                  <div className="absolute inset-0 rounded-xl opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`
                    }}
                  />
                  
                  <p className="relative text-amber-900 text-xl leading-relaxed min-h-[100px] italic font-serif">
                    « {words.slice(0, textIndex).join(' ')}
                    {textIndex < words.length && <span className="animate-pulse text-amber-600">|</span>} »
                  </p>
                </div>
              </div>
              
              {/* Scroll bottom decoration */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-gradient-to-t from-amber-700 to-amber-800 rounded-b-full" />
            </div>

            {/* Director name in small ribbon */}
            <div className="inline-block bg-gradient-to-b from-amber-600 to-amber-700 px-4 py-1.5 rounded-sm shadow-md">
              <p className="text-amber-200 text-sm font-medium">— {directorName}, vos pensées</p>
            </div>
          </div>
        )}

        {phase === 'consequence' && (
          <div className="space-y-6">
            {/* Impact ribbon banner */}
            <div className="relative inline-block">
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-cyan-800 to-cyan-700"
                style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)' }}
              />
              <div className="bg-gradient-to-b from-cyan-600 via-cyan-700 to-cyan-800 px-8 py-3 rounded-sm shadow-xl border-t-2 border-cyan-400/40">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <span className="text-cyan-100 font-bold text-lg tracking-wide">Conséquences immédiates</span>
                </div>
              </div>
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-l from-cyan-800 to-cyan-700"
                style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }}
              />
            </div>

            {/* Choice title with icon in ornate frame */}
            <div className="flex justify-center items-center gap-4">
              <div className="w-20 h-20 rounded-full border-4 border-amber-600 bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center shadow-xl">
                <span className="text-4xl">{currentStep.icon}</span>
              </div>
              <h2 className="text-3xl font-bold text-amber-100 drop-shadow-lg font-serif">
                {choice.label}
              </h2>
            </div>

            {/* Impact cards - parchment style */}
            <div className="flex justify-center gap-4 flex-wrap">
              {getImpactIcons().map((impact, i) => (
                <div 
                  key={i}
                  className="relative rounded-xl p-0.5 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #8B4513 0%, #654321 100%)'
                  }}
                >
                  <div className={`flex items-center gap-3 bg-gradient-to-b ${impact.bg} rounded-lg px-5 py-3 border border-amber-400/30`}>
                    <span className="text-2xl">{impact.icon}</span>
                    <span className={`font-bold ${impact.color}`}>{impact.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Consequence in parchment */}
            <div className="relative rounded-2xl p-1.5 shadow-2xl mx-auto max-w-2xl"
              style={{
                background: 'linear-gradient(135deg, #8B4513 0%, #654321 25%, #8B4513 50%, #654321 75%, #8B4513 100%)'
              }}
            >
              <div className="bg-gradient-to-b from-amber-100 via-amber-50 to-amber-100 rounded-xl p-6 border border-amber-300/50">
                <p className="text-amber-800 text-lg font-serif">{choice.consequence}</p>
              </div>
            </div>
          </div>
        )}

        {phase === 'reflection' && (
          <div className="space-y-6">
            {/* Time passing ribbon banner */}
            <div className="relative inline-block">
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-emerald-800 to-emerald-700"
                style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)' }}
              />
              <div className="bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-800 px-8 py-3 rounded-sm shadow-xl border-t-2 border-emerald-400/40">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⏳</span>
                  <span className="text-emerald-100 font-bold text-lg tracking-wide">Quelque temps plus tard...</span>
                </div>
              </div>
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-l from-emerald-800 to-emerald-700"
                style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }}
              />
            </div>

            {/* Thinking director in ornate frame */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-4 border-emerald-600"
                  style={{
                    background: 'linear-gradient(180deg, rgba(52,211,153,0.4) 0%, rgba(6,95,70,0.4) 100%)'
                  }}
                />
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-emerald-200 to-emerald-400 flex items-center justify-center border-2 border-emerald-500">
                  <span className="text-5xl">🤔</span>
                </div>
                <div className="absolute -top-2 -left-2 text-lg">⚜️</div>
                <div className="absolute -top-2 -right-2 text-lg">⚜️</div>
              </div>
            </div>

            {/* Reflection narration in parchment scroll */}
            <div className="relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-gradient-to-b from-amber-700 to-amber-800 rounded-t-full" />
              
              <div className="relative rounded-2xl p-2 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #8B4513 0%, #654321 25%, #8B4513 50%, #654321 75%, #8B4513 100%)'
                }}
              >
                <div className="bg-gradient-to-b from-amber-100 via-amber-50 to-amber-100 rounded-xl p-8 border-2 border-amber-300/50"
                  style={{
                    boxShadow: 'inset 0 2px 10px rgba(180, 130, 80, 0.3)'
                  }}
                >
                  <div className="absolute inset-0 rounded-xl opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`
                    }}
                  />
                  
                  <p className="relative text-amber-900 text-xl leading-relaxed min-h-[100px] italic font-serif">
                    « {afterWords.slice(0, afterTextIndex).join(' ')}
                    {afterTextIndex < afterWords.length && <span className="animate-pulse text-emerald-600">|</span>} »
                  </p>
                </div>
              </div>
              
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-gradient-to-t from-amber-700 to-amber-800 rounded-b-full" />
            </div>

            {/* Next step hint in small parchment */}
            {nextStep && (
              <div className="inline-flex items-center gap-3 bg-gradient-to-b from-amber-200 to-amber-300 px-5 py-2.5 rounded-xl border-2 border-amber-500/50 shadow-lg">
                <span className="text-amber-800 text-sm font-medium">Mais une nouvelle décision vous attend...</span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-300 flex items-center justify-center border-2 border-amber-500">
                  <span className="text-xl">{nextStep.icon}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress bar - wood frame style */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="bg-gradient-to-b from-amber-700 to-amber-900 rounded-full p-1.5 shadow-lg">
          <div className="flex gap-2 bg-amber-100 rounded-full px-4 py-2">
            <div className={`w-20 h-2.5 rounded-full transition-all ${phase === 'narration' ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 'bg-amber-300'}`} />
            <div className={`w-20 h-2.5 rounded-full transition-all ${phase === 'consequence' ? 'bg-gradient-to-r from-cyan-500 to-cyan-600' : 'bg-amber-300'}`} />
            <div className={`w-20 h-2.5 rounded-full transition-all ${phase === 'reflection' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-amber-300'}`} />
          </div>
        </div>
      </div>

      {/* Skip button - parchment style */}
      <button 
        onClick={onComplete}
        className="absolute bottom-20 left-1/2 -translate-x-1/2"
      >
        <div className="flex items-center gap-2 bg-gradient-to-b from-amber-200 to-amber-300 hover:from-amber-100 hover:to-amber-200 px-4 py-2 rounded-lg border-2 border-amber-600/50 shadow-md transition-all active:scale-95">
          <span className="text-amber-800 text-sm font-medium">Passer</span>
          <span className="text-xs bg-amber-600 text-amber-100 px-2 py-0.5 rounded font-bold">Espace</span>
        </div>
      </button>
    </div>
  );
}

export default function ScenarioStep({ gameState, setGameState, onRestart, onChoiceMade, schoolName, directorName, isRetroMode = false }: Props) {
  const [hoveredChoice, setHoveredChoice] = useState<string | null>(null);
  const [transition, setTransition] = useState<{ choice: Choice; nextStepId: number | null; currentStep: typeof SCENARIO[0] } | null>(null);

  const step = SCENARIO.find((s) => s.id === gameState.currentStepId);
  const nextStepForTransition = transition ? SCENARIO.find(s => s.id === transition.nextStepId) || null : null;

  // Handle transition completion
  const handleTransitionComplete = () => {
    if (transition) {
      // Apply the actual state change
      setGameState({
        budget: gameState.budget + transition.choice.cost,
        scoreNIRD: gameState.scoreNIRD + transition.choice.scoreNIRD,
        dependance: gameState.dependance + transition.choice.dependance,
        currentStepId: transition.nextStepId,
      });
      setTransition(null);
    }
  };

  // Show transition screen if active
  if (transition) {
    return (
      <TransitionScreen
        choice={transition.choice}
        nextStep={nextStepForTransition}
        currentStep={transition.currentStep}
        onComplete={handleTransitionComplete}
        directorName={directorName}
        isRetroMode={isRetroMode}
      />
    );
  }

  // End game screen
  if (!step) {
    // Normaliser les scores sur 100
    const scoreNIRD = clamp(Math.round(gameState.scoreNIRD), 0, 100);
    const dependance = clamp(Math.round(gameState.dependance), 0, 100);
    const budgetInitial = 50000;
    const budgetFinal = gameState.budget;
    
    // Calcul du score financier (sur 100)
    // Positif si on a économisé, négatif si on a trop dépensé
    const budgetScore = clamp(Math.round(((budgetFinal / budgetInitial) * 50) + 50), 0, 100);
    
    // Score d'indépendance (inverse de dépendance)
    const independanceScore = 100 - dependance;
    
    // Score global pondéré (sur 100)
    // 40% NIRD + 35% Indépendance + 25% Budget
    const scoreGlobal = Math.round(
      (scoreNIRD * 0.40) + 
      (independanceScore * 0.35) + 
      (budgetScore * 0.25)
    );
    
    const getGrade = () => {
      if (scoreGlobal >= 85) return { grade: 'S', label: 'Exemplaire', color: 'from-yellow-400 to-amber-500', emoji: '🏆', desc: 'Votre établissement est une référence nationale !' };
      if (scoreGlobal >= 70) return { grade: 'A', label: 'Excellent', color: 'from-emerald-400 to-emerald-600', emoji: '🌟', desc: 'Transition numérique réussie avec brio !' };
      if (scoreGlobal >= 55) return { grade: 'B', label: 'Très Bien', color: 'from-cyan-400 to-cyan-600', emoji: '👏', desc: 'De bons choix ont été faits.' };
      if (scoreGlobal >= 40) return { grade: 'C', label: 'Satisfaisant', color: 'from-indigo-400 to-indigo-600', emoji: '👍', desc: 'Des efforts notables mais perfectibles.' };
      if (scoreGlobal >= 25) return { grade: 'D', label: 'Insuffisant', color: 'from-orange-400 to-orange-600', emoji: '😐', desc: 'La transition reste incomplète.' };
      return { grade: 'F', label: 'Échec', color: 'from-red-400 to-red-600', emoji: '😔', desc: 'Les objectifs n\'ont pas été atteints.' };
    };

    const result = getGrade();

    return (
      <div className="relative">
        {/* Wood frame */}
        <div className="bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-3xl p-2 shadow-2xl border-4 border-amber-950">
          <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-2xl overflow-hidden">
            
            {/* Header with grade and image */}
            <div className={`relative h-48 overflow-hidden`}>
              <Image
                src={result.grade === 'F' || result.grade === 'D' ? "/images/end-defeat.png" : "/images/end-victory.png"}
                alt="Result"
                fill
                className="object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${result.color} opacity-80`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">{result.emoji}</div>
                <h2 className="text-3xl font-bold text-white mb-2">Fin du Mandat</h2>
                <p className="text-white/80">{schoolName}</p>
              </div>
            </div>

            {/* Grade badge */}
            <div className="p-6 text-center -mt-6">
              <div className="inline-block bg-gradient-to-b from-amber-600 to-amber-800 rounded-2xl p-1 border-2 border-amber-900">
                <div className={`bg-gradient-to-r ${result.color} px-8 py-4 rounded-xl`}>
                  <span className="text-5xl font-black text-white">{result.grade}</span>
                  <div className="text-white font-bold mt-1">{result.label}</div>
                </div>
              </div>
            </div>

            {/* Final Stats */}
            <div className="px-6 pb-6">
              {/* Score global */}
              <div className="bg-gradient-to-b from-amber-200 to-amber-300 rounded-xl p-4 mb-4 border-2 border-amber-400">
                <h3 className="text-sm font-bold text-amber-900 mb-3 text-center uppercase">🎯 Score Global</h3>
                <div className="relative h-6 bg-amber-100 rounded-full overflow-hidden border-2 border-amber-500 mb-2">
                  <div 
                    className={`h-full bg-gradient-to-r ${result.color} transition-all duration-1000`}
                    style={{ width: `${scoreGlobal}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold text-amber-900 text-sm drop-shadow">{scoreGlobal}/100</span>
                  </div>
                </div>
                <p className="text-amber-800 text-xs text-center italic">{result.desc}</p>
              </div>

              <div className="bg-gradient-to-b from-amber-200 to-amber-300 rounded-xl p-4 mb-4 border-2 border-amber-400">
                <h3 className="text-sm font-bold text-amber-900 mb-3 text-center uppercase">📊 Détail du Bilan</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-amber-100 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">🌱</div>
                    <div className="text-lg font-bold text-emerald-700">{scoreNIRD}/100</div>
                    <div className="text-xs text-amber-700">Score NIRD</div>
                    <div className="mt-1 h-1.5 bg-amber-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${scoreNIRD}%` }} />
                    </div>
                  </div>
                  <div className="bg-amber-100 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">🔓</div>
                    <div className={`text-lg font-bold ${independanceScore >= 60 ? 'text-emerald-700' : independanceScore >= 40 ? 'text-orange-600' : 'text-red-700'}`}>
                      {independanceScore}/100
                    </div>
                    <div className="text-xs text-amber-700">Indépendance</div>
                    <div className="mt-1 h-1.5 bg-amber-200 rounded-full overflow-hidden">
                      <div className={`h-full ${independanceScore >= 60 ? 'bg-emerald-500' : independanceScore >= 40 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${independanceScore}%` }} />
                    </div>
                  </div>
                </div>
                <div className="bg-amber-100 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">💰</div>
                  <div className={`text-lg font-bold ${budgetFinal >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(budgetFinal)}
                  </div>
                  <div className="text-xs text-amber-700">Budget restant (initial: 50 000 €)</div>
                  <div className="mt-1 h-1.5 bg-amber-200 rounded-full overflow-hidden">
                    <div className={`h-full ${budgetScore >= 50 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${budgetScore}%` }} />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="bg-amber-100 rounded-lg p-4 mb-4 border border-amber-300">
                <p className="text-amber-800 text-sm leading-relaxed text-center">
                  {scoreGlobal >= 70 
                    ? `🎉 Félicitations ${directorName} ! Le ${schoolName} est devenu un modèle de numérique responsable et durable !`
                    : scoreGlobal >= 50 
                    ? `👍 Bon travail ${directorName} ! Des progrès significatifs ont été accomplis au ${schoolName}.`
                    : scoreGlobal >= 30
                    ? `⚠️ Attention ${directorName}, le ${schoolName} a encore du chemin à parcourir vers l'autonomie numérique.`
                    : `😔 Dommage ${directorName}... Le ${schoolName} reste très dépendant. Il faudra revoir la stratégie.`
                  }
                </p>
              </div>

              {/* Replay button */}
              <button
                onClick={onRestart}
                className="w-full bg-gradient-to-b from-amber-600 to-amber-800 rounded-xl p-1 border-2 border-amber-900 hover:from-amber-500 hover:to-amber-700 transition-all active:scale-98"
              >
                <div className="bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-lg py-4 px-4">
                  <span className="font-bold text-white text-lg">🔄 Rejouer</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Decorative leaves */}
        <div className="absolute -top-3 -left-3 text-3xl transform -rotate-45">🌿</div>
        <div className="absolute -top-3 -right-3 text-3xl transform rotate-45">🌿</div>
      </div>
    );
  }

  const handleChoice = (choice: Choice) => {
    if (!step) return;
    
    // Trigger notification
    onChoiceMade(choice);
    
    // Start transition instead of immediate state change
    setTransition({
      choice,
      nextStepId: choice.nextId,
      currentStep: step
    });
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Full screen background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={step.image}
          alt={step.title}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
      </div>

      {/* Top title bar */}


      {/* Context bubble - positioned in middle area */}
      <div className="relative z-10 flex-1 flex items-end pb-4 px-4">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-amber-200 shadow-xl max-w-2xl mx-auto w-full">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💬</span>
            <div>
              <p className="text-amber-900 leading-relaxed">{step.context}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Choices - higher position, more visible */}
      <div className="relative z-10 px-4 pb-6">
        <div className="max-w-5xl mx-auto">
          {/* Section title */}
          <div className="text-center mb-3">
            {isRetroMode ? (
              <span className="inline-flex items-center gap-2 text-yellow-300 text-sm font-bold bg-black/70 backdrop-blur-sm px-4 py-2 border-2 border-yellow-400 pixel-font" style={{textShadow: '0 0 10px #FFFF00'}}>
                <span>🎯</span> CHOISIR VOTRE ACTION
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-white/80 text-sm font-medium bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full">
                <span>🎯</span> Quelle décision prenez-vous ?
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {step.choices.map((c) => (
              <button
                key={c.id}
                onClick={() => handleChoice(c)}
                onMouseEnter={() => setHoveredChoice(c.id)}
                onMouseLeave={() => setHoveredChoice(null)}
                className="text-left transition-all active:scale-95 group"
                style={isRetroMode ? {
                  padding: '8px',
                  background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
                  border: '3px solid #000',
                  boxShadow: hoveredChoice === c.id 
                    ? 'inset 0 2px 0px rgba(255, 255, 255, 0.6), inset 0 -2px 0px rgba(0, 0, 0, 0.5), 6px 6px 0px rgba(0, 0, 0, 0.4)'
                    : 'inset 0 2px 0px rgba(255, 255, 255, 0.6), inset 0 -2px 0px rgba(0, 0, 0, 0.5), 4px 4px 0px rgba(0, 0, 0, 0.3)',
                  cursor: 'pointer'
                } : undefined}
              >
                {isRetroMode ? (
                  <div className="bg-gradient-to-b from-purple-800 via-purple-900 to-purple-950 p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold pixel-font text-green-400" style={{ textShadow: '0 0 10px #00FF00' }}>{c.label}</h4>
                      <span className={c.cost >= 0 ? 'px-2 py-1 text-xs font-bold border-2 border-black bg-emerald-500 text-black' : 'px-2 py-1 text-xs font-bold border-2 border-black bg-red-500 text-black'}>
                        {c.cost >= 0 ? '+' : ''}{new Intl.NumberFormat('fr-FR').format(c.cost)} €
                      </span>
                    </div>
                    <p className="text-green-300 text-xs mb-2 font-mono" style={{ textShadow: '0 0 5px rgba(0, 255, 0, 0.5)' }}>{c.description}</p>
                    <div className={hoveredChoice === c.id ? 'flex items-center gap-1 text-xs font-bold pixel-font text-yellow-300' : 'flex items-center gap-1 text-xs font-bold pixel-font text-green-400'} style={{textShadow: '0 0 5px currentColor'}}>
                      <span>→</span>
                      <span>SÉLECTIONNER</span>
                    </div>
                  </div>
                ) : (
                  <div className={`bg-gradient-to-b from-amber-600 to-amber-800 rounded-2xl p-0.5 border-2 border-amber-400/50 transition-all ${
                    hoveredChoice === c.id ? 'scale-[1.02] shadow-2xl shadow-amber-500/40 border-amber-300' : 'hover:border-amber-400'
                  }`}>
                    <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-amber-900">{c.label}</h4>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          c.cost >= 0 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {c.cost >= 0 ? '+' : ''}{new Intl.NumberFormat('fr-FR').format(c.cost)} €
                        </span>
                      </div>
                      <p className="text-amber-700 text-sm mb-2">{c.description}</p>
                      <div className={`flex items-center gap-1 text-xs transition-all ${
                        hoveredChoice === c.id ? 'text-cyan-600' : 'text-amber-400'
                      }`}>
                        <span>→</span>
                        <span>Cliquez pour choisir</span>
                      </div>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
