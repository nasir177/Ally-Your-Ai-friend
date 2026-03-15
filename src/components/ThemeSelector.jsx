// ============================================================
//  ThemeSelector – Full animated backgrounds + coin-locked themes
//  Includes: Rain, Cherry Blossom, Storm, Arabian Night, Sky, etc.
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';
import { slideUp } from '../utils/animations';
import { getCoins, spendCoins, getTheme, saveTheme } from '../services/storageService';

// ── Theme Definitions ────────────────────────────────────────
export const THEMES = [
    // Free backgrounds
    {
        id: 'white', label: 'Cloud', emoji: '☁️', free: true,
        bgClass: 'bg-slate-50',
        preview: 'linear-gradient(135deg,#f8fafc,#e2e8f0)',
        dark: false,
    },
    {
        id: 'lavender', label: 'Lavender', emoji: '💜', free: true,
        bgClass: 'bg-violet-50',
        preview: 'linear-gradient(135deg,#ede9fe,#ddd6fe)',
        dark: false,
    },
    {
        id: 'peach', label: 'Peach', emoji: '🍑', free: true,
        bgClass: 'bg-orange-50',
        preview: 'linear-gradient(135deg,#fff7ed,#fde68a)',
        dark: false,
    },
    {
        id: 'mint', label: 'Mint', emoji: '🌿', free: true,
        bgClass: 'bg-emerald-50',
        preview: 'linear-gradient(135deg,#ecfdf5,#a7f3d0)',
        dark: false,
    },
    {
        id: 'dusk', label: 'Dusk', emoji: '🌆', free: true,
        bgClass: 'bg-indigo-950',
        preview: 'linear-gradient(135deg,#312e81,#4c1d95)',
        dark: true,
    },
    {
        id: 'night', label: 'Night', emoji: '🌙', free: true,
        bgClass: 'bg-gray-950',
        preview: 'linear-gradient(135deg,#111827,#1f2937)',
        dark: true,
    },
    // Animated themes (coin-locked)
    {
        id: 'rain', label: 'Rain', emoji: '🌧️', free: false, cost: 80,
        bgClass: 'bg-slate-700',
        preview: 'linear-gradient(135deg,#334155,#475569)',
        dark: true, animated: 'rain',
    },
    {
        id: 'cherry', label: 'Cherry Blossom', emoji: '🌸', free: false, cost: 80,
        bgClass: 'bg-pink-100',
        preview: 'linear-gradient(135deg,#fce7f3,#fbcfe8)',
        dark: false, animated: 'cherry',
    },
    {
        id: 'storm', label: 'Storm', emoji: '⛈️', free: false, cost: 100,
        bgClass: 'bg-gray-800',
        preview: 'linear-gradient(135deg,#1e293b,#334155)',
        dark: true, animated: 'storm',
    },
    {
        id: 'arabian', label: 'Arabian Night', emoji: '🕌', free: false, cost: 120,
        bgClass: 'bg-indigo-950',
        preview: 'linear-gradient(135deg,#1e1b4b,#312e81)',
        dark: true, animated: 'arabian',
    },
    {
        id: 'sky', label: 'Sky', emoji: '🌤️', free: false, cost: 60,
        bgClass: 'bg-sky-100',
        preview: 'linear-gradient(135deg,#e0f2fe,#bae6fd)',
        dark: false, animated: 'sky',
    },
    {
        id: 'sakura', label: 'Sakura', emoji: '🎋', free: false, cost: 100,
        bgClass: 'bg-rose-50',
        preview: 'linear-gradient(135deg,#fff1f2,#fda4af)',
        dark: false, animated: 'sakura',
    },
    {
        id: 'galaxy', label: 'Galaxy', emoji: '🌌', free: false, cost: 150,
        bgClass: 'bg-purple-950',
        preview: 'linear-gradient(135deg,#3b0764,#1e1b4b)',
        dark: true, animated: 'galaxy',
    },
    {
        id: 'sunset', label: 'Sunset', emoji: '🌅', free: false, cost: 80,
        bgClass: 'bg-orange-900',
        preview: 'linear-gradient(135deg,#ea580c,#dc2626)',
        dark: true, animated: 'sunset',
    },
];

export const BUBBLE_STYLES = [
    { id: 'modern', label: 'Modern', preview: '20px 20px 4px' },
    { id: 'bubbly', label: 'Bubbly', preview: '28px' },
    { id: 'soft', label: 'Soft', preview: '12px' },
    { id: 'classic', label: 'Classic', preview: '6px' },
    { id: 'sharp', label: 'Sharp', preview: '4px' },
];

