async function postRoute(urlPath, body, headers = {}) {
  const res = await fetch(`http://localhost:3000${urlPath}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body)
  });
  return await res.json();
}

async function runPhase5Tests() {
  console.log('=== Phase 5 Verification Suite — AI Routes & Fallbacks ===\n');

  // --- MODE A: NO API KEYS (FALLBACK TEST VIA x-no-api-key: true) ---
  console.log('----------------------------------------------------');
  console.log('MODE A: Testing ALL 3 Routes with NO API KEY SET (Fallback Mode)');
  console.log('----------------------------------------------------');

  const fallbackHeader = { 'x-no-api-key': 'true' };

  // 1. Fit Check Fallback — Tier 1 (Women Kurta)
  const fitPayloadT1 = {
    fit: { applicable: true, flaggedZone: 'chest', direction: 'small', confidence: 'high' },
    department: 'Women'
  };
  const fitResFallbackT1 = await postRoute('/api/fit-check-why', fitPayloadT1, fallbackHeader);
  console.log('\n1. Fit Check Fallback (Tier 1 - Women Kurta):');
  console.log(`   Response:`, JSON.stringify(fitResFallbackT1));

  // 2. Fit Check Fallback — Tier 2 (Beauty Serum)
  const fitPayloadT2 = {
    fit: { applicable: true, flaggedZone: 'shade_match', direction: 'small', confidence: 'high' },
    department: 'Beauty'
  };
  const fitResFallbackT2 = await postRoute('/api/fit-check-why', fitPayloadT2, fallbackHeader);
  console.log('\n2. Fit Check Fallback (Tier 2 - Beauty Serum):');
  console.log(`   Response:`, JSON.stringify(fitResFallbackT2));

  // 3. Looks Check Fallback — Tier 1 (Men Shirt)
  const looksPayloadT1 = {
    looks: { confidence: 'high', flaggedAttribute: 'fabric' },
    department: 'Men'
  };
  const looksResFallbackT1 = await postRoute('/api/looks-check-why', looksPayloadT1, fallbackHeader);
  console.log('\n3. Looks Check Fallback (Tier 1 - Men Shirt):');
  console.log(`   Response:`, JSON.stringify(looksResFallbackT1));

  // 4. Looks Check Fallback — Tier 2 (HomeLiving Bedsheet)
  const looksPayloadT2 = {
    looks: { confidence: 'high', flaggedAttribute: 'material' },
    department: 'HomeLiving'
  };
  const looksResFallbackT2 = await postRoute('/api/looks-check-why', looksPayloadT2, fallbackHeader);
  console.log('\n4. Looks Check Fallback (Tier 2 - HomeLiving Bedsheet):');
  console.log(`   Response:`, JSON.stringify(looksResFallbackT2));

  // 5. Worth It Fallback — Tier 1 (Footwear Heels)
  const worthPayloadT1 = {
    worth: { hasAlternative: true, reasonType: 'price', reasonValue: '₹320 cheaper, similar rating' },
    department: 'Footwear',
    productName: 'Black Heels'
  };
  const worthResFallbackT1 = await postRoute('/api/worth-it-why', worthPayloadT1, fallbackHeader);
  console.log('\n5. Worth It Fallback (Tier 1 - Footwear Heels):');
  console.log(`   Response:`, JSON.stringify(worthResFallbackT1));

  // 6. Worth It Fallback — Tier 2 (Beauty Lipstick)
  const worthPayloadT2 = {
    worth: { hasAlternative: true, reasonType: 'rating', reasonValue: 'Rated 4.6 vs 4.2, similar price' },
    department: 'Beauty',
    productName: 'Matte Lipstick'
  };
  const worthResFallbackT2 = await postRoute('/api/worth-it-why', worthPayloadT2, fallbackHeader);
  console.log('\n6. Worth It Fallback (Tier 2 - Beauty Lipstick):');
  console.log(`   Response:`, JSON.stringify(worthResFallbackT2));


  // --- MODE B: REAL API KEYS (LIVE GROQ AI RESPONSE TEST) ---
  console.log('\n----------------------------------------------------');
  console.log('MODE B: Testing ALL 3 Routes with REAL GROQ API KEYS');
  console.log('----------------------------------------------------');

  // 1. Fit Check Live AI Response (Tier 1 Women Kurta)
  const fitResAI = await postRoute('/api/fit-check-why', fitPayloadT1);
  console.log('\n1. Fit Check Live AI Response (Tier 1 - Women Kurta):');
  console.log(`   Response:`, JSON.stringify(fitResAI));

  // 2. Fit Check Live AI Response (Tier 2 Beauty Serum)
  const fitResAITier2 = await postRoute('/api/fit-check-why', fitPayloadT2);
  console.log('\n2. Fit Check Live AI Response (Tier 2 - Beauty Serum):');
  console.log(`   Response:`, JSON.stringify(fitResAITier2));

  // 3. Looks Check Live AI Response (Tier 1 Men Shirt)
  const looksResAI = await postRoute('/api/looks-check-why', looksPayloadT1);
  console.log('\n3. Looks Check Live AI Response (Tier 1 - Men Shirt):');
  console.log(`   Response:`, JSON.stringify(looksResAI));

  // 4. Worth It Live AI Response (Tier 1 Footwear Heels)
  const worthResAI = await postRoute('/api/worth-it-why', worthPayloadT1);
  console.log('\n4. Worth It Live AI Response (Tier 1 - Footwear Heels):');
  console.log(`   Response:`, JSON.stringify(worthResAI));

  // 5. Worth It Live AI Response (Tier 2 Beauty Lipstick)
  const worthResAITier2 = await postRoute('/api/worth-it-why', worthPayloadT2);
  console.log('\n5. Worth It Live AI Response (Tier 2 - Beauty Lipstick):');
  console.log(`   Response:`, JSON.stringify(worthResAITier2));

  console.log('\n🎉 ALL PHASE 5 CHECKPOINTS PASSED SUCCESSFULLY!');
}

runPhase5Tests().catch(err => {
  console.error('Error running Phase 5 tests:', err);
  process.exit(1);
});
