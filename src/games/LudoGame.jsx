// ============================================================
//  Ludo Game – vs AI (Simple board logic)
// ============================================================
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { onLudoWin } from '../services/storageService';
import { getRandomComment } from '../utils/gameComments';

// Simplified Ludo: 4 pieces per player, track position on a linear path (0-56)
// 0 = home, 1-56 = board path, 57 = won
const HOME = 0;
const WIN = 57;
const SAFE_SQUARES = [1, 9, 14, 22, 27, 35, 40, 48];

function rollDie() { return Math.floor(Math.random() * 6) + 1; }

function canMove(piece, dice) {
    if (piece === WIN) return false;
    if (piece === HOME && dice === 6) return true;
    if (piece === HOME) return false;
    return piece + dice <= WIN;
}

const PLAYER_COLOR = '#7C3AED';
const AI_COLOR = '#EC4899';

export default function LudoGame({ onGameComment }) {
    const [playerPieces, setPlayerPieces] = useState([0, 0, 0, 0]);
    const [aiPieces, setAiPieces] = useState([0, 0, 0, 0]);
    const [dice, setDice] = useState(null);
    const [turn, setTurn] = useState('player'); // 'player' | 'ai'
    const [rolling, setRolling] = useState(false);
    const [gameState, setGameState] = useState('ready'); // ready, playing, won, lost
    const [log, setLog] = useState([]);
    const [selectedPiece, setSelectedPiece] = useState(null);

    const addLog = (msg) => setLog(prev => [msg, ...prev.slice(0, 4)]);

    const startGame = () => {
        setPlayerPieces([0, 0, 0, 0]);
        setAiPieces([0, 0, 0, 0]);
        setDice(null);
        setTurn('player');
        setRolling(false);
        setGameState('playing');
        setLog([]);
        setSelectedPiece(null);
        onGameComment?.(getRandomComment('ludo', 'start'));
    };

    const rollDiceAction = useCallback(async () => {
        if (rolling || gameState !== 'playing' || turn !== 'player') return;
        setRolling(true);
        setSelectedPiece(null);

        // Dice animation delay
        await new Promise(r => setTimeout(r, 600));
        const d = rollDie();
        setDice(d);
        setRolling(false);

        if (d === 6) {
            addLog(`🎲 You rolled a 6! Choose a piece to move.`);
            onGameComment?.(getRandomComment('ludo', 'got6'));
        } else {
            const movable = playerPieces.filter(p => canMove(p, d));
            if (movable.length === 0) {
                addLog(`🎲 You rolled ${d}. No moves available.`);
                setTimeout(() => doAITurn(), 800);
            } else {
                addLog(`🎲 You rolled ${d}. Tap a piece to move.`);
            }
        }
    }, [rolling, gameState, turn, playerPieces, onGameComment]);

    const playerMove = useCallback((pieceIdx) => {
        if (turn !== 'player' || dice === null || rolling) return;
        const piece = playerPieces[pieceIdx];
        if (!canMove(piece, dice)) return;

        let newPos = piece === HOME ? 1 : piece + dice;
        const newPieces = [...playerPieces];
        newPieces[pieceIdx] = newPos;

        // Cut AI piece
        let newAiPieces = [...aiPieces];
        let cut = false;
        if (!SAFE_SQUARES.includes(newPos) && newPos !== WIN) {
            newAiPieces = aiPieces.map(ap => {
                if (ap === newPos) { cut = true; return HOME; }
                return ap;
            });
        }

        setPlayerPieces(newPieces);
        setAiPieces(newAiPieces);
        if (cut) onGameComment?.(getRandomComment('ludo', 'cut'));

        // Check player win
        if (newPieces.every(p => p === WIN)) {
            setGameState('won');
            onLudoWin();
            onGameComment?.(getRandomComment('ludo', 'win'));
            addLog('🏆 You won! Amazing!');
            return;
        }

        setDice(null);
        setSelectedPiece(null);
        addLog(`Piece ${pieceIdx + 1} moved to square ${newPos}`);

        // Next turn: if rolled 6, player rolls again; else AI turn
        if (dice === 6) {
            setTurn('player');
            addLog('🎲 Rolled 6! Roll again!');
        } else {
            setTurn('ai');
            setTimeout(() => doAITurnWithState(newPieces, newAiPieces), 1000);
        }
    }, [turn, dice, rolling, playerPieces, aiPieces, onGameComment]);

    const doAITurn = useCallback(() => {
        doAITurnWithState(playerPieces, aiPieces);
    }, [playerPieces, aiPieces]);

    const doAITurnWithState = (curPlayerPieces, curAiPieces) => {
        const d = rollDie();
        setDice(d);
        addLog(`🤖 AI rolled ${d}`);

        setTimeout(() => {
            const movableIdx = curAiPieces
                .map((p, i) => ({ p, i }))
                .filter(({ p }) => canMove(p, d));

            if (movableIdx.length === 0) {
                addLog(`🤖 AI has no moves.`);
                setDice(null);
                setTurn('player');
                return;
            }

            // AI Strategy: prefer moving furthest piece, or getting out of home if 6
            let best = movableIdx[0];
            for (const m of movableIdx) {
                if (m.p > best.p) best = m;
            }

            const newAiPieces = [...curAiPieces];
            const newPos = best.p === HOME ? 1 : best.p + d;
            newAiPieces[best.i] = newPos;

            // Cut player piece
            let newPlayerPieces = [...curPlayerPieces];
            let aiCut = false;
            if (!SAFE_SQUARES.includes(newPos) && newPos !== WIN) {
                newPlayerPieces = curPlayerPieces.map(pp => {
                    if (pp === newPos) { aiCut = true; return HOME; }
                    return pp;
                });
            }

            setAiPieces(newAiPieces);
            setPlayerPieces(newPlayerPieces);
            if (aiCut) {
                onGameComment?.(getRandomComment('ludo', 'cut'));
                addLog(`🤖 AI cut your piece! 😈`);
            }

            addLog(`🤖 AI piece moved to ${newPos}`);

            if (newAiPieces.every(p => p === WIN)) {
                setGameState('lost');
                onGameComment?.(getRandomComment('ludo', 'aiWin'));
                addLog('🤖 AI won! Better luck next time!');
                setDice(null);
                return;
            }

            setDice(null);
            if (d === 6) {
                addLog('🤖 AI rolled 6! Rolling again...');
                setTimeout(() => doAITurnWithState(newPlayerPieces, newAiPieces), 800);
            } else {
                setTurn('player');
            }
        }, 800);
    };

    // Visual board - simplified linear display
    const PieceToken = ({ pos, color, idx, onClick, isPlayer }) => {
        const isSafe = SAFE_SQUARES.includes(pos);
        return (
            <motion.div
                whileHover={onClick ? { scale: 1.2 } : {}}
                whileTap={onClick ? { scale: 0.9 } : {}}
                onClick={onClick}
                title={`Piece ${idx + 1}: ${pos === HOME ? 'Home' : pos === WIN ? 'Done!' : `Square ${pos}`}`}
                style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: pos === WIN ? '#22c55e' : color,
                    border: `3px solid ${isSafe ? '#eab308' : 'white'}`,
                    cursor: onClick ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: 'white', fontWeight: 800,
                    boxShadow: selectedPiece === idx && isPlayer ? `0 0 0 3px ${color}, 0 0 0 5px white` : '0 2px 6px rgba(0,0,0,0.2)',
                    opacity: pos === WIN ? 0.7 : 1,
                    transition: 'all 0.2s',
                }}>
                {pos === WIN ? '★' : pos === HOME ? '⌂' : idx + 1}
            </motion.div>
        );
    };

    return (
        <div className="flex flex-col gap-3 p-3 h-full select-none" style={{ overflowY: 'auto' }}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: PLAYER_COLOR }} />
                    <span className="text-sm font-semibold" style={{ color: PLAYER_COLOR }}>You</span>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--purple-pale)', color: 'var(--purple)' }}>
                    🎲 Ludo
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: AI_COLOR }}>AI</span>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: AI_COLOR }} />
                </div>
            </div>

            {/* Pieces Display */}
            {gameState !== 'ready' && (
                <div className="flex flex-col gap-3">
                    {/* Player pieces */}
                    <div className="p-3 rounded-2xl" style={{ background: 'rgba(124,58,237,0.06)', border: '1.5px solid rgba(124,58,237,0.15)' }}>
                        <div className="text-xs font-semibold mb-2" style={{ color: PLAYER_COLOR }}>Your Pieces</div>
                        <div className="flex gap-3">
                            {playerPieces.map((pos, i) => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <PieceToken pos={pos} color={PLAYER_COLOR} idx={i} isPlayer
                                        onClick={dice !== null && canMove(pos, dice) && turn === 'player' ? () => {
                                            setSelectedPiece(i);
                                            playerMove(i);
                                        } : undefined}
                                    />
                                    <span style={{ fontSize: 9, color: 'var(--text-3)' }}>
                                        {pos === HOME ? 'Base' : pos === WIN ? 'Done!' : `S${pos}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI pieces */}
                    <div className="p-3 rounded-2xl" style={{ background: 'rgba(236,72,153,0.06)', border: '1.5px solid rgba(236,72,153,0.15)' }}>
                        <div className="text-xs font-semibold mb-2" style={{ color: AI_COLOR }}>AI Pieces</div>
                        <div className="flex gap-3">
                            {aiPieces.map((pos, i) => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <PieceToken pos={pos} color={AI_COLOR} idx={i} isPlayer={false} />
                                    <span style={{ fontSize: 9, color: 'var(--text-3)' }}>
                                        {pos === HOME ? 'Base' : pos === WIN ? 'Done!' : `S${pos}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Progress bars */}
                    <div className="flex gap-2 items-center">
                        <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--bg-2)', overflow: 'hidden' }}>
                            <motion.div
                                animate={{ width: `${(playerPieces.reduce((s, p) => s + Math.min(p, WIN), 0) / (WIN * 4)) * 100}%` }}
                                style={{ height: '100%', background: PLAYER_COLOR, borderRadius: 4 }}
                            />
                        </div>
                        <span style={{ fontSize: 10, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>Progress</span>
                        <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--bg-2)', overflow: 'hidden' }}>
                            <motion.div
                                animate={{ width: `${(aiPieces.reduce((s, p) => s + Math.min(p, WIN), 0) / (WIN * 4)) * 100}%` }}
                                style={{ height: '100%', background: AI_COLOR, borderRadius: 4 }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Dice + Log */}
            {gameState === 'playing' && (
                <div className="flex gap-3 items-start">
                    {/* Dice */}
                    <div className="flex flex-col items-center gap-2">
                        <motion.div
                            animate={rolling ? { rotate: [0, 180, 360], scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.6 }}
                            style={{
                                width: 52, height: 52, background: 'white',
                                borderRadius: 12, border: '2px solid var(--border)',
                                boxShadow: 'var(--shadow)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 28,
                            }}>
                            {rolling ? '🎲' : dice ? ['', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'][dice] : '🎲'}
                        </motion.div>
                        {turn === 'player' && dice === null && (
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                                onClick={rollDiceAction} disabled={rolling}
                                style={{
                                    background: 'linear-gradient(135deg,#7C3AED,#EC4899)',
                                    color: 'white', border: 'none', borderRadius: 10,
                                    padding: '6px 14px', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                                    opacity: rolling ? 0.7 : 1,
                                }}>
                                Roll!
                            </motion.button>
                        )}
                        {turn === 'ai' && (
                            <span style={{ fontSize: 10, color: 'var(--text-3)', textAlign: 'center' }}>AI's turn...</span>
                        )}
                    </div>

                    {/* Log */}
                    <div style={{ flex: 1, fontSize: 11, color: 'var(--text-2)' }}>
                        {log.map((l, i) => (
                            <div key={i} style={{ opacity: 1 - i * 0.2, marginBottom: 2 }}>{l}</div>
                        ))}
                    </div>
                </div>
            )}

            {/* Game over */}
            <AnimatePresence>
                {(gameState === 'won' || gameState === 'lost') && (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="text-center p-4 rounded-2xl"
                        style={{ background: gameState === 'won' ? 'var(--purple-pale)' : '#FCE7F3' }}>
                        <div style={{ fontSize: 32 }}>{gameState === 'won' ? '🏆' : '😅'}</div>
                        <div className="font-bold text-lg" style={{ color: gameState === 'won' ? 'var(--purple)' : '#EC4899' }}>
                            {gameState === 'won' ? 'You Win! 🎉' : 'AI Wins!'}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Start / Restart */}
            {(gameState === 'ready' || gameState === 'won' || gameState === 'lost') && (
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className="w-full"
                    style={{
                        background: 'linear-gradient(135deg,#7C3AED,#EC4899)',
                        color: 'white', border: 'none', borderRadius: 12,
                        padding: '12px', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    }}>
                    {gameState === 'ready' ? '▶ Start Ludo' : '🔄 Play Again'}
                </motion.button>
            )}
        </div>
    );
}
