// ============================================================
//  2048 Game – Fully Playable
// ============================================================
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { on2048Tile, getGameStats } from '../services/storageService';
import { getRandomComment } from '../utils/gameComments';

const SIZE = 4;

function emptyGrid() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function addRandom(grid) {
    const empty = [];
    grid.forEach((row, r) => row.forEach((v, c) => { if (!v) empty.push([r, c]); }));
    if (!empty.length) return grid;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
}

function slideLeft(row) {
    const nums = row.filter(v => v !== 0);
    const merged = [];
    let i = 0, scored = 0;
    while (i < nums.length) {
        if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
            merged.push(nums[i] * 2);
            scored += nums[i] * 2;
            i += 2;
        } else {
            merged.push(nums[i]);
            i++;
        }
    }
    while (merged.length < SIZE) merged.push(0);
    return { row: merged, score: scored };
}

function moveGrid(grid, dir) {
    let totalScore = 0;
    let newGrid = emptyGrid();

    const transform = (g) => {
        const result = g.map(row => {
            const { row: r, score } = slideLeft(row);
            totalScore += score;
            return r;
        });
        return result;
    };

    const transpose = (g) => g[0].map((_, ci) => g.map(row => row[ci]));
    const reverseRows = (g) => g.map(row => [...row].reverse());

    switch (dir) {
        case 'left': newGrid = transform(grid); break;
        case 'right': newGrid = reverseRows(transform(reverseRows(grid))); break;
        case 'up': newGrid = transpose(transform(transpose(grid))); break;
        case 'down': newGrid = transpose(reverseRows(transform(reverseRows(transpose(grid))))); break;
    }

    return { grid: newGrid, score: totalScore };
}

function gridsEqual(a, b) {
    return a.every((row, r) => row.every((v, c) => v === b[r][c]));
}

function isGameOver(grid) {
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (!grid[r][c]) return false;
            if (c + 1 < SIZE && grid[r][c] === grid[r][c + 1]) return false;
            if (r + 1 < SIZE && grid[r][c] === grid[r + 1][c]) return false;
        }
    }
    return true;
}

const TILE_COLORS = {
    0: { bg: '#eee4da20', text: 'transparent' },
    2: { bg: '#eee4da', text: '#776e65' },
    4: { bg: '#ede0c8', text: '#776e65' },
    8: { bg: '#f2b179', text: '#f9f6f2' },
    16: { bg: '#f59563', text: '#f9f6f2' },
    32: { bg: '#f67c5f', text: '#f9f6f2' },
    64: { bg: '#f65e3b', text: '#f9f6f2' },
    128: { bg: '#edcf72', text: '#f9f6f2' },
    256: { bg: '#edcc61', text: '#f9f6f2' },
    512: { bg: '#edc850', text: '#f9f6f2' },
    1024: { bg: '#edc53f', text: '#f9f6f2' },
    2048: { bg: '#edc22e', text: '#f9f6f2' },
};

