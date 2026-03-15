// ============================================================
//  ChatBubble – Light theme, clean modern design
// ============================================================
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MiniAvatar } from './Avatar';
import { messageVariants } from '../utils/animations';

const REACTIONS = [
    { emoji: '❤️', label: 'love' },
    { emoji: '😂', label: 'haha' },
    { emoji: '😮', label: 'wow' },
    { emoji: '👍', label: 'like' },
    { emoji: '🔥', label: 'fire' },
    { emoji: '🥺', label: 'sad' },
];

function isSingleEmoji(text) {
    const trimmed = text.trim();
    return trimmed.length <= 4 && /^(\p{Emoji_Presentation}|\p{Extended_Pictographic}){1,2}$/u.test(trimmed);
}

const BUBBLE_VARIANTS = {
    modern: { user: '20px 20px 4px 20px', ai: '4px 20px 20px 20px' },
    bubbly: { user: '28px 28px 6px 28px', ai: '6px 28px 28px 28px' },
    soft: { user: '14px 14px 3px 14px', ai: '3px 14px 14px 14px' },
    classic: { user: '8px', ai: '8px' },
};

export default function ChatBubble({ message, isUser, avatarId, timestamp, bubbleStyle = 'modern', reaction, onReact }) {
    const [showReactions, setShowReactions] = useState(false);
    const [pressTimer, setPressTimer] = useState(null);
    const single = isSingleEmoji(message.text || '');

    const bv = BUBBLE_VARIANTS[bubbleStyle] || BUBBLE_VARIANTS.modern;

    const startPress = () => {
        const t = setTimeout(() => setShowReactions(true), 500);
        setPressTimer(t);
    };
    const endPress = () => { if (pressTimer) clearTimeout(pressTimer); };

    const timeStr = timestamp
        ? new Date(timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
        : '';

    return (
        <motion.div
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            className={`flex items-end gap-2 mb-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {/* Avatar */}
            <div className="flex-shrink-0 mb-0.5">
                <MiniAvatar avatarId={avatarId} size={30} />
            </div>

            <div className={`flex flex-col gap-0.5 max-w-[72%] ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Bubble */}
                <motion.div
                    className={`relative cursor-pointer select-none
            ${single ? '' : isUser ? 'bubble-user' : 'bubble-ai'}
            ${single ? '' : 'px-4 py-2.5'}`}
                    style={single ? {} : { borderRadius: isUser ? bv.user : bv.ai }}
                    onMouseDown={startPress}
                    onMouseUp={endPress}
                    onTouchStart={startPress}
                    onTouchEnd={endPress}
                    onContextMenu={(e) => { e.preventDefault(); setShowReactions(true); }}
                    whileTap={{ scale: 0.98 }}
                >
                    {single ? (
                        <motion.span
                            className="text-5xl block leading-tight py-1"
                            animate={{ scale: [1, 1.08, 1], rotate: [0, -4, 4, 0] }}
                            transition={{ duration: 0.45 }}
                        >
                            {message.text}
                        </motion.span>
                    ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    )}

                    {/* Reaction badge */}
                    {reaction && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`absolute -bottom-3 ${isUser ? '-left-1' : '-right-1'} text-base`}
                        >
                            {reaction}
                        </motion.span>
                    )}
                </motion.div>

                {/* Timestamp */}
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.3 }}
                    className="text-[10px] px-1"
                    style={{ color: 'var(--text-3)' }}
                >
                    {timeStr}
                </motion.span>

                {/* Reaction Picker */}
                <AnimatePresence>
                    {showReactions && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.75, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.75 }}
                            className={`absolute ${isUser ? 'right-0' : 'left-0'} bottom-12 z-50
                flex gap-1.5 bg-white rounded-2xl px-3 py-2 shadow-xl border`}
                            style={{ borderColor: 'var(--border)', bottom: '100%', marginBottom: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
                            onMouseLeave={() => setShowReactions(false)}
                        >
                            {REACTIONS.map((r, i) => (
                                <motion.button
                                    key={r.label}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: i * 0.04, type: 'spring', stiffness: 500 }}
                                    whileHover={{ scale: 1.4 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="text-xl leading-none"
                                    onClick={() => { onReact?.(r.emoji); setShowReactions(false); }}
                                >
                                    {r.emoji}
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
