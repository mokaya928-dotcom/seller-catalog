const fs = require('fs');

const txt = fs.readFileSync('./src/data/starterData.js', 'utf8');
const regex = /"category":\s*"([^"]+)"/g;
let m;
const counts = {};
while ((m = regex.exec(txt)) !== null) {
  counts[m[1]] = (counts[m[1]] || 0) + 1;
}
console.log('Categories in starterData.js:', counts);

if (fs.existsSync('./src/data/orewaProducts.json')) {
  const orewa = JSON.parse(fs.readFileSync('./src/data/orewaProducts.json', 'utf8'));
  const orewaCounts = {};
  orewa.forEach(p => {
    orewaCounts[p.category] = (orewaCounts[p.category] || 0) + 1;
  });
  console.log('Categories in orewaProducts.json:', orewaCounts);
}
