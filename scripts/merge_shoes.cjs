const fs = require('fs');
const path = require('path');

const starterDataFile = path.join(__dirname, '../src/data/starterData.js');
const scrapedShoesFile = path.join(__dirname, 'scraped_shoes.json');

const content = fs.readFileSync(starterDataFile, 'utf8');
const headerIdx = content.indexOf('export const CURATED_PRODUCTS = [');
if (headerIdx === -1) {
  console.error('Could not find CURATED_PRODUCTS declaration in starterData.js');
  process.exit(1);
}

const header = content.slice(0, headerIdx + 'export const CURATED_PRODUCTS = [\n'.length);

// Require current CURATED_PRODUCTS
const { CURATED_PRODUCTS } = require('../src/data/starterData.js');
const shoes = JSON.parse(fs.readFileSync(scrapedShoesFile, 'utf8'));

// Filter out old 10 shoe products
const nonShoes = CURATED_PRODUCTS.filter(p => !(
  p.category === 'Sneakers & Kicks' || 
  p.category === "Men's Footwear" || 
  p.seller_id === 'seller_shoe_in_kenya'
));

console.log('Existing non-shoe products:', nonShoes.length);
console.log('Scraped shoes to merge:', shoes.length);

const preparedShoes = shoes.map(s => ({
  ...s,
  seller_id: 'seller_beauty_bar_kenya',
  description: s.description || `${s.name}. ${s.benefit_line} Premium quality footwear offering superior durability, cloud-comfort cushioning, and modern style.`,
  how_to_use: s.how_to_use || (s.category === "Men's Footwear" 
    ? 'Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look.' 
    : 'Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style.')
}));

const mergedProducts = [...preparedShoes, ...nonShoes];

console.log('Total merged products:', mergedProducts.length);

// Build new starterData.js content
const formattedProducts = JSON.stringify(mergedProducts, null, 2);

const footer = `\n];\n\nexport const STARTER_PRODUCTS = CURATED_PRODUCTS;\nexport const SHOE_IN_PRODUCTS = CURATED_PRODUCTS.filter((p) => p.category === 'Sneakers & Kicks' || p.category === "Men's Footwear");\n`;

// Format cleanly as JS export
const newContent = header + formattedProducts.slice(1, formattedProducts.length - 1).trim() + footer;

fs.writeFileSync(starterDataFile, newContent, 'utf8');
console.log('Successfully updated src/data/starterData.js with 159 scraped shoes and 194 other products!');
