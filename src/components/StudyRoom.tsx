import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Play,
  Pause,
  Sparkles,
  Award,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  Send,
  Loader2,
  Gamepad2,
  BookOpen,
  Target,
  ArrowRight,
  ArrowLeft,
  Headphones,
  ChevronRight,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HomeworkAnalysisResult } from '../types';
import { soundFX } from '../utils/soundEffects';
import { teacherVoice } from '../utils/audioPlayer';

interface StudyRoomProps {
  isOpen: boolean;
  onClose: () => void;
  studyTimerSeconds: number;
  isStudyTimerRunning: boolean;
  onStartStudy: (subjects: string[], topic: string, targetMinutes: number) => void;
  onPauseStudy: () => void;
  onResumeStudy: () => void;
  onFinishStudy: (durationSeconds: number, subjects: string[], topic: string) => void;
  onOpenUploadOrCamera: () => void;
  onOpenGameBank: () => void;
  onEarnStar?: () => void;
  history?: HomeworkAnalysisResult[];
  availableGameMinutes?: number;
  embedded?: boolean;
  onBack?: () => void;
  onOpenWrittenExam?: () => void;
  onOpenVocabularyHero?: () => void;
}

interface SubjectItem {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  tag: string;
  isReading?: boolean;
}

const AVAILABLE_SUBJECTS: SubjectItem[] = [
  { id: 'Matematik', name: 'Matematik', shortName: 'Matematik', icon: '📐', tag: 'LGS & MEB Müfredatı' },
  { id: 'Fen Bilimleri', name: 'Fen Bilimleri', shortName: 'Fen', icon: '🔬', tag: 'Deneyler & Basınç' },
  { id: 'Türkçe', name: 'Türkçe', shortName: 'Türkçe', icon: '📖', tag: 'Paragraf & Dil Bilgisi' },
  {
    id: 'T.C. İnkılap Tarihi ve Atatürkçülük / Sosyal Bilgiler',
    name: 'İnkılap Tarihi / Sosyal',
    shortName: 'İnkılap / Sosyal',
    icon: '🏛️',
    tag: 'Milli Mücadele & Tarih',
  },
  { id: 'İngilizce', name: 'İngilizce', shortName: 'İngilizce', icon: '🌍', tag: 'Vocabulary & Reading' },
  { id: 'Din Kültürü ve Ahlak Bilgisi', name: 'Din Kültürü', shortName: 'Din Kültürü', icon: '🕌', tag: 'Kaza & Kader' },
  { id: 'Kitap Okuma & Anlama', name: 'Kitap Okuma & Anlama', shortName: 'Kitap Okuma', icon: '📚', tag: '+15 XP Bonus', isReading: true },
  { id: 'LGS Deneme & Mantık Muhakeme', name: 'LGS Karma Deneme', shortName: 'LGS Deneme', icon: '🧠', tag: 'Tüm Branşlar' },
];

