// ============================================================
//  Wordle Game - Complete Implementation
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Backspace, RotateCcw, Trophy } from 'lucide-react';
import { onWordleWin, getGameStats } from '../services/storageService';
import { getRandomComment } from '../utils/gameComments';

const WORDS = [
    'REACT', 'CODES', 'GAMES', 'FRIEND', 'HAPPY', 'BEACH', 'MOVIE', 'MUSIC',
    'DANCE', 'PAINT', 'LIGHT', 'HEART', 'SMILE', 'DREAM', 'TIGER', 'PEACE',
    'TRUST', 'BRAVE', 'PRIDE', 'GLORY', 'SPARK', 'STORM', 'MAGIC', 'NORTH',
    'SOUTH', 'PLANT', 'OCEAN', 'RIVER', 'CLOUD', 'SOLAR'
];

const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
];

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

export default function WordleGame({ onGameComment }) {
    const [targetWord, setTargetWord] = useState('');
    const [guesses, setGuesses] = useState([]);
    const [currentGuess, setCurrentGuess] = useState('');
    const [gameState, setGameState] = useState('ready'); // ready, playing, won, lost
    const [keyColors, setKeyColors] = useState({});
    const [stats, setStats] = useState(() => getGameStats('wordle'));
    const [shake, setShake] = useState(false);
    const [invalidWord, setInvalidWord] = useState(false);

    const startGame = useCallback(() => {
        const word = WORDS[Math.floor(Math.random() * WORDS.length)];
        setTargetWord(word);
        setGuesses([]);
        setCurrentGuess('');
        setGameState('playing');
        setKeyColors({});
        setShake(false);
        onGameComment?.(getRandomComment('wordle', 'start'));
    }, [onGameComment]);

    useEffect(() => {
        if (gameState === 'ready') startGame();
    }, []);

    const checkGuess = (guess) => {
        return guess.split('').map((letter, i) => {
            if (letter === targetWord[i]) return 'correct';
            if (targetWord.includes(letter)) return 'present';
            return 'absent';
        });
    };

    const updateKeyColors = (guess, result) => {
        const newColors = { ...keyColors };
        guess.split('').forEach((letter, i) => {
            const current = newColors[letter];
            const newColor = result[i];

            // Priority: correct > present > absent
            if (newColor === 'correct') {
                newColors[letter] = 'correct';
            } else if (newColor === 'present' && current !== 'correct') {
                newColors[letter] = 'present';
            } else if (!current) {
                newColors[letter] = 'absent';
            }
        });
        setKeyColors(newColors);
    };

    const submitGuess = () => {
        if (currentGuess.length !== WORD_LENGTH) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        // Check if valid word (in our word list)
        if (!WORDS.includes(currentGuess)) {
            setInvalidWord(true);
            setShake(true);
            setTimeout(() => {
                setInvalidWord(false);
                setShake(false);
            }, 800);
            onGameComment?.(getRandomComment('wordle', 'invalidWord'));
            return;
        }

        const result = checkGuess(currentGuess);
        const newGuesses = [...guesses, { word: currentGuess, result }];
        setGuesses(newGuesses);
        updateKeyColors(currentGuess, result);

        if (currentGuess === targetWord) {
            setGameState('won');
            onWordleWin();
            onGameComment?.(getRandomComment('wordle', 'win'));
        } else if (newGuesses.length >= MAX_GUESSES) {
            setGameState('lost');
            onGameComment?.(getRandomComment('wordle', 'lose'));
        } else {
            if (newGuesses.length === 3) {
                onGameComment?.(getRandomComment('wordle', 'halfWay'));
            }
        }

        setCurrentGuess('');
    };

    const handleKeyPress = useCallback((key) => {
        if (gameState !== 'playing') return;

        if (key === 'ENTER') {
            submitGuess();
        } else if (key === 'DEL' || key === 'BACKSPACE') {
            setCurrentGuess(prev => prev.slice(0, -1));
        } else if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
            setCurrentGuess(prev => prev + key);
        }
    }, [gameState, currentGuess, submitGuess]);

    // Keyboard event listener
    useEffect(() => {
        const handler = (e) => {
            const key = e.key.toUpperCase();
            if (key === 'ENTER') handleKeyPress('ENTER');
            else if (key === 'BACKSPACE') handleKeyPress('DEL');
            else if (/^[A-Z]$/.test(key)) handleKeyPress(key);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [handleKeyPress]);

    const getKeyColor = (key) => {
        const color = keyColors[key];
        if (color === 'correct') return 'bg-green-600 text-white border-green-600';
        if (color === 'present') return 'bg-yellow-500 text-white border-yellow-500';
        if (color === 'absent') return 'bg-slate-600 text-white border-slate-600';
        return 'bg-slate-200 text-slate-900 border-slate-300 hover:bg-slate-300';
    };

    const getTileColor = (status) => {
        if (status === 'correct') return 'bg-green-600 border-green-600 text-white';
        if (status === 'present') return 'bg-yellow-500 border-yellow-500 text-white';
        if (status === 'absent') return 'bg-slate-600 border-slate-600 text-white';
        return 'bg-white border-slate-300 text-slate-900';
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white p-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Wordle</h2>
                    <p className="text-xs text-slate-600">Guess the 5-letter word!</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-center">
                        <div className="text-xs text-slate-600">Wins</div>
                        <div className="text-lg font-bold text-green-600">{stats.wins || 0}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-slate-600">Streak</div>
                        <div className="text-lg font-bold text-purple-600">{stats.streak || 0}</div>
                    </div>
                </div>
            </div>

            {/* Invalid Word Message */}
            <AnimatePresence>
                {invalidWord && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-center">
                        <p className="text-sm font-semibold text-red-700">Not in word list!</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Game Board */}
            <div className="flex-1 flex items-center justify-center">
                <div className="grid gap-2" style={{ gridTemplateRows: `repeat(${MAX_GUESSES}, 1fr)` }}>
                    {Array.from({ length: MAX_GUESSES }).map((_, rowIdx) => {
                        const guess = guesses[rowIdx];
                        const isCurrentRow = rowIdx === guesses.length && gameState === 'playing';
                        const letters = isCurrentRow
                            ? currentGuess.padEnd(WORD_LENGTH, ' ').split('')
                            : guess
                                ? guess.word.split('')
                                : Array(WORD_LENGTH).fill('');

                        return (
                            <motion.div
                                key={rowIdx}
                                animate={isCurrentRow && shake ? { x: [-5, 5, -5, 5, 0] } : {}}
                                transition={{ duration: 0.4 }}
                                className="grid grid-cols-5 gap-2">
                                {letters.map((letter, colIdx) => {
                                    const status = guess?.result[colIdx];
                                    const isEmpty = letter === ' ';
                                    const hasLetter = letter && letter !== ' ';

                                    return (
                                        <motion.div
                                            key={colIdx}
                                            initial={guess ? { rotateX: 0 } : {}}
                                            animate={guess ? { rotateX: [0, 90, 0] } : {}}
                                            transition={{
                                                duration: 0.6,
                                                delay: guess ? colIdx * 0.1 : 0
                                            }}
                                            className={`
                                                w-14 h-14 border-2 rounded-lg font-bold text-2xl
                                                flex items-center justify-center transition-all
                                                ${guess ? getTileColor(status) : ''}
                                                ${!guess && hasLetter ? 'border-slate-500 scale-105' : ''}
                                                ${!guess && isEmpty ? 'border-slate-300' : ''}
                                            `}>
                                            {letter !== ' ' && letter}
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Game Over Message */}
            <AnimatePresence>
                {(gameState === 'won' || gameState === 'lost') && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={`mb-4 p-4 rounded-2xl text-center ${gameState === 'won'
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300'
                                : 'bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300'
                            }`}>
                        <div className="text-3xl mb-2">{gameState === 'won' ? '🎉' : '😅'}</div>
                        <div className={`font-bold text-lg mb-1 ${gameState === 'won' ? 'text-green-700' : 'text-orange-700'
                            }`}>
                            {gameState === 'won' ? 'Amazing!' : 'Good Try!'}
                        </div>
                        {gameState === 'lost' && (
                            <div className="text-sm text-slate-700">
                                The word was: <span className="font-bold text-slate-900">{targetWord}</span>
                            </div>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={startGame}
                            className="mt-3 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 mx-auto">
                            <RotateCcw className="w-4 h-4" />
                            Play Again
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Keyboard */}
            <div className="space-y-2">
                {KEYBOARD_ROWS.map((row, i) => (
                    <div key={i} className="flex justify-center gap-1">
                        {row.map(key => {
                            const isSpecial = key === 'ENTER' || key === 'DEL';
                            return (
                                <motion.button
                                    key={key}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleKeyPress(key)}
                                    disabled={gameState !== 'playing'}
                                    className={`
                                        ${isSpecial ? 'px-3' : 'w-9'} h-14 rounded-lg
                                        font-bold text-sm border-2 transition-all
                                        ${gameState !== 'playing' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                        ${getKeyColor(key)}
                                    `}>
                                    {key === 'DEL' ? <Backspace className="w-5 h-5 mx-auto" /> : key}
                                </motion.button>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Start Button for Ready State */}
            {gameState === 'ready' && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg">
                    Start Game
                </motion.button>
            )}
        </div>
    );
}