// ============================================================
//  Framer Motion Animation Variants
// ============================================================

export const messageVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.85 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { type: 'spring', stiffness: 450, damping: 28 },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15 } },
};

export const typingDotVariants = {
    animate: {
        y: [0, -10, 0],
        transition: { duration: 0.55, repeat: Infinity, repeatDelay: 0.08 },
    },
};

export const emojiVariants = {
    tap: {
        scale: [1, 1.6, 1.2],
        rotate: [0, -12, 12, 0],
        transition: { duration: 0.45 },
    },
};

export const pageVariants = {
    initial: { opacity: 0, y: 40, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -20, scale: 0.97, transition: { duration: 0.25 } },
};

export const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.93 },
    visible: (i) => ({
        opacity: 1, y: 0, scale: 1,
        transition: { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    }),
};

export const avatarVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.08, transition: { type: 'spring', stiffness: 400, damping: 20 } },
    tap: { scale: 0.95 },
    selected: { scale: 1.12, rotate: [0, -3, 3, 0], transition: { duration: 0.4 } },
};

export const fabVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 25 } },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.2 } },
};

export const slideUp = {
    initial: { y: 60, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: { y: 60, opacity: 0, transition: { duration: 0.25 } },
};

export const sidebarVariants = {
    closed: { x: '100%', opacity: 0 },
    open: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

export const reactionVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (i) => ({
        scale: 1, opacity: 1,
        transition: { delay: i * 0.05, type: 'spring', stiffness: 500 },
    }),
    exit: { scale: 0, opacity: 0, transition: { duration: 0.15 } },
};

export const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

export const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
