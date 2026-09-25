/**
 * Notification & Posting Alarm Service
 * - Custom Adjustable Time-Slots (Owner can adjust hours, minutes, or disable slots)
 * - Real System Web Push Notifications via PWA Service Worker with vibration & synthesized sound chime
 * - 1-Tap Native Phone Calendar / Hardware Alarm Sync (.ics) for 100% sleep-proof alarms
 * - Instant "Test Notification" trigger for user verification
 */
import { TIME_SLOTS } from '../data/starterData.js';

const STORAGE_KEYS = {
  SCHEDULE: 'dailypost_notification_schedule_v2',
  ENABLED: 'dailypost_notifications_enabled_v2',
  NOTIFIED_PREFIX: 'dailypost_notified_v2_',
  SOUND: 'dailypost_notification_sound_v2'
};

export const DEFAULT_SCHEDULE = TIME_SLOTS.map((slot) => ({
  ...slot,
  enabled: true
}));

export const NOTIFICATION_SOUND_PRESETS = [
  {
    id: 'mpesa_chaching',
    name: 'M-Pesa Cha-Ching',
    emoji: '💰',
    description: 'Cash register ring & coin chime (Local favorite)'
  },
  {
    id: 'classic_bell',
    name: 'Classic Bell',
    emoji: '🛎️',
    description: 'Clear dual-tone shop bell'
  },
  {
    id: 'soft_marimba',
    name: 'Soft Marimba',
    emoji: '🎶',
    description: 'Warm wooden harmonic melody'
  },
  {
    id: 'digital_ping',
    name: 'Digital Ping',
    emoji: '⚡',
    description: 'Crisp modern electronic ping'
  }
];

export const DEFAULT_SOUND_CONFIG = {
  id: 'mpesa_chaching',
  name: 'M-Pesa Cha-Ching',
  emoji: '💰'
};

/**
 * Synthesized Sound Engines (Zero audio downloads, 100% offline, crystal clear)
 */

function playClassicBell(ctx, now) {
  // First bell tone (D5 - 587Hz)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(587.33, now);
  gain1.gain.setValueAtTime(0.2, now);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.45);

  // Second higher bell tone (A5 - 880Hz)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(880, now + 0.12);
  gain2.gain.setValueAtTime(0.25, now + 0.12);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now + 0.12);
  osc2.stop(now + 0.75);
}

function playMpesaChaChing(ctx, now) {
  // Part 1: Rapid coin shimmer / mechanical register roll
  const coinNotes = [1318.5, 1760.0, 2093.0]; // E6, A6, C7
  coinNotes.forEach((freq, idx) => {
    const t = now + idx * 0.04;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  });

  // Part 2: "Ching!" - Resonant brass register bell
  const bellStart = now + 0.13;
  const bell1 = ctx.createOscillator();
  const gainB1 = ctx.createGain();
  bell1.type = 'sine';
  bell1.frequency.setValueAtTime(2637, bellStart); // E7
  gainB1.gain.setValueAtTime(0.28, bellStart);
  gainB1.gain.exponentialRampToValueAtTime(0.0001, bellStart + 0.9);
  bell1.connect(gainB1);
  gainB1.connect(ctx.destination);
  bell1.start(bellStart);
  bell1.stop(bellStart + 0.9);

  // Sparkling harmonic overtone (5274 Hz - E8)
  const bell2 = ctx.createOscillator();
  const gainB2 = ctx.createGain();
  bell2.type = 'sine';
  bell2.frequency.setValueAtTime(5274, bellStart);
  gainB2.gain.setValueAtTime(0.12, bellStart);
  gainB2.gain.exponentialRampToValueAtTime(0.0001, bellStart + 0.5);
  bell2.connect(gainB2);
  gainB2.connect(ctx.destination);
  bell2.start(bellStart);
  bell2.stop(bellStart + 0.5);
}

function playSoftMarimba(ctx, now) {
  // Warm wooden harmonic triad: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    const t = now + idx * 0.085;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.42);
  });
}

