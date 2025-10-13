# 🌌 Galaxy Guide

An interactive Star Wars planets explorer featuring AI-generated travel guides. Browse 60+ planets from the Star Wars universe with contextual descriptions powered by OpenAI.

## ✨ Features

- 📋 **List View**: Browse all planets in a grid layout
- 🚀 **Explore View**: Interactive view with orbiting planets
- 🤖 **AI Travel Guides**: Unique, witty travel descriptions for each planet (powered by OpenAI)
 - 🔁 **Regenerate Guides**: Click “Get new guide” in the modal for a fresh response
- 🔍 **Search & Filter**: Find planets by name and filter by climate
- 💾 **Smart Caching**: AI-generated content is cached locally to save API calls


## 🚀 Getting Started

### Installation

```bash
npm install
```

### Local Development

```bash
npm run dev
```

By default, the app will run with fallback content (no AI). To enable AI locally, run the Vercel functions alongside Vite (see below).

## 🌐 Deployment to Vercel (Recommended)

This app uses Vercel Serverless Functions to securely handle OpenAI API calls.

### Step 1: Deploy to Vercel

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Deploy
vercel
```

Or use the [Vercel Dashboard](https://vercel.com/new) to import your Git repository.

### Step 2: Add OpenAI API Key

1. Go to your project settings on Vercel
2. Navigate to **Settings → Environment Variables**
3. Add a new variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - **Environment**: Production, Preview, and Development

4. Redeploy your application

### Step 3: Test

Once deployed, click any planet to see AI-generated travel guides! 🎉

### Local Development with API (Recommended)

Run Vite and the Vercel serverless function together. The repo includes a Vite dev proxy so `/api/...` calls are forwarded to the functions.

1) Set your API key for local dev

```bash
echo "OPENAI_API_KEY=sk-..." > .env.local
```

2) In Terminal A (serverless functions on port 3000)

```bash
vercel dev --yes
```

3) In Terminal B (Vite on port 5175 with strictPort)

```bash
npm run dev
```

4) Test the function directly

```bash
curl -s http://localhost:3000/api/generate-planet-content \
  -H "Content-Type: application/json" \
  -d '{
    "planet": {
      "name": "Tatooine",
      "climate": "arid",
      "terrain": "desert",
      "population": "200000",
      "gravity": "1 standard",
      "diameter": "10465"
    }
  }'
```

In the frontend, simply call `/api/generate-planet-content` — Vite forwards to `http://localhost:3000` during dev.

Note: This proxy only applies in development; production builds are unaffected.

## 🎮 Usage

- **List View**: Browse all planets in a card grid
- **Explore View**: See planets orbiting in a solar system view
  - Click any planet to see details
  - Don't click the sun 5 times quickly.... and don't have your sound on....
- **Search**: Use `⌘K` or `/` to search and filter
- **Planet Details**: Click any planet to see AI-generated travel guides and SWAPI data

## 🛠️ Tech Stack

- **React** + TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Vercel** - Deployment / Serverless function
- **OpenAI API** - AI-generated content (Responses API + Structured Outputs)
- **SWAPI** - Star Wars data

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run preview` - Preview production build

## 🎨 Project Structure

```
src/
├── components/     # React components
├── hooks/          # Custom React hooks (including AI integration)
├── utils/          # Utility functions
├── types/          # TypeScript type definitions

api/
└── generate-planet-content.ts  # Vercel serverless function for OpenAI
```

## 🧪 Troubleshooting

- “No content received from OpenAI”
  - Ensure `OPENAI_API_KEY` is set in `.env.local` (for `vercel dev`) and in Vercel project envs for prod/preview.
  - Use the curl command above to isolate whether the function responds correctly.

- Port mismatch (frontend vs API)
  - Vite runs on 5175; Vercel functions run on 3000. The Vite proxy sends `/api/...` to `http://localhost:3000` in dev.
  - Production builds are not affected by the dev proxy.
