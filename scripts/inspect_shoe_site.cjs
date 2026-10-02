const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function main() {
  const html = await fetch('https://shoeinkenya.co.ke/');
  const hrefMatches = html.match(/href="([^"]+)"/g) || [];
  console.log('Sample hrefs:', [...new Set(hrefMatches)].slice(0, 25));

  // Also check article or product card markup
  const articles = html.match(/<article[\s\S]*?<\/article>/gi) || [];
  console.log('Total articles found on homepage:', articles.length);
  if (articles.length > 0) {
    console.log('First article snippet:\n', articles[0].slice(0, 500));
  }
}

main();
