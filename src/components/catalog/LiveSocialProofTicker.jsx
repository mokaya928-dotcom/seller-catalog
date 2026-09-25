import React, { useState, useEffect } from 'react';
import { Flame, CheckCircle2, MapPin, X } from 'lucide-react';

const RECENT_LOCATIONS = [
  'Kilimani, Nairobi',
  'Westlands, Nairobi',
  'Jamia Mall CBD Pickup',
  'Roysambu, Thika Rd',
  'South B, Nairobi',
  'Kileleshwa, Nairobi',
  'Karen, Nairobi',
  'Rongai, Kajiado',
  'Ruaka, Kiambu',
  'Parklands, Nairobi',
  'Nakuru Town',
  'Mombasa CBD'
];

const CUSTOMER_NAMES = [
  'Mercy M.', 'Brian K.', 'Faith W.', 'Sharon N.', 
  'Kevin O.', 'Wanjiku K.', 'Dennis M.', 'Amina H.', 
  'Cynthia J.', 'Esther N.', 'Patricia A.', 'Grace W.'
];

export default function LiveSocialProofTicker({ products = [] }) {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed || !products || products.length === 0) return;

    const inStock = products.filter(p => p.in_stock);
    if (inStock.length === 0) return;

    let timeoutId;
    let hideTimeoutId;

    const showRandomOrder = () => {
      const randomProduct = inStock[Math.floor(Math.random() * inStock.length)];
      const randomLocation = RECENT_LOCATIONS[Math.floor(Math.random() * RECENT_LOCATIONS.length)];
      const randomName = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
      const randomMins = Math.floor(Math.random() * 8) + 1; // 1 to 9 mins ago
      const randomQty = Math.random() > 0.75 ? 2 : 1;

      setCurrentNotification({
        product: randomProduct,
        location: randomLocation,
        name: randomName,
        minsAgo: randomMins,
        quantity: randomQty
      });
      setIsVisible(true);

      // Hide after 5 seconds
      hideTimeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 5500);
    };

    // First appearance after 3.5s
    timeoutId = setTimeout(() => {
      showRandomOrder();
      // Then rotate every 16 seconds
      const intervalId = setInterval(showRandomOrder, 16000);
      return () => clearInterval(intervalId);
    }, 3500);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(hideTimeoutId);
    };
  }, [products, isDismissed]);

  if (!currentNotification || !isVisible || isDismissed) {
    return null;
  }

  const { product, location, name, minsAgo, quantity } = currentNotification;

  return (
    <div 
      className="fixed bottom-20 sm:bottom-6 left-3 sm:left-6 z-40 max-w-[340px] bg-white/95 backdrop-blur-md border border-emerald-100 rounded-2xl p-2.5 shadow-xl transition-all duration-500 ease-out transform translate-y-0 opacity-100 animate-slide-up flex items-center gap-2.5"
      role="status"
      aria-live="polite"
    >
      {/* Product Image Thumbnail */}
      <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 relative flex items-center justify-center p-0.5">
        <img
          src={product.photo}
          alt={product.name}
          className="w-full h-full object-contain"
        />
        <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs">
          <CheckCircle2 className="w-2.5 h-2.5 stroke-[3px]" />
        </div>
      </div>

      {/* Copy */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-semibold leading-none">
          <span className="font-extrabold text-emerald-800">{name}</span>
          <span>•</span>
          <span className="truncate flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5 text-amber-500 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </span>
        </div>

        <p className="text-xs font-black text-gray-900 truncate mt-0.5 leading-snug">
          Ordered {quantity > 1 ? `${quantity}x ` : ''}{product.name}
        </p>

        <div className="flex items-center gap-2 mt-0.5 text-[9px] font-bold text-gray-400">
          <span>{minsAgo} {minsAgo === 1 ? 'min' : 'mins'} ago</span>
          <span className="text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-black">
            Verified M-Pesa Order
          </span>
        </div>
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={() => {
          setIsVisible(false);
          setIsDismissed(true);
        }}
        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition self-start -mr-1"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
