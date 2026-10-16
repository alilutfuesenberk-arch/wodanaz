import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Award,
  Star,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Zap,
  BookOpen,
  Trophy,
  Flame,
  Brain,
  ChevronRight,
} from 'lucide-react';
import { HomeworkAnalysisResult } from '../types';
import { generateVocabularyQuiz, VocabularyWord } from '../utils/vocabularyQuiz';
import { soundFX } from '../utils/soundEffects';
import { teacherVoice } from '../utils/audioPlayer';

interface VocabularyHeroProps {
  isOpen: boolean;
  onClose: () => void;
  history: HomeworkAnalysisResult[];
  onEarnStar?: () => void;
}

interface SubjectChoice {
  id: string;
  name: string;
  icon: string;
  color: string;
  borderColor: string;
  hoverColor: string;
  badge: string;
}

const VOCAB_SUBJECTS: SubjectChoice[] = [
  {
    id: 'İngilizce',
    name: 'İngilizce',
    icon: '🇬🇧',
    color: 'bg-violet-50 text-violet-950',
    borderColor: 'border-violet-200',
    hoverColor: 'hover:border-violet-400 hover:bg-violet-100/70',
    badge: 'Hello, My Town & Health',
  },
  {
    id: 'Türkçe',
    name: 'Türkçe',
    icon: '📖',
    color: 'bg-orange-50 text-orange-950',
    borderColor: 'border-orange-200',
    hoverColor: 'hover:border-orange-400 hover:bg-orange-100/70',
    badge: 'Gerçek, Mecaz & Terim Anlam',
  },
  {
    id: 'Fen Bilimleri',
    name: 'Fen Bilimleri',
    icon: '🔬',
    color: 'bg-emerald-50 text-emerald-950',
    borderColor: 'border-emerald-200',
    hoverColor: 'hover:border-emerald-400 hover:bg-emerald-100/70',
    badge: 'Güneş, Dünya, Ay & Canlılar',
  },
  {
    id: 'Matematik',
    name: 'Matematik',
    icon: '📐',
    color: 'bg-purple-50 text-purple-950',
    borderColor: 'border-purple-200',
    hoverColor: 'hover:border-purple-400 hover:bg-purple-100/70',
    badge: 'Bölükler, Kesirler & Açılar',
  },
  {
    id: 'Sosyal Bilgiler',
    name: 'Sosyal Bilgiler',
    icon: '🌍',
    color: 'bg-blue-50 text-blue-950',
    borderColor: 'border-blue-200',
    hoverColor: 'hover:border-blue-400 hover:bg-blue-100/70',
    badge: 'Uygarlıklar, Haklar & Haritalar',
  },
  {
    id: 'Din Kültürü',
    name: 'Din Kültürü',
    icon: '🕌',
    color: 'bg-teal-50 text-teal-950',
    borderColor: 'border-teal-200',
    hoverColor: 'hover:border-teal-400 hover:bg-teal-100/70',
    badge: 'Allah İnancı & Adap Kuralları',
  },
];

