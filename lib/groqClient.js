/**
 * lib/groqClient.js
 * Shared Groq API client with task-specific keys, 12s timeout, and server-side banned-word filtering.
 */

const BANNED_WORDS_REGEX = /\b(score|confidence|signal|evidence|synthesized|algorithm|data)\b|reviews\s+(say|mention)|[0-9]+%/i;

export function containsBannedWords(text) {
  if (!text || typeof text !== 'string') return true;
  return BANNED_WORDS_REGEX.test(text);
}

export async function callGroqAPI(apiKeyEnvName, systemPrompt, userPrompt) {
  const apiKey = process.env[apiKeyEnvName];
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
    return null; // Return null immediately if no API key set
  }

  const model = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[Groq Client] ${apiKeyEnvName} HTTP error ${res.status}`);
      return null;
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content?.trim();

    if (!content) return null;

    // Clean surrounding quotes if present
    const cleanContent = content.replace(/^["']|["']$/g, '').trim();

    // Check banned words
    if (containsBannedWords(cleanContent)) {
      console.warn(`[Groq Client] Banned word detected in output: "${cleanContent}". Falling back to hand-written template.`);
      return null;
    }

    return cleanContent;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn(`[Groq Client] ${apiKeyEnvName} request failed (${err.message}). Falling back.`);
    return null;
  }
}
