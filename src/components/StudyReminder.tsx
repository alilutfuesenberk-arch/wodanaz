import React, { useState, useEffect } from 'react';
import { Bell, Clock, Check, Sparkles, X, Flame, Volume2, ShieldCheck, CalendarDays } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export interface ReminderSettings {
  enabled: boolean;
  time: string; // e.g. "17:30"
  streakDays: number;
  lastCompletedDate: string | null; // "YYYY-MM-DD"
  hasCustomSound: boolean;
  browserNotificationsRequested: boolean;
}

const STORAGE_KEY = 'odev_dostum_reminder_settings';

const MOTIVATIONAL_MESSAGES = [
  'Merhaba şampiyon! 🦉 Bugünkü 15 dakikalık ödev ve soru çözme vaktimiz geldi. Birlikte yeni yıldızlar kazanalım!',
  'Günün sorusu seni bekliyor! 🌟 Her gün düzenli çalışmak zekânı süper güçlere dönüştürür!',
  'Ödev Dostun Baykuş Bilge burada! 📚 Hadi masanın başına geçip bugünkü alıştırmaları keyifle tamamlayalım!',
  'Küçük adımlar, büyük başarılar getirir! 🎯 Bugünün ödevini yapıp rozet koleksiyonunu genişletmeye ne dersin?',
  'Öğrenme saati çaldı! 🚀 Merak ettiğin soruların cevaplarını keşfetmek için hazırım!',
];

interface StudyReminderProps {
  onStartStudy?: () => void;
  className?: string;
  forceOpenModal?: boolean;
  onCloseModal?: () => void;
  onOpenPlanner?: () => void;
}

