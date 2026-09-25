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
    <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Customer Storefront Link
              </h3>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Public Link
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Send this link to customers to browse &amp; order directly</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPreview}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition border border-slate-200 active:scale-95"
          title="Preview what customers see"
        >
          <span>Preview</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </button>
      </div>

      {/* Clean Monospaced Link Box */}
      <div className="flex items-center justify-between gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200">
        <span className="text-[11px] font-mono text-slate-700 truncate select-all">
          {catalogUrl}
        </span>
        <button
          type="button"
          onClick={handleCopyLinkOnly}
          className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-800 transition flex items-center gap-1 flex-shrink-0 border border-slate-300 shadow-2xs cursor-pointer active:scale-95"
        >
          {copiedLink ? <Check className="w-3 h-3 text-emerald-600 stroke-[3px]" /> : <Copy className="w-3 h-3 text-slate-600" />}
          <span>{copiedLink ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 pt-0.5">
        <button
          type="button"
          onClick={handleCopyFullMessage}
          className="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs transition border border-slate-200/80 cursor-pointer active:scale-95"
        >
          {copiedMessage ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" />
              <span className="text-emerald-700">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-600" />
              <span>Copy Invite Text</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1caa52] text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs transition shadow-xs cursor-pointer active:scale-95"
        >
          <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
          <span>Share to WhatsApp</span>
        </button>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-1 border-t border-slate-100">
        <span>🔒</span>
        <span>Customer view only shows products &amp; cart. Seller studio is 100% hidden.</span>
      </div>
    </div>
  );
}
