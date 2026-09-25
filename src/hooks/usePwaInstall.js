import { useState, useEffect, useCallback } from 'react';

const DISMISS_KEY = 'dailypost_pwa_banner_dismissed_time';
const DISMISS_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [guideMode, setGuideMode] = useState(null); // 'ios' | 'android' | 'desktop' | null
  
  // Real-time network connectivity tracking
  const [isOnline, setIsOnline] = useState(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [showOnlineRecovery, setShowOnlineRecovery] = useState(false);

  // Check if currently running in standalone mode (installed PWA)
  const checkIsStandalone = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')
    );
  }, []);

  useEffect(() => {
    // 1. Initial standalone check
    const standalone = checkIsStandalone();
    setIsInstalled(standalone);

    // 2. OS detection
    const userAgent = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '';
    const iOSCheck = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const androidCheck = /Android/i.test(userAgent);
    setIsIOS(iOSCheck);
    setIsAndroid(androidCheck);

    // 3. Dismissal check
    const lastDismissed = localStorage.getItem(DISMISS_KEY);
    if (lastDismissed) {
      const elapsed = Date.now() - parseInt(lastDismissed, 10);
      if (elapsed < DISMISS_DURATION_MS) {
        setIsDismissed(true);
      } else {
        localStorage.removeItem(DISMISS_KEY);
      }
    }

    // 4. Capture native beforeinstallprompt (Chromium / Edge / Android)
    const handleBeforeInstallPrompt = (e) => {
      // Prevent automatic mini-infobar on mobile Chrome
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // 5. App installed listener
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setGuideMode(null);
      localStorage.removeItem(DISMISS_KEY);
    };

    // 6. Match media listener for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e) => {
      if (e.matches) {
        setIsInstalled(true);
        setDeferredPrompt(null);
        setGuideMode(null);
      }
    };

    // 7. Network connectivity listeners
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineRecovery(true);
      const timer = setTimeout(() => setShowOnlineRecovery(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOnlineRecovery(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleDisplayModeChange);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleDisplayModeChange);
      }
    };
  }, [checkIsStandalone]);

  // Trigger installation prompt
  const promptInstall = useCallback(async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult && choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setGuideMode(null);
        }
        setDeferredPrompt(null);
        return choiceResult ? choiceResult.outcome : 'dismissed';
      } catch (err) {
        console.warn('Error during PWA installation prompt:', err);
      }
    }
    
    // When native prompt is not available, open the step-by-step guide tailored to the user's OS
    if (isIOS) {
      setGuideMode('ios');
      return 'ios_guide';
    } else if (isAndroid) {
      setGuideMode('android');
      return 'android_guide';
    } else {
      setGuideMode('desktop');
      return 'desktop_guide';
    }
  }, [deferredPrompt, isIOS, isAndroid]);

  // Dismiss banner
  const dismissBanner = useCallback(() => {
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {
      // ignore local storage errors
    }
  }, []);

  // Reset dismissal (allows manual trigger from button/settings)
  const resetDismissal = useCallback(() => {
    setIsDismissed(false);
    try {
      localStorage.removeItem(DISMISS_KEY);
    } catch {
      // ignore
    }
  }, []);

  const closeGuide = useCallback(() => {
    setGuideMode(null);
  }, []);

  const openGuide = useCallback((mode) => {
    if (mode) {
      setGuideMode(mode);
    } else if (isIOS) {
      setGuideMode('ios');
    } else if (isAndroid) {
      setGuideMode('android');
    } else {
      setGuideMode('desktop');
    }
  }, [isIOS, isAndroid]);

  // Determine if install CTA should be available
  const canInstall = !isInstalled;

  return {
    canInstall,
    isInstalled,
    isIOS,
    isAndroid,
    isOnline,
    showOnlineRecovery,
    isDismissed,
    hasNativePrompt: Boolean(deferredPrompt),
    guideMode,
    setGuideMode,
    // Backward compatibility for components expecting showIOSGuide
    showIOSGuide: guideMode === 'ios',
    setShowIOSGuide: (val) => setGuideMode(val ? 'ios' : null),
    openGuide,
    closeGuide,
    promptInstall,
    dismissBanner,
    resetDismissal
  };
}
