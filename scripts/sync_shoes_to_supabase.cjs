const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://defscyklpfplekodvqij.supabase.co';
const supabaseKey = 'sb_publishable_mjefnWB9ehkH3m7AaAfdow_BH9gOuCO';
const supabase = createClient(supabaseUrl, supabaseKey);

const shoes = JSON.parse(fs.readFileSync(path.join(__dirname, 'scraped_shoes.json'), 'utf8'));

console.log(`Starting upload of ${shoes.length} shoes to Supabase...`);

async function syncShoes() {
  const batchSize = 25;
  let successCount = 0;

  for (let i = 0; i < shoes.length; i += batchSize) {
    const batch = shoes.slice(i, i + batchSize).map(s => ({
      ...s,
      seller_id: 'seller_beauty_bar_kenya',
      photos: Array.isArray(s.photos) && s.photos.length > 0 ? s.photos : [s.photo],
      in_stock: true,
      description: s.description || `${s.name}. ${s.benefit_line} Premium quality footwear offering superior durability, cloud-comfort cushioning, and modern style.`,
      how_to_use: s.how_to_use || (s.category === "Men's Footwear" 
        ? 'Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look.' 
        : 'Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style.')
    }));

    const { data, error } = await supabase.from('products').upsert(batch, { onConflict: 'id' }).select();
    if (error) {
      console.error(`Error in batch ${i} - ${i + batch.length}:`, error);
    } else {
      successCount += (data ? data.length : batch.length);
      console.log(`Synced batch ${i + 1} to ${Math.min(i + batchSize, shoes.length)} (${successCount}/${shoes.length})`);
    }
  }

  console.log(`Finished syncing! Total shoes uploaded to Supabase: ${successCount}`);

  // Check new total products in Supabase
  const { data: allProds } = await supabase.from('products').select('category');
  const cats = {};
  if (allProds) {
    allProds.forEach(p => cats[p.category] = (cats[p.category] || 0) + 1);
  }
  console.log('New categories in Supabase:');
  console.log(cats);
  console.log('Total products in Supabase:', allProds ? allProds.length : 0);
}

syncShoes().catch(console.error);
