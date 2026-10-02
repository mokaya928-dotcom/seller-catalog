const fs = require('fs');
const path = require('path');

const { CURATED_PRODUCTS, BEAUTY_BAR_SELLER } = require('../src/data/starterData.js');

const shoes = CURATED_PRODUCTS.filter(p => p.category === 'Sneakers & Kicks' || p.category === "Men's Footwear");
console.log(`Generating preview_shoes_catalogue.html with ${shoes.length} authentic shoes and full gallery controls...`);

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>The Beauty Bar Kenya • Shoes, Bags & Beauty Catalogue</title>
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

  <!-- Desktop Preview Wrapper Container -->
  <div class="max-w-md mx-auto bg-slate-50 min-h-screen shadow-2xl relative border-x border-slate-200 flex flex-col pb-24">

    <!-- Store Header (Main Storefront) -->
    <header class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs">
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="text-base">✨</span>
            <h1 class="text-lg font-black text-slate-900 tracking-tight leading-none truncate font-brand">
              The Beauty Bar Kenya
            </h1>
          </div>
          <p class="text-[11px] font-semibold text-slate-500 mt-1 flex items-center gap-1 truncate">
            <span>📍 Jamia Mall Shop F47, Nairobi CBD • Countrywide Delivery</span>
          </p>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0">
          <button id="bag-btn" onclick="toggleCartDrawer()" class="relative p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition active:scale-95" title="View Order Bag">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            <span id="bag-badge" class="hidden absolute -top-1.5 -right-1.5 font-black text-[9px] w-4.5 h-4.5 rounded-full bg-emerald-600 text-white flex items-center justify-center">0</span>
          </button>

          <a href="https://wa.me/254728222211?text=Hello%20Beauty%20Bar%20Kenya,%20I%20am%20browsing%20your%20shoes%20and%20products%20catalogue" target="_blank" class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-1.5 hover:border-emerald-400 transition active:scale-95">
            <span class="w-5 h-5 rounded-md bg-[#25D366] text-white flex items-center justify-center font-bold text-xs">💬</span>
            <div class="text-left leading-none">
              <span class="text-[8px] font-extrabold text-emerald-700 uppercase tracking-wider block">Chat</span>
              <span class="text-xs font-black">WhatsApp</span>
            </div>
          </a>
        </div>
      </div>
    </header>

    <!-- Trust & Dispatch Bar -->
    <div class="bg-slate-900 text-slate-200 py-2 px-4 border-b border-slate-800 text-[11px] flex items-center justify-between">
      <div class="flex items-center gap-1.5 font-semibold text-slate-300 truncate">
        <span>🚚</span>
        <span class="truncate">Nairobi Same-Day Boda • Countrywide Fargo / G4S Parcels</span>
      </div>
      <div class="text-[10px] font-mono text-emerald-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
        Till: <strong>582910</strong>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="px-4 pt-3 space-y-3">
      <!-- Search Input -->
      <div class="relative">
        <input 
          id="search-input" 
          type="text" 
          oninput="handleSearch(this.value)"
          placeholder="Search 159+ shoes, sneakers, loafers, or brands..." 
          class="w-full pl-9 pr-8 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 shadow-xs outline-none transition"
        />
        <svg class="w-4 h-4 text-emerald-700 absolute left-3 top-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <button id="clear-search" onclick="clearSearch()" class="hidden absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 p-1 text-xs">✕</button>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-0.5">
        <button onclick="setCategory('All')" id="cat-All" class="cat-pill px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 bg-slate-900 text-white shadow-xs">
          <span>👟</span>
          <span>All Shoes & Kicks</span>
          <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white" id="count-all">159</span>
        </button>
        <button onclick="setCategory('Sneakers & Kicks')" id="cat-Sneakers" class="cat-pill px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50">
          <span>👟</span>
          <span>Sneakers & Kicks</span>
          <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-500" id="count-sneakers">44</span>
        </button>
        <button onclick="setCategory('Men\'s Footwear')" id="cat-Footwear" class="cat-pill px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50">
          <span>👞</span>
          <span>Men's Footwear</span>
          <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-500" id="count-footwear">115</span>
        </button>
      </div>

      <!-- Quick Filter & Layout Controls Row -->
      <div class="flex items-center justify-between gap-2 pt-0.5 text-xs">
        <div class="flex items-center gap-1">
          <button onclick="setPriceFilter('all')" id="pf-all" class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-900 text-white transition">All Items</button>
          <button onclick="setPriceFilter('under5000')" id="pf-under5000" class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition">Under 5K</button>
          <button onclick="setPriceFilter('offers')" id="pf-offers" class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition">Offers 🔥</button>
        </div>

        <!-- 2 Best Layout Modes Switcher: Grid vs List -->
        <div class="flex items-center bg-slate-200/80 p-0.5 rounded-xl border border-slate-300">
          <button 
            type="button"
            onclick="setLayout('grid')" 
            id="btn-layout-grid"
            class="px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 bg-white text-slate-900 shadow-xs transition"
          >
            <span>⊞</span>
            <span>Grid</span>
          </button>
          <button 
            type="button"
            onclick="setLayout('list')" 
            id="btn-layout-list"
            class="px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 text-slate-600 hover:text-slate-900 transition"
          >
            <span>☰</span>
            <span>List</span>
          </button>
        </div>
      </div>

      <!-- Product Count Banner -->
      <div class="flex items-center justify-between text-[11px] font-semibold text-slate-500 px-0.5">
        <span id="results-count">Showing 159 products</span>
        <span class="text-emerald-700 font-bold">100% Multi-Photo High-Res Displays</span>
      </div>

      <!-- Product Showcase Container -->
      <div id="products-container" class="grid grid-cols-2 gap-2.5">
        <!-- Rendered by JS -->
      </div>
    </main>

    <!-- Cart Drawer / Modal -->
    <div id="cart-drawer" class="hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div class="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        <div class="p-4 border-b border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xl">🛍️</span>
            <div>
              <h2 class="text-base font-black text-slate-900">Your Order Bag</h2>
              <p class="text-xs text-slate-500" id="cart-subtitle">0 items selected</p>
            </div>
          </div>
          <button onclick="toggleCartDrawer()" class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100">✕</button>
        </div>

        <div id="cart-items" class="flex-1 overflow-y-auto p-4 space-y-3">
          <!-- Cart items rendered here -->
        </div>

        <div class="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
          <div class="flex items-center justify-between text-sm font-extrabold text-slate-900">
            <span>Estimated Total:</span>
            <span id="cart-total" class="text-lg text-emerald-700">KES 0</span>
          </div>
          <button onclick="checkoutWhatsApp()" class="w-full py-3 rounded-2xl bg-[#25D366] text-white font-extrabold flex items-center justify-center gap-2 shadow-lg hover:bg-green-600 transition active:scale-98">
            <span class="text-lg">💬</span>
            <span>Order via WhatsApp Now</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Product Detail Modal with Interactive 5-Photo Gallery -->
    <div id="product-modal" class="hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <div class="relative bg-slate-100 flex items-center justify-center min-h-[260px] group">
          <img id="modal-img" src="" alt="" class="w-full h-64 object-contain" />
          
          <!-- Prev / Next photo buttons -->
          <button id="modal-prev-btn" onclick="prevModalPhoto(event)" class="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center font-bold text-base transition active:scale-90">‹</button>
          <button id="modal-next-btn" onclick="nextModalPhoto(event)" class="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center font-bold text-base transition active:scale-90">›</button>
          
          <button onclick="closeProductModal()" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center font-bold text-sm">✕</button>
          <div id="modal-badge" class="absolute bottom-3 left-3 bg-slate-900/90 text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider"></div>
          <span id="modal-photo-indicator" class="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"></span>
        </div>

        <!-- Thumbnail Gallery Strip -->
        <div id="modal-thumbs" class="flex items-center gap-1.5 p-2 overflow-x-auto bg-slate-100/70 border-y border-slate-200 no-scrollbar"></div>

        <div class="p-4 overflow-y-auto flex-1 space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span id="modal-cat" class="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block"></span>
              <h3 id="modal-title" class="text-base font-black text-slate-900 leading-snug"></h3>
            </div>
            <div class="text-right flex-shrink-0">
              <span id="modal-price" class="text-lg font-black text-slate-900 block leading-tight"></span>
              <span id="modal-regular-price" class="text-[11px] text-slate-400 line-through"></span>
            </div>
          </div>

          <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Key Benefit</span>
            <p id="modal-benefit" class="text-xs text-slate-700 font-medium leading-relaxed"></p>
          </div>

          <div class="space-y-1.5 text-xs text-slate-600">
            <div class="flex items-center gap-2">
              <span class="text-emerald-600 font-bold">✓</span>
              <span>Available Sizes: <strong id="modal-size">EU 40 - 45</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-emerald-600 font-bold">✓</span>
              <span>100% Genuine Leather / Premium Suede</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-emerald-600 font-bold">✓</span>
              <span>Nairobi Same-Day Delivery • Lipa na M-Pesa</span>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-slate-100 flex items-center gap-2 bg-white">
          <button id="modal-bag-btn" onclick="" class="flex-1 py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center gap-1.5">
            <span>🛍️</span>
            <span id="modal-bag-text">Add to Bag</span>
          </button>
          <button id="modal-wa-btn" onclick="" class="flex-1 py-3 rounded-2xl bg-[#25D366] text-white font-extrabold text-xs flex items-center justify-center gap-1.5">
            <span>💬</span>
            <span>Order WhatsApp</span>
          </button>
        </div>
      </div>
    </div>

  </div>

  <!-- Raw Shoes Data Injected Directly -->
  <script>
    const SHOES_DATA = ${JSON.stringify(shoes, null, 2)};

    let currentCategory = 'All';
    let currentPriceFilter = 'all';
    let currentSearch = '';
    let currentLayout = 'grid';
    let cart = {}; // { [id]: qty }
    let activeModalProduct = null;
    let modalPhotoIndex = 0;

    function renderProducts() {
      const container = document.getElementById('products-container');
      
      const filtered = SHOES_DATA.filter(p => {
        // Category check
        if (currentCategory !== 'All' && p.category !== currentCategory) return false;

        // Price filter check
        if (currentPriceFilter === 'under5000' && p.price >= 5000) return false;
        if (currentPriceFilter === 'offers' && (!p.regular_price || p.regular_price <= p.price)) return false;

        // Search check
        if (currentSearch) {
          const q = currentSearch.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBenefit = (p.benefit_line || '').toLowerCase().includes(q);
          const matchCat = (p.category || '').toLowerCase().includes(q);
          if (!matchName && !matchBenefit && !matchCat) return false;
        }

        return true;
      });

      document.getElementById('results-count').innerText = \`Showing \${filtered.length} products\`;

      if (filtered.length === 0) {
        container.className = 'w-full py-12 text-center';
        container.innerHTML = \`
          <div class="p-6 bg-white rounded-3xl border border-slate-200 max-w-xs mx-auto">
            <span class="text-3xl block mb-2">🔍</span>
            <h3 class="text-sm font-black text-slate-800">No shoes found</h3>
            <p class="text-xs text-slate-500 mt-1">Try clearing search or picking another filter</p>
            <button onclick="clearSearch()" class="mt-3 px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold">Clear Filters</button>
          </div>
        \`;
        return;
      }

      if (currentLayout === 'grid') {
        container.className = 'grid grid-cols-2 gap-2.5';
        container.innerHTML = filtered.map(p => {
          const inCart = Boolean(cart[p.id]);
          const savings = p.regular_price && p.regular_price > p.price ? p.regular_price - p.price : 0;
          const photoCount = p.photos && p.photos.length > 1 ? p.photos.length : 1;
          return \`
            <div class="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
              <div class="relative aspect-square bg-slate-100 overflow-hidden cursor-pointer" onclick="openProductModal('\${p.id}')">
                <img 
                  src="\${p.photo}" 
                  alt="\${p.name}" 
                  loading="lazy" 
                  class="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                  onerror="this.src='/products/orange-soap.svg'"
                />
                \${p.badge ? \`<span class="absolute top-2 left-2 bg-slate-900/90 text-amber-300 text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs">\${p.badge}</span>\` : ''}
                \${photoCount > 1 ? \`<span class="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">📸 \${photoCount}</span>\` : ''}
                \${savings > 0 ? \`<span class="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs">Save KES \${savings.toLocaleString()}</span>\` : ''}
              </div>

              <div class="p-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">\${p.category}</span>
                  <h4 class="text-xs font-black text-slate-900 leading-tight line-clamp-2 mt-0.5 cursor-pointer hover:text-emerald-700" onclick="openProductModal('\${p.id}')">
                    \${p.name}
                  </h4>
                  <p class="text-[10px] text-slate-500 line-clamp-1 mt-1 font-medium">
                    \${p.benefit_line || 'Genuine Leather • All Sizes'}
                  </p>
                </div>

                <div class="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span class="text-xs font-black text-slate-900 block leading-tight">KES \${p.price.toLocaleString()}</span>
                    \${p.regular_price ? \`<span class="text-[9px] text-slate-400 line-through">KES \${p.regular_price.toLocaleString()}</span>\` : ''}
                  </div>

                  <div class="flex items-center gap-1">
                    <button 
                      type="button" 
                      onclick="toggleBag('\${p.id}')"
                      class="p-1.5 rounded-lg border transition active:scale-95 \${inCart ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}"
                      title="\${inCart ? 'Remove from bag' : 'Add to bag'}"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    </button>
                    <a 
                      href="https://wa.me/254728222211?text=\${encodeURIComponent('Hello The Beauty Bar Kenya, I would like to order: ' + p.name + ' (KES ' + p.price + ')')}"
                      target="_blank"
                      class="p-1.5 rounded-lg bg-[#25D366] text-white hover:bg-green-600 transition active:scale-95 flex items-center justify-center"
                      title="1-Tap WhatsApp Order"
                    >
                      <span class="text-xs font-bold leading-none">💬</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          \`;
        }).join('');
      } else {
        // Detailed List Layout
        container.className = 'flex flex-col gap-2.5';
        container.innerHTML = filtered.map(p => {
          const inCart = Boolean(cart[p.id]);
          const savings = p.regular_price && p.regular_price > p.price ? p.regular_price - p.price : 0;
          const photoCount = p.photos && p.photos.length > 1 ? p.photos.length : 1;
          return \`
            <div class="bg-white rounded-2xl border border-slate-200 p-2.5 shadow-xs hover:shadow-md transition flex items-center gap-3">
              <div class="relative w-24 h-24 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 cursor-pointer" onclick="openProductModal('\${p.id}')">
                <img 
                  src="\${p.photo}" 
                  alt="\${p.name}" 
                  loading="lazy" 
                  class="w-full h-full object-cover object-center"
                  onerror="this.src='/products/orange-soap.svg'"
                />
                \${p.badge ? \`<span class="absolute top-1 left-1 bg-slate-900/90 text-amber-300 text-[8px] font-black px-1.5 py-0.2 rounded shadow-xs">\${p.badge}</span>\` : ''}
                \${photoCount > 1 ? \`<span class="absolute bottom-1 right-1 bg-black/60 text-white text-[7px] font-bold px-1 rounded">📸 \${photoCount}</span>\` : ''}
              </div>

              <div class="flex-1 min-w-0 flex flex-col justify-between h-24 py-0.5">
                <div>
                  <div class="flex items-center justify-between gap-1">
                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">\${p.category}</span>
                    \${savings > 0 ? \`<span class="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Save KES \${savings.toLocaleString()}</span>\` : ''}
                  </div>
                  <h4 class="text-xs font-black text-slate-900 leading-snug line-clamp-1 cursor-pointer hover:text-emerald-700 mt-0.5" onclick="openProductModal('\${p.id}')">
                    \${p.name}
                  </h4>
                  <p class="text-[10px] text-slate-600 line-clamp-2 mt-0.5 font-medium">
                    \${p.benefit_line || 'Premium footwear crafted with genuine materials for daily luxury.'}
                  </p>
                </div>

                <div class="flex items-center justify-between mt-1">
                  <div>
                    <span class="text-xs font-black text-slate-900 leading-none">KES \${p.price.toLocaleString()}</span>
                    \${p.regular_price ? \`<span class="text-[9px] text-slate-400 line-through ml-1">KES \${p.regular_price.toLocaleString()}</span>\` : ''}
                  </div>

                  <div class="flex items-center gap-1.5">
                    <button 
                      type="button" 
                      onclick="toggleBag('\${p.id}')"
                      class="px-2 py-1 rounded-lg border text-[10px] font-bold transition flex items-center gap-1 \${inCart ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}"
                    >
                      <span>\${inCart ? '✓ In Bag' : '+ Bag'}</span>
                    </button>
                    <a 
                      href="https://wa.me/254728222211?text=\${encodeURIComponent('Hello The Beauty Bar Kenya, I would like to order: ' + p.name + ' (KES ' + p.price + ')')}"
                      target="_blank"
                      class="px-2.5 py-1 rounded-lg bg-[#25D366] text-white text-[10px] font-black hover:bg-green-600 transition flex items-center gap-1"
                    >
                      <span>💬</span>
                      <span>Order</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          \`;
        }).join('');
      }
    }

    function setCategory(cat) {
      currentCategory = cat;
      document.querySelectorAll('.cat-pill').forEach(btn => {
        btn.className = 'cat-pill px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50';
      });
      if (cat === 'All') {
        document.getElementById('cat-All').className = 'cat-pill px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 bg-slate-900 text-white shadow-xs';
      } else if (cat === 'Sneakers & Kicks') {
        document.getElementById('cat-Sneakers').className = 'cat-pill px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 bg-slate-900 text-white shadow-xs';
      } else {
        document.getElementById('cat-Footwear').className = 'cat-pill px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 bg-slate-900 text-white shadow-xs';
      }
      renderProducts();
    }

    function setPriceFilter(pf) {
      currentPriceFilter = pf;
      ['all', 'under5000', 'offers'].forEach(f => {
        const btn = document.getElementById('pf-' + f);
        if (f === pf) {
          btn.className = 'px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-900 text-white transition';
        } else {
          btn.className = 'px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition';
        }
      });
      renderProducts();
    }

    function setLayout(mode) {
      currentLayout = mode;
      const btnGrid = document.getElementById('btn-layout-grid');
      const btnList = document.getElementById('btn-layout-list');
      if (mode === 'grid') {
        btnGrid.className = 'px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 bg-white text-slate-900 shadow-xs transition';
        btnList.className = 'px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 text-slate-600 hover:text-slate-900 transition';
      } else {
        btnList.className = 'px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 bg-white text-slate-900 shadow-xs transition';
        btnGrid.className = 'px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 text-slate-600 hover:text-slate-900 transition';
      }
      renderProducts();
    }

    function handleSearch(val) {
      currentSearch = val.trim();
      document.getElementById('clear-search').style.display = currentSearch ? 'block' : 'none';
      renderProducts();
    }

    function clearSearch() {
      currentSearch = '';
      document.getElementById('search-input').value = '';
      document.getElementById('clear-search').style.display = 'none';
      renderProducts();
    }

    function toggleBag(id) {
      if (cart[id]) {
        delete cart[id];
      } else {
        cart[id] = 1;
      }
      updateBagBadge();
      renderProducts();
      renderCartItems();
    }

    function updateBagBadge() {
      const count = Object.values(cart).reduce((a, b) => a + b, 0);
      const badge = document.getElementById('bag-badge');
      if (count > 0) {
        badge.innerText = count;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
      document.getElementById('cart-subtitle').innerText = \`\${count} items selected\`;
    }

    function toggleCartDrawer() {
      const drawer = document.getElementById('cart-drawer');
      drawer.classList.toggle('hidden');
      renderCartItems();
    }

    function renderCartItems() {
      const container = document.getElementById('cart-items');
      const ids = Object.keys(cart);
      if (ids.length === 0) {
        container.innerHTML = \`
          <div class="py-12 text-center text-slate-400">
            <span class="text-4xl block mb-2">🛍️</span>
            <p class="text-xs font-bold text-slate-700">Your bag is currently empty</p>
            <p class="text-[11px] text-slate-400 mt-0.5">Tap + Bag on any shoes to build your order</p>
          </div>
        \`;
        document.getElementById('cart-total').innerText = 'KES 0';
        return;
      }

      let total = 0;
      container.innerHTML = ids.map(id => {
        const p = SHOES_DATA.find(x => x.id === id);
        if (!p) return '';
        const qty = cart[id];
        total += p.price * qty;
        return \`
          <div class="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-200">
            <img src="\${p.photo}" class="w-14 h-14 rounded-xl object-cover bg-white" />
            <div class="flex-1 min-w-0">
              <h5 class="text-xs font-black text-slate-900 truncate">\${p.name}</h5>
              <span class="text-xs font-black text-emerald-700">KES \${p.price.toLocaleString()}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button onclick="changeQty('\${id}', -1)" class="w-6 h-6 rounded-lg bg-white border border-slate-200 text-xs font-black">-</button>
              <span class="text-xs font-black px-1">\${qty}</span>
              <button onclick="changeQty('\${id}', 1)" class="w-6 h-6 rounded-lg bg-white border border-slate-200 text-xs font-black">+</button>
            </div>
          </div>
        \`;
      }).join('');

      document.getElementById('cart-total').innerText = 'KES ' + total.toLocaleString();
    }

    function changeQty(id, delta) {
      if (!cart[id]) return;
      cart[id] += delta;
      if (cart[id] <= 0) delete cart[id];
      updateBagBadge();
      renderCartItems();
      renderProducts();
    }

    function checkoutWhatsApp() {
      const ids = Object.keys(cart);
      if (ids.length === 0) return alert('Your bag is empty!');
      let text = 'Hello The Beauty Bar Kenya! I want to order the following shoes:%0A%0A';
      let total = 0;
      ids.forEach((id, idx) => {
        const p = SHOES_DATA.find(x => x.id === id);
        if (p) {
          const linePrice = p.price * cart[id];
          total += linePrice;
          text += \`\${idx + 1}. \${p.name} (x\${cart[id]}) - KES \${linePrice.toLocaleString()}%0A\`;
        }
      });
      text += \`%0A*Estimated Total: KES \${total.toLocaleString()}*%0APlease confirm delivery details.\`;
      window.open(\`https://wa.me/254728222211?text=\${text}\`, '_blank');
    }

    function renderModalPhotos() {
      if (!activeModalProduct) return;
      const photos = (activeModalProduct.photos && activeModalProduct.photos.length > 0)
        ? activeModalProduct.photos 
        : [activeModalProduct.photo];
      
      const currentSrc = photos[modalPhotoIndex] || activeModalProduct.photo;
      document.getElementById('modal-img').src = currentSrc;
      
      const prevBtn = document.getElementById('modal-prev-btn');
      const nextBtn = document.getElementById('modal-next-btn');
      const indicator = document.getElementById('modal-photo-indicator');

      if (photos.length > 1) {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
        indicator.innerText = \`\${modalPhotoIndex + 1} / \${photos.length}\`;
        indicator.classList.remove('hidden');
      } else {
        prevBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
        indicator.classList.add('hidden');
      }

      const thumbs = document.getElementById('modal-thumbs');
      if (photos.length > 1) {
        thumbs.classList.remove('hidden');
        thumbs.innerHTML = photos.map((src, i) => \`
          <img 
            src="\${src}" 
            onclick="selectModalPhoto(\${i})" 
            class="w-12 h-12 rounded-xl object-cover cursor-pointer border-2 transition flex-shrink-0 \${i === modalPhotoIndex ? 'border-emerald-600 scale-105 shadow-xs' : 'border-transparent opacity-60 hover:opacity-100'}" 
          />
        \`).join('');
      } else {
        thumbs.classList.add('hidden');
      }
    }

    function selectModalPhoto(idx) {
      modalPhotoIndex = idx;
      renderModalPhotos();
    }

    function prevModalPhoto(e) {
      if (e) e.stopPropagation();
      const photos = (activeModalProduct.photos && activeModalProduct.photos.length > 0) ? activeModalProduct.photos : [activeModalProduct.photo];
      modalPhotoIndex = (modalPhotoIndex - 1 + photos.length) % photos.length;
      renderModalPhotos();
    }

    function nextModalPhoto(e) {
      if (e) e.stopPropagation();
      const photos = (activeModalProduct.photos && activeModalProduct.photos.length > 0) ? activeModalProduct.photos : [activeModalProduct.photo];
      modalPhotoIndex = (modalPhotoIndex + 1) % photos.length;
      renderModalPhotos();
    }

    function openProductModal(id) {
      const p = SHOES_DATA.find(x => x.id === id);
      if (!p) return;
      activeModalProduct = p;
      modalPhotoIndex = 0;

      renderModalPhotos();

      document.getElementById('modal-title').innerText = p.name;
      document.getElementById('modal-cat').innerText = p.category;
      document.getElementById('modal-price').innerText = 'KES ' + p.price.toLocaleString();
      document.getElementById('modal-regular-price').innerText = p.regular_price ? 'KES ' + p.regular_price.toLocaleString() : '';
      document.getElementById('modal-benefit').innerText = p.benefit_line || 'Premium quality Kenyan footwear with comfortable cushioning.';
      document.getElementById('modal-size').innerText = p.size || 'EU 40 - 45';
      
      const badgeEl = document.getElementById('modal-badge');
      if (p.badge) {
        badgeEl.innerText = p.badge;
        badgeEl.style.display = 'block';
      } else {
        badgeEl.style.display = 'none';
      }

      const inCart = Boolean(cart[p.id]);
      document.getElementById('modal-bag-text').innerText = inCart ? 'Remove from Bag' : 'Add to Bag';
      document.getElementById('modal-bag-btn').onclick = () => {
        toggleBag(p.id);
        openProductModal(p.id);
      };

      document.getElementById('modal-wa-btn').onclick = () => {
        window.open(\`https://wa.me/254728222211?text=\${encodeURIComponent('Hello The Beauty Bar Kenya, I would like to order: ' + p.name + ' (KES ' + p.price + ')')}\`, '_blank');
      };

      document.getElementById('product-modal').classList.remove('hidden');
    }

    function closeProductModal() {
      document.getElementById('product-modal').classList.add('hidden');
      activeModalProduct = null;
    }

    // Auto-check URL params (e.g. ?category=shoes or ?shop=shoes)
    window.addEventListener('DOMContentLoaded', () => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      const shop = (params.get('shop') || '').toLowerCase();
      if (cat === 'Sneakers & Kicks' || shop === 'sneakers') {
        setCategory('Sneakers & Kicks');
      } else if (cat === "Men's Footwear" || shop === 'footwear') {
        setCategory("Men's Footwear");
      } else {
        renderProducts();
      }
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../preview_shoes_catalogue.html'), htmlContent, 'utf8');
console.log('Successfully updated preview_shoes_catalogue.html with full gallery controls!');
