const fs = require('fs');
const path = require('path');
const { CURATED_PRODUCTS, BEAUTY_BAR_SELLER, TIME_SLOTS } = require('../src/data/starterData.js');

console.log('Generating preview_admin.html with full admin dashboard...');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Admin Dashboard • The Beauty Bar Kenya & Multi-Merchant Store</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Cinzel:wght@600;700;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Outfit', sans-serif; }
    .font-brand { font-family: 'Cinzel', serif; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="bg-slate-100 text-slate-900 min-h-screen antialiased">

  <!-- Admin View Container -->
  <div class="max-w-md mx-auto bg-slate-50 min-h-screen shadow-2xl relative border-x border-slate-200 flex flex-col pb-24">

    <!-- Admin Header -->
    <header class="sticky top-0 z-30 bg-emerald-900 text-white px-4 py-3 shadow-md border-b border-emerald-800">
      <div class="flex items-center justify-between gap-2">
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="text-xs bg-emerald-800 px-2 py-0.5 rounded font-black text-amber-300 uppercase tracking-wider">Owner Admin</span>
            <span class="text-xs text-emerald-300">● Live Cloud Sync</span>
          </div>
          <h1 class="text-base font-black tracking-tight leading-snug truncate mt-0.5 font-brand text-white">
            The Beauty Bar Kenya
          </h1>
          <p class="text-[11px] text-emerald-200/90 truncate flex items-center gap-1 mt-0.5">
            <span>📍 Jamia Mall Shop F47, Nairobi CBD</span>
            <span>• Till: <strong>582910</strong></span>
          </p>
        </div>

        <div class="flex items-center gap-1.5 flex-shrink-0">
          <!-- View Public Catalogue Button -->
          <a 
            href="/?view=catalog" 
            target="_blank"
            class="px-2.5 py-1.5 rounded-xl bg-white text-emerald-950 font-black text-xs hover:bg-emerald-50 transition shadow-xs flex items-center gap-1 active:scale-95"
            title="Open customer storefront catalogue"
          >
            <span>👁️</span>
            <span>Customer View</span>
          </a>
        </div>
      </div>
    </header>

    <!-- Top Admin Navigation Tabs -->
    <nav class="bg-white border-b border-slate-200 px-3 py-1.5 sticky top-[68px] z-20 shadow-xs flex items-center justify-between">
      <div class="flex items-center gap-1 w-full">
        <button 
          onclick="switchTab('today')" 
          id="tab-btn-today" 
          class="flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 bg-emerald-900 text-white shadow-xs"
        >
          <span>⚡</span>
          <span>Today Posts</span>
        </button>
        <button 
          onclick="switchTab('products')" 
          id="tab-btn-products" 
          class="flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 text-slate-600 hover:bg-slate-100"
        >
          <span>📦</span>
          <span>Products (<span id="prod-total-badge">362</span>)</span>
        </button>
        <button 
          onclick="switchTab('settings')" 
          id="tab-btn-settings" 
          class="flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 text-slate-600 hover:bg-slate-100"
        >
          <span>⚙️</span>
          <span>Store Info</span>
        </button>
      </div>
    </nav>

    <!-- TAB 1: TODAY'S 5 TIME SLOTS MARKETING (DAILY POSTS) -->
    <main id="tab-today" class="p-4 space-y-4">
      <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start justify-between gap-3">
        <div class="text-xs">
          <h2 class="font-black text-emerald-950 flex items-center gap-1">
            <span>📅</span>
            <span>Today's WhatsApp Status Schedule</span>
          </h2>
          <p class="text-[11px] text-emerald-800 mt-0.5">
            5 scheduled high-converting marketing drops for WhatsApp Status & Stories.
          </p>
        </div>
        <span class="text-[10px] font-black bg-emerald-700 text-white px-2 py-0.5 rounded-full whitespace-nowrap">Auto-Generated</span>
      </div>

      <!-- 5 Marketing Slots -->
      <div class="space-y-3.5" id="slots-container">
        <!-- Rendered by JS -->
      </div>
    </main>

    <!-- TAB 2: PRODUCTS INVENTORY MANAGER -->
    <main id="tab-products" class="hidden p-4 space-y-3">
      <!-- Search & Add Bar -->
      <div class="flex items-center gap-2">
        <div class="relative flex-1">
          <input 
            id="admin-search" 
            type="text" 
            oninput="handleAdminSearch(this.value)"
            placeholder="Search 362 items across shoes, bags, beauty..." 
            class="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-emerald-600 outline-none shadow-xs"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
        <button 
          onclick="alert('To add a product, use the React app or upload via CSV/Supabase.')" 
          class="px-3.5 py-2.5 rounded-2xl bg-emerald-800 text-white font-black text-xs hover:bg-emerald-900 transition flex items-center gap-1.5 flex-shrink-0 shadow-xs"
        >
          <span>+</span>
          <span>Add</span>
        </button>
      </div>

      <!-- Category Filter Pills (In Logical Pitch Order) -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button onclick="setAdminCat('All')" id="acat-All" class="acat-btn px-3 py-1.5 rounded-full font-bold whitespace-nowrap bg-slate-900 text-white shadow-xs">✨ All</button>
        <button onclick="setAdminCat('All Shoes & Kicks')" id="acat-Shoes" class="acat-btn px-3 py-1.5 rounded-full font-bold whitespace-nowrap bg-white text-slate-700 border border-slate-200 hover:bg-slate-50">👟 Shoes (159)</button>
        <button onclick="setAdminCat('Handbags & Bags')" id="acat-Bags" class="acat-btn px-3 py-1.5 rounded-full font-bold whitespace-nowrap bg-white text-slate-700 border border-slate-200 hover:bg-slate-50">👜 Handbags (84)</button>
        <button onclick="setAdminCat('Lip Care')" id="acat-Lip" class="acat-btn px-3 py-1.5 rounded-full font-bold whitespace-nowrap bg-white text-slate-700 border border-slate-200 hover:bg-slate-50">💄 Lip Care (18)</button>
        <button onclick="setAdminCat('Makeup & Prep')" id="acat-Makeup" class="acat-btn px-3 py-1.5 rounded-full font-bold whitespace-nowrap bg-white text-slate-700 border border-slate-200 hover:bg-slate-50">👑 Makeup (30)</button>
        <button onclick="setAdminCat('Skincare & Face')" id="acat-Skin" class="acat-btn px-3 py-1.5 rounded-full font-bold whitespace-nowrap bg-white text-slate-700 border border-slate-200 hover:bg-slate-50">🧴 Skincare (29)</button>
        <button onclick="setAdminCat('Serums & Actives')" id="acat-Serums" class="acat-btn px-3 py-1.5 rounded-full font-bold whitespace-nowrap bg-white text-slate-700 border border-slate-200 hover:bg-slate-50">🧪 Serums (24)</button>
        <button onclick="setAdminCat('Fashion & Outfits')" id="acat-Fashion" class="acat-btn px-3 py-1.5 rounded-full font-bold whitespace-nowrap bg-white text-slate-700 border border-slate-200 hover:bg-slate-50">👗 Fashion (4)</button>
        <button onclick="setAdminCat('Bedding & Home')" id="acat-Home" class="acat-btn px-3 py-1.5 rounded-full font-bold whitespace-nowrap bg-white text-slate-700 border border-slate-200 hover:bg-slate-50">🛏️ Bedding (4)</button>
      </div>

      <!-- Products Inventory List -->
      <div id="admin-products-list" class="space-y-2 pt-1">
        <!-- Rendered by JS -->
      </div>
    </main>

    <!-- TAB 3: STORE INFO & M-PESA SETTINGS -->
    <main id="tab-settings" class="hidden p-4 space-y-4">
      <div class="bg-white rounded-3xl border border-slate-200 p-4 space-y-3 shadow-xs">
        <h3 class="font-black text-sm text-slate-900 flex items-center gap-1.5">
          <span>🏪</span>
          <span>Store Identity & Business Profile</span>
        </h3>

        <div class="space-y-2 text-xs">
          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Shop Name</label>
            <input type="text" value="The Beauty Bar Kenya" class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold" />
          </div>

          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Shop Location</label>
            <input type="text" value="Jamia Mall, Shop F47 (1st Flr), Nairobi CBD" class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">WhatsApp / Phone</label>
              <input type="text" value="+254 728 222 211" class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold" />
            </div>
            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">M-Pesa Till Number</label>
              <input type="text" value="582910" class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-emerald-700" />
            </div>
          </div>

          <div>
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Delivery Info Text</label>
            <input type="text" value="Nairobi Same-Day Boda • Countrywide Fargo / G4S Delivery" class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold" />
          </div>
        </div>

        <button onclick="alert('Settings saved locally!')" class="w-full py-3 rounded-2xl bg-emerald-900 text-white font-black text-xs hover:bg-emerald-950 transition active:scale-98 shadow-sm">
          Save Profile Updates
        </button>
      </div>

      <div class="p-4 bg-slate-900 text-slate-200 rounded-3xl space-y-2 text-xs">
        <h4 class="font-black text-emerald-400 flex items-center gap-1.5">
          <span>🔒</span>
          <span>Security PIN</span>
        </h4>
        <p class="text-[11px] text-slate-400">
          Default Owner PIN to unlock Admin mode on new mobile devices:
        </p>
        <div class="text-base font-mono font-black text-white bg-slate-800 p-2 rounded-xl text-center border border-slate-700">
          1234
        </div>
      </div>
    </main>

  </div>

  <!-- Raw Products & Data -->
  <script>
    const RAW_PRODUCTS = ${JSON.stringify(CURATED_PRODUCTS, null, 2)};

    function normalizeCat(c) {
      if (!c) return 'Skincare & Face';
      const cat = c.trim();
      if (cat === 'Skincare' || cat === 'Korean Skincare & Serums' || cat === 'Korean Skincare') return 'Skincare & Face';
      if (cat === 'Classic Clothes' || cat === 'Clothes' || cat === 'Fashion') return 'Fashion & Outfits';
      if (cat === 'Household & Bedding' || cat === 'Household & Kitchen' || cat === 'Household') return 'Bedding & Home';
      return cat;
    }

    const PRODUCTS = RAW_PRODUCTS.map(p => ({
      ...p,
      category: normalizeCat(p.category)
    }));

    document.getElementById('prod-total-badge').innerText = PRODUCTS.length;

    // Slot definitions
    const SLOTS = [
      { id: 'morning_rush', time: '09:00 AM', label: 'Morning Commute & Office Browse', icon: '☀️' },
      { id: 'lunch_break', time: '12:30 PM', label: 'Lunchtime Shoppers & Quick Inquiries', icon: '⏰' },
      { id: 'afternoon_boost', time: '03:30 PM', label: 'Afternoon Pick-Me-Up & Restock', icon: '✨' },
      { id: 'evening_transit', time: '06:30 PM', label: 'Evening Transit & Matatu Scrolling', icon: '🌆' },
      { id: 'bedtime_orders', time: '08:45 PM', label: 'Bedtime Browsing & Next-Day Delivery', icon: '🌙' }
    ];

    function renderSlots() {
      const container = document.getElementById('slots-container');
      const pickList = [
        PRODUCTS.find(p => p.category === 'All Shoes & Kicks' || p.category === 'Sneakers & Kicks') || PRODUCTS[0],
        PRODUCTS.find(p => p.category === 'Handbags & Bags') || PRODUCTS[1],
        PRODUCTS.find(p => p.category === "Men's Footwear") || PRODUCTS[2],
        PRODUCTS.find(p => p.category === 'Lip Care') || PRODUCTS[3],
        PRODUCTS.find(p => p.category === 'Skincare & Face') || PRODUCTS[4]
      ];

      container.innerHTML = SLOTS.map((slot, idx) => {
        const p = pickList[idx] || PRODUCTS[idx];
        const caption = \`\${slot.icon} \${p.name}\\n💰 Price: KES \${p.price.toLocaleString()}\\n✨ \${p.benefit_line || '100% Genuine Quality'}\\n📲 Order via WhatsApp / Lipa na M-Pesa Till: 582910\\n🚚 Nairobi Same-Day Delivery Countrywide!\`;
        
        return \`
          <div class="bg-white rounded-3xl border border-slate-200 p-3.5 shadow-xs space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-base">\${slot.icon}</span>
                <div>
                  <h4 class="text-xs font-black text-slate-900 leading-tight">\${slot.label}</h4>
                  <span class="text-[10px] font-bold text-slate-400">\${slot.time} Daily Drop</span>
                </div>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">Ready</span>
            </div>

            <div class="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-200">
              <img src="\${p.photo}" class="w-16 h-16 rounded-xl object-cover bg-white flex-shrink-0" onerror="this.src='/products/orange-soap.svg'" />
              <div class="flex-1 min-w-0">
                <span class="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">\${p.category}</span>
                <h5 class="text-xs font-black text-slate-900 truncate mt-0.5">\${p.name}</h5>
                <span class="text-xs font-black text-emerald-700">KES \${p.price.toLocaleString()}</span>
              </div>
            </div>

            <div class="flex items-center gap-2 pt-0.5">
              <button 
                onclick="copyText('\${encodeURIComponent(caption)}')" 
                class="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-black transition active:scale-95 flex items-center justify-center gap-1"
              >
                <span>📋</span>
                <span>Copy Caption</span>
              </button>
              <a 
                href="https://wa.me/?text=\${encodeURIComponent(caption)}" 
                target="_blank"
                class="flex-1 py-2 rounded-xl bg-[#25D366] text-white text-[11px] font-black transition active:scale-95 flex items-center justify-center gap-1 hover:bg-green-600"
              >
                <span>💬</span>
                <span>Post Status</span>
              </a>
            </div>
          </div>
        \`;
      }).join('');
    }

    function copyText(enc) {
      navigator.clipboard.writeText(decodeURIComponent(enc));
      alert('Caption copied to clipboard! Ready to paste into WhatsApp Status.');
    }

    let adminCat = 'All';
    let adminSearch = '';

    function renderAdminProducts() {
      const list = document.getElementById('admin-products-list');
      const filtered = PRODUCTS.filter(p => {
        if (adminCat === 'All Shoes & Kicks') {
          if (p.category !== 'Sneakers & Kicks' && p.category !== "Men's Footwear") return false;
        } else if (adminCat !== 'All' && p.category !== adminCat) {
          return false;
        }
        if (adminSearch) {
          const q = adminSearch.toLowerCase();
          const matchName = (p.name || '').toLowerCase().includes(q);
          const matchCat = (p.category || '').toLowerCase().includes(q);
          if (!matchName && !matchCat) return false;
        }
        return true;
      });

      if (filtered.length === 0) {
        list.innerHTML = \`<div class="py-8 text-center text-xs text-slate-400">No products match this filter.</div>\`;
        return;
      }

      list.innerHTML = filtered.slice(0, 100).map(p => {
        const photoCount = p.photos && p.photos.length > 1 ? p.photos.length : 1;
        return \`
          <div class="bg-white rounded-2xl border border-slate-200 p-2.5 shadow-xs flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="relative w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden">
                <img src="\${p.photo}" class="w-full h-full object-cover" onerror="this.src='/products/orange-soap.svg'" />
                \${photoCount > 1 ? \`<span class="absolute bottom-0 right-0 bg-black/70 text-white text-[7px] font-bold px-1 rounded-tl">📸\${photoCount}</span>\` : ''}
              </div>
              <div class="min-w-0">
                <span class="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block truncate">\${p.category}</span>
                <h5 class="text-xs font-black text-slate-900 truncate leading-snug">\${p.name}</h5>
                <span class="text-xs font-black text-emerald-700">KES \${p.price.toLocaleString()}</span>
              </div>
            </div>

            <div class="flex items-center gap-1.5 flex-shrink-0">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">In Stock</span>
            </div>
          </div>
        \`;
      }).join('');
    }

    function setAdminCat(cat) {
      adminCat = cat;
      document.querySelectorAll('.acat-btn').forEach(b => {
        b.className = 'acat-btn px-3 py-1.5 rounded-full font-bold whitespace-nowrap bg-white text-slate-700 border border-slate-200 hover:bg-slate-50';
      });
      event.target.className = 'acat-btn px-3 py-1.5 rounded-full font-bold whitespace-nowrap bg-slate-900 text-white shadow-xs';
      renderAdminProducts();
    }

    function handleAdminSearch(val) {
      adminSearch = val.trim();
      renderAdminProducts();
    }

    function switchTab(tab) {
      ['today', 'products', 'settings'].forEach(t => {
        const el = document.getElementById('tab-' + t);
        const btn = document.getElementById('tab-btn-' + t);
        if (t === tab) {
          el.classList.remove('hidden');
          btn.className = 'flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 bg-emerald-900 text-white shadow-xs';
        } else {
          el.classList.add('hidden');
          btn.className = 'flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 text-slate-600 hover:bg-slate-100';
        }
      });
      if (tab === 'products') renderAdminProducts();
    }

    // Init
    window.addEventListener('DOMContentLoaded', () => {
      renderSlots();
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../preview_admin.html'), htmlContent, 'utf8');
console.log('Successfully generated preview_admin.html!');