const MEB_SUBJECT_TOPICS: Record<string, string[]> = {
  Matematik: [
    '1. Ünite: Çarpanlar ve Katlar / EBOB-EKOK',
    '2. Ünite: Üslü İfadeler ve Bilimsel Gösterim',
    '3. Ünite: Kareköklü İfadeler ve Gerçek Sayılar',
    '4. Ünite: Veri Analizi (Daire ve Sütun Grafikleri)',
    '5. Ünite: Basit Olayların Olma Olasılığı',
    '6. Ünite: Cebirsel İfadeler ve Özdeşlikler',
    '7. Ünite: Doğrusal Denklemler ve Eğim',
    '8. Ünite: Eşitsizlikler ve Sayı Doğrusu Modelleri',
    '9. Ünite: Üçgenler ve Pisagor Bağıntısı',
    '10. Ünite: Geometrik Cisimler ve Dönüşüm Geometrisi',
  ],
  'Fen Bilimleri': [
    '1. Ünite: Mevsimler ve İklim (Eksen Eğikliği)',
    '2. Ünite: DNA ve Genetik Kod (Kalıtım ve Çaprazlama)',
    '3. Ünite: Basınç (Katı, Sıvı ve Gaz Basıncı Deneyleri)',
    '4. Ünite: Madde ve Endüstri (Periyodik Sistem, Asitler-Bazlar)',
    '5. Ünite: Basit Makineler (Kaldıraç, Makara, Eğik Düzlem)',
    '6. Ünite: Canlılar ve Enerji İlişkileri (Besin Zinciri & Fotosentez)',
    '7. Ünite: Elektrik Yükleri ve Elektrik Enerjisi',
  ],
  Türkçe: [
    '1. Ünite: Fiilimsiler (İsim-Fiil, Sıfat-Fiil, Zarf-Fiil)',
    '2. Ünite: Sözcükte ve Cümlede Anlam / Örtülü Anlam',
    '3. Ünite: Cümlenin Ögeleri ve Cümle Vurgusu',
    '4. Ünite: Paragrafta Ana Fikir ve Çıkarım Soruları',
    '5. Ünite: Metin Türleri ve Söz Sanatları',
    '6. Ünite: Yazım Kuralları ve Noktalama İşaretleri',
    '7. Ünite: Cümle Türleri ve Anlatım Bozuklukları',
    '8. Ünite: Mantık Muhakeme ve Sözel Akıl Yürütme',
  ],
  'T.C. İnkılap Tarihi ve Atatürkçülük / Sosyal Bilgiler': [
    '1. Ünite: Bir Kahraman Doğuyor (Mustafa Kemal’in Hayatı)',
    '2. Ünite: Milli Uyanış (I. Dünya Savaşı ve Mondros)',
    '3. Ünite: Milli Bir Destan: Ya İstiklal Ya Ölüm! (Cepheler)',
    '4. Ünite: Atatürkçülük ve Çağdaşlaşan Türkiye (İnkılaplar)',
    '5. Ünite: Demokratikleşme Çabaları ve Çok Partili Hayat',
    '6. Ünite: Atatürk Dönemi Türk Dış Politikası',
    '7. Ünite: Atatürk’ün Ölümü ve Sonrası',
  ],
  İngilizce: [
    '1. Unit: Friendship (Accepting & Refusing, Qualities)',
    '2. Unit: Teen Life (Daily Routines & Preferences)',
    '3. Unit: In The Kitchen (Cooking Steps & Recipes)',
    '4. Unit: On The Phone (Phone Conversations & Messages)',
    '5. Unit: The Internet (Online Safety & Habits)',
    '6. Unit: Adventures (Extreme Sports & Comparisons)',
    '7. Unit: Tourism (Holiday Types & Historical Sites)',
    '8. Unit: Chores (Household Responsibilities & Rules)',
    '9. Unit: Science (Scientific Inventions & Pioneers)',
    '10. Unit: Natural Forces (Disasters & Environment)',
  ],
  'Din Kültürü ve Ahlak Bilgisi': [
    '1. Ünite: Kader İnancı (Kaza ve Kader, İnsanın İradesi)',
    '2. Ünite: Zekat ve Sadaka İbadeti (Paylaşma ve Yardımlaşma)',
    '3. Ünite: Din ve Hayat (Dinin Temel Gayesi: Can, Mal, Akıl)',
    '4. Ünite: Hz. Muhammed’in Örnekliği (Doğruluk ve Merhamet)',
    '5. Ünite: İslam Dini ve Temel Kaynakları (Kur’an ve Sünnet)',
  ],
  'Kitap Okuma & Anlama': [
    '1. Aşama: Serbest Kitap Okuma (25-30 Dk)',
    '2. Aşama: LGS Paragraf Hızı ve Okuduğunu Anlama',
    '3. Aşama: Dünya ve Türk Klasikleri Roman Tahlili',
    '4. Aşama: Özet Çıkarma ve Ana Düşünce Belirleme',
  ],
  'LGS Deneme & Mantık Muhakeme': [
    '1. Bölüm: LGS Sayısal (Matematik + Fen) Denemesi',
    '2. Bölüm: LGS Sözel (Türkçe + Sosyal + Din + İngilizce)',
    '3. Bölüm: Tam Kapsamlı LGS Türkiye Geneli Denemesi',
    '4. Bölüm: Mantık Muhakeme & Yeni Nesil Soru Kampı',
  ],
};

const DURATION_PRESETS = [
  { mins: 25, label: '25 dk' },
  { mins: 40, label: '40 dk' },
  { mins: 60, label: '1 saat' },
  { mins: 90, label: '1.5 saat' },
  { mins: 120, label: '2 saat' },
  { mins: 180, label: '3 saat' },
];

