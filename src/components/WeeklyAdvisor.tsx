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
  X,
  Star,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DayOfWeek } from '../types';
import { soundFX } from '../utils/soundEffects';

export interface WeeklyAdvisorCell {
  id: string;
  day: DayOfWeek;
  subject: string;
  durationMinutes: number;
  completed: boolean;
  createdAt: string;
}

interface WeeklyAdvisorProps {
  onBack?: () => void;
  onStartStudyLesson?: (subject: string, topic?: string) => void;
  onEarnStar?: () => void;
  onOpenGameBank?: () => void;
}

const STORAGE_KEY = 'odev_dostum_weekly_advisor_cells_v5';

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
  },
  {
    id: 'Fen Bilimleri',
    name: 'Fen Bilimleri',
    icon: '🔬',
    color: 'bg-emerald-50 text-emerald-950 border-emerald-200',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    hoverBg: 'hover:bg-emerald-100/70',
  },
  {
    id: 'Türkçe',
    name: 'Türkçe',
    icon: '📖',
    color: 'bg-orange-50 text-orange-950 border-orange-200',
    badgeBg: 'bg-orange-100 text-orange-900 border-orange-200',
    hoverBg: 'hover:bg-orange-100/70',
  },
  {
    id: 'Sosyal Bilgiler',
    name: 'Sosyal Bilgiler',
    icon: '🌍',
    color: 'bg-blue-50 text-blue-950 border-blue-200',
    badgeBg: 'bg-blue-100 text-blue-900 border-blue-200',
    hoverBg: 'hover:bg-blue-100/70',
  },
  {
    id: 'İngilizce',
    name: 'İngilizce',
    icon: '🇬🇧',
    color: 'bg-violet-50 text-violet-950 border-violet-200',
    badgeBg: 'bg-violet-100 text-violet-900 border-violet-200',
    hoverBg: 'hover:bg-violet-100/70',
  },
  {
    id: 'Din Kültürü',
    name: 'Din Kültürü',
    icon: '🕌',
    color: 'bg-teal-50 text-teal-950 border-teal-200',
    badgeBg: 'bg-teal-100 text-teal-900 border-teal-200',
    hoverBg: 'hover:bg-teal-100/70',
  },
  {
    id: 'Kitap Okuma',
    name: 'Kitap Okuma',
    icon: '📚',
    color: 'bg-amber-50 text-amber-950 border-amber-200',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
    hoverBg: 'hover:bg-amber-100/70',
  },
];

// 5. Sınıf MEB Müfredatına Uygun Haftalık Ders Hücreleri
const INITIAL_CELLS: WeeklyAdvisorCell[] = [
  { id: 'cell-1', day: 'pazartesi', subject: 'Matematik', durationMinutes: 40, completed: false, createdAt: new Date().toISOString() },
  { id: 'cell-2', day: 'pazartesi', subject: 'Türkçe', durationMinutes: 30, completed: true, createdAt: new Date().toISOString() },
  { id: 'cell-3', day: 'sali', subject: 'Fen Bilimleri', durationMinutes: 40, completed: false, createdAt: new Date().toISOString() },
  { id: 'cell-4', day: 'sali', subject: 'İngilizce', durationMinutes: 30, completed: false, createdAt: new Date().toISOString() },
  { id: 'cell-5', day: 'carsamba', subject: 'Matematik', durationMinutes: 40, completed: false, createdAt: new Date().toISOString() },
  { id: 'cell-6', day: 'carsamba', subject: 'Sosyal Bilgiler', durationMinutes: 30, completed: false, createdAt: new Date().toISOString() },
  { id: 'cell-7', day: 'persembe', subject: 'Fen Bilimleri', durationMinutes: 40, completed: false, createdAt: new Date().toISOString() },
  { id: 'cell-8', day: 'persembe', subject: 'Kitap Okuma', durationMinutes: 30, completed: false, createdAt: new Date().toISOString() },
  { id: 'cell-9', day: 'cuma', subject: 'Türkçe', durationMinutes: 40, completed: false, createdAt: new Date().toISOString() },
  { id: 'cell-10', day: 'cuma', subject: 'Din Kültürü', durationMinutes: 30, completed: false, createdAt: new Date().toISOString() },
  { id: 'cell-11', day: 'cumartesi', subject: 'Matematik', durationMinutes: 40, completed: false, createdAt: new Date().toISOString() },
  { id: 'cell-12', day: 'cumartesi', subject: 'Fen Bilimleri', durationMinutes: 40, completed: false, createdAt: new Date().toISOString() },
  { id: 'cell-13', day: 'pazar', subject: 'İngilizce', durationMinutes: 30, completed: false, createdAt: new Date().toISOString() },
  { id: 'cell-14', day: 'pazar', subject: 'Kitap Okuma', durationMinutes: 30, completed: false, createdAt: new Date().toISOString() },
];

