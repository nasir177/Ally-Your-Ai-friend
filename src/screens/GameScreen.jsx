// ============================================================
//  GameScreen – Wraps game components with header + back
// ============================================================
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Coins } from 'lucide-react';
import SnakeGame from '../games/SnakeGame';
import TicTacToe from '../games/TicTacToe';
import Game2048 from '../games/Game2048';
import LudoGame from '../games/LudoGame';
import MemoryCardGame from '../games/MemoryCardGame';
import RockPaperScissors from '../games/RockPaperScissors';
import GameHub from '../games/GameHub';
import { getCoins, updateStreak, addCoins } from '../services/storageService';

const GAME_INFO = {
    snake: { name: 'Snake', emoji: '🐍', color: '#22c55e' },
    tictactoe: { name: 'Tic Tac Toe', emoji: '🎯', color: '#7C3AED' },
    '2048': { name: '2048', emoji: '🔢', color: '#f59e0b' },
    ludo: { name: 'Ludo', emoji: '🎲', color: '#EC4899' },
    memory: { name: 'Memory Cards', emoji: '🃏', color: '#06b6d4' },
    rps: { name: 'Rock Paper Scissors', emoji: '✊', color: '#f97316' },
};

export default function GameScreen({ onGameComment, isMobile = false }) {
    const [activeGame, setActiveGame] = useState(null); // null = hub
    const [coins, setCoins] = useState(getCoins);

    // Update streak on load
    useState(() => { updateStreak(); });

    const refreshCoins = useCallback(() => setCoins(getCoins()), []);

    const handleGameComment = useCallback((msg) => {
        if (!msg) return;
        onGameComment?.(msg);
        // Refresh coins after game events
        setCoins(getCoins());
    }, [onGameComment]);

    const selectGame = (gameId) => {
        setActiveGame(gameId);
        setCoins(getCoins());
    };

    const goHub = () => {
        setActiveGame(null);
        setCoins(getCoins());
    };

    const gameInfo = activeGame ? GAME_INFO[activeGame] : null;

    return (
        <div className="flex flex-col h-full" style={{ background: '#FAFAFF', overflow: 'hidden' }}>
            {/* Header */}
            <div className="flex-shrink-0 flex items-center gap-2 px-3 py-3 border-b"
                style={{ background: 'white', borderColor: 'var(--border)' }}>
                {activeGame ? (
                    <motion.button whileTap={{ scale: 0.9 }} onClick={goHub}
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--bg-2)', border: '1.5px solid var(--border)' }}>
                        <ChevronLeft size={16} color="var(--text-2)" />
                    </motion.button>
                ) : (
                    <div style={{ fontSize: 20 }}>🎮</div>
                )}
                <div className="flex-1">
                    <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>
                        {activeGame ? `${gameInfo.emoji} ${gameInfo.name}` : 'Game Hub'}
                    </span>
                </div>
                {/* Coins pill */}
                <div className="flex items-center gap-1 px-2 py-1 rounded-xl"
                    style={{ background: '#fef3c7', border: '1px solid #f59e0b' }}>
                    <span style={{ fontSize: 12 }}>🪙</span>
                    <span className="font-bold" style={{ fontSize: 12, color: '#92400e' }}>{coins}</span>
                </div>
            </div>

            {/* Game Content */}
            <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    {!activeGame ? (
                        <motion.div key="hub"
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            className="h-full">
                            <GameHub onSelectGame={selectGame} coins={coins} />
                        </motion.div>
                    ) : (
                        <motion.div key={activeGame}
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="h-full overflow-y-auto hide-scroll">
                            {activeGame === 'snake' && <SnakeGame onGameComment={handleGameComment} />}
                            {activeGame === 'tictactoe' && <TicTacToe onGameComment={handleGameComment} />}
                            {activeGame === '2048' && <Game2048 onGameComment={handleGameComment} />}
                            {activeGame === 'ludo' && <LudoGame onGameComment={handleGameComment} />}
                            {activeGame === 'memory' && <MemoryCardGame onGameComment={handleGameComment} />}
                            {activeGame === 'rps' && <RockPaperScissors onGameComment={handleGameComment} />}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
