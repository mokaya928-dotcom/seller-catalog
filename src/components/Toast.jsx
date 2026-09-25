import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const bgColors = {
    success: 'bg-emerald-800 text-white',
    error: 'bg-rose-800 text-white',
    info: 'bg-slate-900 text-white',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-300 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-300 flex-shrink-0" />,
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-sm mx-auto animate-fade-in">
      <div className={`flex items-center justify-between p-3.5 rounded-xl shadow-xl ${bgColors[type] || bgColors.info} border border-white/10`}>
        <div className="flex items-center gap-2.5 text-sm font-semibold">
          {icons[type] || icons.info}
          <span>{message}</span>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 text-white/70 hover:text-white rounded-lg focus:outline-none"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
