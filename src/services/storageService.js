// ============================================================
//  Storage Service – IndexedDB via Dexie + localStorage fallback
//  Enhanced with: Coins, Achievements, Streaks, Daily Challenges
// ============================================================
import Dexie from 'dexie';

const db = new Dexie('AntiFriend');
db.version(1).stores({
    messages: '++id, timestamp, speaker, text, mood',
    memories: '++id, date, content, type',
});

// ---------- Messages ----------
export async function saveMessage(msg) {
    try {
        return await db.messages.add({ ...msg, timestamp: Date.now() });
    } catch {
        const arr = getLocalMessages();
        arr.push({ ...msg, id: Date.now(), timestamp: Date.now() });
        localStorage.setItem('af_messages', JSON.stringify(arr));
        return arr.length;
    }
}

export async function getMessages() {
    try {
        return await db.messages.toArray();
    } catch {
        return getLocalMessages();
    }
}

function getLocalMessages() {
    try {
        return JSON.parse(localStorage.getItem('af_messages') || '[]');
    } catch {
        return [];
    }
}

export async function clearMessages() {
    try {
        await db.messages.clear();
    } catch { }
    localStorage.removeItem('af_messages');
}

// ---------- Profile ----------
export function saveProfile(profile) {
    localStorage.setItem('af_profile', JSON.stringify(profile));
}

export function getProfile() {
    try {
        return JSON.parse(localStorage.getItem('af_profile') || 'null');
    } catch {
        return null;
    }
}

export function clearProfile() {
    localStorage.removeItem('af_profile');
}

// ---------- AI Friend Config ----------
export function saveAIConfig(config) {
    localStorage.setItem('af_ai', JSON.stringify(config));
}

export function getAIConfig() {
    try {
        return JSON.parse(localStorage.getItem('af_ai') || 'null');
    } catch {
        return null;
    }
}

// ---------- Memories ----------
export async function addMemory(content, type = 'moment') {
    try {
        return await db.memories.add({ content, type, date: Date.now() });
    } catch {
        const arr = getLocalMemories();
        arr.push({ content, type, date: Date.now(), id: Date.now() });
        localStorage.setItem('af_memories', JSON.stringify(arr));
    }
}

export async function getMemories() {
    try {
        return await db.memories.toArray();
    } catch {
        return getLocalMemories();
    }
}

function getLocalMemories() {
    try {
        return JSON.parse(localStorage.getItem('af_memories') || '[]');
    } catch {
        return [];
    }
}

// ---------- Friendship Stats ----------
export function getFriendshipStats() {
    const profile = getProfile();
    if (!profile) return { days: 0, messages: 0, happyMoments: 0 };
    const startDate = profile.friendshipStart || Date.now();
    const days = Math.max(1, Math.floor((Date.now() - startDate) / 86400000));
    const messages = getLocalMessages().length || parseInt(localStorage.getItem('af_msgcount') || '0', 10);
    const happyMoments = parseInt(localStorage.getItem('af_happy') || '0', 10);
    return { days, messages, happyMoments };
}

export function incrementHappy() {
    const cur = parseInt(localStorage.getItem('af_happy') || '0', 10);
    localStorage.setItem('af_happy', String(cur + 1));
}

export function incrementMsgCount() {
    const cur = parseInt(localStorage.getItem('af_msgcount') || '0', 10);
    localStorage.setItem('af_msgcount', String(cur + 1));
}

// ---------- Theme ----------
export function saveTheme(theme) {
    localStorage.setItem('af_theme', JSON.stringify(theme));
}

export function getTheme() {
    try {
        return JSON.parse(localStorage.getItem('af_theme') || 'null');
    } catch {
        return null;
    }
}

// ---------- COINS SYSTEM ----------
export function getCoins() {
    return parseInt(localStorage.getItem('af_coins') || '0', 10);
}

export function addCoins(amount) {
    const cur = getCoins();
    const newAmount = cur + amount;
    localStorage.setItem('af_coins', String(newAmount));
    checkAchievements();
    return newAmount;
}

export function spendCoins(amount) {
    const cur = getCoins();
    if (cur < amount) return false;
    localStorage.setItem('af_coins', String(cur - amount));
    return true;
}

// ---------- UNLOCKED GAMES ----------
const FREE_GAMES = ['snake', 'tictactoe', '2048'];
const LOCKED_GAMES = {
    ludo: { cost: 100, name: 'Ludo', emoji: '🎲' },
    memory: { cost: 150, name: 'Memory Cards', emoji: '🃏' },
    rps: { cost: 200, name: 'Rock Paper Scissors', emoji: '✊' },
};

export function getUnlockedGames() {
    try {
        return JSON.parse(localStorage.getItem('af_unlocked_games') || '[]');
    } catch {
        return [];
    }
}

