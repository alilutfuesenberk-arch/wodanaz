import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar, MainAppTab } from './components/Navbar';
import { CameraModal } from './components/CameraModal';
import { AnalyzingOverlay } from './components/AnalyzingOverlay';
import { WeeklyAdvisor } from './components/WeeklyAdvisor';
import { VocabularyHero } from './components/VocabularyHero';
import { StudyTimerAndGameBank } from './components/StudyTimerAndGameBank';
import { WrittenExamArena } from './components/WrittenExamArena';
import { StudyRoom } from './components/StudyRoom';
import { TestResultsCenter } from './components/TestResultsCenter';
import { HomeworkAnalysisResult, StudySession, GameBankState } from './types';
import { SAMPLE_HOMEWORKS } from './data/sampleTests';
import { soundFX } from './utils/soundEffects';

export default function App() {
  // 3 Primary Sections Navigation: 'study_area' | 'weekly_advisor' | 'test_results'
  const [activeMainTab, setActiveMainTab] = useState<MainAppTab>('study_area');

  const [activeHomework, setActiveHomework] = useState<HomeworkAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showGameBank, setShowGameBank] = useState(false);
  const [showWrittenExam, setShowWrittenExam] = useState(false);
  const [showVocabularyHero, setShowVocabularyHero] = useState(false);

  // Active Study Stopwatch Timer state (starts FALSE until explicitly started in Study Room)
  const [studyTimerSeconds, setStudyTimerSeconds] = useState<number>(0);
  const [isStudyTimerRunning, setIsStudyTimerRunning] = useState<boolean>(false);
  const [availableGameMinutes, setAvailableGameMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('odev_dostum_game_bank');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Math.max(0, (parsed.totalGameMinutes || 60) - (parsed.usedGameMinutes || 0));
      }
    } catch {}
    return 60; // 1 hour default bank credit for encouraging middle school students
  });

  // Real-time synchronization of game bank playtime across all components
  useEffect(() => {
    const syncGameBank = () => {
      try {
        const saved = localStorage.getItem('odev_dostum_game_bank');
        if (saved) {
          const parsed = JSON.parse(saved);
          setAvailableGameMinutes(Math.max(0, (parsed.totalGameMinutes || 60) - (parsed.usedGameMinutes || 0)));
        }
      } catch {}
    };

    window.addEventListener('odev_dostum_bank_updated', syncGameBank);
    window.addEventListener('storage', syncGameBank);
    return () => {
      window.removeEventListener('odev_dostum_bank_updated', syncGameBank);
      window.removeEventListener('storage', syncGameBank);
    };
  }, []);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUploadedImage, setLastUploadedImage] = useState<string | null>(null);

  const [selectedGrade, setSelectedGrade] = useState<string>('Tüm Ortaokul (Otomatik 5-8. Sınıf)');
  const [selectedSubject, setSelectedSubject] = useState<string>('Tüm Dersler (Otomatik Tanı)');

  // Persistence for stars and homework history
  const [stars, setStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('odev_dostum_stars');
      return saved ? parseInt(saved, 10) : 8; // start with small encouragement stars
    } catch {
      return 8;
    }
  });

  // Active Study Stopwatch Interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isStudyTimerRunning) {
      interval = setInterval(() => {
        setStudyTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStudyTimerRunning]);

  const [history, setHistory] = useState<HomeworkAnalysisResult[]>(() => {
    try {
      const saved = localStorage.getItem('odev_dostum_history');
      if (saved) {
        return JSON.parse(saved);
      }
      return [SAMPLE_HOMEWORKS[0]]; // Initial sample for quick exploration
    } catch {
      return [SAMPLE_HOMEWORKS[0]];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('odev_dostum_stars', stars.toString());
    } catch {}
  }, [stars]);

  useEffect(() => {
    try {
      localStorage.setItem('odev_dostum_history', JSON.stringify(history));
    } catch {}
  }, [history]);

  const handleEarnStar = () => {
    setStars((prev) => prev + 1);
  };

  const handleAnalyzeImage = async (base64Image: string) => {
    setShowCamera(false);
    setIsAnalyzing(true);
    setErrorMessage(null);
    setLastUploadedImage(base64Image);

    try {
      const gradeParam = selectedGrade.startsWith('Tüm') ? undefined : selectedGrade;
      const subjectParam = selectedSubject.startsWith('Tüm') ? undefined : selectedSubject;

      const response = await fetch('/api/analyze-homework', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64Image,
          gradeLevel: gradeParam,
          subjectHint: subjectParam,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.details || resData.error || 'Ödev analiz edilemedi. Lütfen fotoğrafın net ve aydınlık olduğundan emin olun.');
      }

      const analyzedData: HomeworkAnalysisResult = {
        ...resData.data,
        id: 'hw-' + Date.now(),
        date: new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
        imageUrl: base64Image,
      };

      // Calculate evaluation points & game time minutes (1 study minute = 1 game minute!)
      const studyDurationMin = Math.max(1, Math.round(studyTimerSeconds / 60));
      const correctCount = resData.data.scoreSummary?.correctCount || 0;
      const totalCount = resData.data.scoreSummary?.totalQuestions || 1;
      const isReading =
        (analyzedData.subject || '').toLowerCase().includes('türkçe') ||
        (analyzedData.title || '').toLowerCase().includes('okuma') ||
        (analyzedData.title || '').toLowerCase().includes('kitap') ||
        (analyzedData.title || '').toLowerCase().includes('paragraf');
      const readingBonus = isReading ? 100 : 0;
      const pointsEarned = (studyDurationMin * 2) + 25 + 25 + (correctCount * 15) + readingBonus;
      const gameMinutesEarned = studyDurationMin;

      const newSession: StudySession = {
        id: 'session-' + Date.now(),
        startTime: new Date(Date.now() - (studyTimerSeconds || 600) * 1000).toISOString(),
        endTime: new Date().toISOString(),
        durationSeconds: studyTimerSeconds || 600,
        activityType: isReading ? 'reading' : 'homework',
        title: `${analyzedData.gradeLevel} ${analyzedData.subject} - ${analyzedData.title}`,
        subject: analyzedData.subject,
        difficulty: 'Orta',
        correctCount,
        totalQuestions: totalCount,
        pointsEarned,
        gameMinutesEarned,
      };

      try {
        const savedBank = localStorage.getItem('odev_dostum_game_bank');
        let bank: GameBankState = savedBank ? JSON.parse(savedBank) : { totalPoints: 0, totalGameMinutes: 0, usedGameMinutes: 0, sessions: [] };
        bank.totalPoints = (bank.totalPoints || 0) + pointsEarned;
        bank.totalGameMinutes = (bank.totalGameMinutes || 0) + gameMinutesEarned;
        bank.sessions = [newSession, ...(bank.sessions || [])];
        localStorage.setItem('odev_dostum_game_bank', JSON.stringify(bank));
        setAvailableGameMinutes(Math.max(0, bank.totalGameMinutes - bank.usedGameMinutes));
        window.dispatchEvent(new Event('odev_dostum_bank_updated'));
      } catch {}

      // Reset study timer for fresh session
      setStudyTimerSeconds(0);

      setActiveHomework(analyzedData);
      setHistory((prev) => [analyzedData, ...prev.filter((h) => h.id !== analyzedData.id)]);
      // Switch view to test results check tab so the user immediately sees the analysis
      setActiveMainTab('test_results');

      soundFX.playCelebration();
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(
        err.message || 'Ödev incelenirken bir sorun oluştu. Lütfen görselin yeterince aydınlık ve okunur olduğunu kontrol edin.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectSample = (sample: HomeworkAnalysisResult) => {
    setActiveHomework(sample);
    setHistory((prev) => {
      if (prev.some((h) => h.id === sample.id)) return prev;
      return [sample, ...prev];
    });
    setActiveMainTab('test_results');

    soundFX.playCelebration();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('odev_dostum_history');
    } catch {}
  };

  // Study Room Handlers
  const handleStartStudy = (subjects: string[], topic: string, targetMinutes: number) => {
    setStudyTimerSeconds(0);
    setIsStudyTimerRunning(true);
  };

  const handlePauseStudy = () => {
    setIsStudyTimerRunning(false);
  };

  const handleResumeStudy = () => {
    setIsStudyTimerRunning(true);
  };

  const handleFinishStudy = (durationSeconds: number, subjects: string[], topic: string) => {
    setIsStudyTimerRunning(false);
    const durationMin = Math.max(1, Math.round(durationSeconds / 60));
    // 1:1 Game minutes equality (1 min study = 1 min game)
    const gameMinutesEarned = durationMin;

    const isReading =
      subjects.some(
        (s) =>
          s.toLowerCase().includes('okuma') ||
          s.toLowerCase().includes('türkçe') ||
          s.toLowerCase().includes('kitap')
      ) ||
      topic.toLowerCase().includes('okuma') ||
      topic.toLowerCase().includes('kitap') ||
      topic.toLowerCase().includes('roman') ||
      topic.toLowerCase().includes('paragraf');
    const readingBonus = isReading ? 100 : 0;
    const pointsEarned = durationMin * 2 + 25 + 25 + readingBonus;

    const newSession: StudySession = {
      id: 'session-' + Date.now(),
      startTime: new Date(Date.now() - durationSeconds * 1000).toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds,
      activityType: isReading ? 'reading' : 'study',
      title: `${subjects.join(', ')} - ${topic}`,
      subject: subjects.join(', '),
      difficulty: 'Orta',
      pointsEarned,
      gameMinutesEarned,
    };

    try {
      const savedBank = localStorage.getItem('odev_dostum_game_bank');
      let bank: GameBankState = savedBank
        ? JSON.parse(savedBank)
        : { totalPoints: 0, totalGameMinutes: 0, usedGameMinutes: 0, sessions: [] };
      bank.totalPoints = (bank.totalPoints || 0) + pointsEarned;
      bank.totalGameMinutes = (bank.totalGameMinutes || 0) + gameMinutesEarned;
      bank.sessions = [newSession, ...(bank.sessions || [])];
      localStorage.setItem('odev_dostum_game_bank', JSON.stringify(bank));
      setAvailableGameMinutes(Math.max(0, bank.totalGameMinutes - bank.usedGameMinutes));
      window.dispatchEvent(new Event('odev_dostum_bank_updated'));
    } catch {}
  };

  return (
    <div className="min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] bg-[#faf8fd]">
      {/* Top Navbar with the 3 Core Tabs */}
      <Navbar
        activeTab={activeMainTab}
        onSelectTab={(tab) => {
          setActiveMainTab(tab);
          // If switching to test_results and activeHomework was set, keep or allow back
        }}
        stars={stars}
        availableGameMinutes={availableGameMinutes}
        studyTimerSeconds={studyTimerSeconds}
        isStudyTimerRunning={isStudyTimerRunning}
        onOpenGameBank={() => setShowGameBank(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-5 sm:py-6 space-y-6">
        {/* Error notification banner */}
        {errorMessage && (
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 text-sm space-y-3 animate-in fade-in shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">⚠️</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-rose-900">Ödev Fotoğrafı Analiz Edilemedi</h4>
                  <p className="text-xs text-rose-800 leading-relaxed">{errorMessage}</p>
                </div>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
              >
                Kapat
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-rose-200">
              {lastUploadedImage && (
                <button
                  onClick={() => handleAnalyzeImage(lastUploadedImage)}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <span>🔄 Aynı Fotoğrafı Tekrar Dene</span>
                </button>
              )}
              <button
                onClick={() => handleSelectSample(SAMPLE_HOMEWORKS[0])}
                className="px-3.5 py-1.5 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-900 border border-purple-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <span>⚡ Örnek Ortaokul Testini İncele</span>
              </button>
              <span className="text-2xs text-rose-700 sm:ml-auto">
                İpucu: Sayfayı dik açıdan, net ışıkta ve gölgesiz tutarak çekmek tarama başarısını artırır.
              </span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 1. ANA KISIM: ÇALIŞMA ALANIM                            */}
        {/* ======================================================== */}
        {activeMainTab === 'study_area' && (
          <StudyRoom
            isOpen={true}
            embedded={true}
            onClose={() => {}}
            studyTimerSeconds={studyTimerSeconds}
            isStudyTimerRunning={isStudyTimerRunning}
            onStartStudy={handleStartStudy}
            onPauseStudy={handlePauseStudy}
            onResumeStudy={handleResumeStudy}
            onFinishStudy={handleFinishStudy}
            onOpenUploadOrCamera={() => {
              setActiveMainTab('test_results');
              setShowCamera(true);
            }}
            onOpenGameBank={() => setShowGameBank(true)}
            onEarnStar={handleEarnStar}
            history={history}
            availableGameMinutes={availableGameMinutes}
            onOpenWrittenExam={() => setShowWrittenExam(true)}
            onOpenVocabularyHero={() => setShowVocabularyHero(true)}
            onBack={() => setActiveMainTab('study_area')}
          />
        )}

        {/* ======================================================== */}
        {/* 2. ANA KISIM: HAFTALIK DANIŞMAN                         */}
        {/* ======================================================== */}
        {activeMainTab === 'weekly_advisor' && (
          <WeeklyAdvisor
            onBack={() => setActiveMainTab('study_area')}
            onEarnStar={handleEarnStar}
            onOpenGameBank={() => setShowGameBank(true)}
            onStartStudyLesson={(subject, topic) => {
              if (subject && subject !== 'Genel' && subject !== 'Diğer') {
                setSelectedSubject(subject);
              }
              setActiveMainTab('study_area');
            }}
          />
        )}

        {/* ======================================================== */}
        {/* 3. ANA KISIM: TEST SONUÇLARI KONTROLÜ                   */}
        {/* ======================================================== */}
        {activeMainTab === 'test_results' && (
          <TestResultsCenter
            activeHomework={activeHomework}
            setActiveHomework={setActiveHomework}
            history={history}
            stars={stars}
            availableGameMinutes={availableGameMinutes}
            onStartCamera={() => setShowCamera(true)}
            onFileSelect={handleAnalyzeImage}
            onSelectSample={handleSelectSample}
            onClearHistory={handleClearHistory}
            onEarnStar={handleEarnStar}
            onOpenGameBank={() => setShowGameBank(true)}
            onOpenStudyRoom={() => setActiveMainTab('study_area')}
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            onBackToMain={() => setActiveMainTab('study_area')}
          />
        )}
      </main>

      {/* Camera Capture Modal */}
      {showCamera && (
        <CameraModal
          onCapture={handleAnalyzeImage}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Game Bank & Activity Points Modal */}
      <StudyTimerAndGameBank
        isOpen={showGameBank}
        onClose={() => {
          setShowGameBank(false);
          try {
            const saved = localStorage.getItem('odev_dostum_game_bank');
            if (saved) {
              const parsed = JSON.parse(saved);
              setAvailableGameMinutes(Math.max(0, (parsed.totalGameMinutes || 60) - (parsed.usedGameMinutes || 0)));
            }
          } catch {}
        }}
        onBankUpdated={(mins) => setAvailableGameMinutes(mins)}
        onEarnStar={handleEarnStar}
      />

      {/* MEB Written Exam Quest Arena Modal */}
      <WrittenExamArena
        isOpen={showWrittenExam}
        onClose={() => setShowWrittenExam(false)}
        onEarnStar={handleEarnStar}
        onFinishExam={(score, title, durationMin) => {
          const pointsEarned = Math.round(score * 1.5);
          const gameMin = Math.max(5, Math.round(score / 5));
          try {
            const saved = localStorage.getItem('odev_dostum_game_bank');
            let bank: GameBankState = saved
              ? JSON.parse(saved)
              : { totalPoints: 0, totalGameMinutes: 0, usedGameMinutes: 0, sessions: [] };
            bank.totalPoints = (bank.totalPoints || 0) + pointsEarned;
            bank.totalGameMinutes = (bank.totalGameMinutes || 0) + gameMin;
            const newSess: StudySession = {
              id: 'exam-' + Date.now(),
              startTime: new Date().toISOString(),
              durationSeconds: durationMin * 60,
              activityType: 'written_exam',
              title,
              pointsEarned,
              gameMinutesEarned: gameMin,
            };
            bank.sessions = [newSess, ...(bank.sessions || [])];
            localStorage.setItem('odev_dostum_game_bank', JSON.stringify(bank));
            setAvailableGameMinutes(Math.max(0, bank.totalGameMinutes - bank.usedGameMinutes));
          } catch {}
        }}
      />

      {/* Vocabulary Hero Mini Game Modal */}
      <VocabularyHero
        isOpen={showVocabularyHero}
        onClose={() => setShowVocabularyHero(false)}
        history={history}
        onEarnStar={handleEarnStar}
      />

      {/* Analyzing Loading Overlay */}
      {isAnalyzing && <AnalyzingOverlay />}

      {/* Footer */}
      <footer className="py-6 border-t border-purple-200/70 bg-white/60 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Ödev Dostum · Çocuklar İçin Akıllı ve Sevecen Ödev Rehberi</span>
          <span className="text-purple-700 font-medium">Hatalar öğrenmenin en güzel basamaklarıdır 🌟</span>
        </div>
      </footer>
    </div>
  );
}
