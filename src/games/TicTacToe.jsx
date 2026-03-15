// ============================================================
//  Tic Tac Toe – vs AI (minimax algorithm)
// ============================================================
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { onTicTacToeWin, getGameStats } from '../services/storageService';
import { getRandomComment } from '../utils/gameComments';

function checkWinner(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], line: [a, b, c] };
        }
    }
    if (board.every(Boolean)) return { winner: 'draw', line: [] };
    return null;
}

function minimax(board, isMax, depth = 0) {
    const result = checkWinner(board);
    if (result) {
        if (result.winner === 'O') return 10 - depth;
        if (result.winner === 'X') return depth - 10;
        return 0;
    }
    const scores = [];
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = isMax ? 'O' : 'X';
            scores.push(minimax(board, !isMax, depth + 1));
            board[i] = null;
        }
    }
    return isMax ? Math.max(...scores) : Math.min(...scores);
}

function getBestMove(board) {
    let best = -Infinity, move = -1;
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = 'O';
            const score = minimax(board, false);
            board[i] = null;
            if (score > best) { best = score; move = i; }
        }
    }
    return move;
}

const CELL_COLORS = { X: '#7C3AED', O: '#EC4899' };

export default function TicTacToe({ onGameComment }) {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [gameResult, setGameResult] = useState(null);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [scores, setScores] = useState({ player: 0, ai: 0, draws: 0 });
    const [started, setStarted] = useState(false);
    const [winLine, setWinLine] = useState([]);

    const startGame = () => {
        setBoard(Array(9).fill(null));
        setGameResult(null);
        setIsPlayerTurn(true);
        setStarted(true);
        setWinLine([]);
        onGameComment?.(getRandomComment('tictactoe', 'start'));
    };

    const handleCell = useCallback(async (idx) => {
        if (!isPlayerTurn || board[idx] || gameResult || !started) return;
        const newBoard = [...board];
        newBoard[idx] = 'X';
        setBoard(newBoard);
        setIsPlayerTurn(false);

        const result = checkWinner(newBoard);
        if (result) {
            setWinLine(result.line);
            setGameResult(result.winner);
            if (result.winner === 'X') {
                setScores(s => ({ ...s, player: s.player + 1 }));
                onTicTacToeWin();
                onGameComment?.(getRandomComment('tictactoe', 'userWin'));
            } else if (result.winner === 'draw') {
                setScores(s => ({ ...s, draws: s.draws + 1 }));
                onGameComment?.(getRandomComment('tictactoe', 'draw'));
            }
            return;
        }

        // AI turn with a small delay
        setTimeout(() => {
            const aiBoard = [...newBoard];
            const aiMove = getBestMove(aiBoard);
            if (aiMove !== -1) {
                aiBoard[aiMove] = 'O';
                setBoard(aiBoard);
                const aiResult = checkWinner(aiBoard);
                if (aiResult) {
                    setWinLine(aiResult.line);
                    setGameResult(aiResult.winner);
                    if (aiResult.winner === 'O') {
                        setScores(s => ({ ...s, ai: s.ai + 1 }));
                        onGameComment?.(getRandomComment('tictactoe', 'aiWin'));
                    } else if (aiResult.winner === 'draw') {
                        setScores(s => ({ ...s, draws: s.draws + 1 }));
                        onGameComment?.(getRandomComment('tictactoe', 'draw'));
                    }
                } else {
                    setIsPlayerTurn(true);
                }
            }
        }, 400);
    }, [board, isPlayerTurn, gameResult, started, onGameComment]);

    const nextRound = () => {
        setBoard(Array(9).fill(null));
        setGameResult(null);
        setIsPlayerTurn(true);
        setWinLine([]);
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 h-full">
            {/* Scores */}
            <div className="flex gap-6 items-center">
                <div className="text-center">
                    <div className="text-xl font-bold" style={{ color: '#7C3AED' }}>{scores.player}</div>
                    <div className="text-xs" style={{ color: 'var(--text-3)' }}>You (X)</div>
                </div>
                <div className="text-center">
                    <div className="text-lg" style={{ color: 'var(--text-3)' }}>{scores.draws}</div>
                    <div className="text-xs" style={{ color: 'var(--text-3)' }}>Draw</div>
                </div>
                <div className="text-center">
                    <div className="text-xl font-bold" style={{ color: '#EC4899' }}>{scores.ai}</div>
                    <div className="text-xs" style={{ color: 'var(--text-3)' }}>AI (O)</div>
                </div>
            </div>

            {/* Status */}
            <div className="text-sm font-semibold" style={{ color: 'var(--text-2)', minHeight: 20 }}>
                {!started ? '🎯 Tic Tac Toe' :
                    gameResult ? (gameResult === 'X' ? '🎉 You Win!' : gameResult === 'O' ? '🤖 AI Wins!' : '🤝 Draw!') :
                        isPlayerTurn ? '👆 Your turn (X)' : '🤔 AI thinking...'}
            </div>

            {/* Board */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 80px)',
                gridTemplateRows: 'repeat(3, 80px)', gap: 8
            }}>
                {board.map((cell, i) => (
                    <motion.button
                        key={i}
                        whileHover={!cell && isPlayerTurn && !gameResult && started ? { scale: 1.05, background: 'var(--purple-pale)' } : {}}
                        whileTap={!cell && isPlayerTurn && !gameResult && started ? { scale: 0.95 } : {}}
                        onClick={() => handleCell(i)}
                        style={{
                            width: 80, height: 80,
                            background: winLine.includes(i) ? 'var(--purple-pale)' : 'white',
                            border: `2px solid ${winLine.includes(i) ? 'var(--purple)' : 'var(--border)'}`,
                            borderRadius: 16,
                            cursor: !cell && isPlayerTurn && !gameResult && started ? 'pointer' : 'default',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 32, fontWeight: 800,
                            color: CELL_COLORS[cell] || 'transparent',
                            boxShadow: winLine.includes(i) ? '0 0 0 3px rgba(124,58,237,0.3)' : 'var(--shadow-sm)',
                            transition: 'all 0.2s',
                        }}>
                        <AnimatePresence>
                            {cell && (
                                <motion.span
                                    initial={{ scale: 0, rotate: -20 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                                    {cell}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                {!started ? (
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={startGame}
                        style={{
                            background: 'linear-gradient(135deg,#7C3AED,#EC4899)',
                            color: 'white', border: 'none', borderRadius: 12,
                            padding: '10px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                        }}>
                        ▶ Start Game
                    </motion.button>
                ) : gameResult ? (
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={nextRound}
                        style={{
                            background: 'linear-gradient(135deg,#7C3AED,#EC4899)',
                            color: 'white', border: 'none', borderRadius: 12,
                            padding: '10px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                        }}>
                        🔄 Next Round
                    </motion.button>
                ) : (
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={startGame}
                        style={{
                            background: 'var(--bg-2)', color: 'var(--text-2)',
                            border: '1.5px solid var(--border)', borderRadius: 12,
                            padding: '10px 24px', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                        }}>
                        🔄 Reset
                    </motion.button>
                )}
            </div>
        </div>
    );
}
