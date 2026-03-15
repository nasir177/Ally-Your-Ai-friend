// ============================================================
//  Full-Body Avatar Customization System
//  SVG-based customizable 2D characters
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Check, ChevronLeft, ChevronRight } from 'lucide-react';

// Avatar Configuration
const AVATAR_OPTIONS = {
    skinTone: [
        { id: 'light', name: 'Light', color: '#fdd5b8' },
        { id: 'medium', name: 'Medium', color: '#d4a574' },
        { id: 'tan', name: 'Tan', color: '#c68642' },
        { id: 'dark', name: 'Dark', color: '#8d5524' },
        { id: 'deep', name: 'Deep', color: '#5c3317' }
    ],

    body: [
        { id: 'slim', name: 'Slim', width: 60, height: 100 },
        { id: 'average', name: 'Average', width: 70, height: 100 },
        { id: 'athletic', name: 'Athletic', width: 75, height: 105 },
        { id: 'curvy', name: 'Curvy', width: 80, height: 100 }
    ],

    hair: [
        { id: 'short', name: 'Short', path: 'M50,20 Q40,10 30,20 L30,35 Q40,40 50,35 Q60,40 70,35 L70,20 Q60,10 50,20' },
        { id: 'long', name: 'Long', path: 'M50,20 Q35,15 25,25 L20,80 Q40,85 50,80 Q60,85 80,80 L75,25 Q65,15 50,20' },
        { id: 'curly', name: 'Curly', path: 'M50,20 Q35,10 30,25 C25,30 25,35 30,40 L30,45 Q40,50 50,45 Q60,50 70,45 L70,40 C75,35 75,30 70,25 Q65,10 50,20' },
        { id: 'bun', name: 'Bun', path: 'M50,15 Q40,10 35,18 L35,25 Q45,30 50,25 Q55,30 65,25 L65,18 Q60,10 50,15 M50,10 C45,10 42,12 42,15 C42,18 45,20 50,20 C55,20 58,18 58,15 C58,12 55,10 50,10' },
        { id: 'ponytail', name: 'Ponytail', path: 'M50,20 Q40,15 35,22 L35,30 Q45,35 50,30 Q55,35 65,30 L65,22 Q60,15 50,20 M70,25 Q75,30 78,40 Q76,50 70,55' },
        { id: 'buzzcut', name: 'Buzz Cut', path: 'M50,22 Q40,18 33,24 L33,28 Q40,32 50,30 Q60,32 67,28 L67,24 Q60,18 50,22' }
    ],

    hairColor: [
        { id: 'black', name: 'Black', color: '#2c1810' },
        { id: 'brown', name: 'Brown', color: '#6f4e37' },
        { id: 'blonde', name: 'Blonde', color: '#f4d03f' },
        { id: 'red', name: 'Red', color: '#c14a09' },
        { id: 'gray', name: 'Gray', color: '#9ca3af' },
        { id: 'blue', name: 'Blue', color: '#3b82f6' },
        { id: 'pink', name: 'Pink', color: '#ec4899' },
        { id: 'purple', name: 'Purple', color: '#8b5cf6' }
    ],

    clothes: [
        { id: 'tshirt', name: 'T-Shirt', type: 'casual' },
        { id: 'hoodie', name: 'Hoodie', type: 'casual' },
        { id: 'dress', name: 'Dress', type: 'formal' },
        { id: 'suit', name: 'Suit', type: 'formal' },
        { id: 'sweater', name: 'Sweater', type: 'casual' },
        { id: 'tank', name: 'Tank Top', type: 'sporty' }
    ],

    clothesColor: [
        { id: 'red', color: '#ef4444' },
        { id: 'blue', color: '#3b82f6' },
        { id: 'green', color: '#10b981' },
        { id: 'purple', color: '#8b5cf6' },
        { id: 'pink', color: '#ec4899' },
        { id: 'black', color: '#1f2937' },
        { id: 'white', color: '#f3f4f6' },
        { id: 'yellow', color: '#f59e0b' }
    ],

    accessories: [
        { id: 'none', name: 'None' },
        { id: 'glasses', name: 'Glasses', svg: 'M35,45 L42,45 M58,45 L65,45 M42,43 Q45,40 50,40 Q55,40 58,43' },
        { id: 'sunglasses', name: 'Sunglasses', svg: 'M35,42 L45,42 L45,48 L35,48 Z M55,42 L65,42 L65,48 L55,48 Z M45,45 L55,45' },
        { id: 'hat', name: 'Cap', svg: 'M30,25 L70,25 L68,20 L32,20 Z M35,20 L65,20 Q70,18 70,15 L30,15 Q30,18 35,20' },
        { id: 'scarf', name: 'Scarf', svg: 'M30,65 Q50,70 70,65 L70,75 Q50,80 30,75 Z' },
        { id: 'earrings', name: 'Earrings', svg: 'M28,50 C28,52 26,54 24,54 C22,54 20,52 20,50 C20,48 22,46 24,46 C26,46 28,48 28,50 M80,50 C80,52 78,54 76,54 C74,54 72,52 72,50 C72,48 74,46 76,46 C78,46 80,48 80,50' }
    ],

    expression: [
        { id: 'happy', name: 'Happy', eyes: 'M40,48 Q42,46 44,48 M56,48 Q58,46 60,48', mouth: 'M43,58 Q50,62 57,58' },
        { id: 'smile', name: 'Smile', eyes: 'M40,46 C40,48 42,48 42,46 M58,46 C58,48 60,48 60,46', mouth: 'M43,58 Q50,61 57,58' },
        { id: 'neutral', name: 'Neutral', eyes: 'M40,46 C40,48 42,48 42,46 M58,46 C58,48 60,48 60,46', mouth: 'M43,58 L57,58' },
        { id: 'wink', name: 'Wink', eyes: 'M40,48 Q42,46 44,48 M58,48 L60,48', mouth: 'M43,58 Q50,61 57,58' },
        { id: 'surprised', name: 'Surprised', eyes: 'M40,46 C40,49 42,49 42,46 M58,46 C58,49 60,49 60,46', mouth: 'M48,58 C48,60 52,60 52,58 C52,56 48,56 48,58' }
    ]
};

