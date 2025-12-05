"use client";

import React, { useState, useEffect, useRef } from 'react';

interface RetroGamingProps {
  onQuit: () => void;
  directorName: string;
}

const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;
const CELL_SIZE = 30;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface GameState {
  snake: [number, number][];
  food: [number, number];
  direction: Direction;
  nextDirection: Direction;
  score: number;
  gameOver: boolean;
  isPaused: boolean;
}

export default function RetroGaming({ onQuit }: RetroGamingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: [[10, 7], [9, 7], [8, 7]],
    food: [15, 10],
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    score: 0,
    gameOver: false,
    isPaused: false,
  });

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.gameOver) return;

      switch (e.key.toUpperCase()) {
        case 'ARROWUP':
        case 'W':
          e.preventDefault();
          setGameState(prev => ({
            ...prev,
            nextDirection: prev.direction !== 'DOWN' ? 'UP' : prev.direction,
          }));
          break;
        case 'ARROWDOWN':
        case 'S':
          e.preventDefault();
          setGameState(prev => ({
            ...prev,
            nextDirection: prev.direction !== 'UP' ? 'DOWN' : prev.direction,
          }));
          break;
        case 'ARROWLEFT':
        case 'A':
          e.preventDefault();
          setGameState(prev => ({
            ...prev,
            nextDirection: prev.direction !== 'RIGHT' ? 'LEFT' : prev.direction,
          }));
          break;
        case 'ARROWRIGHT':
        case 'D':
          e.preventDefault();
          setGameState(prev => ({
            ...prev,
            nextDirection: prev.direction !== 'LEFT' ? 'RIGHT' : prev.direction,
          }));
          break;
        case ' ':
          e.preventDefault();
          setGameState(prev => ({
            ...prev,
            isPaused: !prev.isPaused,
          }));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameOver]);

  // Game loop
  useEffect(() => {
    if (gameState.gameOver || gameState.isPaused) return;

    const gameLoop = setInterval(() => {
      setGameState(prev => {
        const direction = prev.nextDirection;
        const snake = prev.snake;
        const food = prev.food;
        let gameOver = prev.gameOver;

        const head = snake[0];
        let newHead: [number, number] = [head[0], head[1]];

        // Calculate new head position
        switch (direction) {
          case 'UP':
            newHead = [head[0], (head[1] - 1 + GRID_HEIGHT) % GRID_HEIGHT];
            break;
          case 'DOWN':
            newHead = [head[0], (head[1] + 1) % GRID_HEIGHT];
            break;
          case 'LEFT':
            newHead = [(head[0] - 1 + GRID_WIDTH) % GRID_WIDTH, head[1]];
            break;
          case 'RIGHT':
            newHead = [(head[0] + 1) % GRID_WIDTH, head[1]];
            break;
        }

        // Check collision with self
        if (snake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
          gameOver = true;
        }

        // Check if food eaten
        let newSnake = [newHead, ...snake];
        let newFood = food;
        let score = prev.score;

        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          score += 10;
          do {
            newFood = [Math.floor(Math.random() * GRID_WIDTH), Math.floor(Math.random() * GRID_HEIGHT)];
          } while (newSnake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1]));
        } else {
          newSnake = newSnake.slice(0, -1);
        }

        return {
          ...prev,
          snake: newSnake,
          food: newFood,
          direction,
          nextDirection: direction,
          score,
          gameOver,
        };
      });
    }, 150);

    return () => clearInterval(gameLoop);
  }, [gameState.gameOver, gameState.isPaused]);

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, GRID_WIDTH * CELL_SIZE, GRID_HEIGHT * CELL_SIZE);

    // Draw grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_WIDTH; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_HEIGHT * CELL_SIZE);
      ctx.stroke();
    }
    for (let i = 0; i <= GRID_HEIGHT; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_WIDTH * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      if (index === 0) {
        // Head - gradient effect
        const gradient = ctx.createLinearGradient(
          segment[0] * CELL_SIZE,
          segment[1] * CELL_SIZE,
          (segment[0] + 1) * CELL_SIZE,
          (segment[1] + 1) * CELL_SIZE
        );
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#059669');
        ctx.fillStyle = gradient;
      } else {
        // Body
        ctx.fillStyle = '#34d399';
      }
      ctx.fillRect(
        segment[0] * CELL_SIZE + 2,
        segment[1] * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4
      );

      // Eyes on head
      if (index === 0) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(
          segment[0] * CELL_SIZE + 6,
          segment[1] * CELL_SIZE + 6,
          4,
          4
        );
        ctx.fillRect(
          segment[0] * CELL_SIZE + CELL_SIZE - 10,
          segment[1] * CELL_SIZE + 6,
          4,
          4
        );
      }
    });

    // Draw food (🌱 sprite)
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(
      gameState.food[0] * CELL_SIZE + CELL_SIZE / 2,
      gameState.food[1] * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw emoji on food
    ctx.font = `${CELL_SIZE / 2}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      '🌱',
      gameState.food[0] * CELL_SIZE + CELL_SIZE / 2,
      gameState.food[1] * CELL_SIZE + CELL_SIZE / 2
    );
  }, [gameState.snake, gameState.food]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Title */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2 pixel-font">
          🐍 NIRD SNAKE
        </h1>
        <p className="text-emerald-300 text-lg">Collecte les 🌱 pour construire l&apos;école numérique!</p>
      </div>

      {/* Game area */}
      <div className="relative bg-slate-800 p-2 rounded-lg shadow-2xl border-4 border-emerald-500">
        <canvas
          ref={canvasRef}
          width={GRID_WIDTH * CELL_SIZE}
          height={GRID_HEIGHT * CELL_SIZE}
          className="border-2 border-emerald-300 bg-slate-900"
        />

        {/* Paused overlay */}
        {gameState.isPaused && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-white mb-2">⏸️ PAUSÉ</p>
              <p className="text-emerald-300 text-sm">Appuyez sur ESPACE pour continuer</p>
            </div>
          </div>
        )}

        {/* Game over overlay */}
        {gameState.gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 rounded-sm">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-500 mb-4">☠️ GAME OVER</p>
              <p className="text-white text-2xl mb-6">Score: {gameState.score}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-bold text-white transition-all"
              >
                Rejouer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-8 text-center">
        <p className="text-white text-2xl font-bold mb-4">
          Score: <span className="text-emerald-400">{gameState.score}</span>
        </p>
        <div className="text-emerald-300 text-sm space-y-1">
          <p>⬆️⬇️⬅️➡️ ou WASD - Déplacement</p>
          <p>ESPACE - Pause/Reprendre</p>
          <p>Longueur du serpent: {gameState.snake.length}</p>
        </div>
      </div>

      {/* Quit button */}
      <button
        onClick={onQuit}
        className="mt-8 bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-bold text-white transition-all hover:scale-105"
      >
        Quitter le jeu
      </button>

      {/* Decorative elements */}
      <style>{`
        .pixel-font {
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
        }
      `}</style>
    </div>
  );
}
