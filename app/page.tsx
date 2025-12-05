"use client";

import React, { useState, useEffect, useCallback } from 'react';
import NameInput from '../components/NameInput';
import GameIntro from '../components/GameIntro';
import GameEnd from '../components/GameEnd';
import RetroGaming from '../components/RetroGaming';
import RetroGameWrapper from '../components/RetroGameWrapper';
import Indicators from '../components/Indicators';
import ScenarioStep from '../components/ScenarioStep';
import PauseMenu from '../components/PauseMenu';
import ChoiceNotification from '../components/ChoiceNotification';
import SchoolMap from '../components/SchoolMap';
import RandomEventModal from '../components/RandomEventModal';
import { ReputationChangeNotification } from '../components/ReputationDisplay';
import { ParticleSystem } from '../components/Animations';
import { useAudio } from '../hooks/useAudio';
import { Choice } from '../data/scenario';
import { ReputationState, INITIAL_REPUTATION, REPUTATION_IMPACTS, applyReputationImpact, StakeholderGroup } from '../data/reputation';
import { RandomEvent, getRandomEvent } from '../data/randomEvents';

type GamePhase = 'title' | 'nameInput' | 'loading' | 'intro' | 'playing' | 'gameEnd' | 'retroGaming';

const initialGameState = {
  budget: 50000,
  scoreNIRD: 0,
  dependance: 50,
  currentStepId: 1 as number | null,
};

