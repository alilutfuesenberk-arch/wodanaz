import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Gamepad2,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2,
  Plus,
  Flame,
  Zap,
  TrendingUp,
  X,
  Hourglass,
  Calendar,
  Gift,
  Star,
  Shield,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudySession, ActivityType, GameBankState } from '../types';
import { soundFX } from '../utils/soundEffects';

const STORAGE_KEY = 'odev_dostum_game_bank';

interface StudyTimerAndGameBankProps {
  isOpen: boolean;
  onClose: () => void;
  onEarnStar?: () => void;
  onBankUpdated?: (availableMinutes: number) => void;
  lastFinishedSession?: StudySession | null;
}

const DEFAULT_BANK_STATE: GameBankState = {
  totalPoints: 240,
  totalGameMinutes: 60,
  usedGameMinutes: 15,
  sessions: [
    {
      id: 'session-1',
      startTime: new Date(Date.now() - 3600000 * 2).toISOString(),
      durationSeconds: 1500, // 25 dk
      activityType: 'homework',
      title: 'MEB Matematik - Üslü İfadeler Testi',
      subject: 'Matematik',
      difficulty: 'Orta',
      correctCount: 4,
      totalQuestions: 5,
      pointsEarned: 35, // 25 dk (25 XP) + 10 test
      gameMinutesEarned: 25,
    },
    {
      id: 'session-2',
      startTime: new Date(Date.now() - 3600000 * 24).toISOString(),
      durationSeconds: 1800, // 30 dk
      activityType: 'reading',
      title: 'Küçük Prens (Kitap Okuma)',
      subject: 'Türkçe',
      pointsEarned: 45, // 30 dk (30 XP) + 15 okuma bonusu
      gameMinutesEarned: 30,
    },
    {
      id: 'session-3',
      startTime: new Date(Date.now() - 3600000 * 48).toISOString(),
      durationSeconds: 1200, // 20 dk
      activityType: 'study',
      title: 'Fen Bilimleri - Hücre Tekrarı',
      subject: 'Fen Bilimleri',
      pointsEarned: 25, // 20 dk (20 XP) + 5 tekrar
      gameMinutesEarned: 20,
    },
  ],
};

// Seviye ve Başarı Ligi Kademeleri (Zorlayıcı & Gerçekçi)
function getLevelInfo(points: number) {
  if (points >= 1400) {
    return {
      level: 4,
      title: '💎 LGS Şampiyonu',
      badge: 'Şampiyon',
      color: 'from-purple-600 via-violet-600 to-orange-500',
      minPoints: 1400,
      nextThreshold: 2500,
      progressPct: Math.min(100, Math.round(((points - 1400) / 1100) * 100)),
      desc: 'Zirve odaklanma! LGS hedeflerinde en üst ligdesin.',
    };
  }
  if (points >= 600) {
    return {
      level: 3,
      title: '🥇 Odak Ustası',
      badge: 'Usta',
      color: 'from-purple-600 to-violet-700',
      minPoints: 600,
      nextThreshold: 1400,
      progressPct: Math.min(100, Math.round(((points - 600) / 800) * 100)),
      desc: 'Güçlü bir disiplin! Bir sonraki seviye için odaklanmaya devam et.',
    };
  }
  if (points >= 200) {
    return {
      level: 2,
      title: '🥈 Azimli Kaşif',
      badge: 'Kaşif',
      color: 'from-violet-500 to-purple-600',
      minPoints: 200,
      nextThreshold: 600,
      progressPct: Math.min(100, Math.round(((points - 200) / 400) * 100)),
      desc: 'Çalışma alışkanlığın oturuyor. Odak Ustalığına adım adım!',
    };
  }
  return {
    level: 1,
    title: '🥉 Çırak Öğrenci',
    badge: 'Çırak',
    color: 'from-orange-500 to-amber-500',
    minPoints: 0,
    nextThreshold: 200,
    progressPct: Math.min(100, Math.round((points / 200) * 100)),
    desc: 'Başarı yolculuğunun başındasın. Ders ve kitapla puan biriktir.',
  };
}

