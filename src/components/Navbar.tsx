import React, { useState, useEffect } from 'react';
import {
  Star,
  Clock,
  Gamepad2,
  AlertTriangle,
  CalendarDays,
  Target,
  FileCheck,
  X,
} from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export type MainAppTab = 'study_area' | 'weekly_advisor' | 'test_results';

interface NavbarProps {
  activeTab: MainAppTab;
  onSelectTab: (tab: MainAppTab) => void;
  stars: number;
  availableGameMinutes: number;
  studyTimerSeconds?: number;
  isStudyTimerRunning?: boolean;
  onOpenGameBank?: () => void;
  // Optional legacy fallbacks
  historyCount?: number;
  unlockedBadgeCount?: number;
  onOpenHistory?: () => void;
  onOpenAchievements?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  stars,
  availableGameMinutes = 30,
  studyTimerSeconds = 0,
  isStudyTimerRunning = false,
  onOpenGameBank,
  historyCount = 0,
  unlockedBadgeCount = 0,
  onOpenHistory,
  onOpenAchievements,
}) => {
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);

  // Re-enable notification if game minutes increase or change
  useEffect(() => {
    if (availableGameMinutes >= 10) {
      setIsAlertDismissed(false);
    }
  }, [availableGameMinutes]);

  const isLowGameTime = availableGameMinutes < 10;
  const gameTimePercent = Math.min(100, Math.max(0, Math.round((availableGameMinutes / 60) * 100)));

  const formatTimerMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-200/70 shadow-2xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Top Brand & Status Tier */}
        <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Brand Left */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => {
                soundFX.playPop();
                onSelectTab('study_area');
              }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-tr from-purple-600 via-violet-500 to-orange-400 flex items-center justify-center text-white shadow-md shadow-purple-500/20 text-2xl sm:text-3xl select-none shrink-0 hover:scale-105 transition-transform cursor-pointer"
            >
              🦉
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1
                  onClick={() => {
                    soundFX.playPop();
                    onSelectTab('study_area');
                  }}
                  className="font-black text-xl sm:text-2xl tracking-tight text-slate-900 font-['Fredoka'] cursor-pointer hover:text-purple-700 transition-colors"
                >
                  Ödev Dostum
                </h1>
                <span className="text-2xs font-bold px-2 py-0.5 rounded-lg bg-purple-100 text-purple-900 border border-purple-200 uppercase tracking-wider">
                  MEB 5. Sınıf
                </span>
              </div>
              <p className="text-2xs sm:text-xs text-slate-500 font-semibold leading-snug">
                5. Sınıf Öğrencileri İçin Akıllı Başarı ve Çalışma Rehberi
              </p>
            </div>
          </div>

          {/* Quick Rewards & Stopwatch Right */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            {/* Live Study Stopwatch Badge (if running) */}
            {isStudyTimerRunning && (
              <button
                onClick={() => {
                  soundFX.playPop();
                  onSelectTab('study_area');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white border border-purple-800 text-xs font-black shadow-xs transition-all cursor-pointer animate-pulse"
                title="Aktif çalışma seansına git"
              >
                <Clock className="w-3.5 h-3.5 text-orange-300" />
                <span className="font-mono">{formatTimerMinSec(studyTimerSeconds)}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </button>
            )}

            {/* Stars */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 shadow-2xs select-none"
              title="Pekiştirme ve soru çözümleriyle kazandığın yıldızlar"
            >
              <Star className="w-4 h-4 fill-orange-400 text-orange-500" />
              <span className="font-black text-sm">{stars}</span>
              <span className="text-3xs text-orange-800 font-bold hidden sm:inline">Yıldız</span>
            </div>

            {/* Kumbaram Badge with Mini-Meter */}
            <button
              onClick={() => {
                soundFX.playPop();
                if (onOpenGameBank) {
                  onOpenGameBank();
                } else {
                  onSelectTab('test_results');
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all shadow-2xs cursor-pointer ${
                isLowGameTime
                  ? 'border-orange-400 bg-orange-100/90 text-orange-950 ring-2 ring-orange-300/60'
                  : 'border-orange-200 hover:border-orange-300 bg-orange-50/80 hover:bg-orange-100 text-orange-950'
              }`}
              title="Kalan oyun süren (1 dk ders = 1 dk oyun)"
            >
              <div className="relative">
                <Gamepad2 className={`w-4 h-4 ${isLowGameTime ? 'text-orange-600 animate-bounce' : 'text-orange-600'}`} />
                {isLowGameTime && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </div>

              <span className="text-xs font-bold hidden sm:inline">Kumbaram</span>

              <span
                className={`text-2xs font-extrabold px-1.5 py-0.5 rounded-md border ${
                  isLowGameTime
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                    : 'text-orange-900 bg-white border-orange-200'
                }`}
              >
                {isLowGameTime && '⚠️ '}
                {availableGameMinutes} dk
              </span>

              {/* Inline visual mini-meter */}
              <div
                className="w-10 sm:w-12 h-1.5 bg-orange-200 rounded-full overflow-hidden shrink-0 hidden sm:block"
                title={`Kalan oyun hakkı oranı: %${gameTimePercent}`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isLowGameTime
                      ? 'bg-rose-500'
                      : gameTimePercent < 35
                      ? 'bg-orange-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${gameTimePercent}%` }}
                />
              </div>
            </button>
          </div>
        </div>

        {/* 3 PRIMARY MAIN CORE TABS */}
        <div className="border-t border-purple-100 py-2.5 flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2.5 text-xs font-extrabold">
          {/* TAB 1: ÇALIŞMA ALANIM */}
          <button
            onClick={() => {
              soundFX.playPop();
              onSelectTab('study_area');
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'study_area'
                ? 'bg-purple-600 text-white border-purple-700 shadow-xs scale-[1.02]'
                : 'bg-purple-50/70 hover:bg-purple-100/80 text-purple-900 border-purple-200/80'
            }`}
          >
            <Target className="w-4 h-4 shrink-0" />
            <span className="truncate">Çalışma Alanım</span>
          </button>

          {/* TAB 2: HAFTALIK DANIŞMAN */}
          <button
            onClick={() => {
              soundFX.playPop();
              onSelectTab('weekly_advisor');
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'weekly_advisor'
                ? 'bg-purple-600 text-white border-purple-700 shadow-xs scale-[1.02]'
                : 'bg-purple-50/70 hover:bg-purple-100/80 text-purple-900 border-purple-200/80'
            }`}
          >
            <CalendarDays className="w-4 h-4 shrink-0" />
            <span className="truncate">Haftalık Danışmanım</span>
          </button>

          {/* TAB 3: TEST UZMANI */}
          <button
            onClick={() => {
              soundFX.playPop();
              onSelectTab('test_results');
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'test_results'
                ? 'bg-purple-600 text-white border-purple-700 shadow-xs scale-[1.02]'
                : 'bg-purple-50/70 hover:bg-purple-100/80 text-purple-900 border-purple-200/80'
            }`}
          >
            <FileCheck className="w-4 h-4 shrink-0" />
            <span className="truncate">Test Uzmanı</span>
          </button>
        </div>

        {/* Low Game Time Notification Banner with Visual Progress Bar (< 10 minutes) */}
        {isLowGameTime && !isAlertDismissed && (
          <div className="border-t border-orange-200/90 bg-linear-to-r from-orange-500/15 via-amber-500/10 to-purple-500/10 px-3.5 sm:px-4 py-2.5 rounded-2xl mb-2.5 animate-in slide-in-from-top-2 duration-300 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <AlertTriangle className="w-4 h-4 animate-bounce" />
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-xs text-orange-950 flex items-center gap-1">
                      <span>Oyun Süren Azalıyor:</span>
                      <span className="text-rose-600 font-black">
                        {availableGameMinutes === 0
                          ? 'Kumbaran Boşaldı (0 dk)!'
                          : `Sadece ${availableGameMinutes} Dk Kaldı!`}
                      </span>
                    </span>

                    <span className="text-3xs font-extrabold px-1.5 py-0.2 rounded bg-orange-200/80 text-orange-900">
                      3 Dk Ders = 1 Dk Oyun (3:1 Zorlayıcı Oran)
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="flex items-center gap-2 max-w-md">
                    <div className="flex-1 h-2 bg-orange-200/80 rounded-full overflow-hidden border border-orange-300/60 shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          availableGameMinutes <= 3
                            ? 'bg-rose-500 animate-pulse'
                            : 'bg-linear-to-r from-rose-500 to-orange-500'
                        }`}
                        style={{ width: `${Math.max(4, gameTimePercent)}%` }}
                      />
                    </div>
                    <span className="text-3xs font-mono font-bold text-orange-900 shrink-0">
                      {availableGameMinutes}/60 dk
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => {
                    soundFX.playCelebration();
                    onSelectTab('study_area');
                  }}
                  className="px-3 py-1.5 bg-linear-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-extrabold rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Ders Çalış (+Oyun Kazan)</span>
                </button>

                <button
                  onClick={() => setIsAlertDismissed(true)}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-lg cursor-pointer"
                  title="Bildirimi Kapat"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
