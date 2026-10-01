import React, { useState, useMemo } from 'react';
import { Plus, Search, PackageCheck, Sparkles, Zap, FileSpreadsheet } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import ProductPosterPreviewModal from './ProductPosterPreviewModal';
import { executeSmartSearch } from '../../services/smartSearch';

export default function ProductsView({
  products,
  seller,
  ratio = 'status',
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onShowToast,
  onGenerateImmediate,
  onOpenBulkModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalState, setModalState] = useState({ isOpen: false, product: null });
  const [previewProduct, setPreviewProduct] = useState(null);

  const searchResult = useMemo(() => {
    return executeSmartSearch(products, searchQuery, {
      selectedCategory,
      inStockOnly: false
    });
  }, [products, searchQuery, selectedCategory]);

  const filteredProducts = searchResult.results;
  const didYouMean = searchResult.didYouMean;

  const inStockCount = products.filter((p) => p.in_stock).length;

  const handleOpenAdd = () => {
    setModalState({ isOpen: true, product: null });
  };

  const handleOpenEdit = (product) => {
    setModalState({ isOpen: true, product });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, product: null });
  };

  const handleSaveProduct = async (productData) => {
    if (modalState.product) {
      await onUpdateProduct(modalState.product.id, productData);
      onShowToast('✓ Product updated! Future posts & catalogue will reflect this.', 'success');
    } else {
      await onAddProduct(productData);
      onShowToast('✓ Product added to your catalog!', 'success');
    }
    handleCloseModal();
  };

  const handleSaveAndGenerate = async (productData) => {
    let saved;
    if (modalState.product) {
      saved = await onUpdateProduct(modalState.product.id, productData);
      onShowToast(`✓ Product updated & generating flyer immediately!`, 'success');
    } else {
      saved = await onAddProduct(productData);
      onShowToast(`✓ "${saved.name}" added & generating flyer immediately!`, 'success');
    }
    handleCloseModal();
    if (onGenerateImmediate && saved) {
      onGenerateImmediate(saved);
    }
  };

  const handleToggleStock = async (id, in_stock) => {
    await onUpdateProduct(id, { in_stock });
    onShowToast(in_stock ? 'Product in-stock (active in posts & catalogue)' : 'Product marked out-of-stock', 'info');
  };

  const handleToggleFeatured = async (id, featured) => {
    await onUpdateProduct(id, { featured });
    onShowToast(featured ? 'Product set as Featured (prime slots)' : 'Product unfeatured', 'info');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this product?')) {
      await onDeleteProduct(id);
      onShowToast('Product removed.', 'info');
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 leading-tight">
              Product Inventory
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
              <PackageCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>{products.length} Products</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">{inStockCount} In Stock</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenBulkModal}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 text-xs shadow-2xs transition active:scale-95"
              title="Bulk CSV / Excel Upload, Export & Store Backup"
              style={{ minHeight: '40px' }}
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-600" />
              <span>Bulk CSV/Excel</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 text-xs shadow-xs transition active:scale-95"
              style={{ minHeight: '40px' }}
            >
              <Plus className="w-4 h-4 stroke-[2.5px]" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Smart Search Bar */}
        <div className="space-y-1.5">
          <div className="relative">
            <Sparkles className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search inventory: 'salicylic', 'under 2000', 'spf', 'bag'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-16 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition"
            />
            <div className="absolute right-2.5 top-2 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold px-1"
                >
                  ✕
                </button>
              )}
              <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                Smart
              </span>
            </div>
          </div>

          {/* "Did you mean?" Typo Correction */}
          {didYouMean && didYouMean !== searchQuery.toLowerCase().trim() && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1 flex items-center justify-between text-[11px] text-amber-900">
              <span>
                💡 Did you mean:{' '}
                <button
                  type="button"
                  onClick={() => setSearchQuery(didYouMean)}
                  className="font-bold underline decoration-amber-600 hover:text-slate-900"
                >
                  "{didYouMean}"
                </button>
                ?
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery(didYouMean)}
                className="bg-amber-600 text-white font-bold text-[9px] px-2 py-0.5 rounded"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Visual Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar pt-1">
          {[
            { id: 'All', label: 'All', icon: '✨' },
            { id: 'Handbags & Bags', label: 'Bags', icon: '👜' },
            { id: 'Makeup & Prep', label: 'Make Up', icon: '👑' },
            { id: 'Lip Care', label: 'Lip Care', icon: '💄' },
            { id: 'Bath & Body', label: 'Body', icon: '🌸' },
            { id: 'Sunscreen & SPF', label: 'SPF', icon: '☀️' },
            { id: 'Skincare & Face', label: 'Face', icon: '🧴' },
            { id: 'Serums & Actives', label: 'Serums', icon: '🧪' },
            { id: 'Classic Clothes', label: 'Clothes', icon: '👗' },
            { id: 'Household & Bedding', label: 'Household', icon: '🛏️' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-2.5">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-gray-200 p-6 space-y-3">
            <p className="text-sm font-bold text-gray-700">No products found</p>
            <p className="text-xs text-gray-500">Try a different search or add products to your catalog.</p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleOpenAdd}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition"
              >
                + Add Single Item
              </button>
              <button
                type="button"
                onClick={onOpenBulkModal}
                className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>Bulk CSV / Excel</span>
              </button>
            </div>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleOpenEdit}
              onToggleStock={handleToggleStock}
              onToggleFeatured={handleToggleFeatured}
              onDelete={handleDelete}
              onPreview={(p) => setPreviewProduct(p)}
              onGeneratePost={onGenerateImmediate}
            />
          ))
        )}
      </div>

      {/* Bulk CSV / Excel & Store Backup Action Strip */}
      <div className="bg-white rounded-2xl p-3.5 border border-gray-200 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold flex-shrink-0">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h5 className="text-xs font-bold text-gray-900 truncate">Spreadsheet &amp; Data Tools</h5>
            <p className="text-[10px] text-gray-500 truncate">Import Excel, export price lists, or backup store</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenBulkModal}
          className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs py-2 px-3 rounded-xl transition flex items-center gap-1 flex-shrink-0 shadow-2xs"
        >
          <span>Open Bulk Tools</span>
        </button>
      </div>

      {/* Quick Add & Generate Flyer card at bottom of inventory ("Down There" option) */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-2xl p-4 border border-emerald-500/30 text-white flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold flex-shrink-0">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Have a New Product?</h4>
            <p className="text-[11px] text-emerald-200/80">Add it and generate its design immediately</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-2.5 px-3.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 flex-shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>+ Generate Design</span>
        </button>
      </div>

      {/* Add / Edit Modal */}
      {modalState.isOpen && (
        <ProductModal
          product={modalState.product}
          allProducts={products}
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
          onSaveAndGenerate={handleSaveAndGenerate}
          initialCategory={selectedCategory === 'All' ? 'Skincare & Face' : selectedCategory}
          isInstantGenerate={false}
        />
      )}

      {/* Product Designed Poster Preview Modal */}
      {previewProduct && seller && (
        <ProductPosterPreviewModal
          product={previewProduct}
          seller={seller}
          initialRatio={ratio}
          onClose={() => setPreviewProduct(null)}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
}
