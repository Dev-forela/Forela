# Forela Deployment Guide

## Current Deployment: GitHub Pages

The Forela app is currently deployed to GitHub Pages at: https://jtopolski95.github.io/forela/

### GitHub Pages Deployment Process

The deployment happens automatically via GitHub Actions when you push to the `main` branch:

1. **GitHub Actions workflow** (`.github/workflows/deploy.yml`) triggers
2. **Builds** the Vite application (`npm run build`)  
3. **Deploys** the `dist/` folder to the `gh-pages` branch
4. **GitHub Pages** serves the static site

## Chat Functionality

Currently using **mock responses** for the companion chat feature.

<!--
## Future: OpenAI Chat Integration (Vercel)

To enable real OpenAI chat functionality, you would need to deploy to Vercel:

### Environment Variables Setup
1. Go to Vercel dashboard
2. Add environment variable: OPENAI_API_KEY=[YOUR_KEY]

### API Endpoint
- Production: `https://forela.vercel.app/api/chat`
- Development: `http://localhost:3000/api/chat`

### Files for API Integration:
- `api/chat.js` - OpenAI serverless function
- `api/package.json` - Dependencies for API functions

### Cost Considerations
- Using GPT-4 with ~300 max tokens per response
- Estimated cost: ~$0.03-0.06 per conversation
-->

## Features

- **Responsive Design** - Works on desktop and mobile
- **Activity Tracking** - Log daily wellness activities  
- **Companion Chat** - Supportive AI conversation (currently mock responses)
- **Journal Integration** - Track thoughts and reflections
- **Progress Visualization** - View activity patterns over time

## Development

To run locally:
```bash
npm install
npm run dev
```

To build for production:
```bash
npm run build
```
