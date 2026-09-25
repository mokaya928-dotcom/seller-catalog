import React, { useState, useEffect, useCallback } from 'react';
import { Lock, ShieldCheck, Delete, ArrowRight, Sparkles } from 'lucide-react';

export default function PinLockScreen({ seller, onUnlock, onShowToast }) {
  const [enteredPin, setEnteredPin] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Get configured PIN (from seller profile, localStorage, or fallback to default '1234')
  const correctPin = String(seller?.pin || localStorage.getItem('dailypost_owner_pin') || '1234');

  const brandColor = seller?.brand_color || '#064e3b';
  const isSlate = seller?.palette === 'slate';

  const handleDigit = useCallback((digit) => {
    if (enteredPin.length >= 4) return;
    const next = enteredPin + digit;
    setEnteredPin(next);
    setIsError(false);
    setErrorMsg('');

    if (navigator.vibrate) {
      navigator.vibrate(30);
    }

    if (next.length === 4) {
      // Verify immediately
      if (next === correctPin) {
        if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
        sessionStorage.setItem('seller_unlocked', 'true');
        onUnlock();
      } else {
        if (navigator.vibrate) navigator.vibrate([80, 50, 80]);
        setIsError(true);
        setErrorMsg('Incorrect PIN. Please try again.');
        setTimeout(() => {
          setEnteredPin('');
          setIsError(false);
        }, 900);
      }
    }
  }, [enteredPin, correctPin, onUnlock]);

  const handleDelete = useCallback(() => {
    setEnteredPin((prev) => prev.slice(0, -1));
    setIsError(false);
    setErrorMsg('');
  }, []);

  const handleClear = useCallback(() => {
    setEnteredPin('');
    setIsError(false);
    setErrorMsg('');
  }, []);

  // Support physical keyboard 0-9 and Backspace
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (/^[0-9]$/.test(e.key)) {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleDelete, handleClear]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-between px-6 py-10 selection:bg-emerald-500 selection:text-white ${
      isSlate 
        ? 'bg-gradient-to-b from-slate-950 via-[#0f172a] to-slate-900 text-white' 
        : 'bg-gradient-to-b from-emerald-950 via-[#064e3b] to-emerald-900 text-white'
    }`}>
      {/* Top Brand & Security Header */}
      <div className="w-full max-w-xs flex flex-col items-center text-center pt-4">
        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3 shadow-xl shadow-black/20">
          <Lock className="w-8 h-8 text-amber-300 stroke-[2.2px] animate-pulse" />
        </div>
        <h1 className="text-xl font-black tracking-tight text-white drop-shadow-sm">
          {seller?.shop_name || 'Daily Post Studio'}
        </h1>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-200/90 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
          <span>Owner &amp; Merchant Security</span>
        </div>
      </div>

      {/* Center: PIN Dots & Feedback */}
      <div className="w-full max-w-xs flex flex-col items-center">
        <p className="text-xs uppercase font-extrabold tracking-widest text-emerald-300/80 mb-6">
          Enter 4-Digit Owner PIN
        </p>

        {/* 4 PIN Dots */}
        <div className={`flex items-center gap-5 mb-4 transition-transform ${isError ? 'animate-bounce text-rose-400' : ''}`}>
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = enteredPin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isError 
                    ? 'bg-rose-500 border-2 border-rose-300 scale-110 shadow-lg shadow-rose-500/50' 
                    : isFilled 
                    ? 'bg-amber-300 border-2 border-amber-200 scale-125 shadow-lg shadow-amber-300/50' 
                    : 'bg-white/15 border border-white/30'
                }`}
              />
            );
          })}
        </div>

        {/* Error message or hint */}
        <div className="h-6 flex items-center justify-center text-center">
          {errorMsg ? (
            <p className="text-xs font-bold text-rose-300 animate-fade-in">{errorMsg}</p>
          ) : (
            <p className="text-[11px] text-white/50">Default PIN: 1234 (changeable inside Settings)</p>
          )}
        </div>
      </div>

      {/* Numeric Keypad */}
      <div className="w-full max-w-xs pb-4">
        <div className="grid grid-cols-3 gap-3.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(String(num))}
              className="h-16 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/15 backdrop-blur-md text-2xl font-black text-white flex items-center justify-center transition active:scale-95 shadow-md cursor-pointer select-none"
            >
              {num}
            </button>
          ))}

          {/* Clear Button */}
          <button
            type="button"
            onClick={handleClear}
            className="h-16 rounded-2xl bg-white/5 hover:bg-white/15 active:bg-white/20 border border-white/10 text-xs uppercase font-extrabold tracking-wider text-emerald-300 flex items-center justify-center transition active:scale-95 cursor-pointer select-none"
          >
            Clear
          </button>

          {/* 0 Button */}
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-16 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/15 backdrop-blur-md text-2xl font-black text-white flex items-center justify-center transition active:scale-95 shadow-md cursor-pointer select-none"
          >
            0
          </button>

          {/* Delete / Backspace Button */}
          <button
            type="button"
            onClick={handleDelete}
            className="h-16 rounded-2xl bg-white/5 hover:bg-white/15 active:bg-white/20 border border-white/10 text-emerald-200 flex items-center justify-center transition active:scale-95 cursor-pointer select-none"
            aria-label="Delete"
          >
            <Delete className="w-6 h-6 stroke-[2px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
