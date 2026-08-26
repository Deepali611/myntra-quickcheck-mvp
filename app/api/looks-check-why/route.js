import { NextResponse } from 'next/server';
import { callGroqAPI } from '../../../lib/groqClient.js';

export function getLooksFallbackWhy(looks, department) {
  if (!looks || looks.confidence === 'low') {
    return "Not enough buyer photos yet for this item.";
  }

  if (!looks.flaggedAttribute) {
    if (['Beauty', 'Accessories', 'HomeLiving', 'Home & Living'].includes(department)) {
      return "Material and finish matched the photos for most buyers.";
    }
    return "Colour, print and fabric all matched the photos.";
  }

  const attr = looks.flaggedAttribute.charAt(0).toUpperCase() + looks.flaggedAttribute.slice(1);
  return `${attr} was slightly different from the photos for some buyers.`;
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { looks, department } = body;

    const fallbackWhy = getLooksFallbackWhy(looks, department);

    const forceFallback = request.headers.get('x-no-api-key') === 'true' || !process.env.GROQ_API_KEY_LOOKS;

    if (forceFallback || !looks || looks.confidence === 'low') {
      return NextResponse.json({ why: fallbackWhy, source: 'fallback' });
    }

    const systemPrompt = `You are a helpful retail product guide. Translate the given looks verdict into one short, natural sentence (10-16 words) explaining why to a shopper. Ground strictly in the given facts. Do NOT invent new facts. Do NOT use banned words: score, confidence, signal, evidence, synthesized, algorithm, data, reviews, or percentages. Use 'buyers' or 'most buyers'.`;

    const userPrompt = `Product department: ${department || 'Apparel'}. Looks verdict: ${looks.flaggedAttribute ? `flagged difference in ${looks.flaggedAttribute}` : 'looks as expected, photos match'}. Write one natural why-line sentence for a shopper.`;

    const aiWhy = await callGroqAPI('GROQ_API_KEY_LOOKS', systemPrompt, userPrompt);

    if (aiWhy) {
      return NextResponse.json({ why: aiWhy, source: 'ai' });
    }

    return NextResponse.json({ why: fallbackWhy, source: 'fallback' });
  } catch (err) {
    return NextResponse.json({ why: "Not enough buyer photos yet for this item.", source: 'fallback' });
  }
}