function playDigitalPing(ctx, now) {
  // Crystal electronic blip: C6 (1046.5Hz) followed quickly by C7 (2093Hz)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(1046.5, now);
  gain1.gain.setValueAtTime(0.22, now);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.18);

  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(2093, now + 0.09);
  gain2.gain.setValueAtTime(0.28, now + 0.09);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now + 0.09);
  osc2.stop(now + 0.5);
}

let activeCustomAudio = null;

function playCustomAudio(dataUrl) {
  try {
    if (activeCustomAudio) {
      activeCustomAudio.pause();
      activeCustomAudio.currentTime = 0;
    }
    const audio = new Audio(dataUrl);
    activeCustomAudio = audio;
    audio.volume = 1.0;
    const p = audio.play();
    if (p !== undefined) {
      p.catch((err) => {
        console.warn('Could not play custom audio file, falling back to preset:', err);
        playPresetSound('mpesa_chaching');
      });
    }
  } catch (err) {
    console.warn('Custom audio playback exception:', err);
    playPresetSound('mpesa_chaching');
  }
}

function playPresetSound(presetId) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;

    switch (presetId) {
      case 'classic_bell':
        playClassicBell(ctx, now);
        break;
      case 'soft_marimba':
        playSoftMarimba(ctx, now);
        break;
      case 'digital_ping':
        playDigitalPing(ctx, now);
        break;
      case 'mpesa_chaching':
      default:
        playMpesaChaChing(ctx, now);
        break;
    }
  } catch (e) {
    // Audio context not allowed until user interaction, safely ignore
  }
}

/**
 * Play a notification sound: custom uploaded audio or chosen preset chime
 * @param {Object|string} [soundInput] - Sound config object or preset ID string
 */
export function playNotificationSound(soundInput) {
  let config;
  if (!soundInput) {
    config = notificationService.getSoundConfig();
  } else if (typeof soundInput === 'string') {
    config = { id: soundInput };
  } else {
    config = soundInput;
  }

  if (config.id === 'custom' && config.customDataUrl) {
    playCustomAudio(config.customDataUrl);
    return;
  }

  playPresetSound(config.id || 'mpesa_chaching');
}

/**
 * Backward compatibility alias for playNotificationSound
 */
export function playNotificationChime() {
  playNotificationSound();
}

/**
 * Parse time string like "09:00 AM" or "12:30 PM" into 24h { hours, minutes }
 */
export function parseTime12To24(timeStr) {
  if (!timeStr) return { hours: 9, minutes: 0 };
  const cleaned = timeStr.trim();
  const match = cleaned.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return { hours: 9, minutes: 0 };

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = (match[3] || '').toUpperCase();

  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  return { hours, minutes };
}

/**
 * Format 24h hours and minutes into "09:00 AM" format
 */
export function formatTime24To12(hours, minutes) {
  const h24 = parseInt(hours, 10) || 0;
  const m = String(parseInt(minutes, 10) || 0).padStart(2, '0');
  const meridiem = h24 >= 12 ? 'PM' : 'AM';
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  const hStr = String(h12).padStart(2, '0');
  return `${hStr}:${m} ${meridiem}`;
}

