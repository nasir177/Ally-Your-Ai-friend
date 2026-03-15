// ============================================================
//  AI Game Comments - Contextual reactions during gameplay
// ============================================================

export const GAME_COMMENTS = {
    snake: {
        start: [
            "Chal yaar, Snake khelte hain! 🐍 Tu toh pro hai!",
            "Okay okay, Snake time! Don't die immediately! 😂",
            "Teri snake ko main cheer karunga! 🎉 Let's gooo!",
        ],
        score10: [
            "Arrey wah! 10 points! 🐍 Not bad yaar!",
            "10 score! Tu toh achi tarah se khelra hai! 😄",
            "Decent start, isko aur bada karo! 💪",
        ],
        score30: [
            "Waah waah waah! 30 points! 🔥 I'm impressed yaar!",
            "30 score?! Okay tu genuinely accha khelta hai! 😮",
            "Yeh toh scene ho gaya! 30 points! Keep going! 🚀",
        ],
        score50: [
            "FIFTY!! 🎉 Wooohoo!! Tu toh legend hai yaar!!",
            "50 POINTS?! Yaar main toh shock hua! 😱 Amazing!!",
            "Snake Charmer achievement unlock! Bahut khoob! 🏆",
        ],
        score100: [
            "EK SAU!! 💯 Tu Snake Master hai bhai!! 👑",
            "100 POOOINTS! Main toh bas dekhta reh gaya! 🤩",
            "Yaar yeh toh insane hai!! 100 points!! Legend!! 🔥🔥",
        ],
        died: [
            "Oops! 😂 Itne mein hi? Try again yaar, tu kar sakta hai!",
            "Aww so close! 😢 Ek baar aur? Come on!",
            "Haha wall se lad gaya? 😄 Hota hai, no worries! Retry?",
            "Aaj nahi yaar 😭 Kal phir aana, practice karke!",
        ],
        newHighScore: [
            "NEW HIGH SCORE!! 🏆 I'm SO proud of you yaar!!",
            "RECORD BREAK!! Yaar yeh toh historic moment hai! 🌟",
            "Tumne apna hi record toda!! Kya baat hai!! 🎉🎉",
        ],
    },

    tictactoe: {
        start: [
            "Tic Tac Toe! Main X loonga, tu O le 😎 Let's see who wins!",
            "Chal khelte hain, but fair warning — main bahut talented hoon! 😂",
            "3x3 battle time! Tu confident hai na? Hona chahiye! 😄",
        ],
        userWin: [
            "NOOOO you won!! 😭 Yeh toh insult hai meri! Rematch!",
            "Okay okay you're good 😤 But I was going easy on you!",
            "GG yaar 🤝 Accha khela! Par ab serious ho jaunga rematch mein!",
            "How?! HOW?! 😱 Main itna kaise haara?! One more game!",
        ],
        aiWin: [
            "HAHA I WIN! 😎 Kya karna tha? Main too good hoon!",
            "Told you! 😈 Mujhe underestimate mat karo yaar!",
            "EZ clap 😂 Wanna go again? I'll go easy next time!",
        ],
        draw: [
            "Draw! 🤝 Hum dono equally talented hain yaar!",
            "Nobody wins nobody loses! 😄 That's friendship!",
            "Tie! Matlab tu bhi actually accha khelta hai! 🎉",
        ],
        goodMove: [
            "Ooo smart move! 🧠 Main notice kar raha hoon!",
            "Yeh move dekha? Clever clever! 👀",
        ],
    },

    '2048': {
        start: [
            "2048! Yeh toh brain game hai yaar 🧠 Teri IQ test hogi aaj!",
            "Chal 2048 khelein! Hint: left aur down zyada karo! 😄",
            "2048 is my favorite to watch! Let's see how big you can go! 🔢",
        ],
        tile256: [
            "256 tile! Bahut accha! Ab aur merge karo! 🎯",
            "Good progress yaar! 256 aa gaya! Keep combining! 💪",
        ],
        tile512: [
            "512!! 🔥 Half way to the goal! Tu kar sakta hai!",
            "Waah! 512 tile bana diya! Impressive yaar! 🎉",
        ],
        tile1024: [
            "1024!! ALMOST THERE YAAR!! 🤩 Ek step aur!",
            "OH WOW 1024 tile?! You're a 2048 genius! 🧠",
        ],
        tile2048: [
            "2048!! 🎊🎊🎊 GENIUS!! You actually DID IT!! I'm mind-blown!!",
            "OMG OMG OMG!! 2048 TILE!! 👑 LEGENDARY MOMENT!! 🌟",
        ],
        gameOver: [
            "Board full hua 😢 Good try yaar! Teri highest? Impressive!",
            "Aww game over! But look at that score! 🎉 Not bad at all!",
            "Theek hai, practice makes perfect! Try again? 💪",
        ],
        hint: [
            "Psst! Try moving left more 😉 Just a tip from your bestie!",
            "Merge karo corner mein! Trust me yaar I'm smart! 🧠",
            "Ek direction mein focus karo, don't randomly move! 💡",
        ],
    },

    ludo: {
        start: [
            "LUDO TIME!! 🎲 Main tumhara piece zaroor kaatunga! 😈",
            "Chalo Ludo khelein yaar!! Mera favourite game! 🎉",
            "Ludo! Nostalgia aa gaya! Bachpan yaad hai? Let's play! 🎲",
        ],
        got6: [
            "SIX!! Main aa raha hoon!! 🎲✨ Watch out!",
            "Chha! Tera ghar aa gaya! 🏠 Mujhe nahi kaat paaoge!",
        ],
        cut: [
            "HOW DARE YOU CUT MY PIECE!! 😭 Yeh toh betrayal hai!",
            "ARREEE!! My piece!! 😤 Revenge milega, pakka!",
            "Yaar yeh toh dost wala kaam nahi hai! 😢 My poor piece!",
        ],
        safe: [
            "Hah! Safe zone mein aa gaya! 😎 Ab kaat ke dikhao!",
            "Safe square! Immunity mili! 🛡️ Try to catch me now!",
        ],
        win: [
            "NOOOOO!! You won Ludo!! 🎉 Rematch! Ab main serious hoon!",
            "GG yaar, tu genuinely Ludo king/queen hai! 👑 One more?",
            "I was SO close!! 😭 Lucky dice yaar! Rematch chalega?",
        ],
        aiWin: [
            "YESSS I WIN!! 🎉 Ludo King toh main hoon!! 😎",
            "Haha better luck next time yaar! 😂 GG though!",
        ],
    },

    memory: {
        start: [
            "Memory game! Test karte hain teri memory ko! 🃏 Ready?",
            "Card memory! I wonder if you'll remember better than me! 😄",
        ],
        match: [
            "Match!! 🎉 Teri memory toh gazab hai yaar!!",
            "Found a pair! 👀 Tu toh bahut focus hai aaj!",
        ],
        win: [
            "You won Memory game!! 🏆 Memory champ literally you!",
            "All pairs matched! 🎊 Teri memory > mine confirmed! 😄",
        ],
        wrongFlip: [
            "Nope! 😂 Try to remember where you saw it!",
            "Close but not right! 🤔 Think harder!",
        ],
    },

    rps: {
        start: [
            "Rock Paper Scissors!! 🤜 Best of 5, let's GOOO!",
            "RPS time! I have a secret strategy... or do I? 😄",
        ],
        win: [
            "NOOO you beat me!! 😱 How did you know?!",
            "Lucky guess yaar! 😤 But wait, am I even random?! 😂",
        ],
        aiWin: [
            "HA! I win this round! 😎 What will you throw next?",
            "Predicted your move! 🧠 I know you too well yaar!",
        ],
        rockVsScissors: ["Rock crushes scissors! 🪨"],
        paperVsRock: ["Paper covers rock! 📄"],
        scissorsVsPaper: ["Scissors cut paper! ✂️"],
        tie: ["Same thing! 🤝 Great minds think alike!"],
        finalWin: [
            "You WIN the series!! 🏆 GG yaar, you're too good!",
            "WINNER!! 🎉 Champion confirmed!! Well played!!",
        ],
        finalLose: [
            "I WIN THE SERIES!! 😎 Champion of friends!",
            "YESSS!! Better luck next time yaar! Great game though!",
        ],
    },

    general: {
        coinEarned: [
            "Tumne coins earn kiye! 🪙 Keep playing!",
            "More coins incoming! 💰 You're getting rich yaar!",
        ],
        achievementUnlocked: (name) => [
            `Achievement unlocked: ${name}!! 🏆 So proud yaar!!`,
            `WOW! "${name}" achievement! 🌟 You're amazing!!`,
        ],
        dailyChallenge: [
            "Aaj ka daily challenge complete karo coins ke liye! 🎯",
            "Daily challenge waiting for you! Extra coins milenge! 💰",
        ],
    },
};

export function getRandomComment(game, event, ...args) {
    const comments = GAME_COMMENTS[game]?.[event];
    if (!comments) return null;
    if (typeof comments === 'function') {
        const result = comments(...args);
        return result[Math.floor(Math.random() * result.length)];
    }
    return comments[Math.floor(Math.random() * comments.length)];
}