// Güvenli Tarih Biçimlendirici (Invalid Date Çökmesini Önler)
const formatSafeDate = (timeStr: any) => {
  if (!timeStr) return 'Bugün';
  try {
    const d = new Date(timeStr);
    if (isNaN(d.getTime())) return 'Bugün';
    return d.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Bugün';
  }
};

export const StudyTimerAndGameBank: React.FC<StudyTimerAndGameBankProps> = ({
  isOpen,
  onClose,
  onEarnStar,
  onBankUpdated,
}) => {
  // State 1: Bank Verisi
  const [bankState, setBankState] = useState<GameBankState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          totalPoints: typeof parsed.totalPoints === 'number' ? parsed.totalPoints : 240,
          totalGameMinutes: typeof parsed.totalGameMinutes === 'number' ? parsed.totalGameMinutes : 60,
          usedGameMinutes: typeof parsed.usedGameMinutes === 'number' ? parsed.usedGameMinutes : 15,
          sessions: Array.isArray(parsed.sessions) ? parsed.sessions : DEFAULT_BANK_STATE.sessions,
        };
      }
    } catch {}
    return DEFAULT_BANK_STATE;
  });

  const [activeTab, setActiveTab] = useState<'calculator' | 'rewards' | 'activities' | 'game_countdown'>('calculator');

  // Manual Activity Log Form state
  const [newActivityType, setNewActivityType] = useState<ActivityType>('reading');
  const [newTitle, setNewTitle] = useState('');
  const [newDurationMin, setNewDurationMin] = useState<number>(20);
  const [newSubject, setNewSubject] = useState('Türkçe');

  // Game countdown timer (when playing)
  const [gameTimerRunning, setGameTimerRunning] = useState(false);
  const [gameTimerSeconds, setGameTimerSeconds] = useState(15 * 60);
  const [rewardFeedback, setRewardFeedback] = useState<string | null>(null);

  // Hook: ESC Tuşuyla Kapatma
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Hook: Her açıldığında localStorage'dan en güncel veriyi çek
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setBankState({
            totalPoints: typeof parsed.totalPoints === 'number' ? parsed.totalPoints : 240,
            totalGameMinutes: typeof parsed.totalGameMinutes === 'number' ? parsed.totalGameMinutes : 60,
            usedGameMinutes: typeof parsed.usedGameMinutes === 'number' ? parsed.usedGameMinutes : 15,
            sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
          });
          if (onBankUpdated) {
            onBankUpdated(Math.max(0, (parsed.totalGameMinutes || 0) - (parsed.usedGameMinutes || 0)));
          }
        }
      } catch {}
    }
  }, [isOpen, onBankUpdated]);

  // Hook: Oyun Geri Sayım Sayacı
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameTimerRunning && gameTimerSeconds > 0) {
      interval = setInterval(() => {
        setGameTimerSeconds((prev) => {
          if (prev <= 1) {
            soundFX.playCelebration();
            setGameTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameTimerRunning, gameTimerSeconds]);

  // Hook: Canlı banka güncellemelerini dinle
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setBankState({
            totalPoints: typeof parsed.totalPoints === 'number' ? parsed.totalPoints : 240,
            totalGameMinutes: typeof parsed.totalGameMinutes === 'number' ? parsed.totalGameMinutes : 60,
            usedGameMinutes: typeof parsed.usedGameMinutes === 'number' ? parsed.usedGameMinutes : 15,
            sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
          });
          if (onBankUpdated) {
            onBankUpdated(Math.max(0, (parsed.totalGameMinutes || 0) - (parsed.usedGameMinutes || 0)));
          }
        }
      } catch {}
    };
    window.addEventListener('odev_dostum_bank_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('odev_dostum_bank_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [onBankUpdated]);

  // Modal kapalıysa render etme
  if (!isOpen) {
    return null;
  }

  const availableGameMinutes = Math.max(0, (bankState.totalGameMinutes || 0) - (bankState.usedGameMinutes || 0));
  const levelInfo = getLevelInfo(bankState.totalPoints);
  const safeSessions = Array.isArray(bankState.sessions) ? bankState.sessions : [];

  // ZORLAYICI DİSİPLİN SİSTEMİ:
  // 1. Oyun Dakikası = 3 Dk Ders = 1 Dk Oyun (3:1 Zorlayıcı Oran)
  // 2. XP'den Oyun Süresine Dönüşüm: Yüksek Emek Kuralı (~50-70 XP = 1 Dk Oyun Süresi)
  // 3. Makul Katkılar: Kitap = +15 XP, Test = +10 XP, Yazılı = +15 XP, Çalışma = +5 XP
  const calculatePoints = (minutes: number, type: ActivityType) => {
    let pts = minutes * 1;
    if (type === 'reading') pts += 15;
    else if (type === 'written_exam') pts += 15;
    else if (type === 'homework') pts += 10;
    else if (type === 'study') pts += 5;
    return pts;
  };

  const handleAddManualActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newDurationMin <= 0) return;

    // Zorlayıcı Oran: 3 Dk Çalışma = 1 Dk Oyun Süresi
    const earnedGameMin = Math.floor(newDurationMin / 3);
    const calculatedPoints = calculatePoints(newDurationMin, newActivityType);

    const newSession: StudySession = {
      id: 'session-' + Date.now(),
      startTime: new Date().toISOString(),
      durationSeconds: newDurationMin * 60,
      activityType: newActivityType,
      title: newTitle.trim(),
      subject: newSubject,
      pointsEarned: calculatedPoints,
      gameMinutesEarned: earnedGameMin,
    };

    const updated: GameBankState = {
      ...bankState,
      totalPoints: bankState.totalPoints + calculatedPoints,
      totalGameMinutes: bankState.totalGameMinutes + earnedGameMin,
      sessions: [newSession, ...safeSessions],
    };

    setBankState(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('odev_dostum_bank_updated'));
    } catch {}

    if (onBankUpdated) {
      onBankUpdated(Math.max(0, updated.totalGameMinutes - updated.usedGameMinutes));
    }

    soundFX.playCelebration();
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 },
    });
    if (onEarnStar) onEarnStar();

    setNewTitle('');
    setActiveTab('activities');
  };

  // Oyun Süresi Kullanma
  const handleStartGameMinutes = (mins: number) => {
    if (availableGameMinutes < mins) return;
    const updated: GameBankState = {
      ...bankState,
      usedGameMinutes: bankState.usedGameMinutes + mins,
    };
    setBankState(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('odev_dostum_bank_updated'));
    } catch {}
    if (onBankUpdated) {
      onBankUpdated(Math.max(0, updated.totalGameMinutes - updated.usedGameMinutes));
    }
    setGameTimerSeconds(mins * 60);
    setGameTimerRunning(true);
    setActiveTab('game_countdown');
    soundFX.playPop();
  };

  // Ödül Sandığı: Puan Takas İşlemleri (Zorlayıcı & Yüksek Emek Değeri)
  const handleExchangePointsForStar = () => {
    const cost = 400;
    if (bankState.totalPoints < cost) {
      setRewardFeedback('Yıldız almak için en az 400 XP puanına ihtiyacın var.');
      setTimeout(() => setRewardFeedback(null), 3000);
      return;
    }

    const updated: GameBankState = {
      ...bankState,
      totalPoints: bankState.totalPoints - cost,
    };
    setBankState(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('odev_dostum_bank_updated'));
    } catch {}

    if (onEarnStar) onEarnStar();
    soundFX.playCelebration();
    confetti({ particleCount: 35, spread: 55 });
    setRewardFeedback('Tebrikler! 400 XP harcayarak +1 Başarı Yıldızı kazandın! ⭐');
    setTimeout(() => setRewardFeedback(null), 3500);
  };

  const handleExchangePointsForGameTime = (mins: number, cost: number) => {
    if (bankState.totalPoints < cost) {
      setRewardFeedback(`Bu ödül için en az ${cost} puana ihtiyacın var.`);
      setTimeout(() => setRewardFeedback(null), 3000);
      return;
    }

    const updated: GameBankState = {
      ...bankState,
      totalPoints: bankState.totalPoints - cost,
      totalGameMinutes: bankState.totalGameMinutes + mins,
    };
    setBankState(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('odev_dostum_bank_updated'));
    } catch {}

    if (onBankUpdated) {
      onBankUpdated(Math.max(0, updated.totalGameMinutes - updated.usedGameMinutes));
    }

    soundFX.playCelebration();
    confetti({ particleCount: 40, spread: 60 });
    setRewardFeedback(`Harika! ${cost} Puan harcayarak +${mins} Dk Joker Oyun Süresi kazandın! 🎮`);
    setTimeout(() => setRewardFeedback(null), 3500);
  };

  // Geçmişi Temizleme
  const handleClearSessions = () => {
    if (!window.confirm('Aktivite geçmişini temizlemek istediğine emin misin?')) return;
    const updated: GameBankState = {
      ...bankState,
      sessions: [],
    };
    setBankState(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('odev_dostum_bank_updated'));
    } catch {}
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundFX.playPop();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-purple-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Lila & Turuncu Harmoni */}
        <div className="px-5 py-3.5 bg-linear-to-r from-purple-700 via-violet-600 to-orange-500 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg shadow-xs shrink-0">
              🎮
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base">
                  Oyun & Puan Kumbarası
                </h3>
                <span className="text-2xs font-extrabold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider text-orange-100">
                  {levelInfo.title}
                </span>
              </div>
              <p className="text-2xs sm:text-xs text-purple-100 font-medium">
                ⚡ 3 Dk Ders = 1 Dk Oyun · Emek İsteyen Zorlu Puan & Oyun Sistemi
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFX.playPop();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-white/20 transition-colors text-white/90 cursor-pointer"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Stats Ribbon */}
        <div className="bg-purple-50/70 border-b border-purple-100 px-4 sm:px-6 py-2.5 grid grid-cols-3 gap-2 text-center">
          <div className="bg-white p-2 rounded-xl border border-purple-200 shadow-2xs">
            <span className="text-2xs text-slate-500 font-bold block">Toplam Puan</span>
            <span className="text-base sm:text-lg font-black text-purple-800 flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              {bankState.totalPoints} <span className="text-2xs font-semibold text-slate-400">XP</span>
            </span>
          </div>

          <div className="bg-white p-2 rounded-xl border border-orange-200 shadow-2xs">
            <span className="text-2xs text-slate-500 font-bold block">Kalan Oyun Hakkı</span>
            <span className="text-base sm:text-lg font-black text-orange-600 flex items-center justify-center gap-1">
              <Gamepad2 className="w-3.5 h-3.5 text-orange-500" />
              {availableGameMinutes} <span className="text-2xs font-semibold text-orange-400">dk</span>
            </span>
          </div>

          <div className="bg-white p-2 rounded-xl border border-purple-200 shadow-2xs">
            <span className="text-2xs text-slate-500 font-bold block">Toplam Kazanılan</span>
            <span className="text-base sm:text-lg font-black text-purple-900 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-purple-600" />
              {bankState.totalGameMinutes} <span className="text-2xs font-semibold text-slate-400">dk</span>
            </span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-purple-100 bg-slate-50/90 px-3 sm:px-6 pt-1.5 gap-1 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => {
              soundFX.playPop();
              setActiveTab('calculator');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer shrink-0 ${
              activeTab === 'calculator'
                ? 'bg-white text-purple-900 border-t border-x border-purple-200 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ➕ Faaliyet Ekle
          </button>

          <button
            onClick={() => {
              soundFX.playPop();
              setActiveTab('rewards');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer shrink-0 ${
              activeTab === 'rewards'
                ? 'bg-white text-orange-700 border-t border-x border-orange-200 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🏆 Seviye & Ödüller
          </button>

          <button
            onClick={() => {
              soundFX.playPop();
              setActiveTab('activities');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer shrink-0 ${
              activeTab === 'activities'
                ? 'bg-white text-purple-900 border-t border-x border-purple-200 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📋 Geçmiş ({safeSessions.length})
          </button>

          <button
            onClick={() => {
              soundFX.playPop();
              setActiveTab('game_countdown');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer shrink-0 ${
              activeTab === 'game_countdown'
                ? 'bg-white text-purple-900 border-t border-x border-purple-200 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🕹️ Oyun Sayacı
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 bg-[#faf8fd]">
          {/* TAB 1: FAALİYET EKLE */}
          {activeTab === 'calculator' && (
            <div className="space-y-3.5">
              {/* Minimal 1-row summary rule */}
              <div className="bg-white px-3.5 py-2.5 rounded-xl border border-purple-200/90 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                <span className="font-extrabold text-purple-900 flex items-center gap-1.5 text-2xs sm:text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  Zorlayıcı Kural: 3 Dk Ders = 1 Dk Oyun (3:1)
                </span>
                <span className="text-2xs text-slate-500 font-semibold">
                  1 Dk Odak = +1 XP · Kitap Okuma = +15 XP · 50+ XP = 1 Dk Joker
                </span>
              </div>

              {/* Add Activity Form */}
              <form onSubmit={handleAddManualActivity} className="bg-white p-4.5 rounded-2xl border border-purple-200/80 space-y-3.5 shadow-2xs">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-orange-500" />
                  Yeni Faaliyet Kaydet
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Faaliyet Türü
                    </label>
                    <select
                      value={newActivityType}
                      onChange={(e) => setNewActivityType(e.target.value as ActivityType)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="reading">📖 Kitap Okuma (+15 XP)</option>
                      <option value="study">🧠 Ders Çalışma / Tekrar (+5 XP)</option>
                      <option value="homework">✍️ Test / Ödev Çözme (+10 XP)</option>
                      <option value="written_exam">📝 Yazılı Sınav Pratiği (+15 XP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      İlgili Ders
                    </label>
                    <select
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="Türkçe">Türkçe</option>
                      <option value="Matematik">Matematik</option>
                      <option value="Fen Bilimleri">Fen Bilimleri</option>
                      <option value="Sosyal Bilgiler">Sosyal Bilgiler / İnkılap</option>
                      <option value="İngilizce">İngilizce</option>
                      <option value="Genel">Genel Kültür / Kitap</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Faaliyet Başlığı
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: 20 Sayfa Roman ya da Denklem Tekrarı"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Süre (Dk)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={360}
                      step={5}
                      value={newDurationMin}
                      onChange={(e) => setNewDurationMin(Math.max(5, parseInt(e.target.value) || 5))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-purple-100">
                  <div className="text-2xs text-slate-600 font-medium">
                    Kazanım:{' '}
                    <span className="font-extrabold text-purple-900">
                      +{calculatePoints(newDurationMin, newActivityType)} XP
                    </span>{' '}
                    ·{' '}
                    <span className="text-orange-600 font-extrabold">
                      +{Math.floor(newDurationMin / 3)} Dk Oyun (3:1)
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Kaydet
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: SEVİYE & ÖDÜLLER */}
          {activeTab === 'rewards' && (
            <div className="space-y-3.5">
              {/* Level Progress Banner */}
              <div className="bg-white p-4 rounded-2xl border border-purple-200/90 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-purple-600 to-orange-500 text-white flex items-center justify-center text-xl shadow-xs">
                      🏆
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {levelInfo.title}
                        </h4>
                        <span className="text-2xs font-black uppercase px-1.5 py-0.2 rounded bg-purple-100 text-purple-900">
                          Seviye {levelInfo.level}
                        </span>
                      </div>
                      <p className="text-2xs text-slate-500 font-medium">
                        {levelInfo.desc}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-purple-900">
                      {bankState.totalPoints} <span className="text-2xs text-slate-500">XP</span>
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-2xs font-bold text-slate-500">
                    <span>Mevcut Seviye</span>
                    <span>Sonraki Eşik: {levelInfo.nextThreshold} XP ({Math.max(0, levelInfo.nextThreshold - bankState.totalPoints)} XP kaldı)</span>
                  </div>
                  <div className="w-full h-2.5 bg-purple-100 rounded-full overflow-hidden border border-purple-200">
                    <div
                      className="h-full bg-linear-to-r from-purple-600 via-violet-500 to-orange-400 transition-all duration-500 rounded-full"
                      style={{ width: `${levelInfo.progressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Feedback Message */}
              {rewardFeedback && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl animate-in fade-in flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{rewardFeedback}</span>
                </div>
              )}

              {/* Reward Shop */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-orange-500" />
                  Puan Takası
                </h4>

                <div className="p-3 bg-purple-50/80 rounded-xl border border-purple-200 text-purple-950 text-2xs font-semibold flex items-center gap-2">
                  <span className="text-base shrink-0">⚡</span>
                  <span><strong>Zorlayıcı Takas Kuralı:</strong> Oyun süresi kazanmak emek ve yüksek odaklanma ister. 50-70 XP harcayarak yalnızca 1 dakika joker oyun süresi açılabilir!</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {/* Ödül 1: 400 XP -> 1 Yıldız */}
                  <div className="p-3.5 rounded-xl bg-white border border-purple-200 shadow-2xs flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl">🌟</span>
                        <span className="text-2xs font-black px-2 py-0.5 rounded bg-purple-100 text-purple-900">
                          400 XP
                        </span>
                      </div>
                      <h5 className="font-extrabold text-xs text-slate-900 mt-1">+1 Başarı Yıldızı</h5>
                      <p className="text-2xs text-slate-500">
                        Profiline parlayan bir başarı yıldızı ekle.
                      </p>
                    </div>

                    <button
                      onClick={handleExchangePointsForStar}
                      disabled={bankState.totalPoints < 400}
                      className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold rounded-lg text-xs transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      Al (400 XP)
                    </button>
                  </div>

                  {/* Ödül 2: 350 XP -> +5 Dk Acil Joker Oyun */}
                  <div className="p-3.5 rounded-xl bg-white border border-amber-200 shadow-2xs flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl">⏱️</span>
                        <span className="text-2xs font-black px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                          350 XP
                        </span>
                      </div>
                      <h5 className="font-extrabold text-xs text-slate-900 mt-1">+5 Dk Acil Joker</h5>
                      <p className="text-2xs text-slate-500">
                        350 XP ile acil 5 dakika oyun hakkı aç.
                      </p>
                    </div>

                    <button
                      onClick={() => handleExchangePointsForGameTime(5, 350)}
                      disabled={bankState.totalPoints < 350}
                      className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold rounded-lg text-xs transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      Al (350 XP)
                    </button>
                  </div>

                  {/* Ödül 3: 600 XP -> +10 Dk Standart Joker */}
                  <div className="p-3.5 rounded-xl bg-white border border-orange-200 shadow-2xs flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl">🎮</span>
                        <span className="text-2xs font-black px-2 py-0.5 rounded bg-orange-100 text-orange-900">
                          600 XP
                        </span>
                      </div>
                      <h5 className="font-extrabold text-xs text-slate-900 mt-1">+10 Dk Standart Joker</h5>
                      <p className="text-2xs text-slate-500">
                        600 XP karşılığında 10 dk oyun süresi.
                      </p>
                    </div>

                    <button
                      onClick={() => handleExchangePointsForGameTime(10, 600)}
                      disabled={bankState.totalPoints < 600}
                      className="w-full py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold rounded-lg text-xs transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      Al (600 XP)
                    </button>
                  </div>

                  {/* Ödül 4: 1100 XP -> +20 Dk Süper Joker */}
                  <div className="p-3.5 rounded-xl bg-white border border-purple-200 shadow-2xs flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl">🚀</span>
                        <span className="text-2xs font-black px-2 py-0.5 rounded bg-purple-100 text-purple-900">
                          1100 XP
                        </span>
                      </div>
                      <h5 className="font-extrabold text-xs text-slate-900 mt-1">+20 Dk Süper Joker</h5>
                      <p className="text-2xs text-slate-500">
                        1100 XP biriktirerek 20 dk ekstra oyun aç.
                      </p>
                    </div>

                    <button
                      onClick={() => handleExchangePointsForGameTime(20, 1100)}
                      disabled={bankState.totalPoints < 1100}
                      className="w-full py-1.5 bg-linear-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 disabled:opacity-40 text-white font-bold rounded-lg text-xs transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      Al (1100 XP)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AKTİVİTE GEÇMİŞİ (Düzenli & Hatasız) */}
          {activeTab === 'activities' && (
            <div className="space-y-3 min-h-[220px]">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  Kayıtlı Faaliyetler ({safeSessions.length})
                </h4>
                {safeSessions.length > 0 && (
                  <button
                    onClick={handleClearSessions}
                    className="text-2xs font-semibold text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    Temizle
                  </button>
                )}
              </div>

              {safeSessions.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs bg-white rounded-2xl border border-purple-100">
                  Henüz kaydedilmiş bir faaliyet bulunmuyor.
                </div>
              ) : (
                <div className="space-y-2">
                  {safeSessions.map((sess, idx) => {
                    const durationMins = Math.max(1, Math.round((sess.durationSeconds || 0) / 60));
                    const points = typeof sess.pointsEarned === 'number' ? sess.pointsEarned : durationMins;
                    const gameMins = typeof sess.gameMinutesEarned === 'number' ? sess.gameMinutesEarned : durationMins;

                    return (
                      <div
                        key={`${sess.id || 'sess'}-${idx}`}
                        className="p-3 bg-white rounded-2xl border border-purple-100 hover:border-purple-300 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 text-2xs">
                            <span className="font-extrabold px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-200">
                              {sess.activityType === 'reading'
                                ? '📖 Kitap'
                                : sess.activityType === 'homework'
                                ? '✍️ Ödev/Test'
                                : sess.activityType === 'written_exam'
                                ? '📝 Yazılı'
                                : '🧠 Ders'}
                            </span>
                            {sess.subject && (
                              <span className="font-semibold text-slate-500">
                                {sess.subject}
                              </span>
                            )}
                            <span className="text-slate-400">
                              {formatSafeDate(sess.startTime)}
                            </span>
                          </div>
                          <h5 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {sess.title || 'Çalışma Oturumu'}
                          </h5>
                          <div className="flex items-center gap-2 text-2xs text-slate-500">
                            <span>{durationMins} dk</span>
                            {sess.correctCount !== undefined && sess.totalQuestions && (
                              <span>· Doğru: {sess.correctCount}/{sess.totalQuestions}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                          <span className="text-2xs sm:text-xs font-black text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                            +{points} XP
                          </span>
                          <span className="text-2xs sm:text-xs font-black text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                            +{gameMins} dk
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: OYUN SAYACI */}
          {activeTab === 'game_countdown' && (
            <div className="space-y-4 text-center max-w-sm mx-auto py-2">
              <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl space-y-3 border border-purple-900/60">
                <div className="flex items-center justify-center gap-1.5 text-orange-400 text-2xs font-extrabold uppercase tracking-widest">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  Oyun Molası Sayacı
                </div>

                <div className="text-4xl sm:text-5xl font-black font-mono tracking-wider text-purple-200">
                  {formatTimer(gameTimerSeconds)}
                </div>

                <div className="flex items-center justify-center gap-2.5 pt-1">
                  <button
                    onClick={() => {
                      soundFX.playPop();
                      setGameTimerRunning(!gameTimerRunning);
                    }}
                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                      gameTimerRunning
                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {gameTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {gameTimerRunning ? 'Duraklat' : 'Başlat'}
                  </button>

                  <button
                    onClick={() => {
                      soundFX.playPop();
                      setGameTimerRunning(false);
                      setGameTimerSeconds(15 * 60);
                    }}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Sıfırla
                  </button>
                </div>
              </div>

              {/* Quick activate buttons */}
              <div className="space-y-2">
                <span className="text-2xs font-bold text-slate-600 block">
                  Süre Kullan (Kalan: {availableGameMinutes} dk):
                </span>
                <div className="flex items-center justify-center gap-1.5">
                  {[10, 15, 20, 30].map((mins) => (
                    <button
                      key={mins}
                      disabled={availableGameMinutes < mins}
                      onClick={() => handleStartGameMinutes(mins)}
                      className="px-3 py-1.5 bg-white hover:bg-orange-50 disabled:opacity-40 text-orange-950 border border-orange-200 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                    >
                      {mins} dk
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