// ── Unlock helper ────────────────────────────────────────────
function getUnlockedThemes() {
    try { return JSON.parse(localStorage.getItem('af_unlocked_themes') || '[]'); }
    catch { return []; }
}
function unlockTheme(id, cost) {
    if (!spendCoins(cost)) return false;
    const arr = getUnlockedThemes();
    if (!arr.includes(id)) arr.push(id);
    localStorage.setItem('af_unlocked_themes', JSON.stringify(arr));
    return true;
}
export function isThemeUnlocked(id) {
    const t = THEMES.find(t => t.id === id);
    if (!t || t.free) return true;
    return getUnlockedThemes().includes(id);
}

// ── getChatBg (exported for ChatScreen) ─────────────────────
export function getChatBg(id = 'white') {
    const t = THEMES.find(t => t.id === id);
    return t?.bgClass || 'bg-slate-50';
}
export function isThemeDark(id = 'white') {
    const t = THEMES.find(t => t.id === id);
    return t?.dark || false;
}

// ── Main Component ───────────────────────────────────────────
export default function ThemeSelector({ open, onClose, theme, onThemeChange }) {
    const { bg = 'white', bubbleStyle = 'modern' } = theme || {};
    const [coins, setCoins] = useState(getCoins);
    const [unlocked, setUnlocked] = useState(getUnlockedThemes);
    const [buying, setBuying] = useState(null);

    const handleThemePick = (t) => {
        if (!t.free && !unlocked.includes(t.id)) {
            setBuying(t);
            return;
        }
        onThemeChange({ ...theme, bg: t.id });
    };

    const confirmBuy = (t) => {
        const ok = unlockTheme(t.id, t.cost);
        if (ok) {
            const newUnlocked = [...unlocked, t.id];
            setUnlocked(newUnlocked);
            setCoins(getCoins());
            onThemeChange({ ...theme, bg: t.id });
            setBuying(null);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                        onClick={onClose}
                    />

                    {/* Sheet */}
                    <motion.div
                        variants={slideUp} initial="initial" animate="animate" exit="exit"
                        className="fixed bottom-0 z-50 bg-white rounded-t-3xl overflow-hidden shadow-2xl"
                        style={{
                            left: 0, right: 0, maxWidth: 640, margin: '0 auto',
                            boxShadow: '0 -12px 48px rgba(0,0,0,0.18)',
                            maxHeight: '85vh',
                        }}>
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-1">
                            <div style={{ width: 40, height: 4, borderRadius: 2, background: '#e2e8f0' }} />
                        </div>

                        <div style={{ overflowY: 'auto', maxHeight: 'calc(85vh - 20px)', paddingBottom: 32 }}>
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-3">
                                <div>
                                    <h3 className="font-bold text-lg" style={{ color: 'var(--text)', fontFamily: 'Plus Jakarta Sans' }}>
                                        🎨 Customize Chat
                                    </h3>
                                    <p className="text-xs" style={{ color: 'var(--text-3)' }}>
                                        Coins: <span style={{ color: '#f59e0b', fontWeight: 700 }}>🪙 {coins}</span>
                                    </p>
                                </div>
                                <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
                                    className="w-9 h-9 rounded-full flex items-center justify-center"
                                    style={{ background: 'var(--bg-2)', border: '1.5px solid var(--border)' }}>
                                    <X size={16} color="var(--text-2)" />
                                </motion.button>
                            </div>

                            <div className="px-5">
                                {/* ── Backgrounds ── */}
                                <p className="text-xs font-bold uppercase tracking-widest mb-3 mt-1" style={{ color: 'var(--text-3)' }}>
                                    Chat Background
                                </p>
                                <div className="grid grid-cols-4 gap-3 mb-6">
                                    {THEMES.map(t => {
                                        const isLocked = !t.free && !unlocked.includes(t.id);
                                        const active = bg === t.id;
                                        return (
                                            <motion.button key={t.id}
                                                whileHover={{ scale: 1.06, y: -3 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleThemePick(t)}
                                                className="flex flex-col items-center gap-1.5 relative">
                                                <div style={{
                                                    width: 56, height: 56, borderRadius: 16,
                                                    background: t.preview,
                                                    boxShadow: active
                                                        ? '0 0 0 3px #7C3AED, 0 4px 16px rgba(124,58,237,0.3)'
                                                        : '0 2px 8px rgba(0,0,0,0.1)',
                                                    position: 'relative', overflow: 'hidden',
                                                    border: active ? '2px solid white' : '2px solid transparent',
                                                    transition: 'all 0.2s',
                                                }}>
                                                    <span style={{ fontSize: 22, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                                                        {t.emoji}
                                                    </span>
                                                    {isLocked && (
                                                        <div style={{
                                                            position: 'absolute', inset: 0,
                                                            background: 'rgba(0,0,0,0.45)',
                                                            display: 'flex', flexDirection: 'column',
                                                            alignItems: 'center', justifyContent: 'center', gap: 2,
                                                        }}>
                                                            <Lock size={14} color="white" />
                                                            <span style={{ fontSize: 8, color: 'white', fontWeight: 700 }}>🪙{t.cost}</span>
                                                        </div>
                                                    )}
                                                    {active && (
                                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                            style={{
                                                                position: 'absolute', bottom: 3, right: 3,
                                                                width: 16, height: 16, borderRadius: '50%',
                                                                background: '#7C3AED',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            }}>
                                                            <svg width="8" height="8" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-semibold text-center leading-tight"
                                                    style={{ color: active ? 'var(--purple)' : 'var(--text-2)', maxWidth: 56 }}>
                                                    {t.label}
                                                </span>
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {/* ── Bubble Styles ── */}
                                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>
                                    Message Bubble Style
                                </p>
                                <div className="flex gap-2 mb-6 overflow-x-auto hide-scroll pb-1">
                                    {BUBBLE_STYLES.map(s => (
                                        <motion.button key={s.id}
                                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                            onClick={() => onThemeChange({ ...theme, bubbleStyle: s.id })}
                                            className="flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all"
                                            style={{
                                                background: bubbleStyle === s.id ? 'var(--purple-pale)' : 'var(--bg-2)',
                                                border: `1.5px solid ${bubbleStyle === s.id ? 'var(--purple)' : 'var(--border)'}`,
                                                minWidth: 72,
                                            }}>
                                            {/* Preview bubble */}
                                            <div style={{
                                                width: 50, height: 22,
                                                background: 'linear-gradient(135deg,#7C3AED,#EC4899)',
                                                borderRadius: s.preview,
                                            }} />
                                            <span className="text-[11px] font-semibold"
                                                style={{ color: bubbleStyle === s.id ? 'var(--purple)' : 'var(--text-3)' }}>
                                                {s.label}
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Buy confirm modal */}
                    <AnimatePresence>
                        {buying && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[60] flex items-center justify-center p-6"
                                style={{ background: 'rgba(0,0,0,0.5)' }}>
                                <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.85, opacity: 0 }}
                                    className="bg-white rounded-3xl p-6 w-full max-w-xs text-center"
                                    style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
                                    <div style={{ fontSize: 40 }}>{buying.emoji}</div>
                                    <h4 className="font-bold text-lg mt-2" style={{ color: 'var(--text)', fontFamily: 'Plus Jakarta Sans' }}>
                                        {buying.label}
                                    </h4>
                                    <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>
                                        Unlock this animated background
                                    </p>
                                    <div className="flex items-center justify-center gap-1 mt-3 mb-4">
                                        <span style={{ fontSize: 20 }}>🪙</span>
                                        <span className="font-bold text-xl" style={{ color: '#92400e' }}>{buying.cost}</span>
                                        <span className="text-sm" style={{ color: 'var(--text-3)' }}>coins</span>
                                    </div>
                                    {coins < buying.cost ? (
                                        <p className="text-sm font-semibold" style={{ color: '#ef4444' }}>
                                            Not enough coins! Need {buying.cost - coins} more 🪙
                                        </p>
                                    ) : (
                                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                            onClick={() => confirmBuy(buying)}
                                            className="w-full py-3 rounded-2xl text-white font-bold text-base"
                                            style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)', border: 'none', cursor: 'pointer' }}>
                                            Unlock Now ✨
                                        </motion.button>
                                    )}
                                    <button onClick={() => setBuying(null)}
                                        className="w-full mt-2 py-2.5 rounded-2xl text-sm font-semibold"
                                        style={{ background: 'var(--bg-2)', color: 'var(--text-3)', border: 'none', cursor: 'pointer' }}>
                                        Cancel
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </AnimatePresence>
    );
}
