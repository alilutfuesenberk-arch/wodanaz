// Audio playback utility supporting Gemini TTS (audio/wav base64) with SpeechSynthesis fallback

class TeacherVoicePlayer {
  private currentAudio: HTMLAudioElement | null = null;
  private isBrowserSpeaking = false;

  async speak(text: string, onStart?: () => void, onEnd?: () => void, onError?: () => void): Promise<void> {
    this.stop();

    try {
      if (onStart) onStart();

      // Try server-side Gemini 3.8 Flash Lite TTS first
      const res = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audioUrl = `data:audio/wav;base64,${data.audioBase64}`;
          const audio = new Audio(audioUrl);
          audio.playbackRate = 1.10; // 0.10x hizlandirilmis canli ses
          this.currentAudio = audio;

          audio.onended = () => {
            this.currentAudio = null;
            if (onEnd) onEnd();
          };

          audio.onerror = () => {
            this.currentAudio = null;
            this.fallbackToBrowserSpeech(text, onStart, onEnd, onError);
          };

          await audio.play();
          return;
        }
      }
    } catch {
      // Network or API failure, fall back to browser speech
    }

    // Fallback to browser SpeechSynthesis
    this.fallbackToBrowserSpeech(text, onStart, onEnd, onError);
  }

  private fallbackToBrowserSpeech(text: string, onStart?: () => void, onEnd?: () => void, onError?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onError) onError();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 1.05; // 0.10x artırılmış sevecen ve akıcı öğretmen temposu
      utterance.pitch = 1.05; // warm friendly tone

      // Try to find a Turkish voice if available
      const voices = window.speechSynthesis.getVoices();
      const trVoice = voices.find(v => v.lang.startsWith('tr'));
      if (trVoice) {
        utterance.voice = trVoice;
      }

      utterance.onstart = () => {
        this.isBrowserSpeaking = true;
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.isBrowserSpeaking = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.isBrowserSpeaking = false;
        if (onError) onError();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onError) onError();
    }
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isBrowserSpeaking = false;
    }
  }

  isPlaying(): boolean {
    return (this.currentAudio !== null && !this.currentAudio.paused) || this.isBrowserSpeaking;
  }
}

export const teacherVoice = new TeacherVoicePlayer();
