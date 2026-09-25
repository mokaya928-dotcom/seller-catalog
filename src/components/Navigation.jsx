import React from 'react';
import { CalendarDays, LayoutGrid, Package, Sparkles } from 'lucide-react';

export default function Navigation({ activeTab, onTabChange, pendingPostCount = 0 }) {
  const tabs = [
    {
      id: 'today',
      label: 'Today',
      icon: Sparkles,
      badge: pendingPostCount > 0 ? pendingPostCount : null
    },
    {
      id: 'week',
      label: 'Week',
      icon: CalendarDays,
      badge: null
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      badge: null
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-bottom shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-2 px-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-emerald-700 font-extrabold'
                  : 'text-gray-500 hover:text-gray-900 font-medium'
              }`}
              style={{ minHeight: '52px' }}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {tab.badge && (
                  <span className={`absolute -top-1.5 -right-3 text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-tight ${
                    typeof tab.badge === 'number'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-700 font-semibold'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-4 h-1 bg-emerald-600 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
