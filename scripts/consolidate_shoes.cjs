const fs = require('fs');
const path = require('path');

const dummyUrls = [
  'slipon1.png', 'santoni1.jpeg', 'santoni2.jpeg', 'Black%20Striped%20Leather%20Loafer.jpeg',
  'Clarks%20Perforated%20Leather%20Loafer%20Black.jpeg', 'slipon4.png', 'slipon5.png'
];

function isRealPhoto(url) {
  if (!url) return false;
  return !dummyUrls.some(d => url.includes(d));
}

const colorWords = ['Dark-tan', 'Dark Tan', 'Dark Brown', 'Black', 'Brown', 'Burgundy', 'Navy', 'Olive', 'Grey', 'Gray', 'White', 'Tan', 'Beige', 'Cognac'];

function extractColor(name) {
  for (const c of colorWords) {
    const reg = new RegExp('\\b' + c.replace('-', '[\\s-]') + '\\b', 'i');
    if (reg.test(name)) return c;
  }
  return null;
}

function cleanBaseName(name) {
  let base = name;
  for (const c of colorWords) {
    const reg = new RegExp('\\b' + c.replace('-', '[\\s-]') + '\\b', 'gi');
    base = base.replace(reg, '');
  }
  base = base
    .replace(/[–—\-]/g, ' ')
    .replace(/\s*&\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+(in|with)\s*$/i, '')
    .trim();
  base = base.replace(/\b(\w+)\s+\1\b/gi, '$1');
  if (base.toLowerCase().startsWith('medallion')) {
    base = 'Executive Medallion Oxford (White Sole)';
  } else if (base.toLowerCase().startsWith('perforated penny')) {
    base = 'Executive Perforated Penny Loafer (White Sole)';
  } else if (base.toLowerCase().startsWith('crocodile cap toe')) {
    base = 'Crocodile Cap-Toe Oxford (White Sole)';
  } else if (base.toLowerCase() === 'suede loafer') {
    base = 'Classic Italian Suede Loafers';
  } else if (base.toLowerCase() === 'pebble leather penny loafer') {
    base = 'Pebble Leather Penny Loafers';
  }
  return base;
}

const starterDataFile = path.resolve(__dirname, '../src/data/starterData.js');
let starterContent = fs.readFileSync(starterDataFile, 'utf8');

const headerAnchor = 'export const CURATED_PRODUCTS = [';
const headerIdx = starterContent.indexOf(headerAnchor);
if (headerIdx === -1) {
  console.error('CURATED_PRODUCTS not found in starterData.js');
  process.exit(1);
}

const footerAnchor = '];\r\n\r\nexport const STARTER_PRODUCTS = CURATED_PRODUCTS;';
let footerIdx = starterContent.indexOf(footerAnchor);
if (footerIdx === -1) {
  footerIdx = starterContent.indexOf('];\n\nexport const STARTER_PRODUCTS = CURATED_PRODUCTS;');
}

const productsJsonStr = starterContent.slice(headerIdx + headerAnchor.length - 1, footerIdx + 1);
const CURATED_PRODUCTS = eval('(' + productsJsonStr + ')');

const shoeProducts = CURATED_PRODUCTS.filter(p => 
  p.category === 'Sneakers & Kicks' || 
  p.category === "Men's Footwear" || 
  p.seller_id === 'seller_shoe_in_kenya' ||
  (p.name && (p.name.includes('Loafer') || p.name.includes('Oxford') || p.name.includes('Sneaker') || p.name.includes('Derby') || p.name.includes('Brogue') || p.name.includes('Foster')))
);

const nonShoeProducts = CURATED_PRODUCTS.filter(p => !shoeProducts.includes(p));

console.log('Total CURATED_PRODUCTS:', CURATED_PRODUCTS.length);
console.log('Shoe products found:', shoeProducts.length);
console.log('Non-shoe products preserved:', nonShoeProducts.length);

