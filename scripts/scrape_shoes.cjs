const fs = require('fs');

async function scrapePage(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await res.text();
    return html;
  } catch (e) {
    console.error('Error fetching', url, e.message);
    return '';
  }
}

function decodeHtml(str = '') {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function parseProducts(html, defaultCat) {
  const products = [];
  const articleRegex = /<article[\s\S]*?<\/article>/gi;
  const articles = html.match(articleRegex) || [];

  for (const art of articles) {
    const imgMatch = art.match(/src="(https:\/\/pub-[^"]+)"/i) || art.match(/src="([^"]+\.(?:png|jpg|jpeg|webp)[^"]*)"/i);
    const photo = imgMatch ? imgMatch[1] : '';

    const titleMatch = art.match(/<h2[^>]*>([^<]+)<\/h2>/i);
    const rawName = titleMatch ? titleMatch[1].trim() : '';
    const name = decodeHtml(rawName);

    const priceMatch = art.match(/KES\s*([\d,]+)/i);
    const price = priceMatch ? Number(priceMatch[1].replace(/,/g, '')) : 0;

    const descMatch = art.match(/<p[^>]*>([^<]+)<\/p>/gi);
    let desc = '';
    if (descMatch && descMatch.length > 1) {
      desc = decodeHtml(descMatch[1].replace(/<[^>]+>/g, '').trim());
      // Remove trailing ellipses if abrupt
      desc = desc.replace(/\.{3,}$/, '').trim();
    }

    if (name && photo && price) {
      const isOfficial = name.toLowerCase().includes('loafer') || 
                         name.toLowerCase().includes('derby') || 
                         name.toLowerCase().includes('oxford') || 
                         name.toLowerCase().includes('monk') ||
                         defaultCat === "Men's Footwear";
      
      const category = isOfficial ? "Men's Footwear" : "Sneakers & Kicks";

      const id = 'prod_shoein_' + name.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 32);

      const benefitLine = desc 
        ? `${desc}`
        : (isOfficial 
            ? 'Hand-finished pure leather tailored for executive and formal elegance'
            : 'Comfortable cushioned sole with responsive grip built for all-day city wear');

      products.push({
        id,
        seller_id: 'seller_beauty_bar_kenya',
        name,
        size: 'EU 40 - 45',
        photo,
        photos: [photo],
        price,
        regular_price: Math.round((price * 1.18) / 100) * 100,
        benefit_line: benefitLine,
        in_stock: true,
        featured: products.length < 5,
        badge: products.length === 0 ? 'Bestseller 🔥' : products.length === 1 ? 'New Arrival ⚡' : '',
        category,
        ingredients: 'Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole',
        highlights: [
          '100% Genuine Materials',
          'Fast Nairobi Same-Day Dispatch',
          'Countrywide Parcels via Fargo / G4S',
          'Lipa na M-Pesa Available'
        ]
      });
    }
  }

  return products;
}

async function main() {
  console.log('Fetching shoe products from shoeinkenya.co.ke...');
  const [homeHtml, sneakersHtml, officialHtml, casualHtml] = await Promise.all([
    scrapePage('https://shoeinkenya.co.ke/'),
    scrapePage('https://shoeinkenya.co.ke/products/category/sneakers'),
    scrapePage('https://shoeinkenya.co.ke/products/category/official'),
    scrapePage('https://shoeinkenya.co.ke/products/category/casual')
  ]);

  const all = [
    ...parseProducts(homeHtml, 'Sneakers & Kicks'),
    ...parseProducts(sneakersHtml, 'Sneakers & Kicks'),
    ...parseProducts(officialHtml, "Men's Footwear"),
    ...parseProducts(casualHtml, 'Sneakers & Kicks')
  ];

  // Deduplicate by name
  const seen = new Set();
  const deduped = [];
  for (const p of all) {
    if (!seen.has(p.name)) {
      seen.add(p.name);
      deduped.push(p);
    }
  }

  console.log(`Total scraped unique shoes: ${deduped.length}`);
  fs.writeFileSync('scripts/scraped_shoes.json', JSON.stringify(deduped, null, 2));
  console.log('Saved to scripts/scraped_shoes.json');
}

main();
