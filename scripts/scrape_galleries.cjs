const fs = require('fs');
const path = require('path');

const shoesFile = path.join(__dirname, 'scraped_shoes.json');
const shoes = JSON.parse(fs.readFileSync(shoesFile, 'utf8'));

// Slugify helper matching shoeinkenya URL structure
function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/[–—]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fetchGallery(slug) {
  const url = `https://www.shoeinkenya.co.ke/products/${slug}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return null;
    const html = await res.text();
    const rawImgs = html.match(/https:\/\/pub-[^"'\s\)\\]+/g) || [];
    const cleanImgs = [...new Set(rawImgs.map(u => u.replace(/\\+$/, '')))];
    return cleanImgs.length > 0 ? cleanImgs : null;
  } catch (e) {
    return null;
  }
}

async function main() {
  console.log(`Starting gallery scraping for ${shoes.length} shoes...`);
  let updatedCount = 0;
  const concurrency = 8;

  for (let i = 0; i < shoes.length; i += concurrency) {
    const chunk = shoes.slice(i, i + concurrency);
    await Promise.all(chunk.map(async (shoe) => {
      const slug = toSlug(shoe.name);
      let gallery = await fetchGallery(slug);
      
      // If direct slug fails, try alternate variations
      if (!gallery && slug.includes('loafer')) {
        gallery = await fetchGallery(slug.replace(/loafer/g, 'loafers'));
      }
      if (!gallery && slug.includes('loafers')) {
        gallery = await fetchGallery(slug.replace(/loafers/g, 'loafer'));
      }
      if (!gallery && slug.includes('sneaker')) {
        gallery = await fetchGallery(slug.replace(/sneaker/g, 'sneakers'));
      }

      if (gallery && gallery.length > 1) {
        // Ensure primary photo is first
        const ordered = [shoe.photo, ...gallery.filter(u => u !== shoe.photo)];
        shoe.photos = ordered;
        updatedCount++;
      } else if (!shoe.photos || shoe.photos.length === 0) {
        shoe.photos = [shoe.photo];
      }
    }));

    process.stdout.write(`Processed ${Math.min(i + concurrency, shoes.length)}/${shoes.length} (updated ${updatedCount} with multi-images)\r`);
  }

  console.log(`\nDone! Total shoes with multi-image galleries: ${updatedCount}/${shoes.length}`);
  fs.writeFileSync(shoesFile, JSON.stringify(shoes, null, 2));
}

main().catch(console.error);
