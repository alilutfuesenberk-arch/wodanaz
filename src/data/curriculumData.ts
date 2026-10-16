export interface CurriculumUnit {
  unitNumber: number;
  unitName: string;
  shortTitle: string;
  learningObjectives: string[];
  keyConcepts: string[];
  summary: string;
  sampleTestCount: number;
  recommendedStudyMinutes: number;
}

export interface SubjectCurriculum {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  gradeLevel: string;
  colorScheme: {
    bg: string;
    text: string;
    border: string;
    activeBg: string;
    ring: string;
  };
  units: CurriculumUnit[];
}

export const MEB_MIDDLE_SCHOOL_CURRICULUM: SubjectCurriculum[] = [
  {
    id: 'Matematik',
    name: 'Matematik',
    shortName: 'Matematik',
    icon: '📐',
    gradeLevel: 'Ortaokul / LGS',
    colorScheme: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      activeBg: 'bg-purple-600',
      ring: 'ring-purple-400',
    },
    units: [
      {
        unitNumber: 1,
        unitName: '1. Ünite: Çarpanlar ve Katlar / EBOB-EKOK',
        shortTitle: 'Çarpanlar ve Katlar',
        learningObjectives: [
          'Verilen pozitif tam sayıların pozitif tam sayı çarpanlarını ve asal çarpanlarını bulur.',
          'İki doğal sayının en büyük ortak bölenini (EBOB) ve en küçük ortak katını (EKOK) hesaplar, ilgili problemleri çözer.',
          'Verilen iki doğal sayının aralarında asal olup olmadığını belirler.',
        ],
        keyConcepts: ['Asal Çarpan Algoritması', 'EBOB', 'EKOK', 'Aralarında Asal Sayılar', 'Bölünebilme Kuralları'],
        summary:
          'Pozitif bir tam sayının çarpanları aynı zamanda o sayının tam bölenleridir. İki veya daha fazla sayının ortak bölenlerinin en büyüğüne EBOB; ortak katlarının en küçüğüne EKOK denir. 1’den başka ortak pozitif böleni olmayan sayılar aralarında asaldır ve aralarında asal iki sayının EBOB’u 1, EKOK’u bu sayıların çarpımıdır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 40,
      },
      {
        unitNumber: 2,
        unitName: '2. Ünite: Üslü İfadeler ve Bilimsel Gösterim',
        shortTitle: 'Üslü İfadeler',
        learningObjectives: [
          'Tam sayıların, tam sayı kuvvetlerini hesaplar ve negatif üs kavramını kavrar.',
          'Üslü ifadelerle çarpma, bölme işlemlerini yapar ve üssün üssünü hesaplar.',
          'Çok büyük ve çok küçük sayıları 10’un tam sayı kuvvetlerini kullanarak ifade eder.',
          'Sayıların bilimsel gösterimini (1 ≤ |a| < 10 ve a × 10ⁿ) açıklar ve uygular.',
        ],
        keyConcepts: ['Negatif Üs (a⁻ⁿ)', 'Üssün Üssü', 'Tabanları Eşit Çarpma/Bölme', 'Bilimsel Gösterim'],
        summary:
          'Negatif üs, sayının çarpma işlemine göre tersini ifade eder (a⁻ⁿ = 1/aⁿ). Tabanları aynı olan üslü ifadeler çarpılırken üsler toplanır, bölünürken çıkarılır. Bilimsel gösterimde katsayının mutlak değeri 1 ile 10 arasında (1 dahil, 10 hariç) olmalıdır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 35,
      },
      {
        unitNumber: 3,
        unitName: '3. Ünite: Kareköklü İfadeler ve Gerçek Sayılar',
        shortTitle: 'Kareköklü İfadeler',
        learningObjectives: [
          'Tam kare pozitif tam sayıları tanır ve kareköklerini belirler.',
          'Tam kare olmayan kareköklü bir sayının hangi iki doğal sayı arasında olduğunu tahmin eder.',
          'Kareköklü bir ifadeyi a√b şeklinde yazar ve katsayıyı kök içine alır.',
          'Kareköklü ifadelerde toplama, çıkarma, çarpma ve bölme işlemlerini yapar.',
          'Rasyonel ve irrasyonel sayıları ayırt ederek gerçek sayılar kümesini oluşturur.',
        ],
        keyConcepts: ['Tam Kare Sayılar', 'Kök Dışına Çıkarma (a√b)', 'Kök İçi İşlemler', 'İrrasyonel Sayılar (π, √2)', 'Gerçek Sayılar (R)'],
        summary:
          'Alanı bilinen bir karenin bir kenar uzunluğunu bulma işlemi karekök almadır. Kök içindeki sayı negatif olamaz. a√b ifadesinde kök dışındaki katsayı kök içine a² olarak girer. Kök dereceleri ve kök içleri aynı olan ifadeler toplanıp çıkarılabilir.',
        sampleTestCount: 25,
        recommendedStudyMinutes: 45,
      },
      {
        unitNumber: 4,
        unitName: '4. Ünite: Veri Analizi (Grafik Yorumlama)',
        shortTitle: 'Veri Analizi',
        learningObjectives: [
          'En fazla üç veri grubuna ait çizgi ve sütun grafiklerini yorumlar.',
          'Verileri sütun, daire veya çizgi grafiği ile gösterir ve bu gösterimler arasında uygun dönüşümleri yapar.',
        ],
        keyConcepts: ['Daire Grafiği (360° Dağılımı)', 'Sütun Grafiği', 'Çizgi Grafiği', 'Oran-Orantı Dönüşümü'],
        summary:
          'Veri dağılımını bir bütünün parçaları olarak göstermek için daire grafiği (360° esası) en uygundur. Zaman içindeki değişimleri göstermek için çizgi grafiği; farklı kategorileri karşılaştırmak için ise sütun grafiği tercih edilir.',
        sampleTestCount: 15,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 5,
        unitName: '5. Ünite: Basit Olayların Olma Olasılığı',
        shortTitle: 'Olasılık',
        learningObjectives: [
          'Bir olaya ait olası durumları belirler ve örnek uzayı kavrar.',
          'İmkânsız olay (0) ve kesin olayı (1) ayırt eder.',
          'Eşit şansa sahip olan olaylarda bir olayın olasılık değerini hesaplar.',
        ],
        keyConcepts: ['Olası Durumlar', 'İstenen Durum / Tüm Durumlar', 'Kesin Olay (1)', 'İmkânsız Olay (0)'],
        summary:
          'Bir olayın olma olasılığı = (İstenen olası durumların sayısı) / (Tüm olası durumların sayısı). Bir olayın olasılığı daima 0 ile 1 arasındadır (0 ≤ P(A) ≤ 1). Bir olayın olma olasılığı ile olmama olasılığının toplamı daima 1’dir.',
        sampleTestCount: 15,
        recommendedStudyMinutes: 25,
      },
      {
        unitNumber: 6,
        unitName: '6. Ünite: Cebirsel İfadeler ve Özdeşlikler',
        shortTitle: 'Cebirsel İfadeler',
        learningObjectives: [
          'Basit cebirsel ifadeleri anlar, terim, katsayı ve sabit terim kavramlarını açıklar.',
          'Cebirsel ifadelerin çarpımını yapar ve modellemelerle doğrular.',
          'Özdeşlik ile denklem arasındaki farkı açıklar; tam kare ve iki kare farkı özdeşliklerini modeller.',
          'Cebirsel ifadeleri ortak çarpan parantezine alma ve özdeşliklerden yararlanarak çarpanlarına ayırır.',
        ],
        keyConcepts: ['İki Terimin Toplamının Karesi: (a+b)²', 'İki Terimin Farkının Karesi: (a-b)²', 'İki Kare Farkı: a²-b²', 'Ortak Çarpan'],
        summary:
          'Değişkenin alacağı her değer için doğru olan eşitliklere özdeşlik denir. Kritik formüller: (a+b)² = a² + 2ab + b², (a-b)² = a² - 2ab + b² ve a² - b² = (a-b)(a+b). Bu üç temel özdeşlik LGS’de her yıl mutlaka sorulur.',
        sampleTestCount: 25,
        recommendedStudyMinutes: 45,
      },
      {
        unitNumber: 7,
        unitName: '7. Ünite: Doğrusal Denklemler ve Eğim',
        shortTitle: 'Doğrusal Denklemler',
        learningObjectives: [
          'Birinci dereceden bir bilinmeyenli denklemleri çözer.',
          'Koordinat sistemini tanır ve sıralı ikilileri eksenlerde gösterir.',
          'Doğrusal denklemlerin grafiklerini çizer ve eksenleri kestiği noktaları bulur.',
          'Doğrunun eğimini dikey uzunluğun yatay uzunluğa oranı olarak modeller ve hesaplar.',
        ],
        keyConcepts: ['Koordinat Sistemi (x, y)', 'Orijinden Geçen Doğrular', 'Eksenlere Paralel Doğrular', 'Eğim (m = dikey/yatay)'],
        summary:
          'y = mx + b doğrusunda x’in katsayısı olan m, doğrunun eğimidir. Sağa yatık doğruların eğimi pozitif, sola yatık doğruların eğimi negatiftir. Yatay doğruların eğimi sıfır, dikey doğruların eğimi tanımsızdır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 40,
      },
      {
        unitNumber: 8,
        unitName: '8. Ünite: Eşitsizlikler ve Sayı Doğrusu',
        shortTitle: 'Eşitsizlikler',
        learningObjectives: [
          'Birinci dereceden bir bilinmeyenli eşitsizlik içeren günlük hayat durumlarına uygun matematik cümleleri yazar.',
          'Eşitsizlikleri sayı doğrusunda gösterir ve çözüm aralığını belirler.',
        ],
        keyConcepts: ['Küçüktür (<)', 'Büyüktür (>)', 'Küçük Eşit (≤)', 'Büyük Eşit (≥)', 'Negatif Sayıyla Çarpma Kuralı'],
        summary:
          'Bir eşitsizliğin her iki tarafı negatif bir sayı ile çarpılır veya bölünürse eşitsizlik yön değiştirir (< işareti > olur). Eşitlik dahil olduğunda sayı doğrusundaki noktanın içi doldurulur.',
        sampleTestCount: 15,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 9,
        unitName: '9. Ünite: Üçgenler ve Pisagor Bağıntısı',
        shortTitle: 'Üçgenler',
        learningObjectives: [
          'Üçgende kenarortay, açıortay ve yükseklik elemanlarını çizer.',
          'Üçgenin iki kenar uzunluğunun toplamı veya farkı ile üçüncü kenarının uzunluğu arasındaki ilişkiyi (Üçgen Eşitsizliği) kurar.',
          'Üçgenin kenar uzunlukları ile bu kenarların karşısındaki açıların ölçülerini ilişkilendirir.',
          'Pisagor bağıntısını oluşturur ve dik üçgen problemlerinde uygular.',
        ],
        keyConcepts: ['Üçgen Eşitsizliği (|b-c| < a < b+c)', 'Büyük Açı Karşısında Büyük Kenar', 'Pisagor Teoremi (a² + b² = c²)', 'Özel Dik Üçgenler (3-4-5, 5-12-13, 8-15-17)'],
        summary:
          'Bir dik üçgende dik kenarların kareleri toplamı, hipotenüsün karesine eşittir (a² + b² = c²). Özel üçgenler işlem hızını katlar: 3k-4k-5k, 5k-12k-13k, 8k-15k-17k, 7k-24k-25k.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 40,
      },
      {
        unitNumber: 10,
        unitName: '10. Ünite: Geometrik Cisimler ve Dönüşüm Geometrisi',
        shortTitle: 'Geometrik Cisimler',
        learningObjectives: [
          'Nokta, doğru parçası ve diğer şekillerin öteleme ve yansıma altındaki görüntülerini çizer.',
          'Dik dairesel silindirin, dik piramidin ve dik koninin temel elemanlarını tanır, açınımlarını çizer ve yüzey alanı/hacmini hesaplar.',
        ],
        keyConcepts: ['Öteleme & Yansıma', 'Dik Dairesel Silindir (Yüzey Alanı = 2πrh + 2πr²)', 'Hacim = πr²h', 'Dik Koni & Piramit'],
        summary:
          'Ötelemede şeklin yönü ve boyutu değişmez, sadece konumu değişir. Yansımada ise simetri (ayna) görüntüsü oluşur. Silindirin yan yüzü açıldığında bir dikdörtgendir; bu dikdörtgenin yatay kenarı taban çemberinin çevresine (2πr) eşittir.',
        sampleTestCount: 15,
        recommendedStudyMinutes: 35,
      },
    ],
  },
  {
    id: 'Fen Bilimleri',
    name: 'Fen Bilimleri',
    shortName: 'Fen Bilimleri',
    icon: '🔬',
    gradeLevel: 'Ortaokul / LGS',
    colorScheme: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      activeBg: 'bg-emerald-600',
      ring: 'ring-emerald-400',
    },
    units: [
      {
        unitNumber: 1,
        unitName: '1. Ünite: Mevsimler ve İklim (Eksen Eğikliği)',
        shortTitle: 'Mevsimler ve İklim',
        learningObjectives: [
          'Mevsimlerin oluşumuna yönelik tahminlerde bulunur ve eksen eğikliğinin etkisini modeller.',
          'İklim ve hava olayları arasındaki farkı açıklar, klimatoloji ve meteoroloji bilimlerini tanır.',
          'Küresel iklim değişikliklerinin nedenlerini ve olası sonuçlarını değerlendirir.',
        ],
        keyConcepts: ['Eksen Eğikliği (23° 27\')', 'Güneş Işınlarının Geliş Açısı', '21 Haziran / 21 Aralık Gün Dönümleri', '21 Mart / 23 Eylül Ekinoks', 'Yüksek Basınç & Alçak Basınç (Rüzgar)'],
        summary:
          'Mevsimlerin oluşumunda iki temel faktör vardır: Dünya’nın eksen eğikliği ve Dünya’nın Güneş etrafında dolanması. Güneş ışınları dik açıyla geldiğinde birim yüzeye düşen enerji fazla olur ve sıcaklık yükselir. Rüzgar daima yüksek basınç alanından alçak basınç alanına doğru yatay hava hareketidir.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 35,
      },
      {
        unitNumber: 2,
        unitName: '2. Ünite: DNA ve Genetik Kod (Kalıtım ve Biyoteknoloji)',
        shortTitle: 'DNA ve Genetik Kod',
        learningObjectives: [
          'Nükleotid, gen, DNA ve kromozom kavramlarını basitten karmaşığa sıralar ve açıklar.',
          'DNA’nın yapısını model üzerinde gösterir ve kendini eşleme mekanizmasını açıklar.',
          'Tek karakter çaprazlamaları ile ilgili problemler çözerek genotip ve fenotip oranlarını bulur.',
          'Mutasyon, modifikasyon, adaptasyon ve doğal seçilim kavramlarını örneklerle açıklar.',
          'Biyoteknolojik uygulamaların insanlık için yararlarını ve risklerini değerlendirir.',
        ],
        keyConcepts: ['Kromozom > DNA > Gen > Nükleotid (KEDİGENİ)', 'Adenin-Timin / Guanin-Sitozin Eşleşmesi', 'Mendel Çaprazlamaları (Baskın/Çekinik)', 'Mutasyon & Modifikasyon', 'Biyoteknoloji'],
        summary:
          'DNA çift zincirli sarmal yapıdadır. Adenin karşısına Timin, Guanin karşısına Sitozin gelir. Çevre etkisiyle genlerin işleyişinin değişmesi modifikasyondur (kalıtsal değildir); gen yapısının bozulması ise mutasyondur (üreme hücrelerinde kalıtsaldır).',
        sampleTestCount: 25,
        recommendedStudyMinutes: 45,
      },
      {
        unitNumber: 3,
        unitName: '3. Ünite: Basınç (Katı, Sıvı ve Gaz Basıncı Deneyleri)',
        shortTitle: 'Basınç',
        learningObjectives: [
          'Katı basıncını etkileyen değişkenleri (ağırlık/kuvvet ve temas yüzey alanı) deneylerle keşfeder.',
          'Sıvı basıncını etkileyen değişkenleri (derinlik ve sıvı yoğunluğu) analiz eder.',
          'Sıvıların ve gazların basıncı her yöne ilettiğini (Pascal Prensibi) açıklar ve günlük hayattan örnekler verir.',
          'Açık hava basıncının varlığını Torricelli deneyi ile açıklar.',
        ],
        keyConcepts: ['Katı Basıncı (P = F / S)', 'Sıvı Basıncı (P = h × d × g)', 'Pascal Prensibi (Hidrolik Frenler)', 'Açık Hava Basıncı (Barometre - 76 cmHg)'],
        summary:
          'Katı basıncı kuvvet arttıkça artar, yüzey alanı arttıkça azalır. Sıvı basıncı sadece sıvının derinliğine (h) ve sıvının yoğunluğuna (d) bağlıdır; kabın şekline veya sıvı miktarına bağlı değildir. Sıvılar sıkıştırılamaz ve üzerlerine uygulanan basıncı aynen her yöne iletir.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 40,
      },
      {
        unitNumber: 4,
        unitName: '4. Ünite: Madde ve Endüstri (Periyodik Tablo & Asit-Baz)',
        shortTitle: 'Madde ve Endüstri',
        learningObjectives: [
          'Periyodik sistemde grup ve periyotların nasıl oluştuğunu açıklar.',
          'Elementleri metal, ametal ve yarı metal olarak sınıflandırır.',
          'Fiziksel ve kimyasal değişimler arasındaki farkları deneylerle açıklar.',
          'Kimyasal tepkimelerde kütlenin korunduğunu modeller.',
          'Asitler ve bazların genel özelliklerini, pH ölçeğini ve ayıraçları (turnusol, fenolftalein) kavrar.',
        ],
        keyConcepts: ['Periyot (Katman Sayısı)', 'Grup (Son Katmandaki Elektron)', 'Metaller / Ametaller / Soygazlar', 'Kütlenin Korunumu Kanunu', 'pH Skalası (0-7 Asit, 7 Nötr, 7-14 Baz)'],
        summary:
          'Periyodik tabloda yatay sıralara periyot (7 tane), düşey sütunlara grup (18 tane) denir. Kimyasal tepkimelerde atom türü, atom sayısı ve toplam kütle daima korunur; ancak molekül sayısı veya hacim değişebilir. Asitler mavi turnusolu kırmızıya, bazlar kırmızı turnusolu maviye çevirir.',
        sampleTestCount: 25,
        recommendedStudyMinutes: 45,
      },
      {
        unitNumber: 5,
        unitName: '5. Ünite: Basit Makineler (İş Kolaylığı ve Prensipler)',
        shortTitle: 'Basit Makineler',
        learningObjectives: [
          'Basit makinelerin sağladığı avantajları (kuvvetten kazanç, yoldan kayıp) örneklerle açıklar.',
          'Kaldıraç, makara, palanga, eğik düzlem, çıkrık ve dişli çark düzeneklerini analiz eder.',
        ],
        keyConcepts: ['Kuvvet Kolu & Yük Kolu', 'Kuvvet Kazancı = Yük / Kuvvet', 'Sabit Makara & Hareketli Makara', 'Eğik Düzlem', 'İş ve Enerjiden Asla Kazanç Olmaz'],
        summary:
          'Hiçbir basit makinede işten veya enerjiden kazanç sağlanamaz. Yalnızca iş yapma kolaylığı sağlanır. Kuvvetten kazanç varsa aynı oranda yoldan kayıp vardır. Hareketli makarada ve eğik düzlemde daima kuvvetten kazanç vardır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 35,
      },
      {
        unitNumber: 6,
        unitName: '6. Ünite: Canlılar ve Enerji İlişkileri',
        shortTitle: 'Enerji İlişkileri',
        learningObjectives: [
          'Besin zincirinde üretici, tüketici ve ayrıştırıcı ilişkisini kurar ve enerji piramidini çizer.',
          'Fotosentez sürecini açıklar ve fotosentez hızını etkileyen faktörleri değerlendirir.',
          'Oksijenli ve oksijensiz solunum süreçlerini karşılaştırır.',
        ],
        keyConcepts: ['Üretici > Otçul > Etçil > Ayrıştırıcı', 'Enerji Piramidi (%10 Kuralı)', 'Fotosentez (Işık + Klorofil)', 'Hücresel Solunum (ATP Üretimi)'],
        summary:
          'Besin zincirinde üreticilerden tüketicilere doğru gidildikçe aktarılan enerji azalır (%10 kuralı), biyolojik birikim (zehir) artar, birey sayısı genellikle azalır. Fotosentez kloroplastta gerçekleşir ve glikoz ile oksijen üretilir.',
        sampleTestCount: 15,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 7,
        unitName: '7. Ünite: Elektrik Yükleri ve Elektrik Enerjisi',
        shortTitle: 'Elektrik Enerjisi',
        learningObjectives: [
          'Elektrik yüklerini ve sürtünme, dokunma, etki ile elektriklenme çeşitlerini açıklar.',
          'Elektroskopun çalışma prensibini kavrar.',
          'Elektrik enerjisinin ısı, ışık ve hareket enerjisine dönüşümünü modeller.',
        ],
        keyConcepts: ['Pozitif ve Negatif Yükler', 'Sürtünme ile Elektriklenme', 'Elektroskop', 'Topraklama', 'Elektrik Sigortası'],
        summary:
          'Aynı cins yükler birbirini iter (+ ile +, - ile -), zıt cins yükler birbirini çeker. Nötr cisimler pozitif ve negatif yük sayıları eşit olan cisimlerdir. Elektrik akımı elektronların titreşim hareketiyle iletilir.',
        sampleTestCount: 15,
        recommendedStudyMinutes: 25,
      },
    ],
  },
  {
    id: 'Türkçe',
    name: 'Türkçe',
    shortName: 'Türkçe',
    icon: '📖',
    gradeLevel: 'Ortaokul / LGS',
    colorScheme: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      activeBg: 'bg-orange-500',
      ring: 'ring-orange-400',
    },
    units: [
      {
        unitNumber: 1,
        unitName: '1. Ünite: Fiilimsiler (Eylemsiler)',
        shortTitle: 'Fiilimsiler',
        learningObjectives: [
          'Fiilimsilerin özelliklerini ve fiillerden farkını kavrar.',
          'İsim-fiil (-ma,-ış,-mak), sıfat-fiil (-an,-ası,-mez,-ar,-dik,-ecek,-miş) ve zarf-fiil eklerini ayırt eder.',
          'Kalıcı isimlerle fiilimsileri birbirinden ayırır.',
        ],
        keyConcepts: ['İsim-Fiil (Mayışmak)', 'Sıfat-Fiil (Anası Mezar Dikecekmiş)', 'Zarf-Fiil (Bağ-Fiil)', 'Kalıcı İsim (Ekmek, Çakmak, Dolma)'],
        summary:
          'Fiilimsiler fiil kök veya gövdelerine getirilen özel yapım ekleriyle türetilir; fiil çekim eklerini (kip ve şahıs) alamazlar ancak yan cümlecik kurarlar. Sıfat-fiiller niteledikleri isim düştüğünde adlaşmış sıfat-fiil olurlar.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 2,
        unitName: '2. Ünite: Sözcükte ve Cümlede Anlam / Örtülü Anlam',
        shortTitle: 'Sözcük ve Cümlede Anlam',
        learningObjectives: [
          'Gerçek, mecaz ve terim anlamlı sözcükleri ayırt eder.',
          'Deyim ve atasözlerinin metne kattığı anlamı kavrar.',
          'Öznel ve nesnel yargıları, neden-sonuç, amaç-sonuç ve koşul cümlelerini belirler.',
          'Cümleden çıkarılabilecek örtülü anlamları tespit eder.',
        ],
        keyConcepts: ['Mecaz Anlam', 'Örtülü Anlam', 'Neden-Sonuç vs Amaç-Sonuç', 'Öznel / Nesnel Anlatım', 'Koşul-Sonuç'],
        summary:
          'Amaç-sonuç cümlelerinde eylem henüz gerçekleşmemiştir ("-mek amacıyla" testi uygulanır). Neden-sonuçta ise her iki durum da gerçekleşmiştir ("-dığı için" testi). Örtülü anlam, cümlenin açıkça söylemediği ancak mantıksal olarak ulaşılan yan anlamdır.',
        sampleTestCount: 25,
        recommendedStudyMinutes: 35,
      },
      {
        unitNumber: 3,
        unitName: '3. Ünite: Cümlenin Ögeleri ve Cümle Vurgusu',
        shortTitle: 'Cümlenin Ögeleri',
        learningObjectives: [
          'Temel ögeleri (Yüklem ve Özne) doğru tespit eder.',
          'Yardımcı ögeleri (Nesne, Yer Tamlayıcısı, Zarf Tamlayıcısı) sorularıyla bulur.',
          'Söz öbeklerinin (tamlamalar, deyimler, fiilimsi grupları) parçalanamayacağını uygular.',
          'Fiil ve isim cümlelerinde vurgulanan ögeyi belirler.',
        ],
        keyConcepts: ['Yüklem (Temel Direk)', 'Özne (Yapan Kim / Ne?)', 'Nesne (Belirtili/Belirtisiz)', 'Yer Tamlayıcısı (Dolaylı Tümleç)', 'Zarf Tamlayıcısı'],
        summary:
          'Ögeler bulunurken önce Yüklem, sonra Özne bulunur (YÖNT kuralı). Tamlamalar, deyimler ve birleşik fiiller asla bölünmez. Fiil cümlelerinde vurgu yüklemden hemen önceki ögededir; isim cümlelerinde vurgu yüklemin kendisindedir.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 35,
      },
      {
        unitNumber: 4,
        unitName: '4. Ünite: Paragrafta Anlam, Ana Fikir ve Çıkarım',
        shortTitle: 'Paragrafta Anlam',
        learningObjectives: [
          'Metnin ana fikrini (ana düşüncesini) ve yardımcı düşüncelerini bulur.',
          'Paragrafın yapısını (giriş, gelişme, sonuç cümleleri, akışı bozan cümle, ikiye bölme) çözümler.',
          'Metindeki anlatım biçimlerini (açıklama, tartışma, öyküleme, betimleme) ve düşünceyi geliştirme yollarını kavrar.',
        ],
        keyConcepts: ['Ana Fikir (Yazarın Asıl Mesajı)', 'Akışı Bozan Cümle', 'Düşünceyi Geliştirme Yolları (Tanımlama, Karşılaştırma, Tanıcı Gösterme)', 'Görsel / Tablo Okuma'],
        summary:
          'Ana fikir sorusunda "Yazar bu parçayı ne amaçla yazdı?" sorusu sorulur. Olumsuz soru köklerine ("çıkarılamaz, değinilmemiştir") dikkat edilmelidir. Akışı bozan cümle, parçanın genel konusundan sapan veya farklı bir yönüne değinen cümledir.',
        sampleTestCount: 30,
        recommendedStudyMinutes: 45,
      },
      {
        unitNumber: 5,
        unitName: '5. Ünite: Metin Türleri ve Söz Sanatları',
        shortTitle: 'Metin Türleri & Sanatlar',
        learningObjectives: [
          'Olay yazıları (hikâye, roman, masal, fabl) ile düşünce yazılarını (deneme, makale, fıkra, eleştiri) ayırt eder.',
          'Benzetme (teşbih), kişileştirme (teşhis), konuşturma (intak), tezat (karşıtlık) ve abartma (mübalağa) sanatlarını metinde bulur.',
        ],
        keyConcepts: ['Deneme vs Makale', 'Fıkra (Köşe Yazısı)', 'Kişileştirme & Konuşturma', 'Tezat (Zıtlık)', 'Abartma'],
        summary:
          'Makale kanıtlanabilir bilimsel veriler içerir; deneme ise yazarın kendisiyle konuşuyormuş gibi içten düşünceleridir. Konuşturma (intak) sanatının olduğu her yerde mutlaka kişileştirme (teşhis) sanatı da vardır.',
        sampleTestCount: 15,
        recommendedStudyMinutes: 25,
      },
      {
        unitNumber: 6,
        unitName: '6. Ünite: Yazım Kuralları ve Noktalama İşaretleri',
        shortTitle: 'Yazım & Noktalama',
        learningObjectives: [
          'Büyük harflerin kullanıldığı yerleri ve birleşik sözcüklerin yazımını doğru uygular.',
          '"de/da" ve "ki" bağlaçları ile eklerinin yazımını ayırt eder.',
          'Nokta, virgül, noktalı virgül, iki nokta, tırnak işareti ve kesme işaretini işlevlerine uygun kullanır.',
        ],
        keyConcepts: ['Bağlaç Olan "de/ki"', 'Büyük Harf Kuralları', 'Virgül vs Noktalı Virgül', 'İki Nokta Kullanımı', 'Sayıların ve Kısaltmaların Yazımı'],
        summary:
          'Cümleden çıkarıldığında anlam bozulmuyorsa "de" bağlaçtır ve ayrı yazılır. İki noktadan sonra açıklama geliyorsa ve cümle niteliğindeyse büyük harfle; örnekler sıralanıyorsa küçük harfle başlanır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 7,
        unitName: '7. Ünite: Cümle Türleri ve Anlatım Bozuklukları',
        shortTitle: 'Cümle Türleri',
        learningObjectives: [
          'Yüklemin türüne göre (isim/fiil) ve yerine göre (kurallı/devrik) cümleleri sınıflandırır.',
          'Yapısına göre cümleleri (tek yüklemli, fiilimsili, birden çok yüklemli, bağlı) ayırt eder.',
          'Anlama dayalı ve yapıya dayalı anlatım bozukluklarını belirler.',
        ],
        keyConcepts: ['Tek Yüklemli Cümle', 'İçinde Fiilimsi Olan Cümle', 'Birden Çok Yüklemli (Sıralı) Cümle', 'Bağlı Cümle (Bağlaçlı)', 'Özne-Yüklem Uyumsuzluğu'],
        summary:
          'İçinde fiilimsi bulunan ve tek yüklemi olan cümlelere birleşik cümle denir. Virgülle ayrılmış birden fazla yüklem varsa sıralı cümle; bağlaçla bağlanmışsa bağlı cümledir.',
        sampleTestCount: 15,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 8,
        unitName: '8. Ünite: Mantık Muhakeme ve Sözel Akıl Yürütme',
        shortTitle: 'Mantık Muhakeme',
        learningObjectives: [
          'Öncülleri verilen bir sözel mantık probleminde tablo veya şema kurarak bilinmeyenleri bulur.',
          'Şifreleme, sıralama, yer-yön ve eşleştirme sorularını adım adım çözümler.',
        ],
        keyConcepts: ['Kesin Bilgiler vs İhtimaller', 'Tablo Kurma Tekniği', 'Eleme Yöntemi', 'Sözel Çıkarım'],
        summary:
          'Sözel mantık sorularında ipuçları doğrudan okunmaz; tablo çizilerek kesin bilgiler yerleştirilir. "Yalnızca", "biri hariç", "hemen önünde" gibi kısıtlayıcı ifadelere dikkat edilmelidir.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 35,
      },
    ],
  },
  {
    id: 'T.C. İnkılap Tarihi ve Atatürkçülük / Sosyal Bilgiler',
    name: 'T.C. İnkılap Tarihi ve Sosyal Bilgiler',
    shortName: 'İnkılap / Sosyal',
    icon: '🏛️',
    gradeLevel: 'Ortaokul / LGS',
    colorScheme: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      activeBg: 'bg-indigo-600',
      ring: 'ring-indigo-400',
    },
    units: [
      {
        unitNumber: 1,
        unitName: '1. Ünite: Bir Kahraman Doğuyor (Mustafa Kemal’in Hayatı)',
        shortTitle: 'Bir Kahraman Doğuyor',
        learningObjectives: [
          '20. yüzyıl başlarında Osmanlı Devleti’nin siyasi ve sosyal durumunu analiz eder.',
          'Mustafa Kemal’in çocukluk ve öğrenim hayatını, fikir hayatını etkileyen şehirleri ve yazarları açıklar.',
          'Mustafa Kemal’in askerlik hayatındaki ilk başarılarını (Trablusgarp ve Çanakkale) liderlik özellikleriyle ilişkilendirir.',
        ],
        keyConcepts: ['Selanik (Kültürel Zenginlik)', 'Manastır & İstanbul & Şam', 'Fikir Babaları (Namık Kemal, Ziya Gökalp, Tevfik Fikret, Montesquieu)', 'İleri Görüşlülük & Vatanseverlik'],
        summary:
          'Selanik’in çok uluslu ve demiryolu bağlantılı yapısı Mustafa Kemal’in hoşgörülü ve yenilikçi olmasını sağladı. Trablusgarp Savaşı sömürgeciliğe karşı ilk mücadelesidir ve örgütleyicilik yeteneğini kanıtlamıştır. Çanakkale’deki başarısı ise Milli Mücadele’nin lideri olmasının yolunu açmıştır.',
        sampleTestCount: 15,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 2,
        unitName: '2. Ünite: Milli Uyanış (I. Dünya Savaşı ve Mondros)',
        shortTitle: 'Milli Uyanış',
        learningObjectives: [
          'I. Dünya Savaşı’nın genel ve özel nedenlerini açıklar, Osmanlı’nın savaştığı cepheleri değerlendirir.',
          'Mondros Ateşkes Antlaşması’nın imzalanması ve Türk yurdunun işgali karşısındaki tutumları karşılaştırır.',
          'Kuvâ-yı Millîye hareketini ve cemiyetleri (yararlı/zararlı) analiz eder.',
          'Mustafa Kemal’in Samsun’a çıkışı, Havza ve Amasya Genelgeleri, Erzurum ve Sivas Kongrelerini tahlil eder.',
        ],
        keyConcepts: ['Mondros 7. ve 24. Maddeler', 'Kuvâ-yı Millîye', 'Amasya Genelgesi (Milli Mücadele’nin Amacı, Gerekçesi ve Yöntemi)', 'Misak-ı Millî'],
        summary:
          'Amasya Genelgesi ile ilk kez ulusal egemenliğe dayalı bir yönetimin sinyali verilmiştir: "Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır." Erzurum Kongresi toplanış bakımından bölgesel, kararları bakımından ulusaldır; manda ve himaye ilk kez reddedilmiştir.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 40,
      },
      {
        unitNumber: 3,
        unitName: '3. Ünite: Milli Bir Destan: Ya İstiklal Ya Ölüm! (Cepheler)',
        shortTitle: 'Kurtuluş Savaşı Cepheleri',
        learningObjectives: [
          'Doğu Cephesi’nde Gümrü Antlaşması’nı; Güney Cephesi’nde halk direnişini ve Ankara Antlaşması’nı değerlendirir.',
          'Batı Cephesi’nde düzenli ordunun başarılarını (I. ve II. İnönü, Kütahya-Eskişehir, Sakarya, Büyük Taarruz) açıklar.',
          'Tekâlif-i Milliye Emirleri’nin milli dayanışmadaki rolünü analiz eder.',
          'Mudanya Ateşkes ve Lozan Barış Antlaşması’nın bağımsızlık açısından önemini kavrar.',
        ],
        keyConcepts: ['Gümrü Antlaşması (İlk Askeri & Siyasi Başarı)', 'Tekâlif-i Milliye (Topyekûn Seferberlik)', 'Sakarya Meydan Muharebesi (Son Savunma)', 'Lozan Barış Antlaşması (Bağımsızlık Belgesi)'],
        summary:
          'Sakarya Meydan Muharebesi, Türk ordusunun 1683 Viyana bozgunundan beri süren geri çekilişini durduran savaştır. Mustafa Kemal’e "Gazi" unvanı ve "Mareşal" rütbesi verilmiştir. Lozan Barış Antlaşması ile kapitülasyonlar kaldırılmış ve yeni Türk devleti tüm dünya tarafından resmen tanınmıştır.',
        sampleTestCount: 25,
        recommendedStudyMinutes: 45,
      },
      {
        unitNumber: 4,
        unitName: '4. Ünite: Atatürkçülük ve Çağdaşlaşan Türkiye (İnkılaplar)',
        shortTitle: 'Atatürk İnkılapları',
        learningObjectives: [
          'Atatürk ilkelerini (Cumhuriyetçilik, Milliyetçilik, Halkçılık, Devletçilik, Laiklik, İnkılapçılık) açıklar.',
          'Siyasal, toplumsal, hukuk, eğitim ve ekonomi alanındaki inkılapları analiz eder.',
        ],
        keyConcepts: ['Cumhuriyetçilik (Milli İrade)', 'Laiklik (Akıl ve Bilim)', 'Halkçılık (Eşitlik)', 'Devletçilik (Ekonomi)', 'Medeni Kanun', 'Tevhid-i Tedrisat'],
        summary:
          'Cumhuriyetçilik doğrudan millet egemenliğini ve seçimleri esas alır. Laiklik din ve devlet işlerinin ayrılması, akıl ve bilimin rehber edinilmesidir. Medeni Kanun ile kadınlara toplumsal ve hukuki haklar verilmiş (siyasi haklar daha sonra 1930-1934 arasında) eşitlik sağlanmıştır.',
        sampleTestCount: 25,
        recommendedStudyMinutes: 40,
      },
      {
        unitNumber: 5,
        unitName: '5. Ünite: Demokratikleşme Çabaları ve Çok Partili Hayat',
        shortTitle: 'Demokratikleşme',
        learningObjectives: [
          'Atatürk döneminde çok partili siyasi hayata geçiş denemelerini ve karşılaşılan tepkileri değerlendirir.',
          'Cumhuriyet rejimine yönelik tehditleri (Şeyh Sait İsyanı ve İzmir Suikastı) analiz eder.',
        ],
        keyConcepts: ['Halk Fırkası', 'Terakkiperver Cumhuriyet Fırkası', 'Serbest Cumhuriyet Fırkası', 'Çok Partili Hayat Denemeleri'],
        summary:
          'Demokrasinin tam olarak yerleşmesi ve farklı fikirlerin mecliste temsil edilmesi için çok partili hayata geçilmek istenmiş; ancak rejim karşıtı isyanlar nedeniyle ortamın henüz hazır olmadığı görülerek denemelere ara verilmiştir.',
        sampleTestCount: 15,
        recommendedStudyMinutes: 25,
      },
      {
        unitNumber: 6,
        unitName: '6. Ünite: Atatürk Dönemi Türk Dış Politikası',
        shortTitle: 'Dış Politika',
        learningObjectives: [
          'Atatürk dönemi Türk dış politikasının temel ilkelerini (bağımsızlık, barış, gerçekçilik, mütekabiliyet) açıklar.',
          'Yabancı okullar sorunu, Musul meselesi, Montrö Boğazlar Sözleşmesi ve Hatay’ın anavatana katılmasını değerlendirir.',
        ],
        keyConcepts: ['Yurtta Barış Dünyada Barış', 'Montrö Boğazlar Sözleşmesi (1936)', 'Balkan Antantı & Sadabat Paktı', 'Hatay’ın Katılması (1939)'],
        summary:
          'Montrö Boğazlar Sözleşmesi ile Boğazlar Komisyonu kaldırılmış ve Boğazların tüm hakimiyeti Türkiye’ye geçmiştir. Hatay meselesi barışçıl diplomasi ile yürütülmüş ve 1939’da anavatana katılmıştır.',
        sampleTestCount: 15,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 7,
        unitName: '7. Ünite: Atatürk’ün Ölümü ve Sonrası',
        shortTitle: 'Atatürk’ün Ölümü ve Sonrası',
        learningObjectives: [
          'Atatürk’ün vefatının yurt içi ve yurt dışındaki yankılarını değerlendirir.',
          'Atatürk’ün eserlerini, ilkelerini ve Türkiye Cumhuriyeti’ne bıraktığı mirası analiz eder.',
        ],
        keyConcepts: ['10 Kasım 1938', 'Anıtkabir', 'Nutuk', 'Gençliğe Hitabe', 'Demokrasiye Bağlılık'],
        summary:
          'Atatürk’ün vefatı hem Türk milletinde hem de dünya liderleri nezdinde derin bir saygı ve hüzünle karşılanmıştır. Onun en büyük eseri ve mirası Türkiye Cumhuriyeti ve çağdaşlaşma ülküsüdür.',
        sampleTestCount: 15,
        recommendedStudyMinutes: 25,
      },
    ],
  },
  {
    id: 'İngilizce',
    name: 'İngilizce',
    shortName: 'İngilizce',
    icon: '🌍',
    gradeLevel: 'Ortaokul / LGS',
    colorScheme: {
      bg: 'bg-violet-50',
      text: 'text-violet-700',
      border: 'border-violet-200',
      activeBg: 'bg-violet-600',
      ring: 'ring-violet-400',
    },
    units: [
      {
        unitNumber: 1,
        unitName: '1. Unit: Friendship (Accepting, Refusing & Apologizing)',
        shortTitle: 'Friendship',
        learningObjectives: [
          'Students will be able to accept and refuse offers/invitations with polite excuses.',
          'Identify personal traits of a good friend (honest, supportive, reliable, generous).',
        ],
        keyConcepts: ['Would you like to...?', 'Why don’t we...?', 'Count on / Rely on / Back up', 'Best friend / Mate / Buddy'],
        summary:
          'LGS Unit 1 focuses on making and responding to offers politely. Key verbs: "back up" (desteklemek), "count on" (güvenmek), "get on well with" (iyi geçinmek). An excuse is always needed when refusing an offer: "I’d love to, but I have to study."',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 2,
        unitName: '2. Unit: Teen Life (Daily Routines & Preferences)',
        shortTitle: 'Teen Life',
        learningObjectives: [
          'Talk about regular activities of teenagers and their music/sport preferences.',
          'Express likes, dislikes and preferences using "prefer" and "would rather".',
        ],
        keyConcepts: ['Prefer ... to ...', 'Keen on / Fond of / Crazy about', 'Can’t stand / Unbearable', 'Trendy / Casual / Impressive'],
        summary:
          '"Prefer" takes -ing for verbs or nouns: "I prefer reading books to watching TV." Words expressing strong feelings: "keen on / fond of" (düşkün olmak), "unbearable / can\'t stand" (katlanamamak).',
        sampleTestCount: 15,
        recommendedStudyMinutes: 25,
      },
      {
        unitNumber: 3,
        unitName: '3. Unit: In The Kitchen (Recipes & Cooking Processes)',
        shortTitle: 'In The Kitchen',
        learningObjectives: [
          'Describe a process using sequencers (First, Second, Then, Next, After that, Finally).',
          'Identify kitchen tools and cooking methods (bake, boil, fry, grill, roast, steam).',
        ],
        keyConcepts: ['First / Next / Then / Finally', 'Bake vs Fry vs Boil vs Roast', 'Chop, slice, dice, peel, grate, whisk', 'Ingredients vs Steps'],
        summary:
          'LGS loves recipe questions! Learn cooking verbs: "peel" (soymak), "grate" (rendelemek), "dice" (küp küp doğramak), "whisk" (çırpmak). Notice sequencers to put the recipe steps in correct order.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 4,
        unitName: '4. Unit: On The Phone (Phone Calls & Leaving Messages)',
        shortTitle: 'On The Phone',
        learningObjectives: [
          'Make simple phone calls, ask for someone, and leave/take messages.',
          'Understand communication styles and call center conversations.',
        ],
        keyConcepts: ['Hold on / Hang on a minute', 'May I speak to...?', 'He is not available now', 'Would you like to leave a message?', 'Pick up / Hang up'],
        summary:
          'Key phrases on the phone: "Hang on / Hold on" (hatta beklemek), "Put someone through" (bağlamak), "Engaged / busy" (meşgul), "Leave a memo" (not bırakmak).',
        sampleTestCount: 15,
        recommendedStudyMinutes: 25,
      },
      {
        unitNumber: 5,
        unitName: '5. Unit: The Internet (Online Safety & Digital Habits)',
        shortTitle: 'The Internet',
        learningObjectives: [
          'Talk about Internet habits, account safety, and browser icons.',
          'Read internet safety rules and analyze pie charts about internet usage.',
        ],
        keyConcepts: ['Download vs Upload', 'Confirm / Reject / Browse', 'Internet safety rules', 'Refuse unknown friend requests', 'Log in / Sign up'],
        summary:
          'Internet safety advice: "Never share personal information online", "Create strong passwords", "Don\'t meet people you met online".',
        sampleTestCount: 15,
        recommendedStudyMinutes: 25,
      },
      {
        unitNumber: 6,
        unitName: '6. Unit: Adventures (Extreme Sports & Comparisons)',
        shortTitle: 'Adventures',
        learningObjectives: [
          'Compare extreme sports and outdoor activities using comparatives and superlatives.',
          'Express reasons for preferences (more challenging, fascinating, risky).',
        ],
        keyConcepts: ['Paragliding, bungee jumping, rafting', 'More dangerous / safer', 'I would rather / I prefer', 'Adrenaline junkie / courageous'],
        summary:
          'Comparison of extreme sports: "Rafting is more challenging than trekking." Key adjectives: "mysterious", "fascinating", "unbearable", "eye-catching".',
        sampleTestCount: 15,
        recommendedStudyMinutes: 25,
      },
      {
        unitNumber: 7,
        unitName: '7. Unit: Tourism (Vacations, Historic Sites & Climate)',
        shortTitle: 'Tourism',
        learningObjectives: [
          'Talk about vacation destinations, tourist attractions, and weather conditions.',
          'Describe experiences and accommodation options (all-inclusive, bed and breakfast).',
        ],
        keyConcepts: ['Historic sites / Architecture', 'All-inclusive resort / Hostel', 'Ancient civilizations', 'Souvenirs / Climate'],
        summary:
          'Tourism unit covers holiday types: "beach holiday", "cultural tour", "safari". Key questions: "What is the weather like?", "Have you ever visited...", "Which places should I see?".',
        sampleTestCount: 15,
        recommendedStudyMinutes: 25,
      },
      {
        unitNumber: 8,
        unitName: '8. Unit: Chores (Household Responsibilities & Obligations)',
        shortTitle: 'Chores',
        learningObjectives: [
          'Express obligations and responsibilities at home and school using "have to / must".',
          'Identify common household chores (doing laundry, dusting, taking out garbage).',
        ],
        keyConcepts: ['Must / Have to / Responsible for', 'Do the laundry / Iron the clothes', 'Empty the dishwasher / Vacuum the floor', 'Duty / Obligation'],
        summary:
          'Obligation phrases: "It is my duty to...", "I have to tidy up my room", "We must keep the environment clean".',
        sampleTestCount: 15,
        recommendedStudyMinutes: 25,
      },
      {
        unitNumber: 9,
        unitName: '9. Unit: Science (Scientific Inventions & Pioneers)',
        shortTitle: 'Science',
        learningObjectives: [
          'Talk about past and current scientific achievements, inventors and laboratory actions.',
          'Describe actions happening at the moment of speaking or in the past.',
        ],
        keyConcepts: ['Discover vs Invent', 'Scientist / Lab equipment / Microscope', 'Test tube / Vaccine / Solar system', 'Conduct an experiment'],
        summary:
          '"Invent" is creating something new that didn\'t exist before (Thomas Edison invented the light bulb); "discover" is finding something already existing (Newton discovered gravity).',
        sampleTestCount: 15,
        recommendedStudyMinutes: 25,
      },
      {
        unitNumber: 10,
        unitName: '10. Unit: Natural Forces (Disasters & Environmental Care)',
        shortTitle: 'Natural Forces',
        learningObjectives: [
          'Identify natural disasters (earthquake, flood, drought, avalanche, volcanic eruption).',
          'Give advice on protecting nature, saving water, and global warming consequences.',
        ],
        keyConcepts: ['Earthquake / Flood / Tsunami / Drought', 'Global warming / Deforestation', 'Take precautions / Waste water', 'Eco-friendly / Recycling'],
        summary:
          'Key vocabulary: "drought" (kuraklık), "flood" (sel), "avalanche" (çığ), "earthquake" (deprem). Recommendations: "We should plant trees and avoid wasting energy."',
        sampleTestCount: 15,
        recommendedStudyMinutes: 25,
      },
    ],
  },
  {
    id: 'Din Kültürü ve Ahlak Bilgisi',
    name: 'Din Kültürü ve Ahlak Bilgisi',
    shortName: 'Din Kültürü',
    icon: '🕌',
    gradeLevel: 'Ortaokul / LGS',
    colorScheme: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      activeBg: 'bg-amber-600',
      ring: 'ring-amber-400',
    },
    units: [
      {
        unitNumber: 1,
        unitName: '1. Ünite: Kader İnancı (Kaza ve Kader Kavramları)',
        shortTitle: 'Kader İnancı',
        learningObjectives: [
          'Kader ve kaza kavramlarını anlam ve terim yönünden açıklar.',
          'Allah’ın evrene koyduğu fiziksel, biyolojik ve toplumsal yasaları (Sünnetullah) ayırt eder.',
          'İnsanın ilmi, iradesi, sorumluluğu ile kader arasındaki ilişkiyi kurar.',
          'Kaderle ilgili kavramları (ömür, ecel, rızık, tevekkül, başarı, sağlık) doğru yorumlar.',
        ],
        keyConcepts: ['Külli İrade vs Cüzi İrade', 'Fiziksel Yasalar (Yer çekimi, suyun kaldırma kuvveti)', 'Biyolojik Yasalar (Hücre, DNA, üreme)', 'Toplumsal Yasalar (Adalet, göç)', 'Tevekkül (Çaba + Güven)'],
        summary:
          'Kader Allah’ın her şeyi bir ölçü ve düzene göre takdir etmesidir; kaza ise zamanı gelince gerçekleşmesidir. İnsanın özgür iradesi (cüzi irade) yaptığı eylemlerden sorumlu olmasını gerektirir. Tevekkül, tüm tedbirleri alıp çalıştıktan sonra sonucu Allah’a bırakmaktır; tedbir almadan beklemek tevekkül değildir.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 2,
        unitName: '2. Ünite: Zekat ve Sadaka İbadeti',
        shortTitle: 'Zekat ve Sadaka',
        learningObjectives: [
          'İslam’ın paylaşma ve yardımlaşmaya verdiği önemi ayet ve hadislerle açıklar.',
          'Zekat ve sadaka ibadetini; nisap miktarını, kimlere verilip verilemeyeceğini ve oranlarını kavrar.',
          'Sadaka-i cariye kavramını ve toplumsal faydalarını değerlendirir.',
        ],
        keyConcepts: ['Nisap Miktarı (80.18 gr Altın)', 'Zekat Oranları (1/40 - %2.5)', 'Toprak Ürünleri (Öşür: 1/10 veya 1/20)', 'Sadaka-i Cariye (Kalıcı Hayır)', 'Fıtır Sadakası (Fitre)'],
        summary:
          'Zekat, zengin olan Müslümanların yılda bir kez malının belirli bir kısmını ihtiyaç sahiplerine vermesidir. Altın, para ve ticaret mallarında oran 1/40’tır (%2.5). Sadaka-i cariye ise insan öldükten sonra da sevabı devam eden okul, çeşme, faydalı ilim gibi kalıcı hayırlardır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 3,
        unitName: '3. Ünite: Din ve Hayat (Dinin Temel Gayesi)',
        shortTitle: 'Din ve Hayat',
        learningObjectives: [
          'Dinin birey ve toplum hayatındaki yerini ve önemini açıklar.',
          'Dinin temel gayesini oluşturan zarûrât-ı hamse (can, nesil, akıl, mal ve din emniyeti) ilkelerini kavrar.',
        ],
        keyConcepts: ['Canın Korunması', 'Neslin Korunması (Aile)', 'Aklın Korunması (Zararlı maddelerden uzak durma)', 'Malın Korunması (Hırsızlık, faiz, israf yasağı)', 'Dinin Korunması'],
        summary:
          'İslam dininin temel gayesi beş temel değerin (zarûrât-ı hamse) korunmasıdır: Canın, neslin, aklın, malın ve dinin emniyeti. Bu değerler toplumun huzur ve barış içinde yaşamasının vazgeçilmez temelleridir.',
        sampleTestCount: 15,
        recommendedStudyMinutes: 25,
      },
      {
        unitNumber: 4,
        unitName: '4. Ünite: Hz. Muhammed’in Örnekliği',
        shortTitle: 'Hz. Muhammed’in Örnekliği',
        learningObjectives: [
          'Hz. Muhammed’in doğruluğunu, güvenilirliğini (Muhammedü’l-Emin), merhametini ve istişareye verdiği önemi kavrar.',
          'Hz. Muhammed’in cesaret ve kararlılığını olaylarla açıklar.',
        ],
        keyConcepts: ['El-Emin (Güvenilir İnsan)', 'İstişare (Danışma)', 'Merhamet ve Affedicilik', 'Hakkı Gözetme ve Adalet'],
        summary:
          'Peygamberimiz peygamberlik öncesinde de dürüstlüğü nedeniyle "Muhammedü\'l-Emin" olarak anılmıştır. Önemli kararlar alırken arkadaşlarına danışarak (istişare ederek) ortak akla ve katılımcılığa büyük önem vermiştir.',
        sampleTestCount: 15,
        recommendedStudyMinutes: 25,
      },
      {
        unitNumber: 5,
        unitName: '5. Ünite: İslam Dini ve Temel Kaynakları (Kur’an ve Sünnet)',
        shortTitle: 'Temel Kaynaklar',
        learningObjectives: [
          'İslam dininin iki ana kaynağı olan Kur’an-ı Kerim ve Hz. Muhammed’in sünnetinin bağlayıcılığını kavrar.',
          'Kur’an’ın ana konularını (inanç, ibadet, ahlak, muamelat ve kıssalar) açıklar.',
        ],
        keyConcepts: ['Kur’an-ı Kerim', 'Sünnet (Kavli, Fiili, Takriri)', 'İnanç & İbadet & Ahlak', 'Kıssalar'],
        summary:
          'İslam dininin birinci kaynağı vahiyle gelen Kur\'an-ı Kerim, ikinci kaynağı ise Peygamberimizin onu açıklayan ve uygulayan sünnetidir. İkisi birbirinden ayrılamaz bir bütündür.',
        sampleTestCount: 15,
        recommendedStudyMinutes: 25,
      },
    ],
  },
];
