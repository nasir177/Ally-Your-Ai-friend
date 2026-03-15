// ============================================================
//  Rock Paper Scissors – vs AI with emotional reactions
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { onRPSWin } from '../services/storageService';
import { getRandomComment } from '../utils/gameComments';

const CHOICES = [
    { id: 'rock', emoji: '🪨', label: 'Rock', beats: 'scissors' },
    { id: 'paper', emoji: '📄', label: 'Paper', beats: 'rock' },
    { id: 'scissors', emoji: '✂️', label: 'Scissors', beats: 'paper' },
];

const MAX_ROUNDS = 5;

export default function RockPaperScissors({ onGameComment }) {
    const [scores, setScores] = useState({ player: 0, ai: 0 });
    const [round, setRound] = useState(0);
    const [lastResult, setLastResult] = useState(null); // { playerChoice, aiChoice, outcome }
    const [gameOver, setGameOver] = useState(false);
    const [started, setStarted] = useState(false);
    const [revealing, setRevealing] = useState(false);

    const startGame = () => {
        setScores({ player: 0, ai: 0 });
        setRound(0);
        setLastResult(null);
        setGameOver(false);
        setStarted(true);
        setRevealing(false);
        onGameComment?.(getRandomComment('rps', 'start'));
    };

    const play = (choiceId) => {
        if (revealing || gameOver || !started) return;
        setRevealing(true);

        const playerChoice = CHOICES.find(c => c.id === choiceId);
        const aiChoice = CHOICES[Math.floor(Math.random() * 3)];
        let outcome;

        if (playerChoice.beats === aiChoice.id) {
            outcome = 'win';
        } else if (aiChoice.beats === playerChoice.id) {
            outcome = 'lose';
        } else {
            outcome = 'tie';
        }

        setTimeout(() => {
            const newScores = {
                player: scores.player + (outcome === 'win' ? 1 : 0),
                ai: scores.ai + (outcome === 'lose' ? 1 : 0),
            };
            const newRound = round + 1;
            setScores(newScores);
            setRound(newRound);
            setLastResult({ playerChoice, aiChoice, outcome });
            setRevealing(false);

            if (outcome === 'win') {
                onRPSWin();
                onGameComment?.(getRandomComment('rps', 'win'));
            } else if (outcome === 'lose') {
                onGameComment?.(getRandomComment('rps', 'aiWin'));
            } else {
                onGameComment?.(getRandomComment('rps', 'tie'));
            }

            // Check game over
            if (newRound >= MAX_ROUNDS || newScores.player > MAX_ROUNDS / 2 || newScores.ai > MAX_ROUNDS / 2) {
                setGameOver(true);
                if (newScores.player > newScores.ai) {
                    onGameComment?.(getRandomComment('rps', 'finalWin'));
                } else if (newScores.ai > newScores.player) {
                    onGameComment?.(getRandomComment('rps', 'finalLose'));
                }
            }
        }, 600);
    };

    const getResultText = () => {
        if (!lastResult) return '';
        const { playerChoice, aiChoice, outcome } = lastResult;
        if (outcome === 'tie') return `Both chose ${playerChoice.emoji} — Tie!`;
        const commentMap = {
            'rock-scissors': getRandomComment('rps', 'rockVsScissors'),
            'paper-rock': getRandomComment('rps', 'paperVsRock'),
            'scissors-paper': getRandomComment('rps', 'scissorsVsPaper'),
        };
        const key = `${playerChoice.id}-${aiChoice.id}`;
        return commentMap[key] || (outcome === 'win' ? 'You Win! 🎉' : 'AI Wins! 🤖');
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 h-full select-none">
            {/* Score */}
            <div className="flex gap-8 items-center">
                <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: '#7C3AED' }}>{scores.player}</div>
                    <div className="text-xs" style={{ color: 'var(--text-3)' }}>You</div>
                </div>
                <div className="text-sm" style={{ color: 'var(--text-3)' }}>Round {round}/{MAX_ROUNDS}</div>
                <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: '#EC4899' }}>{scores.ai}</div>
                    <div className="text-xs" style={{ color: 'var(--text-3)' }}>AI</div>
                </div>
            </div>

            {/* Last result display */}
            <AnimatePresence mode="wait">
                {lastResult && (
                    <motion.div
                        key={round}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-2"
                        style={{ minHeight: 100 }}>
                        <div className="flex gap-8 items-center">
                            <div className="text-center">
                                <div style={{ fontSize: 48 }}>{lastResult.playerChoice.emoji}</div>
                                <div className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>You</div>
                            </div>
                            <div style={{ fontSize: 20, color: 'var(--text-3)' }}>vs</div>
                            <div className="text-center">
                                <div style={{ fontSize: 48 }}>{lastResult.aiChoice.emoji}</div>
                                <div className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>AI</div>
                            </div>
                        </div>
                        <div className="text-sm font-semibold text-center px-4"
                            style={{
                                color: lastResult.outcome === 'win' ? '#7C3AED' :
                                    lastResult.outcome === 'lose' ? '#EC4899' : 'var(--text-2)'
                            }}>
                            {getResultText()}
                        </div>
                    </motion.div>
                )}
                {!lastResult && started && (
                    <div style={{ height: 100, display: 'flex', alignItems: 'center' }}>
                        <div style={{ fontSize: 48, opacity: 0.3 }}>🤜 vs 🤛</div>
                    </div>
                )}
            </AnimatePresence>

            {/* Game over */}
            {gameOver && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="text-center p-4 rounded-2xl"
                    style={{ background: scores.player > scores.ai ? 'var(--purple-pale)' : '#FCE7F3' }}>
                    <div style={{ fontSize: 28 }}>{scores.player > scores.ai ? '🏆' : scores.ai > scores.player ? '🤖' : '🤝'}</div>
                    <div className="font-bold text-lg mt-1"
                        style={{ color: scores.player > scores.ai ? 'var(--purple)' : '#EC4899' }}>
                        {scores.player > scores.ai ? 'You Win the Series!' : scores.ai > scores.player ? 'AI Wins!' : 'It\'s a Tie!'}
                    </div>
                    <div className="text-sm mt-0.5" style={{ color: 'var(--text-3)' }}>
                        {scores.player} - {scores.ai}
                    </div>
                </motion.div>
            )}

            {/* Choices */}
            {!gameOver ? (
                <div className="flex gap-4">
                    {CHOICES.map(choice => (
                        <motion.button
                            key={choice.id}
                            whileHover={!revealing && started ? { scale: 1.15, y: -4 } : {}}
                            whileTap={!revealing && started ? { scale: 0.9 } : {}}
                            onClick={() => play(choice.id)}
                            disabled={revealing || !started}
                            style={{
                                width: 72, height: 72, borderRadius: '50%',
                                background: revealing || !started ? 'var(--bg-2)' : 'white',
                                border: '2px solid var(--border)',
                                fontSize: 32, cursor: revealing || !started ? 'default' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: 'var(--shadow)',
                                transition: 'all 0.2s',
                                opacity: revealing ? 0.5 : 1,
                            }}>
                            {choice.emoji}
                        </motion.button>
                    ))}
                </div>
            ) : null}

            {/* Start / Restart */}
            {(!started || gameOver) && (
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    style={{
                        background: 'linear-gradient(135deg,#7C3AED,#EC4899)',
                        color: 'white', border: 'none', borderRadius: 12,
                        padding: '10px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    }}>
                    {gameOver ? '🔄 Play Again' : '▶ Start Game'}
                </motion.button>
            )}

            {!started && (
                <div className="text-center text-sm" style={{ color: 'var(--text-3)' }}>
                    Best of {MAX_ROUNDS} rounds!
                </div>
            )}
        </div>
    );
}
