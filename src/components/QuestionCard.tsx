import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  PenTool,
  MessageCircle,
  Sparkles,
  Loader2,
  Send,
  Award,
  FlaskConical,
  ExternalLink,
  BookMarked,
} from 'lucide-react';
import { QuestionData } from '../types';
import { teacherVoice } from '../utils/audioPlayer';
import { soundFX } from '../utils/soundEffects';
import { Scratchpad } from './Scratchpad';

interface QuestionCardProps {
  question: QuestionData;
  index: number;
  onEarnStar?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, index, onEarnStar }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showScratchpad, setShowScratchpad] = useState(false);

  // Interactive practice state
  const [selectedPracticeOpt, setSelectedPracticeOpt] = useState<string | null>(null);
  const [isPracticeAnswered, setIsPracticeAnswered] = useState(false);
  const [isPracticeCorrect, setIsPracticeCorrect] = useState<boolean | null>(null);

  // Alternative solutions tab state
  const [selectedAlternativeIndex, setSelectedAlternativeIndex] = useState(0);

  // Ask Teacher state
  const [isAsking, setIsAsking] = useState(false);
  const [studentQuestionInput, setStudentQuestionInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'student' | 'teacher'; text: string }>>([]);
  const [isTeacherThinking, setIsTeacherThinking] = useState(false);

  const toggleVoice = () => {
    if (isPlayingAudio) {
      teacherVoice.stop();
      setIsPlayingAudio(false);
    } else {
      soundFX.playPop();
      const narrationText = `${question.teacherLesson} Altın Kuralımız: ${question.goldenRule}`;
      teacherVoice.speak(
        narrationText,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
    }
  };

  const handlePracticeSelect = (opt: string) => {
    if (isPracticeAnswered) return;
    setSelectedPracticeOpt(opt);
    setIsPracticeAnswered(true);

    const letter = opt ? String(opt).trim().charAt(0).toUpperCase() : '';
    const correctLetter = question.practiceQuestion?.correctAnswer
      ? String(question.practiceQuestion.correctAnswer).trim().charAt(0).toUpperCase()
      : '';
    const correct = Boolean(letter && correctLetter && letter === correctLetter);
    setIsPracticeCorrect(correct);

    if (correct) {
      soundFX.playCelebration();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
      });
      if (onEarnStar) {
        onEarnStar();
      }
    } else {
      soundFX.playPop();
    }
  };

  const submitTeacherQuestion = async (text: string) => {
    if (!text.trim() || isTeacherThinking) return;

    const userText = text.trim();
    setChatMessages((prev) => [...prev, { sender: 'student', text: userText }]);
    setStudentQuestionInput('');
    setIsTeacherThinking(true);
    soundFX.playPop();

    try {
      const res = await fetch('/api/ask-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionContext: {
            questionText: question.questionText,
            correctAnswer: question.correctAnswer,
            studentAnswer: question.studentAnswer,
            topic: question.topic,
          },
          studentQuery: userText,
        }),
      });

      const data = await res.json();
      if (data && data.answer) {
        setChatMessages((prev) => [...prev, { sender: 'teacher', text: data.answer }]);
        soundFX.playCelebration();
      } else {
        setChatMessages((prev) => [
          ...prev,
          { sender: 'teacher', text: 'Harika bir soru sordun canım öğrencim! Bu tip sorularda işlem adımlarını sırayla takip etmemiz gerekir.' },
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'teacher', text: 'Öğretmenin cevabı: Harika bir soru canım öğrencim! Bu konuyu adım adım incelediğimizde ve formülleri dikkatle uyguladığımızda doğru sonuca ulaşıyoruz.' },
      ]);
    } finally {
      setIsTeacherThinking(false);
    }
  };

  const handleSendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    submitTeacherQuestion(studentQuestionInput);
  };

  return (
    <div
      id={`question-card-${question.questionNumber}`}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md ${
        question.isCorrect
          ? 'bg-emerald-50/20 border-emerald-200'
          : 'bg-white border-amber-200/80 ring-1 ring-amber-300/40'
      }`}
    >
      {/* Top Banner */}
      <div
        className={`px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b ${
          question.isCorrect
            ? 'bg-emerald-100/60 border-emerald-200 text-emerald-900'
            : 'bg-amber-100/70 border-amber-200 text-amber-950'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${
              question.isCorrect ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
            }`}
          >
            {question.questionNumber}
          </span>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Konu: {question.topic}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {question.isCorrect ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-300/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Doğru Çözüm!
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-white/90 px-2.5 py-1 rounded-lg border border-amber-300">
              <Sparkles className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '4s' }} />
              Ders Vakti! Gel Beraber Öğrenelim
            </div>
          )}

          {/* Voice Teacher Button */}
          <button
            onClick={toggleVoice}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs ${
              isPlayingAudio
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
            title="Öğretmenin sesli anlatımı"
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                Durdur
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                Öğretmeni Dinle
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Question Text */}
        <div>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {question.questionText}
          </h4>

          {/* Options if provided */}
          {Array.isArray(question.options) && question.options.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3.5">
              {question.options.map((opt, oIdx) => {
                if (!opt) return null;
                const optStr = String(opt);
                const optLetter = optStr.trim().charAt(0).toUpperCase();
                const studentAns = String(question.studentAnswer || '').toUpperCase();
                const correctAns = String(question.correctAnswer || '').toUpperCase();
                const isStudentChoice = Boolean(optLetter && studentAns.includes(optLetter));
                const isCorrectChoice = Boolean(optLetter && correctAns.includes(optLetter));

                let optStyle = 'bg-slate-50 border-slate-200 text-slate-700';
                if (isStudentChoice && question.isCorrect) {
                  optStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-semibold';
                } else if (isStudentChoice && !question.isCorrect) {
                  optStyle = 'bg-rose-100 border-rose-300 text-rose-900 line-through decoration-rose-500';
                } else if (isCorrectChoice && !question.isCorrect) {
                  optStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold ring-1 ring-emerald-400';
                }

                return (
                  <div
                    key={oIdx}
                    className={`px-3 py-2 rounded-xl border text-sm flex items-center justify-between ${optStyle}`}
                  >
                    <span>{optStr}</span>
                    {isStudentChoice && !question.isCorrect && (
                      <span className="text-xs font-bold text-rose-600 no-underline">Senin Seçimin</span>
                    )}
                    {isCorrectChoice && !question.isCorrect && (
                      <span className="text-xs font-bold text-emerald-700">Doğru Cevap</span>
                    )}
                    {isStudentChoice && question.isCorrect && (
                      <span className="text-xs font-bold text-emerald-700">Tebrikler!</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Answer comparison pill block */}
        <div className="flex flex-wrap items-center gap-3 p-3.5 bg-slate-100/80 rounded-xl text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Senin İşaretlediğin:</span>
            <span
              className={`font-bold px-2.5 py-0.5 rounded-md ${
                question.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {question.studentAnswer || 'İşaretsiz / Boş'}
            </span>
          </div>
          <span className="text-slate-300 font-bold hidden sm:inline">|</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Doğru Cevap:</span>
            <span className="font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              {question.correctAnswer}
            </span>
          </div>
        </div>

        {/* --- DERS GİBİ ANLATIM BÖLÜMÜ (TEACHER LESSON SECTION) --- */}
        <div className="space-y-4 pt-1">
          {/* Teacher speech bubble */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 relative">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-white shrink-0 shadow-xs text-xl">
                🦉
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-sm text-amber-900">Öğretmeninin Özel Dersi:</h5>
                  {isPlayingAudio && (
                    <span className="flex items-center gap-1 text-xs text-amber-700 font-medium animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Sesli anlatılıyor...
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-normal">
                  {question.teacherLesson}
                </p>
              </div>
            </div>
          </div>

          {/* Step-by-Step Solution */}
          {Array.isArray(question.stepByStepSolution) && question.stepByStepSolution.length > 0 ? (
            <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-2.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
                Adım Adım Çözüm Yolu
              </h5>
              <div className="space-y-2">
                {question.stepByStepSolution.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-md bg-sky-200 text-sky-800 font-bold flex items-center justify-center shrink-0 text-xs">
                      {sIdx + 1}
                    </span>
                    <p className="leading-relaxed">{String(step)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : typeof question.stepByStepSolution === 'string' && Boolean(question.stepByStepSolution) ? (
            <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-2.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
                Adım Adım Çözüm Yolu
              </h5>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{question.stepByStepSolution}</p>
            </div>
          ) : null}

          {/* --- FARKLI / ALTERNATİF ÇÖZÜM YOLLARI (ÖZELLİKLE MATEMATİK & MANTIK PROBLEMLERİ) --- */}
          {((question.alternativeSolutions && question.alternativeSolutions.length > 0) ||
            (question.topic && (question.topic.toLowerCase().includes('matematik') || question.topic.toLowerCase().includes('kesir') || question.topic.toLowerCase().includes('denklem') || question.topic.toLowerCase().includes('sayı') || question.topic.toLowerCase().includes('problem')))) && (
            <div className="p-4.5 rounded-2xl bg-linear-to-r from-amber-50/80 via-yellow-50/70 to-orange-50/80 border border-amber-200/90 shadow-2xs space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔀</span>
                  <h5 className="font-extrabold text-xs sm:text-sm text-amber-950 uppercase tracking-wide">
                    Matematik Farklı Çözüm Yolları
                  </h5>
                </div>
                <span className="text-2xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                  {question.alternativeSolutions && question.alternativeSolutions.length > 0
                    ? `${question.alternativeSolutions.length} Farklı Yöntem`
                    : '2 Alternatif Yol'}
                </span>
              </div>

              {/* Tab Selector */}
              <div className="flex flex-wrap gap-2">
                {(question.alternativeSolutions && question.alternativeSolutions.length > 0
                  ? question.alternativeSolutions
                  : [
                      {
                        methodTitle: '1. Yol: Klasik Cebirsel / Formül Yolu',
                        explanation: 'Verilenleri sırayla matematiksel işleme dökerek doğrudan sonuca ulaşma yöntemi.',
                        steps: ['Soru kökünü ve verileri ayır.', 'İşlem önceliğine göre adımları uygula.', 'Sağlamasını yap.'],
                      },
                      {
                        methodTitle: '2. Yol: Model & Şekil Çizme Yolu (Görsel Taktik)',
                        explanation: 'Problemi kesir kutuları, sayı doğrusu veya geometrik şekiller çizerek görselleştirip çözme taktiği.',
                        steps: ['Bütünü temsil eden kutular çiz.', 'İstenen parçaları boyayarak orantı kur.', 'Görsel üzerinden cevabı oku.'],
                      },
                      {
                        methodTitle: '3. Yol: LGS Pratik Taktik / Hızlı Akıl Yürütme',
                        explanation: 'Sınavda zaman kazandıran ters işlem ve seçenekleri eleme taktiği.',
                        steps: ['Mantıksız uç seçenekleri ele.', 'Ters işlem yaparak geriye doğru git.', '10 saniyede teyit et.'],
                      },
                    ]
                ).map((alt, aIdx) => (
                  <button
                    key={aIdx}
                    onClick={() => {
                      soundFX.playPop();
                      setSelectedAlternativeIndex(aIdx);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      selectedAlternativeIndex === aIdx
                        ? 'bg-amber-600 text-white shadow-xs scale-102'
                        : 'bg-white text-slate-700 hover:bg-amber-100/70 border border-amber-200'
                    }`}
                  >
                    {alt.methodTitle}
                  </button>
                ))}
              </div>

              {/* Active Selected Alternative Explanation */}
              {(() => {
                const list =
                  question.alternativeSolutions && question.alternativeSolutions.length > 0
                    ? question.alternativeSolutions
                    : [
                        {
                          methodTitle: '1. Yol: Klasik Cebirsel / Formül Yolu',
                          explanation: 'Verilenleri sırayla matematiksel işleme dökerek doğrudan sonuca ulaşma yöntemi.',
                          steps: ['Soru kökünü ve verileri ayır.', 'İşlem önceliğine göre adımları uygula.', 'Sağlamasını yap.'],
                        },
                        {
                          methodTitle: '2. Yol: Model & Şekil Çizme Yolu (Görsel Taktik)',
                          explanation: 'Problemi kesir kutuları, sayı doğrusu veya geometrik şekiller çizerek görselleştirip çözme taktiği.',
                          steps: ['Bütünü temsil eden kutular çiz.', 'İstenen parçaları boyayarak orantı kur.', 'Görsel üzerinden cevabı oku.'],
                        },
                        {
                          methodTitle: '3. Yol: LGS Pratik Taktik / Hızlı Akıl Yürütme',
                          explanation: 'Sınavda zaman kazandıran ters işlem ve seçenekleri eleme taktiği.',
                          steps: ['Mantıksız uç seçenekleri ele.', 'Ters işlem yaparak geriye doğru git.', '10 saniyede teyit et.'],
                        },
                      ];
                const activeMethod = list[selectedAlternativeIndex] || list[0];
                return (
                  <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs space-y-2.5 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <strong className="text-amber-950 font-bold">{activeMethod.methodTitle}</strong>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-normal">{activeMethod.explanation}</p>
                    {Array.isArray(activeMethod.steps) && activeMethod.steps.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-amber-100">
                        {activeMethod.steps.map((st, stIdx) => (
                          <div key={stIdx} className="flex items-start gap-2 text-xs text-slate-800">
                            <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-3xs mt-0.5">
                              {stIdx + 1}
                            </span>
                            <span className="leading-relaxed">{st}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Mistake Reason / Why did we make a mistake */}
          {!question.isCorrect && question.mistakeReason && (
            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs sm:text-sm text-rose-950 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-rose-900 block mb-0.5">Nerede Yanıldık?</strong>
                <p className="text-rose-800">{question.mistakeReason}</p>
              </div>
            </div>
          )}

          {/* Golden Rule / Püf Noktası */}
          {question.goldenRule && (
            <div className="p-3.5 rounded-xl bg-amber-100/70 border border-amber-300 text-xs sm:text-sm text-amber-950 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-900 block mb-0.5">💡 Altın Püf Noktası</strong>
                <p className="text-amber-900 font-medium">{question.goldenRule}</p>
              </div>
            </div>
          )}

          {/* --- SCIENCE SKILLS: PUBCHEM & EUROPE PMC SCIENTIFIC INSIGHTS --- */}
          {question.scientificData && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <FlaskConical className="w-4 h-4 text-cyan-400" />
                  <span>Bilimsel Laboratuvar & Literatür Dayanağı (Science Skills)</span>
                </div>
                <span className="text-2xs px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  Doğrulanmış Bilimsel Veri
                </span>
              </div>

              {/* PubChem Chemical Compound Card */}
              {question.scientificData.compound && (
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                  {/* 2D Structure PNG directly from PubChem */}
                  <div className="w-28 h-28 bg-white rounded-lg p-1.5 flex items-center justify-center shrink-0 shadow-xs border border-slate-300">
                    <img
                      src={question.scientificData.compound.pngUrl}
                      alt={question.scientificData.compound.name}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  <div className="space-y-1.5 flex-1 w-full text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-extrabold text-sm text-white">
                        {question.scientificData.compound.name}
                      </span>
                      <a
                        href={question.scientificData.compound.pubchemUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-2xs text-cyan-300 hover:text-cyan-200 font-bold bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800"
                      >
                        PubChem CID: {question.scientificData.compound.cid}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-2xs pt-1">
                      <div className="bg-slate-900/80 p-1.5 rounded-md border border-slate-800">
                        <span className="text-slate-400 block font-mono">Formül:</span>
                        <span className="font-bold text-slate-100">{question.scientificData.compound.molecularFormula}</span>
                      </div>
                      <div className="bg-slate-900/80 p-1.5 rounded-md border border-slate-800">
                        <span className="text-slate-400 block font-mono">Mol Ağırlığı:</span>
                        <span className="font-bold text-slate-100">{question.scientificData.compound.molecularWeight}</span>
                      </div>
                    </div>

                    {question.scientificData.compound.iupacName && (
                      <p className="text-2xs text-slate-300 truncate font-mono">
                        <span className="text-slate-400">IUPAC:</span> {question.scientificData.compound.iupacName}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Europe PMC Academic Literature */}
              {Array.isArray(question.scientificData?.literature) && question.scientificData.literature.length > 0 && (
                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-center gap-1.5 text-2xs font-bold text-slate-400 uppercase tracking-wider">
                    <BookMarked className="w-3.5 h-3.5 text-amber-400" />
                    <span>Europe PMC Akademik Literatür Referansı:</span>
                  </div>
                  {question.scientificData.literature.map((lit, lIdx) => (
                    <div key={lIdx} className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/80 text-2xs space-y-1">
                      <a
                        href={lit?.url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-cyan-200 hover:text-cyan-100 line-clamp-1 flex items-center gap-1"
                      >
                        {lit?.title || 'Bilimsel Literatür Makalesi'}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                      <p className="text-slate-400 text-3xs">
                        {lit?.journalTitle || 'Europe PMC'} {lit?.pubYear ? `(${lit.pubYear})` : ''} · {lit?.authorString || 'Akademik Araştırma'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- INTERACTIVE PRACTICE QUESTION ("ŞİMDİ SIRA SENDE!") --- */}
        {question.practiceQuestion && (
          <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h5 className="font-bold text-sm text-slate-900">
                  Şimdi Sıra Sende! (Pekiştirme Sorusu)
                </h5>
              </div>
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                +1 Yıldız Kazan ⭐️
              </span>
            </div>

            {question.practiceQuestion.question && (
              <p className="text-sm font-medium text-slate-800">
                {question.practiceQuestion.question}
              </p>
            )}

            {Array.isArray(question.practiceQuestion?.options) && question.practiceQuestion.options.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {question.practiceQuestion.options.map((opt, pIdx) => {
                  if (!opt) return null;
                  const optStr = String(opt);
                  const optLetter = optStr.trim().charAt(0).toUpperCase();
                  const isSelected = selectedPracticeOpt === opt;
                  const correctLetter = question.practiceQuestion?.correctAnswer
                    ? String(question.practiceQuestion.correctAnswer).trim().charAt(0).toUpperCase()
                    : '';
                  const isCorrect = Boolean(optLetter && correctLetter && optLetter === correctLetter);

                  let btnStyle = 'bg-white hover:bg-amber-100/50 text-slate-800 border-slate-200';
                  if (isPracticeAnswered) {
                    if (isSelected && isCorrect) {
                      btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-100 border-rose-300 text-rose-800 line-through';
                    } else if (isCorrect) {
                      btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                    }
                  }

                  return (
                    <button
                      key={pIdx}
                      disabled={isPracticeAnswered}
                      onClick={() => handlePracticeSelect(opt)}
                      className={`px-3 py-2 text-left rounded-xl border text-xs sm:text-sm font-medium transition-all ${btnStyle}`}
                    >
                      {optStr}
                    </button>
                  );
                })}
              </div>
            ) : question.practiceQuestion.correctAnswer ? (
              <div className="p-3 rounded-xl bg-white/90 border border-amber-200 text-xs text-slate-700">
                <span className="font-bold text-amber-900">Doğru Yanıt:</span> {question.practiceQuestion.correctAnswer}
                {question.practiceQuestion.explanation && (
                  <p className="mt-1 text-slate-600">{question.practiceQuestion.explanation}</p>
                )}
              </div>
            ) : null}

            {/* Practice Result Feedback */}
            {isPracticeAnswered && (
              <div
                className={`p-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isPracticeCorrect
                    ? 'bg-emerald-100/90 text-emerald-900 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {isPracticeCorrect ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎉</span>
                    <div>
                      <strong>Harikasın! Konuyu tam kavradın!</strong>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        {question.practiceQuestion.explanation}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💪</span>
                    <div>
                      <strong>Çok yaklaştın!</strong>
                      <p className="text-xs text-amber-800 mt-0.5">
                        {question.practiceQuestion.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Bar (Scratchpad + Ask Teacher Toggle) */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
          <button
            onClick={() => {
              soundFX.playPop();
              setShowScratchpad(true);
            }}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 px-3 py-2 rounded-xl transition-colors"
          >
            <PenTool className="w-3.5 h-3.5 text-amber-500" />
            Karalama Defterini Aç (Çiz & Hesapla)
          </button>

          <button
            onClick={() => setIsAsking(!isAsking)}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-100/70 hover:bg-amber-200/70 px-3 py-2 rounded-xl transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            {isAsking ? 'Soru Alanını Kapat' : 'Öğretmene Soru Sor'}
          </button>
        </div>

        {/* Chat / Ask Teacher Panel */}
        {isAsking && (
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-3.5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Bu Soru Hakkında Öğretmenine Danış (Canlı Rehber)
              </h5>
              <span className="text-2xs bg-amber-200/60 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                7/24 Yanında
              </span>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {[
                '💡 Başka bir örnekle anlatır mısınız?',
                '⚡ Bunun sınavda pratik bir kısa yolu var mı?',
                '🔍 İşlem önceliğini nasıl hatırlamalıyım?',
                '🤔 Ben bu soruda nerede yanıldım?',
              ].map((chip, cIdx) => (
                <button
                  key={cIdx}
                  type="button"
                  disabled={isTeacherThinking}
                  onClick={() => submitTeacherQuestion(chip)}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100/80 text-amber-900 border border-amber-200/80 rounded-lg text-2xs font-semibold transition-all cursor-pointer shadow-2xs hover:scale-102"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Conversation log */}
            {chatMessages.length > 0 && (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {chatMessages.map((msg, mIdx) => (
                  <div
                    key={mIdx}
                    className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'student'
                        ? 'bg-amber-500 text-white ml-6 rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-amber-200 mr-4 rounded-tl-xs shadow-2xs space-y-1'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="block font-bold text-2xs opacity-80">
                        {msg.sender === 'student' ? 'Sen' : 'Öğretmen Baykuş 🦉'}
                      </span>
                      {msg.sender === 'teacher' && (
                        <button
                          type="button"
                          onClick={() => teacherVoice.speak(msg.text)}
                          className="p-1 text-amber-600 hover:text-amber-800 rounded-md hover:bg-amber-100/50 cursor-pointer"
                          title="Öğretmenin yanıtını sesli dinle"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                ))}
              </div>
            )}

            {isTeacherThinking && (
              <div className="flex items-center gap-2 text-xs text-amber-800 italic bg-amber-100/50 p-2.5 rounded-xl border border-amber-200">
                <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                Öğretmenin yanıtını hazırlıyor, sabırla dinlemeye hazır ol...
              </div>
            )}

            <form onSubmit={handleSendQuestion} className="flex gap-2">
              <input
                type="text"
                value={studentQuestionInput}
                onChange={(e) => setStudentQuestionInput(e.target.value)}
                placeholder="Örn: Hocam neden önce parantez içini yaptık?"
                className="flex-1 px-3.5 py-2.5 bg-white rounded-xl border border-amber-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 placeholder:text-slate-400 font-medium"
              />
              <button
                type="submit"
                disabled={!studentQuestionInput.trim() || isTeacherThinking}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Sor
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Scratchpad Modal */}
      {showScratchpad && (
        <Scratchpad
          title={`Soru ${question.questionNumber} - Karalama Defteri`}
          onClose={() => setShowScratchpad(false)}
        />
      )}
    </div>
  );
};
