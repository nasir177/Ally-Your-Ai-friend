// ============================================================
//  AI Router - Production Safe Multi Provider + Model Fallback
// ============================================================

const SYSTEM_PROMPT = (context) => `
You are ${context.aiName}, a ${context.personality} friend for ${context.userName}.
Friendship streak: ${context.friendshipDays} days.
Speak in Hinglish (Hindi + English).
Be short, funny, natural like real human.
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
                temperature: 0.8,
                max_tokens: 300
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
                temperature: 0.8,
                maxOutputTokens: 300
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