export default function Home() {
  const [phase, setPhase] = useState<GamePhase>('title');
  const [isPaused, setIsPaused] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [directorName, setDirectorName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [lastChoice, setLastChoice] = useState<Choice | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isRetroMode, setIsRetroMode] = useState(false);
  const [gameState, setGameState] = useState<{
    budget: number;
    scoreNIRD: number;
    dependance: number;
    currentStepId: number | null;
  }>(initialGameState);

  // New state for reputation system
  const [reputation, setReputation] = useState<ReputationState>(INITIAL_REPUTATION);
  const [reputationChanges, setReputationChanges] = useState<{
    group: StakeholderGroup;
    oldValue: number;
    newValue: number;
  }[]>([]);
  const [showReputationChange, setShowReputationChange] = useState(false);

  // New state for random events
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);
  const [triggeredEvents, setTriggeredEvents] = useState<string[]>([]);

  // Audio system
  const { playSound, startMusic, toggleMute, isMuted, initAudio, setMusicVolume, musicVolume } = useAudio();

  const handleStart = () => {
    initAudio();
    playSound('click');
    startMusic();
    setPhase('nameInput');
  };

  const handleNameSubmit = (director: string, school: string) => {
    playSound('success');
    setDirectorName(director);
    setSchoolName(school);
    setPhase('loading');
    setTimeout(() => {
      setPhase('intro');
    }, 2000);
  };

  const handleIntroComplete = () => {
    playSound('levelUp');
    setPhase('playing');
  };

  const handleRestart = () => {
    setGameState(initialGameState);
    setReputation(INITIAL_REPUTATION);
    setCompletedSteps([]);
    setTriggeredEvents([]);
    setPhase('intro');
    setIsPaused(false);
    setShowMap(false);
  };

  const handleQuit = () => {
    setGameState(initialGameState);
    setReputation(INITIAL_REPUTATION);
    setCompletedSteps([]);
    setTriggeredEvents([]);
    setDirectorName('');
    setSchoolName('');
    setPhase('title');
    setIsPaused(false);
    setShowMap(false);
  };

  const handleChoiceMade = (choice: Choice) => {
    playSound('pageFlip');
    setLastChoice(choice);
    setShowNotification(true);
    
    // Apply reputation impact
    const stepId = gameState.currentStepId?.toString() || '1';
    const impact = REPUTATION_IMPACTS[stepId]?.[choice.id];
    if (impact) {
      const oldReputation = reputation;
      const newReputation = applyReputationImpact(reputation, impact);
      setReputation(newReputation);

      // Track changes for notification
      const changes: typeof reputationChanges = [];
      const groups: StakeholderGroup[] = ['eleves', 'enseignants', 'parents', 'academie'];
      groups.forEach(group => {
        if (impact[group] && impact[group] !== 0) {
          changes.push({
            group,
            oldValue: oldReputation[group],
            newValue: newReputation[group],
          });
        }
      });
      if (changes.length > 0) {
        setReputationChanges(changes);
        setShowReputationChange(true);
        setTimeout(() => setShowReputationChange(false), 3000);
      }
    }

    // Track completed step
    if (gameState.currentStepId && !completedSteps.includes(gameState.currentStepId)) {
      setCompletedSteps(prev => [...prev, gameState.currentStepId as number]);
    }

    // Check for random event after choice
    setTimeout(() => {
      const nextStep = choice.nextId || (gameState.currentStepId || 0) + 1;
      
      // Check if game should end (after step 10)
      if (nextStep > 10) {
        setPhase('gameEnd');
        return;
      }
      
      const event = getRandomEvent(nextStep, triggeredEvents);
      if (event) {
        playSound('alert');
        setCurrentEvent(event);
        setTriggeredEvents(prev => [...prev, event.id]);
      }
    }, 500);

    setTimeout(() => {
      setShowNotification(false);
    }, 2500);
  };

  const togglePause = useCallback(() => {
    if (phase === 'playing') {
      setIsPaused(p => !p);
    }
  }, [phase]);

  // Keyboard handler for retro mode and pause
  useEffect(() => {
    let retroSequence = '';
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for pause
      if (e.key === 'Escape' && phase === 'playing') {
        togglePause();
      }

      // Detect "RETRO" sequence
      retroSequence += e.key.toUpperCase();
      if (retroSequence.length > 5) {
        retroSequence = retroSequence.slice(-5);
      }
      
      if (retroSequence === 'RETRO') {
        setIsRetroMode(prev => !prev);
        retroSequence = '';
        playSound('success');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, togglePause, playSound]);

  // Title screen - Wood themed
  if (phase === 'title') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative">
          {/* Main wood frame */}
          <div className="bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-3xl p-3 shadow-2xl border-4 border-amber-950">
            <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-2xl p-8 text-center min-w-[400px]">
              
              {/* Logo */}
              <div className="mb-6">
                <div className="text-7xl mb-4 animate-bounce">🎓</div>
                <h1 className="text-4xl font-black text-amber-900 mb-2">
                  Le Défi NIRD
                </h1>
                <div className="bg-gradient-to-b from-amber-600 to-amber-800 rounded-lg p-1 inline-block">
                  <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 rounded px-4 py-1">
                    <p className="text-sm font-semibold text-white">
                      Numérique Inclusif, Responsable et Durable
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gradient-to-b from-amber-200 to-amber-300 rounded-xl p-4 mb-6 border-2 border-amber-400">
                <p className="text-amber-800 text-sm leading-relaxed">
                  Prenez les commandes d&apos;un établissement scolaire et menez sa transition numérique vers l&apos;autonomie et la durabilité.
                </p>
              </div>

              {/* Start button */}
              <button
                onClick={handleStart}
                className="w-full bg-gradient-to-b from-amber-600 to-amber-800 rounded-xl p-1 border-2 border-amber-900 hover:from-amber-500 hover:to-amber-700 transition-all active:scale-98 group"
              >
                <div className="bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-lg py-4 px-6">
                  <span className="font-bold text-white text-xl flex items-center justify-center gap-3">
                    Nouvelle Partie
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </button>

              {/* Footer */}
              <p className="mt-6 text-amber-600 text-xs">
                Un jeu éducatif sur le numérique responsable
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 text-4xl transform -rotate-45">🌿</div>
          <div className="absolute -top-4 -right-4 text-4xl transform rotate-45">🌿</div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-3xl">🌱</div>
        </div>
      </div>
    );
  }

  // Name input screen
  if (phase === 'nameInput') {
    return <NameInput onSubmit={handleNameSubmit} />;
  }

  // Loading screen
  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="relative">
          <div className="bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-3xl p-2 shadow-2xl border-4 border-amber-950">
            <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-2xl p-8 text-center">
              {/* Spinning loader */}
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-amber-300" />
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-cyan-500 border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
              </div>
              <h2 className="text-xl font-bold text-amber-900 mb-2">Préparation du défi...</h2>
              <p className="text-amber-700 text-sm animate-pulse">Bienvenue, {directorName} !</p>
            </div>
          </div>
          
          {/* Decorative leaves */}
          <div className="absolute -top-3 -left-3 text-3xl transform -rotate-45">🌿</div>
          <div className="absolute -top-3 -right-3 text-3xl transform rotate-45">🌿</div>
        </div>
      </div>
    );
  }

  // Intro screen
  if (phase === 'intro') {
    return <GameIntro onStart={handleIntroComplete} directorName={directorName} schoolName={schoolName} />;
  }

  // Game end screen
  if (phase === 'gameEnd') {
    return (
      <GameEnd
        directorName={directorName}
        schoolName={schoolName}
        budget={gameState.budget}
        scoreNIRD={gameState.scoreNIRD}
        dependance={gameState.dependance}
        onRetroGame={() => setPhase('retroGaming')}
        onQuit={handleQuit}
      />
    );
  }

  // Retro gaming screen with arcade cabinet style
  if (phase === 'retroGaming') {
    return (
      <RetroGameWrapper isRetroMode={true}>
        <RetroGaming
          onQuit={handleQuit}
          directorName={directorName}
        />
      </RetroGameWrapper>
    );
  }

  // Game screen
  const gameContent = (
    <div className="min-h-screen bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 p-4 md:p-6">
      {/* Background texture */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <Indicators 
          gameState={gameState} 
          onPause={togglePause} 
          schoolName={schoolName}
          onMapToggle={() => setShowMap(true)}
          completedSteps={completedSteps.length}
          isRetroMode={isRetroMode}
        />
        <ScenarioStep 
          gameState={gameState} 
          setGameState={setGameState} 
          onRestart={handleRestart}
          onChoiceMade={handleChoiceMade}
          schoolName={schoolName}
          directorName={directorName}
          isRetroMode={isRetroMode}
        />
      </div>

      {/* Choice notification */}
      <ChoiceNotification choice={lastChoice} isVisible={showNotification} />

      {/* School Map Modal */}
      {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl h-[80vh] animate-in fade-in zoom-in duration-300">
            <SchoolMap
              currentStepId={gameState.currentStepId || 1}
              completedSteps={completedSteps}
              schoolName={schoolName}
              isInteractive={false}
              isRetroMode={isRetroMode}
            />
            {/* Close button */}
            <button
              onClick={() => setShowMap(false)}
              className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-all hover:scale-110 z-50"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Random Event Modal */}
      {currentEvent && (
        <RandomEventModal
          event={currentEvent}
          directorName={directorName}
          isRetroMode={isRetroMode}
          onChoice={(choice) => {
            // Apply event choice impacts
            playSound('magic');
            setGameState(prev => ({
              ...prev,
              budget: prev.budget + choice.budgetImpact,
              scoreNIRD: Math.max(0, Math.min(100, prev.scoreNIRD + choice.scoreNIRDImpact)),
              dependance: Math.max(0, Math.min(100, prev.dependance + choice.dependanceImpact)),
            }));
            
            // Apply reputation impact
            const newReputation = applyReputationImpact(reputation, choice.reputationImpact);
            setReputation(newReputation);
            
            setCurrentEvent(null);
          }}
        />
      )}

      {/* Reputation change notification */}
      <ReputationChangeNotification 
        changes={reputationChanges} 
        isVisible={showReputationChange} 
      />

      {/* Floating particles */}
      <ParticleSystem type="leaves" intensity="low" />

      {/* Pause menu */}
      <PauseMenu
        isOpen={isPaused}
        onClose={togglePause}
        onRestart={handleRestart}
        onQuit={handleQuit}
        gameState={gameState}
        schoolName={schoolName}
        directorName={directorName}
        reputation={reputation}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        musicVolume={musicVolume}
        onMusicVolumeChange={setMusicVolume}
        isRetroMode={isRetroMode}
      />
    </div>
  );

  // Game screen - no wrapper needed, retro styling is applied via isRetroMode prop
  return gameContent;
}