export const StudyReminder: React.FC<StudyReminderProps> = ({
  onStartStudy,
  className = '',
  forceOpenModal,
  onCloseModal,
  onOpenPlanner,
}) => {
  const [settings, setSettings] = useState<ReminderSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return {
      enabled: true,
      time: '17:30',
      streakDays: 3,
      lastCompletedDate: null,
      hasCustomSound: true,
      browserNotificationsRequested: false,
    };
  });

  const [isOpenModal, setIsOpenModal] = useState(false);
  const isModalVisible = forceOpenModal !== undefined ? forceOpenModal : isOpenModal;
  const handleCloseDialog = () => {
    setIsOpenModal(false);
    if (onCloseModal) onCloseModal();
  };
  const [selectedTime, setSelectedTime] = useState(settings.time);
  const [reminderActiveNow, setReminderActiveNow] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Check if today is completed
  const todayStr = new Date().toISOString().split('T')[0];
  const isCompletedToday = settings.lastCompletedDate === todayStr;

  // Real-time check if current time matches reminder time
  useEffect(() => {
    if (!settings.enabled) return;

    const checkTime = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      if (currentTimeStr === settings.time && !isCompletedToday && !reminderActiveNow) {
        setReminderActiveNow(true);
        triggerNotificationAlert();
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [settings.enabled, settings.time, isCompletedToday, reminderActiveNow]);

  const triggerNotificationAlert = () => {
    soundFX.playCelebration();
    const msg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];

    // Browser Notification if supported & granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('Ödev Dostum Hatırlatıcısı 🦉', {
          body: msg,
          icon: '/favicon.ico',
        });
      } catch {}
    }
  };

  const handleRequestBrowserNotification = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
        if (perm === 'granted') {
          soundFX.playPop();
          setToastMessage('Harika! Tarayıcı bildirimleri açıldı 🔔');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3500);
          new Notification('Ödev Dostum Hazır! 🦉', {
            body: `Her gün saat ${settings.time}'de seninle birlikte ders çalışacağız!`,
          });
        }
      } catch (e) {
        console.error('Notification permission error:', e);
      }
    }
  };

  const handleSaveSettings = () => {
    soundFX.playCelebration();
    setSettings((prev) => ({
      ...prev,
      time: selectedTime,
      enabled: true,
    }));
    handleCloseDialog();
    setToastMessage(`Hatırlatıcı her gün saat ${selectedTime} olarak ayarlandı! ⏰`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleTestNotification = () => {
    soundFX.playCelebration();
    setActiveMessageIndex((prev) => (prev + 1) % MOTIVATIONAL_MESSAGES.length);
    setReminderActiveNow(true);
    triggerNotificationAlert();
  };

  const handleMarkDoneToday = () => {
    soundFX.playCelebration();
    const newStreak = isCompletedToday ? settings.streakDays : settings.streakDays + 1;
    setSettings((prev) => ({
      ...prev,
      lastCompletedDate: todayStr,
      streakDays: newStreak,
    }));
    setReminderActiveNow(false);
    setToastMessage('Tebrikler şampiyon! Bugünkü çalışma serin kaydedildi 🔥');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  return (
    <>
      {/* Mini Bar or Card in Page */}
      <div
        className={`bg-linear-to-r from-purple-50 via-violet-50 to-purple-50/70 border border-purple-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs transition-all ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Ödev Dostum Avatar & Streak Info */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-purple-500 to-violet-600 flex items-center justify-center text-2xl shadow-sm text-white select-none animate-bounce-slow">
                🦉
              </div>
              {settings.enabled && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-800 font-['Fredoka']">
                  Ödev Dostum Hatırlatıcısı
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
                  <Flame className="w-3 h-3 text-purple-600 fill-purple-500" />
                  {settings.streakDays} Gün Seri
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-purple-600" />
                <span>
                  Günlük çalışma saatin:{' '}
                  <strong className="text-slate-900 font-bold">{settings.time}</strong>
                </span>
                {isCompletedToday ? (
                  <span className="text-emerald-700 font-bold bg-emerald-100/80 px-1.5 py-0.2 rounded text-2xs inline-flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5" /> Bugün tamamlandı
                  </span>
                ) : (
                  <span className="text-purple-700 font-semibold text-2xs">
                    (Henüz çalışılmadı)
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
            {onOpenPlanner && (
              <button
                onClick={() => {
                  soundFX.playPop();
                  onOpenPlanner();
                }}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100/80 text-purple-900 text-xs font-bold rounded-xl border border-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Haftalık ders ve ödev planlayıcını aç"
              >
                <CalendarDays className="w-3.5 h-3.5 text-purple-700" />
                <span>Haftalık Plan</span>
              </button>
            )}

            <button
              onClick={handleTestNotification}
              className="px-2.5 py-1.5 bg-purple-100 hover:bg-purple-200/80 text-purple-900 text-xs font-bold rounded-xl border border-purple-200 transition-colors flex items-center gap-1 cursor-pointer"
              title="Ödev Dostum karakterinin sesini ve mesajını dene"
            >
              <Volume2 className="w-3.5 h-3.5 text-purple-700" />
              <span>Dene</span>
            </button>

            <button
              onClick={() => {
                soundFX.playPop();
                setIsOpenModal(true);
              }}
              className="px-3 py-1.5 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-900 text-xs font-bold rounded-xl border border-slate-200 hover:border-purple-300 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-purple-600" />
              <span>Saati Ayarla</span>
            </button>

            {!isCompletedToday && (
              <button
                onClick={handleMarkDoneToday}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                title="Bugünkü çalışmanı tamamlandı olarak işaretle"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Bugün Çalıştım</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Active Study Alert (when time triggers or Test clicked) */}
      {reminderActiveNow && (
        <div className="fixed bottom-6 right-4 sm:right-6 max-w-md w-[calc(100vw-2rem)] bg-white rounded-3xl p-5 shadow-2xl border-2 border-purple-300 z-50 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-purple-600 via-violet-500 to-orange-400 text-white flex items-center justify-center text-2xl shadow-sm">
                🦉
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 font-['Fredoka']">
                  Ödev Dostum Seni Çağırıyor! ⏰
                </h4>
                <span className="text-2xs font-bold text-orange-600">Günlük Çalışma Vakti Geldi</span>
              </div>
            </div>
            <button
              onClick={() => {
                soundFX.playPop();
                setReminderActiveNow(false);
              }}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-purple-50/70 p-3 rounded-2xl border border-purple-200/80 my-3 text-xs sm:text-sm text-purple-950 leading-relaxed font-medium">
            "{MOTIVATIONAL_MESSAGES[activeMessageIndex]}"
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={handleMarkDoneToday}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Bugünü Tamamla (+1 Gün Seri)</span>
            </button>

            <button
              onClick={() => {
                soundFX.playPop();
                setReminderActiveNow(false);
                if (onStartStudy) onStartStudy();
              }}
              className="px-3 py-2 bg-linear-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Hemen Başla!</span>
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-purple-100 to-orange-100 border border-purple-200 flex items-center justify-center text-2xl">
                  ⏰
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 font-['Fredoka']">
                    Günlük Ders Hatırlatıcısı
                  </h3>
                  <p className="text-xs text-slate-500">Düzenli çalışma alışkanlığı kazanın</p>
                </div>
              </div>
              <button
                onClick={handleCloseDialog}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div className="bg-purple-50/70 rounded-2xl p-4 border border-purple-200 text-xs text-purple-950 leading-relaxed space-y-1.5">
                <div className="font-bold text-purple-900 flex items-center gap-1">
                  <span>🦉</span>
                  <span>Ödev Dostum Tavsiyesi:</span>
                </div>
                <p>
                  Her gün aynı saatte masaya oturmak beynimizin odaklanma kaslarını güçlendirir.
                  Günde sadece 20-30 dakika ayırmak büyük başarılar sağlar!
                </p>
              </div>

              {/* Time Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Her Gün Hatırlatma Saati
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-2.5 text-lg font-black text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Hızlı Seçenekler
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Okul Sonrası', time: '16:00' },
                    { label: 'Akşam Üstü', time: '17:30' },
                    { label: 'Yemek Sonrası', time: '19:30' },
                  ].map((p) => (
                    <button
                      key={p.time}
                      onClick={() => {
                        soundFX.playPop();
                        setSelectedTime(p.time);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedTime === p.time
                          ? 'bg-purple-700 text-white border-purple-800 shadow-2xs'
                          : 'bg-slate-50 hover:bg-purple-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <div>{p.label}</div>
                      <div className="text-2xs opacity-80">{p.time}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Browser Notification Permission Button */}
              {notificationPermission !== 'granted' && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-between gap-2">
                  <div className="text-2xs text-purple-900 leading-tight">
                    <span className="font-bold block text-xs">Tarayıcı Bildirimleri</span>
                    Sekme açık olmasa da bildirim almak için izin ver.
                  </div>
                  <button
                    onClick={handleRequestBrowserNotification}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer"
                  >
                    İzin Ver
                  </button>
                </div>
              )}

              {notificationPermission === 'granted' && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-2xs text-emerald-800 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tarayıcı bildirimleri aktif. Saat {selectedTime}'de bildirim alacaksınız!</span>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleCloseDialog}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-sm cursor-pointer transition-colors"
              >
                Kaydet ve Etkinleştir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast popup */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border border-slate-800 animate-in fade-in slide-in-from-top-2">
          <span>🦉</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};
