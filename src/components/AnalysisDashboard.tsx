import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Camera,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  FileText,
  Eye,
  EyeOff,
  Gamepad2,
  Zap,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { HomeworkAnalysisResult } from '../types';
import { QuestionCard } from './QuestionCard';
import { SmartTipCards } from './SmartTipCards';
import { soundFX } from '../utils/soundEffects';
import { teacherVoice } from '../utils/audioPlayer';

interface AnalysisDashboardProps {
  result: HomeworkAnalysisResult;
  history?: HomeworkAnalysisResult[];
  onReset: () => void;
  onEarnStar: () => void;
  onOpenAchievements?: () => void;
  onOpenGameBank?: () => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  result,
  history = [],
  onReset,
  onEarnStar,
  onOpenAchievements,
  onOpenGameBank,
}) => {
  const [filter, setFilter] = useState<'all' | 'mistakes' | 'correct'>('all');
  const [showOriginalImage, setShowOriginalImage] = useState(false);
  const [isPlayingFeedback, setIsPlayingFeedback] = useState(false);

  const safeQuestions = Array.isArray(result.questions) ? result.questions : [];
  const scoreSummary = result.scoreSummary || {
    totalQuestions: safeQuestions.length,
    correctCount: safeQuestions.filter((q) => q.isCorrect).length,
    incorrectCount: safeQuestions.filter((q) => !q.isCorrect).length,
    emptyCount: 0,
    estimatedPercentage:
      safeQuestions.length > 0
        ? Math.round((safeQuestions.filter((q) => q.isCorrect).length / safeQuestions.length) * 100)
        : 0,
  };

  const filteredQuestions = safeQuestions.filter((q) => {
    if (filter === 'mistakes') return !q.isCorrect;
    if (filter === 'correct') return q.isCorrect;
    return true;
  });

  const handleFocusQuestion = (qNum: number) => {
    // If filtered out, reset filter to 'all' or 'mistakes'
    setFilter('all');
    setTimeout(() => {
      const el = document.getElementById(`question-card-${qNum}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-amber-400');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-amber-400');
        }, 2500);
      }
    }, 150);
  };

  const toggleTeacherFeedbackVoice = () => {
    if (isPlayingFeedback) {
      teacherVoice.stop();
      setIsPlayingFeedback(false);
    } else {
      soundFX.playPop();
      teacherVoice.speak(
        result.overallFeedback || 'Ödevini inceledim! Harika çalışmaların var.',
        () => setIsPlayingFeedback(true),
        () => setIsPlayingFeedback(false),
        () => setIsPlayingFeedback(false)
      );
    }
  };

  const percentage = scoreSummary.estimatedPercentage ?? 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Report Card (Karne) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-sm relative overflow-hidden">
        {/* Soft background accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-br from-amber-100/50 to-orange-100/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                {result.subject}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                {result.gradeLevel}
              </span>
              <span className="text-xs text-slate-400 font-medium">{result.date}</span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">
              {result.title}
            </h2>

            {/* Teacher Feedback with voice option */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-white flex items-center justify-center shrink-0 shadow-xs text-xl">
                🦉
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900">
                    Öğretmenin Genel Yorumu:
                  </h4>
                  <button
                    onClick={toggleTeacherFeedbackVoice}
                    className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors"
                  >
                    {isPlayingFeedback ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                        Durdur
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        Seslendir
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-normal">
                  {result.overallFeedback}
                </p>
              </div>
            </div>
          </div>

          {/* Score Badge */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-20 flex items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
                <div className="text-center">
                  <span className="text-2xl font-black leading-none block">%{percentage}</span>
                  <span className="text-2xs uppercase font-bold text-amber-100">Başarı</span>
                </div>
              </div>

              <div className="space-y-1 text-xs sm:text-sm font-semibold">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>{scoreSummary.correctCount} Doğru</span>
                </div>
                <div className="flex items-center gap-2 text-rose-600">
                  <HelpCircle className="w-4 h-4" />
                  <span>{scoreSummary.incorrectCount} Yanlış</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <BookOpen className="w-4 h-4" />
                  <span>Toplam {scoreSummary.totalQuestions} Soru</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              {onOpenAchievements && (
                <button
                  onClick={() => {
                    soundFX.playPop();
                    onOpenAchievements();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>🏆</span>
                  <span>Başarı Rozetlerimi Gör</span>
                </button>
              )}

              <button
                onClick={() => {
                  soundFX.playPop();
                  onReset();
                }}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-amber-500" />
                Yeni Fotoğraf Çek
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Bar & Original Worksheet Toggle */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
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
              Tüm Sorular ({safeQuestions.length})
            </button>
            <button
              onClick={() => {
                soundFX.playPop();
                setFilter('mistakes');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                filter === 'mistakes'
                  ? 'bg-rose-500 text-white shadow-2xs'
                  : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              🚨 Yanlışlar & Dersler ({scoreSummary.incorrectCount})
            </button>
            <button
              onClick={() => {
                soundFX.playPop();
                setFilter('correct');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                filter === 'correct'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              ✅ Doğrular ({scoreSummary.correctCount})
            </button>
          </div>

          {result.imageUrl && (
            <button
              onClick={() => {
                soundFX.playPop();
                setShowOriginalImage(!showOriginalImage);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-600 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 transition-colors"
            >
              {showOriginalImage ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showOriginalImage ? 'Ödev Fotoğrafını Gizle' : 'Orijinal Ödev Fotoğrafını Gör'}
            </button>
          )}
        </div>
      </div>

      {/* Optional Original Image Preview Drawer */}
      {showOriginalImage && result.imageUrl && (
        <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-xs space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              Yüklenen Ödev / Test Kağıdı
            </h4>
            <span className="text-2xs text-slate-400">Görseli büyütmek için üzerine tıklayabilirsin</span>
          </div>
          <div className="max-h-96 overflow-y-auto rounded-2xl bg-amber-50/30 p-2 flex justify-center border border-slate-100">
            <img
              src={result.imageUrl}
              alt="Ödev fotoğrafı"
              className="max-h-90 object-contain rounded-xl shadow-xs"
            />
          </div>
        </div>
      )}

      {/* Homework Submission Evaluation & Game Time Rewards Card */}
      {(() => {
        const evalStudyDurationMin = 20;
        const evalDifficultyBonus = 25;
        const evalTestCompletedBonus = 25;
        const evalCorrectBonus = (scoreSummary.correctCount || 0) * 15;
        const isReading =
          (result.subject || '').toLowerCase().includes('türkçe') ||
          (result.title || '').toLowerCase().includes('okuma') ||
          (result.title || '').toLowerCase().includes('paragraf');
        const evalReadingBonus = isReading ? 50 : 0;
        const evalTotalPoints =
          evalStudyDurationMin * 2 +
          evalDifficultyBonus +
          evalTestCompletedBonus +
          evalCorrectBonus +
          evalReadingBonus;
        // 1 study minute = 1 game minute! (Birebir 1:1 Eşitlik)
        const evalEarnedGameMinutes = evalStudyDurationMin;

        return (
          <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-amber-600 rounded-3xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-black uppercase px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white border border-white/30">
                    Ödev Teslim Değerlendirmesi
                  </span>
                  <span className="text-xs text-emerald-100 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Birebir Oyun Hakkı (1 Dk Ders = 1 Dk Oyun)
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
                  <span>🎮 +{evalEarnedGameMinutes} Dakika Oyun Oynama Hakkı Kazandın!</span>
                </h3>
                <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed max-w-2xl font-medium">
                  Değerlendirme formülü: <strong>1 Dk Çalışma = 1 Dk Oyun</strong> ({evalEarnedGameMinutes} dk çalışma = {evalEarnedGameMinutes} dk oyun) | <strong>Puan</strong>: Süre (+{evalStudyDurationMin * 2}p) + Zorluk (+{evalDifficultyBonus}p) + Teslim (+{evalTestCompletedBonus}p) + {scoreSummary.correctCount} Doğru (+{evalCorrectBonus}p) {isReading ? '+ 📖 Kitap Kurdu Bonusu (+50p)' : ''} = <strong>Toplam {evalTotalPoints} Puan</strong>!
                </p>
              </div>

              {onOpenGameBank && (
                <button
                  onClick={() => {
                    soundFX.playCelebration();
                    onOpenGameBank();
                  }}
                  className="px-5 py-3 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-xs sm:text-sm shadow-md transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
                >
                  <Gamepad2 className="w-4 h-4 text-emerald-600" />
                  <span>Kumbarayı Aç & Süreyi Kullan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* Smart Tip Cards Component (Hata Analizi & Bir Sonraki Benzer Soruda Strateji) */}
      <SmartTipCards
        currentResult={result}
        allHistory={history}
        onFocusQuestion={handleFocusQuestion}
      />

      {/* Question Cards List */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center text-slate-500 border border-slate-200">
            <Sparkles className="w-8 h-8 mx-auto text-amber-400 mb-2" />
            <p className="font-bold">Bu filtreye uygun soru bulunamadı.</p>
            <p className="text-xs text-slate-400 mt-1">
              {filter === 'mistakes' ? 'Harika haber! Bu ödevde hiç yanlış soru yok 🎉' : ''}
            </p>
          </div>
        ) : (
          filteredQuestions.map((q, qIdx) => (
            <QuestionCard
              key={q.questionNumber || qIdx}
              question={q}
              index={qIdx}
              onEarnStar={onEarnStar}
            />
          ))
        )}
      </div>
    </div>
  );
};
