// ============================================================
//  GameHub – Modern UI with Lucide Icons & Improved UX
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lock, Trophy, Calendar, Award, Flame, Coins,
    Target, Gamepad2, Brain, Puzzle, Zap, Sparkles
} from 'lucide-react';
import {
    getCoins, unlockGame, isGameUnlocked, LOCKED_GAMES, FREE_GAMES,
    getGameStats, getDailyChallenge, isDailyChallengeComplete,
    getStreak, ACHIEVEMENT_DEFS, getAchievements
} from '../services/storageService';

const GAME_INFO = {
    snake: {
        name: 'Snake',
        icon: Gamepad2,
        desc: 'Classic snake game!',
        color: '#22c55e',
        gradient: 'from-green-500 to-emerald-600'
    },
    tictactoe: {
        name: 'Tic Tac Toe',
        icon: Target,
        desc: 'X vs O, you vs AI!',
        color: '#7C3AED',
        gradient: 'from-purple-500 to-violet-600'
    },
    '2048': {
        name: '2048',
        icon: Brain,
        desc: 'Merge tiles to win!',
        color: '#f59e0b',
        gradient: 'from-amber-500 to-orange-600'
    },
    ludo: {
        name: 'Ludo',
        icon: Sparkles,
        desc: 'Race pieces home!',
        color: '#EC4899',
        gradient: 'from-pink-500 to-rose-600'
    },
    memory: {
        name: 'Memory Cards',
        icon: Brain,
        desc: 'Flip & match pairs!',
        color: '#06b6d4',
        gradient: 'from-cyan-500 to-blue-600'
    },
    rps: {
        name: 'Rock Paper Scissors',
        icon: Zap,
        desc: 'Best of 5 rounds!',
        color: '#f97316',
        gradient: 'from-orange-500 to-red-600'
    },
    wordle: {
        name: 'Wordle',
        icon: Puzzle,
        desc: 'Guess the word!',
        color: '#10b981',
        gradient: 'from-emerald-500 to-green-600'
    },
    bubbleshooter: {
        name: 'Bubble Pop',
        icon: Sparkles,
        desc: 'Pop colorful bubbles!',
        color: '#8b5cf6',
        gradient: 'from-violet-500 to-purple-600'
    }
};

