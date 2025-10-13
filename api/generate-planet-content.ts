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

/**
 * Response format for AI-generated planet content.
 * @property tagline - Short, punchy tagline.
 * @property travelGuide - Funny, engaging travel guide description.
 * @property emoji - A relevant emoji.
 */
interface PlanetContentResponse {
  tagline: string;
  travelGuide: string;
  emoji: string;
}

/**
 * Checks if a given value is a valid PlanetContentResponse.
 * @param value
 */
function isPlanetContentResponse(value: unknown): value is PlanetContentResponse {
  if (value === null || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  if (
    typeof obj.tagline !== 'string' ||
    typeof obj.travelGuide !== 'string' ||
    typeof obj.emoji !== 'string'
  ) {
    return false;
  }

  const tagline = obj.tagline as string;
  const travelGuide = obj.travelGuide as string;
  const emoji = obj.emoji as string;

  // Enforce basic constraints
  if (tagline.length === 0 || tagline.length > 60) return false;
  if (travelGuide.length === 0) return false;
  if (emoji.length === 0 || emoji.length > 8) return false;

  return true;
}

/**
 * Returns a default placeholder response for planet content.
 * @param planetName The name of the planet.
 */
function getDefaultPlanetContent(planetName: string): PlanetContentResponse {
  return {
    tagline: `A galactic adventure awaits on ${planetName}!`,
    travelGuide: `Welcome to ${planetName}, a planet of mystery and wonder! While intergalactic signals seem jammed right now, you can rest assured that ${planetName} offers unforgettable scenery, quirky locals, and a climate best described as 'surprising.' Don't forget to pack a towel and bring your sense of humor. May the fun be with you!`,
    emoji: '🪐',
  };
}

/**
 * Vercel Serverless Function - Generate AI travel content for Star Wars planets
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // CORS
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

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res
      .status(500)
      .json({ error: 'OpenAI API key not configured on server' });
    return;
  }

  try {
    const { planet } = req.body as { planet: PlanetData };

    if (!planet || !planet.name) {
      res.status(400).json({ error: 'Invalid planet data provided' });
      return;
    }

    const openai = new OpenAI({ apiKey });

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

Format your response as JSON with tagline, travelGuide, and emoji fields.`;

    let parsed: PlanetContentResponse | null = null;

    try {
      // Use the Chat Completions API with structured outputs
      const completion = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a witty travel guide writer specializing in Star Wars planets. You write in a fun, humorous style similar to Douglas Adams or Terry Pratchett.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'planet_content',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                tagline: {
                  type: 'string',
                  description:
                    'Short, punchy tagline (<= 60 chars) for the planet',
                },
                travelGuide: {
                  type: 'string',
                  description:
                    'Funny, engaging travel guide (~100-150 words) referencing actual characteristics',
                },
                emoji: {
                  type: 'string',
                  description: 'A single relevant emoji',
                },
              },
              required: ['tagline', 'travelGuide', 'emoji'],
              additionalProperties: false,
            },
          },
        },
        max_tokens: 300,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      try {
        parsed = JSON.parse(content) as PlanetContentResponse;
      } catch {
        const start = content.indexOf('{');
        const end = content.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
          const maybeJson = content.slice(start, end + 1);
          parsed = JSON.parse(maybeJson) as PlanetContentResponse;
        } else {
          throw new Error('Model did not return valid JSON');
        }
      }

      if (!isPlanetContentResponse(parsed)) {
        throw new Error('Response JSON does not match expected schema');
      }

      // Respond with the valid AI-generated content
      res.status(200).json(parsed);
    } catch (aiError) {
      // If any error occurs with AI, fallback to default placeholders
      console.error('Error generating planet content, using fallback:', aiError);
      const fallback = getDefaultPlanetContent(planet.name);
      res.status(200).json(fallback);
    }
  } catch (error) {
    console.error('Fatal error generating planet content:', error);
    // Show fallback placeholder content instead of error payload
    const fallback = getDefaultPlanetContent(
      typeof req.body === 'object' && !!req.body?.planet?.name
        ? req.body.planet.name
        : 'Planet'
    );
    res.status(200).json(fallback);
  }
}
