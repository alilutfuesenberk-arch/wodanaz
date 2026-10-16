// Client-side image compression and resizing utility
// Ensures photos from 48MP smartphone cameras are perfectly sized (< 1MB) for Gemini Vision

export async function processAndCompressImage(source: File | string): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      try {
        const MAX_WIDTH = 1600;
        const MAX_HEIGHT = 1600;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          // fallback to original
          if (typeof source === 'string') {
            resolve({ base64: source, mimeType: 'image/jpeg' });
          } else {
            const reader = new FileReader();
            reader.onload = () => resolve({ base64: reader.result as string, mimeType: 'image/jpeg' });
            reader.onerror = reject;
            reader.readAsDataURL(source);
          }
          return;
        }

        // Fill white background for transparent PNGs
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to high quality JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve({ base64: compressedDataUrl, mimeType: 'image/jpeg' });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (err) => {
      reject(new Error('Görsel yüklenemedi. Lütfen geçerli bir resim dosyası seçin.'));
    };

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          img.src = reader.result;
        } else {
          reject(new Error('Dosya okunamadı.'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(source);
    }
  });
}
