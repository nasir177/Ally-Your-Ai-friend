// ============================================================
//  ChatScreen – Light theme, Lucide icons, modern layout
// ============================================================
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Palette, Gamepad2, MoreVertical, User, ArrowLeft, Music2, CheckCheck } from 'lucide-react';
import { pageVariants } from '../utils/animations';
import ChatBubble from '../components/ChatBubble';
import TypingIndicator from '../components/TypingIndicator';
// import MusicPlayer from '../components/MusicPlayer';
import ThemeSelector, { getChatBg } from '../components/ThemeSelector';
import { THEME_CONFIGS, RainEffect, SnowEffect, PetalsEffect, StarsEffect, FirefliesEffect, OceanEffect, StormEffect, GalaxyEffect, CloudsEffect, SunsetEffect } from '../components/ParticleBackground';
import { MiniAvatar } from '../components/Avatar';
import { chatWithAI } from '../services/geminiAPI';
import { saveMessage, getMessages, incrementMsgCount, getFriendshipStats, getTheme, saveTheme } from '../services/storageService';
import { detectMood } from '../utils/moodDetector';

const EMOJI_LIST = ['😊', '😄', '😂', '🥺', '😍', '🤔', '😎', '😅', '🥳', '💙', '❤️', '🔥', '✨', '🙌', '👏', '🤗', '😔', '🤣', '💪', '🎉', '👀', '🫂', '🥰', '😭'];

const GREETING = {
    cheerful: (n, a) => `Heyyyy ${n}!! 🎉 Main ${a} hoon, tera naya best friend! Kya haal hai sab? Tell me everything!`,
    calm: (n, a) => `Hey ${n}... 💙 Main ${a} hoon. Bahut khushi hui tujhse milke. I'm here for you, always. Kaise feel kar rahe ho aaj?`,
    funny: (n, a) => `ARRE ${n} bhai/behen! 😂 ${a} aa gaya/gayi! Ab tujhe bore hone ka koi chance nahi! Bol bol, kya mazak hai aaj?`,
    wise: (n, a) => `Namaste ${n} 🙏 Main ${a} hoon. Kehte hain — ek accha dost sunne ke saath saath samjhe bhi. Main dono karta hoon. Kya soch raha hai aajkal?`,
};

const AI_EXPR = {
    cheerful: { idle: 'happy', typing: 'thinking', res: 'excited' },
    calm: { idle: 'idle', typing: 'thinking', res: 'happy' },
    funny: { idle: 'idle', typing: 'thinking', res: 'idle' },
    wise: { idle: 'idle', typing: 'thinking', res: 'idle' },
};

