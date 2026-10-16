import { HomeworkAnalysisResult } from '../types';

// Helper to create an SVG paper sheet data URL for middle school worksheets
function createSampleWorksheetSVG(
  title: string,
  grade: string,
  subject: string,
  questions: { q: string; opts: string[]; studentChoice: string; correctChoice: string }[]
): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1050" width="800" height="1050" style="background:#fffaf0; font-family:'Segoe UI',sans-serif;">
      <!-- Grid line background for authentic middle school notebook feel -->
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
      <text x="425" y="65" text-anchor="middle" font-size="20" font-weight="bold" fill="#1e293b">MEB ATATÜRK ORTAOKULU ÇALIŞMA YAPRAĞI</text>
      <text x="425" y="90" text-anchor="middle" font-size="16" font-weight="600" fill="#2563eb">${grade} - ${subject}: ${title}</text>
      
      <line x1="110" y1="105" x2="740" y2="105" stroke="#e2e8f0" stroke-width="1"/>
      <text x="110" y="125" font-size="13" fill="#64748b">Adı Soyadı: <tspan font-weight="bold" fill="#0f172a">Eren Deniz Yılmaz</tspan></text>
      <text x="350" y="125" font-size="13" fill="#64748b">Sınıf / No: <tspan font-weight="bold" fill="#0f172a">${grade} / 418</tspan></text>
      <text x="560" y="125" font-size="13" fill="#64748b">Tarih: <tspan font-weight="bold" fill="#0f172a">Güz Dönemi</tspan></text>

      <!-- Questions -->
      ${questions
        .map((item, index) => {
          const yBase = 175 + index * 170;
          return `
          <g transform="translate(90, ${yBase})">
            <!-- Question Box -->
            <rect x="0" y="0" width="670" height="150" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
            <circle cx="28" cy="30" r="16" fill="#3b82f6" />
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
                    <!-- Hand-drawn pencil circle over student's answer -->
                    <ellipse cx="-12" cy="-4" rx="13" ry="11" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-dasharray="40" stroke-dashoffset="2" transform="rotate(-6 -12 -4)"/>
                  `
                      : ''
                  }
                  <text x="-12" y="0" text-anchor="middle" font-size="13" font-weight="bold" fill="${
                    isSelected ? '#1d4ed8' : '#64748b'
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
      <text x="110" y="930" font-size="14" font-weight="bold" fill="#1e40af">Rehber Öğretmen Değerlendirmesi:</text>
      <text x="110" y="955" font-size="13" fill="#3b82f6">Tüm adımları dikkatle kontrol edelim ve alternatif çözüm yollarını mutlaka inceleyelim.</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_HOMEWORKS: HomeworkAnalysisResult[] = [
  {
    id: 'sample-7-math-rational',
    date: '13 Ekim 2026',
    title: '7. Sınıf Matematik - Rasyonel Sayılarla İşlemler ve Problem Çözümü',
    subject: 'Matematik',
    gradeLevel: '7. Sınıf',
    overallFeedback:
      'Tebrikler canım öğrencim! 1. sorudaki işlem önceliğini ve payda eşitlemeyi kusursuz tamamladın. 2. soruda ise depodaki artış miktarını hesaplarken kesirlerin farkını alma adımında acele etmişsin. Sorunun farklı çözüm yollarını (Cebirsel, Model Çizme ve LGS Pratik Taktik) aşağıdan inceleyebilirsin!',
    imageUrl: createSampleWorksheetSVG(
      'Rasyonel Sayılarla İşlemler',
      '7. Sınıf',
      'Matematik',
      [
        {
          q: '(-2/3) + (5/6) işleminin en sade sonucu kaçtır?',
          opts: ['1/6', '1/3', '7/6', '-1/6'],
          studentChoice: 'A',
          correctChoice: 'A',
        },
        {
          q: 'Bir su deposunun 3/5\'i doludur. Depoya 60 litre su eklendiğinde deponun 3/4\'ü doluyor. Deponun tamamı kaç litredir?',
          opts: ['300 L', '400 L', '450 L', '500 L'],
          studentChoice: 'A', // Mistake!
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
        questionText: '(-2/3) + (5/6) işleminin en sade sonucu aşağıdakilerden hangisidir?',
        options: ['A) 1/6', 'B) 1/3', 'C) 7/6', 'D) -1/6'],
        studentAnswer: 'A) 1/6',
        correctAnswer: 'A) 1/6',
        isCorrect: true,
        topic: 'Rasyonel Sayılarda Toplama',
        teacherLesson:
          'Harikasın! Rasyonel sayılarda toplama yaparken ilk iş paydaları eşitlemektir. (-2/3) kesrini 2 ile genişleterek (-4/6) yaptın ve (-4/6) + (5/6) = 1/6 sonucuna doğru ulaştın.',
        stepByStepSolution: [
          '1. Adım: Paydaları inceleyelim (3 ve 6). Ortak kat 6 olduğu için birinci kesri 2 ile genişletiriz: (-2 x 2) / (3 x 2) = -4/6.',
          '2. Adım: Ortak paydada payları toplarız: (-4 + 5) / 6 = +1/6.',
          '3. Adım: Kesir zaten en sade halde olduğundan doğru cevap 1/6\'dır.',
        ],
        alternativeSolutions: [
          {
            methodTitle: '1. Yol: Ortak Paydada Eşitleme (Klasik Cebirsel Yol)',
            explanation: 'Paydaların en küçük ortak katını (EKOK = 6) bularak doğrudan toplama yapma yöntemi.',
            steps: [
              '(-2/3) kesrini 2 ile genişlet: (-4/6)',
              'Payları topla: (-4 + 5) / 6 = 1/6',
            ],
          },
          {
            methodTitle: '2. Yol: Sayı Doğrusu Çizerek Gösterme (Görsel Yol)',
            explanation: '0 noktasından başlayıp sayı doğrusu üzerinde sola ve sağa hareket ederek sonucu görme yöntemi.',
            steps: [
              '0 noktasından sola doğru 2/3 (yani 4/6 birim) git: -4/6 noktasına ulaşırsın.',
              'Bulunduğun noktadan sağa doğru 5/6 birim ilerle.',
              '+1/6 noktasına ulaşırsın.',
            ],
          },
          {
            methodTitle: '3. Yol: LGS Pratik Çapraz Çarpım Taktiği',
            explanation: 'Hızlıca [(-2 x 6) + (5 x 3)] / (3 x 6) formülüyle tek adımda çözme taktiği.',
            steps: [
              'Pay = (-12 + 15) = 3',
              'Payda = 3 x 6 = 18',
              'Sadeleştir: 3/18 = 1/6',
            ],
          },
        ],
        goldenRule: 'Rasyonel sayılarda toplama ve çıkarmada paydalar eşitlenmeden paylar asla toplanmaz!',
      },
      {
        questionNumber: 2,
        questionText:
          'Bir su deposunun 3/5\'i doludur. Depoya 60 litre su eklendiğinde deponun 3/4\'ü dolmaktadır. Buna göre bu deponun tamamı kaç litre su alır?',
        options: ['A) 300 L', 'B) 400 L', 'C) 450 L', 'D) 500 L'],
        studentAnswer: 'A) 300 L',
        correctAnswer: 'B) 400 L',
        isCorrect: false,
        topic: 'Rasyonel Sayı Problemleri',
        teacherLesson:
          'Sevgili öğrencim, bu soruda çok yaklaştın ama depoya eklenen 60 litrenin tüm deponun hangi kesir parçasına denk geldiğini hesaplarken hata yaptın. Depo 3/5\'ten 3/4\'e çıktığına göre bu iki kesrin farkı 60 litreye eşittir!',
        stepByStepSolution: [
          '1. Adım: Depodaki su miktarının artış kesrini bulalım: (3/4) - (3/5).',
          '2. Adım: Paydaları 20\'de eşitleyelim: (15/20) - (12/20) = 3/20.',
          '3. Adım: Demek ki deponun 3/20\'si 60 litredir.',
          '4. Adım: Deponun 1/20\'si = 60 / 3 = 20 litre olur.',
          '5. Adım: Deponun tamamı (20/20) = 20 x 20 = 400 litredir!',
        ],
        alternativeSolutions: [
          {
            methodTitle: '1. Yol: Denklem Kurarak Çözüm (Cebirsel Yol)',
            explanation: 'Deponun tamamına "x" litre diyelim.',
            steps: [
              'İlk durumdaki su: (3/5)x',
              'Su eklendikten sonra: (3/5)x + 60 = (3/4)x',
              '60 = (3/4)x - (3/5)x = (15x - 12x)/20 = 3x/20',
              '3x = 1200 => x = 400 Litre.',
            ],
          },
          {
            methodTitle: '2. Yol: Model / Kutu Çizme Yolu (Görsel Taktik)',
            explanation: 'Paydalar 5 ve 4 olduğundan deponun tamamını 20 eşit kutudan oluşan bir dikdörtgen çizerek modelleyelim.',
            steps: [
              'Deponun tamamı = 20 eşit kutu.',
              'Başlangıçta 3/5\'i dolu = 20\'nin 3/5\'i = 12 kutu dolu.',
              'Son durumda 3/4\'ü dolu = 20\'nin 3/4\'ü = 15 kutu dolu.',
              'Eklenen su = 15 - 12 = 3 kutu artış sağlamış.',
              '3 kutu = 60 litre ise 1 kutu = 20 litredir.',
              'Tamamı 20 kutu olduğundan = 20 x 20 = 400 Litre!',
            ],
          },
          {
            methodTitle: '3. Yol: LGS Ters İşlem ve Oran-Orantı Taktiği',
            explanation: '3/20\'lik parçası 60 olan sayıyı ters işlemle bulma.',
            steps: [
              '60 litreyi pay olan 3\'e böl: 20 litre.',
              'Bulunan değeri payda olan 20 ile çarp: 20 x 20 = 400 Litre.',
            ],
          },
        ],
        mistakeReason:
          '3/4 ile 3/5 arasındaki farkı almadan sadece 3/5 üzerinden doğrudan oran kurmaya çalıştın.',
        goldenRule:
          'Artış veya azalış problemlerinde SON KESİR - İLK KESİR farkı, eklenen veya eksilen miktara eşittir!',
        practiceQuestion: {
          question:
            'Bir kitabın 2/7\'sini okuyan bir öğrenci 30 sayfa daha okusaydı kitabın yarısını (1/2) okumuş olacaktı. Kitabın tamamı kaç sayfadır?',
          options: ['A) 105', 'B) 140', 'C) 175', 'D) 210'],
          correctAnswer: 'B) 140',
          explanation:
            '(1/2) - (2/7) = (7/14) - (4/14) = 3/14. Kitabın 3/14\'ü 30 sayfa ise tamamı 30 / 3 * 14 = 140 sayfadır.',
        },
      },
    ],
  },
  {
    id: 'sample-8-lgs-math-ebob',
    date: '13 Ekim 2026',
    title: '8. Sınıf LGS Matematik - Çarpanlar ve Katlar: EBOB-EKOK Problemleri',
    subject: 'Matematik',
    gradeLevel: '8. Sınıf / LGS Hazırlık',
    overallFeedback:
      'LGS sınavında en çok soru çıkan konu olan Çarpanlar ve Katlar testini çözdün. Dikdörtgen bahçenin etrafına eşit aralıklarla ağaç dikme probleminde EBOB mantığını kavramak çok önemlidir. Çözüm yöntemlerini incele!',
    imageUrl: createSampleWorksheetSVG(
      'Çarpanlar ve Katlar (EBOB-EKOK)',
      '8. Sınıf',
      'Matematik',
      [
        {
          q: 'Kenar uzunlukları 48 metre ve 60 metre olan dikdörtgen şeklindeki bir bahçenin köşelerine de gelmek şartıyla eşit aralıklarla ağaç dikilecektir. En az kaç ağaç gerekir?',
          opts: ['14', '18', '20', '24'],
          studentChoice: 'B',
          correctChoice: 'B',
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
        questionText:
          'Kenar uzunlukları 48 metre ve 60 metre olan dikdörtgen şeklindeki bir arsanın etrafına, köşelerine de birer tane gelmek şartıyla eşit aralıklarla en az kaç ağaç dikilir?',
        options: ['A) 14', 'B) 18', 'C) 20', 'D) 24'],
        studentAnswer: 'B) 18',
        correctAnswer: 'B) 18',
        isCorrect: true,
        topic: 'EBOB Problemleri (Ağaç Dikme)',
        teacherLesson:
          'Tebrik ederim! En az ağaç dikmek için iki ağaç arasındaki mesafenin olabildiğince büyük olması gerekir. Bunun için 48 ve 60\'ın En Büyük Ortak Bölenini (EBOB) aldın: EBOB(48, 60) = 12 metre. Çevre / 12 = 18 ağaç sonucunu tam buldun!',
        stepByStepSolution: [
          '1. Adım: En az ağaç için aralık maksimum olmalıdır. EBOB(48, 60) hesaplanır.',
          '2. Adım: 48 = 12 x 4 ve 60 = 12 x 5 olduğundan EBOB(48, 60) = 12 metredir.',
          '3. Adım: Dikdörtgenin çevresi = 2 x (48 + 60) = 2 x 108 = 216 metredir.',
          '4. Adım: Ağaç Sayısı = Çevre / EBOB = 216 / 12 = 18 ağaç.',
        ],
        alternativeSolutions: [
          {
            methodTitle: '1. Yol: Çevre / EBOB Formülü (Klasik Yol)',
            explanation: 'Dikdörtgen çevresini EBOB değerine bölerek doğrudan sonuca ulaşma yöntemi.',
            steps: [
              'EBOB(48, 60) = 12 metre aralık',
              'Çevre = 2 x (48 + 60) = 216 m',
              'Ağaç sayısı = 216 / 12 = 18 ağaç',
            ],
          },
          {
            methodTitle: '2. Yol: Kenar Başına Parça Sayılarını Toplama Yolu',
            explanation: 'Her bir kenarda kaç aralık olduğunu hesaplayıp çevre boyunca toplama.',
            steps: [
              'Kısa kenardaki aralık sayısı: 48 / 12 = 4 aralık (2 kenar var: 4 x 2 = 8)',
              'Uzun kenardaki aralık sayısı: 60 / 12 = 5 aralık (2 kenar var: 5 x 2 = 10)',
              'Toplam ağaç = 8 + 10 = 18 ağaç!',
            ],
          },
          {
            methodTitle: '3. Yol: LGS Pratik Sadeleştirme Taktiği',
            explanation: 'Sayıları EBOB\'a bölüp kenar oranlarını toplayıp 2 ile çarpma.',
            steps: [
              '48/12 = 4 ve 60/12 = 5',
              'Kısa kenar + Uzun kenar oranı = 4 + 5 = 9',
              'Çevre için 2 ile çarp: 9 x 2 = 18 ağaç!',
            ],
          },
        ],
        goldenRule:
          'Büyük bir bütünü eşit parçalara bölme, şişeleme, paketleme ve eşit aralıklarla ağaç/direk dikme sorularında daima EBOB kullanılır!',
      },
    ],
  },
  {
    id: 'sample-8-lgs-science-pressure',
    date: '13 Ekim 2026',
    title: '8. Sınıf LGS Fen Bilimleri - Katı ve Sıvı Basıncı Deneyleri',
    subject: 'Fen Bilimleri',
    gradeLevel: '8. Sınıf / LGS Hazırlık',
    overallFeedback:
      'LGS Fen Bilimleri dersinde katı basıncının ağırlıkla doğru orantılı, temas yüzey alanıyla ters orantılı olduğunu pekiştiren harika bir çalışma.',
    imageUrl: createSampleWorksheetSVG(
      'Katı ve Sıvı Basıncı',
      '8. Sınıf',
      'Fen Bilimleri',
      [
        {
          q: 'Özdeş tuğlalar kullanılarak yapılan bir deneyde tuğlaların süngere batma miktarlarını karşılaştıran öğrenci hangi değişkeni araştırmaktadır?',
          opts: [
            'Katı basıncının yüzey alanına bağlılığı',
            'Sıvı basıncının yoğunluğa bağlılığı',
            'Açık hava basıncının yüksekliğe bağlılığı',
            'Gazların sıkıştırılabilirliği',
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
        questionText:
          'Ağırlıkları eşit olan tuğlalar önce geniş yüzeyleri, ardından dar yüzeyleri sünger üzerine konulduğunda dar yüzeyin süngere daha fazla battığı gözleniyor. Bu deneyin bağımsız değişkeni ve ulaşılan sonuç nedir?',
        options: [
          'A) Bağımsız değişken: Yüzey Alanı. Sonuç: Yüzey alanı azaldıkça katı basıncı artar.',
          'B) Bağımsız değişken: Tuğla Ağırlığı. Sonuç: Ağırlık arttıkça basınç artar.',
          'C) Bağımsız değişken: Süngerin cinsi. Sonuç: Basınç süngere bağlıdır.',
          'D) Bağımsız değişken: Yer çekimi ivmesi. Sonuç: Basınç değişmez.',
        ],
        studentAnswer:
          'A) Bağımsız değişken: Yüzey Alanı. Sonuç: Yüzey alanı azaldıkça katı basıncı artar.',
        correctAnswer:
          'A) Bağımsız değişken: Yüzey Alanı. Sonuç: Yüzey alanı azaldıkça katı basıncı artar.',
        isCorrect: true,
        topic: 'Katı Basıncı ve Deney Değişkenleri',
        teacherLesson:
          'Tebrikler canım öğrencim! Deneyde bizim değiştirdiğimiz faktör "Temas Yüzey Alanı" olduğundan bağımsız değişkendir. Batma miktarı ise katı basıncının büyüklüğünü gösterir. Dar yüzeyde basınç daha büyük olmuştur!',
        stepByStepSolution: [
          '1. Adım: Deneyde neyi değiştirdik? Tuğlanın yere temas eden yüzey alanını (Geniş vs Dar). Demek ki Bağımsız Değişken: Yüzey Alanı.',
          '2. Adım: Neyi sabit tuttuk? Tuğlanın ağırlığını. (Kontrol edilen değişken).',
          '3. Adım: Ne değişti? Süngere batma miktarı (yani Basınç). Demek ki Bağımlı Değişken: Katı Basıncı.',
          '4. Adım: Sonuç: P = G / S formülüne göre yüzey alanı küçüldükçe basınç artar.',
        ],
        goldenRule:
          'Katı basıncında: Katı Basıncı = Ağırlık / Yüzey Alanı. Kar ayakkabısı ve iş makinelerinin paleti yüzeyi artırıp basıncı AZALTMAK için tasarlanmıştır!',
      },
    ],
  },
];
