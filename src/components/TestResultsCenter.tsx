import React, { useState } from 'react';
import {
  Camera,
  Upload,
  BookOpen,
  Award,
  Gamepad2,
  Calendar,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Star,
  RotateCcw,
  Clock,
  Trash2,
  BarChart2,
} from 'lucide-react';
import { HomeworkAnalysisResult } from '../types';
import { UploadHero } from './UploadHero';
import { AnalysisDashboard } from './AnalysisDashboard';
import { calculateAchievements } from '../utils/achievementUtils';
import { soundFX } from '../utils/soundEffects';

interface TestResultsCenterProps {
  activeHomework: HomeworkAnalysisResult | null;
  setActiveHomework: (hw: HomeworkAnalysisResult | null) => void;
  history: HomeworkAnalysisResult[];
  stars: number;
  availableGameMinutes: number;
  onStartCamera: () => void;
  onFileSelect: (base64Image: string) => void;
  onSelectSample: (sample: HomeworkAnalysisResult) => void;
  onClearHistory: () => void;
  onEarnStar: () => void;
  onOpenGameBank: () => void;
  onOpenStudyRoom?: () => void;
  selectedGrade: string;
  setSelectedGrade: (grade: string) => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  onBackToMain?: () => void;
}

export const TestResultsCenter: React.FC<TestResultsCenterProps> = ({
  activeHomework,
  setActiveHomework,
  history,
  stars,
  availableGameMinutes,
  onStartCamera,
  onFileSelect,
  onSelectSample,
  onClearHistory,
  onEarnStar,
  onOpenGameBank,
  onOpenStudyRoom,
  selectedGrade,
  setSelectedGrade,
  selectedSubject,
  setSelectedSubject,
  onBackToMain,
}) => {
  // Sub-tabs inside Test Results: 'upload' | 'history_and_badges' | 'game_bank'
  const [subTab, setSubTab] = useState<'upload' | 'history_and_badges' | 'game_bank'>('upload');
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const achievements = calculateAchievements(history, stars);
  const unlockedBadges = achievements.filter((a) => a.unlocked);

  const filteredBadges = achievements.filter((a) => {
    if (badgeFilter === 'unlocked') return a.unlocked;
    if (badgeFilter === 'locked') return !a.unlocked;
    return true;
  });

  // If an active homework is selected, display its detailed analysis with a clear Back button
  if (activeHomework) {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        {/* Top Back Navigation Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-purple-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              soundFX.playPop();
              setActiveHomework(null);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:scale-101"
          >
            <ArrowLeft className="w-4 h-4 text-purple-700" />
            <span>← Test Sonuçları Listesine / Yeni Test Yüklemeye Dön</span>
          </button>

          <div className="flex items-center gap-2">
            {onOpenStudyRoom && (
              <button
                onClick={() => {
                  soundFX.playPop();
                  onOpenStudyRoom();
                }}
                className="px-3 py-1.5 rounded-xl bg-linear-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>🎯 Bu Konuyu Çalışma Alanında Çalış</span>
              </button>
            )}
          </div>
        </div>

        {/* Detailed Analysis Dashboard */}
        <AnalysisDashboard
          result={activeHomework}
          history={history}
          onReset={() => setActiveHomework(null)}
          onEarnStar={onEarnStar}
          onOpenAchievements={() => setSubTab('history_and_badges')}
          onOpenGameBank={onOpenGameBank}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Section Header & Sub-Tab Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-purple-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onBackToMain && (
              <button
                onClick={() => {
                  soundFX.playPop();
                  onBackToMain();
                }}
                className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 transition-colors cursor-pointer"
                title="Ana Sayfaya Dön"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-purple-600 to-orange-400 flex items-center justify-center text-white text-xl shadow-xs">
              📝
            </div>
            <div>
              <h2 className="font-black text-lg sm:text-xl text-slate-900 leading-tight">
                Test Sonuçları Kontrolü
              </h2>
              <p className="text-2xs sm:text-xs text-slate-500 font-semibold">
                MEB Deneme & Ödev İnceleme, Soru Analizi ve Başarı Karnesi
              </p>
            </div>
          </div>

          {/* Quick status summary badge */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 text-xs font-extrabold flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-500" />
              <span>{stars} Yıldız</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-extrabold flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-purple-600" />
              <span>{availableGameMinutes} dk Oyun Hakkı</span>
            </div>
          </div>
        </div>

        {/* 3 Unified Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-purple-100">
          <button
            onClick={() => {
              soundFX.playPop();
              setSubTab('upload');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'upload'
                ? 'bg-purple-600 text-white shadow-xs scale-102'
                : 'bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Test / Ödev Yükle</span>
          </button>

          <button
            onClick={() => {
              soundFX.playPop();
              setSubTab('history_and_badges');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'history_and_badges'
                ? 'bg-purple-600 text-white shadow-xs scale-102'
                : 'bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Geçmiş Testlerim & Karnelerim & Rozetler</span>
          </button>

          <button
            onClick={() => {
              soundFX.playPop();
              setSubTab('game_bank');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'game_bank'
                ? 'bg-orange-500 text-white shadow-xs scale-102'
                : 'bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-950'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Kumbara & Puan Durumu</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: TEST & ÖDEV YÜKLE */}
      {subTab === 'upload' && (
        <div className="space-y-4">
          <UploadHero
            onStartCamera={onStartCamera}
            onFileSelect={onFileSelect}
            onSelectSample={onSelectSample}
            onOpenAchievements={() => setSubTab('history_and_badges')}
            onOpenGameBank={onOpenGameBank}
            onOpenStudyRoom={onOpenStudyRoom}
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
          />
        </div>
      )}

      {/* SUB-TAB 2: GEÇMİŞ TESTLERİM, KARNELERİM & ROZETLER (BİRLEŞİK SADE ALAN) */}
      {subTab === 'history_and_badges' && (
        <div className="space-y-6">
          {/* Back button to Upload view */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                soundFX.playPop();
                setSubTab('upload');
              }}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Yeni Test Yüklemeye Dön</span>
            </button>

            {history.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Tüm geçmiş test sonuçlarını silmek istediğine emin misin?')) {
                    onClearHistory();
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Geçmişi Temizle</span>
              </button>
            )}
          </div>

          {/* Test Karneleri Listesi */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Ödev ve Deneme Karnelerim
                </h3>
              </div>
              <span className="text-2xs font-semibold text-slate-500">
                Tıkla ve ayrıntılı analizi incele
              </span>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-10 text-slate-400 space-y-2">
                <BookOpen className="w-10 h-10 mx-auto text-purple-300" />
                <p className="font-bold text-slate-700 text-sm">
                  Henüz kayıtlı bir test karnesi yok.
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Fotoğraf çekip veya örnek test seçip kontrol ettirdiğinde karnen burada saklanır.
                </p>
                <button
                  onClick={() => {
                    soundFX.playPop();
                    setSubTab('upload');
                  }}
                  className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  İlk Testini Yükle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      soundFX.playPop();
                      setActiveHomework(item);
                    }}
                    className="p-4 rounded-2xl border border-purple-100 hover:border-purple-300 bg-white hover:bg-purple-50/60 transition-all cursor-pointer shadow-2xs group flex items-center justify-between gap-3 hover:scale-[1.01]"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-2xs font-extrabold px-2 py-0.5 rounded-md bg-purple-100 text-purple-900">
                          {item.subject}
                        </span>
                        <span className="text-3xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                        {item.title}
                      </h4>

                      <div className="flex items-center gap-2 text-2xs">
                        <span className="text-emerald-700 font-extrabold">
                          {item.scoreSummary?.correctCount || 0} Doğru
                        </span>
                        <span className="text-rose-700 font-extrabold">
                          {item.scoreSummary?.incorrectCount || 0} Yanlış
                        </span>
                        <span className="text-purple-700 font-bold ml-auto bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          %{item.scoreSummary?.estimatedPercentage || 0} Başarı
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-purple-400 group-hover:text-purple-700 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Başarı Rozetleri (Rozetlerin yanında ASLA sayı yazmıyor) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Başarı Rozetlerim
                </h3>
              </div>

              {/* Rozet Filtreleri (Sayı yazmıyor) */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setBadgeFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    badgeFilter === 'all'
                      ? 'bg-white text-purple-900 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tüm Rozetler
                </button>
                <button
                  onClick={() => setBadgeFilter('unlocked')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    badgeFilter === 'unlocked'
                      ? 'bg-white text-purple-900 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Kazanılanlar
                </button>
                <button
                  onClick={() => setBadgeFilter('locked')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    badgeFilter === 'locked'
                      ? 'bg-white text-purple-900 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Hedeftekiler
                </button>
              </div>
            </div>

            {/* Rozet Kartları Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border transition-all text-center space-y-2 flex flex-col justify-between ${
                    badge.unlocked
                      ? 'bg-orange-50/70 border-orange-200 text-slate-900 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-70'
                  }`}
                >
                  <div className="text-3xl select-none">
                    {badge.unlocked ? badge.icon : '🔒'}
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-extrabold text-xs text-slate-900 leading-snug">
                      {badge.title}
                    </h5>
                    <p className="text-3xs text-slate-500 leading-tight">
                      {badge.description}
                    </p>
                  </div>
                  <div className="pt-1.5 border-t border-purple-100/60">
                    <span
                      className={`text-3xs font-black uppercase px-2 py-0.5 rounded-full ${
                        badge.unlocked
                          ? 'bg-orange-200 text-orange-950'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {badge.unlocked ? 'Kazanıldı ⭐' : 'Kilitli'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: OYUN KUMBARASI & PUAN DURUMU */}
      {subTab === 'game_bank' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
            <button
              onClick={() => {
                soundFX.playPop();
                setSubTab('upload');
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Test Sonuçlarına Dön</span>
            </button>

            <button
              onClick={() => {
                soundFX.playPop();
                onOpenGameBank();
              }}
              className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold transition-colors cursor-pointer shadow-xs"
            >
              🎮 Kumbarayı Tam Aç
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-orange-950 space-y-1">
              <span className="text-3xs font-extrabold uppercase text-orange-700">Kalan Oyun Süren</span>
              <div className="text-2xl font-black">{availableGameMinutes} Dakika</div>
              <p className="text-3xs text-orange-800">1 dakika ders çalışma = 1 dakika oyun hakkı</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 space-y-1">
              <span className="text-3xs font-extrabold uppercase text-purple-700">Başarı Yıldızların</span>
              <div className="text-2xl font-black">{stars} Yıldız</div>
              <p className="text-3xs text-purple-800">Doğru çözülen sorular ve çalışmalarla kazanıldı</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
              <span className="text-3xs font-extrabold uppercase text-emerald-700">Kural Eşitliği</span>
              <div className="text-2xl font-black">1 : 1 Oran</div>
              <p className="text-3xs text-emerald-800">2 saat ders çalış = 120 dakika oyun hakkı kazan!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
