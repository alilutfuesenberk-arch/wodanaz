import React, { useState } from 'react';
import { Award, Star, Lock, CheckCircle2, Sparkles, X, Filter } from 'lucide-react';
import { Achievement, HomeworkAnalysisResult } from '../types';
import { calculateAchievements } from '../utils/achievementUtils';
import { soundFX } from '../utils/soundEffects';

interface AchievementsProps {
  history: HomeworkAnalysisResult[];
  stars: number;
  onClose?: () => void;
  isModal?: boolean;
}

export const Achievements: React.FC<AchievementsProps> = ({
  history,
  stars,
  onClose,
  isModal = false,
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const achievements = calculateAchievements(history, stars);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = achievements.filter((a) => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  const getRarityBadge = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'diamond':
        return {
          label: 'Elmas Rozet',
          border: 'border-cyan-400 bg-cyan-50/70 text-cyan-800',
          ring: 'ring-cyan-300',
          glow: 'from-cyan-400 to-blue-500',
        };
      case 'gold':
        return {
          label: 'Altın Rozet',
          border: 'border-amber-400 bg-amber-50/80 text-amber-900',
          ring: 'ring-amber-300',
          glow: 'from-amber-400 to-yellow-500',
        };
      case 'silver':
        return {
          label: 'Gümüş Rozet',
          border: 'border-slate-300 bg-slate-50 text-slate-800',
          ring: 'ring-slate-300',
          glow: 'from-slate-300 to-slate-400',
        };
      case 'bronze':
      default:
        return {
          label: 'Bronz Rozet',
          border: 'border-orange-300 bg-orange-50/70 text-orange-900',
          ring: 'ring-orange-300',
          glow: 'from-orange-400 to-amber-600',
        };
    }
  };

  const content = (
    <div className="space-y-6">
      {/* Overview Stat Box */}
      <div className="bg-linear-to-r from-amber-500 via-amber-400 to-yellow-400 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-2 max-w-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-white">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Başarı Karnesi & Rozetlerim</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight">
              {unlockedCount === totalCount
                ? 'Muhteşem! Tüm Rozetleri Kazandın! 👑'
                : unlockedCount >= 4
                ? 'Harikasın! Adım Adım Zirveye! 🚀'
                : 'Ödevleri Çözdükçe Rozetlerin Kilidi Açılır! 🌟'}
            </h3>
            <p className="text-xs sm:text-sm text-amber-50 font-medium">
              Ödev fotoğrafları inceletip pekiştirme sorularını çözerek yeni unvanlar ve yıldızlar topla.
            </p>
          </div>

          {/* Progress circle / stat */}
          <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 shrink-0">
            <div className="text-center">
              <span className="text-2xl font-black block leading-none">🏆</span>
              <span className="text-2xs uppercase font-bold text-amber-100 mt-1 block">Başarı Rozetleri</span>
            </div>
            <div className="h-10 w-px bg-white/30"></div>
            <div className="text-center">
              <span className="text-3xl font-black block leading-none flex items-center gap-1">
                <Star className="w-6 h-6 fill-yellow-200 text-yellow-300" />
                {stars}
              </span>
              <span className="text-2xs uppercase font-bold text-amber-100">Yıldızım</span>
            </div>
          </div>
        </div>

        {/* Global Progress bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-2xs font-bold text-amber-100">
            <span>Rozet İlerlemesi</span>
            <span>%{completionPercent}</span>
          </div>
          <div className="w-full bg-black/15 h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-white rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${completionPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              soundFX.playPop();
              setFilter('all');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tüm Rozetler
          </button>
          <button
            onClick={() => {
              soundFX.playPop();
              setFilter('unlocked');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              filter === 'unlocked'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-emerald-700 hover:text-emerald-900'
            }`}
          >
            Kazanılanlar
          </button>
          <button
            onClick={() => {
              soundFX.playPop();
              setFilter('locked');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              filter === 'locked'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'text-amber-800 hover:text-amber-900'
            }`}
          >
            Sıradaki Hedefler
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((item) => {
          const rarityConfig = getRarityBadge(item.rarity);
          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-hidden ${
                item.unlocked
                  ? `bg-white ${rarityConfig.border} shadow-sm hover:shadow-md ring-1 ${rarityConfig.ring}`
                  : 'bg-slate-50/70 border-slate-200 opacity-75 grayscale-20'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  {/* Badge Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-transform ${
                      item.unlocked
                        ? 'bg-linear-to-tr ' + rarityConfig.glow + ' text-white scale-105'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {item.icon}
                  </div>

                  {/* Status Indicator */}
                  <div>
                    {item.unlocked ? (
                      <span className="inline-flex items-center gap-1 text-2xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Kazanıldı!
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-2xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                        <Lock className="w-3 h-3 text-slate-500" />
                        Kilitli
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 tracking-tight flex items-center gap-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar & Target */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-2xs font-bold text-slate-600">
                  <span className="text-slate-400">{rarityConfig.label}</span>
                  <span>
                    {item.progress} / {item.maxProgress}
                  </span>
                </div>
                <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      item.unlocked ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.round((item.progress / item.maxProgress) * 100))}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-amber-200">
          {/* Header */}
          <div className="px-6 py-4 bg-amber-500 text-white flex items-center justify-between border-b border-amber-600/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-xl">
                🏆
              </div>
              <div>
                <h3 className="font-black text-lg leading-tight">Başarı Rozetlerim & Ünvanlarım</h3>
                <p className="text-xs text-amber-100">Ödev çözdükçe açılan gurur madalyaların</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-amber-600 text-white transition-colors"
                title="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">{content}</div>

          {/* Footer */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Her yeni ödev ve pekiştirme sorusu seni yeni bir rozete yaklaştırır! 🎯
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Harika!
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return content;
};