// Group shoes by base model
const groups = new Map();
for (const s of shoeProducts) {
  const base = cleanBaseName(s.name);
  if (!groups.has(base)) groups.set(base, []);
  groups.get(base).push(s);
}

console.log('Grouped into distinct shoe models:', groups.size);

const consolidatedShoes = [];

for (const [modelName, items] of groups.entries()) {
  const leadItem = items[0];
  
  // Extract all real photos
  const realPhotos = [];
  for (const it of items) {
    if (it.photo && isRealPhoto(it.photo) && !realPhotos.includes(it.photo)) {
      realPhotos.push(it.photo);
    }
    if (Array.isArray(it.photos)) {
      for (const ph of it.photos) {
        if (ph && isRealPhoto(ph) && !realPhotos.includes(ph)) {
          realPhotos.push(ph);
        }
      }
    }
  }

  const finalPhotos = realPhotos.length > 0 ? realPhotos : [leadItem.photo];
  const colors = [...new Set(items.map(i => extractColor(i.name)).filter(Boolean))];

  let benefitLine = leadItem.benefit_line || '';
  if (colors.length > 1) {
    benefitLine = `Available in ${colors.slice(0, -1).join(', ')} & ${colors.slice(-1)} • Handcrafted genuine leather`;
  } else if (!benefitLine) {
    benefitLine = leadItem.category === "Men's Footwear" 
      ? 'Hand-finished pure leather tailored for executive and formal elegance'
      : 'Comfortable cushioned sole with responsive grip built for all-day wear';
  }

  let description = `${modelName}. `;
  if (colors.length > 1) {
    description += `Available in ${colors.join(', ')}. `;
  }
  description += `Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.`;

  consolidatedShoes.push({
    id: leadItem.id,
    seller_id: 'seller_beauty_bar_kenya',
    name: modelName,
    size: leadItem.size || 'EU 40 - 45',
    photo: finalPhotos[0],
    photos: finalPhotos,
    colors: colors,
    price: leadItem.price || 5500,
    regular_price: leadItem.regular_price || Math.round(((leadItem.price || 5500) * 1.18) / 100) * 100,
    benefit_line: benefitLine,
    in_stock: true,
    featured: leadItem.featured ?? false,
    badge: colors.length > 1 ? `${colors.length} COLORS AVAILABLE` : (leadItem.badge || ''),
    category: leadItem.category || "Men's Footwear",
    ingredients: 'Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole',
    highlights: [
      colors.length > 1 ? `Available in ${colors.join(', ')}` : '100% Genuine Materials',
      'Fast Nairobi Same-Day Dispatch',
      'Countrywide Parcels via Fargo / G4S',
      'Lipa na M-Pesa Available'
    ],
    description: description,
    how_to_use: leadItem.how_to_use || (leadItem.category === "Men's Footwear"
      ? 'Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look.'
      : 'Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style.')
  });
}

console.log('Total consolidated shoes:', consolidatedShoes.length);

const allMerged = [...consolidatedShoes, ...nonShoeProducts];
console.log('Total final products:', allMerged.length);

// Write back to starterData.js
const header = starterContent.slice(0, headerIdx + headerAnchor.length);
const formattedProducts = JSON.stringify(allMerged, null, 2);
const footer = `\n];\n\nexport const STARTER_PRODUCTS = CURATED_PRODUCTS;\nexport const SHOE_IN_PRODUCTS = CURATED_PRODUCTS.filter((p) => p.category === 'Sneakers & Kicks' || p.category === "Men's Footwear");\n`;

const newStarterContent = header + '\n' + formattedProducts.slice(1, formattedProducts.length - 1).trim() + footer;
fs.writeFileSync(starterDataFile, newStarterContent, 'utf8');

// Also save to scraped_shoes.json
fs.writeFileSync(path.resolve(__dirname, 'scraped_shoes.json'), JSON.stringify(consolidatedShoes, null, 2), 'utf8');

console.log('Successfully updated starterData.js with consolidated shoes!');
