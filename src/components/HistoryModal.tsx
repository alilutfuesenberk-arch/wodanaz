import React from 'react';
import { X, Award, Calendar, BookOpen, CheckCircle2, ChevronRight, Trash2 } from 'lucide-react';
import { HomeworkAnalysisResult } from '../types';
import { soundFX } from '../utils/soundEffects';

interface HistoryModalProps {
  history: HomeworkAnalysisResult[];
  onSelectHomework: (item: HomeworkAnalysisResult) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  history,
  onSelectHomework,
  onClearHistory,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-amber-200">
        {/* Header */}
        <div className="px-6 py-4 bg-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-200" />
            <div>
              <h3 className="font-bold text-lg leading-tight">Geçmiş Karnelerim ve Ödevlerim</h3>
              <p className="text-xs text-amber-100">Daha önce çalıştığın ödevler ve başarıların</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-amber-600 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <BookOpen className="w-12 h-12 mx-auto text-amber-300" />
              <p className="font-medium text-slate-600">Henüz kayıtlı bir ödev karnesi yok.</p>
              <p className="text-xs">Fotoğraf çekip ilk ödevini çözdürdüğünde burada listelenecek!</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  soundFX.playPop();
                  onSelectHomework(item);
                  onClose();
                }}
                className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/40 transition-all cursor-pointer shadow-2xs group flex items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                      {item.subject}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 group-hover:text-amber-700 transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="text-emerald-600 font-bold">
                      {item.scoreSummary.correctCount} Doğru
                    </span>
                    <span className="text-rose-600 font-bold">
                      {item.scoreSummary.incorrectCount} Yanlış
                    </span>
                    <span>%{item.scoreSummary.estimatedPercentage} Başarı</span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                if (window.confirm('Tüm geçmişi silmek istediğine emin misin?')) {
                  onClearHistory();
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Geçmişi Temizle
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Kapat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
