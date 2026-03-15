// ============================================================
//  MusicPlayer – Light theme floating player
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, X, SkipBack, SkipForward, Play, Pause, Volume2, ChevronUp } from 'lucide-react';
import { slideUp } from '../utils/animations';

const PLAYLISTS = [
    { id: 'chill', label: 'Chill', color: '#7C3AED', tracks: ['Lofi Study', 'Calm Beats', 'Night Rain', 'Coffee Shop'] },
    { id: 'happy', label: 'Happy', color: '#F59E0B', tracks: ['Upbeat Day', 'Sunshine', 'Good Vibes', 'Jump Around'] },
    { id: 'peace', label: 'Peace', color: '#10B981', tracks: ['Nature Walk', 'Forest Rain', 'Ocean Waves', 'Birdsong'] },
    { id: 'focus', label: 'Focus', color: '#3B82F6', tracks: ['Deep Work', 'Flow State', 'Study Time', 'Zen Mode'] },
    { id: 'night', label: 'Night', color: '#8B5CF6', tracks: ['Soft Guitar', 'Midnight', 'Under Stars', 'Late Night'] },
];

function Visualizer({ playing, color }) {
    return (
        <div className="flex items-end gap-0.5 h-5">
            {[8, 14, 11, 18, 9, 16, 12, 20, 7, 15].map((_, i) => (
                <div
                    key={i}
                    className="vis-bar"
                    style={{
                        background: `linear-gradient(to top, ${color}, ${color}88)`,
                        animationDelay: `${i * 0.07}s`,
                        animationPlayState: playing ? 'running' : 'paused',
                    }}
                />
            ))}
        </div>
    );
}

export default function MusicPlayer() {
    const [open, setOpen] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [plIdx, setPlIdx] = useState(0);
    const [trackIdx, setTrackIdx] = useState(0);
    const [volume, setVolume] = useState(60);

    const pl = PLAYLISTS[plIdx];

    return (
        <>
            {/* FAB */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setOpen(o => !o)}
                className="fixed bottom-24 left-4 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border"
                style={{
                    background: playing ? pl.color : 'white',
                    borderColor: playing ? pl.color : 'var(--border)',
                    boxShadow: playing ? `0 6px 20px ${pl.color}55` : '0 4px 16px rgba(0,0,0,0.1)',
                }}
                title="Music Player"
            >
                <Music size={20} color={playing ? 'white' : pl.color} />
            </motion.button>

            {/* Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        variants={slideUp}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="fixed bottom-40 left-4 z-50 w-72 bg-white rounded-2xl shadow-xl border overflow-hidden"
                        style={{ borderColor: 'var(--border)', boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}
                    >
                        {/* Header */}
                        <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
                            <div className="flex items-center gap-2">
                                <Music size={16} color="var(--purple)" />
                                <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Listening Together</span>
                            </div>
                            <button onClick={() => setOpen(false)}>
                                <X size={16} color="var(--text-3)" />
                            </button>
                        </div>

                        {/* Playlist tabs */}
                        <div className="flex gap-1.5 p-3 overflow-x-auto hide-scroll">
                            {PLAYLISTS.map((p, i) => (
                                <button
                                    key={p.id}
                                    onClick={() => { setPlIdx(i); setTrackIdx(0); }}
                                    className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                                    style={{
                                        background: plIdx === i ? p.color : 'var(--bg-2)',
                                        color: plIdx === i ? 'white' : 'var(--text-2)',
                                    }}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        {/* Track info */}
                        <div className="px-4 pb-3">
                            <div
                                className="rounded-xl p-3 mb-3"
                                style={{ background: `${pl.color}12` }}
                            >
                                <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>Now Playing</p>
                                <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{pl.tracks[trackIdx]}</p>
                                <div className="mt-2">
                                    <Visualizer playing={playing} color={pl.color} />
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-center gap-5 mb-3">
                                <button onClick={() => setTrackIdx(i => (i - 1 + pl.tracks.length) % pl.tracks.length)}>
                                    <SkipBack size={18} color="var(--text-2)" />
                                </button>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setPlaying(p => !p)}
                                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                                    style={{ background: pl.color }}
                                >
                                    {playing
                                        ? <Pause size={18} color="white" />
                                        : <Play size={18} color="white" fill="white" />}
                                </motion.button>
                                <button onClick={() => setTrackIdx(i => (i + 1) % pl.tracks.length)}>
                                    <SkipForward size={18} color="var(--text-2)" />
                                </button>
                            </div>

                            {/* Volume */}
                            <div className="flex items-center gap-2">
                                <Volume2 size={14} color="var(--text-3)" />
                                <input
                                    type="range" min="0" max="100"
                                    value={volume}
                                    onChange={e => setVolume(+e.target.value)}
                                    className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                                    style={{ accentColor: pl.color }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