export default function ChatScreen({ userProfile, aiProfile, onNavigate, activityPrompt, gameComment }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const [showTheme, setShowTheme] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [reactions, setReactions] = useState({});
    const [theme, setTheme] = useState(() => getTheme() || { bg: 'white', bubbleStyle: 'modern' });
    const [stats, setStats] = useState(getFriendshipStats());

    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    const { userName, avatarId } = userProfile;
    const { aiName, personality, aiAvatarId } = aiProfile;
    const expr = AI_EXPR[personality] || AI_EXPR.cheerful;

    // Activity prompt
    useEffect(() => {
        if (activityPrompt) { setInput(activityPrompt); inputRef.current?.focus(); }
    }, [activityPrompt]);

    // Inject game comment as AI message in chat
    useEffect(() => {
        if (!gameComment?.text) return;
        const aiMsg = { speaker: 'ai', text: gameComment.text, timestamp: Date.now(), fromGame: true };
        setMessages(prev => [...prev, aiMsg]);
        saveMessage(aiMsg);
    }, [gameComment]);

    // Load/init messages
    useEffect(() => {
        (async () => {
            const saved = await getMessages();
            if (saved.length === 0) {
                const greetFn = GREETING[personality] || GREETING.cheerful;
                const msg = { speaker: 'ai', text: greetFn(userName, aiName), timestamp: Date.now() };
                setMessages([msg]);
                await saveMessage(msg);
            } else {
                setMessages(saved);
            }
        })();
    }, []);

    // Auto-scroll
    useEffect(() => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }, [messages, isTyping]);

    const handleTheme = useCallback((t) => { setTheme(t); saveTheme(t); }, []);

    const sendMessage = useCallback(async () => {
        const text = input.trim();
        if (!text || isTyping) return;
        setInput('');
        setShowEmoji(false);

        const mood = detectMood(text);
        const userMsg = { speaker: 'user', text, timestamp: Date.now(), mood };
        setMessages(prev => [...prev, userMsg]);
        await saveMessage(userMsg);
        incrementMsgCount();

        setIsTyping(true);
        const typingTime = Math.max(900, Math.min(text.length * 55 + Math.random() * 600, 3000));

        const context = {
            userName, aiName, personality,
            detectedMood: mood,
            lastTopic: text.slice(0, 40),
            friendshipDays: stats.days,
            history: messages.concat(userMsg).map(m => ({ speaker: m.speaker, text: m.text })),
        };

        const [aiResp] = await Promise.all([
            chatWithAI(text, context),
            new Promise(r => setTimeout(r, typingTime)),
        ]);

        setIsTyping(false);
        const aiMsg = { speaker: 'ai', text: aiResp.message, timestamp: Date.now() };
        setMessages(prev => [...prev, aiMsg]);
        await saveMessage(aiMsg);
        incrementMsgCount();
        setStats(getFriendshipStats());
    }, [input, isTyping, messages, userName, aiName, personality, stats.days]);

    const onKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    const chatBg = getChatBg(theme.bg);
    const isDark = theme.bg === 'dusk' || theme.bg === 'night';

    // Resolve which particle effect to show based on theme
    const particleType = THEME_CONFIGS[theme.bg]?.particles;

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`flex flex-col h-full max-h-full ${chatBg}`}
            style={{ minHeight: 0, position: 'relative', overflow: 'hidden' }}
        >
            {/* Particle layer – renders behind all chat content */}
            {particleType === 'rain' && <RainEffect />}
            {particleType === 'snow' && <SnowEffect />}
            {particleType === 'petals' && <PetalsEffect />}
            {particleType === 'stars' && <StarsEffect />}
            {particleType === 'fireflies' && <FirefliesEffect />}
            {particleType === 'ocean' && <OceanEffect />}
            {particleType === 'storm' && <StormEffect />}
            {particleType === 'galaxy' && <GalaxyEffect />}
            {particleType === 'clouds' && <CloudsEffect />}
            {particleType === 'sunset' && <SunsetEffect />}
            {/* HEADER */}
            <div
                className="flex-shrink-0 px-4 pt-12 pb-3 flex items-center gap-3 border-b"
                style={{
                    background: isDark ? 'rgba(15,10,30,0.9)' : 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(16px)',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'var(--border)',
                    position: 'relative',
                    zIndex: 50,
                }}
            >
                <div className="relative">
                    <MiniAvatar avatarId={aiAvatarId} size={42} />
                    <div className="status-online absolute -bottom-0.5 -right-0.5" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: isDark ? 'white' : 'var(--text)' }}>
                        {aiName}
                    </p>
                    <p className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'var(--text-3)' }}>
                        {isTyping ? '✍️ Typing…' : `Active now · ${stats.days}d friends`}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5">
                    <button
                        onClick={() => onNavigate('profile')}
                        className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                        style={{ background: isDark ? 'rgba(255,255,255,0.08)' : undefined }}
                    >
                        <User size={17} color={isDark ? 'rgba(255,255,255,0.7)' : 'var(--text-2)'} />
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(o => !o)}
                            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                            style={{ background: isDark ? 'rgba(255,255,255,0.08)' : undefined }}
                        >
                            <MoreVertical size={17} color={isDark ? 'rgba(255,255,255,0.7)' : 'var(--text-2)'} />
                        </button>

                        {/* Dropdown */}
                        <AnimatePresence>
                            {showMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                    className="absolute top-11 right-0 bg-white rounded-2xl overflow-hidden shadow-xl border min-w-[160px]"
                                    style={{ borderColor: 'var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 9999 }}
                                >
                                    {[
                                        { icon: Gamepad2, label: 'Activities', nav: 'activities' },
                                        { icon: Music2, label: 'Memory Lane', nav: 'memory' },
                                        { icon: User, label: 'Settings', nav: 'settings' },
                                    ].map(item => (
                                        <button
                                            key={item.nav}
                                            onClick={() => { setShowMenu(false); onNavigate(item.nav); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                                            style={{ color: 'var(--text)' }}
                                        >
                                            <item.icon size={15} color="var(--purple)" />
                                            {item.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* MESSAGES */}
            <div
                className="flex-1 overflow-y-auto px-4 py-4 hide-scroll"
                onClick={() => { setShowMenu(false); setShowEmoji(false); }}
            >
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <ChatBubble
                            key={i}
                            message={msg}
                            isUser={msg.speaker === 'user'}
                            avatarId={msg.speaker === 'user' ? avatarId : aiAvatarId}
                            timestamp={msg.timestamp}
                            bubbleStyle={theme.bubbleStyle}
                            reaction={reactions[i]}
                            onReact={r => setReactions(prev => ({ ...prev, [i]: r }))}
                        />
                    ))}
                    {isTyping && <TypingIndicator key="typing" avatarId={aiAvatarId} />}
                </AnimatePresence>
                <div ref={bottomRef} />
            </div>

            {/* EMOJI PANEL */}
            <AnimatePresence>
                {showEmoji && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex-shrink-0 border-t px-4 py-3"
                        style={{ background: 'white', borderColor: 'var(--border)' }}
                    >
                        <div className="flex flex-wrap gap-2.5">
                            {EMOJI_LIST.map(e => (
                                <motion.button
                                    key={e}
                                    whileHover={{ scale: 1.3 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="text-2xl leading-none"
                                    onClick={() => setInput(p => p + e)}
                                >
                                    {e}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* INPUT BAR */}
            <div
                className="flex-shrink-0 border-t"
                style={{
                    background: isDark ? 'rgba(15,10,30,0.95)' : 'white',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'var(--border)',
                    paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
                }}
            >
                {/* Toolbar */}
                <div className="flex gap-1 px-3 pt-2 pb-1">
                    {[
                        { icon: Smile, action: () => setShowEmoji(o => !o), active: showEmoji },
                        { icon: Palette, action: () => setShowTheme(o => !o), active: false },
                        { icon: Gamepad2, action: () => onNavigate('activities'), active: false },
                    ].map(({ icon: Icon, action, active }, i) => (
                        <motion.button
                            key={i}
                            whileTap={{ scale: 0.9 }}
                            onClick={action}
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                            style={{
                                background: active ? 'var(--purple-pale)' : 'transparent',
                                color: active ? 'var(--purple)' : (isDark ? 'rgba(255,255,255,0.5)' : 'var(--text-3)'),
                            }}
                        >
                            <Icon size={18} />
                        </motion.button>
                    ))}
                </div>

                {/* Input row */}
                <div className="flex items-end gap-2 px-3 pb-3">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder={`Message ${aiName}…`}
                        rows={1}
                        className="flex-1 resize-none text-sm outline-none font-body hide-scroll rounded-2xl px-4 py-3 transition-all"
                        style={{
                            background: isDark ? 'rgba(255,255,255,0.08)' : 'var(--bg-2)',
                            border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'var(--border)'}`,
                            color: isDark ? 'white' : 'var(--text)',
                            minHeight: 46, maxHeight: 96,
                            fontFamily: 'Inter, sans-serif',
                        }}
                        onInput={e => {
                            e.target.style.height = 'auto';
                            e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                        }}
                    />
                    <motion.button
                        whileHover={input.trim() && !isTyping ? { scale: 1.08 } : {}}
                        whileTap={input.trim() && !isTyping ? { scale: 0.9 } : {}}
                        onClick={sendMessage}
                        disabled={!input.trim() || isTyping}
                        className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
                        style={{
                            background: input.trim() && !isTyping ? 'linear-gradient(135deg, #7C3AED, #EC4899)' : (isDark ? 'rgba(255,255,255,0.08)' : 'var(--bg-3)'),
                            boxShadow: input.trim() && !isTyping ? '0 4px 16px rgba(124,58,237,0.35)' : 'none',
                            cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                        }}
                    >
                        <Send size={18} color={input.trim() && !isTyping ? 'white' : (isDark ? 'rgba(255,255,255,0.3)' : 'var(--text-3)')} />
                    </motion.button>
                </div>
            </div>

            {/* Floating Music Player
            <MusicPlayer /> */}

            {/* Theme Selector */}
            <ThemeSelector
                open={showTheme}
                onClose={() => setShowTheme(false)}
                theme={theme}
                onThemeChange={handleTheme}
            />
        </motion.div>
    );
}
