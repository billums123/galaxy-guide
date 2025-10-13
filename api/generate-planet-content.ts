import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

interface PlanetData {
  name: string;
  climate: string;
  terrain: string;
  population: string;
  gravity: string;
  diameter: string;
}

interface PlanetContentResponse {
  tagline: string;
  travelGuide: string;
  emoji: string;
}

/**
 * Vercel Serverless Function - Generate AI travel content for Star Wars planets
 * 
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'OpenAI API key not configured on server',
    });
  }

  try {
    const { planet } = req.body as { planet: PlanetData };

    // Validate input
    if (!planet || !planet.name) {
      return res.status(400).json({ error: 'Invalid planet data provided' });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey });

    // Generate the travel content
    const prompt = `You are a hilarious, sarcastic travel guide writer for Star Wars planets. Generate travel content for the planet "${planet.name}" with these characteristics:
- Climate: ${planet.climate}
- Terrain: ${planet.terrain}
- Population: ${planet.population}
- Gravity: ${planet.gravity}
- Diameter: ${planet.diameter} km

Create:
1. A short, punchy tagline (max 60 characters)
2. A funny, engaging travel guide description (2-3 sentences, ~100-150 words) that references the planet's actual characteristics
3. Keep the tone humorous, slightly sarcastic, but inviting
4. Include practical "tips" that are funny but related to the planet's features

Format your response as JSON:
{
  "tagline": "your tagline here",
  "travelGuide": "your travel guide here",
  "emoji": "a single relevant emoji"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-nano',
      messages: [
        {
          role: 'system',
          content:
            'You are a witty travel guide writer specializing in Star Wars planets. You write in a fun, humorous style similar to Douglas Adams or Terry Pratchett.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 300,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const parsed: PlanetContentResponse = JSON.parse(content);

    // Return the generated content
    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Error generating planet content:', error);

    // Return a generic error message (don't expose internal errors)
    return res.status(500).json({
      error: 'Failed to generate planet content',
      details:
        error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}

