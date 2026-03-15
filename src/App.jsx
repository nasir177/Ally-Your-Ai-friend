// ============================================================
//  App.jsx – Chat-only layout (Game section commented out)
//  Desktop/Tablet/Mobile: full-screen chat
// ============================================================
import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import Welcome from './screens/Welcome';
import AvatarSelection from './screens/AvatarSelection';
import FriendSelection from './screens/FriendSelection';
import ChatScreen from './screens/ChatScreen';
// import GameScreen from './screens/GameScreen';   // 🎮 GAME – commented out
import { Settings, MemoryLane, FriendProfile, Activities } from './screens/SecondaryScreens';

import {
    saveProfile, getProfile,
    saveAIConfig, getAIConfig,
    saveMessage, updateStreak, addCoins, incrementMsgCount,
} from './services/storageService';

function getInitialScreen(profile, aiConfig) {
    if (profile && aiConfig) return 'chat';
    if (profile) return 'friendSelection';
    return 'welcome';
}

export default function App() {
    const savedProfile = getProfile();
    const savedAI = getAIConfig();

    const [screen, setScreen] = useState(() => getInitialScreen(savedProfile, savedAI));
    const [userProfile, setUserProfile] = useState(savedProfile);
    const [aiProfile, setAIProfile] = useState(savedAI);
    const [activityPrompt, setActivityPrompt] = useState(null);

    // ── GAME state (commented out) ──────────────────────────────────────────
    // const [mobileTab, setMobileTab] = useState('chat');  // 'game' | 'chat'
    // const [gameComment, setGameComment] = useState(null);
    // ────────────────────────────────────────────────────────────────────────

    // Update streak on load
    useEffect(() => { updateStreak(); }, []);

    const navigate = useCallback((to) => setScreen(to), []);

    const handleAvatarSelect = useCallback(({ avatarId, userName }) => {
        const profile = { avatarId, userName, friendshipStart: Date.now() };
        saveProfile(profile);
        setUserProfile(profile);
        setScreen('friendSelection');
    }, []);

    const handleFriendSelect = useCallback(({ personality, aiName, aiAvatarId }) => {
        const config = { personality, aiName, aiAvatarId };
        saveAIConfig(config);
        setAIProfile(config);
        setScreen('chat');
    }, []);

    const handleSendActivity = useCallback((prompt) => {
        setActivityPrompt(prompt);
        setScreen('chat');
    }, []);

    const handleReset = useCallback(() => {
        setUserProfile(null);
        setAIProfile(null);
        setActivityPrompt(null);
        setScreen('welcome');
    }, []);

    useEffect(() => {
        if (activityPrompt && screen === 'chat') {
            const t = setTimeout(() => setActivityPrompt(null), 200);
            return () => clearTimeout(t);
        }
    }, [activityPrompt, screen]);

    // ── GAME comment handler (commented out) ────────────────────────────────
    // const handleGameComment = useCallback((msg) => {
    //     if (!msg) return;
    //     setGameComment({ text: msg, id: Date.now() });
    //     setTimeout(() => setGameComment(null), 8000);
    // }, []);
    //
    // useEffect(() => {
    //     // Don't auto-switch – just show bubble overlay
    // }, [gameComment]);
    // ────────────────────────────────────────────────────────────────────────

    // Only show full chat when in chat mode
    const isMainChat = screen === 'chat' && userProfile && aiProfile;

    // Pre-chat screens – simple centered max-width layout
    if (!isMainChat) {
        return (
            <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', position: 'relative' }}>
                <AnimatePresence mode="wait">
                    {screen === 'welcome' && (
                        <Welcome key="welcome" onStart={() => setScreen('avatarSelection')} />
                    )}
                    {screen === 'avatarSelection' && (
                        <AvatarSelection key="avatarSelection" onSelect={handleAvatarSelect} />
                    )}
                    {screen === 'friendSelection' && (
                        <FriendSelection
                            key="friendSelection"
                            userName={userProfile?.userName}
                            onSelect={handleFriendSelect}
                        />
                    )}
                    {screen === 'settings' && userProfile && aiProfile && (
                        <Settings
                            key="settings"
                            userProfile={userProfile}
                            aiProfile={aiProfile}
                            onBack={() => setScreen('chat')}
                            onReset={handleReset}
                        />
                    )}
                    {screen === 'memory' && (
                        <MemoryLane key="memory" onBack={() => setScreen('chat')} />
                    )}
                    {screen === 'profile' && aiProfile && (
                        <FriendProfile
                            key="profile"
                            aiProfile={aiProfile}
                            onBack={() => setScreen('chat')}
                        />
                    )}
                    {screen === 'activities' && aiProfile && (
                        <Activities
                            key="activities"
                            aiProfile={aiProfile}
                            onBack={() => setScreen('chat')}
                            onSendActivity={handleSendActivity}
                        />
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // ─── MAIN CHAT (full-screen) ───────────────────────────────────────────
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', maxWidth: '100%', background: '#f8f7ff' }}>
            <ChatScreen
                key="chat"
                userProfile={userProfile}
                aiProfile={aiProfile}
                onNavigate={navigate}
                activityPrompt={activityPrompt}
                gameComment={null}  // no game comments when game is off
            />

            {/* ── GAME SECTION (commented out) ──────────────────────────────────
            
            <div className="split-layout" style={{ flex: 1, overflow: 'hidden' }}>

                // GAME PANEL – left 40% on desktop
                <div className="game-panel">
                    <GameScreen onGameComment={handleGameComment} />
                </div>

                // CHAT PANEL – right 60% on desktop
                <div className="chat-panel">
                    <ChatScreen
                        key="chat"
                        userProfile={userProfile}
                        aiProfile={aiProfile}
                        onNavigate={navigate}
                        activityPrompt={activityPrompt}
                        gameComment={gameComment}
                    />
                </div>
            </div>

            // Mobile Bottom Tabs
            <div className="mobile-tabs">
                <button
                    className={`tab-btn ${mobileTab === 'game' ? 'active' : ''}`}
                    onClick={() => setMobileTab('game')}>
                    🎮 Games
                </button>
                <button
                    className={`tab-btn ${mobileTab === 'chat' ? 'active' : ''}`}
                    onClick={() => setMobileTab('chat')}>
                    💬 Chat
                    {gameComment && <span className="tab-badge">●</span>}
                </button>
            </div>

            // Mobile: only show active panel
            <div className="mobile-content">
                <div className={`mobile-panel ${mobileTab === 'game' ? 'visible' : 'hidden'}`}>
                    <GameScreen onGameComment={(msg) => {
                        handleGameComment(msg);
                    }} />
                </div>
                <div className={`mobile-panel ${mobileTab === 'chat' ? 'visible' : 'hidden'}`}>
                    <ChatScreen
                        key="chat-mobile"
                        userProfile={userProfile}
                        aiProfile={aiProfile}
                        onNavigate={navigate}
                        activityPrompt={activityPrompt}
                        gameComment={gameComment}
                    />
                </div>

                // Mobile: game comment float bubble – shows when in game tab
                <AnimatePresence>
                    {gameComment && mobileTab === 'game' && (
                        <motion.div
                            key={gameComment.id}
                            initial={{ opacity: 0, y: 20, scale: 0.85 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            style={{
                                position: 'fixed',
                                bottom: 80,
                                right: 16,
                                maxWidth: 220,
                                background: 'white',
                                borderRadius: '18px 18px 4px 18px',
                                padding: '10px 14px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                                border: '1.5px solid var(--border)',
                                fontSize: 13,
                                color: 'var(--text)',
                                zIndex: 100,
                                lineHeight: 1.4,
                                pointerEvents: 'none',
                            }}>
                            {gameComment.text}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            ── END GAME SECTION ─────────────────────────────────────────────── */}
        </div>
    );
}
