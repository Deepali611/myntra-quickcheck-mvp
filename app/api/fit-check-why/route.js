import { NextResponse } from 'next/server';
import { callGroqAPI } from '../../../lib/groqClient.js';

export function getFitFallbackWhy(fit, department) {
  if (!fit || !fit.applicable || fit.confidence === 'low') {
    if (department === 'Beauty') return "Not enough data yet for this shade.";
    return "Not enough data yet for this size.";
  }

  if (department === 'Beauty') {
    if (fit.flaggedZone === 'skin_type_fit') {
      return "Most buyers with sensitive skin found this worked well for them.";
    }
    if (fit.direction === 'true') {
      return "Most buyers found the shade matched what's shown.";
    }
    if (fit.direction === 'small') {
      return "Most buyers found it lighter than the photo in person.";
    }
    if (fit.direction === 'large') {
      return "Most buyers found it deeper than the photo in person.";
    }
    return "Most buyers found the shade matched what's shown.";
  }

  if (department === 'Accessories') {
    if (fit.flaggedZone === 'capacity') {
      return "Most buyers found the capacity fits daily essentials well.";
    }
    return "Most buyers found the fit and dimensions suited their needs.";
  }

  if (department === 'HomeLiving' || department === 'Home & Living') {
    return "Most buyers found the dimensions matched their space.";
  }

  // Tier 1 Apparel / Footwear
  if (fit.direction === 'true') {
    return "Most buyers wore their regular size.";
  }
  
  const zoneStr = fit.flaggedZone ? fit.flaggedZone : 'item';
  if (fit.direction === 'small') {
    return `Most buyers said the ${zoneStr} felt snug and sized up for it.`;
  }
  if (fit.direction === 'large') {
    return `Most buyers said the ${zoneStr} felt loose and sized down for it.`;
  }

  return "Most buyers wore their regular size.";
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { fit, department } = body;

    const fallbackWhy = getFitFallbackWhy(fit, department);

    const forceFallback = request.headers.get('x-no-api-key') === 'true' || !process.env.GROQ_API_KEY_FIT;

    if (forceFallback || !fit || !fit.applicable || fit.confidence === 'low') {
      return NextResponse.json({ why: fallbackWhy, source: 'fallback' });
    }

    const systemPrompt = `You are a helpful retail product guide. Translate the given fit verdict into one short, natural sentence (10-16 words) explaining why to a shopper. Ground strictly in the given facts. Do NOT invent new facts. Do NOT use banned words: score, confidence, signal, evidence, synthesized, algorithm, data, reviews, or percentages. Use 'buyers' or 'most buyers'.`;

    let userPrompt = '';
    if (department === 'Beauty') {
      userPrompt = `Product department: Beauty. Shade/fit verdict: ${fit.direction === 'small' ? 'lighter than shown' : fit.direction === 'large' ? 'deeper than shown' : 'true to shade'}. Write one natural why-line sentence.`;
    } else {
      userPrompt = `Product department: ${department || 'Apparel'}. Fit verdict: runs ${fit.direction || 'true'} at the ${fit.flaggedZone || 'garment'}. Write one natural why-line sentence for a shopper.`;
    }

    const aiWhy = await callGroqAPI('GROQ_API_KEY_FIT', systemPrompt, userPrompt);

    if (aiWhy) {
      return NextResponse.json({ why: aiWhy, source: 'ai' });
    }

    return NextResponse.json({ why: fallbackWhy, source: 'fallback' });
  } catch (err) {
    return NextResponse.json({ why: "Not enough data yet for this size.", source: 'fallback' });
  }
}
