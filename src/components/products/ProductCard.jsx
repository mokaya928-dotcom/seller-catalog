import React from 'react';
import { Edit2, Star, Trash2, Eye, Zap, Flame } from 'lucide-react';
import { getProductRemaining, getProductRegularPrice } from '../../services/scheduleService';

export default function ProductCard({
  product,
  onEdit,
  onToggleStock,
  onToggleFeatured,
  onDelete,
  onPreview,
  onGeneratePost
}) {
  const remaining = getProductRemaining(product);
  const regularPrice = getProductRegularPrice(product);
  return (
    <div className={`bg-white rounded-2xl p-4 border transition-all ${
      product.in_stock ? 'border-gray-200 shadow-xs hover:border-gray-300' : 'border-gray-200/60 bg-gray-50/70 opacity-75'
    }`}>
      <div className="flex items-start gap-3.5">
        {/* Photo thumbnail */}
        <div 
          onClick={() => onPreview && onPreview(product)}
          className="w-20 h-20 rounded-2xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-200 relative flex items-center justify-center p-1 cursor-pointer group"
          title="Click to preview full product details"
        >
          <img
            src={product.photo}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition"
          />
          {product.featured && (
            <div className="absolute top-1 left-1 bg-amber-400 text-amber-950 p-0.5 rounded-md shadow-xs">
              <Star className="w-3 h-3 fill-current" />
            </div>
          )}
          {product.photos && product.photos.length > 1 && (
            <span className="absolute top-1 right-1 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md">
              📷 {product.photos.length}
            </span>
          )}
          {product.size && (
            <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md">
              {product.size}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {product.category && (
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    {product.category}
                  </span>
                )}
                {product.badge && (
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                    product.badge.includes('flash') ? 'bg-red-100 text-red-700 border border-red-200' :
                    product.badge.includes('restock') ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {product.badge === 'flash_sale' ? '🔥 Flash Sale' : product.badge === 'restocked' ? '⚡ Restocked' : product.badge === 'limited_stock' ? '⚠️ Limited Stock' : product.badge}
                  </span>
                )}
                {product.in_stock && remaining !== null && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                    🔥 {remaining} left
                  </span>
                )}
              </div>
              <h3 
                onClick={() => onPreview && onPreview(product)}
                className="font-extrabold text-sm text-gray-900 leading-snug line-clamp-1 cursor-pointer hover:text-emerald-700 transition"
              >
                {product.name}
              </h3>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="font-black text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg inline-block">
                KES {Number(product.price).toLocaleString()}
              </span>
              {regularPrice && regularPrice > Number(product.price) && (
                <div className="text-[10px] text-gray-400 line-through font-semibold mt-0.5">
                  KES {regularPrice.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed">
            {product.benefit_line}
          </p>

          {/* Quick Controls row */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100">
            {/* In-Stock Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={product.in_stock}
                onChange={(e) => onToggleStock(product.id, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4.5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600 relative"></div>
              <span className={`text-[11px] font-bold ${product.in_stock ? 'text-emerald-700' : 'text-gray-400'}`}>
                {product.in_stock ? 'In Stock' : 'Out of Stock'}
              </span>
            </label>

            {/* Actions: Generate Flyer, Preview, Featured, Edit, Delete */}
            <div className="flex items-center gap-1">
              {onGeneratePost && (
                <button
                  type="button"
                  onClick={() => onGeneratePost(product)}
                  className="p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                  title="⚡ Generate Flyer Immediately"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                </button>
              )}

              {onPreview && (
                <button
                  onClick={() => onPreview(product)}
                  className="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                  title="Preview Customer View"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => onToggleFeatured(product.id, !product.featured)}
                className={`p-1.5 rounded-lg transition ${
                  product.featured
                    ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
                title="Toggle Featured (Prioritizes product in rotation)"
              >
                <Star className={`w-3.5 h-3.5 ${product.featured ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => onEdit(product)}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                title="Edit Product"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onDelete(product.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete Product"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
