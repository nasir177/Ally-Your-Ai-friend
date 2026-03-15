// ============================================================
//  Snake Game - Fully Playable
// ============================================================
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { onSnakeScore, getGameStats } from '../services/storageService';
import { getRandomComment } from '../utils/gameComments';

const CELL = 20;
const COLS = 16;
const ROWS = 16;
const INITIAL_SPEED = 150;

function randomFood(snake) {
    let pos;
    do {
        pos = {
            x: Math.floor(Math.random() * COLS),
            y: Math.floor(Math.random() * ROWS),
        };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
}

export default function SnakeGame({ onGameComment, onClose }) {
    const [snake, setSnake] = useState([{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }]);
    const [food, setFood] = useState({ x: 12, y: 6 });
    const [dir, setDir] = useState({ x: 1, y: 0 });
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('ready'); // ready, playing, dead
    const [highScore, setHighScore] = useState(() => getGameStats('snake').highScore || 0);
    const [scoreCommented, setScoreCommented] = useState({ 10: false, 30: false, 50: false, 100: false });

    const dirRef = useRef(dir);
    const snakeRef = useRef(snake);
    const foodRef = useRef(food);
    const scoreRef = useRef(score);
    const gameStateRef = useRef(gameState);
    const loopRef = useRef(null);

    dirRef.current = dir;
    snakeRef.current = snake;
    foodRef.current = food;
    scoreRef.current = score;
    gameStateRef.current = gameState;

    const gameLoop = useCallback(() => {
        if (gameStateRef.current !== 'playing') return;
        const d = dirRef.current;
        const s = snakeRef.current;
        const newHead = { x: (s[0].x + d.x + COLS) % COLS, y: (s[0].y + d.y + ROWS) % ROWS };

        // Check self collision
        if (s.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
            setGameState('dead');
            const finalScore = scoreRef.current;
            const newHigh = onSnakeScore(finalScore);
            setHighScore(prev => Math.max(prev, finalScore));
            onGameComment?.(getRandomComment('snake', 'died'));
            if (finalScore > (getGameStats('snake').highScore || 0)) {
                onGameComment?.(getRandomComment('snake', 'newHighScore'));
            }
            return;
        }

        const ateFoodLocal = newHead.x === foodRef.current.x && newHead.y === foodRef.current.y;
        let newSnake;
        if (ateFoodLocal) {
            newSnake = [newHead, ...s];
            const newScore = scoreRef.current + 10;
            scoreRef.current = newScore;
            setScore(newScore);
            setFood(randomFood(newSnake));

            // Check score milestones
            setScoreCommented(prev => {
                const milestones = [10, 30, 50, 100];
                for (const m of milestones) {
                    if (newScore >= m && !prev[m]) {
                        const key = `score${m}`;
                        onGameComment?.(getRandomComment('snake', key));
                        return { ...prev, [m]: true };
                    }
                }
                return prev;
            });
        } else {
            newSnake = [newHead, ...s.slice(0, -1)];
        }
        setSnake(newSnake);
    }, [onGameComment]);

    useEffect(() => {
        if (gameState === 'playing') {
            loopRef.current = setInterval(gameLoop, INITIAL_SPEED);
            return () => clearInterval(loopRef.current);
        }
    }, [gameState, gameLoop]);

    const startGame = () => {
        setSnake([{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }]);
        setDir({ x: 1, y: 0 });
        setFood(randomFood([{ x: 8, y: 8 }]));
        setScore(0);
        setScoreCommented({ 10: false, 30: false, 50: false, 100: false });
        setGameState('playing');
        onGameComment?.(getRandomComment('snake', 'start'));
    };

    // Keyboard controls
    useEffect(() => {
        const handler = (e) => {
            if (gameStateRef.current !== 'playing') return;
            const d = dirRef.current;
            const map = {
                ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
                ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
                w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
                a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
            };
            const newDir = map[e.key];
            if (newDir && !(newDir.x === -d.x && newDir.y === -d.y)) {
                e.preventDefault();
                setDir(newDir);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    // Touch controls
    const touchStart = useRef(null);
    const handleTouchStart = (e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const handleTouchEnd = (e) => {
        if (!touchStart.current || gameStateRef.current !== 'playing') return;
        const dx = e.changedTouches[0].clientX - touchStart.current.x;
        const dy = e.changedTouches[0].clientY - touchStart.current.y;
        const d = dirRef.current;
        if (Math.abs(dx) > Math.abs(dy)) {
            const nd = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
            if (!(nd.x === -d.x)) setDir(nd);
        } else {
            const nd = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
            if (!(nd.y === -d.y)) setDir(nd);
        }
    };

    const boardW = COLS * CELL;
    const boardH = ROWS * CELL;

    return (
        <div className="flex flex-col items-center gap-3 p-3 h-full select-none"
            onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            {/* Header */}
            <div className="flex items-center justify-between w-full">
                <div className="flex gap-4">
                    <div className="text-center">
                        <div className="text-xs" style={{ color: 'var(--text-3)' }}>Score</div>
                        <div className="font-bold text-lg" style={{ color: 'var(--purple)' }}>{score}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs" style={{ color: 'var(--text-3)' }}>Best</div>
                        <div className="font-bold text-lg" style={{ color: 'var(--text-2)' }}>{Math.max(highScore, score)}</div>
                    </div>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--purple-pale)', color: 'var(--purple)' }}>
                    🐍 Snake
                </div>
            </div>

            {/* Board */}
            <div className="relative rounded-2xl overflow-hidden border-2"
                style={{ width: boardW, height: boardH, background: '#0f172a', borderColor: 'var(--border)', maxWidth: '100%' }}>
                {/* Grid */}
                {Array.from({ length: ROWS }).map((_, r) =>
                    Array.from({ length: COLS }).map((_, c) => (
                        <div key={`${r}-${c}`} style={{
                            position: 'absolute', left: c * CELL, top: r * CELL,
                            width: CELL, height: CELL,
                            border: '1px solid rgba(255,255,255,0.03)',
                        }} />
                    ))
                )}

                {/* Snake */}
                {snake.map((seg, i) => (
                    <motion.div
                        key={`snake-${i}`}
                        style={{
                            position: 'absolute',
                            left: seg.x * CELL + 1, top: seg.y * CELL + 1,
                            width: CELL - 2, height: CELL - 2,
                            borderRadius: i === 0 ? 6 : 4,
                            background: i === 0
                                ? 'linear-gradient(135deg,#22c55e,#16a34a)'
                                : `rgba(34,197,94,${Math.max(0.3, 1 - i * 0.05)})`,
                        }}
                        layout
                        transition={{ type: 'tween', duration: 0.08 }}
                    />
                ))}

                {/* Food */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    style={{
                        position: 'absolute',
                        left: food.x * CELL, top: food.y * CELL,
                        width: CELL, height: CELL,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14,
                    }}>🍎</motion.div>

                {/* Overlay */}
                {gameState !== 'playing' && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0,0,0,0.75)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 12,
                    }}>
                        {gameState === 'dead' && (
                            <>
                                <div style={{ fontSize: 40 }}>😵</div>
                                <div style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>Game Over!</div>
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>Score: {score}</div>
                            </>
                        )}
                        {gameState === 'ready' && (
                            <>
                                <div style={{ fontSize: 40 }}>🐍</div>
                                <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Snake Game</div>
                                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, textAlign: 'center', padding: '0 20px' }}>
                                    Arrow keys / swipe to move
                                </div>
                            </>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={startGame}
                            style={{
                                background: 'linear-gradient(135deg,#7C3AED,#EC4899)',
                                color: 'white', border: 'none', borderRadius: 12,
                                padding: '10px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                            }}>
                            {gameState === 'dead' ? '🔄 Play Again' : '▶ Start Game'}
                        </motion.button>
                    </div>
                )}
            </div>

            {/* D-Pad for mobile */}
            {gameState === 'playing' && (
                <div className="grid gap-1" style={{ gridTemplateColumns: '40px 40px 40px', gridTemplateRows: '40px 40px 40px' }}>
                    {[
                        { label: '▲', row: 1, col: 2, dir: { x: 0, y: -1 } },
                        { label: '◀', row: 2, col: 1, dir: { x: -1, y: 0 } },
                        { label: '▶', row: 2, col: 3, dir: { x: 1, y: 0 } },
                        { label: '▼', row: 3, col: 2, dir: { x: 0, y: 1 } },
                    ].map(btn => (
                        <motion.button
                            key={btn.label}
                            whileTap={{ scale: 0.85 }}
                            style={{
                                gridRow: btn.row, gridColumn: btn.col,
                                background: 'var(--purple-pale)', color: 'var(--purple)',
                                border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700,
                            }}
                            onClick={() => {
                                const d = dirRef.current;
                                if (!(btn.dir.x === -d.x && btn.dir.y === -d.y)) setDir(btn.dir);
                            }}>
                            {btn.label}
                        </motion.button>
                    ))}
                </div>
            )}
        </div>
    );
}