export const StudyRoom: React.FC<StudyRoomProps> = ({
  isOpen,
  onClose,
  studyTimerSeconds,
  isStudyTimerRunning,
  onStartStudy,
  onPauseStudy,
  onResumeStudy,
  onFinishStudy,
  onOpenUploadOrCamera,
  onOpenGameBank,
  onEarnStar,
  history = [],
  availableGameMinutes = 30,
  embedded = false,
  onBack,
  onOpenWrittenExam,
  onOpenVocabularyHero,
}) => {
  // 2-Step Configuration Workflow: Step 1 = Select Subject, Step 2 = Select Topic & Duration
  const [setupStep, setSetupStep] = useState<'subject' | 'topic'>('subject');
  const [selectedSubject, setSelectedSubject] = useState<string>('Matematik');
  const [topicInput, setTopicInput] = useState<string>('Çarpanlar ve Katlar / EBOB-EKOK Yeni Nesil');
  const [targetMinutes, setTargetMinutes] = useState<number>(60);
  const [customMinutesInput, setCustomMinutesInput] = useState<string>('');

  // Session State
  const [sessionStarted, setSessionStarted] = useState<boolean>(false);
  const [sessionFinished, setSessionFinished] = useState<boolean>(false);
  const [finishedSummary, setFinishedSummary] = useState<{
    durationSeconds: number;
    durationMinutes: number;
    points: number;
    gameMinutes: number;
    readingBonus: number;
    subject: string;
    topic: string;
  } | null>(null);

  // Coach AI state
  const [coachMessages, setCoachMessages] = useState<
    Array<{ id: string; sender: 'student' | 'coach'; text: string; time: string }>
  >([
    {
      id: 'init-msg',
      sender: 'coach',
      text: 'Hoş geldin şampiyon! 🦉 Burası senin özel çalışma odan. 1 dakika ders = tam 1 dakika oyun hakkı kazandırır! Başlamak için dersini seçebilirsin.',
      time: 'Şimdi',
    },
  ]);
  const [studentInput, setStudentInput] = useState('');
  const [isCoachThinking, setIsCoachThinking] = useState(false);
  const [ambientAudioActive, setAmbientAudioActive] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // If timer was already running before opening, restore sessionStarted view immediately
  useEffect(() => {
    if (isStudyTimerRunning && !sessionStarted && !sessionFinished) {
      setSessionStarted(true);
    }
  }, [isStudyTimerRunning]);

  // Stop teacher voice on unmount or dialog close
  useEffect(() => {
    return () => {
      teacherVoice.stop();
    };
  }, []);

  // Compute weak topics from student history for the selected subject
  const subjectWeakTopics = React.useMemo(() => {
    const list: Array<{ topic: string; percentage: number; reason: string }> = [];

    if (history && history.length > 0) {
      const topicMap = new Map<string, { subject: string; correct: number; incorrect: number }>();
      history.forEach((h) => {
        (h.questions || []).forEach((q) => {
          const tName = q.topic || 'Genel Konu';
          const prev = topicMap.get(tName) || { subject: h.subject || 'Matematik', correct: 0, incorrect: 0 };
          if (q.isCorrect) prev.correct++;
          else prev.incorrect++;
          topicMap.set(tName, prev);
        });
      });

      topicMap.forEach((data, tName) => {
        const total = data.correct + data.incorrect;
        const pct = total > 0 ? Math.round((data.correct / total) * 100) : 0;
        if (pct < 70) {
          const isMatch =
            data.subject.toLowerCase().includes(selectedSubject.toLowerCase()) ||
            selectedSubject.toLowerCase().includes(data.subject.toLowerCase());
          if (isMatch) {
            list.push({
              topic: tName,
              percentage: pct,
              reason: 'Önceki testte yanlış yapılan soru',
            });
          }
        }
      });
    }

    return list.sort((a, b) => a.percentage - b.percentage);
  }, [history, selectedSubject]);

  // Ambient sound generator (Gentle focus hum)
  const toggleAmbientSound = () => {
    if (ambientAudioActive) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      setAmbientAudioActive(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 0.12;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = buffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 350;

        whiteNoise.connect(filter);
        filter.connect(ctx.destination);
        whiteNoise.start();

        setAmbientAudioActive(true);
      } catch {
        setAmbientAudioActive(false);
      }
    }
  };

  // STEP 1 -> STEP 2: When user chooses a lesson
  const handleSelectSubject = (subjectId: string) => {
    soundFX.playPop();
    setSelectedSubject(subjectId);

    // Pick first recommended topic for this subject as default
    const topics = MEB_SUBJECT_TOPICS[subjectId] || [];
    if (topics.length > 0) {
      setTopicInput(topics[0]);
    } else {
      setTopicInput(`${subjectId} Pekiştirme ve Soru Çözümü`);
    }

    setSetupStep('topic');
  };

  // Safe voice playback toggle: ONLY plays when clicked, stops if already playing
  const handleToggleVoice = (msgId: string, text: string) => {
    if (speakingMessageId === msgId) {
      teacherVoice.stop();
      setSpeakingMessageId(null);
    } else {
      soundFX.playPop();
      teacherVoice.stop();
      teacherVoice.speak(
        text,
        () => setSpeakingMessageId(msgId),
        () => setSpeakingMessageId(null),
        () => setSpeakingMessageId(null)
      );
    }
  };

  // Formatting mm:ss
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Call AI Study Coach Endpoint
  const askCoach = async (
    action: 'start' | 'pause' | 'finish' | 'chat',
    customQuery?: string
  ) => {
    const query = customQuery || studentInput.trim();
    if (action === 'chat' && !query) return;

    const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    if (action === 'chat') {
      const studentMsgId = `stu-${Date.now()}`;
      setCoachMessages((prev) => [...prev, { id: studentMsgId, sender: 'student', text: query, time: now }]);
      setStudentInput('');
    }

    setIsCoachThinking(true);
    try {
      const res = await fetch('/api/study-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          subject: selectedSubject,
          topic: topicInput,
          targetMinutes,
          currentMinutes: Math.round(studyTimerSeconds / 60),
          studentMessage: query,
        }),
      });

      const data = await res.json();
      const coachText =
        data.coachMessage ||
        'Harika bir odaklanma sergiliyorsun! Adım adım ilerle, kendine güven! 🦉';

      const coachMsgId = `coach-${Date.now()}`;
      setCoachMessages((prev) => [...prev, { id: coachMsgId, sender: 'coach', text: coachText, time: now }]);
    } catch {
      const fallbackText =
        'Ben buradayım şampiyon! 🦉 Derin bir nefes al, dikkatini toparla ve sorulara adım adım odaklan!';
      const coachMsgId = `coach-err-${Date.now()}`;
      setCoachMessages((prev) => [...prev, { id: coachMsgId, sender: 'coach', text: fallbackText, time: now }]);
    } finally {
      setIsCoachThinking(false);
    }
  };

  // Action: Child explicitly indicates starting to study
  const handleStartWorking = () => {
    soundFX.playCelebration();
    setSessionStarted(true);
    setSessionFinished(false);
    onStartStudy([selectedSubject], topicInput, targetMinutes);
    askCoach('start');
  };

  // Action: Child pauses for a break
  const handlePauseWorking = () => {
    soundFX.playPop();
    onPauseStudy();
    askCoach('pause');
  };

  // Action: Child resumes study
  const handleResumeWorking = () => {
    soundFX.playPop();
    onResumeStudy();
  };

  const isReadingSession =
    selectedSubject.toLowerCase().includes('okuma') ||
    selectedSubject.toLowerCase().includes('kitap') ||
    topicInput.toLowerCase().includes('okuma') ||
    topicInput.toLowerCase().includes('kitap');

  // Action: Child finishes study
  const handleFinishWorking = () => {
    soundFX.playCelebration();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const durationMin = Math.max(1, Math.round(studyTimerSeconds / 60));
    // 1 Dakika Çalışma = 1 Dakika Oyun Hakkı (Birebir 1:1 Eşitlik)
    const gameMinutesEarned = durationMin;

    // Zorlayıcı & Dengeli Puan Sistemi: 1 Dk = +1 XP, Kitap Okuma = +15 XP, Oturum Tamamlama = +5 XP
    const readingBonus = isReadingSession ? 15 : 0;
    const pointsEarned = durationMin * 1 + 5 + readingBonus;

    setFinishedSummary({
      durationSeconds: studyTimerSeconds,
      durationMinutes: durationMin,
      points: pointsEarned,
      gameMinutes: gameMinutesEarned,
      readingBonus,
      subject: selectedSubject,
      topic: topicInput,
    });

    setSessionFinished(true);
    onFinishStudy(studyTimerSeconds, [selectedSubject], topicInput);

    // Synchronize to localStorage and trigger global bank update event
    try {
      const savedBank = localStorage.getItem('odev_dostum_game_bank');
      let bank = savedBank ? JSON.parse(savedBank) : { totalPoints: 0, totalGameMinutes: 0, usedGameMinutes: 0, sessions: [] };
      bank.totalPoints = (bank.totalPoints || 0) + pointsEarned;
      bank.totalGameMinutes = (bank.totalGameMinutes || 0) + gameMinutesEarned;
      const newSess = {
        id: 'study-' + Date.now(),
        startTime: new Date(Date.now() - studyTimerSeconds * 1000).toISOString(),
        endTime: new Date().toISOString(),
        durationSeconds: studyTimerSeconds,
        activityType: isReadingSession ? 'reading' : 'study',
        title: `${selectedSubject} - ${topicInput}`,
        subject: selectedSubject,
        difficulty: 'Orta',
        pointsEarned,
        gameMinutesEarned,
      };
      bank.sessions = [newSess, ...(bank.sessions || [])];
      localStorage.setItem('odev_dostum_game_bank', JSON.stringify(bank));
      window.dispatchEvent(new Event('odev_dostum_bank_updated'));
    } catch {}

    if (onEarnStar) onEarnStar();
    askCoach('finish');
  };

  const progressPercent = Math.min(
    100,
    Math.round((studyTimerSeconds / (targetMinutes * 60)) * 100)
  );

  const currentAvailableTopics = MEB_SUBJECT_TOPICS[selectedSubject] || [];

  if (!isOpen && !embedded) return null;

  const innerContent = (
    <div className={`bg-white rounded-3xl w-full border border-purple-200 overflow-hidden flex flex-col ${
      embedded ? 'shadow-2xs' : 'max-w-3xl max-h-[92vh] shadow-2xl'
    }`}>
      {/* Top Header - Lilac and Orange Harmony */}
      <div className="px-4 sm:px-6 py-3 bg-linear-to-r from-purple-700 via-violet-600 to-orange-500 text-white flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              onClick={() => {
                soundFX.playPop();
                onBack();
              }}
              className="mr-1 px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="Ana Sayfaya Dön"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Geri</span>
            </button>
          )}
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg shrink-0">
            🎯
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base">
                Çalışma Alanım
              </h3>
              <span className="text-3xs font-extrabold px-2 py-0.5 rounded-full bg-white/20 text-orange-100 uppercase tracking-wider hidden sm:inline">
                MEB Odaklanma Alanı
              </span>
            </div>
            <p className="text-3xs text-purple-100 font-medium">
              1 Dk Ders = 1 Dk Oyun Hakkı 🎮
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Kumbaram badge */}
          <div
            onClick={() => {
              soundFX.playPop();
              onOpenGameBank();
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all cursor-pointer border border-white/20"
            title="Mevcut Oyun Süresi Kumbaram"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-orange-200" />
            <span>Kumbaram:</span>
            <span className="font-extrabold bg-white text-orange-900 px-1 py-0.2 rounded text-2xs">
              {availableGameMinutes} dk
            </span>
          </div>

          {/* Ambient Sound Toggle */}
          <button
            onClick={toggleAmbientSound}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              ambientAudioActive
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title={ambientAudioActive ? 'Odak sesini durdur' : 'Yumuşak odaklanma sesini aç'}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {ambientAudioActive ? 'Ses Açık' : 'Odak Sesi'}
            </span>
          </button>

          {!embedded && (
            <button
              onClick={() => {
                soundFX.playPop();
                teacherVoice.stop();
                onClose();
              }}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

        {/* Study Room Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 space-y-4 bg-[#faf8fd]">
          {/* ======================================================== */}
          {/* STAGE 1: NOT STARTED YET (PREPARATION: LESSONS -> TOPICS) */}
          {/* ======================================================== */}
          {!sessionStarted && !sessionFinished && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* STEP 1: SELECT SUBJECT FIRST (Çalışma odasında ilk dersler olsun) */}
              {setupStep === 'subject' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                    <div>
                      <h4 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                        <span>1. Adım: Çalışmak İstediğin Dersi Seç</span>
                      </h4>
                      <p className="text-2xs text-purple-800 font-medium mt-0.5">
                        Bugün hangi derse odaklanmak istiyorsun? Dersi seçtikten sonra konulara geçeceğiz.
                      </p>
                    </div>

                    <span className="text-3xs font-extrabold px-2.5 py-1 rounded-full bg-purple-100 text-purple-900">
                      Adım 1 / 2
                    </span>
                  </div>

                  {/* 8 Lesson Grid Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {AVAILABLE_SUBJECTS.map((sub) => {
                      const isReading = sub.isReading;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleSelectSubject(sub.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 group bg-white hover:bg-purple-50/70 border-purple-100 hover:border-purple-300 shadow-2xs hover:shadow-xs hover:scale-[1.01] active:scale-[0.99] ${
                            isReading ? 'ring-1 ring-orange-200' : ''
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 group-hover:bg-purple-100 text-purple-700 flex items-center justify-center text-xl transition-colors">
                              {sub.icon}
                            </div>
                            <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                              {sub.name}
                            </h5>
                          </div>

                          <div className="pt-2 border-t border-purple-50 flex items-center justify-between text-2xs font-bold text-purple-700">
                            <span>Dersi Seç</span>
                            <ChevronRight className="w-3.5 h-3.5 text-purple-500 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Birleşik Çalışma Araçları: Yazılı Arenası & Kelime Oyunu */}
                  {(onOpenWrittenExam || onOpenVocabularyHero) && (
                    <div className="pt-2 border-t border-purple-100 space-y-2">
                      <span className="text-3xs font-black uppercase tracking-wider text-purple-700 block">
                        ⚡ Ek Çalışma & Sınav Pratik Araçları:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {onOpenWrittenExam && (
                          <button
                            type="button"
                            onClick={() => {
                              soundFX.playPop();
                              onOpenWrittenExam();
                            }}
                            className="p-3 rounded-2xl bg-linear-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200 text-left transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-2xl">📝</span>
                              <div>
                                <h5 className="font-extrabold text-xs text-purple-950">MEB Açık Uçlu Yazılı Arenası</h5>
                                <p className="text-3xs text-purple-700 font-medium">Sınav tadında klasik yazılı soru pratiği çöz</p>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
                          </button>
                        )}

                        {onOpenVocabularyHero && (
                          <button
                            type="button"
                            onClick={() => {
                              soundFX.playPop();
                              onOpenVocabularyHero();
                            }}
                            className="p-3 rounded-2xl bg-linear-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border border-orange-200 text-left transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-2xl">🔤</span>
                              <div>
                                <h5 className="font-extrabold text-xs text-orange-950">Kelime & Kavram Kartları</h5>
                                <p className="text-3xs text-orange-700 font-medium">İngilizce & Türkçe önemli terimleri pekiştir</p>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: SELECT TOPIC & DURATION (Ders seçildikten sonra konulara geçilsin) */}
              {setupStep === 'topic' && (
                <div className="space-y-3.5">
                  {/* Selected Lesson Bar with Change Button */}
                  <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl shrink-0">
                        {AVAILABLE_SUBJECTS.find((s) => s.id === selectedSubject)?.icon || '📚'}
                      </span>
                      <div className="min-w-0">
                        <span className="text-3xs font-bold uppercase text-purple-600 block">
                          Seçilen Ders:
                        </span>
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                          {selectedSubject}
                        </h4>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playPop();
                        setSetupStep('subject');
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-lg text-2xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Dersi Değiştir</span>
                    </button>
                  </div>

                  {/* 2. Adım: Konu Seçimi */}
                  <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-purple-50 pb-2">
                      <div>
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                          <Target className="w-4 h-4 text-orange-500" />
                          2. Adım: Bu Dersin Konusunu Belirle
                        </h4>
                        <p className="text-3xs text-slate-500 font-medium">
                          Önerilen MEB konularından birini seçebilir veya kendi konunu yazabilirsin:
                        </p>
                      </div>
                    </div>

                    {/* Weak topics for this subject (if any) */}
                    {subjectWeakTopics.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-3xs font-extrabold text-orange-800 uppercase tracking-wider block">
                          ⚡ Önceki Testlerden Eksik Kalan Konuların:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {subjectWeakTopics.map((wt, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                soundFX.playPop();
                                setTopicInput(wt.topic);
                              }}
                              className={`p-2 rounded-xl text-left border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                                topicInput === wt.topic
                                  ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                                  : 'bg-orange-50/70 hover:bg-orange-100/70 text-slate-800 border-orange-200'
                              }`}
                            >
                              <span className="truncate">{wt.topic}</span>
                              <span
                                className={`text-3xs px-1.5 py-0.5 rounded font-black shrink-0 ml-1.5 ${
                                  topicInput === wt.topic
                                    ? 'bg-purple-800 text-white'
                                    : 'bg-orange-200 text-orange-950'
                                }`}
                              >
                                %{wt.percentage}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* MEB Curriculum Topics Chips for This Subject */}
                    <div className="space-y-1.5">
                      <span className="text-3xs font-extrabold text-purple-800 uppercase tracking-wider block">
                        📚 {selectedSubject} MEB Müfredat Konuları:
                      </span>
                      <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-purple-50">
                        {currentAvailableTopics.map((top, idx) => {
                          const isSelected = topicInput === top;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                soundFX.playPop();
                                setTopicInput(top);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                isSelected
                                  ? 'bg-purple-600 text-white shadow-xs'
                                  : 'bg-white hover:bg-purple-100 text-slate-700 border border-purple-100'
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                              <span>{top}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Topic Input */}
                    <div>
                      <label className="block text-3xs font-bold text-slate-700 mb-1">
                        Veya Kendi Konu / Test Adını Yaz:
                      </label>
                      <input
                        type="text"
                        value={topicInput}
                        onChange={(e) => setTopicInput(e.target.value)}
                        placeholder="Örn: 10 Soru Test Çözümü ve Formül Tekrarı"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-purple-100 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  </div>

                  {/* 3. Süre Seçimi */}
                  <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-extrabold text-slate-900">
                        Çalışma Süresi:
                      </label>
                      <span className="text-3xs font-bold text-orange-800 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                        1 Dk Ders = 1 Dk Oyun Süresi
                      </span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                      {DURATION_PRESETS.map((dp) => (
                        <button
                          key={dp.mins}
                          type="button"
                          onClick={() => {
                            setTargetMinutes(dp.mins);
                            setCustomMinutesInput('');
                          }}
                          className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                            targetMinutes === dp.mins
                              ? 'bg-purple-600 text-white border-purple-700 shadow-xs font-black'
                              : 'bg-white hover:bg-purple-50 text-slate-700 border-purple-100'
                          }`}
                        >
                          {dp.label}
                        </button>
                      ))}
                    </div>

                    {/* Custom minutes & preview */}
                    <div className="p-2 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between text-2xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-600">Özel Süre:</span>
                        <input
                          type="number"
                          min="5"
                          max="360"
                          value={customMinutesInput}
                          onChange={(e) => {
                            setCustomMinutesInput(e.target.value);
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val) && val > 0) {
                              setTargetMinutes(val);
                            }
                          }}
                          placeholder="Örn: 120"
                          className="w-14 px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-bold text-slate-800 focus:ring-1 focus:ring-purple-400"
                        />
                        <span className="text-slate-500">dk</span>
                      </div>

                      <div className="font-bold text-orange-700 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-orange-500" />
                        <span>
                          {targetMinutes} dk Çalışma ➔ {targetMinutes} dk Oyun Kazanımı
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Start Button */}
                  <div className="pt-1">
                    <button
                      onClick={handleStartWorking}
                      className="w-full py-3 bg-linear-to-r from-purple-600 via-violet-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-extrabold text-sm rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>
                        Çalışmaya Başla ({selectedSubject} · {targetMinutes} dk)
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 2: ACTIVE STUDY SESSION IN PROGRESS */}
          {/* ======================================================== */}
          {sessionStarted && !sessionFinished && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Digital Stopwatch & Focus Dashboard Card */}
              <div className="bg-linear-to-br from-[#201538] via-[#19112d] to-[#251740] text-white p-5 sm:p-6 rounded-3xl border border-purple-800/40 shadow-xl space-y-4 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-2xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
                        {selectedSubject}
                      </span>
                      {isReadingSession && (
                        <span className="text-2xs font-extrabold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-200 border border-orange-400/30">
                          📚 +15 Okuma Bonusu
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-purple-100 truncate">
                      {topicInput || selectedSubject}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        isStudyTimerRunning
                          ? 'bg-orange-500/20 text-orange-200 border border-orange-400/30 animate-pulse'
                          : 'bg-slate-700/60 text-slate-300 border border-slate-600'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isStudyTimerRunning ? 'bg-orange-400' : 'bg-slate-400'
                        }`}
                      ></span>
                      {isStudyTimerRunning ? 'Sayaç Çalışıyor' : 'Mola Verildi'}
                    </span>
                  </div>
                </div>

                {/* Big Clock Display */}
                <div className="text-center py-1 sm:py-2">
                  <div className="text-5xl sm:text-6xl font-mono font-black tracking-wider text-purple-100">
                    {formatTimer(studyTimerSeconds)}
                  </div>
                  <div className="text-xs text-orange-200 font-medium mt-1">
                    Hedef: {targetMinutes} dk · Kazanılan: +{Math.round(studyTimerSeconds / 60)} dk oyun hakkı
                  </div>

                  {/* Progress Bar */}
                  <div className="max-w-md mx-auto w-full h-2 bg-purple-950/80 rounded-full overflow-hidden mt-3 border border-purple-900/60">
                    <div
                      className="h-full bg-linear-to-r from-purple-500 via-violet-400 to-orange-400 transition-all duration-500 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Timer Controls */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  {isStudyTimerRunning ? (
                    <button
                      onClick={handlePauseWorking}
                      className="px-4 py-2 rounded-xl bg-purple-900/50 hover:bg-purple-900/80 text-purple-200 border border-purple-700/50 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Pause className="w-4 h-4" />
                      <span>Mola Ver (Duraklat)</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleResumeWorking}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Devam Et</span>
                    </button>
                  )}

                  <button
                    onClick={handleFinishWorking}
                    className="px-4.5 py-2 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-101"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Çalışmamı Bitirdim</span>
                  </button>
                </div>
              </div>

              {/* AI Study Coach Live Interaction Panel */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-purple-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-base shadow-2xs">
                      🦉
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">
                        Baykuş Çalışma Koçu
                      </h4>
                      <p className="text-3xs text-slate-500 font-medium">
                        Öğretmen sesini dinlemek için mesajın yanındaki hoparlöre tıkla
                      </p>
                    </div>
                  </div>
                  <span className="text-3xs bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-md">
                    Canlı Destek
                  </span>
                </div>

                {/* Quick Help Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '🧘 Odaklanma tavsiyesi al',
                    '⚡ 5 dakikalık mola önerisi',
                    '💡 Soruda nereden başlamalıyım?',
                    '🏆 Beni motive et!',
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isCoachThinking}
                      onClick={() => askCoach('chat', chip)}
                      className="px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-lg text-3xs font-semibold transition-all cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Chat Conversation History */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {coachMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'student'
                          ? 'bg-purple-700 text-white ml-8 rounded-tr-xs shadow-2xs'
                          : 'bg-purple-50 text-slate-800 border border-purple-100 mr-6 rounded-tl-xs shadow-2xs space-y-1'
                      }`}
                    >
                      <div className="flex items-center justify-between text-3xs font-bold opacity-80 mb-0.5">
                        <span>{msg.sender === 'student' ? 'Sen' : 'Baykuş Hoca 🦉'}</span>
                        <div className="flex items-center gap-1.5">
                          <span>{msg.time}</span>
                          {/* TEACHER VOICE BUTTON - ONLY PLAYS WHEN CLICKED */}
                          {msg.sender === 'coach' && (
                            <button
                              type="button"
                              onClick={() => handleToggleVoice(msg.id, msg.text)}
                              className={`p-1 rounded cursor-pointer transition-colors ${
                                speakingMessageId === msg.id
                                  ? 'text-orange-600 bg-orange-100 animate-pulse'
                                  : 'text-purple-700 hover:text-purple-900 hover:bg-purple-200/50'
                              }`}
                              title={speakingMessageId === msg.id ? 'Sesi Durdur' : 'Öğretmen Sesini Dinle'}
                            >
                              {speakingMessageId === msg.id ? (
                                <VolumeX className="w-3.5 h-3.5" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                  ))}

                  {isCoachThinking && (
                    <div className="flex items-center gap-2 text-xs text-purple-900 italic bg-purple-50 p-2 rounded-xl border border-purple-200">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                      Baykuş Hoca tavsiyesini hazırlıyor...
                    </div>
                  )}
                </div>

                {/* Input form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    askCoach('chat');
                  }}
                  className="flex items-center gap-1.5 pt-1"
                >
                  <input
                    type="text"
                    value={studentInput}
                    onChange={(e) => setStudentInput(e.target.value)}
                    placeholder="Baykuş Hoca'ya bir soru sor veya durumunu anlat..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-purple-200 text-xs focus:outline-none focus:ring-1 focus:ring-purple-400"
                  />
                  <button
                    type="submit"
                    disabled={isCoachThinking || !studentInput.trim()}
                    className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 3: SESSION FINISHED SUMMARY */}
          {/* ======================================================== */}
          {sessionFinished && finishedSummary && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-200 shadow-sm space-y-4 text-center animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-purple-600 to-orange-500 text-white flex items-center justify-center text-2xl mx-auto shadow-md">
                🏆
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">
                  Tebrikler Şampiyon! Çalışma Tamamlandı!
                </h3>
                <p className="text-xs text-slate-600">
                  {finishedSummary.subject} - {finishedSummary.topic}
                </p>
              </div>

              {/* Reward Grid */}
              <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-center">
                  <span className="text-3xs font-bold text-purple-700 uppercase block">Kazanılan Puan</span>
                  <span className="text-xl font-black text-purple-900 block mt-0.5">
                    +{finishedSummary.points} XP
                  </span>
                  {finishedSummary.readingBonus > 0 && (
                    <span className="text-3xs text-purple-600 font-bold block">
                      (+15 Okuma Bonusu)
                    </span>
                  )}
                </div>

                <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                  <span className="text-3xs font-bold text-orange-700 uppercase block">Kazanılan Oyun Hakkı</span>
                  <span className="text-xl font-black text-orange-600 block mt-0.5">
                    +{finishedSummary.gameMinutes} dk
                  </span>
                  <span className="text-3xs text-orange-700 font-bold block">
                    (1:1 Tam Eşitlik)
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playPop();
                    setSessionStarted(false);
                    setSessionFinished(false);
                    setSetupStep('subject');
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Yeni Çalışma Başlat
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playPop();
                    onClose();
                    onOpenGameBank();
                  }}
                  className="w-full sm:w-auto px-5 py-2 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>Kumbaraya Git & Oyun Oyna</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
  );

  if (embedded) {
    return innerContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      {innerContent}
    </div>
  );
};