export function unlockGame(gameId) {
    const cost = LOCKED_GAMES[gameId]?.cost;
    if (!cost) return { success: false, reason: 'Game not found' };
    const unlocked = getUnlockedGames();
    if (unlocked.includes(gameId)) return { success: true, alreadyOwned: true };
    if (!spendCoins(cost)) return { success: false, reason: 'Not enough coins' };
    unlocked.push(gameId);
    localStorage.setItem('af_unlocked_games', JSON.stringify(unlocked));
    return { success: true };
}

export function isGameUnlocked(gameId) {
    if (FREE_GAMES.includes(gameId)) return true;
    return getUnlockedGames().includes(gameId);
}

export { FREE_GAMES, LOCKED_GAMES };

// ---------- ACHIEVEMENTS ----------
const ACHIEVEMENT_DEFS = [
    { id: 'first_chat', icon: '💬', name: 'First Words', desc: 'Send your first message', coins: 10 },
    { id: 'chat_100', icon: '🗣️', name: 'Chatterbox', desc: 'Send 100 messages', coins: 50 },
    { id: 'chat_1000', icon: '❤️', name: 'Best Friends', desc: 'Send 1000 messages', coins: 200 },
    { id: 'streak_3', icon: '🔥', name: 'On Fire', desc: '3-day streak', coins: 30 },
    { id: 'streak_7', icon: '⚡', name: 'Weekly Warrior', desc: '7-day streak', coins: 70 },
    { id: 'streak_30', icon: '🌟', name: 'Legend', desc: '30-day streak', coins: 300 },
    { id: 'snake_50', icon: '🐍', name: 'Snake Charmer', desc: 'Score 50+ in Snake', coins: 40 },
    { id: 'snake_100', icon: '🏆', name: 'Snake Master', desc: 'Score 100+ in Snake', coins: 80 },
    { id: 'ttt_win', icon: '🎯', name: 'First Blood', desc: 'Win first Tic Tac Toe', coins: 20 },
    { id: 'ttt_5wins', icon: '👑', name: 'Undefeated', desc: 'Win 5 Tic Tac Toe games', coins: 60 },
    { id: '2048_1024', icon: '🧠', name: 'Almost Genius', desc: 'Reach 1024 in 2048', coins: 50 },
    { id: '2048_2048', icon: '🎉', name: 'Genius!', desc: 'Reach 2048 tile!', coins: 150 },
    { id: 'ludo_win', icon: '🎲', name: 'Ludo King', desc: 'Win a Ludo game', coins: 60 },
    { id: 'rps_5wins', icon: '✊', name: 'Rock Star', desc: 'Win 5 RPS rounds', coins: 40 },
    { id: 'memory_win', icon: '🃏', name: 'Memory Champ', desc: 'Win Memory card game', coins: 50 },
    { id: 'coins_500', icon: '💰', name: 'Rich Kid', desc: 'Accumulate 500 coins', coins: 0 },
    { id: 'games_3', icon: '🎮', name: 'Gamer', desc: 'Play 3 different games', coins: 30 },
];

export function getAchievements() {
    try {
        return JSON.parse(localStorage.getItem('af_achievements') || '[]');
    } catch {
        return [];
    }
}

export function unlockAchievement(id) {
    const existing = getAchievements();
    if (existing.includes(id)) return null;
    const def = ACHIEVEMENT_DEFS.find(a => a.id === id);
    if (!def) return null;
    existing.push(id);
    localStorage.setItem('af_achievements', JSON.stringify(existing));
    if (def.coins > 0) addCoins(def.coins);
    return def;
}

export function checkAchievements() {
    const msgCount = parseInt(localStorage.getItem('af_msgcount') || '0', 10);
    if (msgCount >= 1) unlockAchievement('first_chat');
    if (msgCount >= 100) unlockAchievement('chat_100');
    if (msgCount >= 1000) unlockAchievement('chat_1000');

    const coins = getCoins();
    if (coins >= 500) unlockAchievement('coins_500');

    const streak = getStreak();
    if (streak >= 3) unlockAchievement('streak_3');
    if (streak >= 7) unlockAchievement('streak_7');
    if (streak >= 30) unlockAchievement('streak_30');

    const playedGames = getPlayedGames();
    if (playedGames.length >= 3) unlockAchievement('games_3');
}

export { ACHIEVEMENT_DEFS };

// ---------- GAME STATS ----------
export function getGameStats(gameId) {
    try {
        return JSON.parse(localStorage.getItem(`af_game_${gameId}`) || '{"highScore":0,"wins":0,"played":0}');
    } catch {
        return { highScore: 0, wins: 0, played: 0 };
    }
}

