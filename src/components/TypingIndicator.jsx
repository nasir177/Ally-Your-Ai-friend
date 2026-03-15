// ============================================================
//  TypingIndicator – Light theme
// ============================================================
import { motion } from 'framer-motion';
import { MiniAvatar } from './Avatar';
import { messageVariants } from '../utils/animations';

export default function TypingIndicator({ avatarId }) {
    return (
        <motion.div
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex items-end gap-2 mb-2"
        >
            <div className="flex-shrink-0 mb-0.5">
                <MiniAvatar avatarId={avatarId} size={30} />
            </div>
            <div
                className="bubble-ai px-4 py-3 flex items-center gap-1.5"
                style={{ borderRadius: '4px 20px 20px 20px' }}
            >
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        className="typing-dot"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                    />
                ))}
            </div>
        </motion.div>
    );
}
