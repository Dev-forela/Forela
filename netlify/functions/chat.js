const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the request body
    const { message, context } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing message' }),
      };
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your Netlify environment variables.' 
        }),
      };
    }

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

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 300,
    });

    const reply = completion.choices[0].message.content;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Handle specific OpenAI errors
    if (error.status === 401) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable.' 
        }),
      };
    }
    
    if (error.status === 429) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'OpenAI API rate limit exceeded. Please try again in a moment.' 
        }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Sorry, I\'m having trouble responding right now. Please try again in a moment.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
    };
  }
}; 