export function saveGameStats(gameId, stats) {
    const existing = getGameStats(gameId);
    const updated = { ...existing, ...stats, played: (existing.played || 0) + 1 };
    if (stats.score && stats.score > (existing.highScore || 0)) {
        updated.highScore = stats.score;
    }
    localStorage.setItem(`af_game_${gameId}`, JSON.stringify(updated));

    // Track played games for achievements
    const played = getPlayedGames();
    if (!played.includes(gameId)) {
        played.push(gameId);
        localStorage.setItem('af_played_games', JSON.stringify(played));
    }

    // Award coins for playing
    addCoins(5);

    checkAchievements();
    return updated;
}

export function getPlayedGames() {
    try {
        return JSON.parse(localStorage.getItem('af_played_games') || '[]');
    } catch {
        return [];
    }
}

// Game-specific achievements
export function onSnakeScore(score) {
    const stats = getGameStats('snake');
    if (score > (stats.highScore || 0)) {
        saveGameStats('snake', { score });
        addCoins(Math.floor(score / 10));
    }
    if (score >= 50) unlockAchievement('snake_50');
    if (score >= 100) unlockAchievement('snake_100');
}

export function onTicTacToeWin() {
    const stats = getGameStats('tictactoe');
    const wins = (stats.wins || 0) + 1;
    saveGameStats('tictactoe', { wins });
    addCoins(15);
    unlockAchievement('ttt_win');
    if (wins >= 5) unlockAchievement('ttt_5wins');
}

export function on2048Tile(tile) {
    if (tile >= 1024) unlockAchievement('2048_1024');
    if (tile >= 2048) unlockAchievement('2048_2048');
    addCoins(Math.floor(tile / 100));
}

export function onLudoWin() {
    saveGameStats('ludo', { wins: (getGameStats('ludo').wins || 0) + 1 });
    addCoins(25);
    unlockAchievement('ludo_win');
}

export function onRPSWin() {
    const stats = getGameStats('rps');
    const wins = (stats.wins || 0) + 1;
    saveGameStats('rps', { wins });
    addCoins(10);
    if (wins >= 5) unlockAchievement('rps_5wins');
}

export function onMemoryWin() {
    saveGameStats('memory', { wins: (getGameStats('memory').wins || 0) + 1 });
    addCoins(20);
    unlockAchievement('memory_win');
}

// ---------- STREAK SYSTEM ----------
export function getStreak() {
    return parseInt(localStorage.getItem('af_streak') || '0', 10);
}

export function updateStreak() {
    const lastVisit = localStorage.getItem('af_last_visit');
    const today = new Date().toDateString();
    if (lastVisit === today) return getStreak();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    let streak = getStreak();
    if (lastVisit === yesterday) {
        streak += 1;
    } else if (lastVisit !== today) {
        streak = 1;
    }
    localStorage.setItem('af_streak', String(streak));
    localStorage.setItem('af_last_visit', today);
    checkAchievements();
    return streak;
}

// ---------- DAILY CHALLENGE ----------
const DAILY_CHALLENGES = [
    { day: 0, game: 'snake', goal: 'Score 30+ in Snake', icon: '🐍', reward: 30 },
    { day: 1, game: 'tictactoe', goal: 'Win 2 Tic Tac Toe games', icon: '🎯', reward: 25 },
    { day: 2, game: '2048', goal: 'Reach 512 tile in 2048', icon: '🔢', reward: 40 },
    { day: 3, game: 'snake', goal: 'Score 50+ in Snake', icon: '🐍', reward: 50 },
    { day: 4, game: 'tictactoe', goal: 'Win 3 Tic Tac Toe games', icon: '🎯', reward: 35 },
    { day: 5, game: 'ludo', goal: 'Win a Ludo game', icon: '🎲', reward: 60 },
    { day: 6, game: 'rps', goal: 'Win 3 RPS rounds', icon: '✊', reward: 30 },
];

export function getDailyChallenge() {
    const dayOfWeek = new Date().getDay();
    return DAILY_CHALLENGES[dayOfWeek];
}

export function isDailyChallengeComplete() {
    const today = new Date().toDateString();
    return localStorage.getItem('af_daily_complete') === today;
}

export function completeDailyChallenge() {
    const today = new Date().toDateString();
    localStorage.setItem('af_daily_complete', today);
    const challenge = getDailyChallenge();
    addCoins(challenge.reward);
    return challenge.reward;
}

// ---------- Full Reset ----------
export async function resetAll() {
    try { await db.messages.clear(); } catch { }
    try { await db.memories.clear(); } catch { }
    ['af_profile', 'af_ai', 'af_messages', 'af_memories', 'af_msgcount', 'af_happy', 'af_theme',
        'af_coins', 'af_unlocked_games', 'af_achievements', 'af_streak', 'af_last_visit',
        'af_daily_complete', 'af_played_games',
        'af_game_snake', 'af_game_tictactoe', 'af_game_2048', 'af_game_ludo',
        'af_game_rps', 'af_game_memory',
    ].forEach(k => localStorage.removeItem(k));
}
