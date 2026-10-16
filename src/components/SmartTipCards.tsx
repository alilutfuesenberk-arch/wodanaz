import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  AlertTriangle,
  Compass,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Brain,
  Zap,
  Target,
  Flame,
  Volume2,
  BookOpen
} from 'lucide-react';
import { HomeworkAnalysisResult, QuestionData } from '../types';
import { soundFX } from '../utils/soundEffects';
import { teacherVoice } from '../utils/audioPlayer';

export interface SmartTipItem {
  id: string;
  topic: string;
  mistakePattern: string;
  smartAdvice: string;
  goldenRule: string;
  actionableStep: string;
  difficultyOrSeverity: 'critical' | 'moderate' | 'reminder';
  exampleSnippet?: string;
  questionNumber: number;
}

interface SmartTipCardsProps {
  currentResult: HomeworkAnalysisResult;
  allHistory?: HomeworkAnalysisResult[];
  onFocusQuestion?: (questionNumber: number) => void;
}

export const SmartTipCards: React.FC<SmartTipCardsProps> = ({
  currentResult,
  allHistory = [],
  onFocusQuestion,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'cumulative'>('current');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [masteredTips, setMasteredTips] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('odev_dostum_mastered_tips');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleMastered = (tipId: string) => {
    soundFX.playPop();
    setMasteredTips((prev) => {
      const updated = { ...prev, [tipId]: !prev[tipId] };
      try {
        localStorage.setItem('odev_dostum_mastered_tips', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // 1. Current homework mistakes analysis
  const currentMistakes = (Array.isArray(currentResult.questions) ? currentResult.questions : []).filter(
    (q) => !q.isCorrect
  );

  // Helper to extract tips from question mistakes
  const buildTipsFromQuestions = (questions: QuestionData[], prefix: string): SmartTipItem[] => {
    return questions.map((q, idx) => {
      // Reason or fallback
      let pattern = q.mistakeReason || 'Soru kökündeki temel kural veya işlem basamağı gözden kaçırılmış olabilir.';
      let advice = `Bir sonraki benzer soruda: Önce sorunun senden ne istediğini altını çizerek belirle, ardından '${q.goldenRule || q.topic}' kuralını uygula.`;
      let actionable = `Şunları hatırla: ${q.goldenRule || 'Aşama aşama kontrol et.'}`;

      // Intelligent heuristics based on topic or text
      const topicLower = (q.topic || '').toLowerCase();
      const mistakeLower = (q.mistakeReason || '').toLowerCase();

      let severity: 'critical' | 'moderate' | 'reminder' = 'moderate';
      if (mistakeLower.includes('dikkat') || mistakeLower.includes('acele') || mistakeLower.includes('okuma')) {
        severity = 'reminder';
        advice = 'Soruyu sonuna kadar oku; "değildir / olamaz / en çok" gibi olumsuz ya da sınırlayıcı ifadelere fosforlu kalemle dikkat et!';
        actionable = 'Cevabı işaretlemeden önce soru kökünü bir kez daha fısıltıyla tekrar et.';
      } else if (
        topicLower.includes('bölme') ||
        topicLower.includes('kesir') ||
        topicLower.includes('çarpma') ||
        topicLower.includes('denklem') ||
        topicLower.includes('reaksiyon')
      ) {
        severity = 'critical';
        advice = `İşlem basamaklarını atlamadan karalama alanına yaz. '${q.goldenRule}' ilkesini ezber yerine mantığıyla kur.`;
        actionable = 'Ters işlem veya sağlamasını yaparak bulduğun sonucun şıklardaki mantığını doğrula.';
      } else if (topicLower.includes('dil') || topicLower.includes('türkçe') || topicLower.includes('kelime')) {
        severity = 'reminder';
        advice = 'Cümledeki bağlamı ve anlam bütünlüğünü incele; ilk aklına gelen şıkkı işaretlemeden diğer şıkları da eleyerek ilerle.';
        actionable = 'Şıkların neden yanlış olduğunu kendine kısaca fısılda.';
      }

      return {
        id: `${prefix}-${q.questionNumber || idx}`,
        topic: q.topic || currentResult.subject || 'Genel Konu',
        mistakePattern: pattern,
        smartAdvice: advice,
        goldenRule: q.goldenRule || 'Kuralı hatırla ve dikkatle uygula.',
        actionableStep: actionable,
        difficultyOrSeverity: severity,
        exampleSnippet: q.questionText?.slice(0, 85) + (q.questionText?.length > 85 ? '...' : ''),
        questionNumber: q.questionNumber || idx + 1,
      };
    });
  };

  const currentTips = buildTipsFromQuestions(currentMistakes, 'curr');

  // 2. Cumulative mistakes across all history
  const cumulativeQuestions: QuestionData[] = [];
  allHistory.forEach((hw) => {
    if (Array.isArray(hw.questions)) {
      hw.questions.forEach((q) => {
        if (!q.isCorrect) {
          cumulativeQuestions.push(q);
        }
      });
    }
  });

  // Group by topic to find recurring problem areas
  const topicFrequency: Record<string, QuestionData[]> = {};
  cumulativeQuestions.forEach((q) => {
    const key = q.topic || 'Genel';
    if (!topicFrequency[key]) topicFrequency[key] = [];
    topicFrequency[key].push(q);
  });

  const cumulativeTips: SmartTipItem[] = Object.entries(topicFrequency).map(([topicName, qList], idx) => {
    const repCount = qList.length;
    const latestQ = qList[0];
    const isHighFreq = repCount >= 2;

    return {
      id: `cumul-${idx}`,
      topic: `${topicName} (${repCount} Kez Hata Yapıldı)`,
      mistakePattern: isHighFreq
        ? `Bu konuda toplamda ${repCount} defa benzer takılma yaşandı. En son: "${latestQ.mistakeReason || 'Kavram yanılgısı'}"`
        : latestQ.mistakeReason || 'Bu konuda dikkat eksikliği görüldü.',
      smartAdvice: isHighFreq
        ? `🔥 Süper Strateji: Benzer bir ${topicName} sorusu gördüğünde acele etme! Soruyu parçala ve önce '${latestQ.goldenRule}' prensibini karalama alanına yaz.`
        : `Bir sonraki ${topicName} sorusunda: '${latestQ.goldenRule}' kuralını uygula ve işlem basamaklarını kontrol et.`,
      goldenRule: latestQ.goldenRule || 'Temel kuralı hatırla.',
      actionableStep: isHighFreq
        ? '💡 Bu konudan 2 adet pekiştirme sorusu çözerek beynindeki nöronları güçlendir.'
        : 'Cevabı işaretlemeden önce sağlamasını yap.',
      difficultyOrSeverity: isHighFreq ? 'critical' : 'moderate',
      exampleSnippet: latestQ.questionText?.slice(0, 80) + '...',
      questionNumber: latestQ.questionNumber || 1,
    };
  });

  const displayedTips = activeTab === 'current' ? currentTips : cumulativeTips;

  const handleSpeak = (tip: SmartTipItem) => {
    if (speakingId === tip.id) {
      teacherVoice.stop();
      setSpeakingId(null);
    } else {
      soundFX.playPop();
      const textToSpeak = `Akıllı İpucu! Konu: ${tip.topic}. Dikkat Edilecek Nokta: ${tip.smartAdvice}. Altın Kural: ${tip.goldenRule}`;
      teacherVoice.speak(
        textToSpeak,
        () => setSpeakingId(tip.id),
        () => setSpeakingId(null),
        () => setSpeakingId(null)
      );
    }
  };

  if (currentMistakes.length === 0 && cumulativeTips.length === 0) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Sıfır Hata Başarısı!
              </span>
              <span className="text-xs text-emerald-600 font-semibold">Tebrikler 🌟</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Bu Ödevde Hiç Yanlış Yapmadın!
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tüm soruları doğru çözdün. Öğrendiğin yöntemleri sonraki testlerde de aynı titizlikle uygulamaya devam et!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-white to-amber-50/50 rounded-3xl p-5 sm:p-7 border border-amber-200/90 shadow-sm space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center shadow-md shadow-amber-200/50">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Yapay Zeka Hata Analitiği
              </span>
              <span className="text-xs text-amber-700 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Bir Sonraki Soruda Ne Yapmalısın?
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              Akıllı İpucu Kartları
            </h3>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-amber-100/60 rounded-xl self-start sm:self-center">
          <button
            onClick={() => {
              soundFX.playPop();
              setActiveTab('current');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'current'
                ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                : 'text-amber-900 hover:text-slate-900'
            }`}
          >
            Bu Ödevin Hataları ({currentTips.length})
          </button>
          {cumulativeTips.length > 0 && (
            <button
              onClick={() => {
                soundFX.playPop();
                setActiveTab('cumulative');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'cumulative'
                  ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                  : 'text-amber-900 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              Tüm Geçmiş Alışkanlıklar ({cumulativeTips.length})
            </button>
          )}
        </div>
      </div>

      {/* Helpful banner */}
      <div className="bg-amber-100/40 border border-amber-200 rounded-2xl p-3.5 text-xs text-slate-700 flex items-start gap-2.5">
        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900 font-bold">Nasıl Çalışır?</strong> Bu kartlar sadece nerede yanlış yaptığını değil, benzer bir soruyla karşılaştığında <strong>tökezlememen için beynine vereceğin taktikleri</strong> fısıldar. Kartı anladığında "Kavradım" olarak işaretleyebilirsin!
        </p>
      </div>

      {/* Tip Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedTips.map((tip) => {
          const isExpanded = expandedId === tip.id;
          const isMastered = !!masteredTips[tip.id];
          const isSpeaking = speakingId === tip.id;

          return (
            <div
              key={tip.id}
              className={`relative rounded-2xl border transition-all duration-200 overflow-hidden ${
                isMastered
                  ? 'bg-emerald-50/60 border-emerald-200 opacity-90'
                  : tip.difficultyOrSeverity === 'critical'
                  ? 'bg-white border-rose-200 shadow-xs hover:border-rose-300'
                  : 'bg-white border-amber-200/80 shadow-xs hover:border-amber-300'
              }`}
            >
              {/* Card Top Pill Bar */}
              <div
                className={`px-4 py-2.5 flex items-center justify-between text-xs font-bold border-b ${
                  tip.difficultyOrSeverity === 'critical'
                    ? 'bg-rose-50/80 text-rose-900 border-rose-100'
                    : 'bg-amber-50/70 text-amber-900 border-amber-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  {tip.difficultyOrSeverity === 'critical' ? (
                    <span className="flex items-center gap-1 text-2xs uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
                      <AlertTriangle className="w-3 h-3" /> Kritik Dikkat
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-2xs uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                      <Zap className="w-3 h-3" /> Taktik İpucu
                    </span>
                  )}
                  <span className="truncate max-w-[140px] sm:max-w-[180px] text-slate-700">
                    {tip.topic}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleSpeak(tip)}
                    className={`p-1 rounded-lg transition-colors cursor-pointer ${
                      isSpeaking
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'text-slate-500 hover:text-amber-700 hover:bg-white/80'
                    }`}
                    title="Sesli Dinle"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleMastered(tip.id)}
                    className={`px-2 py-1 rounded-lg text-2xs font-extrabold transition-colors cursor-pointer flex items-center gap-1 ${
                      isMastered
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200'
                    }`}
                    title={isMastered ? 'Kavrandı olarak işaretlendi' : 'Kavradım olarak işaretle'}
                  >
                    <CheckCircle className="w-3 h-3" />
                    {isMastered ? 'Kavrandı' : 'Kavradım'}
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                {/* Yapılan Hatanın Analizi */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-2xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>🔍</span>
                    <span>Tökezlenen Nokta</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                    {tip.mistakePattern}
                  </p>
                </div>

                {/* Bir Sonraki Benzer Soruda Ne Yapmalı? (Akıllı Tavsiye) */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-2xs font-bold text-amber-800 uppercase tracking-wider">
                    <Compass className="w-3.5 h-3.5 text-amber-600" />
                    <span>Bir Sonraki Benzer Soruda Stratejin</span>
                  </div>
                  <p className="text-xs text-slate-900 font-medium leading-relaxed bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/70">
                    {tip.smartAdvice}
                  </p>
                </div>

                {/* Altın Kural Box */}
                <div className="bg-gradient-to-r from-amber-100/70 to-yellow-100/60 p-2.5 rounded-xl border border-amber-200 flex items-start gap-2">
                  <span className="text-base select-none">✨</span>
                  <div className="text-xs">
                    <span className="font-extrabold text-amber-950 block">Zihnine Kazı:</span>
                    <span className="text-slate-800 font-semibold">{tip.goldenRule}</span>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="pt-2 border-t border-slate-100 space-y-2 text-xs animate-in fade-in">
                    <div className="space-y-1">
                      <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
                        🎯 Eyleme Dökülebilir Kontrol Adımı
                      </span>
                      <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg font-medium">
                        {tip.actionableStep}
                      </p>
                    </div>

                    {tip.exampleSnippet && (
                      <div className="text-2xs text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">
                        Örnek Soru: "{tip.exampleSnippet}"
                      </div>
                    )}
                  </div>
                )}

                {/* Card Footer Actions */}
                <div className="pt-1 flex items-center justify-between">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : tip.id)}
                    className="text-2xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3 h-3" /> Daha Az Göster
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" /> Detaylı Adımları Gör
                      </>
                    )}
                  </button>

                  {onFocusQuestion && (
                    <button
                      onClick={() => {
                        soundFX.playPop();
                        onFocusQuestion(tip.questionNumber);
                      }}
                      className="text-2xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Soru #{tip.questionNumber}'e Git</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