export const notificationService = {
  /**
   * Check if Web Notifications are supported on this device
   */
  isSupported() {
    return typeof window !== 'undefined' && 'Notification' in window;
  },

  /**
   * Get current browser notification permission
   * Returns 'granted' | 'denied' | 'default' | 'unsupported'
   */
  getPermission() {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  },

  /**
   * Request system notification permission
   */
  async requestPermission() {
    if (!this.isSupported()) return 'unsupported';
    try {
      const result = await Notification.requestPermission();
      if (result === 'granted') {
        this.setEnabled(true);
      }
      return result;
    } catch (e) {
      console.warn('Error requesting notification permission', e);
      return 'denied';
    }
  },

  /**
   * Check if notifications are enabled by the seller
   */
  isEnabled() {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return false;
    }
    const val = localStorage.getItem(STORAGE_KEYS.ENABLED);
    return val === null ? true : val === 'true';
  },

  /**
   * Set notifications enabled toggle
   */
  setEnabled(enabled) {
    localStorage.setItem(STORAGE_KEYS.ENABLED, String(enabled));
  },

  /**
   * Get custom schedule or default schedule
   */
  getSchedule() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored schedule', e);
    }
    return DEFAULT_SCHEDULE;
  },

  /**
   * Save customized schedule
   */
  saveSchedule(newSchedule) {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(newSchedule));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dailypost_schedule_changed', { detail: newSchedule }));
    }
    return newSchedule;
  },

  /**
   * Update a specific slot's time or enabled status
   */
  updateSlot(slotId, updates) {
    const current = this.getSchedule();
    const updated = current.map((slot) => {
      if (slot.id === slotId) {
        return { ...slot, ...updates };
      }
      return slot;
    });
    return this.saveSchedule(updated);
  },

  /**
   * Reset schedule back to default recommended Kenyan commerce times
   */
  resetSchedule() {
    return this.saveSchedule(DEFAULT_SCHEDULE);
  },

  /**
   * Get configured notification sound (preset or custom)
   */
  getSoundConfig() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SOUND);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.id || parsed.customDataUrl)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse sound config', e);
    }
    return DEFAULT_SOUND_CONFIG;
  },

  /**
   * Save configured notification sound
   */
  saveSoundConfig(soundConfig) {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND, JSON.stringify(soundConfig));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('dailypost_sound_changed', { detail: soundConfig }));
      }
    } catch (e) {
      console.warn('Failed to save sound config', e);
    }
    return soundConfig;
  },

  /**
   * Send a real system notification banner with sound & vibration
   */
  async showNotification(title, options = {}) {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return false;
    }

    // Play pleasant notification audio chime
    playNotificationChime();

    const notifOptions = {
      body: options.body || "Time to post today's flyer on WhatsApp Status!",
      icon: options.icon || '/icon-192.png',
      badge: '/favicon-32x32.png',
      vibrate: [250, 100, 250, 100, 250],
      tag: options.tag || `dailypost_${Date.now()}`,
      renotify: true,
      data: {
        url: options.url || '/?view=seller',
        ...options.data
      },
      ...options
    };

    // Try service worker showNotification first (native mobile background support)
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;
        if (reg && 'showNotification' in reg) {
          await reg.showNotification(title, notifOptions);
          return true;
        }
      } catch (err) {
        console.warn('Service worker showNotification error, falling back to window Notification', err);
      }
    }

    // Window Notification fallback
    try {
      const n = new Notification(title, notifOptions);
      n.onclick = (e) => {
        e.preventDefault();
        window.focus();
        if (notifOptions.data?.url) {
          window.location.href = notifOptions.data.url;
        }
      };
      return true;
    } catch (e) {
      console.warn('Window Notification error', e);
      return false;
    }
  },

  /**
   * Send an immediate test notification so seller can verify sound & vibration
   */
  async sendTestNotification(shopName = 'Your Store') {
    const perm = this.getPermission();
    if (perm !== 'granted') {
      const requested = await this.requestPermission();
      if (requested !== 'granted') {
        throw new Error('Notification permission was not granted. Please allow notifications in your browser settings.');
      }
    }

    return this.showNotification(`⏰ Daily Post Test: Working 100%! 🎉`, {
      body: `Live posting notifications & vibrations are active for ${shopName}. You're all set!`,
      url: '/?view=seller',
      tag: 'test_notification'
    });
  },

  /**
   * Check if any enabled time-slot is due right now and trigger notification
   * @param {Array} posts - Today's generated daily posts
   * @param {Object} seller - Seller profile
   * @param {String} todayDateStr - YYYY-MM-DD
   */
  checkAndNotifyDueSlots(posts, seller, todayDateStr) {
    if (!this.isEnabled()) return;

    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const schedule = this.getSchedule();

    schedule.forEach((slot) => {
      if (!slot.enabled) return;

      const { hours, minutes } = parseTime12To24(slot.time);

      // Check if current time is within +/- 2 minutes of the slot time
      const diffMinutes = Math.abs((currentHours * 60 + currentMinutes) - (hours * 60 + minutes));
      if (diffMinutes <= 2) {
        const notifiedKey = `${STORAGE_KEYS.NOTIFIED_PREFIX}${todayDateStr}_${slot.id}`;
        const alreadyNotified = localStorage.getItem(notifiedKey);

        if (!alreadyNotified) {
          // Find matching post
          const matchingPost = posts.find((p) => p.slotId === slot.id) || posts[0];
          const prodName = matchingPost?.product?.name || 'New Product Drop';
          const prodPrice = matchingPost?.product?.price ? `KES ${Number(matchingPost.product.price).toLocaleString()}` : '';

          this.showNotification(`⏰ Time to Post: ${slot.label || slot.time}`, {
            body: `Your ${slot.time} flyer is ready: "${prodName}" ${prodPrice ? `(${prodPrice})` : ''}. Tap to copy caption & share!`,
            url: `/?view=seller#${slot.id}`,
            tag: `slot_${slot.id}_${todayDateStr}`
          });

          localStorage.setItem(notifiedKey, 'true');
        }
      }
    });
  },

  /**
   * Generate an RFC 5545 iCalendar (.ics) file with recurring daily alarms for each enabled slot
   * Imports directly into Google Calendar, Samsung Calendar, Apple Calendar
   * 100% Sleep-Proof: Uses device native hardware alarm clock
   */
  generateCalendarIcs(schedule, shopName = 'Daily Post') {
    const enabledSlots = schedule.filter((s) => s.enabled);
    if (enabledSlots.length === 0) {
      throw new Error('No enabled time slots to sync. Please enable at least one time slot.');
    }

    const cleanShop = shopName.replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'Store';
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Daily Post Kenya//Seller Studio Reminders//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:Daily Post Reminders - ${cleanShop}`,
      'X-WR-TIMEZONE:Africa/Nairobi'
    ];

    enabledSlots.forEach((slot, index) => {
      const { hours, minutes } = parseTime12To24(slot.time);
      const hStr = String(hours).padStart(2, '0');
      const mStr = String(minutes).padStart(2, '0');
      const dtStart = `${year}${month}${day}T${hStr}${mStr}00`;
      
      // End time 15 minutes later
      const endMinutes = (minutes + 15) % 60;
      const endHours = hours + Math.floor((minutes + 15) / 60);
      const dtEnd = `${year}${month}${day}T${String(endHours).padStart(2, '0')}${String(endMinutes).padStart(2, '0')}00`;
      const uid = `dailypost_alarm_${slot.id}_${Date.now()}_${index}@dailypost.ke`;

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${year}${month}${day}T000000Z`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        'RRULE:FREQ=DAILY', // Repeats daily forever!
        `SUMMARY:⏰ Daily Post: ${slot.time} - ${slot.label}`,
        `DESCRIPTION:Time to share your scheduled product flyer on WhatsApp Status! Tap to open Daily Post Seller Studio.`,
        'STATUS:CONFIRMED',
        'TRANSP:TRANSPARENT',
        // Alarm 1: At the exact time
        'BEGIN:VALARM',
        'TRIGGER:PT0M',
        'ACTION:DISPLAY',
        `DESCRIPTION:⏰ Time to post your ${slot.time} flyer on WhatsApp Status!`,
        'END:VALARM',
        // Alarm 2: 5 minutes heads-up
        'BEGIN:VALARM',
        'TRIGGER:-PT5M',
        'ACTION:DISPLAY',
        `DESCRIPTION:5 minutes until your ${slot.time} WhatsApp post!`,
        'END:VALARM',
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');
    const icsString = icsContent.join('\r\n');

    const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DailyPost_${cleanShop.replace(/\s+/g, '_')}_Alarms.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
};
