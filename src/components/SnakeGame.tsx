import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'UP';

export const SnakeGame: React.FC<{ onScoreChange: (score: number) => void }> = ({ onScoreChange }) => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<string>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(true);
    generateFood();
  };

  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused((p) => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, 150);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, moveSnake]);

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div 
        className="relative bg-black border-4 border-[#0ff] shadow-[0_0_20px_rgba(0,255,255,0.3)] overflow-hidden"
        style={{ width: GRID_SIZE * 20, height: GRID_SIZE * 20 }}
      >
        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: 20,
              height: 20,
              left: segment.x * 20,
              top: segment.y * 20,
              backgroundColor: i === 0 ? '#0ff' : '#f0f',
              boxShadow: i === 0 ? '0 0 15px #0ff' : '0 0 5px #f0f',
              zIndex: i === 0 ? 10 : 1,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-white animate-pulse"
          style={{
            width: 20,
            height: 20,
            left: food.x * 20,
            top: food.y * 20,
            boxShadow: '0 0 20px #fff',
          }}
        />

        {/* Overlays */}
        {isPaused && !isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <button 
              onClick={() => setIsPaused(false)}
              className="px-8 py-4 bg-[#0ff] text-black font-mono font-bold text-xl hover:bg-[#f0f] hover:text-white transition-all border-4 border-white glitch-text"
              data-text="INITIALIZE_CORE"
            >
              INITIALIZE_CORE
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
            <h2 className="text-4xl font-mono font-bold text-[#f0f] mb-4 glitch-text" data-text="CRITICAL_FAILURE">CRITICAL_FAILURE</h2>
            <p className="text-[#0ff] font-mono mb-8">DATA_LOST: {score}</p>
            <button 
              onClick={resetGame}
              className="px-8 py-4 bg-[#f0f] text-white font-mono font-bold text-xl hover:bg-[#0ff] hover:text-black transition-all border-4 border-white glitch-text"
              data-text="REBOOT_SYSTEM"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-12 text-[10px] font-mono uppercase">
        <div className="flex flex-col items-center">
          <span className="text-[#f0f] mb-1">CORE_STATE</span>
          <span className={isPaused ? "text-yellow-500" : "text-[#0ff]"}>
            {isPaused ? "IDLE" : "EXECUTING"}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[#f0f] mb-1">INPUT_MAP</span>
          <span className="text-[#0ff]">DIR_VECTORS / BREAK</span>
        </div>
      </div>
    </div>
  );
};