export default function GameHub({ onSelectGame }) {
    const [activeTab, setActiveTab] = useState('games');
    const [unlockTarget, setUnlockTarget] = useState(null);
    const [justUnlocked, setJustUnlocked] = useState(null);
    const [coinsState, setCoinsState] = useState(getCoins);
    const [unlockedGames, setUnlockedGames] = useState(() =>
        Object.keys(LOCKED_GAMES).filter(g => isGameUnlocked(g))
    );

    const allGames = [...FREE_GAMES, ...Object.keys(LOCKED_GAMES)];

    const handleUnlock = (gameId) => {
        const result = unlockGame(gameId);
        if (result.success) {
            setJustUnlocked(gameId);
            setUnlockTarget(null);
            setCoinsState(getCoins());
            setUnlockedGames(prev => [...prev, gameId]);
            setTimeout(() => setJustUnlocked(null), 2000);
        }
    };

    const streak = getStreak();
    const dailyChallenge = getDailyChallenge();
    const dailyDone = isDailyChallengeComplete();
    const achievements = getAchievements();

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white">
            {/* Modern Header */}
            <div className="px-5 pt-5 pb-4 bg-white border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Game Hub
                        </h2>
                        <p className="text-sm text-slate-600 mt-0.5">Play, earn, unlock more!</p>
                    </div>
                    {/* Coins Display */}
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                        <Coins className="w-5 h-5 text-amber-600" />
                        <span className="font-bold text-lg text-amber-900">{coinsState}</span>
                    </div>
                </div>

                {/* Streak Banner */}
                {streak > 0 && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
                        <Flame className="w-5 h-5 text-orange-600" />
                        <div className="flex-1">
                            <span className="text-sm font-bold text-orange-900">{streak} Day Streak!</span>
                            <span className="text-xs text-orange-700 ml-2">
                                {streak >= 30 ? '👑 VIP' : streak >= 7 ? '⚡ Weekly' : streak >= 3 ? '🌟 Hot' : '🔥'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Modern Tabs */}
                <div className="flex gap-2 mt-4">
                    {[
                        { id: 'games', label: 'Games', icon: Gamepad2 },
                        { id: 'daily', label: 'Daily', icon: Calendar },
                        { id: 'achievements', label: 'Rewards', icon: Trophy },
                    ].map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}>
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4">

                {/* Games Tab */}
                {activeTab === 'games' && (
                    <div className="space-y-3">
                        {/* Free Games Section */}
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Free Games
                        </div>

                        {FREE_GAMES.map(gameId => {
                            const info = GAME_INFO[gameId];
                            const stats = getGameStats(gameId);
                            const Icon = info.icon;

                            return (
                                <motion.button
                                    key={gameId}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onSelectGame(gameId)}
                                    className="w-full p-4 rounded-2xl text-left flex items-center gap-4 bg-white border-2 border-slate-200 hover:border-purple-300 shadow-sm hover:shadow-md transition-all">

                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center shadow-lg`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-base text-slate-900">{info.name}</div>
                                        <div className="text-xs text-slate-600">{info.desc}</div>
                                        {stats.highScore > 0 && (
                                            <div className="text-xs mt-1 flex items-center gap-2">
                                                <span className="text-purple-600 font-semibold">🏆 {stats.highScore}</span>
                                                <span className="text-slate-400">• Played: {stats.played}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${info.gradient} text-white font-bold text-sm shadow-md`}>
                                        Play
                                    </div>
                                </motion.button>
                            );
                        })}

                        {/* Locked Games Section */}
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2 mt-6 flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Unlock with Coins
                        </div>

                        {Object.entries(LOCKED_GAMES).map(([gameId, lockInfo]) => {
                            const info = GAME_INFO[gameId];
                            const isUnlocked = unlockedGames.includes(gameId);
                            const Icon = info.icon;

                            return (
                                <motion.div
                                    key={gameId}
                                    animate={justUnlocked === gameId ? {
                                        scale: [1, 1.05, 1],
                                        borderColor: ['#e2e8f0', '#22c55e', '#e2e8f0']
                                    } : {}}
                                    className={`w-full p-4 rounded-2xl flex items-center gap-4 bg-white border-2 shadow-sm transition-all ${isUnlocked ? 'border-green-300' : 'border-slate-200'
                                        }`}>

                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${isUnlocked
                                            ? `bg-gradient-to-br ${info.gradient}`
                                            : 'bg-slate-200'
                                        }`}>
                                        {isUnlocked ? (
                                            <Icon className="w-7 h-7 text-white" />
                                        ) : (
                                            <Lock className="w-7 h-7 text-slate-400" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className={`font-bold text-base ${isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                                            {info.name}
                                        </div>
                                        <div className="text-xs text-slate-600">
                                            {isUnlocked ? info.desc : `Unlock for ${lockInfo.cost} coins`}
                                        </div>
                                        {justUnlocked === gameId && (
                                            <div className="text-xs font-bold text-green-600 mt-1">✅ Unlocked!</div>
                                        )}
                                    </div>

                                    {isUnlocked ? (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => onSelectGame(gameId)}
                                            className={`px-4 py-2 rounded-lg bg-gradient-to-r ${info.gradient} text-white font-bold text-sm shadow-md`}>
                                            Play
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            whileHover={coinsState >= lockInfo.cost ? { scale: 1.05 } : {}}
                                            whileTap={coinsState >= lockInfo.cost ? { scale: 0.95 } : {}}
                                            onClick={() => coinsState >= lockInfo.cost ? handleUnlock(gameId) : null}
                                            className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1.5 ${coinsState >= lockInfo.cost
                                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md cursor-pointer'
                                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                }`}>
                                            <Coins className="w-4 h-4" />
                                            {lockInfo.cost}
                                        </motion.button>
                                    )}
                                </motion.div>
                            );
                        })}

                        {/* Earn Coins Tip */}
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 mt-4">
                            <div className="flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-purple-900 mb-1">How to earn coins?</p>
                                    <p className="text-xs text-purple-700 leading-relaxed">
                                        Chat messages (+1) • Game plays (+5) • High scores (+10) • Win games (+15-25) • Daily challenges • Achievements!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Daily Challenge Tab */}
                {activeTab === 'daily' && (
                    <div className="space-y-4">
                        <div className={`p-5 rounded-2xl border-2 ${dailyDone
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                                : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
                            }`}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="text-3xl">{dailyChallenge.icon}</div>
                                <div className="flex-1">
                                    <div className="font-bold text-base text-slate-900">Today's Challenge</div>
                                    <div className="text-xs text-slate-600">{new Date().toDateString()}</div>
                                </div>
                                {dailyDone && <Award className="w-6 h-6 text-green-600" />}
                            </div>

                            <p className="font-semibold text-sm text-slate-800 mb-3">{dailyChallenge.goal}</p>

                            <div className="flex items-center gap-2 text-amber-900 mb-3">
                                <Coins className="w-4 h-4" />
                                <span className="text-sm font-bold">+{dailyChallenge.reward} coins reward</span>
                            </div>

                            {!dailyDone && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onSelectGame(dailyChallenge.game)}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg">
                                    Play Now →
                                </motion.button>
                            )}
                        </div>

                        {/* Streak Rewards */}
                        <div className="p-4 rounded-2xl bg-white border-2 border-slate-200">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                                <Flame className="w-4 h-4" />
                                Streak Rewards
                            </p>
                            {[
                                { days: 3, reward: '🎨 New avatar unlock', done: streak >= 3 },
                                { days: 7, reward: '🎮 Game theme unlock', done: streak >= 7 },
                                { days: 30, reward: '👑 VIP AI personality', done: streak >= 30 },
                            ].map(item => (
                                <div
                                    key={item.days}
                                    className="flex items-center gap-3 py-3 border-b last:border-0 border-slate-100">
                                    <Flame className={`w-5 h-5 ${item.done ? 'text-orange-600' : 'text-slate-300'}`} />
                                    <div className="flex-1">
                                        <div className={`text-sm font-semibold ${item.done ? 'text-slate-900' : 'text-slate-400'}`}>
                                            {item.days}-Day Streak
                                        </div>
                                        <div className="text-xs text-slate-600">{item.reward}</div>
                                    </div>
                                    {item.done ? (
                                        <Award className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <span className="text-xs text-slate-400 font-medium">{item.days - streak}d left</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Achievements Tab */}
                {activeTab === 'achievements' && (
                    <div className="space-y-3">
                        <div className="text-sm font-semibold text-slate-700 px-2 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-600" />
                            {achievements.length}/{ACHIEVEMENT_DEFS.length} unlocked
                        </div>

                        {ACHIEVEMENT_DEFS.map(ach => {
                            const unlocked = achievements.includes(ach.id);
                            return (
                                <div
                                    key={ach.id}
                                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${unlocked
                                            ? 'bg-white border-purple-200'
                                            : 'bg-slate-50 border-slate-200 opacity-60'
                                        }`}>
                                    <div className="text-3xl">{ach.icon}</div>
                                    <div className="flex-1">
                                        <div className="font-bold text-sm text-slate-900">{ach.name}</div>
                                        <div className="text-xs text-slate-600">{ach.desc}</div>
                                    </div>
                                    {unlocked ? (
                                        <Award className="w-5 h-5 text-green-600" />
                                    ) : ach.coins > 0 ? (
                                        <div className="flex items-center gap-1 text-amber-600 font-bold text-xs">
                                            <Coins className="w-4 h-4" />
                                            +{ach.coins}
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}