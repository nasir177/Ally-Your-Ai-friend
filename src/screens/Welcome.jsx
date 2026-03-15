import { motion } from 'framer-motion';
import { Heart, MessageCircle, Sparkles, Music, Zap, Star } from 'lucide-react';
import { pageVariants, fadeInUp, staggerContainer } from '../utils/animations';
import { getDiceBearUrl } from '../components/Avatar';

// Sample avatars to show floating in hero
const HERO_AVATARS = [
    { style: 'adventurer', seed: 'Rahul', bg: 'b6e3f4' },
    { style: 'lorelei', seed: 'Priya', bg: 'ffd5dc' },
    { style: 'adventurer', seed: 'Dev', bg: 'c0aede' },
    { style: 'fun-emoji', seed: 'Kira', bg: 'd1f4e0' },
    { style: 'lorelei', seed: 'Sneha', bg: 'ffeacc' },
];

const FEATURES = [
    { icon: MessageCircle, color: '#7C3AED', label: 'Natural Hinglish Chat' },
    { icon: Heart, color: '#EC4899', label: 'Remembers You' },
    { icon: Music, color: '#3B82F6', label: 'Mood Playlists' },
    { icon: Sparkles, color: '#F59E0B', label: '20+ Personalities' },
];

function FloatingAvatar({ avatar, className, delay = 0 }) {
    const url = getDiceBearUrl({ ...avatar, size: 120 });
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.5, type: 'spring', stiffness: 200 }}
            className={`${className} float-${(delay * 3 + 1).toFixed(0) > 3 ? 3 : (delay * 3 + 1).toFixed(0)}`}
            style={{ position: 'absolute' }}
        >
            <div
                className="rounded-full overflow-hidden shadow-lg border-2 border-white"
                style={{
                    width: 56, height: 56,
                    background: `#${avatar.bg}`,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 0 0 3px white',
                }}
            >
                <img src={url} alt="" width={56} height={56} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
        </motion.div>
    );
}

export default function Welcome({ onStart }) {
    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#FAFAFF' }}>
            {/* Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="blob blob-1" />
                <div className="blob blob-2" />
                <div className="blob blob-3" />
            </div>

            <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-10"
            >
                {/* Hero avatar cluster */}
                <div className="relative w-48 h-48 mb-8 flex-shrink-0">
                    {/* Central glowing ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 rounded-full"
                        style={{
                            border: '2px dashed rgba(124,58,237,0.2)',
                            margin: 8,
                        }}
                    />
                    {/* Main center avatar */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                    >
                        <div
                            className="rounded-full overflow-hidden float-1"
                            style={{
                                width: 88, height: 88,
                                background: '#b6e3f4',
                                boxShadow: '0 12px 40px rgba(124,58,237,0.3), 0 0 0 5px white, 0 0 0 7px rgba(124,58,237,0.12)',
                            }}
                        >
                            <img
                                src={getDiceBearUrl({ style: 'adventurer', seed: 'AntiFriend', bg: 'b6e3f4', size: 176 })}
                                alt="AntiFriend"
                                width={88} height={88}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </motion.div>

                    {/* Orbiting avatars */}
                    <FloatingAvatar avatar={HERO_AVATARS[0]} className="" delay={0.3}
                        style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }} />
                    <FloatingAvatar avatar={HERO_AVATARS[1]} delay={0.45}
                        className="" style={{ top: '15%', right: 0 }} />
                    <FloatingAvatar avatar={HERO_AVATARS[2]} delay={0.6}
                        className="" style={{ bottom: '10%', right: 0 }} />
                    <FloatingAvatar avatar={HERO_AVATARS[3]} delay={0.75}
                        className="" style={{ bottom: 0, left: '10%' }} />
                    <FloatingAvatar avatar={HERO_AVATARS[4]} delay={0.9}
                        className="" style={{ top: '20%', left: 0 }} />

                    {/* Decorative pulse rings */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                            className="absolute rounded-full pulse-ring"
                            style={{ width: 100, height: 100, border: '2px solid rgba(124,58,237,0.2)' }}
                        />
                    </div>
                </div>

                {/* Text content */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="text-center max-w-sm w-full"
                >
                    {/* Badge */}
                    <motion.div variants={fadeInUp} className="flex justify-center mb-4">
                        <span className="chip">
                            <Sparkles size={11} />
                            Powered by Gemini AI
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.div variants={fadeInUp} className="mb-3">
                        <h1
                            className="gradient-text font-extrabold tracking-tight"
                            style={{ fontSize: 48, fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: 1.1 }}
                        >
                            Ally
                        </h1>

                        <p className="font-medium mt-1.5" style={{ color: 'var(--text-2)', fontSize: 15 }}>
                            You're never alone 💙
                        </p>
                    </motion.div>

                    {/* Description */}
                    <motion.p variants={fadeInUp} className="text-sm leading-relaxed mb-7" style={{ color: 'var(--text-2)' }}>
                        Your AI dost who chats in <strong style={{ color: 'var(--purple)' }}>Hinglish</strong>, remembers you, plays
                        games, and actually feels like a real friend.
                    </motion.p>

                    {/* Features row */}
                    <motion.div variants={fadeInUp} className="flex flex-wrap gap-2 justify-center mb-8">
                        {FEATURES.map(({ icon: Icon, color, label }) => (
                            <div
                                key={label}
                                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white border shadow-sm"
                                style={{ borderColor: `${color}22`, color: 'var(--text-2)' }}
                            >
                                <Icon size={12} color={color} />
                                {label}
                            </div>
                        ))}
                    </motion.div>

                    {/* CTA */}
                    <motion.div variants={fadeInUp}>
                        <motion.button
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onStart}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                            style={{ fontSize: 16, padding: '16px 32px', borderRadius: 20 }}
                        >
                            <Zap size={18} fill="white" />
                            Get Started
                        </motion.button>
                        <p className="text-xs mt-3" style={{ color: 'var(--text-3)' }}>
                            Free to use · No account needed
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
