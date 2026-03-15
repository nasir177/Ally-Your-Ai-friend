// ============================================================
//  Secondary Screens – Light theme: Settings, MemoryLane, FriendProfile, Activities
// ============================================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ChevronLeft, Settings as SettingsIcon, Globe, Zap, Brain, Bell,
    Trash2, AlertTriangle, Calendar, MessageSquare, Sparkles,
    User, BookOpen, Music, Film, Gamepad2, Coffee, Star, BookMarked,
    HelpCircle, ListChecks, Shuffle
} from 'lucide-react';
import { pageVariants, cardVariants, fadeInUp } from '../utils/animations';
import Avatar from '../components/Avatar';
import { resetAll, getFriendshipStats } from '../services/storageService';

// ------ Settings ------
export function Settings({ userProfile, aiProfile, onBack, onReset }) {
    const [lang, setLang] = useState('hinglish');
    const [speed, setSpeed] = useState('thoughtful');
    const [memory, setMemory] = useState(true);
    const [notifs, setNotifs] = useState(true);
    const [confirmReset, setConfirmReset] = useState(false);

    const Toggle = ({ value, onChange }) => (
        <button
            onClick={() => onChange(!value)}
            className="toggle-track flex-shrink-0"
            style={{ background: value ? 'var(--purple)' : '#E2E8F0' }}
        >
            <div className="toggle-thumb" style={{ transform: value ? 'translateX(19px)' : 'translateX(0)' }} />
        </button>
    );

    const Section = ({ title, children }) => (
        <div className="card p-4 flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>{title}</p>
            {children}
        </div>
    );

    return (
        <div className="min-h-screen" style={{ background: '#FAFAFF' }}>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col min-h-screen">
                <div className="px-5 pt-14 pb-5 flex items-center gap-3">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={onBack}
                        className="w-9 h-9 rounded-full bg-white border flex items-center justify-center shadow-sm"
                        style={{ borderColor: 'var(--border)' }}>
                        <ChevronLeft size={18} color="var(--text-2)" />
                    </motion.button>
                    <div>
                        <h1 className="font-bold text-xl" style={{ color: 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Settings</h1>
                        <p className="text-xs" style={{ color: 'var(--text-3)' }}>Customize your experience</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-10 hide-scroll flex flex-col gap-3">
                    {/* Language */}
                    <Section title="Language">
                        <div className="flex gap-2">
                            {[{ id: 'hinglish', label: '🇮🇳 Hinglish' }, { id: 'english', label: '🇬🇧 English' }, { id: 'hindi', label: 'हिं Hindi' }].map(l => (
                                <button key={l.id} onClick={() => setLang(l.id)}
                                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
                                    style={{
                                        background: lang === l.id ? 'var(--purple)' : 'var(--bg-2)',
                                        color: lang === l.id ? 'white' : 'var(--text-2)',
                                        border: `1.5px solid ${lang === l.id ? 'var(--purple)' : 'var(--border)'}`,
                                    }}>
                                    {l.label}
                                </button>
                            ))}
                        </div>
                    </Section>

                    {/* Speed */}
                    <Section title="AI Response Speed">
                        <div className="flex gap-2">
                            {[{ id: 'instant', icon: Zap, label: 'Instant' }, { id: 'thoughtful', icon: Brain, label: 'Thoughtful' }].map(s => (
                                <button key={s.id} onClick={() => setSpeed(s.id)}
                                    className="flex-1 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                                    style={{
                                        background: speed === s.id ? 'var(--purple-pale)' : 'var(--bg-2)',
                                        color: speed === s.id ? 'var(--purple)' : 'var(--text-2)',
                                        border: `1.5px solid ${speed === s.id ? 'var(--purple)' : 'var(--border)'}`,
                                    }}>
                                    <s.icon size={13} /> {s.label}
                                </button>
                            ))}
                        </div>
                    </Section>

                    {/* Toggles */}
                    <Section title="Preferences">
                        {[
                            { icon: Brain, label: 'Conversation Memory', sub: 'AI remembers past chats', value: memory, set: setMemory },
                            { icon: Bell, label: 'Notifications', sub: 'Activity reminders', value: notifs, set: setNotifs },
                        ].map(item => (
                            <div key={item.label} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--purple-pale)' }}>
                                        <item.icon size={15} color="var(--purple)" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{item.label}</p>
                                        <p className="text-xs" style={{ color: 'var(--text-3)' }}>{item.sub}</p>
                                    </div>
                                </div>
                                <Toggle value={item.value} onChange={item.set} />
                            </div>
                        ))}
                    </Section>

                    {/* Profile card */}
                    <Section title="Your Profile">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--purple-pale)' }}>
                                <User size={18} color="var(--purple)" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{userProfile.userName}</p>
                                <p className="text-xs" style={{ color: 'var(--text-3)' }}>Chatting with {aiProfile.aiName} · {aiProfile.personality}</p>
                            </div>
                        </div>
                    </Section>

                    {/* Danger */}
                    <div className="rounded-2xl border p-4" style={{ borderColor: '#FCA5A5', background: '#FFF5F5' }}>
                        <p className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ color: '#EF4444' }}>
                            <AlertTriangle size={12} /> Danger Zone
                        </p>
                        {!confirmReset ? (
                            <button
                                onClick={() => setConfirmReset(true)}
                                className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                                style={{ background: '#FEE2E2', color: '#EF4444' }}>
                                <Trash2 size={15} /> Reset Friendship
                            </button>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-center" style={{ color: '#EF4444' }}>Sabki memories delete ho jaayengi 💔</p>
                                <div className="flex gap-2">
                                    <button onClick={() => setConfirmReset(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'var(--bg-2)', color: 'var(--text-2)' }}>Cancel</button>
                                    <button onClick={async () => { await resetAll(); onReset?.(); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#EF4444' }}>Yes, Reset</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// ------ Memory Lane ------
export function MemoryLane({ onBack }) {
    const milestones = [
        { icon: '👋', color: '#7C3AED', title: 'First Hello', sub: 'You and your AI friend met for the first time!' },
        { icon: '🌟', color: '#F59E0B', title: 'One Week Together', sub: 'Seven days of good vibes and great chats!' },
        { icon: '🎂', color: '#EC4899', title: '1 Month of Friendship', sub: 'A whole month! You two are inseparable!' },
        { icon: '💬', color: '#3B82F6', title: '100 Messages!', sub: 'You crossed the 100-message milestone 🎊' },
    ];
    const jokes = [
        '"Tomorrow pakka gym jaaunga" 😂',
        '"Netflix sirf ek episode…" 4 episodes later 😅',
        '"5 min mein ready" means 40 min 🤣',
    ];

    return (
        <div className="min-h-screen" style={{ background: '#FAFAFF' }}>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col min-h-screen">
                <div className="px-5 pt-14 pb-5 flex items-center gap-3">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="w-9 h-9 rounded-full bg-white border flex items-center justify-center shadow-sm" style={{ borderColor: 'var(--border)' }}>
                        <ChevronLeft size={18} color="var(--text-2)" />
                    </motion.button>
                    <div>
                        <h1 className="font-bold text-xl" style={{ color: 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Memory Lane</h1>
                        <p className="text-xs" style={{ color: 'var(--text-3)' }}>Your journey together ✨</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-10 hide-scroll flex flex-col gap-3">
                    {milestones.map((m, i) => (
                        <motion.div key={i} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                            className="card p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${m.color}14` }}>
                                {m.icon}
                            </div>
                            <div>
                                <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{m.title}</p>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>{m.sub}</p>
                            </div>
                        </motion.div>
                    ))}

                    <div className="card p-4">
                        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>😂 Inside Jokes</p>
                        {jokes.map((j, i) => (
                            <p key={i} className="text-sm py-2 border-b last:border-0" style={{ color: 'var(--text-2)', borderColor: 'var(--border)' }}>{j}</p>
                        ))}
                    </div>

                    <div className="card p-4">
                        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>💫 Reactions Used</p>
                        <div className="flex flex-wrap gap-2">
                            {['❤️ x24', '😂 x18', '😮 x9', '👍 x15', '🔥 x7', '🥺 x12'].map(r => (
                                <span key={r} className="chip">{r}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// ------ Friend Profile ------
export function FriendProfile({ aiProfile, onBack }) {
    const stats = getFriendshipStats();
    const { aiName, personality, aiAvatarId } = aiProfile;

    const DATA = {
        cheerful: { traits: ['Always positive', 'Loves celebrating', 'Super energetic', 'Best hype person'], topics: ['Life wins', 'Music & dance', 'Travel dreams', 'Celeb gossip'], color: '#F59E0B' },
        calm: { traits: ['Great listener', 'Never judges', 'Very patient', 'Calming presence'], topics: ['Deep feelings', 'Life lessons', 'Nature', 'Philosophy'], color: '#10B981' },
        funny: { traits: ['Always has a joke', 'Meme-fluent', 'Turns pain into laughs', 'Sarcastic'], topics: ['Memes', 'Movie scenes', 'Relatable moments', 'Comedy shows'], color: '#EC4899' },
        wise: { traits: ['Deep thinker', 'Gives great advice', 'Philosophical', 'Sees the big picture'], topics: ['Philosophy', 'Books & ideas', 'Life purpose', 'Psychology'], color: '#7C3AED' },
    };
    const d = DATA[personality] || DATA.cheerful;

    return (
        <div className="min-h-screen" style={{ background: '#FAFAFF' }}>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col min-h-screen">
                <div className="px-5 pt-14 pb-5 flex items-center gap-3">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="w-9 h-9 rounded-full bg-white border flex items-center justify-center shadow-sm" style={{ borderColor: 'var(--border)' }}>
                        <ChevronLeft size={18} color="var(--text-2)" />
                    </motion.button>
                    <h1 className="font-bold text-xl" style={{ color: 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Friend Profile</h1>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-10 hide-scroll flex flex-col gap-4 items-center">
                    {/* Hero */}
                    <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}
                        className="flex flex-col items-center gap-3 py-2 w-full text-center">
                        <div className="relative">
                            <Avatar avatarId={aiAvatarId} size={96} />
                            <div className="status-online absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full" style={{ background: '#22C55E' }} />
                        </div>
                        <div>
                            <h2 className="font-extrabold text-2xl" style={{ color: 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{aiName}</h2>
                            <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>Your {personality} buddy</p>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <div className="card p-4 w-full">
                        <div className="grid grid-cols-3 gap-2 text-center">
                            {[
                                { icon: Calendar, label: 'Days', value: stats.days },
                                { icon: MessageSquare, label: 'Messages', value: stats.messages },
                                { icon: Sparkles, label: 'Moments', value: stats.happyMoments || '∞' },
                            ].map(s => (
                                <div key={s.label}>
                                    <div className="w-8 h-8 rounded-xl mx-auto mb-1 flex items-center justify-center" style={{ background: `${d.color}14` }}>
                                        <s.icon size={16} color={d.color} />
                                    </div>
                                    <p className="font-bold text-lg" style={{ color: 'var(--text)' }}>{s.value}</p>
                                    <p className="text-xs" style={{ color: 'var(--text-3)' }}>{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Traits */}
                    <div className="card p-4 w-full">
                        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>Personality Traits</p>
                        <div className="flex flex-col gap-2">
                            {d.traits.map((t, i) => (
                                <div key={i} className="flex items-center gap-2.5">
                                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                                    <p className="text-sm" style={{ color: 'var(--text-2)' }}>{t}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Topics */}
                    <div className="card p-4 w-full">
                        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>Favorite Topics</p>
                        <div className="flex flex-wrap gap-2">
                            {d.topics.map(t => (
                                <span key={t} className="chip">{t}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// ------ Activities ------
export function Activities({ aiProfile, onBack, onSendActivity }) {
    const { aiName } = aiProfile;
    const GAMES = [
        { icon: HelpCircle, color: '#7C3AED', name: '20 Questions', desc: 'I\'ll guess what you\'re thinking!', prompt: `Chal yaar, 20 Questions khelein! Kuch soch (person/place/thing) aur main guess karunga. Pehla sawaal: Is it alive?` },
        { icon: BookOpen, color: '#EC4899', name: 'Story Building', desc: 'Build a wild story together!', prompt: `Story time yaar! Tu ek line bol, phir main, and we build something crazy! Tu start kar – pehli line bol do 🎭` },
        { icon: Shuffle, color: '#F59E0B', name: 'Would You Rather', desc: 'Impossible choices incoming!', prompt: `Would You Rather 😄: Would you rather fly OR be invisible? Choose karo aur explain karo kyun!` },
        { icon: Star, color: '#10B981', name: 'Two Truths', desc: 'Spot the lie!', prompt: `Two Truths One Lie – classic! Main 3 bolunga: 1) I love spicy food 2) I stayed awake 48 hours 3) I've never seen sunrise. Guess karo which one is a lie 🤔` },
        { icon: Coffee, color: '#6366F1', name: 'Joke Exchange', desc: 'Take turns cracking jokes!', prompt: `Joke time!! 😂 Pehle mera: Astronaut ne divorce kyun liya? Ushe space chahiye tha! 🚀 Ab tera turn!` },
        { icon: Sparkles, color: '#EC4899', name: 'Dream Journal', desc: 'Share your biggest dreams!', prompt: `Yaar, dreams ki baat karte hain! 3 biggest dreams batao – places, goals, anything. No judgment zone! 🌙✨` },
        { icon: ListChecks, color: '#F59E0B', name: 'Bucket List', desc: 'Things you want to do!', prompt: `Bucket list time! 🎯 Tera top 3 kya hai? I'll share mine too. Jo bhi hai bata, I'm all ears! 🌟` },
        { icon: Music, color: '#7C3AED', name: 'Music Recs', desc: 'Swap song recommendations!', prompt: `Music time! 🎵 Tera current most-played song kaunsa hai? I'll give you a rec based on your vibe!` },
    ];

    return (
        <div className="min-h-screen" style={{ background: '#FAFAFF' }}>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col min-h-screen">
                <div className="px-5 pt-14 pb-5 flex items-center gap-3">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="w-9 h-9 rounded-full bg-white border flex items-center justify-center shadow-sm" style={{ borderColor: 'var(--border)' }}>
                        <ChevronLeft size={18} color="var(--text-2)" />
                    </motion.button>
                    <div>
                        <h1 className="font-bold text-xl" style={{ color: 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Activities</h1>
                        <p className="text-xs" style={{ color: 'var(--text-3)' }}>Play with {aiName}!</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-10 hide-scroll">
                    <div className="grid grid-cols-2 gap-3">
                        {GAMES.map((g, i) => (
                            <motion.button
                                key={g.name}
                                custom={i}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onSendActivity(g.prompt)}
                                className="card p-4 text-left card-hover flex flex-col gap-3"
                            >
                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${g.color}14` }}>
                                    <g.icon size={20} color={g.color} />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{g.name}</p>
                                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-3)' }}>{g.desc}</p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
