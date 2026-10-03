import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Bell,
  BellRing,
  BellOff,
  Check,
  Calendar,
  Sparkles,
  Sun,
  Sunset,
  Moon,
  AlertCircle,
  RotateCcw,
  Volume2,
  ShieldCheck,
  Smartphone,
  Plus,
  Trash2
} from 'lucide-react';
import {
  notificationService,
  parseTime12To24,
  formatTime24To12,
  NOTIFICATION_SOUND_PRESETS,
  playNotificationSound
} from '../../services/notificationService';

const ICON_MAP = {
  Sun: Sun,
  Clock: Clock,
  Sparkles: Sparkles,
  Sunset: Sunset,
  Moon: Moon
};

export default function TimeSlotScheduleModal({
  isOpen,
  onClose,
  seller,
  onScheduleUpdated,
  onShowToast
}) {
  const [schedule, setSchedule] = useState(() => notificationService.getSchedule());
  const [isNotifEnabled, setIsNotifEnabled] = useState(() => notificationService.isEnabled());
  const [permission, setPermission] = useState(() => notificationService.getPermission());
  const [soundConfig, setSoundConfig] = useState(() => notificationService.getSoundConfig());
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSchedule(notificationService.getSchedule());
      setIsNotifEnabled(notificationService.isEnabled());
      setPermission(notificationService.getPermission());
      setSoundConfig(notificationService.getSoundConfig());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Request browser permission
  const handleRequestPermission = async () => {
    const result = await notificationService.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      setIsNotifEnabled(true);
      onShowToast('✓ Phone notifications enabled successfully!', 'success');
    } else if (result === 'denied') {
      onShowToast('Notification permission blocked. Please check your browser site settings.', 'error');
    }
  };

  // Immediate test notification
  const handleSendTest = async () => {
    setIsTesting(true);
    try {
      await notificationService.sendTestNotification(seller?.shop_name || 'Daily Post');
      onShowToast('✓ Test alert sent! Look for the banner & listen for the chime.', 'success');
    } catch (err) {
      console.warn('Test notification failed', err);
      onShowToast(err.message || 'Could not send test notification', 'error');
    } finally {
      setIsTesting(false);
    }
  };

  // Update a single slot's time via <input type="time"> (HH:mm 24h format)
  const handleTimeChange = (slotId, time24Value) => {
    if (!time24Value) return;
    const [h, m] = time24Value.split(':');
    const time12 = formatTime24To12(parseInt(h, 10), parseInt(m, 10));

    setSchedule((prev) =>
      prev.map((slot) => {
        if (slot.id === slotId) {
          return { ...slot, time: time12 };
        }
        return slot;
      })
    );
  };

  // Quick Preset Routines for Sellers
  const PRESET_ROUTINES = [
    {
      id: 'morning_rush',
      name: '☀️ Morning Blitz (7-10 AM)',
      desc: '5 rapid morning drops for commute & breakfast scrolling',
      slots: [
        { id: 'm_0715', time: '07:15 AM', label: 'Early Wakeup Browse', icon: 'Sun', enabled: true },
        { id: 'm_0800', time: '08:00 AM', label: 'Morning Commute Rush', icon: 'Sun', enabled: true },
        { id: 'm_0845', time: '08:45 AM', label: 'Office Arrival & Tea Browse', icon: 'Sun', enabled: true },
        { id: 'm_0930', time: '09:30 AM', label: 'Mid-Morning Discovery', icon: 'Sun', enabled: true },
        { id: 'm_1015', time: '10:15 AM', label: 'Morning Flash Deal', icon: 'Sun', enabled: true },
      ]
    },
    {
      id: 'all_day',
      name: '⏰ Standard 5 Drops',
      desc: 'Classic commercial flow across peak shopping windows',
      slots: [
        { id: 'morning_rush', time: '09:00 AM', label: 'Morning Commute & Office Browse', icon: 'Sun', enabled: true },
        { id: 'lunch_break', time: '12:30 PM', label: 'Lunchtime Shoppers & Quick Inquiries', icon: 'Clock', enabled: true },
        { id: 'afternoon_boost', time: '03:30 PM', label: 'Afternoon Pick-Me-Up & Restock', icon: 'Sparkles', enabled: true },
        { id: 'evening_transit', time: '06:30 PM', label: 'Evening Commute & Matatu Scroll', icon: 'Sunset', enabled: true },
        { id: 'bedtime_orders', time: '08:45 PM', label: 'Bedtime Browsing & Next-Day Orders', icon: 'Moon', enabled: true }
      ]
    },
    {
      id: 'high_volume',
      name: '🔥 Power Seller (10 Drops)',
      desc: '10 daily drops spaced every 1.5 hours throughout the day',
      slots: [
        { id: 'pv_1', time: '07:30 AM', label: 'Drop #1 • Early Bird', icon: 'Sun', enabled: true },
        { id: 'pv_2', time: '08:45 AM', label: 'Drop #2 • Commute Rush', icon: 'Sun', enabled: true },
        { id: 'pv_3', time: '10:00 AM', label: 'Drop #3 • Office Browse', icon: 'Sun', enabled: true },
        { id: 'pv_4', time: '11:30 AM', label: 'Drop #4 • Pre-Lunch', icon: 'Clock', enabled: true },
        { id: 'pv_5', time: '01:00 PM', label: 'Drop #5 • Lunch Deal', icon: 'Clock', enabled: true },
        { id: 'pv_6', time: '02:30 PM', label: 'Drop #6 • Pick-Me-Up', icon: 'Sparkles', enabled: true },
        { id: 'pv_7', time: '04:00 PM', label: 'Drop #7 • Tea Break', icon: 'Sparkles', enabled: true },
        { id: 'pv_8', time: '05:30 PM', label: 'Drop #8 • Rush Hour', icon: 'Sunset', enabled: true },
        { id: 'pv_9', time: '07:00 PM', label: 'Drop #9 • Matatu Scroll', icon: 'Sunset', enabled: true },
        { id: 'pv_10', time: '08:30 PM', label: 'Drop #10 • Bedtime Orders', icon: 'Moon', enabled: true }
      ]
    }
  ];

  const handleApplyPreset = (presetSlots) => {
    setSchedule(presetSlots);
    onShowToast('✓ Applied routine! Tap Save Schedule to keep.', 'info');
  };

  const handleAddSlot = () => {
    const count = schedule.length + 1;
    const newSlot = {
      id: `slot_custom_${Date.now()}`,
      time: '11:00 AM',
      label: `Custom Drop #${count}`,
      icon: 'Clock',
      enabled: true
    };
    setSchedule((prev) => [...prev, newSlot]);
    onShowToast('✓ Added new posting window! Pick time & tap Save.', 'success');
  };

  const handleDeleteSlot = (slotId) => {
    if (schedule.length <= 1) {
      onShowToast('You must keep at least 1 posting window.', 'error');
      return;
    }
    setSchedule((prev) => prev.filter((s) => s.id !== slotId));
    onShowToast('Window removed.', 'info');
  };

  // Toggle single slot
  const handleToggleSlot = (slotId) => {
    setSchedule((prev) =>
      prev.map((slot) => {
        if (slot.id === slotId) {
          return { ...slot, enabled: !slot.enabled };
        }
        return slot;
      })
    );
  };

  // Save changes
  const handleSave = () => {
    setIsSaving(true);
    try {
      notificationService.saveSchedule(schedule);
      notificationService.setEnabled(isNotifEnabled);
      notificationService.saveSoundConfig(soundConfig);
      if (onScheduleUpdated) {
        onScheduleUpdated(schedule);
      }
      onShowToast('✓ Custom posting times and alarm settings saved!', 'success');
      onClose();
    } catch (err) {
      console.error('Failed to save schedule', err);
      onShowToast('Error saving schedule', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default Kenyan commerce times
  const handleResetDefaults = () => {
    if (window.confirm('Reset all posting times to default Kenyan peak shopping hours?')) {
      const reset = notificationService.resetSchedule();
      setSchedule(reset);
      if (onScheduleUpdated) {
        onScheduleUpdated(reset);
      }
      onShowToast('✓ Reset to standard peak shopping times', 'info');
    }
  };

  // Native phone calendar alarm download
  const handleSyncCalendar = () => {
    try {
      notificationService.generateCalendarIcs(schedule, seller?.shop_name || 'Daily Post');
      onShowToast('✓ Calendar alarm file downloaded! Tap to import to your phone.', 'success');
    } catch (err) {
      onShowToast(err.message || 'Could not generate calendar alarms', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900 leading-tight">
                Posting Schedule &amp; Alarms
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                Adjust your daily posting times &amp; set sleep-proof reminders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Notification Permission & Verification Banner */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                  Phone Posting Alerts
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  permission === 'granted'
                    ? 'bg-emerald-200/80 text-emerald-900'
                    : 'bg-amber-200/80 text-amber-900'
                }`}
              >
                {permission === 'granted' ? 'Permitted ✓' : 'Permission Required'}
              </span>
            </div>

            <p className="text-[11px] text-emerald-900/90 leading-tight">
              Pops a real notification and buzzes your phone when it's time to share your next WhatsApp flyer.
            </p>

            <div className="flex items-center gap-2 pt-0.5">
              {permission !== 'granted' ? (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Enable Notifications on this Phone</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={isTesting}
                    onClick={handleSendTest}
                    className="flex-1 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isTesting ? 'Sending test...' : 'Send Test Notification Now'}</span>
                  </button>
                  <label className="flex items-center gap-1.5 cursor-pointer bg-emerald-100/70 border border-emerald-300/80 px-2.5 py-1.5 rounded-xl text-xs font-bold text-emerald-950">
                    <input
                      type="checkbox"
                      checked={isNotifEnabled}
                      onChange={(e) => setIsNotifEnabled(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Active</span>
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Sound Chime Preset Selector */}
          <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-black text-amber-950 uppercase tracking-wider">
                  Notification Alert Chime
                </span>
              </div>
              <span className="text-[10px] text-amber-800 font-bold">100% Offline Audio</span>
            </div>

            <p className="text-[11px] text-amber-900/80 leading-tight">
              Choose the chime that rings on your phone when a posting window arrives. Tap ▶ to preview.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {NOTIFICATION_SOUND_PRESETS.map((preset) => {
                const isSelected = (soundConfig?.id || 'mpesa_chaching') === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setSoundConfig({ id: preset.id, name: preset.name, emoji: preset.emoji });
                      playNotificationSound(preset.id);
                    }}
                    className={`p-2 rounded-xl border cursor-pointer transition flex items-center justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-amber-100/90 border-amber-400 text-amber-950 ring-2 ring-amber-400/30 font-bold'
                        : 'bg-white border-gray-200 hover:bg-amber-50/40 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-base flex-shrink-0">{preset.emoji}</span>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold truncate leading-tight">{preset.name}</div>
                        <div className="text-[9px] text-gray-500 truncate">
                          {preset.id === 'mpesa_chaching' ? 'Kenyan Favorite' : 'Chime'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playNotificationSound(preset.id);
                      }}
                      className="w-6 h-6 rounded-lg bg-amber-200/90 hover:bg-amber-300 text-amber-950 flex items-center justify-center flex-shrink-0 text-[10px] font-black transition active:scale-90"
                      title={`Preview ${preset.name}`}
                    >
                      ▶
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Schedule Routines */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700 px-1">
              <span>Choose Posting Routine</span>
              <span className="text-[10px] text-emerald-700 font-semibold">1-Tap Setup</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {PRESET_ROUTINES.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset.slots)}
                  className="p-2 rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-emerald-50 hover:border-emerald-300 text-left transition"
                >
                  <div className="text-[11px] font-black text-gray-900 leading-tight truncate">
                    {preset.name}
                  </div>
                  <div className="text-[9px] text-gray-500 line-clamp-1 mt-0.5">
                    {preset.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700 px-1">
              <span>Your Daily Posting Windows</span>
              <span className="text-[10px] text-gray-500 font-medium">Click time to change</span>
            </div>

            <div className="space-y-2">
              {schedule.map((slot) => {
                const IconComponent = ICON_MAP[slot.icon] || Clock;
                const { hours, minutes } = parseTime12To24(slot.time);
                const time24 = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

                return (
                  <div
                    key={slot.id}
                    className={`flex items-center justify-between gap-3 p-3 rounded-2xl border transition ${
                      slot.enabled
                        ? 'bg-white border-gray-200 shadow-2xs'
                        : 'bg-gray-50/70 border-gray-200/60 opacity-60'
                    }`}
                  >
                    {/* Left: Icon & Label */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          slot.enabled
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-gray-900 truncate">
                          {slot.label}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {slot.enabled ? 'Alarm active' : 'Turned off'}
                        </div>
                      </div>
                    </div>

                    {/* Right: Time Picker, Switch & Delete */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Native Time Input */}
                      <div className="relative">
                        <input
                          type="time"
                          value={time24}
                          disabled={!slot.enabled}
                          onChange={(e) => handleTimeChange(slot.id, e.target.value)}
                          className={`px-2.5 py-1.5 rounded-xl border text-xs font-black font-mono transition outline-none cursor-pointer ${
                            slot.enabled
                              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 focus:ring-2 focus:ring-emerald-500'
                              : 'bg-gray-100 border-gray-200 text-gray-400'
                          }`}
                        />
                      </div>

                      {/* Toggle On/Off */}
                      <button
                        type="button"
                        onClick={() => handleToggleSlot(slot.id)}
                        className={`w-10 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                          slot.enabled ? 'bg-emerald-600' : 'bg-gray-300'
                        }`}
                        title={slot.enabled ? 'Disable this slot' : 'Enable this slot'}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                            slot.enabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>

                      {/* Delete Slot Button */}
                      {schedule.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Remove this slot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Add Custom Slot Button */}
              <button
                type="button"
                onClick={handleAddSlot}
                className="w-full py-2.5 px-3 rounded-2xl border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-gray-600 hover:text-emerald-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Posting Time (+ Window)</span>
              </button>
            </div>
          </div>

          {/* Sleep-Proof Native Calendar Alarm Sync Card */}
          <div className="border border-blue-200 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-blue-950">
                  100% Sleep-Proof Calendar Alarms
                </div>
                <p className="text-[11px] text-blue-900/80 mt-0.5 leading-tight">
                  Phones put browser tabs to sleep to save battery. Syncing to your native phone calendar
                  (Google or Apple) sets hardware alarms that ring even when your phone is in deep sleep!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSyncCalendar}
              className="w-full bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs transition"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Sync Alarms to Phone Calendar (.ics)</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md transition text-xs flex items-center justify-center gap-2"
              style={{ minHeight: '48px' }}
            >
              <Check className="w-4 h-4 stroke-[3px]" />
              <span>Save Schedule &amp; Alarms</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="w-full text-center text-[11px] font-bold text-gray-500 hover:text-gray-800 py-1 transition flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Default Peak Shopping Hours</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