// SVG Avatar Component
function AvatarPreview({ config, size = 200 }) {
    const skinTone = AVATAR_OPTIONS.skinTone.find(s => s.id === config.skinTone)?.color || '#fdd5b8';
    const body = AVATAR_OPTIONS.body.find(b => b.id === config.body) || AVATAR_OPTIONS.body[1];
    const hair = AVATAR_OPTIONS.hair.find(h => h.id === config.hair);
    const hairColor = AVATAR_OPTIONS.hairColor.find(h => h.id === config.hairColor)?.color || '#2c1810';
    const clothesColor = AVATAR_OPTIONS.clothesColor.find(c => c.id === config.clothesColor)?.color || '#3b82f6';
    const accessory = AVATAR_OPTIONS.accessories.find(a => a.id === config.accessories);
    const expression = AVATAR_OPTIONS.expression.find(e => e.id === config.expression) || AVATAR_OPTIONS.expression[0];

    return (
        <svg width={size} height={size} viewBox="0 0 100 140" className="drop-shadow-lg">
            {/* Body */}
            <rect
                x={(100 - body.width) / 2}
                y="65"
                width={body.width}
                height={body.height}
                fill={clothesColor}
                rx="10"
            />

            {/* Neck */}
            <rect x="45" y="58" width="10" height="12" fill={skinTone} />

            {/* Head */}
            <circle cx="50" cy="45" r="22" fill={skinTone} />

            {/* Hair */}
            {hair && (
                <path d={hair.path} fill={hairColor} stroke={hairColor} strokeWidth="1" />
            )}

            {/* Eyes */}
            <path d={expression.eyes} stroke="#2c1810" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Mouth */}
            <path d={expression.mouth} stroke="#2c1810" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Accessories */}
            {accessory && accessory.svg && (
                <path d={accessory.svg} stroke="#2c1810" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}

            {/* Arms */}
            <rect x={(100 - body.width) / 2 - 8} y="70" width="8" height="40" fill={skinTone} rx="4" />
            <rect x={(100 + body.width) / 2} y="70" width="8" height="40" fill={skinTone} rx="4" />

            {/* Legs */}
            <rect x={(100 - body.width) / 2 + 10} y="155" width="15" height="50" fill="#4a5568" rx="4" />
            <rect x={(100 - body.width) / 2 + body.width - 25} y="155" width="15" height="50" fill="#4a5568" rx="4" />
        </svg>
    );
}

