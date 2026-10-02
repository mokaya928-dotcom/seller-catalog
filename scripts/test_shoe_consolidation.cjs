const fs = require('fs');

const dummyUrls = [
  'slipon1.png', 'santoni1.jpeg', 'santoni2.jpeg', 'Black%20Striped%20Leather%20Loafer.jpeg',
  'Clarks%20Perforated%20Leather%20Loafer%20Black.jpeg', 'slipon4.png', 'slipon5.png'
];

function isRealPhoto(url) {
  if (!url) return false;
  return !dummyUrls.some(d => url.includes(d));
}

const shoes = JSON.parse(fs.readFileSync('scripts/scraped_shoes.json', 'utf8'));

// Extract color from name
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
  // Clean double words like 'Loafer Loafer'
  base = base.replace(/\b(\w+)\s+\1\b/gi, '$1');
  return base;
}

const groups = new Map();

for (const s of shoes) {
  const base = cleanBaseName(s.name);
  if (!groups.has(base)) groups.set(base, []);
  groups.get(base).push(s);
}

console.log('Total original shoes:', shoes.length);
console.log('Grouped distinct models:', groups.size);

const multi = [];
for (const [base, items] of groups.entries()) {
  if (items.length > 1) {
    multi.push({ base, items });
  }
}
console.log('Models with multiple variants/colors:', multi.length);

console.log('\nSample Consolidated Models:');
multi.slice(0, 10).forEach(({ base, items }) => {
  const colors = [...new Set(items.map(i => extractColor(i.name)).filter(Boolean))];
  const realPhotos = items.map(i => i.photo).filter(isRealPhoto);
  console.log(`\n• Model: "${base}"`);
  console.log(`  Colors (${colors.length}):`, colors.join(', '));
  console.log(`  Original titles:`, items.map(i => i.name));
  console.log(`  Real Photos (${realPhotos.length}):`, realPhotos);
});
