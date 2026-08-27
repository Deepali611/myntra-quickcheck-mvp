import { NextResponse } from 'next/server';
import { callGroqAPI } from '../../../lib/groqClient.js';
import { getWorthFallbackWhy } from '../../../lib/fallbackCopy.js';

export { getWorthFallbackWhy };

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { worth, department } = body;

    const fallbackWhy = getWorthFallbackWhy(worth);

    const forceFallback = request.headers.get('x-no-api-key') === 'true' || !process.env.GROQ_API_KEY_WORTH;

    if (forceFallback || !worth) {
      return NextResponse.json({ why: fallbackWhy, source: 'fallback' });
    }

    const systemPrompt = `You are a retail product guide. Rephrase the given comparative price fact directly and confidently without third-party attribution. Do NOT suggest a different product. Do NOT use: "buyers say", "most buyers", "shoppers found", "reviews mention", "reviews say", score, confidence, signal, evidence, synthesized, algorithm, data, or percentages. Write one natural 8-14 word sentence confirming value.`;

    const userPrompt = `Value fact: ${worth.why || fallbackWhy}. Write one direct why-line sentence confirming value for this item.`;

    const aiWhy = await callGroqAPI('GROQ_API_KEY_WORTH', systemPrompt, userPrompt);

    if (aiWhy && !aiWhy.toLowerCase().includes('buyer') && !aiWhy.toLowerCase().includes('shopper')) {
      return NextResponse.json({ why: aiWhy, source: 'ai' });
    }

    return NextResponse.json({ why: fallbackWhy, source: 'fallback' });
  } catch (err) {
    return NextResponse.json({ why: 'Best price we found for this style.', source: 'fallback' });
  }
}
