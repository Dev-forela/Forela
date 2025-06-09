# Forela OpenAI Chat Deployment Guide

## Environment Variables Setup

To enable the OpenAI chat functionality, you need to set up environment variables on Vercel:

### 1. In Vercel Dashboard
1. Go to your Vercel project dashboard: [forela.vercel.app](https://forela.vercel.app)
2. Navigate to Settings → Environment Variables
3. Add the following environment variable:

```
Name: OPENAI_API_KEY
Value: [YOUR_OPENAI_API_KEY_HERE]
```

### 2. Local Development
Create a `.env` file in your project root (this file is gitignored for security):

```
OPENAI_API_KEY=[YOUR_OPENAI_API_KEY_HERE]
```

## API Endpoint

The chat functionality uses the serverless function at:
- Production: `https://forela.vercel.app/api/chat`
- Development: `http://localhost:3000/api/chat` (when running Vercel dev)

## Files Created/Modified

### New Files:
- `api/chat.js` - OpenAI serverless function
- `api/package.json` - Dependencies for API functions
- `src/vite-env.d.ts` - TypeScript environment definitions
- `vercel.json` - Vercel deployment configuration
- `DEPLOYMENT.md` - This file

### Modified Files:
- `src/pages/Companion.tsx` - Updated to use real OpenAI API with loading states
- Added loading indicator with animated dots
- Added error handling with fallback to mock responses
- Improved UI feedback during API calls

## Deployment Steps

1. **Set Environment Variables** on Vercel (as described above)
2. **Deploy to Vercel** - This happens automatically when you push to GitHub
3. **Test the Chat** - Visit forela.vercel.app and try the Companion chat

## Features

- Real OpenAI GPT-4 responses as "Ela"
- Context-aware responses using user's journal data
- Loading states with animated indicators
- Error handling with graceful fallbacks
- CORS enabled for cross-origin requests
- Responsive design maintained

## Troubleshooting

If the chat doesn't work:
1. Check that `OPENAI_API_KEY` is set in Vercel environment variables
2. Check the browser console for any errors
3. Verify the API endpoint is accessible at `/api/chat`
4. The app will fall back to mock responses if the API fails

## Cost Considerations

- Using GPT-4 with ~300 max tokens per response
- Estimated cost: ~$0.03-0.06 per conversation
- Consider switching to `gpt-3.5-turbo` for lower costs if needed Added dual deployment setup - GitHub Pages + Vercel
