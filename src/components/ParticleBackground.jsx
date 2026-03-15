// ============================================================
//  Modern ParticleBackground with Mobile Support
// ============================================================
import { useEffect } from 'react';

import './particle-animations-modern.css';



const THEME_CONFIGS = {
    // Light themes
    white: { bg: 'bg-slate-50', dark: false },
    lavender: { bg: 'bg-violet-50', dark: false },
    peach: { bg: 'bg-orange-50', dark: false },
    mint: { bg: 'bg-emerald-50', dark: false },
    sky: { bg: 'bg-sky-100', dark: false, particles: 'clouds' },
    cherry: { bg: 'bg-pink-100', dark: false, particles: 'petals' },
    sakura: { bg: 'bg-rose-50', dark: false, particles: 'petals' },

    // Dark themes
    dusk: { bg: 'bg-indigo-950', dark: true },
    night: { bg: 'bg-gray-950', dark: true, particles: 'stars' },
    rain: { bg: 'bg-slate-700', dark: true, particles: 'rain' },
    storm: { bg: 'bg-gray-800', dark: true, particles: 'storm' },
    arabian: { bg: 'bg-indigo-950', dark: true, particles: 'stars' },
    galaxy: { bg: 'bg-purple-950', dark: true, particles: 'galaxy' },
    sunset: { bg: 'bg-orange-900', dark: true, particles: 'sunset' },
    snow: { bg: 'bg-sky-100', dark: false, particles: 'snow' },
    fireflies: { bg: 'bg-gray-900', dark: true, particles: 'fireflies' },
    ocean: { bg: 'bg-blue-600', dark: true, particles: 'ocean' },
};

