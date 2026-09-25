import React from 'react';
import { CalendarDays, ArrowRight } from 'lucide-react';

export default function WeekPlaceholderView({ onGoToToday }) {
  return (
    <div className="py-8 px-4 text-center max-w-sm mx-auto space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
        <CalendarDays className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <span className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          Roadmap Step 3
        </span>
        <h2 className="text-lg font-extrabold text-gray-900">
          7-Day Visual Calendar
        </h2>
        <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
          In Step 3, you will be able to preview tomorrow's 5 posts, swap out any product with one tap, or skip a time slot ahead of time.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 text-left space-y-2 text-xs">
        <div className="font-bold text-gray-800">Coming up in next steps:</div>
        <div className="flex items-center gap-2 text-gray-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Step 2: 4 more post styles &amp; Swahili captions</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Step 3: 7-day grid, Swap &amp; Skip actions</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Step 4: PWA install &amp; offline caching</span>
        </div>
      </div>

      <button
        onClick={onGoToToday}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-sm transition"
        style={{ minHeight: '46px' }}
      >
        <span>Back to Today's Posts</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
