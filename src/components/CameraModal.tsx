import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, Check, Image as ImageIcon, Sparkles } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';
import { processAndCompressImage } from '../utils/imageUtils';

interface CameraModalProps {
  onCapture: (base64Image: string) => void;
  onClose: () => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isShutterFlashing, setIsShutterFlashing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const startCamera = async (mode: 'environment' | 'user') => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraError('Kameraya erişilemedi. Lütfen kamera izni verin veya fotoğraf yükleyin.');
    }
  };

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const switchCamera = () => {
    soundFX.playPop();
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    soundFX.playShutter();
    setIsShutterFlashing(true);
    setTimeout(() => setIsShutterFlashing(false), 200);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundFX.playPop();
    try {
      const { base64 } = await processAndCompressImage(file);
      setCapturedImage(base64);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCapturedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmPhoto = async () => {
    if (!capturedImage) return;
    soundFX.playCelebration();
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    try {
      const { base64 } = await processAndCompressImage(capturedImage);
      onCapture(base64);
    } catch {
      onCapture(capturedImage);
    }
  };

  const retakePhoto = () => {
    soundFX.playPop();
    setCapturedImage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="px-5 py-3.5 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm sm:text-base">Ödev / Test Fotoğrafını Çek</h3>
          </div>
          <button
            onClick={() => {
              if (stream) stream.getTracks().forEach((t) => t.stop());
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[340px] sm:min-h-[440px] overflow-hidden">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Çekilen ödev"
              className="w-full h-full object-contain max-h-[60vh]"
            />
          ) : cameraError ? (
            <div className="text-center p-6 text-slate-300 max-w-md space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-amber-400">
                <ImageIcon className="w-8 h-8" />
              </div>
              <p className="text-sm">{cameraError}</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition-colors shadow-md inline-flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                Galeriden veya Dosyalardan Seç
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Target Framing Guides */}
              <div className="absolute inset-8 border-2 border-amber-400/60 rounded-2xl pointer-events-none flex flex-col justify-between p-4">
                <div className="flex justify-between">
                  <span className="w-6 h-6 border-t-4 border-l-4 border-amber-400 rounded-tl-lg"></span>
                  <span className="w-6 h-6 border-t-4 border-r-4 border-amber-400 rounded-tr-lg"></span>
                </div>
                <div className="text-center bg-black/60 backdrop-blur-xs text-amber-200 text-xs py-1 px-3 rounded-full mx-auto self-center">
                  📄 Sayfayı çerçevenin içine hizala ve düz tut
                </div>
                <div className="flex justify-between">
                  <span className="w-6 h-6 border-b-4 border-l-4 border-amber-400 rounded-bl-lg"></span>
                  <span className="w-6 h-6 border-b-4 border-r-4 border-amber-400 rounded-br-lg"></span>
                </div>
              </div>

              {/* Shutter flash effect */}
              {isShutterFlashing && (
                <div className="absolute inset-0 bg-white opacity-80 pointer-events-none animate-out fade-out duration-200" />
              )}
            </>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          {capturedImage ? (
            <div className="w-full flex items-center justify-between gap-4">
              <button
                onClick={retakePhoto}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Yeniden Çek
              </button>

              <button
                onClick={confirmPhoto}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-105"
              >
                <Check className="w-4 h-4" />
                Ödevi İncelet
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-amber-400" />
                Galeriden Seç
              </button>

              {/* Big Shutter Button */}
              <button
                onClick={takePhoto}
                className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 p-1 flex items-center justify-center shadow-lg transition-transform active:scale-95"
                title="Fotoğrafı Çek"
              >
                <div className="w-full h-full rounded-full border-4 border-slate-900 bg-white"></div>
              </button>

              <button
                onClick={switchCamera}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                title="Kamerayı Çevir"
              >
                <RefreshCw className="w-4 h-4" />
                Kamerayı Değiştir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
