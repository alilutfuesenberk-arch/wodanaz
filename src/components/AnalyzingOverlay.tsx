import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, BookOpen, Brain, CheckCircle } from 'lucide-react';

const MESSAGES = [
  '📸 Ödev veya test kağıdın taranıyor...',
  '🔍 Soruların metinleri ve şıkları okunuyor...',
  '✍️ İşaretlediğin cevaplar tespit ediliyor...',
  '⚖️ Gerçek doğru sonuçlar kontrol ediliyor...',
  '🦉 Öğretmeninin ders tadında açıklamaları hazırlanıyor...',
  '🎯 Senin için pekiştirme soruları oluşturuluyor...',
];

export const AnalyzingOverlay: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl text-center space-y-6 border border-amber-300">
        {/* Animated Icon */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-100 animate-ping opacity-60"></div>
          <div className="relative w-20 h-20 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30">
            🦉
          </div>
        </div>

        {/* Status message */}
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Ödevin İnceleniyor...
          </h3>
          <p className="text-sm font-semibold text-amber-600 transition-all duration-300 min-h-[44px] flex items-center justify-center">
            {MESSAGES[msgIndex]}
          </p>
        </div>

        {/* Progress bar pulse */}
        <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full animate-pulse w-3/4 mx-auto"></div>
        </div>

        {/* Educational encouragement */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/60 text-xs text-amber-900">
          <span className="font-bold block mb-0.5">Öğretmeninin Hatırlatması:</span>
          "Hata yapmak öğrenmenin en doğal ve en güzel parçasıdır! Birazdan hepsini kolayca anlayacaksın."
        </div>
      </div>
    </div>
  );
};
