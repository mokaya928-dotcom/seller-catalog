async function run() {
  const url = 'https://www.shoeinkenya.co.ke/products/john-foster-woven-vamp-loafer-black-brown';
  console.log('Fetching:', url);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  console.log('HTML length:', html.length);
  
  // Find all image URLs
  const r2Regex = /https:\/\/pub-[^"'\s\)]+/g;
  const matches = html.match(r2Regex) || [];
  const uniqueMatches = [...new Set(matches)];
  console.log('Unique R2 images found on product page:', uniqueMatches.length);
  uniqueMatches.forEach((m, i) => console.log(`${i + 1}: ${m}`));

  // Check if there are other images (e.g. cloudflare, cdn, etc.)
  const allImgs = html.match(/src="([^"]+)"/g) || [];
  console.log('\nAll img src tags:');
  [...new Set(allImgs)].forEach(s => console.log(s));
}

run();
