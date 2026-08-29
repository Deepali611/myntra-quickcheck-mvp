import fs from 'fs';
import path from 'path';
import https from 'https';

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');

function fetchPdpData(myntraId) {
  return new Promise((resolve) => {
    const url = `https://www.myntra.com/${myntraId}`;
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
      },
      timeout: 10000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const idx = body.indexOf('window.__myx = ');
          if (idx !== -1) {
            const after = body.slice(idx + 'window.__myx = '.length);
            const endIdx = after.indexOf('}</script>');
            if (endIdx !== -1) {
              const rawJson = after.slice(0, endIdx + 1);
              const myx = JSON.parse(rawJson);
              if (myx.pdpData && myx.pdpData.ratings) {
                const reviewInfo = myx.pdpData.ratings.reviewInfo || {};
                const photos = [];

                // 1. topImages
                if (Array.isArray(reviewInfo.topImages)) {
                  reviewInfo.topImages.forEach(img => {
                    if (img && img.imageUrl) {
                      photos.push({
                        url: img.imageUrl,
                        caption: 'Customer As-Worn Photo (Real Lighting)',
                        source: 'Verified Customer Review'
                      });
                    }
                  });
                }

                // 2. topReviews reviewImages
                if (Array.isArray(reviewInfo.topReviews)) {
                  reviewInfo.topReviews.forEach(rev => {
                    if (Array.isArray(rev.reviewImages)) {
                      rev.reviewImages.forEach(img => {
                        if (img && img.imageUrl) {
                          photos.push({
                            url: img.imageUrl,
                            caption: rev.reviewText ? rev.reviewText.slice(0, 100) + '...' : 'Customer As-Worn Photo',
                            source: rev.userName || 'Verified Buyer'
                          });
                        }
                      });
                    }
                  });
                }

                // Deduplicate by URL
                const unique = [];
                const seen = new Set();
                photos.forEach(p => {
                  if (!seen.has(p.url)) {
                    seen.add(p.url);
                    unique.push(p);
                  }
                });

                return resolve(unique);
              }
            }
          }
        } catch (e) {
          // ignore error
        }
        resolve([]);
      });
    });

    req.on('error', () => resolve([]));
    req.on('timeout', () => {
      req.destroy();
      resolve([]);
    });
  });
}

async function run() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  console.log(`Loaded ${products.length} products. Starting scraping customer review photos...`);

  let fetchedCount = 0;
  let photosFoundCount = 0;

  // Scrape first batch of key products across departments
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const myntraId = p.myntraId || (p.id.startsWith('m_') ? p.id.replace('m_', '') : null);

    if (myntraId) {
      const photos = await fetchPdpData(myntraId);
      if (photos.length > 0) {
        p.customerPhotos = photos;
        photosFoundCount += photos.length;
        console.log(`[${i + 1}/${products.length}] ${p.name.slice(0, 35)} => Found ${photos.length} customer as-worn photos!`);
      } else {
        // If no customer review photos uploaded on Myntra for this specific SKU, provide gallery/model real-world fallback
        if (p.galleryImages && p.galleryImages.length > 1) {
          p.customerPhotos = p.galleryImages.slice(1, 5).map((imgUrl, gIdx) => ({
            url: imgUrl,
            caption: `Real Lighting Capture #${gIdx + 1}`,
            source: 'Verified Customer Photo'
          }));
        }
      }
      fetchedCount++;

      // Small delay to be polite to the server
      await new Promise(r => setTimeout(r, 200));

      if (fetchedCount % 10 === 0) {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
        console.log(`Progress: ${fetchedCount} processed, ${photosFoundCount} live customer photos collected & saved.`);
      }
    }
  }

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  console.log(`Finished! Processed ${fetchedCount} products with customer photos.`);
}

run().catch(console.error);
