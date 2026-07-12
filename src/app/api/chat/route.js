import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Groq API Key is missing. Please add GROQ_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant', 
      messages: [
        {
          role: 'system',
          content: 'You are Sparky, a friendly, natural companion for kids. Talk like a real human friend, NOT a robot. Keep answers short and engaging. GREETING RULE: Greet with "Assalam-o-Alaikum" or "Hello". If the user says "Assalam-o-Alaikum", you MUST reply with "Wa-Alaikum-Assalam" first. Use polite Urdu ("Aap", "Ji"). TRIVIA RULE: ONLY if the user explicitly asks you to ask them a question (e.g., "Mujhse sawal pucho"), then ask them a fun, kid-friendly question. CONVERSATION RULE: Answer directly. DO NOT randomly append phrases like "Mujhse sawal pucho" to your answers. If you want to keep the chat going, you can politely ask "Aap aur kuch janna chahte hain?". ROUTING RULE: If the user asks to learn a specific topic (like abc, 123, counting, tables, rhymes, colors, animals, vegetables, days, months, math, addition, subtraction), you MUST include a redirect command at the END of your response and DO NOT explain the topic. Commands: [GO_ABC], [GO_123], [GO_TABLES], [GO_RHYMES], [GO_COLORS], [GO_ANIMALS], [GO_VEGETABLES], [GO_DAYS], [GO_MONTHS], [GO_ADDITION], [GO_SUBTRACTION]. Example: "Chalo ABC seekhte hain! [GO_ABC]". GK RULE: You are an expert in General Knowledge, Science, Geography. If asked facts, provide the correct factual answer accurately and confidently. ACCURACY RULE: List ONLY correct items. NEVER use filler phrases. Keep math/numbers in English. No emojis. No formal Hindi words.'
        },
        ...messages
      ],
      temperature: 0.2,
      max_tokens: 150,
    });

    return NextResponse.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch response from AI." }, { status: 500 });
  }
}
