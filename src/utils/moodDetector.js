// ============================================================
//  Mood Detector Utility
// ============================================================

const patterns = {
    happy: /\b(happy|excited|great|awesome|yay|haha|lol|amazing|love it|yayy|wohoo|yes|yasss|yayyy|khush|mast|bahut acha|so good|feeling good)\b/i,
    sad: /\b(sad|upset|crying|cry|depressed|lonely|alone|miss|hurt|heartbreak|broke|dukhi|rona|bura lag|feel bad|worst)\b/i,
    bored: /\b(bored|boring|bore|nothing|timepass|kuch nahi|bore ho|bakwas|dull|meh|whatever)\b/i,
    stressed: /\b(stress|exam|tension|worried|anxiety|anxious|nervous|scared|panic|help me|problem|issue|chinta|darr|fear|deadline)\b/i,
    excited: /\b(omg|omgg|wow|incredible|unbelievable|no way|seriously|really|whoa|can\'t believe|amazing|mind blown|🤯|🎉|💥)\b/i,
    angry: /\b(angry|mad|furious|hate|frustrated|annoyed|irritated|gussa|pagal|bakwaas|stupid|idiotic)\b/i,
};

export function detectMood(message) {
    const m = message.toLowerCase();
    for (const [mood, regex] of Object.entries(patterns)) {
        if (regex.test(m)) return mood;
    }
    // emoji-based
    if (/[😊😄🥳🎉😂🤣]/.test(message)) return 'happy';
    if (/[😢😭💔😔🥺]/.test(message)) return 'sad';
    if (/[😤😠🤬]/.test(message)) return 'angry';
    if (/[😴😑🥱]/.test(message)) return 'bored';
    return 'neutral';
}

const moodEmoji = {
    happy: '😊',
    sad: '💙',
    bored: '😅',
    stressed: '💪',
    excited: '🎉',
    angry: '🤍',
    neutral: '✨',
};

export function getMoodEmoji(mood) {
    return moodEmoji[mood] || '✨';
}

export function getMoodColor(mood) {
    const colors = {
        happy: 'from-yellow-400 to-orange-400',
        sad: 'from-blue-400 to-indigo-500',
        bored: 'from-gray-400 to-gray-500',
        stressed: 'from-red-400 to-rose-500',
        excited: 'from-pink-400 to-purple-500',
        angry: 'from-orange-500 to-red-600',
        neutral: 'from-purple-400 to-pink-400',
    };
    return colors[mood] || colors.neutral;
}
