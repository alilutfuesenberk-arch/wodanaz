import React, { useRef, useState, useEffect } from 'react';
import { Eraser, RotateCcw, PenTool, Sparkles, X } from 'lucide-react';

interface ScratchpadProps {
  onClose: () => void;
  title?: string;
}

export const Scratchpad: React.FC<ScratchpadProps> = ({ onClose, title = 'Karalama Defterim & İşlem Alanı' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#2563eb');
  const [lineWidth, setLineWidth] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [boardType, setBoardType] = useState<'paper' | 'blackboard'>('paper');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set real size based on client display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Initial fill
    ctx.fillStyle = boardType === 'blackboard' ? '#1e293b' : '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, [boardType]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = isEraser ? lineWidth * 3 : lineWidth;
    ctx.strokeStyle = isEraser ? (boardType === 'blackboard' ? '#1e293b' : '#ffffff') : color;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = boardType === 'blackboard' ? '#1e293b' : '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-amber-200/60">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-amber-500 text-white">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5" />
            <h3 className="font-bold text-base tracking-tight">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-amber-600 transition-colors text-white"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-amber-50/80 border-b border-amber-200/50 text-sm">
          {/* Colors */}
          <div className="flex items-center gap-1.5">
            {[
              { label: 'Mavi', hex: '#2563eb' },
              { label: 'Kırmızı', hex: '#dc2626' },
              { label: 'Yeşil', hex: '#16a34a' },
              { label: 'Mor', hex: '#9333ea' },
              { label: 'Siyah', hex: '#1e293b' },
              { label: 'Tebeşir Sarısı', hex: '#fbbf24' },
            ].map((c) => (
              <button
                key={c.hex}
                onClick={() => {
                  setColor(c.hex);
                  setIsEraser(false);
                }}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  !isEraser && color === c.hex ? 'scale-125 border-slate-900 shadow-sm' : 'border-white hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.label}
              />
            ))}
          </div>

          {/* Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEraser(!isEraser)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${
                isEraser ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-amber-100 border border-slate-200'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              Silgi
            </button>

            <button
              onClick={clearCanvas}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs bg-white text-slate-700 hover:bg-amber-100 border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Temizle
            </button>

            {/* Board Background Switch */}
            <button
              onClick={() => setBoardType(boardType === 'paper' ? 'blackboard' : 'paper')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs bg-slate-800 text-amber-200 hover:bg-slate-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {boardType === 'paper' ? 'Kara Tahta' : 'Çizgili Kağıt'}
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="relative w-full h-80 sm:h-96 touch-none bg-slate-100">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full cursor-crosshair"
          />
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>İpucu: Sorunun işlemlerini veya düşüncelerini buraya serbestçe yazabilirsin!</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg text-xs transition-colors"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
