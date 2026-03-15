// ============================================================
//  Memory Card Game – Flip & Match Pairs
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { onMemoryWin } from '../services/storageService';
import { getRandomComment } from '../utils/gameComments';

const CARD_EMOJIS = ['🐶', '🐱', '🐸', '🦊', '🐼', '🦁', '🐨', '🦄'];

function createDeck() {
    const pairs = [...CARD_EMOJIS, ...CARD_EMOJIS];
    for (let i = pairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    return pairs.map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
}

export default function MemoryCardGame({ onGameComment }) {
    const [cards, setCards] = useState([]);
    const [selected, setSelected] = useState([]);
    const [moves, setMoves] = useState(0);
    const [gameState, setGameState] = useState('ready');
    const [timer, setTimer] = useState(0);
    const timerRef = useRef(null);
    const lockRef = useRef(false);

    const startGame = () => {
        setCards(createDeck());
        setSelected([]);
        setMoves(0);
        setTimer(0);
        setGameState('playing');
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
        onGameComment?.(getRandomComment('memory', 'start'));
    };

    useEffect(() => () => clearInterval(timerRef.current), []);

    const flip = (id) => {
        if (lockRef.current || gameState !== 'playing') return;
        const card = cards.find(c => c.id === id);
        if (!card || card.flipped || card.matched) return;
        if (selected.length === 1 && selected[0].id === id) return;

        const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
        const newSelected = [...selected, { ...card, flipped: true }];

        setCards(newCards);
        setSelected(newSelected);

        if (newSelected.length === 2) {
            setMoves(m => m + 1);
            lockRef.current = true;

            if (newSelected[0].emoji === newSelected[1].emoji) {
                // Match!
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        c.emoji === newSelected[0].emoji ? { ...c, matched: true } : c
                    ));
                    setSelected([]);
                    lockRef.current = false;
                    onGameComment?.(getRandomComment('memory', 'match'));

                    // Check win
                    const totalMatched = newCards.filter(c => c.matched).length + 2;
                    if (totalMatched === cards.length) {
                        clearInterval(timerRef.current);
                        setGameState('won');
                        onMemoryWin();
                        onGameComment?.(getRandomComment('memory', 'win'));
                    }
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        newSelected.find(s => s.id === c.id) ? { ...c, flipped: false } : c
                    ));
                    setSelected([]);
                    lockRef.current = false;
                    onGameComment?.(getRandomComment('memory', 'wrongFlip'));
                }, 900);
            }
        }
    };

    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    return (
        <div className="flex flex-col items-center gap-3 p-3 h-full select-none">
            {/* Stats */}
            <div className="flex gap-6 items-center">
                <div className="text-center">
                    <div className="text-xs" style={{ color: 'var(--text-3)' }}>Moves</div>
                    <div className="font-bold text-lg" style={{ color: 'var(--purple)' }}>{moves}</div>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--purple-pale)', color: 'var(--purple)' }}>
                    🃏 Memory
                </div>
                <div className="text-center">
                    <div className="text-xs" style={{ color: 'var(--text-3)' }}>Time</div>
                    <div className="font-bold text-lg" style={{ color: '#EC4899' }}>{formatTime(timer)}</div>
                </div>
            </div>

            {/* Won banner */}
            <AnimatePresence>
                {gameState === 'won' && (
                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="text-center p-3 rounded-2xl"
                        style={{ background: 'var(--purple-pale)' }}>
                        <div style={{ fontSize: 28 }}>🏆</div>
                        <div className="font-bold" style={{ color: 'var(--purple)' }}>You Won!</div>
                        <div className="text-sm" style={{ color: 'var(--text-3)' }}>{moves} moves · {formatTime(timer)}</div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Grid */}
            {cards.length > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 8, width: '100%', maxWidth: 300,
                }}>
                    {cards.map(card => (
                        <motion.div
                            key={card.id}
                            style={{ width: '100%', paddingBottom: '100%', position: 'relative', cursor: 'pointer' }}
                            whileHover={!card.matched && !card.flipped ? { scale: 1.05 } : {}}
                            whileTap={!card.matched && !card.flipped ? { scale: 0.95 } : {}}
                            onClick={() => flip(card.id)}>
                            <div style={{ position: 'absolute', inset: 0 }}>
                                <AnimatePresence mode="wait">
                                    {card.flipped || card.matched ? (
                                        <motion.div key="front"
                                            initial={{ rotateY: 90 }} animate={{ rotateY: 0 }}
                                            exit={{ rotateY: 90 }} transition={{ duration: 0.2 }}
                                            style={{
                                                width: '100%', height: '100%', borderRadius: 10,
                                                background: card.matched ? '#dcfce7' : 'white',
                                                border: `2px solid ${card.matched ? '#22c55e' : 'var(--border)'}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 28,
                                            }}>
                                            {card.emoji}
                                        </motion.div>
                                    ) : (
                                        <motion.div key="back"
                                            initial={{ rotateY: 90 }} animate={{ rotateY: 0 }}
                                            exit={{ rotateY: 90 }} transition={{ duration: 0.2 }}
                                            style={{
                                                width: '100%', height: '100%', borderRadius: 10,
                                                background: 'linear-gradient(135deg,#7C3AED,#EC4899)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 18, color: 'rgba(255,255,255,0.4)',
                                            }}>
                                            ?
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Action */}
            {(gameState === 'ready' || gameState === 'won') && (
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    style={{
                        background: 'linear-gradient(135deg,#7C3AED,#EC4899)',
                        color: 'white', border: 'none', borderRadius: 12,
                        padding: '10px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    }}>
                    {gameState === 'won' ? '🔄 Play Again' : '▶ Start Game'}
                </motion.button>
            )}
        </div>
    );
}
