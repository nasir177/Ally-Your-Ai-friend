// ============================================================
//  AvatarSelection – Light theme, clean grid
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { pageVariants, cardVariants, staggerContainer } from '../utils/animations';
import Avatar, { AVATARS } from '../components/Avatar';

const CATEGORIES = ['All', 'Boy', 'Girl', 'Neutral', 'Fantasy'];

export default function AvatarSelection({ onSelect }) {
    const [category, setCategory] = useState('All');
    const [selected, setSelected] = useState(null);
    const [userName, setUserName] = useState('');

    const filtered = category === 'All' ? AVATARS
        : AVATARS.filter(a => a.category === category.toLowerCase());

    const canContinue = selected && userName.trim().length >= 1;

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
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--purple)' }}>Step 1 of 2</p>
                    <h1 className="font-extrabold text-2xl leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--text)' }}>
                        Choose your look
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>Pick an avatar and tell us your name</p>
                </div>

                {/* Name Input */}
                <div className="px-6 mb-4">
                    <input
                        type="text"
                        placeholder="Your first name…"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                        maxLength={20}
                        className="input"
                    />
                </div>

                {/* Category Pills */}
                <div className="flex gap-2 px-6 mb-4 overflow-x-auto hide-scroll pb-1">
                    {CATEGORIES.map(cat => (
                        <motion.button
                            key={cat}
                            whileTap={{ scale: 0.93 }}
                            onClick={() => setCategory(cat)}
                            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                            style={{
                                background: category === cat ? '#7C3AED' : 'white',
                                color: category === cat ? 'white' : 'var(--text-2)',
                                border: `1.5px solid ${category === cat ? '#7C3AED' : 'var(--border)'}`,
                                boxShadow: category === cat ? '0 4px 12px rgba(124,58,237,0.3)' : 'none',
                            }}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>

                {/* Avatar Grid */}
                <div className="flex-1 overflow-y-auto px-5 pb-4 hide-scroll">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-4 gap-3"
                        >
                            {filtered.map((av, i) => (
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
                                        selected={selected === av.id}
                                        onClick={() => setSelected(av.id)}
                                        showName={true}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Continue */}
                <div className="px-5 pb-10 pt-3" style={{ background: 'white', borderTop: '1px solid var(--border)' }}>
                    <motion.button
                        whileHover={canContinue ? { scale: 1.02, y: -1 } : {}}
                        whileTap={canContinue ? { scale: 0.98 } : {}}
                        onClick={() => canContinue && onSelect({ avatarId: selected, userName: userName.trim() })}
                        disabled={!canContinue}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                        style={{
                            borderRadius: 16,
                            opacity: canContinue ? 1 : 0.4,
                            cursor: canContinue ? 'pointer' : 'not-allowed',
                            padding: '15px 24px',
                        }}
                    >
                        {canContinue ? `Continue as ${userName}` : 'Pick an avatar & enter name'}
                        {canContinue && <ChevronRight size={18} />}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
