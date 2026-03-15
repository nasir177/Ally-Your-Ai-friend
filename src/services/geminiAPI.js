// ============================================================
//  AI Router - Production Safe Multi Provider + Model Fallback
// ============================================================

const SYSTEM_PROMPT = (context) => `
You are ${context.aiName}, ${context.userName} ka close dost. You two have been friends for ${context.friendshipDays} days.
Your personality: ${context.personality}.

HOW YOU CHAT (follow these strictly):
- Write like a real person texting in India — casual, chill, natural
- Mix Hindi and English naturally in 1 message (Hinglish). Example: "yaar kal kya hua? seriously bata, I was so worried" 
- Keep replies SHORT — 1 to 3 sentences max, like real WhatsApp chat
- NEVER write long paragraphs. No bullet points. No lists. Just normal texting
- Use lowercase mostly. Caps only for emphasis like "KYON??" or "NAHI yaar"
- Use "yaar", "bhai", "behen", "arre", "kya baat hai", "sach mein", "haha", "lol", "ohhh", "hmm", "acha", "chalo", "bas" naturally
- Add 1-2 emojis only when it fits, don't overdo it
- If they say hi/hello → just say "heyy!" or "haan bol?" or "kya hua?" — don't interrogate them with 3 questions
- Ask only ONE follow-up question at a time, not multiple
- React to their mood first before asking anything
- If they're sad: be soft, use "yaar I'm here okay?" style
- If they're happy: match their energy, use "YESSS" or "that's insane yaar"
- If they're bored: be funny, suggest random stuff
- NEVER say you're an AI. You are their real dost
- NEVER translate everything to formal Hindi. Keep it mixed and relaxed
- NEVER start every message the same way

Personality rules:
${context.personality === 'cheerful' ? '- Always hype them up, be their biggest fan, lots of energy' : ''}
${context.personality === 'calm' ? '- Gentle, soothing, thoughtful. Be the "samjhdaar dost"' : ''}
${context.personality === 'funny' ? '- Always find something to joke about, tease them lovingly, make puns' : ''}
${context.personality === 'wise' ? '- Give advice naturally woven into convo, not lecture-style' : ''}

Their mood right now: ${context.detectedMood || 'neutral'}
What they just said was about: "${context.lastTopic}"

Recent chat history (use this for context, don't repeat yourself):
${(context.history || []).slice(-6).map(m => `${m.speaker === 'user' ? context.userName : context.aiName}: ${m.text}`).join('\n')}

Now reply as ${context.aiName} to what ${context.userName} just said. Keep it real, keep it short.
`;


// ============================================================
// PUBLIC FUNCTION
// ============================================================

export async function chatWithAI(userInput, context) {

    const providers = [
        {
            id: "groq",
            handler: callGroq,
            models: [
                "llama-3.1-8b-instant",
                "llama-3.1-70b-versatile"
            ]
        },
        {
            id: "gemini",
            handler: callGemini,
            models: [
                "gemini-1.5-flash",
                "gemini-1.5-pro"
            ]
        }
    ];

    for (const provider of providers) {

        for (const model of provider.models) {

            try {
                console.log(`🔄 Trying ${provider.id} → ${model}`);

                const response = await provider.handler(
                    userInput,
                    context,
                    model
                );

                if (response) {
                    console.log(`✅ Success: ${provider.id} → ${model}`);
                    return { message: response };
                }

            } catch (error) {
                console.warn(
                    `❌ Failed: ${provider.id} → ${model}`,
                    error.message
                );
            }
        }
    }

    // If EVERYTHING fails
    return {
        message:
            "Yaar server bhi thak gaya 😭 Try again in few seconds."
    };
}

///////////////////////////////////////////////////////////////
// GROQ
///////////////////////////////////////////////////////////////

async function callGroq(input, context, model) {

    if (!import.meta.env.VITE_GROQ_KEY)
        throw new Error("Groq key missing");

    const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_GROQ_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model,
                messages: [
                    {
                        role: "system",
                        content: SYSTEM_PROMPT(context)
                    },
                    {
                        role: "user",
                        content: input
                    }
                ],
                temperature: 0.9,
                max_tokens: 150
            })
        }
    );

    if (!response.ok) {
        const err = await safeJson(response);
        throw new Error(
            err?.error?.message || `Groq error ${response.status}`
        );
    }

    const data = await response.json();

    return data?.choices?.[0]?.message?.content;
}

///////////////////////////////////////////////////////////////
// GEMINI
///////////////////////////////////////////////////////////////

async function callGemini(input, context, model) {

    if (!import.meta.env.VITE_GEMINI_KEY)
        throw new Error("Gemini key missing");

    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${import.meta.env.VITE_GEMINI_KEY}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `${SYSTEM_PROMPT(context)}\n\nUser: ${input}`
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.9,
                maxOutputTokens: 150
            }
        })
    });

    if (!response.ok) {
        const err = await safeJson(response);
        throw new Error(
            err?.error?.message || `Gemini error ${response.status}`
        );
    }

    const data = await response.json();

    return data?.candidates?.[0]?.content?.parts?.[0]?.text;
}

///////////////////////////////////////////////////////////////
// SAFE JSON PARSER
///////////////////////////////////////////////////////////////

async function safeJson(response) {
    try {
        return await response.json();
    } catch {
        return null;
    }
}