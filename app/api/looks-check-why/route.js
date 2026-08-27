import { NextResponse } from 'next/server';
import { callGroqAPI } from '../../../lib/groqClient.js';
import { getLooksFallbackWhy } from '../../../lib/fallbackCopy.js';

export { getLooksFallbackWhy };

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { looks, department } = body;

    const fallbackWhy = getLooksFallbackWhy(looks, department);

    const forceFallback = request.headers.get('x-no-api-key') === 'true' || !process.env.GROQ_API_KEY_LOOKS;

    if (forceFallback || !looks || looks.confidence === 'low') {
      return NextResponse.json({ why: fallbackWhy, source: 'fallback' });
    }

    const systemPrompt = `You are a retail product guide. State looks/photo accuracy facts directly and confidently without third-party attribution. Do NOT use: "buyers say", "most buyers", "shoppers found", "reviews mention", "reviews say", score, confidence, signal, evidence, synthesized, algorithm, data, or percentages. Write one natural 8-14 word sentence.`;

    const userPrompt = `Looks verdict for ${department || 'product'}: attribute=${looks.attribute}, direction=${looks.direction}. Write one direct why-line sentence.`;

    const aiWhy = await callGroqAPI('GROQ_API_KEY_LOOKS', systemPrompt, userPrompt);

    if (aiWhy && !aiWhy.toLowerCase().includes('buyer') && !aiWhy.toLowerCase().includes('shopper')) {
      return NextResponse.json({ why: aiWhy, source: 'ai' });
    }

    return NextResponse.json({ why: fallbackWhy, source: 'fallback' });
  } catch (err) {
    return NextResponse.json({ why: 'Not enough photo signal yet for this item.', source: 'fallback' });
  }
}
