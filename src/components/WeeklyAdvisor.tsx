import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  ArrowLeft,
  BookOpen,
  Sparkles,
  Play,
  RotateCcw,
  Target,
  Edit2,
  X,
  ChevronRight,
  Flame,
  Award,
  Star,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DayOfWeek } from '../types';
import { soundFX } from '../utils/soundEffects';
import { MEB_MIDDLE_SCHOOL_CURRICULUM } from '../data/curriculumData';

export interface WeeklyAdvisorCell {
  id: string;
  day: DayOfWeek;
  subject: string;
  topic: string; // Determined by user!
  durationMinutes: number;
  targetQuestions?: number;
  completed: boolean;
  notes?: string;
  createdAt: string;
}

interface WeeklyAdvisorProps {
  onBack?: () => void;
  onStartStudyLesson?: (subject: string, topic: string) => void;
  onEarnStar?: () => void;
  onOpenGameBank?: () => void;
}

const STORAGE_KEY = 'odev_dostum_weekly_advisor_cells';

export const DAYS: { id: DayOfWeek; name: string; short: string; dayIndex: number; icon: string }[] = [
  { id: 'pazartesi', name: 'Pazartesi', short: 'Pzt', dayIndex: 1, icon: '🚀' },
  { id: 'sali', name: 'Salı', short: 'Sal', dayIndex: 2, icon: '⚡' },
  { id: 'carsamba', name: 'Çarşamba', short: 'Çar', dayIndex: 3, icon: '🎯' },
  { id: 'persembe', name: 'Perşembe', short: 'Per', dayIndex: 4, icon: '🔥' },
  { id: 'cuma', name: 'Cuma', short: 'Cum', dayIndex: 5, icon: '⭐' },
  { id: 'cumartesi', name: 'Cumartesi', short: 'Cmt', dayIndex: 6, icon: '🎈' },
  { id: 'pazar', name: 'Pazar', short: 'Paz', dayIndex: 0, icon: '🏆' },
];

export const SUBJECT_OPTIONS = [
  {
    id: 'Matematik',
    name: 'Matematik',
    icon: '📐',
    color: 'bg-purple-50 text-purple-950 border-purple-200',
    badgeBg: 'bg-purple-100 text-purple-900 border-purple-200',
    hoverBg: 'hover:bg-purple-100/70',
    accent: '#9333ea',
  },
  {
    id: 'Fen Bilimleri',
    name: 'Fen Bilimleri',
    icon: '🔬',
    color: 'bg-emerald-50 text-emerald-950 border-emerald-200',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    hoverBg: 'hover:bg-emerald-100/70',
    accent: '#059669',
  },
  {
    id: 'Türkçe',
    name: 'Türkçe',
    icon: '📖',
    color: 'bg-orange-50 text-orange-950 border-orange-200',
    badgeBg: 'bg-orange-100 text-orange-900 border-orange-200',
    hoverBg: 'hover:bg-orange-100/70',
    accent: '#ea580c',
  },
  {
    id: 'İnkılap Tarihi',
    name: 'T.C. İnkılap Tarihi',
    icon: '🏛️',
    color: 'bg-blue-50 text-blue-950 border-blue-200',
    badgeBg: 'bg-blue-100 text-blue-900 border-blue-200',
    hoverBg: 'hover:bg-blue-100/70',
    accent: '#2563eb',
  },
  {
    id: 'İngilizce',
    name: 'İngilizce',
    icon: '🇬🇧',
    color: 'bg-violet-50 text-violet-950 border-violet-200',
    badgeBg: 'bg-violet-100 text-violet-900 border-violet-200',
    hoverBg: 'hover:bg-violet-100/70',
    accent: '#7c3aed',
  },
  {
    id: 'Din Kültürü',
    name: 'Din Kültürü',
    icon: '🕌',
    color: 'bg-teal-50 text-teal-950 border-teal-200',
    badgeBg: 'bg-teal-100 text-teal-900 border-teal-200',
    hoverBg: 'hover:bg-teal-100/70',
    accent: '#0d9488',
  },
  {
    id: 'Kitap Okuma & Rehberlik',
    name: 'Kitap Okuma & Rehberlik',
    icon: '📚',
    color: 'bg-amber-50 text-amber-950 border-amber-200',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
    hoverBg: 'hover:bg-amber-100/70',
    accent: '#d97706',
  },
];

