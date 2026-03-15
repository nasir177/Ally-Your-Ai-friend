// ============================================================
//  Avatar Component – DiceBear illustrated avatars
// ============================================================
import { motion } from 'framer-motion';

export const AVATARS = [
    // Boys - adventurer style
    { id: 'b1', label: 'Rahul', category: 'boy', style: 'lorelei', seed: 'Rahul', bg: 'b6e3f4' },
    { id: 'b2', label: 'Arjun', category: 'boy', style: 'lorelei', seed: 'Arjun', bg: 'c0aede' },
    { id: 'b3', label: 'Dev', category: 'boy', style: 'lorelei', seed: 'Dev', bg: 'ffd5dc' },
    { id: 'b4', label: 'Kabir', category: 'boy', style: 'lorelei', seed: 'Kabir', bg: 'd1f4e0' },
    { id: 'b5', label: 'Rohan', category: 'boy', style: 'lorelei', seed: 'Rohan', bg: 'ffeacc' },
    // Girls - lorelei style
    { id: 'g1', label: 'Priya', category: 'girl', style: 'adventurer', seed: 'Priya', bg: 'ffd5dc' },
    { id: 'g2', label: 'Sneha', category: 'girl', style: 'adventurer', seed: 'Sneha', bg: 'c0aede' },
    { id: 'g3', label: 'Ananya', category: 'girl', style: 'adventurer', seed: 'Ananya', bg: 'b6e3f4' },
    { id: 'g4', label: 'Riya', category: 'girl', style: 'adventurer', seed: 'Riya', bg: 'd1f4e0' },
    { id: 'g5', label: 'Aditi', category: 'girl', style: 'adventurer', seed: 'Aditi', bg: 'ffeacc' },
    // Neutral - notionists style
    { id: 'n1', label: 'Aarav', category: 'neutral', style: 'notionists', seed: 'Aarav', bg: 'b6e3f4' },
    { id: 'n2', label: 'Sky', category: 'neutral', style: 'notionists', seed: 'Sky', bg: 'ffd5dc' },
    { id: 'n3', label: 'River', category: 'neutral', style: 'notionists', seed: 'River', bg: 'c0aede' },
    { id: 'n4', label: 'Alex', category: 'neutral', style: 'notionists', seed: 'Alex', bg: 'd1f4e0' },
    // Fantasy - fun-emoji style
    { id: 'f1', label: 'Kira', category: 'fantasy', style: 'fun-emoji', seed: 'Kira', bg: 'ffd5dc' },
    { id: 'f2', label: 'Zephyr', category: 'fantasy', style: 'fun-emoji', seed: 'Zephyr', bg: 'b6e3f4' },
    { id: 'f3', label: 'Soleil', category: 'fantasy', style: 'fun-emoji', seed: 'Soleil', bg: 'ffeacc' },
    { id: 'f4', label: 'Nyx', category: 'fantasy', style: 'fun-emoji', seed: 'Nyx', bg: 'c0aede' },
    { id: 'f5', label: 'Aether', category: 'fantasy', style: 'fun-emoji', seed: 'Aether', bg: 'd1f4e0' },
    { id: 'f6', label: 'Orion', category: 'fantasy', style: 'bottts', seed: 'Orion', bg: 'b6e3f4' },
];

function getDiceBearUrl({ style, seed, bg, size = 128 }) {
    return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${bg}&size=${size}`;
}

export default function Avatar({ avatarId, size = 64, selected = false, onClick, showName = false, className = '' }) {
    const data = AVATARS.find(a => a.id === avatarId) || AVATARS[0];
    const url = getDiceBearUrl({ ...data, size: size * 2 }); // 2x for sharpness

    return (
        <motion.div
            className={`inline-flex flex-col items-center gap-1.5 ${className}`}
            whileHover={onClick ? { scale: 1.06 } : {}}
            whileTap={onClick ? { scale: 0.94 } : {}}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <div
                className={`relative rounded-full overflow-hidden flex-shrink-0 transition-all duration-200
          ${selected ? 'avatar-selected ring-2 ring-purple-500 ring-offset-2' : ''}`}
                style={{
                    width: size, height: size,
                    background: `#${data.bg}`,
                    boxShadow: selected
                        ? '0 0 0 3px #7C3AED, 0 8px 24px rgba(124,58,237,0.3)'
                        : '0 4px 12px rgba(0,0,0,0.1)',
                }}
            >
                <img
                    src={url}
                    alt={data.label}
                    width={size}
                    height={size}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {selected && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute bottom-0 right-0 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center"
                        style={{ boxShadow: '0 2px 6px rgba(124,58,237,0.5)' }}
                    >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </motion.div>
                )}
            </div>
            {showName && (
                <span className="text-xs font-medium text-center leading-tight" style={{ color: 'var(--text-2)', maxWidth: size + 8 }}>
                    {data.label}
                </span>
            )}
        </motion.div>
    );
}

// Mini avatar used in chat bubbles and header
export function MiniAvatar({ avatarId, size = 36, className = '' }) {
    const data = AVATARS.find(a => a.id === avatarId) || AVATARS[0];
    const url = getDiceBearUrl({ ...data, size: size * 2 });
    return (
        <div
            className={`rounded-full overflow-hidden flex-shrink-0 ${className}`}
            style={{
                width: size, height: size,
                background: `#${data.bg}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
        >
            <img src={url} alt={data.label} width={size} height={size} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
    );
}

export { getDiceBearUrl };
