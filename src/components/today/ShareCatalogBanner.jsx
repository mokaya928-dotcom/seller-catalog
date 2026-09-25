import React, { useState } from 'react';
import { Store, Copy, Share2, ExternalLink, Check } from 'lucide-react';
import { shareService } from '../../services/shareService';
import WhatsAppIcon from '../common/WhatsAppIcon';

export default function ShareCatalogBanner({ seller, onOpenPreview, onShowToast }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Clean public customer storefront URL with explicit catalog view
  const catalogUrl = `${window.location.origin}/?view=catalog`;

  const promoMessage = `Habari! Karibu *${seller.shop_name || 'The Beauty Bar Kenya'}*!\n\n` +
    `Angalia bidhaa zetu zote zilizopo kwa sasa na bei zake hapa kwenye catalogue yetu:\n` +
    `👉 ${catalogUrl}\n\n` +
    `Gusa bidhaa yoyote kuagiza moja kwa moja kupitia WhatsApp! Delivery inapatikana nchi nzima. Karibu sana!`;

  const handleCopyLinkOnly = async () => {
    const success = await shareService.copyText(catalogUrl);
    if (success) {
      setCopiedLink(true);
      onShowToast('✓ Public catalogue link copied!', 'success');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyFullMessage = async () => {
    const success = await shareService.copyText(promoMessage);
    if (success) {
      setCopiedMessage(true);
      onShowToast('✓ Invitation message & catalogue link copied!', 'success');
      setTimeout(() => setCopiedMessage(false), 2500);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${seller.shop_name || 'Beauty Bar'} - Product Catalogue`,
          text: promoMessage,
          url: catalogUrl
        });
        onShowToast('✓ Catalogue opened in share menu!', 'success');
        return;
      } catch (e) {
        if (e.name === 'AbortError') return;
      }
    }

    // Fallback: Copy full message
    handleCopyFullMessage();
  };

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-2xl p-4 shadow-md space-y-3 border border-emerald-500/20">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-300">
                Customer Storefront Link
              </h3>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Public Face
              </span>
            </div>
            <p className="text-[11px] text-gray-300">Send this link to customers instead of 30 photos!</p>
          </div>
        </div>

        <button
          onClick={onOpenPreview}
          className="bg-white/10 hover:bg-white/20 text-emerald-200 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition border border-white/10 shadow-2xs"
          title="Preview exactly what your customers see"
        >
          <span>Customer View</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Clean Link Box */}
      <div className="flex items-center justify-between gap-2 bg-black/40 rounded-xl px-3 py-2 border border-white/10">
        <span className="text-[11px] font-mono text-emerald-300 truncate select-all">
          {catalogUrl}
        </span>
        <button
          onClick={handleCopyLinkOnly}
          className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-600/60 hover:bg-emerald-600 text-white transition flex items-center gap-1 flex-shrink-0"
        >
          {copiedLink ? <Check className="w-3 h-3 stroke-[3px]" /> : <Copy className="w-3 h-3" />}
          <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>

      {/* Quick Customer Sharing Grid */}
      <div className="grid grid-cols-2 gap-2 pt-0.5">
        <button
          onClick={handleCopyFullMessage}
          className="bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs transition border border-white/10 shadow-2xs"
        >
          {copiedMessage ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3px]" />
              <span className="text-emerald-300">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-emerald-300" />
              <span>Copy Full Invite Text</span>
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          className="bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1caa52] text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs transition shadow-sm"
        >
          <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
          <span>Share to WhatsApp</span>
        </button>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="text-[10px] text-gray-400 flex items-center gap-1 pt-0.5 border-t border-white/5">
        <span>🔒</span>
        <span>Customers only see your products &amp; cart. The seller admin studio is 100% hidden.</span>
      </div>
    </div>
  );
}