export default function ParticleBackground({ theme = 'white', children }) {
    const config = THEME_CONFIGS[theme] || THEME_CONFIGS.white;

    return (
        <div className={`relative min-h-screen w-full overflow-hidden ${config.bg}`}>
            {/* Base depth overlay */}
            <div className="absolute inset-0 bg-black/5 pointer-events-none z-0" />

            {/* Particle Effects */}
            {config.particles === 'rain' && <RainEffect />}
            {config.particles === 'snow' && <SnowEffect />}
            {config.particles === 'petals' && <PetalsEffect />}
            {config.particles === 'stars' && <StarsEffect />}
            {config.particles === 'fireflies' && <FirefliesEffect />}
            {config.particles === 'ocean' && <OceanEffect />}
            {config.particles === 'storm' && <StormEffect />}
            {config.particles === 'galaxy' && <GalaxyEffect />}
            {config.particles === 'clouds' && <CloudsEffect />}
            {config.particles === 'sunset' && <SunsetEffect />}

            {/* Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
                {children}
            </div>
        </div>
    );
}

// Rain Effect
export function RainEffect() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 80 }).map((_, i) => (
                <div
                    key={i}
                    className="rain-drop"
                    style={{
                        left: `${Math.random() * 100}%`,
                        height: `${20 + Math.random() * 40}px`,
                        animationDuration: `${0.5 + Math.random() * 0.5}s`,
                        animationDelay: `${Math.random() * 2}s`,
                        opacity: Math.random() * 0.5 + 0.3
                    }}
                />
            ))}
        </div>
    );
}

// Snow Effect
export function SnowEffect() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
                <div
                    key={i}
                    className="snowflake"
                    style={{
                        left: `${Math.random() * 100}%`,
                        fontSize: `${10 + Math.random() * 10}px`,
                        animationDuration: `${5 + Math.random() * 10}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        '--sway': `${(Math.random() - 0.5) * 100}px`
                    }}
                >❄</div>
            ))}
        </div>
    );
}

// Cherry Blossom Petals
export function PetalsEffect() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => {
                const size = 6 + Math.random() * 12;
                const hue = 340 + Math.random() * 30;
                return (
                    <div
                        key={i}
                        className="petal"
                        style={{
                            width: size,
                            height: size * 0.6,
                            left: `${Math.random() * 100}%`,
                            background: `hsl(${hue}, 100%, ${80 + Math.random() * 10}%)`,
                            animationDuration: `${6 + Math.random() * 8}s`,
                            animationDelay: `${Math.random() * 10}s`,
                            '--sway': `${(Math.random() - 0.5) * 200}px`,
                            borderRadius: '50% 0 50% 0',
                            transform: `rotate(${Math.random() * 360}deg)`
                        }}
                    />
                );
            })}
        </div>
    );
}

// Stars Effect
export function StarsEffect() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 150 }).map((_, i) => {
                const size = 1 + Math.random() * 2.5;
                return (
                    <div
                        key={i}
                        className="star"
                        style={{
                            width: size,
                            height: size,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                            animationDelay: `${Math.random() * 4}s`,
                            opacity: 0.6 + Math.random() * 0.4
                        }}
                    />
                );
            })}
        </div>
    );
}

// Fireflies Effect
export function FirefliesEffect() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 25 }).map((_, i) => {
                const hue = 50 + Math.random() * 30;
                const size = 3 + Math.random() * 5;
                return (
                    <div
                        key={i}
                        className="firefly"
                        style={{
                            width: size,
                            height: size,
                            left: `${Math.random() * 100}%`,
                            top: `${20 + Math.random() * 60}%`,
                            background: `hsl(${hue}, 100%, 60%)`,
                            boxShadow: `0 0 ${size * 3}px hsl(${hue}, 100%, 50%)`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                            animationDelay: `${Math.random() * 5}s`,
                            '--glow-duration': `${1 + Math.random() * 2}s`
                        }}
                    />
                );
            })}
        </div>
    );
}

// Ocean Effect (Rain + Bubbles)
export function OceanEffect() {
    return (
        <>
            <RainEffect />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 15 }).map((_, i) => {
                    const size = 10 + Math.random() * 30;
                    return (
                        <div
                            key={i}
                            className="bubble"
                            style={{
                                width: size,
                                height: size,
                                left: `${Math.random() * 100}%`,
                                animationDuration: `${4 + Math.random() * 6}s`,
                                animationDelay: `${Math.random() * 6}s`,
                                '--drift': `${(Math.random() - 0.5) * 100}px`
                            }}
                        />
                    );
                })}
            </div>
        </>
    );
}

// Storm Effect (Heavy Rain + Lightning)
export function StormEffect() {
    return (
        <>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 120 }).map((_, i) => (
                    <div
                        key={i}
                        className="rain-drop"
                        style={{
                            left: `${Math.random() * 100}%`,
                            height: `${30 + Math.random() * 60}px`,
                            animationDuration: `${0.3 + Math.random() * 0.4}s`,
                            animationDelay: `${Math.random() * 2}s`,
                            opacity: Math.random() * 0.6 + 0.3,
                            width: '3px'
                        }}
                    />
                ))}
            </div>
            <div className="lightning" />
        </>
    );
}

// Galaxy Effect (Stars + Nebula)
export function GalaxyEffect() {
    return (
        <>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="nebula" />
                {Array.from({ length: 200 }).map((_, i) => {
                    const size = 1 + Math.random() * 3;
                    return (
                        <div
                            key={i}
                            className="star"
                            style={{
                                width: size,
                                height: size,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDuration: `${1 + Math.random() * 4}s`,
                                animationDelay: `${Math.random() * 3}s`,
                                opacity: 0.4 + Math.random() * 0.6
                            }}
                        />
                    );
                })}
            </div>
        </>
    );
}

// Clouds Effect
export function CloudsEffect() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="cloud"
                    style={{
                        top: `${10 + Math.random() * 60}%`,
                        animationDuration: `${20 + Math.random() * 20}s`,
                        animationDelay: `${Math.random() * 10}s`,
                        opacity: 0.3 + Math.random() * 0.3
                    }}
                />
            ))}
        </div>
    );
}

// Sunset Effect (Particles + Gradient Glow)
export function SunsetEffect() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="sunset-glow" />
            {Array.from({ length: 25 }).map((_, i) => {
                const size = 2 + Math.random() * 6;
                const colors = ['rgba(238,119,82,0.5)', 'rgba(231,60,126,0.4)', 'rgba(255,200,150,0.3)'];
                return (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            width: size,
                            height: size,
                            left: `${Math.random() * 100}%`,
                            background: colors[Math.floor(Math.random() * colors.length)],
                            animationDuration: `${8 + Math.random() * 10}s`,
                            animationDelay: `${Math.random() * 12}s`,
                            '--drift': `${(Math.random() - 0.5) * 120}px`
                        }}
                    />
                );
            })}
        </div>
    );
}

export { THEME_CONFIGS };