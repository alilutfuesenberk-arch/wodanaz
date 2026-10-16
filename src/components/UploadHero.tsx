import React, { useRef, useState } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  Volume2,
  PenTool,
  ArrowRight,
  GraduationCap,
  Target,
  Gamepad2,
  Award,
} from 'lucide-react';
import { HomeworkAnalysisResult } from '../types';
import { soundFX } from '../utils/soundEffects';
import { processAndCompressImage } from '../utils/imageUtils';

interface UploadHeroProps {
  onStartCamera: () => void;
  onFileSelect: (base64Image: string) => void;
  onSelectSample: (sample: HomeworkAnalysisResult) => void;
  onOpenAchievements?: () => void;
  onOpenVocabularyHero?: () => void;
  onOpenWrittenExam?: () => void;
  onOpenGameBank?: () => void;
  onOpenStudyRoom?: () => void;
  selectedGrade: string;
  setSelectedGrade: (grade: string) => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
}

const GRADES = [
  'Tüm Ortaokul (Otomatik 5-8. Sınıf)',
  '5. Sınıf',
  '6. Sınıf',
  '7. Sınıf',
  '8. Sınıf / LGS Hazırlık',
];

const SUBJECTS = [
  'Tüm Dersler (Otomatik Tanı)',
  'Matematik',
  'Fen Bilimleri',
  'Türkçe',
  'Sosyal Bilgiler / İnkılap',
  'İngilizce',
  'Din Kültürü',
];

export const UploadHero: React.FC<UploadHeroProps> = ({
  onStartCamera,
  onFileSelect,
  onOpenAchievements,
  onOpenVocabularyHero,
  onOpenWrittenExam,
  onOpenGameBank,
  onOpenStudyRoom,
  selectedGrade,
  setSelectedGrade,
  selectedSubject,
  setSelectedSubject,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundFX.playPop();
    try {
      const { base64 } = await processAndCompressImage(file);
      onFileSelect(base64);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onFileSelect(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    soundFX.playPop();
    try {
      const { base64 } = await processAndCompressImage(file);
      onFileSelect(base64);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onFileSelect(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 py-2 sm:py-4">
      {/* Hero Welcome Header - Sade & Net */}
      <div className="text-center max-w-3xl mx-auto space-y-2.5 px-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-2xs font-extrabold border border-purple-200">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          MEB 5, 6, 7, 8. Sınıf & LGS Müfredatı
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Ödev ve Denemeni Yükle,{' '}
          <span className="bg-linear-to-r from-purple-700 via-violet-600 to-orange-500 bg-clip-text text-transparent">
            Adım Adım Öğren
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-normal">
          Fotoğrafını çek veya yükle; sesli anlatım ve alternatif çözümlerle eksiklerini anında kapat.
        </p>
      </div>

      {/* Grade and Subject Selector */}
      <div className="max-w-xl mx-auto bg-white p-3 sm:p-3.5 rounded-2xl border border-purple-200/80 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-2xs font-bold text-slate-500 mb-1 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-orange-500" />
              Sınıf Düzeyi
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-2xs font-bold text-slate-500 mb-1">
              Ders Branşı
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Action Upload Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`max-w-xl mx-auto rounded-3xl p-6 sm:p-8 border-2 border-dashed transition-all text-center space-y-4 ${
          isDragging
            ? 'border-orange-500 bg-orange-50/50 scale-[1.01]'
            : 'border-purple-200 bg-white shadow-2xs hover:border-orange-300'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-tr from-purple-600 via-violet-500 to-orange-400 text-white flex items-center justify-center shadow-md shadow-purple-500/15">
          <Camera className="w-8 h-8" />
        </div>

        <div className="space-y-1 max-w-sm mx-auto">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Ödev veya Test Sayfası Yükle
          </h3>
          <p className="text-2xs sm:text-xs text-slate-500">
            Fotoğraf çek veya galeriden bir ödev görseli seç.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
          <button
            onClick={() => {
              soundFX.playPop();
              onStartCamera();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-linear-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-extrabold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            Kamera ile Çek
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto px-5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold rounded-xl text-xs border border-purple-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-purple-600" />
            Galeriden Seç
          </button>
        </div>

        <div className="text-3xs text-slate-400 pt-1">
          JPEG, PNG, WEBP · Çoktan Seçmeli ve Klasik Sorular
        </div>
      </div>

      {/* 3 Quick Features (Minimal) */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-purple-200/70 shadow-2xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900">Doğruluk Kontrolü</h4>
            <p className="text-2xs text-slate-500">Doğru & yanlışlarını anında gör</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-purple-200/70 shadow-2xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900">Sesli Rehber</h4>
            <p className="text-2xs text-slate-500">Adım adım sesli öğretmen anlatımı</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-purple-200/70 shadow-2xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
            <PenTool className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900">Pekiştirme Sorusu</h4>
            <p className="text-2xs text-slate-500">Sıra Sende mini sorularıyla öğren</p>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards - Minimal & Clean */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {onOpenStudyRoom && (
          <div
            onClick={() => {
              soundFX.playPop();
              onOpenStudyRoom();
            }}
            className="p-3.5 bg-white hover:bg-purple-50/50 rounded-2xl border border-purple-200 shadow-2xs transition-all cursor-pointer group flex flex-col justify-between space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🎯</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-slate-900">Çalışma Odası</h5>
              <p className="text-2xs text-slate-500">Odaklan & 1:1 oyun kazan</p>
            </div>
          </div>
        )}

        {onOpenGameBank && (
          <div
            onClick={() => {
              soundFX.playPop();
              onOpenGameBank();
            }}
            className="p-3.5 bg-white hover:bg-orange-50/50 rounded-2xl border border-orange-200 shadow-2xs transition-all cursor-pointer group flex flex-col justify-between space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🎮</span>
              <ArrowRight className="w-3.5 h-3.5 text-orange-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-slate-900">Oyun Kumbarası</h5>
              <p className="text-2xs text-slate-500">Puan ve süreni yönet</p>
            </div>
          </div>
        )}

        {onOpenWrittenExam && (
          <div
            onClick={() => {
              soundFX.playPop();
              onOpenWrittenExam();
            }}
            className="p-3.5 bg-white hover:bg-purple-50/50 rounded-2xl border border-purple-200 shadow-2xs transition-all cursor-pointer group flex flex-col justify-between space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">📝</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-slate-900">Yazılı Arenası</h5>
              <p className="text-2xs text-slate-500">MEB açık uçlu sınavları</p>
            </div>
          </div>
        )}

        {onOpenAchievements && (
          <div
            onClick={() => {
              soundFX.playPop();
              onOpenAchievements();
            }}
            className="p-3.5 bg-white hover:bg-purple-50/50 rounded-2xl border border-purple-200 shadow-2xs transition-all cursor-pointer group flex flex-col justify-between space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🏆</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-slate-900">Başarı Rozetleri</h5>
              <p className="text-2xs text-slate-500">Yıldızlar ve unvanlar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