export const WeeklyAdvisor: React.FC<WeeklyAdvisorProps> = ({
  onBack,
  onStartStudyLesson,
  onEarnStar,
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

  const todayIndex = new Date().getDay();

  // Sadece Ders Ekle Modalı
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [targetDay, setTargetDay] = useState<DayOfWeek>('pazartesi');
  const [selectedSubject, setSelectedSubject] = useState<string>('Matematik');
  const [durationMinutes, setDurationMinutes] = useState<number>(40);

  // Mobil sekme
  const [selectedDayTab, setSelectedDayTab] = useState<DayOfWeek>('pazartesi');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cells));
    } catch {}
  }, [cells]);

  const totalCells = cells.length;
  const completedCells = cells.filter((c) => c.completed).length;

  const handleOpenAddModal = (day?: DayOfWeek) => {
    soundFX.playPop();
    if (day) {
      setTargetDay(day);
      setSelectedDayTab(day);
    }
    setDurationMinutes(40);
    setIsAddModalOpen(true);
  };

  const handleAddCell = (e: React.FormEvent) => {
    e.preventDefault();
    const newCell: WeeklyAdvisorCell = {
      id: 'cell-' + Date.now(),
      day: targetDay,
      subject: selectedSubject,
      durationMinutes,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setCells((prev) => [...prev, newCell]);
    soundFX.playCorrect();
    if (onEarnStar) onEarnStar();
    setIsAddModalOpen(false);
  };

  const handleToggleCell = (cellId: string) => {
    setCells((prev) =>
      prev.map((c) => {
        if (c.id === cellId) {
          const nextCompleted = !c.completed;
          if (nextCompleted) {
            soundFX.playCelebration();
            confetti({
              particleCount: 40,
              spread: 55,
              origin: { y: 0.7 },
              colors: ['#9333ea', '#3b82f6', '#f97316', '#10b981'],
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

  const handleDeleteCell = (cellId: string) => {
    soundFX.playPop();
    setCells((prev) => prev.filter((c) => c.id !== cellId));
  };

  const handleResetSchedule = () => {
    if (window.confirm('Haftalık danışman programını 5. sınıf örnek ders tablosuna sıfırlamak istiyor musunuz?')) {
      soundFX.playPop();
      setCells(INITIAL_CELLS);
    }
  };

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
      }
    );
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-purple-200 shadow-2xs overflow-hidden flex flex-col box-border">
      {/* ======================================================== */}
      {/* HEADER & GERİ DÖNÜŞ (SYSTEM-UI FONT & COMPACT BOUNDS)     */}
      {/* ======================================================== */}
      <div className="px-4 sm:px-6 py-3.5 bg-purple-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-800/40 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          {onBack && (
            <button
              onClick={() => {
                soundFX.playPop();
                onBack();
              }}
              className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white cursor-pointer shrink-0"
              title="Çalışma Alanına Dön"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg shrink-0">📅</span>
              <h2
                style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                className="text-lg sm:text-xl font-bold tracking-tight text-white truncate"
              >
                Haftalık Danışmanım
              </h2>
              <span className="text-3xs font-extrabold px-2 py-0.5 rounded-full bg-white/20 text-white shrink-0">
                5. Sınıf
              </span>
            </div>
            <p className="text-2xs sm:text-xs text-purple-150 mt-0.5 truncate">
              Haftayı gün gün incele, hücre hücre derslerini düzenle.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          <button
            onClick={() => handleOpenAddModal()}
            className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Ders Ekle</span>
          </button>

          <button
            onClick={handleResetSchedule}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer shrink-0"
            title="5. Sınıf Örnek Programına Sıfırla"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DURUM BARI                                               */}
      {/* ======================================================== */}
      <div className="bg-purple-50/70 border-b border-purple-100 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0"></span>
            <span className="text-2xs sm:text-xs font-medium">Toplam Ders:</span>
            <span className="font-bold text-purple-900 text-2xs sm:text-xs">{totalCells}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="text-2xs sm:text-xs font-medium">Tamamlanan:</span>
            <span className="font-bold text-emerald-800 text-2xs sm:text-xs">{completedCells}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="w-20 sm:w-28 bg-purple-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-300"
              style={{
                width: `${totalCells > 0 ? Math.round((completedCells / totalCells) * 100) : 0}%`,
              }}
            />
          </div>
          <span className="font-bold text-2xs sm:text-xs text-purple-900">
            %{totalCells > 0 ? Math.round((completedCells / totalCells) * 100) : 0}
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBİL GÜN SEÇİCİ SEKMELER                                */}
      {/* ======================================================== */}
      <div className="md:hidden flex overflow-x-auto p-2 border-b border-purple-100 bg-white gap-1.5 scrollbar-none shrink-0">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
              }`}
            >
              <span>{day.short}</span>
              <span className="text-3xs px-1.5 py-0.2 rounded-full bg-white/20">
                {dayCellCount}
              </span>
              {isToday && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* MASAÜSTÜ TABLO: 7 GÜN SÜTUNLARI - DÜZENLİ SINIRLAR       */}
      {/* ======================================================== */}
      <div className="p-2.5 sm:p-4 flex-1 bg-[#faf8fd] overflow-x-auto">
        <div className="hidden md:grid md:grid-cols-7 gap-2 min-w-[760px] lg:min-w-0 w-full box-border">
          {DAYS.map((day) => {
            const isToday = day.dayIndex === todayIndex;
            const dayCells = cells.filter((c) => c.day === day.id);
            return (
              <div
                key={day.id}
                className={`flex flex-col rounded-xl border transition-all overflow-hidden box-border min-w-0 ${
                  isToday
                    ? 'bg-purple-50/50 border-purple-300 ring-2 ring-purple-200/60 shadow-xs'
                    : 'bg-white border-purple-150 shadow-2xs'
                }`}
              >
                {/* Gün Başlığı */}
                <div
                  className={`px-2 py-2 border-b flex items-center justify-between gap-1 min-w-0 shrink-0 ${
                    isToday
                      ? 'bg-purple-600 text-white border-purple-700'
                      : 'bg-purple-50 text-purple-950 border-purple-100'
                  }`}
                >
                  <span className="font-bold text-[11px] lg:text-xs truncate">{day.name}</span>
                  <span
                    className={`text-3xs font-extrabold px-1.5 py-0.2 rounded-full shrink-0 ${
                      isToday ? 'bg-white/20 text-white' : 'bg-purple-200 text-purple-900'
                    }`}
                  >
                    {dayCells.length}
                  </span>
                </div>

                {/* Hücre Hücre Dersler (Dışarı Taşmayan Sınırlar) */}
                <div className="p-1.5 space-y-1.5 flex-1 min-h-[260px] flex flex-col justify-between overflow-hidden min-w-0">
                  <div className="space-y-1.5 min-w-0">
                    {dayCells.map((cell) => {
                      const meta = getSubjectMeta(cell.subject);
                      return (
                        <div
                          key={cell.id}
                          className={`p-2 rounded-lg border transition-all group flex flex-col justify-between overflow-hidden box-border w-full min-w-0 gap-1.5 ${
                            cell.completed
                              ? 'bg-emerald-50/70 border-emerald-200 opacity-80'
                              : `${meta.color} shadow-2xs hover:shadow-xs hover:border-purple-300`
                          }`}
                        >
                          {/* Üst Satır: Ders Rozeti ve Sil Butonu */}
                          <div className="flex items-center justify-between gap-1 w-full min-w-0">
                            <div
                              className={`px-1.5 py-0.5 rounded-md border flex items-center gap-1 min-w-0 flex-1 overflow-hidden ${meta.badgeBg}`}
                            >
                              <span className="text-xs shrink-0 leading-none">{meta.icon}</span>
                              <span className="text-[11px] font-bold text-slate-800 truncate leading-tight">
                                {cell.subject}
                              </span>
                            </div>

                            <button
                              onClick={() => handleDeleteCell(cell.id)}
                              className="shrink-0 p-1 text-slate-300 hover:text-rose-600 rounded transition-colors cursor-pointer"
                              title="Ders Hücresini Sil"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Alt Satır: Süre & Butonlar */}
                          <div className="pt-1 border-t border-purple-100/70 flex items-center justify-between gap-1 w-full min-w-0 text-[10px] font-semibold text-slate-600">
                            <div className="flex items-center gap-0.5 shrink-0 text-slate-500">
                              <Clock className="w-2.5 h-2.5 text-purple-600 shrink-0" />
                              <span>{cell.durationMinutes} dk</span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {/* Çalış Butonu */}
                              {onStartStudyLesson && !cell.completed && (
                                <button
                                  onClick={() => {
                                    soundFX.playPop();
                                    onStartStudyLesson(cell.subject);
                                  }}
                                  className="p-1 rounded bg-purple-600 hover:bg-purple-700 text-white transition-colors cursor-pointer shrink-0 shadow-2xs"
                                  title="Bu dersi çalışma alanında başlat"
                                >
                                  <Play className="w-2.5 h-2.5 fill-current" />
                                </button>
                              )}

                              {/* Tamamlama Onay Butonu */}
                              <button
                                onClick={() => handleToggleCell(cell.id)}
                                className={`p-0.5 rounded cursor-pointer shrink-0 transition-colors ${
                                  cell.completed
                                    ? 'text-emerald-600 hover:text-emerald-700'
                                    : 'text-slate-400 hover:text-purple-600'
                                }`}
                                title={cell.completed ? 'Tamamlandı' : 'Tamamla'}
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
                      <div className="py-5 px-1 text-center text-slate-400 text-[10px] font-medium border border-dashed border-purple-200 rounded-lg bg-purple-50/20">
                        Ders yok
                      </div>
                    )}
                  </div>

                  {/* Sadece Ders Ekle Butonu */}
                  <button
                    onClick={() => handleOpenAddModal(day.id)}
                    className="w-full py-1.5 px-1 rounded-lg border border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-100/80 text-purple-900 font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 truncate mt-1"
                  >
                    <Plus className="w-3 h-3 stroke-[3] shrink-0" />
                    <span className="truncate">Ders Ekle</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* MOBİL GÖRÜNÜM (Tek Gün Seçimi - Dışarı Taşmayan Sınırlar)  */}
        {/* ======================================================== */}
        <div className="md:hidden space-y-3">
          {(() => {
            const currentDay = DAYS.find((d) => d.id === selectedDayTab) || DAYS[0];
            const isToday = currentDay.dayIndex === todayIndex;
            const dayCells = cells.filter((c) => c.day === currentDay.id);
            return (
              <div
                className={`rounded-2xl border p-3.5 space-y-3 box-border overflow-hidden ${
                  isToday ? 'bg-purple-50/50 border-purple-300' : 'bg-white border-purple-200'
                }`}
              >
                <div className="flex items-center justify-between border-b border-purple-100 pb-2 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-sm text-slate-900 truncate">{currentDay.name}</span>
                    {isToday && (
                      <span className="text-3xs font-bold px-1.5 py-0.2 rounded bg-amber-400 text-amber-950 shrink-0">
                        Bugün
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenAddModal(currentDay.id)}
                    className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Ders Ekle</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {dayCells.map((cell) => {
                    const meta = getSubjectMeta(cell.subject);
                    return (
                      <div
                        key={cell.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 overflow-hidden box-border ${
                          cell.completed
                            ? 'bg-emerald-50/70 border-emerald-200 opacity-80'
                            : `${meta.color} shadow-xs`
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1.5 min-w-0 truncate ${meta.badgeBg}`}
                          >
                            <span className="shrink-0">{meta.icon}</span>
                            <span className="truncate">{cell.subject}</span>
                          </span>
                          <span className="text-2xs text-slate-500 font-semibold shrink-0">
                            {cell.durationMinutes} dk
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {onStartStudyLesson && !cell.completed && (
                            <button
                              onClick={() => {
                                soundFX.playPop();
                                onStartStudyLesson(cell.subject);
                              }}
                              className="px-2 py-1 rounded-lg bg-purple-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                            >
                              <Play className="w-2.5 h-2.5 fill-current" />
                              <span>Çalış</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleToggleCell(cell.id)}
                            className={`p-1 rounded cursor-pointer shrink-0 ${
                              cell.completed ? 'text-emerald-600' : 'text-slate-400'
                            }`}
                          >
                            {cell.completed ? (
                              <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => handleDeleteCell(cell.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {dayCells.length === 0 && (
                    <div className="py-6 text-center text-slate-400 text-xs border border-dashed border-purple-200 rounded-xl">
                      Bu güne henüz ders eklenmedi.
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SADECE DERS EKLE MODALI (SADE VE SINIRLARA UYGUN)        */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl max-w-md w-full border border-purple-200 shadow-2xl overflow-hidden flex flex-col box-border animate-in zoom-in-95 duration-200">
            {/* Modal Başlığı */}
            <div className="p-4 bg-purple-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg shrink-0">📚</span>
                <h3
                  style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                  className="font-bold text-base text-white truncate"
                >
                  Hücreye Ders Ekle
                </h3>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Formu (Gün, Ders, Süre) */}
            <form onSubmit={handleAddCell} className="p-4 sm:p-5 space-y-4 overflow-y-auto">
              {/* Gün Seçimi */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">📅 Gün</label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
                  {DAYS.map((d) => (
                    <button
                      type="button"
                      key={d.id}
                      onClick={() => setTargetDay(d.id)}
                      className={`p-1.5 rounded-xl text-center border font-bold text-xs transition-all cursor-pointer ${
                        targetDay === d.id
                          ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                          : 'bg-purple-50/60 text-purple-900 border-purple-200 hover:bg-purple-100'
                      }`}
                    >
                      <span className="block text-2xs truncate">{d.short}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ders Seçimi */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">📖 Ders</label>
                <div className="grid grid-cols-2 gap-2">
                  {SUBJECT_OPTIONS.map((sub) => {
                    const isSelected = selectedSubject === sub.name;
                    return (
                      <button
                        type="button"
                        key={sub.id}
                        onClick={() => setSelectedSubject(sub.name)}
                        className={`p-2 rounded-xl border text-left font-bold text-xs transition-all cursor-pointer flex items-center gap-2 overflow-hidden ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                            : `${sub.color} hover:border-purple-300`
                        }`}
                      >
                        <span className="text-base shrink-0">{sub.icon}</span>
                        <span className="truncate">{sub.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Süre Seçimi */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-600" />
                  <span>Süre</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[25, 30, 40, 60].map((mins) => (
                    <button
                      type="button"
                      key={mins}
                      onClick={() => setDurationMinutes(mins)}
                      className={`py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
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

              {/* Butonlar */}
              <div className="pt-2 border-t border-purple-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Ders Ekle</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
