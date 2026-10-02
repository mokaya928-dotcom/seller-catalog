async function check(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  const rawImgs = html.match(/https:\/\/pub-[^"'\s\)\\]+/g) || [];
  const cleanImgs = [...new Set(rawImgs.map(u => u.replace(/\\+$/, '')))];
  console.log(`\nImages for ${url} (Total: ${cleanImgs.length}):`);
  cleanImgs.forEach((img, i) => console.log(`  ${i + 1}: ${img}`));
}

async function main() {
  await check('https://www.shoeinkenya.co.ke/products/minimal-slip-on-leather-sneaker-black');
  await check('https://www.shoeinkenya.co.ke/products/minimal-leather-sneaker-white');
  await check('https://www.shoeinkenya.co.ke/products/zopo-low-top-sneaker-tan-brown');
}

main();
