import React, { useState } from 'react';
import { 
  X, Trash2, Plus, Minus, MapPin, Truck, Store, 
  Check, Copy, ShoppingBag, ShieldCheck, Flame, Sparkles, MessageCircle 
} from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { shareService } from '../../services/shareService';
import { EVENT_TYPES } from '../../services/analyticsService';

const DELIVERY_OPTIONS = [
  {
    id: 'cbd',
    label: 'CBD Shop Pickup',
    desc: 'Pick up at Shop F47, Jamia Mall (Nairobi)',
    fee: 0,
    icon: Store,
    badge: 'FREE'
  },
  {
    id: 'nairobi',
    label: 'Nairobi Doorstep Delivery',
    desc: 'Same-day express rider to your home or office',
    fee: 250,
    icon: Truck,
    badge: 'SAME DAY'
  },
  {
    id: 'upcountry',
    label: 'Upcountry Parcel Courier',
    desc: 'Dispatched via Easy Coach, 2NK, Modern Coast',
    fee: 350,
    icon: MapPin,
    badge: 'ALL TOWNS'
  }
];

export default function CheckoutDrawer({
  isOpen,
  onClose,
  cart = {}, // { [productId]: quantity }
  products = [],
  seller = {},
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) {
  const [deliveryMethod, setDeliveryMethod] = useState('nairobi');
  const [customerLocation, setCustomerLocation] = useState('');
  const [copiedTill, setCopiedTill] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Resolve items in cart
  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const prod = products.find(p => p.id === id);
      return prod && qty > 0 ? { product: prod, quantity: qty } : null;
    })
    .filter(Boolean);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity, 
    0
  );

  const selectedDelivery = DELIVERY_OPTIONS.find(d => d.id === deliveryMethod) || DELIVERY_OPTIONS[0];
  const grandTotal = subtotal + selectedDelivery.fee;

  const handleCopyTill = async () => {
    if (!seller.mpesa_till) return;
    const success = await shareService.copyText(seller.mpesa_till);
    if (success) {
      setCopiedTill(true);
      setTimeout(() => setCopiedTill(false), 2500);
    }
  };

  const handleSendWhatsAppOrder = async () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);

    const itemsSummary = cartItems.map((item, idx) => {
      const p = item.product;
      const itemTotal = Number(p.price) * item.quantity;
      return `${idx + 1}. *${p.name}* (${p.size || ''})\n   • Qty: ${item.quantity} × KES ${Number(p.price).toLocaleString()} = *KES ${itemTotal.toLocaleString()}*`;
    }).join('\n');

    const message = 
      `🛍️ *NEW ORDER - ${seller.shop_name || 'Glow House'}*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 *ORDERED ITEMS:*\n${itemsSummary}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 *Items Subtotal:* KES ${subtotal.toLocaleString()}\n` +
      `🛵 *Delivery:* ${selectedDelivery.label} (${selectedDelivery.fee === 0 ? 'FREE' : `KES ${selectedDelivery.fee}`})\n` +
      (customerLocation.trim() ? `📍 *Destination / Notes:* ${customerLocation.trim()}\n` : '') +
      `🔥 *TOTAL AMOUNT TO PAY: KES ${grandTotal.toLocaleString()}*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      (seller.mpesa_till ? `💳 *LIPA NA M-PESA TILL:* *${seller.mpesa_till}*\n` : '') +
      `⚠️ *Please confirm order & dispatch rider right away!* 🔥`;

    await shareService.orderOnWhatsApp({
      product: cartItems[0]?.product,
      seller,
      customMessage: message,
      meta: {
        type: EVENT_TYPES.ORDER_CLICK_MULTI,
        price: grandTotal,
        itemsCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        source: 'checkout_drawer_cart'
      }
    });

    setIsSubmitting(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 leading-none">
                Your Order Bag
              </h2>
              <p className="text-[11px] text-gray-500 font-semibold mt-1">
                {cartItems.length} {cartItems.length === 1 ? 'product' : 'products'} selected • Fast WhatsApp Dispatch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && onClearCart && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-[11px] font-bold text-gray-400 hover:text-rose-600 transition px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"
              aria-label="Close Bag"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {cartItems.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-gray-800">Your bag is empty</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Tap on any product in the catalogue to add it to your order bag.
              </p>
            </div>
          ) : (
            <>
              {/* Product List */}
              <div className="space-y-2.5">
                {cartItems.map(({ product, quantity }) => (
                  <div 
                    key={product.id}
                    className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-2xl border border-gray-100"
                  >
                    <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                      <img 
                        src={product.photo} 
                        alt={product.name} 
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-gray-500">
                        {product.size || product.category || ''}
                      </p>
                      <p className="text-xs font-black text-emerald-800 mt-0.5">
                        KES {Number(product.price).toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-1 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition active:scale-95"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black w-5 text-center text-gray-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center justify-center transition active:scale-95"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Delete item */}
                    <button
                      type="button"
                      onClick={() => onRemoveItem(product.id)}
                      className="text-gray-400 hover:text-rose-600 p-1 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Delivery Destination Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-black text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <Truck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Select Delivery Option</span>
                </label>

                <div className="grid grid-cols-1 gap-2">
                  {DELIVERY_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = deliveryMethod === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setDeliveryMethod(opt.id)}
                        className={`p-3 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected 
                            ? 'border-emerald-600 bg-emerald-50/70' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-extrabold text-gray-900">
                                {opt.label}
                              </span>
                              <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${
                                opt.fee === 0 ? 'bg-emerald-200 text-emerald-900' : 'bg-blue-100 text-blue-900'
                              }`}>
                                {opt.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-500 truncate mt-0.5">
                              {opt.desc}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="text-xs font-black text-gray-900">
                            {opt.fee === 0 ? 'FREE' : `+ KES ${opt.fee}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Address / Notes */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 block">
                  Your Estate / Town / Street (Optional):
                </label>
                <input
                  type="text"
                  value={customerLocation}
                  onChange={(e) => setCustomerLocation(e.target.value)}
                  placeholder="e.g. Roysambu Lumumba Dr, Westlands, or CBD Jamia"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                />
              </div>

              {/* M-Pesa Till Verification Card */}
              {seller.mpesa_till && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/90 rounded-2xl p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                      M
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                        Lipa na M-Pesa Till
                      </span>
                      <span className="font-mono text-sm font-black text-emerald-950 tracking-wider">
                        {seller.mpesa_till}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyTill}
                    className="bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-[11px] font-black px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-2xs active:scale-95"
                  >
                    {copiedTill ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Till</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Order Cost Breakdown */}
              <div className="bg-gray-50 border border-gray-200/70 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Items Subtotal:</span>
                  <span className="font-bold text-gray-900">KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Delivery ({selectedDelivery.label}):</span>
                  <span className="font-bold text-gray-900">
                    {selectedDelivery.fee === 0 ? 'FREE' : `KES ${selectedDelivery.fee.toLocaleString()}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline text-sm">
                  <span className="font-black text-gray-950">Grand Total:</span>
                  <span className="font-black text-lg text-emerald-800">
                    KES {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Action Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0 z-10 shadow-xl space-y-2">
            <button
              type="button"
              onClick={handleSendWhatsAppOrder}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20ba5a] hover:to-[#0f7a6d] active:scale-98 text-white font-black py-4 px-5 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-lg transition"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white flex-shrink-0" />
              <span>Send Complete Order via WhatsApp (KES {grandTotal.toLocaleString()})</span>
            </button>

            <div className="flex items-center justify-center gap-3 text-[10px] text-gray-500 font-semibold">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Genuine Stock Guarantee</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-500" />
                <span>Fast Nairobi Dispatch</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
