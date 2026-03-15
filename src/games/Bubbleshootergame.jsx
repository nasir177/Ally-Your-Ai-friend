// ============================================================
//  Bubble Shooter Game - Canvas Based
// ============================================================
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Trophy } from 'lucide-react';
import { onBubbleShooterScore, getGameStats } from '../services/storageService';
import { getRandomComment } from '../utils/gameComments';

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
const BUBBLE_RADIUS = 18;
const ROWS = 8;
const COLS = 9;

export default function BubbleShooterGame({ onGameComment }) {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('ready'); // ready, playing, won, gameOver
    const [highScore, setHighScore] = useState(() => getGameStats('bubbleshooter').highScore || 0);
    const [currentColor, setCurrentColor] = useState(COLORS[0]);
    const [nextColor, setNextColor] = useState(COLORS[1]);
    const gameRef = useRef(null);

    const initGame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const grid = [];

        // Initialize grid
        for (let row = 0; row < ROWS; row++) {
            grid[row] = [];
            for (let col = 0; col < COLS; col++) {
                if (row < 5) { // Only fill top 5 rows initially
                    grid[row][col] = {
                        color: COLORS[Math.floor(Math.random() * COLORS.length)],
                        x: col * (BUBBLE_RADIUS * 2 + 2) + BUBBLE_RADIUS + (row % 2 ? BUBBLE_RADIUS : 0),
                        y: row * (BUBBLE_RADIUS * 2 + 2) + BUBBLE_RADIUS
                    };
                } else {
                    grid[row][col] = null;
                }
            }
        }

        gameRef.current = {
            ctx,
            grid,
            shooter: {
                x: canvas.width / 2,
                y: canvas.height - 30,
                angle: -Math.PI / 2,
                color: currentColor
            },
            activeBubble: null,
            animationId: null
        };

        setGameState('playing');
        setScore(0);
        setCurrentColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
        setNextColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
        onGameComment?.(getRandomComment('bubbleshooter', 'start'));

        gameLoop();
    }, [currentColor, onGameComment]);

    const gameLoop = useCallback(() => {
        const game = gameRef.current;
        if (!game) return;

        const { ctx, grid, shooter, activeBubble } = game;
        const canvas = canvasRef.current;

        // Clear canvas
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        grid.forEach(row => {
            row.forEach(bubble => {
                if (bubble) {
                    ctx.fillStyle = bubble.color;
                    ctx.beginPath();
                    ctx.arc(bubble.x, bubble.y, BUBBLE_RADIUS, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            });
        });

        // Draw active bubble
        if (activeBubble) {
            activeBubble.x += activeBubble.vx;
            activeBubble.y += activeBubble.vy;

            // Wall collision
            if (activeBubble.x - BUBBLE_RADIUS < 0 || activeBubble.x + BUBBLE_RADIUS > canvas.width) {
                activeBubble.vx *= -1;
            }

            // Check collision with grid
            let collided = false;
            if (activeBubble.y - BUBBLE_RADIUS < BUBBLE_RADIUS) {
                collided = true;
            } else {
                for (let row of grid) {
                    for (let bubble of row) {
                        if (bubble) {
                            const dx = activeBubble.x - bubble.x;
                            const dy = activeBubble.y - bubble.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist < BUBBLE_RADIUS * 2) {
                                collided = true;
                                break;
                            }
                        }
                    }
                    if (collided) break;
                }
            }

            if (collided) {
                // Add to grid
                attachBubble(activeBubble);
                game.activeBubble = null;
            } else {
                ctx.fillStyle = activeBubble.color;
                ctx.beginPath();
                ctx.arc(activeBubble.x, activeBubble.y, BUBBLE_RADIUS, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        // Draw shooter
        ctx.save();
        ctx.translate(shooter.x, shooter.y);
        ctx.rotate(shooter.angle);

        // Shooter arrow
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -40);
        ctx.stroke();

        // Current bubble
        ctx.fillStyle = shooter.color;
        ctx.beginPath();
        ctx.arc(0, -50, BUBBLE_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

        if (gameState === 'playing') {
            game.animationId = requestAnimationFrame(gameLoop);
        }
    }, [gameState]);

    const attachBubble = (bubble) => {
        const game = gameRef.current;
        if (!game) return;

        // Find nearest grid position
        let nearestRow = Math.round(bubble.y / (BUBBLE_RADIUS * 2 + 2));
        let nearestCol = Math.round((bubble.x - (nearestRow % 2 ? BUBBLE_RADIUS : 0)) / (BUBBLE_RADIUS * 2 + 2));

        nearestRow = Math.max(0, Math.min(ROWS - 1, nearestRow));
        nearestCol = Math.max(0, Math.min(COLS - 1, nearestCol));

        if (!game.grid[nearestRow][nearestCol]) {
            game.grid[nearestRow][nearestCol] = {
                color: bubble.color,
                x: nearestCol * (BUBBLE_RADIUS * 2 + 2) + BUBBLE_RADIUS + (nearestRow % 2 ? BUBBLE_RADIUS : 0),
                y: nearestRow * (BUBBLE_RADIUS * 2 + 2) + BUBBLE_RADIUS
            };

            // Check for matches
            checkMatches(nearestRow, nearestCol);

            // Check win
            checkWinCondition();
        }

        // Next shot
        setCurrentColor(nextColor);
        setNextColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
        game.shooter.color = nextColor;
    };

    const checkMatches = (row, col) => {
        const game = gameRef.current;
        if (!game) return;

        const color = game.grid[row][col]?.color;
        if (!color) return;

        const visited = new Set();
        const toCheck = [[row, col]];
        const matches = [];

        while (toCheck.length > 0) {
            const [r, c] = toCheck.pop();
            const key = `${r},${c}`;

            if (visited.has(key)) continue;
            visited.add(key);

            const bubble = game.grid[r]?.[c];
            if (!bubble || bubble.color !== color) continue;

            matches.push([r, c]);

            // Check neighbors
            const neighbors = getNeighbors(r, c);
            neighbors.forEach(([nr, nc]) => {
                if (!visited.has(`${nr},${nc}`)) {
                    toCheck.push([nr, nc]);
                }
            });
        }

        if (matches.length >= 3) {
            // Remove matches
            matches.forEach(([r, c]) => {
                game.grid[r][c] = null;
            });

            const points = matches.length * 10;
            setScore(prev => {
                const newScore = prev + points;
                if (newScore > highScore) setHighScore(newScore);
                onBubbleShooterScore(newScore);
                return newScore;
            });

            if (matches.length >= 5) {
                onGameComment?.(getRandomComment('bubbleshooter', 'bigPop'));
            }

            // Remove floating bubbles
            removeFloating();
        }
    };

    const getNeighbors = (row, col) => {
        const neighbors = [];
        const isOddRow = row % 2 === 1;

        // Above
        if (row > 0) {
            neighbors.push([row - 1, col]);
            neighbors.push([row - 1, col + (isOddRow ? 1 : -1)]);
        }
        // Below
        if (row < ROWS - 1) {
            neighbors.push([row + 1, col]);
            neighbors.push([row + 1, col + (isOddRow ? 1 : -1)]);
        }
        // Sides
        if (col > 0) neighbors.push([row, col - 1]);
        if (col < COLS - 1) neighbors.push([row, col + 1]);

        return neighbors.filter(([r, c]) => r >= 0 && r < ROWS && c >= 0 && c < COLS);
    };

    const removeFloating = () => {
        const game = gameRef.current;
        if (!game) return;

        const connected = new Set();
        const toCheck = [];

        // Find all connected to top row
        for (let col = 0; col < COLS; col++) {
            if (game.grid[0][col]) {
                toCheck.push([0, col]);
            }
        }

        while (toCheck.length > 0) {
            const [r, c] = toCheck.pop();
            const key = `${r},${c}`;

            if (connected.has(key)) continue;
            connected.add(key);

            const neighbors = getNeighbors(r, c);
            neighbors.forEach(([nr, nc]) => {
                if (game.grid[nr][nc] && !connected.has(`${nr},${nc}`)) {
                    toCheck.push([nr, nc]);
                }
            });
        }

        // Remove floating
        let removed = 0;
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (game.grid[row][col] && !connected.has(`${row},${col}`)) {
                    game.grid[row][col] = null;
                    removed++;
                }
            }
        }

        if (removed > 0) {
            setScore(prev => prev + removed * 5);
        }
    };

    const checkWinCondition = () => {
        const game = gameRef.current;
        if (!game) return;

        // Check if all cleared
        const hasAny = game.grid.some(row => row.some(bubble => bubble !== null));
        if (!hasAny) {
            setGameState('won');
            onGameComment?.(getRandomComment('bubbleshooter', 'win'));
            if (game.animationId) cancelAnimationFrame(game.animationId);
        }
    };

    const shoot = useCallback(() => {
        const game = gameRef.current;
        if (!game || game.activeBubble || gameState !== 'playing') return;

        const speed = 8;
        game.activeBubble = {
            x: game.shooter.x,
            y: game.shooter.y,
            vx: Math.cos(game.shooter.angle) * speed,
            vy: Math.sin(game.shooter.angle) * speed,
            color: currentColor
        };
    }, [gameState, currentColor]);

    const handleMouseMove = useCallback((e) => {
        const game = gameRef.current;
        const canvas = canvasRef.current;
        if (!game || !canvas || gameState !== 'playing') return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const dx = mouseX - game.shooter.x;
        const dy = mouseY - game.shooter.y;

        let angle = Math.atan2(dy, dx);
        // Limit angle to upper hemisphere
        angle = Math.max(-Math.PI + 0.2, Math.min(-0.2, angle));

        game.shooter.angle = angle;
    }, [gameState]);

    const handleClick = useCallback(() => {
        shoot();
    }, [shoot]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('click', handleClick);

        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('click', handleClick);
            if (gameRef.current?.animationId) {
                cancelAnimationFrame(gameRef.current.animationId);
            }
        };
    }, [handleMouseMove, handleClick]);

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 text-white">
                <div>
                    <h2 className="text-xl font-bold">Bubble Pop</h2>
                    <p className="text-xs text-slate-400">Match 3+ to pop!</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-center">
                        <div className="text-xs text-slate-400">Score</div>
                        <div className="text-lg font-bold text-purple-400">{score}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-slate-400">Best</div>
                        <div className="text-lg font-bold text-amber-400">{highScore}</div>
                    </div>
                </div>
            </div>

            {/* Next bubble preview */}
            <div className="flex justify-center mb-2">
                <div className="bg-slate-700/50 rounded-full px-4 py-2 flex items-center gap-2">
                    <span className="text-xs text-slate-300">Next:</span>
                    <div
                        className="w-6 h-6 rounded-full border-2 border-white"
                        style={{ backgroundColor: nextColor }}
                    />
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 flex items-center justify-center">
                <canvas
                    ref={canvasRef}
                    width={360}
                    height={480}
                    className="border-2 border-slate-700 rounded-xl bg-slate-900"
                />
            </div>

            {/* Controls hint */}
            {gameState === 'playing' && (
                <div className="text-center mt-3 text-sm text-slate-400">
                    Move mouse to aim • Click to shoot
                </div>
            )}

            {/* Game Over / Win */}
            {(gameState === 'won' || gameState === 'ready') && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-2 border-purple-500/50 text-center">
                    {gameState === 'won' && (
                        <>
                            <div className="text-4xl mb-2">🎉</div>
                            <div className="font-bold text-xl text-white mb-2">Amazing!</div>
                            <div className="text-sm text-purple-300 mb-3">Final Score: {score}</div>
                        </>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={initGame}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                        {gameState === 'won' ? <RotateCcw className="w-5 h-5" /> : null}
                        {gameState === 'won' ? 'Play Again' : 'Start Game'}
                    </motion.button>
                </motion.div>
            )}
        </div>
    );
}