import { HomeworkAnalysisResult } from '../types';

// Helper to create an SVG paper sheet data URL for 5th grade worksheets
function createSampleWorksheetSVG(
  title: string,
  grade: string,
  subject: string,
  questions: { q: string; opts: string[]; studentChoice: string; correctChoice: string }[]
): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1050" width="800" height="1050" style="background:#fffaf0; font-family:'Segoe UI',sans-serif;">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1e6d0" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="800" height="1050" fill="#fffaf0"/>
      <rect width="800" height="1050" fill="url(#grid)" />
      
      <!-- Red Margin Line -->
      <line x1="70" y1="0" x2="70" y2="1050" stroke="#fca5a5" stroke-width="2" stroke-dasharray="4 2"/>
      
      <!-- School Header Box -->
      <rect x="90" y="30" width="670" height="110" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <text x="425" y="65" text-anchor="middle" font-size="20" font-weight="bold" fill="#1e293b">MEB 5. SINIF ÇALIŞMA YAPRAĞI</text>
      <text x="425" y="90" text-anchor="middle" font-size="16" font-weight="600" fill="#2563eb">${grade} - ${subject}: ${title}</text>
      
      <line x1="110" y1="105" x2="740" y2="105" stroke="#e2e8f0" stroke-width="1"/>
      <text x="110" y="125" font-size="13" fill="#64748b">Öğrenci: <tspan font-weight="bold" fill="#0f172a">Eren Deniz Yılmaz</tspan></text>
      <text x="350" y="125" font-size="13" fill="#64748b">Sınıf: <tspan font-weight="bold" fill="#0f172a">5. Sınıf</tspan></text>
      <text x="560" y="125" font-size="13" fill="#64748b">Dönem: <tspan font-weight="bold" fill="#0f172a">Güz Dönemi</tspan></text>

      <!-- Questions -->
      ${questions
        .map((item, index) => {
          const yBase = 175 + index * 170;
          return `
          <g transform="translate(90, ${yBase})">
            <!-- Question Box -->
            <rect x="0" y="0" width="670" height="150" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
            <circle cx="28" cy="30" r="16" fill="#7c3aed" />
            <text x="28" y="36" text-anchor="middle" font-size="14" font-weight="bold" fill="#ffffff">${index + 1}</text>
            
            <text x="55" y="34" font-size="14" font-weight="600" fill="#1e293b">${item.q}</text>

            <!-- Options -->
            ${item.opts
              .map((opt, optIdx) => {
                const optY = 65 + optIdx * 20;
                const letter = String.fromCharCode(65 + optIdx);
                const isSelected = item.studentChoice === letter;
                return `
                <g transform="translate(55, ${optY})">
                  ${
                    isSelected
                      ? `
                    <ellipse cx="-12" cy="-4" rx="13" ry="11" fill="none" stroke="#7c3aed" stroke-width="2.5" stroke-dasharray="40" stroke-dashoffset="2" transform="rotate(-6 -12 -4)"/>
                  `
                      : ''
                  }
                  <text x="-12" y="0" text-anchor="middle" font-size="13" font-weight="bold" fill="${
                    isSelected ? '#6b21a8' : '#64748b'
                  }">${letter})</text>
                  <text x="5" y="0" font-size="13" fill="#334155">${opt}</text>
                </g>
              `;
              })
              .join('')}
          </g>
        `;
        })
        .join('')}

      <!-- Teacher Note Box at bottom -->
      <rect x="90" y="900" width="670" height="90" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5"/>
      <text x="110" y="930" font-size="14" font-weight="bold" fill="#1e40af">5. Sınıf Rehber Öğretmen Değerlendirmesi:</text>
      <text x="110" y="955" font-size="13" fill="#3b82f6">Tüm adımları dikkatle kontrol edelim ve alternatif çözüm yollarını mutlaka inceleyelim.</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_HOMEWORKS: HomeworkAnalysisResult[] = [
  {
    id: 'sample-5-math-fractions',
    date: '14 Ekim 2026',
    title: '5. Sınıf Matematik - Doğal Sayılar ve Kesir Problemleri',
    subject: 'Matematik',
    gradeLevel: '5. Sınıf',
    overallFeedback:
      'Tebrikler canım 5. sınıf öğrencim! 1. soruda milyonlu doğal sayıların basamak ve bölüklerini kusursuz belirledin. 2. sorudaki kesir probleminde ise payda eşitleme adımında acele etmişsin. Aşağıdaki adım adım çözümü ve görsel model yolunu inceleyerek eksiğini hemen tamamlayabilirsin!',
    imageUrl: createSampleWorksheetSVG(
      'Doğal Sayılar ve Kesirler',
      '5. Sınıf',
      'Matematik',
      [
        {
          q: '72 400 085 sayısının milyonlar bölüğündeki sayı ile birler basamağındaki rakamın toplamı kaçtır?',
          opts: ['77', '72', '80', '95'],
          studentChoice: 'A',
          correctChoice: 'A',
        },
        {
          q: 'Ali bir hikâye kitabının 1. gün 2/7\'sini, 2. gün 3/14\'ünü okumuştur. Ali kitabın toplam kaçta kaçını okumuştur?',
          opts: ['5/21', '7/14', '5/14', '1/7'],
          studentChoice: 'C', // Student mistake
          correctChoice: 'B',
        },
      ]
    ),
    scoreSummary: {
      totalQuestions: 2,
      correctCount: 1,
      incorrectCount: 1,
      emptyCount: 0,
      estimatedPercentage: 50,
    },
    questions: [
      {
        questionNumber: 1,
        questionText: '72 400 085 sayısının milyonlar bölüğündeki sayı ile birler basamağındaki rakamın toplamı kaçtır?',
        options: ['A) 77', 'B) 72', 'C) 80', 'D) 95'],
        studentAnswer: 'A) 77',
        correctAnswer: 'A) 77',
        isCorrect: true,
        topic: 'Doğal Sayılarda Basamak ve Bölükler',
        teacherLesson:
          'Harikasın! 72 400 085 sayısını incelediğimizde: Milyonlar bölüğündeki sayı 72’dir. Birler basamağındaki rakam ise 5’tir. 72 + 5 = 77 sonucuna doğru ulaştın!',
        stepByStepSolution: [
          '1. Adım: Sayıyı bölüklerine ayıralım: [72] milyonlar bölüğü, [400] binler bölüğü, [085] birler bölüğü.',
          '2. Adım: Milyonlar bölüğündeki sayı 72’dir.',
          '3. Adım: Birler basamağındaki rakam en sağdaki 5’tir.',
          '4. Adım: 72 + 5 = 77.',
        ],
        alternativeSolutions: [
          {
            methodTitle: '1. Yol: Bölük Tablosu Çizme Yöntemi',
            explanation: 'Basamak tablosuna sayıları yazarak bölükleri doğrudan okuma.',
            steps: [
              'Milyonlar: 72',
              'Binler: 400',
              'Birler: 85 (Birler basamağı: 5)',
              'Toplam: 72 + 5 = 77',
            ],
          },
        ],
        goldenRule: '9 basamağa kadar olan doğal sayılarda sağdan sola üçerli gruplara BÖLÜK denir!',
      },
      {
        questionNumber: 2,
        questionText: 'Ali bir hikâye kitabının 1. gün 2/7\'sini, 2. gün 3/14\'ünü okumuştur. Ali kitabın toplam kaçta kaçını okumuştur?',
        options: ['A) 5/21', 'B) 7/14', 'C) 5/14', 'D) 1/7'],
        studentAnswer: 'C) 5/14',
        correctAnswer: 'B) 7/14',
        isCorrect: false,
        topic: 'Kesirlerle Toplama İşlemi',
        teacherLesson:
          'Dikkat canım öğrencim! Kesirlerde toplama yaparken paydaları toplamayız ve paydaları eşit olmayan kesirleri doğrudan toplayamayız! Önce 2/7 kesrini 2 ile genişletip paydasını 14 yapmalısın: (2x2)/(7x2) = 4/14. Ardından 4/14 + 3/14 = 7/14 (yani kitabın yarısı) olur.',
        stepByStepSolution: [
          '1. Adım: Paydalar 7 ve 14’tür. 14, 7’nin 2 katıdır. Bu yüzden 2/7 kesrini 2 ile genişletiriz.',
          '2. Adım: (2 x 2) / (7 x 2) = 4/14.',
          '3. Adım: Şimdi ortak paydada payları toplarız: 4/14 + 3/14 = 7/14.',
          '4. Adım: 7/14 sadeleşirse 1/2 (yarısı) eder. Şıklarda 7/14 (B seçeneği) doğrudur.',
        ],
        alternativeSolutions: [
          {
            methodTitle: '1. Yol: Model Çizerek Gösterme (Şekil Yolu)',
            explanation: '14 eşit parçalı bir dikdörtgen çizerek 1. ve 2. gün okunan kısımları boyama.',
            steps: [
              '14 parçalı bir şekil çiz.',
              '1. gün için 2/7 = 4 parça boya.',
              '2. gün için 3/14 = 3 parça daha boya.',
              'Toplam boyalı parça = 4 + 3 = 7 parça. Kesir = 7/14!',
            ],
          },
        ],
        mistakeReason:
          'Paydaları eşitlemeden payları topladın (2 + 3 = 5 dedin) fakat 2/7’yi genişletmeyi unuttun.',
        goldenRule:
          'Paydaları eşit olmayan kesirlerle toplama veya çıkarma yapılmaz; önce GENİŞLETME yapılarak paydalar eşitlenir!',
        practiceQuestion: {
          question: 'Bir pastanın 1/3\'ünü Ayşe, 2/9\'unu Fatma yemiştir. İkisi toplam pastanın kaçta kaçını yemiştir?',
          options: ['A) 3/12', 'B) 5/9', 'C) 3/9', 'D) 4/9'],
          correctAnswer: 'B) 5/9',
          explanation: '1/3 kesrini 3 ile genişletirsek 3/9 olur. 3/9 + 2/9 = 5/9.',
        },
      },
    ],
  },
  {
    id: 'sample-5-science-moon',
    date: '14 Ekim 2026',
    title: '5. Sınıf Fen Bilimleri - Güneş, Dünya ve Ay Ünitesi',
    subject: 'Fen Bilimleri',
    gradeLevel: '5. Sınıf',
    overallFeedback:
      '5. sınıf Fen Bilimleri dersinde Ay’ın evrelerini ve yüzey özelliklerini harika pekiştirdin!',
    imageUrl: createSampleWorksheetSVG(
      'Güneş, Dünya ve Ay',
      '5. Sınıf',
      'Fen Bilimleri',
      [
        {
          q: 'Ay’ın ana evreleri sırasıyla hangi seçenekte doğru verilmiştir?',
          opts: [
            'Yeni Ay - İlk Dördün - Dolunay - Son Dördün',
            'Dolunay - Yeni Ay - Son Dördün - İlk Dördün',
            'İlk Dördün - Dolunay - Yeni Ay - Hilal',
            'Yeni Ay - Dolunay - İlk Dördün - Şişkin Ay',
          ],
          studentChoice: 'A',
          correctChoice: 'A',
        },
      ]
    ),
    scoreSummary: {
      totalQuestions: 1,
      correctCount: 1,
      incorrectCount: 0,
      emptyCount: 0,
      estimatedPercentage: 100,
    },
    questions: [
      {
        questionNumber: 1,
        questionText: 'Ay’ın ana evreleri sırasıyla hangi seçenekte doğru verilmiştir?',
        options: [
          'A) Yeni Ay - İlk Dördün - Dolunay - Son Dördün',
          'B) Dolunay - Yeni Ay - Son Dördün - İlk Dördün',
          'C) İlk Dördün - Dolunay - Yeni Ay - Hilal',
          'D) Yeni Ay - Dolunay - İlk Dördün - Şişkin Ay',
        ],
        studentAnswer: 'A) Yeni Ay - İlk Dördün - Dolunay - Son Dördün',
        correctAnswer: 'A) Yeni Ay - İlk Dördün - Dolunay - Son Dördün',
        isCorrect: true,
        topic: 'Ay’ın Evreleri',
        teacherLesson:
          'Kusursuz cevap! Ay’ın 4 ana evresi vardır: Yeni Ay ile başlar, yaklaşık 1 hafta sonra İlk Dördün (D harfi), 1 hafta sonra Dolunay, 1 hafta sonra ise Son Dördün (Ters D harfi) evresi görülür.',
        stepByStepSolution: [
          '1. Yeni Ay: Ay, Güneş ile Dünya arasındadır; karanlık görünür.',
          '2. İlk Dördün: Sağ yarısı aydınlık görünür (D harfi gibi).',
          '3. Dolunay: Dünya’ya bakan yüzü tamamen aydınlıktır.',
          '4. Son Dördün: Sol yarısı aydınlık görünür (Ters D harfi gibi).',
        ],
        goldenRule: 'Ay’ın iki ana evresi arasındaki süre yaklaşık 1 HAFTADIR (7 gündür)!',
      },
    ],
  },
];
