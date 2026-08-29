import https from 'https';

async function testFetch(myntraId) {
  const url = `https://www.myntra.com/${myntraId}`;

  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const idx = body.indexOf('window.__myx = ');
        if (idx !== -1) {
          const after = body.slice(idx + 'window.__myx = '.length);
          const endIdx = after.indexOf('}</script>');
          if (endIdx !== -1) {
            const rawJson = after.slice(0, endIdx + 1);
            try {
              const myx = JSON.parse(rawJson);
              console.log('myx keys:', Object.keys(myx));
              if (myx.pdpData) {
                console.log('pdpData keys:', Object.keys(myx.pdpData));
                if (myx.pdpData.ratings) {
                  console.log('ratings:', JSON.stringify(myx.pdpData.ratings, null, 2));
                }
                if (myx.pdpData.ugc) {
                  console.log('ugc:', JSON.stringify(myx.pdpData.ugc, null, 2));
                }
                if (myx.pdpData.media) {
                  console.log('media albums:', myx.pdpData.media.albums?.map(a => ({ name: a.name, count: a.images?.length })));
                }
                // Check if reviews or user photos exist
                const userPhotoRegex = /https:\/\/assets\.myntassets\.com\/[^\"\'\s]+(review|ugc|user|customer)[^\"\'\s]+\.jpg/gi;
                const matches = body.match(userPhotoRegex);
                console.log('Regex user review photo matches in whole page:', matches);
              }
            } catch (e) {
              console.log('Parse error:', e.message);
            }
          }
        }
        resolve();
      });
    });
    req.on('error', reject);
  });
}

testFetch('39187946').catch(console.error);