export default function Game2048({ onGameComment }) {
    const [grid, setGrid] = useState(emptyGrid);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(() => getGameStats('2048').highScore || 0);
    const [gameState, setGameState] = useState('ready'); // ready, playing, over, won
    const [tileCommented, setTileCommented] = useState({ 256: false, 512: false, 1024: false, 2048: false });
    const touchStart = useRef(null);
    const gridRef = useRef(grid);
    gridRef.current = grid;

    const initGame = () => {
        let g = emptyGrid();
        g = addRandom(g);
        g = addRandom(g);
        setGrid(g);
        setScore(0);
        setGameState('playing');
        setTileCommented({ 256: false, 512: false, 1024: false, 2048: false });
        onGameComment?.(getRandomComment('2048', 'start'));
    };

    const handleMove = useCallback((dir) => {
        if (gameState !== 'playing') return;
        const { grid: newGrid, score: gained } = moveGrid(gridRef.current, dir);
        if (gridsEqual(newGrid, gridRef.current)) return;

        const withRandom = addRandom(newGrid);
        setGrid(withRandom);
        setScore(prev => {
            const ns = prev + gained;
            if (ns > bestScore) setBestScore(ns);
            return ns;
        });

        // Check max tile
        const maxTile = withRandom.flat().reduce((a, b) => Math.max(a, b), 0);
        on2048Tile(maxTile);

        setTileCommented(prev => {
            const milestones = [256, 512, 1024, 2048];
            for (const m of milestones) {
                if (maxTile >= m && !prev[m]) {
                    const key = `tile${m}`;
                    onGameComment?.(getRandomComment('2048', key));
                    return { ...prev, [m]: true };
                }
            }
            return prev;
        });

        if (maxTile >= 2048 && gameState !== 'won') {
            setGameState('won');
        } else if (isGameOver(withRandom)) {
            setGameState('over');
            onGameComment?.(getRandomComment('2048', 'gameOver'));
        }

        // Random hint
        if (Math.random() < 0.05) {
            onGameComment?.(getRandomComment('2048', 'hint'));
        }
    }, [gameState, bestScore, onGameComment]);

    // Keyboard
    useEffect(() => {
        const handler = (e) => {
            const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
            if (map[e.key]) { e.preventDefault(); handleMove(map[e.key]); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [handleMove]);

    // Touch
    const onTouchStart = (e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const onTouchEnd = (e) => {
        if (!touchStart.current) return;
        const dx = e.changedTouches[0].clientX - touchStart.current.x;
        const dy = e.changedTouches[0].clientY - touchStart.current.y;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) handleMove(dx > 0 ? 'right' : 'left');
        else if (Math.abs(dy) > 30) handleMove(dy > 0 ? 'down' : 'up');
    };

    const cellSize = window.innerWidth < 400 ? 64 : 72;

    return (
        <div className="flex flex-col items-center gap-3 p-3 h-full select-none"
            onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            {/* Scores */}
            <div className="flex gap-4 items-center">
                <div className="px-4 py-2 rounded-xl" style={{ background: '#bbada0' }}>
                    <div className="text-xs text-white opacity-70">SCORE</div>
                    <div className="font-bold text-white text-lg">{score}</div>
                </div>
                <div className="px-4 py-2 rounded-xl" style={{ background: '#bbada0' }}>
                    <div className="text-xs text-white opacity-70">BEST</div>
                    <div className="font-bold text-white text-lg">{bestScore}</div>
                </div>
            </div>

            {/* Board */}
            <div style={{
                background: '#bbada0', borderRadius: 12, padding: 8,
                display: 'grid',
                gridTemplateColumns: `repeat(4, ${cellSize}px)`,
                gridTemplateRows: `repeat(4, ${cellSize}px)`,
                gap: 8, position: 'relative',
            }}>
                {grid.flat().map((val, i) => {
                    const colors = TILE_COLORS[Math.min(val, 2048)] || TILE_COLORS[2048];
                    return (
                        <motion.div
                            key={`${i}-${val}`}
                            layout
                            animate={val ? { scale: [0.85, 1.05, 1] } : {}}
                            transition={{ duration: 0.15 }}
                            style={{
                                width: cellSize, height: cellSize,
                                background: colors.bg,
                                borderRadius: 8,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: val >= 1024 ? 20 : val >= 128 ? 24 : 28,
                                fontWeight: 800,
                                color: colors.text,
                                fontFamily: 'Plus Jakarta Sans, sans-serif',
                            }}>
                            {val || ''}
                        </motion.div>
                    );
                })}

                {/* Overlay */}
                <AnimatePresence>
                    {(gameState === 'over' || gameState === 'won' || gameState === 'ready') && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'absolute', inset: 0, borderRadius: 12,
                                background: gameState === 'won' ? 'rgba(237,201,72,0.9)' : 'rgba(238,228,218,0.85)',
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center', gap: 10,
                            }}>
                            <div style={{ fontSize: 32 }}>{gameState === 'won' ? '🎉' : gameState === 'over' ? '😢' : '🔢'}</div>
                            <div style={{ fontWeight: 800, fontSize: 22, color: '#776e65' }}>
                                {gameState === 'won' ? 'You Win!' : gameState === 'over' ? 'Game Over!' : '2048'}
                            </div>
                            {gameState !== 'ready' && <div style={{ color: '#776e65', fontSize: 14 }}>Score: {score}</div>}
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={initGame}
                                style={{
                                    background: '#8f7a66', color: 'white', border: 'none',
                                    borderRadius: 10, padding: '10px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                                }}>
                                {gameState === 'ready' ? '▶ Start Game' : '🔄 New Game'}
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls */}
            {gameState === 'playing' && (
                <div style={{ display: 'grid', gridTemplateColumns: '40px 40px 40px', gap: 4 }}>
                    {[
                        { label: '▲', row: 1, col: 2, dir: 'up' },
                        { label: '◀', row: 2, col: 1, dir: 'left' },
                        { label: '▶', row: 2, col: 3, dir: 'right' },
                        { label: '▼', row: 3, col: 2, dir: 'down' },
                    ].map(btn => (
                        <motion.button key={btn.label} whileTap={{ scale: 0.85 }}
                            style={{
                                gridRow: btn.row, gridColumn: btn.col,
                                width: 40, height: 40, background: '#bbada0',
                                color: 'white', border: 'none', borderRadius: 8,
                                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                            }}
                            onClick={() => handleMove(btn.dir)}>
                            {btn.label}
                        </motion.button>
                    ))}
                </div>
            )}
        </div>
    );
}
