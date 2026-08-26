import { NextResponse } from 'next/server';
import { callGroqAPI } from '../../../lib/groqClient.js';

export function getWorthFallbackWhy(worth) {
  if (!worth || !worth.hasAlternative) {
    return "Similar options don't offer a clear advantage.";
  }
  return worth.reasonValue || "Similar options don't offer a clear advantage.";
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { worth, department, productName } = body;

    const fallbackWhy = getWorthFallbackWhy(worth);

    const forceFallback = request.headers.get('x-no-api-key') === 'true' || !process.env.GROQ_API_KEY_WORTH;

    if (forceFallback || !worth || !worth.hasAlternative) {
      return NextResponse.json({ why: fallbackWhy, source: 'fallback' });
    }

    const systemPrompt = `You are a helpful retail product guide. Translate the given worth-it alternative comparison verdict into one short, natural sentence (10-16 words) explaining why to a shopper comparing options. Ground strictly in the given facts. Do NOT invent new facts. Do NOT use banned words: score, confidence, signal, evidence, synthesized, algorithm, data, reviews, or percentages. Use 'buyers' or 'most buyers'.`;

    const userPrompt = `Department: ${department || 'Apparel'}. Product: ${productName || 'Wishlisted item'}. Reason type: ${worth.reasonType}. Reason details: ${worth.reasonValue}. Write one natural why-line sentence for a shopper.`;

    const aiWhy = await callGroqAPI('GROQ_API_KEY_WORTH', systemPrompt, userPrompt);

    if (aiWhy) {
      return NextResponse.json({ why: aiWhy, source: 'ai' });
    }

    return NextResponse.json({ why: fallbackWhy, source: 'fallback' });
  } catch (err) {
    return NextResponse.json({ why: "Similar options don't offer a clear advantage.", source: 'fallback' });
  }
}
