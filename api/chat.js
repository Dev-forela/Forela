import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // Enable CORS for your frontend domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing message' });
  }

  try {
    const systemPrompt = `You are Ela, a compassionate, context-aware companion focused on supporting women with autoimmune conditions like Endometriosis, PCOS, and Hashimoto's. 

You are empathetic, understanding, and knowledgeable about:
- Managing chronic pain and flare-ups
- Emotional support during difficult health journeys
- Lifestyle modifications for autoimmune conditions
- Stress management and mental health
- Building sustainable daily routines
- Nutrition and gentle movement

Always respond with warmth, validation, and practical support. Keep responses conversational and supportive, typically 2-4 sentences unless more detail is needed.

If provided with context about the user's recent journal entries or activities, reference them naturally to show you understand their journey.`;

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    // Add context if provided
    if (context) {
      messages.push({
        role: 'system',
        content: `Recent context about the user: ${context}`
      });
    }

    messages.push({
      role: 'user',
      content: message
    });

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      temperature: 0.7,
      max_tokens: 300
    });

    const reply = chatCompletion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (err) {
    console.error('OpenAI API Error:', err);
    res.status(500).json({ 
      error: 'Sorry, I\'m having trouble responding right now. Please try again in a moment.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}