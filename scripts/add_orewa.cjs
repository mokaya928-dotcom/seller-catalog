const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/data/starterData.js');
let content = fs.readFileSync(targetPath, 'utf8');

if (!content.includes('OREWA_SELLER')) {
  // Add import at the very top
  const importStatement = "import OREWA_RAW_PRODUCTS from './orewaProducts.json';\r\n";
  content = importStatement + content;

  // Add OREWA_SELLER and OREWA_PRODUCTS before SHOE_IN_SELLER
  const targetAnchor = "export const SHOE_IN_SELLER = {";
  const orewaBlock = `export const OREWA_SELLER = {
  id: 'seller_orewa_limited',
  shop_name: 'Orewa Limited',
  location: 'Nairobi CBD • 2-hr Express Delivery | Countrywide Dispatch',
  phone: '+254 118 926 934',
  phone_raw: '254118926934',
  brand_color: '#0e5e6f',
  brand_secondary: '#e5a93b',
  palette: 'deep_teal_gold',
  brand_font: 'Outfit',
  language: 'kenyan_mix',
  mpesa_till: '118926',
  mpesa_type: 'Buy Goods Till',
  delivery_info: 'Same-day 2-hr delivery in Nairobi • Fast countrywide dispatch • Pay on Delivery available',
  website: 'https://orewa.co.ke'
};

export const OREWA_PRODUCTS = OREWA_RAW_PRODUCTS.map((p) => ({
  ...p,
  seller_id: 'seller_orewa_limited',
  in_stock: true,
  featured: p.badge === 'BESTSELLER' || p.badge === 'TOP RATED'
}));

`;

  content = content.replace(targetAnchor, orewaBlock + targetAnchor);
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log('Successfully updated starterData.js with OREWA_SELLER and OREWA_PRODUCTS');
} else {
  console.log('starterData.js already contains OREWA_SELLER');
}