// Main Customizer Component
export default function AvatarCustomizer({ open, onClose, initialConfig, onSave }) {
    const [config, setConfig] = useState(initialConfig || {
        skinTone: 'medium',
        body: 'average',
        hair: 'short',
        hairColor: 'brown',
        clothes: 'tshirt',
        clothesColor: 'blue',
        accessories: 'none',
        expression: 'happy'
    });

    const [activeCategory, setActiveCategory] = useState('skinTone');

    const categories = [
        { id: 'skinTone', name: 'Skin', icon: '👤' },
        { id: 'body', name: 'Body', icon: '🧍' },
        { id: 'hair', name: 'Hair', icon: '💇' },
        { id: 'hairColor', name: 'Color', icon: '🎨' },
        { id: 'clothes', name: 'Clothes', icon: '👕' },
        { id: 'clothesColor', name: 'Color', icon: '🌈' },
        { id: 'accessories', name: 'Extras', icon: '👓' },
        { id: 'expression', name: 'Face', icon: '😊' }
    ];

    const handleSave = () => {
        onSave(config);
        onClose();
    };

    const randomize = () => {
        setConfig({
            skinTone: AVATAR_OPTIONS.skinTone[Math.floor(Math.random() * AVATAR_OPTIONS.skinTone.length)].id,
            body: AVATAR_OPTIONS.body[Math.floor(Math.random() * AVATAR_OPTIONS.body.length)].id,
            hair: AVATAR_OPTIONS.hair[Math.floor(Math.random() * AVATAR_OPTIONS.hair.length)].id,
            hairColor: AVATAR_OPTIONS.hairColor[Math.floor(Math.random() * AVATAR_OPTIONS.hairColor.length)].id,
            clothes: AVATAR_OPTIONS.clothes[Math.floor(Math.random() * AVATAR_OPTIONS.clothes.length)].id,
            clothesColor: AVATAR_OPTIONS.clothesColor[Math.floor(Math.random() * AVATAR_OPTIONS.clothesColor.length)].id,
            accessories: AVATAR_OPTIONS.accessories[Math.floor(Math.random() * AVATAR_OPTIONS.accessories.length)].id,
            expression: AVATAR_OPTIONS.expression[Math.floor(Math.random() * AVATAR_OPTIONS.expression.length)].id
        });
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Customizer Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-4 md:inset-10 lg:inset-20 bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden">

                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">Customize Avatar</h2>
                                <p className="text-sm text-purple-100">Create your unique look!</p>
                            </div>
                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={randomize}
                                    className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                                    <RotateCcw className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClose}
                                    className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Preview Panel */}
                            <div className="w-1/3 bg-gradient-to-b from-slate-50 to-slate-100 p-8 flex flex-col items-center justify-center border-r border-slate-200">
                                <AvatarPreview config={config} size={280} />
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-slate-600 mb-2">Your Avatar</p>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                            {AVATAR_OPTIONS.body.find(b => b.id === config.body)?.name}
                                        </span>
                                        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">
                                            {AVATAR_OPTIONS.hair.find(h => h.id === config.hair)?.name}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Options Panel */}
                            <div className="flex-1 flex flex-col">
                                {/* Category Tabs */}
                                <div className="bg-white border-b border-slate-200 px-4 py-2 overflow-x-auto">
                                    <div className="flex gap-2 min-w-max">
                                        {categories.map(cat => (
                                            <motion.button
                                                key={cat.id}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setActiveCategory(cat.id)}
                                                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${activeCategory === cat.id
                                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                    }`}>
                                                <span className="text-lg">{cat.icon}</span>
                                                {cat.name}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Options Grid */}
                                <div className="flex-1 p-6 overflow-y-auto">
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {AVATAR_OPTIONS[activeCategory]?.map(option => {
                                            const isSelected = config[activeCategory] === option.id;

                                            return (
                                                <motion.button
                                                    key={option.id}
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setConfig({ ...config, [activeCategory]: option.id })}
                                                    className={`relative p-4 rounded-2xl border-2 transition-all ${isSelected
                                                            ? 'border-purple-500 bg-purple-50 shadow-lg'
                                                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                                                        }`}>

                                                    {/* Color/Preview */}
                                                    {option.color && (
                                                        <div
                                                            className="w-full h-20 rounded-xl mb-3 border-2 border-white shadow-inner"
                                                            style={{ backgroundColor: option.color }}
                                                        />
                                                    )}

                                                    {/* Name */}
                                                    <div className={`text-sm font-semibold text-center ${isSelected ? 'text-purple-700' : 'text-slate-700'
                                                        }`}>
                                                        {option.name}
                                                    </div>

                                                    {/* Selected Check */}
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                                            <Check className="w-4 h-4 text-white" />
                                                        </motion.div>
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50 border-t border-slate-200 p-6 flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors">
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSave}
                                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-shadow">
                                Save Avatar
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Export preview component for use elsewhere
export { AvatarPreview, AVATAR_OPTIONS };