export const VocabularyHero: React.FC<VocabularyHeroProps> = ({
  isOpen,
  onClose,
  history,
  onEarnStar,
}) => {
  // Step 1: 'select_subject' | Step 2: 'quiz'
  const [step, setStep] = useState<'select_subject' | 'quiz'>('select_subject');
  const [selectedSubject, setSelectedSubject] = useState<string>('İngilizce');

  const [questions, setQuestions] = useState<VocabularyWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasEarnedBonusStar, setHasEarnedBonusStar] = useState(false);

  // When a lesson is chosen, generate questions and switch to quiz mode
  const handleStartSubjectQuiz = (subjectId: string) => {
    soundFX.playPop();
    setSelectedSubject(subjectId);
    const generated = generateVocabularyQuiz(history, subjectId);
    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setHasEarnedBonusStar(false);
    setStep('quiz');
    if (isSpeaking) {
      teacherVoice.stop();
      setIsSpeaking(false);
    }
  };

  // Reset to subject selection
  const handleBackToSubjectSelect = () => {
    soundFX.playPop();
    if (isSpeaking) {
      teacherVoice.stop();
      setIsSpeaking(false);
    }
    setStep('select_subject');
  };

  useEffect(() => {
    if (!isOpen) {
      setStep('select_subject');
      if (isSpeaking) {
        teacherVoice.stop();
        setIsSpeaking(false);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctOptionIndex;
    if (isCorrect) {
      soundFX.playCorrect();
      setScore((prev) => prev + 1);
    } else {
      soundFX.playIncorrect();
    }
  };

  const handleNext = () => {
    soundFX.playPop();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      if (score >= 3 && onEarnStar && !hasEarnedBonusStar) {
        soundFX.playCelebration();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        onEarnStar();
        setHasEarnedBonusStar(true);
      }
    }
  };

  const handleSpeakTerm = () => {
    if (!currentQ) return;
    if (isSpeaking) {
      teacherVoice.stop();
      setIsSpeaking(false);
    } else {
      soundFX.playPop();
      const textToSpeak = `${currentQ.term}! Tanımı: ${currentQ.definition}. İpucu: ${currentQ.funFactOrTip}`;
      teacherVoice.speak(
        textToSpeak,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundFX.playPop();
          teacherVoice.stop();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-purple-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in zoom-in-95">
        {/* Header */}
        <div className="px-5 sm:px-6 py-3.5 bg-linear-to-r from-purple-700 via-violet-600 to-orange-500 text-white flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-2.5">
            {step === 'quiz' && (
              <button
                onClick={handleBackToSubjectSelect}
                className="mr-1 px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Ders Seçimine Dön"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dersi Değiştir</span>
              </button>
            )}
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg shrink-0">
              🔤
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base">
                  Kelime & Kavram Kahramanı
                </h3>
                <span className="text-3xs font-extrabold px-2 py-0.5 rounded-full bg-white/20 text-orange-100 uppercase tracking-wider">
                  Quiz & Hafıza
                </span>
              </div>
              <p className="text-3xs text-purple-100 font-medium">
                {step === 'select_subject'
                  ? 'Önce pekiştirmek istediğin dersi seç, sonra quiz’e başla!'
                  : `${selectedSubject} Dersi Kavram Testi`}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playPop();
              teacherVoice.stop();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* STEP 1: DERS SEÇİMİ (ÖNCE DERSİ SEÇ)                     */}
        {/* ======================================================== */}
        {step === 'select_subject' && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
            <div className="border-b border-purple-100 pb-2">
              <h4 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <span>1. Adım: Hangi Dersin Kelime ve Kavramlarını Çözmek İstersin?</span>
              </h4>
              <p className="text-2xs text-purple-800 font-medium mt-0.5">
                Dersini seçtiğinde o derse ait en kritik 5 terim ile mini quiz başlayacak:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {VOCAB_SUBJECTS.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleStartSubjectQuiz(sub.name)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group shadow-2xs hover:shadow-xs hover:scale-[1.01] active:scale-[0.99] ${sub.color} ${sub.borderColor} ${sub.hoverColor}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl select-none">{sub.icon}</span>
                    <div className="space-y-0.5">
                      <h5 className="font-extrabold text-sm sm:text-base leading-snug">
                        {sub.name}
                      </h5>
                      <span className="text-3xs font-semibold opacity-75 block">
                        {sub.badge}
                      </span>
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-xl bg-white/80 text-purple-700 flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-2xs shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: AKTİF QUİZ ALANI                                */}
        {/* ======================================================== */}
        {step === 'quiz' && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
            {!isFinished && currentQ ? (
              <div className="space-y-4">
                {/* Progress bar & Question Counter */}
                <div className="flex items-center justify-between text-2xs font-bold text-slate-500">
                  <span className="flex items-center gap-1.5 text-purple-700 font-black">
                    <Brain className="w-3.5 h-3.5" />
                    <span>Soru {currentIndex + 1} / {questions.length}</span>
                  </span>
                  <span className="text-orange-600 font-extrabold">
                    Skor: {score} Doğru
                  </span>
                </div>

                <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-purple-600 to-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>

                {/* Term Flashcard with Speaker */}
                <div className="p-5 rounded-2xl bg-linear-to-br from-purple-50 via-violet-50 to-orange-50/50 border border-purple-200 text-center space-y-2 relative shadow-2xs">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white text-purple-800 border border-purple-200">
                      {selectedSubject} Kavramı
                    </span>
                    <button
                      type="button"
                      onClick={handleSpeakTerm}
                      className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                        isSpeaking
                          ? 'bg-purple-600 text-white border-purple-700 animate-pulse'
                          : 'bg-white hover:bg-purple-100 text-purple-700 border-purple-200 shadow-2xs'
                      }`}
                      title={isSpeaking ? 'Seslendirmeyi durdur' : 'Kavramı sesli dinle'}
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-['Fredoka']">
                    "{currentQ.term}"
                  </h3>

                  <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
                    Aşağıdaki tanımlardan hangisi bu kavrama aittir?
                  </p>
                </div>

                {/* 4 Options Grid */}
                <div className="space-y-2 pt-1">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctOptionIndex;
                    let optionStyle = 'bg-white hover:bg-purple-50/70 border-purple-100 hover:border-purple-300 text-slate-800';

                    if (isAnswered) {
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-200';
                      } else if (isSelected) {
                        optionStyle = 'bg-rose-50 border-rose-300 text-rose-950 font-bold';
                      } else {
                        optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-start gap-3 cursor-pointer shadow-2xs ${optionStyle}`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-purple-100/80 text-purple-900 font-black flex items-center justify-center shrink-0 text-xs">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1 leading-snug">{opt}</span>
                        {isAnswered && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback & Next Button */}
                {isAnswered && (
                  <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 space-y-2 animate-in fade-in">
                    <div className="text-2xs text-purple-900 font-medium">
                      💡 <strong>İpucu:</strong> {currentQ.funFactOrTip}
                    </div>
                    {currentQ.exampleSentence && (
                      <div className="text-3xs text-slate-600 italic">
                        Örnek Kullanım: "{currentQ.exampleSentence}"
                      </div>
                    )}
                    <button
                      onClick={handleNext}
                      className="w-full py-2.5 bg-linear-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-extrabold rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{currentIndex < questions.length - 1 ? 'Sonraki Kavrama Geç' : 'Sonucu Gör'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Quiz Finished Summary */
              <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-3xl bg-linear-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center mx-auto text-3xl shadow-lg">
                  🏆
                </div>

                <div className="space-y-1">
                  <h4 className="font-black text-lg sm:text-xl text-slate-900 font-['Fredoka']">
                    {selectedSubject} Quizini Tamamladın!
                  </h4>
                  <p className="text-xs text-slate-600 font-semibold">
                    Toplam 5 sorudan <strong>{score}</strong> doğru yanıt verdin!
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-50 border border-orange-200 text-orange-950 text-xs font-black">
                  <Star className="w-4 h-4 fill-orange-400 text-orange-500" />
                  <span>{score >= 3 ? '+1 Başarı Yıldızı Kazanıldı!' : 'Tebrikler, harika bir tekrar oldu!'}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                  <button
                    onClick={() => handleStartSubjectQuiz(selectedSubject)}
                    className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Aynı Dersi Tekrar Çöz</span>
                  </button>

                  <button
                    onClick={handleBackToSubjectSelect}
                    className="w-full sm:w-auto px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Başka Ders Seç</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
