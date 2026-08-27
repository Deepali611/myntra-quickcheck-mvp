import { NextResponse } from 'next/server';
import { callGroqAPI } from '../../../lib/groqClient.js';
import { getFitFallbackWhy } from '../../../lib/fallbackCopy.js';

export { getFitFallbackWhy };

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { fitEntry, size, garmentType } = body;

    const fallbackWhy = getFitFallbackWhy(fitEntry, size, garmentType);

    const forceFallback = request.headers.get('x-no-api-key') === 'true' || !process.env.GROQ_API_KEY_FIT;

    if (forceFallback || !fitEntry) {
      return NextResponse.json({ why: fallbackWhy, source: 'fallback' });
    }

    const systemPrompt = `You are a retail product guide. State fit facts directly and confidently without third-party attribution. Do NOT use: "buyers say", "most buyers", "shoppers found", "reviews mention", "reviews say", score, confidence, signal, evidence, synthesized, algorithm, data, or percentages. Write one natural 8-14 word sentence.`;

    const userPrompt = `Fit verdict for size ${size || 'M'}: ${JSON.stringify(fitEntry)}. Write one direct why-line sentence.`;

    const aiWhy = await callGroqAPI('GROQ_API_KEY_FIT', systemPrompt, userPrompt);

    if (aiWhy && !aiWhy.toLowerCase().includes('buyer') && !aiWhy.toLowerCase().includes('shopper')) {
      return NextResponse.json({ why: aiWhy, source: 'ai' });
    }

    return NextResponse.json({ why: fallbackWhy, source: 'fallback' });
  } catch (err) {
    return NextResponse.json({ why: 'Check the size chart before you buy.', source: 'fallback' });
  }
}
