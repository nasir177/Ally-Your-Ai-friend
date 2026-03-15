// ============================================================
//  FriendSelection – Light theme, personality cards
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { pageVariants, cardVariants } from '../utils/animations';
import Avatar, { AVATARS } from '../components/Avatar';

const PERSONALITIES = [
    {
        id: 'cheerful',
        emoji: '☀️',
        name: 'Cheerful Buddy',
        tagline: 'Hypes you up every time',
        desc: 'Upbeat, positive & full of energy. Will celebrate every win with you!',
        color: '#F59E0B',
        colorPale: '#FFFBEB',
        sample: 'OMG yaar, tum amazing ho!! Kal ki baat sun – I literally cannot stop thinking about how cool you are 🎉',
    },
    {
        id: 'calm',
        emoji: '🌿',
        name: 'Calm Listener',
        tagline: 'Always here when you need',
        desc: 'Peaceful, gentle, and understanding. Never judges, always listens.',
        color: '#10B981',
        colorPale: '#ECFDF5',
        sample: 'Hey... I\'m here, okay? Take your time. Bata mujhe kya hua – I\'m all ears and zero judgment 💙',
    },
    {
        id: 'funny',
        emoji: '😂',
        name: 'Comedy Friend',
        tagline: 'Turns every moment into a joke',
        desc: 'Hilarious, sarcastic in a loving way, and meme-fluent.',
        color: '#EC4899',
        colorPale: '#FDF2F8',
        sample: 'Bhai teri life toh Netflix series hai yaar 😂 Season 3 release kab hoga? I want popcorn!',
    },
    {
        id: 'wise',
        emoji: '🦉',
        name: 'Wise Mentor',
        tagline: 'Deep talks, great advice',
        desc: 'Thoughtful, philosophical and guiding. Asks the right questions.',
        color: '#7C3AED',
        colorPale: '#F5F3FF',
        sample: 'Socho – har mushkil ek naya sabak lekar aati hai. What is this situation teaching you? 🌟',
    },
];

const AI_AVATARS = AVATARS.slice(0, 8);

export default function FriendSelection({ userName, onSelect }) {
    const [personality, setPersonality] = useState(null);
    const [aiName, setAiName] = useState('');
    const [aiAvatar, setAiAvatar] = useState(null);
    const [step, setStep] = useState(1);

    const pers = PERSONALITIES.find(p => p.id === personality);
    const canGo2 = !!personality;
    const canFinish = aiName.trim().length >= 1 && !!aiAvatar;

    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#FAFAFF' }}>
            <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col flex-1"
            >
                {/* Header */}
                <div className="px-6 pt-14 pb-5">
                    <div className="flex items-center gap-2 mb-1">
                        {step === 2 && (
                            <button
                                onClick={() => setStep(1)}
                                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 mr-1"
                            >
                                <ChevronLeft size={16} color="var(--text-2)" />
                            </button>
                        )}
                        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--purple)' }}>
                            Step 2 of 2
                        </p>
                    </div>
                    <h1 className="font-extrabold text-2xl leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--text)' }}>
                        {step === 1 ? `Hey ${userName || 'there'} 👋` : `Name your friend`}
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
                        {step === 1 ? 'Who would you like to hang out with?' : `Give your ${pers?.name} a name and a face!`}
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-4 hide-scroll">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
                                {PERSONALITIES.map((p, i) => (
                                    <motion.button
                                        key={p.id}
                                        custom={i}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover={{ scale: 1.01, y: -2 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => setPersonality(p.id)}
                                        className="text-left rounded-2xl p-4 border transition-all card-hover"
                                        style={{
                                            background: personality === p.id ? p.colorPale : 'white',
                                            borderColor: personality === p.id ? p.color : 'var(--border)',
                                            boxShadow: personality === p.id ? `0 4px 20px ${p.color}22` : 'var(--shadow-sm)',
                                        }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                                                style={{ background: `${p.color}18` }}
                                            >
                                                {p.emoji}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>{p.name}</span>
                                                    {personality === p.id && (
                                                        <motion.span
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="w-4 h-4 rounded-full flex items-center justify-center"
                                                            style={{ background: p.color }}
                                                        >
                                                            <Check size={10} color="white" strokeWidth={3} />
                                                        </motion.span>
                                                    )}
                                                </div>
                                                <p className="text-xs font-medium mb-1.5" style={{ color: p.color }}>{p.tagline}</p>
                                                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{p.desc}</p>
                                                {personality === p.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="mt-3 rounded-xl p-2.5 text-xs italic leading-relaxed"
                                                        style={{ background: `${p.color}14`, color: 'var(--text-2)' }}
                                                    >
                                                        "{p.sample}"
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: 'var(--text-3)' }}>
                                        Friend's Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Arya, Karan, Zara…"
                                        value={aiName}
                                        onChange={e => setAiName(e.target.value)}
                                        maxLength={20}
                                        className="input"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-widest block mb-3" style={{ color: 'var(--text-3)' }}>
                                        Their Look
                                    </label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {AI_AVATARS.map((av, i) => (
                                            <motion.div
                                                key={av.id}
                                                custom={i}
                                                variants={cardVariants}
                                                initial="hidden"
                                                animate="visible"
                                                className="flex flex-col items-center"
                                            >
                                                <Avatar
                                                    avatarId={av.id}
                                                    size={68}
                                                    selected={aiAvatar === av.id}
                                                    onClick={() => setAiAvatar(av.id)}
                                                    showName={true}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Action */}
                <div className="px-5 pb-10 pt-3" style={{ background: 'white', borderTop: '1px solid var(--border)' }}>
                    <motion.button
                        whileHover={(step === 1 ? canGo2 : canFinish) ? { scale: 1.02, y: -1 } : {}}
                        whileTap={(step === 1 ? canGo2 : canFinish) ? { scale: 0.98 } : {}}
                        disabled={step === 1 ? !canGo2 : !canFinish}
                        onClick={() => {
                            if (step === 1 && canGo2) setStep(2);
                            else if (step === 2 && canFinish) onSelect({ personality, aiName: aiName.trim(), aiAvatarId: aiAvatar });
                        }}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                        style={{
                            borderRadius: 16, padding: '15px 24px',
                            opacity: (step === 1 ? canGo2 : canFinish) ? 1 : 0.4,
                            cursor: (step === 1 ? canGo2 : canFinish) ? 'pointer' : 'not-allowed',
                        }}
                    >
                        {step === 1 ? 'Choose Their Vibe' : `Meet ${aiName || 'Your Friend'} 💙`}
                        <ChevronRight size={18} />
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
