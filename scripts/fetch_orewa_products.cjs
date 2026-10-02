const fs = require('fs');
const https = require('https');

const url = 'https://orewa.co.ke/wp-json/wc/store/v1/products?per_page=40';

https.get(url, (res) => {
  let raw = '';
  res.on('data', chunk => raw += chunk);
  res.on('end', () => {
    try {
      const items = JSON.parse(raw);
      console.log('Fetched raw items:', items.length);

      const cleanProducts = items.map((p, index) => {
        const cleanName = p.name
          .replace(/&#8217;/g, "'")
          .replace(/&amp;/g, '&')
          .replace(/&#038;/g, '&')
          .replace(/&quot;/g, '"')
          .trim();

        const cleanDesc = (p.short_description || p.description || '')
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .slice(0, 120)
          .trim() || 'Verified Authentic Formulation • In Stock Across Kenya';

        const rawPrice = Number(p.prices && p.prices.price ? p.prices.price : 0);
        const price = Math.round(rawPrice / 100);

        const images = (p.images || []).map(img => img.src).filter(Boolean);
        const heroPhoto = images[0] || '';

        const catName = (p.categories && p.categories[0] && p.categories[0].name) || 'Skincare & Beauty';

        let badge = 'VERIFIED QUALITY';
        if (index === 0) badge = 'BESTSELLER';
        else if (index === 1) badge = 'TOP RATED';
        else if (index === 2) badge = 'TRENDING NOW';
        else if (index % 5 === 0) badge = 'POPULAR';

        return {
          id: `orewa_${p.id || index}`,
          name: cleanName,
          price: price,
          category: catName,
          photo: heroPhoto,
          photos: images.length > 0 ? images : [heroPhoto],
          description: cleanDesc,
          benefit_line: '100% Original Products • 2-hr Delivery in Nairobi',
          badge: badge,
          in_stock: true,
          seller_id: 'seller_orewa_limited',
          vendor: 'Orewa Limited'
        };
      });

      fs.writeFileSync('src/data/orewaProducts.json', JSON.stringify(cleanProducts, null, 2), 'utf8');
      console.log(`Saved ${cleanProducts.length} Orewa products to src/data/orewaProducts.json`);
    } catch (err) {
      console.error('Failed to parse response:', err.message);
    }
  });
}).on('error', err => {
  console.error('HTTPS request error:', err.message);
});
