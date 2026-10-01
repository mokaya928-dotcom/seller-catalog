import React from 'react';
import { Edit2, Star, Trash2, Eye, Zap } from 'lucide-react';
import { getProductRemaining, getProductRegularPrice } from '../../services/scheduleService';
import { getOptimizedImageUrl } from '../../utils/imageUtils';

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
    <div 
      className={`border transition-all duration-200 theme-card ${
        product.in_stock ? 'opacity-100' : 'opacity-70'
      }`}
      style={{
        backgroundColor: 'var(--theme-color-surface-card)',
        borderRadius: 'var(--theme-radius-card)',
        borderColor: 'var(--theme-color-border-hairline)',
        padding: 'var(--theme-card-padding)',
        boxShadow: 'var(--theme-shadow-card)',
        fontFamily: 'var(--theme-font-family)'
      }}
    >
      <div className="flex items-start gap-3.5">
        {/* Photo thumbnail */}
        <div 
          onClick={() => onPreview && onPreview(product)}
          className="w-20 h-20 overflow-hidden flex-shrink-0 border relative flex items-center justify-center p-1 cursor-pointer group transition"
          style={{
            borderRadius: 'var(--theme-radius-photo)',
            backgroundColor: 'var(--theme-color-surface-soft)',
            borderColor: 'var(--theme-color-border-hairline)'
          }}
          title="Click to preview designed poster"
        >
          <img
            src={getOptimizedImageUrl(product.photo)}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/products/bbk-vaseline-lip.jpg';
            }}
          />
          {product.featured && (
            <div 
              className="absolute top-1 left-1 p-0.5 shadow-xs"
              style={{
                backgroundColor: 'var(--theme-color-primary)',
                color: 'var(--theme-color-on-primary)',
                borderRadius: 'var(--theme-radius-xs)'
              }}
            >
              <Star className="w-3 h-3 fill-current" />
            </div>
          )}
          {product.photos && product.photos.length > 1 && (
            <span 
              className="absolute top-1 right-1 text-white text-[9px] font-bold px-1.5 py-0.2"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                borderRadius: 'var(--theme-radius-xs)'
              }}
            >
              📷 {product.photos.length}
            </span>
          )}
          {product.size && (
            <span 
              className="absolute bottom-1 right-1 text-white text-[9px] font-bold px-1.5 py-0.2"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                borderRadius: 'var(--theme-radius-xs)'
              }}
            >
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
                  <span 
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: 'var(--theme-color-muted)' }}
                  >
                    {product.category}
                  </span>
                )}
                {product.badge && (
                  <span 
                    className="text-[9px] font-bold px-2 py-0.5 border"
                    style={{
                      backgroundColor: 'var(--theme-color-surface-soft)',
                      color: 'var(--theme-color-ink)',
                      borderColor: 'var(--theme-color-border-hairline)',
                      borderRadius: 'var(--theme-radius-badge)'
                    }}
                  >
                    {product.badge === 'flash_sale' ? '⚡ Flash Sale' : product.badge === 'restocked' ? 'Restocked' : product.badge === 'limited_stock' ? 'Limited Stock' : product.badge}
                  </span>
                )}
                {product.in_stock && remaining !== null && (
                  <span 
                    className="text-[9px] font-bold px-2 py-0.5 border"
                    style={{
                      backgroundColor: 'var(--theme-color-primary-subtle)',
                      color: 'var(--theme-color-primary)',
                      borderColor: 'var(--theme-color-primary-subtle)',
                      borderRadius: 'var(--theme-radius-badge)'
                    }}
                  >
                    🔥 {remaining} left
                  </span>
                )}
              </div>
              <h3 
                onClick={() => onPreview && onPreview(product)}
                className="text-sm font-extrabold leading-snug line-clamp-1 cursor-pointer transition mt-0.5"
                style={{
                  color: 'var(--theme-color-ink)',
                  fontFamily: 'var(--theme-font-display)'
                }}
                title="Click to preview designed poster"
              >
                {product.name}
              </h3>
            </div>
            <div className="text-right flex-shrink-0">
              <span 
                className="text-xs px-2 py-0.5 inline-block font-extrabold"
                style={{
                  backgroundColor: 'var(--theme-price-badge-bg)',
                  color: 'var(--theme-price-badge-text)',
                  border: 'var(--theme-price-badge-border)',
                  borderRadius: 'var(--theme-price-badge-radius)',
                  fontFamily: 'var(--theme-font-family)'
                }}
              >
                KES {Number(product.price).toLocaleString()}
              </span>
              {regularPrice && regularPrice > Number(product.price) && (
                <div 
                  className="text-[10px] line-through font-medium mt-0.5"
                  style={{ color: 'var(--theme-color-muted)' }}
                >
                  KES {regularPrice.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          <p 
            className="text-xs line-clamp-2 mt-1 leading-relaxed"
            style={{ color: 'var(--theme-color-body)' }}
          >
            {product.benefit_line}
          </p>

          {/* Quick Controls row */}
          <div 
            className="flex items-center justify-between mt-3 pt-2.5 border-t"
            style={{ borderColor: 'var(--theme-color-border-hairline)' }}
          >
            {/* In-Stock Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={product.in_stock}
                onChange={(e) => onToggleStock(product.id, e.target.checked)}
                className="sr-only peer"
              />
              <div 
                className="w-8 h-4.5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all relative"
                style={{
                  backgroundColor: product.in_stock ? 'var(--theme-color-primary)' : undefined
                }}
              />
              <span 
                className="text-[11px] font-bold"
                style={{ color: product.in_stock ? 'var(--theme-color-ink)' : 'var(--theme-color-muted)' }}
              >
                {product.in_stock ? 'In Stock' : 'Out of Stock'}
              </span>
            </label>

            {/* Actions: Generate Flyer, Preview, Featured, Edit, Delete */}
            <div className="flex items-center gap-1">
              {onGeneratePost && (
                <button
                  type="button"
                  onClick={() => onGeneratePost(product)}
                  className="p-1.5 rounded-lg transition"
                  style={{
                    color: 'var(--theme-color-primary)',
                    borderRadius: 'var(--theme-radius-sm)'
                  }}
                  title="⚡ Generate Flyer Immediately"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                </button>
              )}

              {onPreview && (
                <button
                  onClick={() => onPreview(product)}
                  className="p-1.5 rounded-lg transition hover:opacity-75"
                  style={{
                    color: 'var(--theme-color-muted)',
                    borderRadius: 'var(--theme-radius-sm)'
                  }}
                  title="Preview Designed Poster"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => onToggleFeatured(product.id, !product.featured)}
                className="p-1.5 rounded-lg transition"
                style={{
                  color: product.featured ? 'var(--theme-color-primary)' : 'var(--theme-color-muted)',
                  backgroundColor: product.featured ? 'var(--theme-color-primary-subtle)' : 'transparent',
                  borderRadius: 'var(--theme-radius-sm)'
                }}
                title="Toggle Featured (Prioritizes product in rotation)"
              >
                <Star className={`w-3.5 h-3.5 ${product.featured ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => onEdit(product)}
                className="p-1.5 rounded-lg transition hover:opacity-75"
                style={{
                  color: 'var(--theme-color-ink)',
                  borderRadius: 'var(--theme-radius-sm)'
                }}
                title="Edit Product"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onDelete(product.id)}
                className="p-1.5 rounded-lg transition hover:text-red-600 hover:bg-red-50"
                style={{
                  color: 'var(--theme-color-muted)',
                  borderRadius: 'var(--theme-radius-sm)'
                }}
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