// Rich, realistic middle school schedule seed data
const INITIAL_CELLS: WeeklyAdvisorCell[] = [
  {
    id: 'cell-1',
    day: 'pazartesi',
    subject: 'Matematik',
    topic: 'Çarpanlar ve Katlar - EBOB & EKOK',
    durationMinutes: 40,
    targetQuestions: 20,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cell-2',
    day: 'pazartesi',
    subject: 'Türkçe',
    topic: 'Paragrafta Ana Fikir & Yardımcı Düşünce',
    durationMinutes: 30,
    targetQuestions: 15,
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cell-3',
    day: 'sali',
    subject: 'Fen Bilimleri',
    topic: 'Mevsimlerin Oluşumu ve Dünya Hareketleri',
    durationMinutes: 40,
    targetQuestions: 20,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cell-4',
    day: 'sali',
    subject: 'İngilizce',
    topic: 'Unit 1: Friendship - Kelime ve Okuma',
    durationMinutes: 25,
    targetQuestions: 15,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cell-5',
    day: 'carsamba',
    subject: 'Matematik',
    topic: 'Üslü İfadeler ve Bilimsel Gösterim',
    durationMinutes: 40,
    targetQuestions: 25,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cell-6',
    day: 'carsamba',
    subject: 'T.C. İnkılap Tarihi',
    topic: 'Bir Kahraman Doğuyor - Atatürkün Gençliği',
    durationMinutes: 30,
    targetQuestions: 15,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cell-7',
    day: 'persembe',
    subject: 'Fen Bilimleri',
    topic: 'DNA ve Genetik Kod - Mutasyon & Modifikasyon',
    durationMinutes: 40,
    targetQuestions: 20,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cell-8',
    day: 'persembe',
    subject: 'Kitap Okuma & Rehberlik',
    topic: 'Günde 30 Sayfa Serbest Kitap Okuma',
    durationMinutes: 30,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cell-9',
    day: 'cuma',
    subject: 'Türkçe',
    topic: 'Fiilimsiler (İsim-Fiil, Sıfat-Fiil, Zarf-Fiil)',
    durationMinutes: 40,
    targetQuestions: 20,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cell-10',
    day: 'cuma',
    subject: 'Din Kültürü',
    topic: 'Kader İnancı ve Evrenin Yasaları',
    durationMinutes: 25,
    targetQuestions: 15,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cell-11',
    day: 'cumartesi',
    subject: 'Matematik',
    topic: 'Haftalık LGS Deneme Sınavı Soru Çözümü',
    durationMinutes: 60,
    targetQuestions: 40,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cell-12',
    day: 'cumartesi',
    subject: 'Fen Bilimleri',
    topic: 'Basınç (Katı, Sıvı ve Gaz Basıncı)',
    durationMinutes: 40,
    targetQuestions: 20,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cell-13',
    day: 'pazar',
    subject: 'İngilizce',
    topic: 'Teen Life & Kitchen Vocabulary Quiz',
    durationMinutes: 30,
    targetQuestions: 20,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cell-14',
    day: 'pazar',
    subject: 'Kitap Okuma & Rehberlik',
    topic: 'Haftalık Genel Tekrar ve Yeni Hafta Planı',
    durationMinutes: 30,
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

export const WeeklyAdvisor: React.FC<WeeklyAdvisorProps> = ({
  onBack,
  onStartStudyLesson,
  onEarnStar,
  onOpenGameBank,
}) => {
  const [cells, setCells] = useState<WeeklyAdvisorCell[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_CELLS;
    } catch {
      return INITIAL_CELLS;
    }
  });

  // Current day of the week
  const todayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...

  // Modal State for adding a lesson cell
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [targetDay, setTargetDay] = useState<DayOfWeek>('pazartesi');
  const [selectedSubject, setSelectedSubject] = useState<string>('Matematik');
  const [topicInput, setTopicInput] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(40);
  const [targetQuestions, setTargetQuestions] = useState<number>(20);
  const [notesInput, setNotesInput] = useState<string>('');
  const [editingCellId, setEditingCellId] = useState<string | null>(null);

  // Active filter or day focus (for small screens or mobile view)
  const [selectedDayTab, setSelectedDayTab] = useState<DayOfWeek>('pazartesi');

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cells));
    } catch {}
  }, [cells]);

  // Statistics
  const totalCells = cells.length;
  const completedCells = cells.filter((c) => c.completed).length;
  const totalPlannedMinutes = cells.reduce((acc, c) => acc + (c.durationMinutes || 0), 0);
  const completedMinutes = cells.filter((c) => c.completed).reduce((acc, c) => acc + (c.durationMinutes || 0), 0);

  // Open modal for a specific day
  const handleOpenAddModal = (day?: DayOfWeek) => {
    soundFX.playPop();
    setEditingCellId(null);
    if (day) {
      setTargetDay(day);
      setSelectedDayTab(day);
    }
    setTopicInput('');
    setNotesInput('');
    setDurationMinutes(40);
    setTargetQuestions(20);
    setIsAddModalOpen(true);
  };

  // Open modal to edit existing cell
  const handleEditCell = (cell: WeeklyAdvisorCell) => {
    soundFX.playPop();
    setEditingCellId(cell.id);
    setTargetDay(cell.day);
    setSelectedSubject(cell.subject);
    setTopicInput(cell.topic);
    setDurationMinutes(cell.durationMinutes);
    setTargetQuestions(cell.targetQuestions || 20);
    setNotesInput(cell.notes || '');
    setIsAddModalOpen(true);
  };

  // Save or Add cell
  const handleSaveCell = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTopic = topicInput.trim() || `${selectedSubject} Konu Tekrarı`;

    if (editingCellId) {
      setCells((prev) =>
        prev.map((c) =>
          c.id === editingCellId
            ? {
                ...c,
                day: targetDay,
                subject: selectedSubject,
                topic: finalTopic,
                durationMinutes,
                targetQuestions: targetQuestions > 0 ? targetQuestions : undefined,
                notes: notesInput.trim() || undefined,
              }
            : c
        )
      );
    } else {
      const newCell: WeeklyAdvisorCell = {
        id: 'cell-' + Date.now(),
        day: targetDay,
        subject: selectedSubject,
        topic: finalTopic,
        durationMinutes,
        targetQuestions: targetQuestions > 0 ? targetQuestions : undefined,
        completed: false,
        notes: notesInput.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      setCells((prev) => [...prev, newCell]);
      if (onEarnStar) onEarnStar();
    }

    soundFX.playCorrect();
    setIsAddModalOpen(false);
    setEditingCellId(null);
  };

  // Toggle cell completion
  const handleToggleCell = (cellId: string) => {
    setCells((prev) =>
      prev.map((c) => {
        if (c.id === cellId) {
          const nextCompleted = !c.completed;
          if (nextCompleted) {
            soundFX.playCelebration();
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#8b5cf6', '#ec4899', '#f97316', '#10b981'],
            });
            if (onEarnStar) onEarnStar();
          } else {
            soundFX.playPop();
          }
          return { ...c, completed: nextCompleted };
        }
        return c;
      })
    );
  };

  // Delete cell
  const handleDeleteCell = (cellId: string) => {
    soundFX.playPop();
    setCells((prev) => prev.filter((c) => c.id !== cellId));
  };

  // Reset to initial middle school schedule
  const handleResetSchedule = () => {
    if (window.confirm('Haftalık danışman programını örnek LGS / ortaokul ders tablosuna sıfırlamak istiyor musunuz?')) {
      soundFX.playPop();
      setCells(INITIAL_CELLS);
    }
  };

  // Helper to get curriculum suggestions for current subject
  const currentSubjectCurriculum = MEB_MIDDLE_SCHOOL_CURRICULUM.find(
    (c) =>
      c.name.toLowerCase().includes(selectedSubject.toLowerCase()) ||
      selectedSubject.toLowerCase().includes(c.shortName.toLowerCase())
  );

  const getSubjectMeta = (subjName: string) => {
    return (
      SUBJECT_OPTIONS.find(
        (s) =>
          s.name.toLowerCase().includes(subjName.toLowerCase()) ||
          subjName.toLowerCase().includes(s.id.toLowerCase())
      ) || {
        id: subjName,
        name: subjName,
        icon: '📚',
        color: 'bg-purple-50 text-purple-950 border-purple-200',
        badgeBg: 'bg-purple-100 text-purple-900 border-purple-200',
        hoverBg: 'hover:bg-purple-100/70',
        accent: '#9333ea',
      }
    );
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-purple-200 shadow-2xs overflow-hidden flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* ======================================================== */}
      {/* TOP HEADER & BACK NAVIGATION                             */}
      {/* ======================================================== */}
      <div className="p-4 sm:p-6 bg-linear-to-r from-purple-700 via-indigo-700 to-violet-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                soundFX.playPop();
                onBack();
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs border border-white/20"
              title="Çalışma Alanına Dön"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Çalışma Alanına Dön</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <h2 className="text-xl sm:text-2xl font-black font-['Fredoka'] tracking-tight">
                Haftalık Danışman
              </h2>
              <span className="text-2xs font-extrabold px-2 py-0.5 rounded-full bg-purple-200/30 border border-white/30 text-purple-100 uppercase tracking-wider">
                Haftalık Ders Çizelgesi
              </span>
            </div>
            <p className="text-xs text-purple-150 font-medium mt-1">
              Haftayı gün gün gör, hücre hücre ders ve konularını planla, hedeflerine adım adım ulaş.
            </p>
          </div>
        </div>

        {/* Action Buttons Top */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => handleOpenAddModal()}
            className="px-4 py-2 bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Ders Ekle</span>
          </button>

          <button
            onClick={handleResetSchedule}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-xs"
            title="Örnek Programı Sıfırla / Tekrar Yükle"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* QUICK SUMMARY METRICS BAR                                */}
      {/* ======================================================== */}
      <div className="bg-purple-50/70 border-b border-purple-100 p-3.5 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
            <span className="text-slate-600 font-semibold">Toplam Ders Hücresi:</span>
            <span className="font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md">
              {totalCells} Ders
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600 font-semibold">Tamamlanan:</span>
            <span className="font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
              {completedCells} / {totalCells}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-slate-600 font-semibold">Haftalık Hedef Süre:</span>
            <span className="font-black text-purple-950">
              {Math.round(totalPlannedMinutes / 60)} sa {totalPlannedMinutes % 60} dk
            </span>
          </div>
        </div>

        {/* Progress percent pill */}
        <div className="flex items-center gap-2">
          <span className="text-2xs font-extrabold text-slate-500">Tamamlanma Oranı:</span>
          <div className="w-24 sm:w-32 bg-purple-200/70 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-linear-to-r from-purple-600 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${totalCells > 0 ? Math.round((completedCells / totalCells) * 100) : 0}%`,
              }}
            />
          </div>
          <span className="font-black text-xs text-purple-900">
            %{totalCells > 0 ? Math.round((completedCells / totalCells) * 100) : 0}
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE DAY SELECTOR TABS (Visible on small screens)      */}
      {/* ======================================================== */}
      <div className="md:hidden flex overflow-x-auto p-2 border-b border-purple-100 bg-white gap-1.5 scrollbar-none">
        {DAYS.map((day) => {
          const isToday = day.dayIndex === todayIndex;
          const isSelected = selectedDayTab === day.id;
          const dayCellCount = cells.filter((c) => c.day === day.id).length;
          return (
            <button
              key={day.id}
              onClick={() => {
                soundFX.playPop();
                setSelectedDayTab(day.id);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
              }`}
            >
              <span>{day.icon}</span>
              <span>{day.name}</span>
              <span
                className={`text-3xs px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/30 text-white' : 'bg-purple-200 text-purple-900'
                }`}
              >
                {dayCellCount}
              </span>
              {isToday && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* MAIN WEEK TABLE (DESKTOP: 7 COLUMNS / TABLE VIEW)        */}
      {/* ======================================================== */}
      <div className="p-3 sm:p-5 flex-1 bg-[#faf8fd] overflow-x-auto">
        {/* Desktop 7-Day Timetable Grid */}
        <div className="hidden md:grid md:grid-cols-7 gap-3 min-w-[880px]">
          {DAYS.map((day) => {
            const isToday = day.dayIndex === todayIndex;
            const dayCells = cells.filter((c) => c.day === day.id);
            return (
              <div
                key={day.id}
                className={`flex flex-col rounded-2xl border transition-all duration-200 ${
                  isToday
                    ? 'bg-purple-50/60 border-purple-400/80 ring-2 ring-purple-300/50 shadow-xs'
                    : 'bg-white border-purple-100 shadow-2xs hover:border-purple-200'
                }`}
              >
                {/* Day Header */}
                <div
                  className={`p-2.5 rounded-t-2xl border-b flex items-center justify-between ${
                    isToday
                      ? 'bg-purple-600 text-white border-purple-700'
                      : 'bg-purple-100/70 text-purple-950 border-purple-200/80'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{day.icon}</span>
                    <span className="font-black text-xs tracking-tight">{day.name}</span>
                    {isToday && (
                      <span className="text-3xs font-extrabold px-1.5 py-0.2 rounded bg-amber-400 text-amber-950">
                        Bugün
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-3xs font-black px-1.5 py-0.5 rounded-full ${
                      isToday ? 'bg-white/20 text-white' : 'bg-purple-200 text-purple-900'
                    }`}
                  >
                    {dayCells.length}
                  </span>
                </div>

                {/* Day Lesson Cells Body */}
                <div className="p-2 space-y-2.5 flex-1 min-h-[320px] flex flex-col justify-between">
                  <div className="space-y-2">
                    {dayCells.map((cell) => {
                      const meta = getSubjectMeta(cell.subject);
                      return (
                        <div
                          key={cell.id}
                          className={`p-2.5 rounded-xl border transition-all relative group flex flex-col justify-between ${
                            cell.completed
                              ? 'bg-emerald-50/70 border-emerald-200 opacity-80'
                              : `${meta.color} shadow-2xs hover:shadow-xs hover:border-purple-300`
                          }`}
                        >
                          {/* Subject Pill & Actions */}
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span
                              className={`text-3xs font-black px-2 py-0.5 rounded-md border flex items-center gap-1 ${meta.badgeBg}`}
                            >
                              <span>{meta.icon}</span>
                              <span className="truncate max-w-[85px]">{cell.subject}</span>
                            </span>

                            <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditCell(cell)}
                                className="p-1 text-slate-400 hover:text-purple-700 rounded transition-colors cursor-pointer"
                                title="Konuyu Düzenle"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteCell(cell.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                                title="Hücreyi Sil"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Lesson Topic (Determined by User) */}
                          <p
                            className={`text-xs font-bold leading-snug mb-2 ${
                              cell.completed
                                ? 'line-through text-slate-400'
                                : 'text-slate-900'
                            }`}
                          >
                            {cell.topic}
                          </p>

                          {/* Notes if any */}
                          {cell.notes && (
                            <p className="text-3xs text-slate-500 mb-2 italic line-clamp-1">
                              📝 {cell.notes}
                            </p>
                          )}

                          {/* Cell Footer: Duration / Target & Toggle */}
                          <div className="pt-2 border-t border-purple-100/60 flex items-center justify-between gap-1 text-3xs font-extrabold text-slate-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-purple-600 shrink-0" />
                              <span>{cell.durationMinutes} dk</span>
                              {cell.targetQuestions && (
                                <span className="text-purple-700">· {cell.targetQuestions} Soru</span>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              {/* Start Study Button */}
                              {onStartStudyLesson && !cell.completed && (
                                <button
                                  onClick={() => {
                                    soundFX.playPop();
                                    onStartStudyLesson(cell.subject, cell.topic);
                                  }}
                                  className="p-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white transition-colors cursor-pointer shadow-2xs"
                                  title="Bu ders ve konuyla hemen çalışmaya başla"
                                >
                                  <Play className="w-2.5 h-2.5 fill-current" />
                                </button>
                              )}

                              {/* Toggle Checkbox */}
                              <button
                                onClick={() => handleToggleCell(cell.id)}
                                className={`p-1 rounded-md transition-colors cursor-pointer ${
                                  cell.completed
                                    ? 'text-emerald-600 hover:text-emerald-700'
                                    : 'text-slate-400 hover:text-purple-600'
                                }`}
                                title={cell.completed ? 'Tamamlandı olarak işaretli' : 'Tamamla'}
                              >
                                {cell.completed ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-100" />
                                ) : (
                                  <Circle className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {dayCells.length === 0 && (
                      <div className="py-6 px-2 text-center text-slate-400 text-3xs font-medium border border-dashed border-purple-200 rounded-xl bg-purple-50/30">
                        <span>Bu güne henüz ders hücresi eklenmedi.</span>
                      </div>
                    )}
                  </div>

                  {/* Sadece Ders Ekle Butonu */}
                  <button
                    onClick={() => handleOpenAddModal(day.id)}
                    className="w-full py-2 px-2.5 rounded-xl border border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-100 text-purple-800 hover:text-purple-950 font-bold text-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                    <span>Ders Ekle</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* MOBILE VIEW (Single Day View based on selected tab)      */}
        {/* ======================================================== */}
        <div className="md:hidden space-y-3">
          {(() => {
            const currentDay = DAYS.find((d) => d.id === selectedDayTab) || DAYS[0];
            const isToday = currentDay.dayIndex === todayIndex;
            const dayCells = cells.filter((c) => c.day === currentDay.id);
            return (
              <div
                className={`rounded-2xl border p-4 space-y-3 ${
                  isToday
                    ? 'bg-purple-50/60 border-purple-300 ring-2 ring-purple-200'
                    : 'bg-white border-purple-200'
                }`}
              >
                <div className="flex items-center justify-between border-b border-purple-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{currentDay.icon}</span>
                    <h3 className="font-black text-sm text-slate-900">{currentDay.name}</h3>
                    {isToday && (
                      <span className="text-3xs font-extrabold px-2 py-0.5 rounded bg-amber-400 text-amber-950">
                        Bugün
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenAddModal(currentDay.id)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Ders Ekle</span>
                  </button>
                </div>

                {/* Day Cells Mobile */}
                <div className="space-y-2.5">
                  {dayCells.map((cell) => {
                    const meta = getSubjectMeta(cell.subject);
                    return (
                      <div
                        key={cell.id}
                        className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                          cell.completed
                            ? 'bg-emerald-50/70 border-emerald-200'
                            : `${meta.color} shadow-xs`
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`text-2xs font-black px-2.5 py-0.5 rounded-lg border flex items-center gap-1.5 ${meta.badgeBg}`}
                          >
                            <span>{meta.icon}</span>
                            <span>{cell.subject}</span>
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditCell(cell)}
                              className="p-1 text-slate-400 hover:text-purple-700 rounded cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCell(cell.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4
                          className={`font-black text-sm text-slate-900 mb-1.5 leading-snug ${
                            cell.completed ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {cell.topic}
                        </h4>

                        {cell.notes && (
                          <p className="text-xs text-slate-500 mb-2 italic">📝 {cell.notes}</p>
                        )}

                        <div className="pt-2 border-t border-purple-100 flex items-center justify-between text-xs font-bold text-slate-600">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-purple-600" />
                              {cell.durationMinutes} dk
                            </span>
                            {cell.targetQuestions && (
                              <span className="text-purple-800">
                                · {cell.targetQuestions} Soru Hedefi
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {onStartStudyLesson && !cell.completed && (
                              <button
                                onClick={() => {
                                  soundFX.playPop();
                                  onStartStudyLesson(cell.subject, cell.topic);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>Çalış</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleToggleCell(cell.id)}
                              className={`p-1 rounded cursor-pointer ${
                                cell.completed ? 'text-emerald-600' : 'text-slate-400'
                              }`}
                            >
                              {cell.completed ? (
                                <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                              ) : (
                                <Circle className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {dayCells.length === 0 && (
                    <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-purple-200 rounded-xl bg-purple-50/30">
                      Bu güne henüz ders eklenmedi. Yukarıdaki "+ Ders Ekle" butonuyla ilk dersini planla!
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: SADECE DERS EKLE / HÜCRE SEÇ MODALI              */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full border border-purple-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-linear-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">
                  ✏️
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg font-['Fredoka']">
                    {editingCellId ? 'Ders Hücresini Düzenle' : 'Hücreye Ders Ekle'}
                  </h3>
                  <p className="text-2xs text-purple-150">
                    Dersi seç, konusunu kendin belirle ve haftalık tablona kaydet.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCell} className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {/* 1. Gün Seçimi */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <span>📅 Hangi Gün?</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {DAYS.map((d) => (
                    <button
                      type="button"
                      key={d.id}
                      onClick={() => setTargetDay(d.id)}
                      className={`p-2 rounded-xl text-center border font-bold text-xs transition-all cursor-pointer ${
                        targetDay === d.id
                          ? 'bg-purple-600 text-white border-purple-700 shadow-xs scale-105'
                          : 'bg-purple-50/60 text-purple-900 border-purple-200 hover:bg-purple-100'
                      }`}
                    >
                      <span className="block text-sm">{d.icon}</span>
                      <span className="text-3xs block mt-0.5 truncate">{d.short}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Ders Seçimi */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <span>📚 Dersini Seç</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SUBJECT_OPTIONS.map((sub) => {
                    const isSelected = selectedSubject === sub.name || selectedSubject === sub.id;
                    return (
                      <button
                        type="button"
                        key={sub.id}
                        onClick={() => setSelectedSubject(sub.name)}
                        className={`p-2.5 rounded-xl border text-left font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                            : `${sub.color} hover:border-purple-300`
                        }`}
                      >
                        <span className="text-lg">{sub.icon}</span>
                        <span className="truncate">{sub.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Ders Konusu (Kullanıcı Tarafından Belirlensin) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <span>🎯 Ders Konusu (Kendin Belirle):</span>
                  </label>
                  <span className="text-3xs text-purple-700 font-bold">Kullanıcı Tanımlı</span>
                </div>

                <input
                  type="text"
                  required
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="Örn: Çarpanlar ve Katlar, Paragrafta Anlam, Basınç..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 text-sm font-semibold text-slate-900 outline-none transition-all"
                />

                {/* Quick MEB Topic Suggestions */}
                {currentSubjectCurriculum && currentSubjectCurriculum.units.length > 0 && (
                  <div className="pt-1 space-y-1">
                    <span className="text-3xs font-extrabold text-slate-500 uppercase tracking-wider block">
                      ⚡ MEB Müfredatından Hızlı Konu Seç:
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-purple-50/50 rounded-xl border border-purple-100">
                      {currentSubjectCurriculum.units.slice(0, 8).map((unit) => (
                        <button
                          key={unit.unitNumber}
                          type="button"
                          onClick={() => setTopicInput(unit.shortTitle)}
                          className="px-2 py-1 rounded-lg bg-white hover:bg-purple-100 border border-purple-200 text-purple-900 text-3xs font-bold transition-all cursor-pointer"
                        >
                          {unit.shortTitle}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Süre & Soru Hedefi */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    <span>Çalışma Süresi</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {[25, 40, 60].map((mins) => (
                      <button
                        type="button"
                        key={mins}
                        onClick={() => setDurationMinutes(mins)}
                        className={`py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          durationMinutes === mins
                            ? 'bg-purple-600 text-white border-purple-700'
                            : 'bg-purple-50 text-purple-900 border-purple-200'
                        }`}
                      >
                        {mins} dk
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-purple-600" />
                    <span>Hedef Soru</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {[15, 20, 30].map((q) => (
                      <button
                        type="button"
                        key={q}
                        onClick={() => setTargetQuestions(q)}
                        className={`py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          targetQuestions === q
                            ? 'bg-purple-600 text-white border-purple-700'
                            : 'bg-purple-50 text-purple-900 border-purple-200'
                        }`}
                      >
                        {q} Soru
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. Özel Not (Opsiyonel) */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">
                  <span>Özel Not veya Hedef (Opsiyonel)</span>
                </label>
                <input
                  type="text"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Örn: Sayfa 45-48 arası yeni nesil sorular..."
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-800 outline-none focus:border-purple-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-purple-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{editingCellId ? 'Değişiklikleri Kaydet' : 'Hücreyi Ekle'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
