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
  // ==========================================
  // 1. MATEMATİK - MEB 5. SINIF
  // ==========================================
  {
    id: 'Matematik',
    name: 'Matematik',
    shortName: 'Matematik',
    icon: '📐',
    gradeLevel: '5. Sınıf',
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
        unitName: '1. Ünite: Doğal Sayılar ve Doğal Sayılarla İşlemler',
        shortTitle: 'Doğal Sayılar ve İşlemler',
        learningObjectives: [
          'En çok dokuz basamaklı doğal sayıları okur ve yazar; basamak ve bölük kavramlarını açıklar.',
          'En çok beş basamaklı doğal sayılarla toplama ve çıkarma işlemini yapar.',
          'En çok üç basamaklı iki doğal sayının çarpma işlemini yapar.',
          'En çok dört basamaklı bir doğal sayıyı, en çok iki basamaklı bir doğal sayıya böler.',
          'Doğal sayılarla zihinden işlem stratejileri geliştirir ve işlem sonucunu tahmin eder.',
        ],
        keyConcepts: ['Bölükler (Birler, Binler, Milyonlar)', 'Basamak Değeri', 'Zihinden Toplama/Çıkarma', 'Kalanlı Bölme', 'Çarpma'],
        summary:
          '9 basamağa kadar olan sayılar birler, binler ve milyonlar bölüklerine ayrılarak okunur. Dört işlemde basamak hizalaması ve eldeler dikkatle hesaplanır; zihinden işlemlerde yuvarlama ve parçalama teknikleri kullanılır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 40,
      },
      {
        unitNumber: 2,
        unitName: '2. Ünite: Kesirler ve Kesirlerle İşlemler',
        shortTitle: 'Kesirler ve Kesirlerle İşlemler',
        learningObjectives: [
          'Birim kesirleri sayı doğrusunda gösterir ve sıralar.',
          'Bileşik kesri tam sayılı kesre, tam sayılı kesri bileşik kesre dönüştürür.',
          'Sadeleştirme ve genişletmenin kesrin değerini değiştirmediğini kavrar ve denk kesirler oluşturur.',
          'Paydaları eşit veya birinin paydası diğerinin katı olan kesirleri sıralar.',
          'Paydaları eşit veya birbiri ile genişletilebilen kesirlerle toplama ve çıkarma işlemlerini yapar.',
        ],
        keyConcepts: ['Birim Kesir', 'Tam Sayılı & Bileşik Kesir', 'Genişletme ve Sadeleştirme', 'Denk Kesirler', 'Payda Eşitleme'],
        summary:
          'Birim kesir 1/n şeklinde ifade edilir. Paydası eşit olmayan kesirlerde toplama veya çıkarma yapmadan önce genişletme ya da sadeleştirme ile ortak payda bulunur.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 40,
      },
      {
        unitNumber: 3,
        unitName: '3. Ünite: Ondalık Gösterim ve Yüzdeler',
        shortTitle: 'Ondalık Gösterim ve Yüzdeler',
        learningObjectives: [
          'Paydası 10, 100 veya 1000 olan kesirleri ondalık gösterim olarak ifade eder.',
          'Ondalık gösterimde tam kısım ve kesir kısmındaki basamak isimlerini ve basamak değerlerini belirler.',
          'Ondalık gösterimleri sayı doğrusunda gösterir ve sıralar.',
          'Paydası 100 olan kesirleri yüzde sembolü (%) ile gösterir.',
          'Bir çokluğun belirtilen bir yüzdesini hesaplar.',
        ],
        keyConcepts: ['Virgül ve Basamaklar (Onda Birler, Yüzde Birler)', 'Ondalık Sayılarda Toplama', 'Yüzde Sembolü (%)', 'Yüzde Hesaplama'],
        summary:
          'Paydası 10, 100 veya 1000 yapılan kesirler virgül kullanılarak ondalık gösterilir. Yüzdeler ise bütünü 100 eş parçaya bölerek parçayı temsil eder.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 40,
      },
      {
        unitNumber: 4,
        unitName: '4. Ünite: Temel Geometrik Kavramlar, Üçgenler ve Dörtgenler',
        shortTitle: 'Geometri: Açılar, Üçgen ve Dörtgenler',
        learningObjectives: [
          'Doğru, doğru parçası ve ışını açıklar; sembolle gösterir.',
          'İki doğrunun birbirine göre paralel, kesişen veya dik olma durumlarını belirler.',
          'Açıları dar, dik, geniş ve doğru açı olarak sınıflandırır.',
          'Üçgenleri açılarına (dar, dik, geniş açılı) ve kenarlarına (eşkenar, ikizkenar, çeşitkenar) göre sınıflandırır.',
          'Üçgenin iç açılarının toplamının 180°, dörtgenlerin iç açılarının toplamının 360° olduğunu keşfeder.',
        ],
        keyConcepts: ['Doğru / Işın / Doğru Parçası', 'Diklik ve Paralellik', 'Dar, Dik, Geniş Açı', 'İç Açı Toplamı (180° ve 360°)', 'Paralelkenar / Eşkenar Dörtgen'],
        summary:
          'Açı ölçüsü 90° olan açılar dik açıdır. Üçgenin iç açıları toplamı her zaman 180 derece, kare ve dikdörtgen gibi dörtgenlerin iç açıları toplamı ise 360 derecedir.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 40,
      },
      {
        unitNumber: 5,
        unitName: '5. Ünite: Veri İşleme / Uzunluk ve Zaman Ölçme',
        shortTitle: 'Veri İşleme ve Zaman Ölçüleri',
        learningObjectives: [
          'Veri toplamayı gerektiren araştırma soruları üretir ve verileri sıklık tablosu ile sütun grafiğinde gösterir.',
          'Sütun grafiği ve sıklık tablosunu yorumlar.',
          'Uzunluk ölçme birimlerini (km, m, dm, cm, mm) tanır ve birbirine dönüştürür.',
          'Zaman ölçme birimlerini (saat, dakika, saniye, gün, hafta, ay, yıl) birbirine dönüştürür ve zaman problemlerini çözer.',
        ],
        keyConcepts: ['Araştırma Sorusu', 'Sıklık Tablosu', 'Sütun Grafiği', 'Metre ve Katları', 'Saat - Dakika Dönüşümü'],
        summary:
          'Veriler sıklık tablosu ve sütun grafiği ile görselleştirilir. Uzunluk ölçülerinde her basamakta 10 ile çarpılır veya bölünür. 1 saat 60 dakika, 1 dakika 60 saniyedir.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 35,
      },
      {
        unitNumber: 6,
        unitName: '6. Ünite: Alan Ölçme ve Geometrik Cisimler',
        shortTitle: 'Alan Ölçme ve Prizmalar',
        learningObjectives: [
          'Dikdörtgenin alanını santimetrekare ve metrekare cinsinden hesaplar.',
          'Alanı bilinen bir dikdörtgenin kenar uzunluklarını belirler.',
          'Dikdörtgenler prizmasını tanır; yüzey, ayrıt ve köşe özelliklerini açıklar.',
          'Dikdörtgenler prizmasının açınımını çizer ve yüzey alanını hesaplar.',
        ],
        keyConcepts: ['Dikdörtgenin Alanı (Kısa × Uzun)', 'Kenar Bağıntıları', 'Dikdörtgenler Prizması', 'Yüzey Açınımı', 'Köşe ve Ayrıt'],
        summary:
          'Dikdörtgenin alanı kısa kenar ile uzun kenarın çarpımı ile bulunur. Dikdörtgenler prizmasının 6 yüzü, 12 ayrıtı ve 8 köşesi vardır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 40,
      },
    ],
  },

  // ==========================================
  // 2. FEN BİLİMLERİ - MEB 5. SINIF
  // ==========================================
  {
    id: 'Fen Bilimleri',
    name: 'Fen Bilimleri',
    shortName: 'Fen Bilimleri',
    icon: '🔬',
    gradeLevel: '5. Sınıf',
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
        unitName: '1. Ünite: Güneş, Dünya ve Ay',
        shortTitle: 'Güneş, Dünya ve Ay',
        learningObjectives: [
          'Güneş’in yapısını ve dönme hareketini açıklar.',
          'Ay’ın yapısını, atmosferinin yok denecek kadar az olduğunu ve yüzeyindeki kraterleri açıklar.',
          'Ay’ın ana ve ara evrelerini (Yeni Ay, İlk Dördün, Dolunay, Son Dördün) sıralar ve açıklar.',
          'Güneş, Dünya ve Ay’ın birbirine göre hareketlerini ve sürelerini kavrar.',
        ],
        keyConcepts: ['Güneş Lekeleri', 'Kraterler', 'Ay’ın Evreleri', 'Dönme ve Dolanma Hareketleri', '29.5 Günlük Periyot'],
        summary:
          'Güneş orta büyüklükte sıcak bir yıldızdır. Ay, Dünya etrafında yaklaşık 27.3 günde dolanır ve 29.5 günde evrelerini tamamlar. Ay’da atmosfer yok denecek kadar az olduğu için hava olayları görülmez ve kraterler bozulmadan kalır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 40,
      },
      {
        unitNumber: 2,
        unitName: '2. Ünite: Canlılar Dünyası',
        shortTitle: 'Canlıların Sınıflandırılması',
        learningObjectives: [
          'Canlıları benzerlik ve farklılıklarına göre mikroskobik canlılar, mantarlar, bitkiler ve hayvanlar olarak sınıflandırır.',
          'Mikroskobik canlıların yararlı (sütten yoğurt, hamur mayası) ve zararlı (hastalık yapıcı) türlerini ayırt eder.',
          'Mantarların şapkalı, küf, maya ve parazit mantarlar olmak üzere çeşitlerini açıklar.',
          'Bitkileri çiçekli ve çiçeksiz bitkiler olarak ayırt eder.',
          'Hayvanları omurgalı (balık, kurbağa, sürüngen, kuş, memeli) ve omurgasız olarak sınıflandırır.',
        ],
        keyConcepts: ['Mikroskobik Canlılar', 'Şapkalı / Maya / Küf Mantarları', 'Çiçekli ve Çiçeksiz Bitkiler', 'Omurgalılar (Memeliler, Kuşlar)', 'Omurgasızlar'],
        summary:
          'Canlılar mikroskobik canlılar, mantarlar, bitkiler ve hayvanlar olarak 4 gruba ayrılır. Mantarlar bitki değildir, fotosentez yapamazlar. Memeliler doğurarak çoğalır ve yavrularını sütle besler.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 40,
      },
      {
        unitNumber: 3,
        unitName: '3. Ünite: Kuvvetin Ölçülmesi ve Sürtünme',
        shortTitle: 'Kuvvet ve Sürtünme',
        learningObjectives: [
          'Kuvvetin büyüklüğünü dinamometre ile ölçer ve biriminin Newton (N) olduğunu belirtir.',
          'Sürtünme kuvvetinin pürüzlü ve kaygan yüzeylerdeki etkisini karşılaştırır.',
          'Hava ve su direncinin sürtünme kuvveti olduğunu keşfeder.',
          'Sürtünme kuvvetinin günlük hayattaki olumlu ve olumsuz yönlerini tartışır.',
        ],
        keyConcepts: ['Dinamometre ve Yay Esnekliği', 'Birim: Newton (N)', 'Sürtünme Kuvveti', 'Hava ve Su Direnci', 'Sürtünmeyi Artırma/Azaltma'],
        summary:
          'Kuvvet dinamometre ile ölçülür ve birimi Newton’dur. Sürtünme kuvveti hareketi zorlaştırır veya durdurur; buzlu yollara kum dökülmesi sürtünmeyi artırırken, makinelerin yağlanması sürtünmeyi azaltır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 35,
      },
      {
        unitNumber: 4,
        unitName: '4. Ünite: Madde ve Değişim',
        shortTitle: 'Maddenin Hâl Değişimi ve Isı',
        learningObjectives: [
          'Maddelerin ısı etkisiyle erime, donma, buharlaşma, yoğuşma, süblimleşme ve kırağılaşma hâl değişimlerini açıklar.',
          'Saf maddelerin erime, donma ve kaynama noktalarını ayırt edici özellik olarak kavrar.',
          'Isı ve sıcaklık arasındaki farkları açıklar.',
          'Maddelerin ısı alışverişi sonucu genleştiğini ve büzüldüğünü örneklerle açıklar.',
        ],
        keyConcepts: ['Hâl Değişimleri', 'Erime / Donma / Kaynama Noktası', 'Isı (Kalori/Joule) ve Sıcaklık (°C)', 'Genleşme ve Büzülme'],
        summary:
          'Isı bir enerji türüdür (joule/kalori), sıcaklık ise termometreyle ölçülen bir değerdir (°C). Katı bir maddenin doğrudan gaza geçmesine süblimleşme, gazın katıya geçmesine kırağılaşma denir. Isınan maddeler genleşir, soğuyan maddeler büzülür.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 40,
      },
      {
        unitNumber: 5,
        unitName: '5. Ünite: Işığın Yayılması',
        shortTitle: 'Işığın Yayılması ve Tam Gölge',
        learningObjectives: [
          'Işığın doğrusal bir yolla her yöne yayıldığını gösterir.',
          'Işığın yansımasını düzgün ve dağınık yansıma olarak sınıflandırır.',
          'Saydam, yarı saydam ve opak (saydam olmayan) maddeleri karşılaştırır.',
          'Tam gölgenin nasıl oluştuğunu ve gölge boyunun ışık kaynağının konumuna göre nasıl değiştiğini açıklar.',
        ],
        keyConcepts: ['Doğrusal Yayılma', 'Düzgün ve Dağınık Yansıma', 'Saydam / Yarı Saydam / Opak', 'Tam Gölge Oluşumu', 'Gölge Boyu Değişimi'],
        summary:
          'Işık her yöne ve doğrusal ışınlar halinde yayılır. Işığı geçirmeyen opak maddelerin arkasında tam gölge oluşur. Işık kaynağı cisme yaklaştıkça gölge boyu büyür.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 35,
      },
      {
        unitNumber: 6,
        unitName: '6. Ünite: İnsan ve Çevre',
        shortTitle: 'Biyoçeşitlilik ve Çevre Kirliliği',
        learningObjectives: [
          'Biyoçeşitliliğin doğal yaşam ve insan için önemini açıklar.',
          'Nesli tükenen veya tükenme tehlikesi altında olan canlı türlerini örneklerle belirtir.',
          'Hava, su ve toprak kirliliğinin nedenlerini ve önleme yollarını değerlendirir.',
          'Yıkıcı doğa olaylarını (deprem, sel, heyelan, fırtına, volkanik patlama) ve korunma yollarını öğrenir.',
        ],
        keyConcepts: ['Biyoçeşitlilik', 'Nesli Tükenen Canlılar (Mamut, Dinozor, Moa)', 'Tehlikedeki Canlılar (Kelaynak, Akdeniz Foku)', 'Çevre Koruma', 'Doğal Afetler'],
        summary:
          'Bir bölgedeki canlı türlerinin sayı ve çeşit zenginliğine biyoçeşitlilik denir. Doğal dengenin korunması için geri dönüşüm yapılmalı, su ve enerji tasarrufu sağlanmalıdır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 35,
      },
      {
        unitNumber: 7,
        unitName: '7. Ünite: Elektrik Devre Elemanları',
        shortTitle: 'Basit Elektrik Devresi',
        learningObjectives: [
          'Basit bir elektrik devresini oluşturan elemanları (pil, ampul, anahtar, bağlantı kablosu) sembolleriyle çizer.',
          'Devre şeması ile devre modelini eşleştirir.',
          'Bir elektrik devresindeki ampul parlaklığının pil sayısı ve ampul sayısına bağlı olarak nasıl değiştiğini açıklar.',
        ],
        keyConcepts: ['Devre Sembolleri', 'Pil, Ampul, Anahtar, İletken Kablo', 'Bağımsız ve Bağımlı Değişken', 'Ampul Parlaklığı'],
        summary:
          'Devre elemanları uluslararası ortak sembollerle gösterilir. Pil sayısı artarsa ampul parlaklığı artar; ampul sayısı artarsa ampullerin parlaklığı azalır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 35,
      },
    ],
  },

  // ==========================================
  // 3. TÜRKÇE - MEB 5. SINIF
  // ==========================================
  {
    id: 'Türkçe',
    name: 'Türkçe',
    shortName: 'Türkçe',
    icon: '📖',
    gradeLevel: '5. Sınıf',
    colorScheme: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      activeBg: 'bg-orange-600',
      ring: 'ring-orange-400',
    },
    units: [
      {
        unitNumber: 1,
        unitName: '1. Ünite: Sözcükte Anlam',
        shortTitle: 'Sözcükte Anlam Özellikleri',
        learningObjectives: [
          'Kelimelerin gerçek (temel), mecaz ve terim anlamlarını ayırt eder.',
          'Eş anlamlı (anlamdaş) ve zıt (karşıt) anlamlı kelimeleri belirler.',
          'Eş sesli (sesteş) kelimelerin cümle içindeki anlamlarını kavrar.',
          'Kelimelerin çağrıştırdığı duygu ve kavramları yorumlar.',
        ],
        keyConcepts: ['Gerçek Anlam', 'Mecaz Anlam', 'Terim Anlam', 'Eş / Zıt Anlam', 'Eş Sesli Sözcükler'],
        summary:
          'Kelimenin akla gelen ilk anlamına gerçek anlam, gerçek anlamından tamamen uzaklaşarak kazandığı yeni anlama mecaz anlam denir. Bilim, sanat ve meslek dallarına ait özel kelimeler ise terim anlamlıdır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 35,
      },
      {
        unitNumber: 2,
        unitName: '2. Ünite: Cümlede Anlam',
        shortTitle: 'Cümle Anlamı ve İlişkileri',
        learningObjectives: [
          'Neden-sonuç, amaç-sonuç ve koşul-sonuç cümlelerini tespit eder.',
          'Öznel ve nesnel yargılı ifadeleri ayırt eder.',
          'Abartma, benzetme, karşılaştırma ve duygu bildiren cümleleri kavrar.',
          'Cümleler arası anlam ilişkilerini ve örtülü anlamı yorumlar.',
        ],
        keyConcepts: ['Neden-Sonuç (Çünkü / İçin)', 'Amaç-Sonuç (Amacıyla)', 'Koşul (-se / -sa)', 'Öznel ve Nesnel Anlatım', 'Benzetme ve Karşılaştırma'],
        summary:
          'Kişiden kişiye değişmeyen, kanıtlanabilir yargılar nesnel; kişisel beğeni ve yorum içeren yargılar ise özneldir. Neden-sonuçta gerçekleşmiş iki durum, amaç-sonuçta ise henüz gerçekleşmemiş bir hedef vardır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 35,
      },
      {
        unitNumber: 3,
        unitName: '3. Ünite: Paragrafta Anlam ve Yapı',
        shortTitle: 'Paragrafta Anlam, Ana Düşünce ve Başlık',
        learningObjectives: [
          'Metnin konusunu ve ana fikrini (ana düşüncesini) bulur.',
          'Metindeki yardımcı fikirleri (yardımcı düşünceleri) tespit eder.',
          'Metne uygun başlık belirler.',
          'Paragrafın giriş, gelişme ve sonuç bölümlerini ve akışı bozan cümleleri çözümler.',
        ],
        keyConcepts: ['Ana Fikir (Ana Düşünce)', 'Metnin Konusu', 'Yardımcı Fikirler', 'Metin Başlığı', 'Paragraf Akışı'],
        summary:
          'Yazarın okuyucuya iletmek istediği asıl mesaja ana fikir denir. Paragrafta üzerinde durulan olay ya da durum ise metnin konusudur. Başlık konu ve ana fikirle doğrudan uyumlu olmalıdır.',
        sampleTestCount: 25,
        recommendedStudyMinutes: 40,
      },
      {
        unitNumber: 4,
        unitName: '4. Ünite: Metin Türleri ve Söz Sanatları',
        shortTitle: 'Metin Türleri ve Söz Sanatları',
        learningObjectives: [
          'Olay yazıları (hikâye, masal, fabl, anı) ile düşünce ve bildirme yazılarını (mektup, şiir) ayırt eder.',
          'Hikâye unsurlarını (olay, yer, zaman, şahıs kadrosu) analiz eder.',
          'Kişileştirme (teşhis) ve benzetme (teşbih) söz sanatlarını metinlerde belirler.',
        ],
        keyConcepts: ['Hikâye (Öykü)', 'Masal ve Fabl', 'Şiir ve Dize', 'Kişileştirme (İnsana Özgü Nitelik Verme)', 'Benzetme (Gibi / Kadar)'],
        summary:
          'İnsan dışındaki varlıklara insani özellikler yüklenmesine kişileştirme denir. Nitelikçe zayıf olanın güçlü olana benzetilmesine ise benzetme adı verilir.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 35,
      },
      {
        unitNumber: 5,
        unitName: '5. Ünite: Dil Bilgisi - Kökler ve Ekler',
        shortTitle: 'Kökler, Yapım ve Çekim Ekleri',
        learningObjectives: [
          'Kelimelerin kökünü (isim kökü ve fiil kökü) tespit eder.',
          'Yapım eklerini ve türemiş kelimeleri kavrar.',
          'Çekim eklerinin (çoğul eki, hâl ekleri, iyelik eki) kelimenin anlamını değiştirmediğini fark eder.',
        ],
        keyConcepts: ['Kelime Kökü (İsim / Fiil Kökü)', 'Yapım Ekleri (-lik, -ci, -siz, -li)', 'Türemiş Sözcük', 'Çekim Ekleri (-ler, -e, -de, -den)'],
        summary:
          'Bir sözcüğün parçalanamayan, anlamlı en küçük parçasına kök denir. Eklendiği sözcükten yeni anlamlı kelime türeten eklere yapım eki, sadece biçimini düzenleyen eklere çekim eki denir.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 35,
      },
      {
        unitNumber: 6,
        unitName: '6. Ünite: Yazım Kuralları ve Noktalama İşaretleri',
        shortTitle: 'Yazım Kuralları ve Noktalama',
        learningObjectives: [
          'Büyük harflerin kullanıldığı yerleri kurallarına uygun yazar.',
          'Bağlaç olan "da/de" ile durum eki olan "-de/-da"nın yazımını ayırt eder.',
          'Soru eki "mı/mi/mu/mü"nün ve bağlaç olan "ki"nin yazımını uygular.',
          'Nokta, virgül, iki nokta, noktalı virgül, tırnak işareti, soru ve ünlem işaretlerini yerinde kullanır.',
        ],
        keyConcepts: ['Büyük Harf Kuralları', 'da / de Yazımı', 'Soru Eki (mi)', 'Nokta ve Virgül', 'Tırnak ve İki Nokta'],
        summary:
          'Cümleden çıkarıldığında anlam bozulmuyorsa "da/de" bağlaçtır ve ayrı yazılır. Soru eki olan "mı/mi" her zaman kendinden önceki sözcükten ayrı yazılır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 35,
      },
    ],
  },

  // ==========================================
  // 4. SOSYAL BİLGİLER - MEB 5. SINIF
  // ==========================================
  {
    id: 'Sosyal Bilgiler',
    name: 'Sosyal Bilgiler',
    shortName: 'Sosyal Bilgiler',
    icon: '🌍',
    gradeLevel: '5. Sınıf',
    colorScheme: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      activeBg: 'bg-blue-600',
      ring: 'ring-blue-400',
    },
    units: [
      {
        unitNumber: 1,
        unitName: '1. Ünite: Birey ve Toplum',
        shortTitle: 'Haklarımız, Rollerimiz ve Çocuk Hakları',
        learningObjectives: [
          'İçinde bulunduğu gruplardaki rollerini ve bu rollerin getirdiği hak ve sorumlulukları ilişkilendirir.',
          'Çocuk Haklarına Dair Sözleşme’yi ve çocukların temel haklarını açıklar.',
          'Birlikte yaşamanın gerektirdiği kurallara, sevgi ve saygıya değer verir.',
        ],
        keyConcepts: ['Rol ve Sorumluluk', 'Hak ve Özgürlük', 'Çocuk Hakları Sözleşmesi', 'Grup ve Kulüpler'],
        summary:
          'Birey ailede evlat, okulda öğrenci gibi farklı rollere sahiptir. Her rol sorumluluk getirir. Her çocuğun yaşama, eğitim alma, korunma ve oyun oynama hakkı vardır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 2,
        unitName: '2. Ünite: Kültür ve Miras',
        shortTitle: 'Anadolu ve Mezopotamya Uygarlıkları',
        learningObjectives: [
          'Anadolu uygarlıklarını (Hitit, Frig, Lidyalılar, İyonlar, Urartular) ve insanlığa katkılarını tanır.',
          'Mezopotamya uygarlıklarını (Sümerler, Babiller, Asurlar) ve icatlarını (yazı, tekerlek, kütüphane) açıklar.',
          'Çevresindeki tarihî mekânları, nesneleri ve kültürel ögeleri (halk oyunları, bayramlar) tanıtır.',
        ],
        keyConcepts: ['Sümerler ve Çivi Yazısı', 'Hititler (Pankuş Meclisi, Kadeş Barışı)', 'Frigler (Fibula, Kibele)', 'Lidyalılar (Para)', 'Tarihî ve Kültürel Miras'],
        summary:
          'Sümerler çivi yazısını ve tekerleği icat etmiştir. Lidyalılar parayı bulmuş, Frigler tarım ve hayvancılığı koruyan sert yasalar koymuştur. Kültürel mirasımız geçmişle geleceği birbirine bağlar.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 35,
      },
      {
        unitNumber: 3,
        unitName: '3. Ünite: İnsanlar, Yerler ve Çevreler',
        shortTitle: 'Yeryüzü Şekilleri, İklim ve Afetler',
        learningObjectives: [
          'Haritalardaki renk ve sembolleri (lejant) kullanarak yeryüzü şekillerini (dağ, ova, plato, vadi, körfez) ayırt eder.',
          'Türkiye’de görülen iklim tiplerini (Karadeniz, Akdeniz, Karasal) ve insan yaşamına etkilerini açıklar.',
          'Doğal afetlerin oluşum nedenlerini ve afet anında yapılması gerekenleri kavrar.',
        ],
        keyConcepts: ['Fiziki Harita Renkleri', 'Dağ, Ova, Plato', 'Akdeniz / Karadeniz / Karasal İklim', 'Doğal Afetler (Deprem, Erozyon, Çığ)'],
        summary:
          'Fiziki haritalarda yeşil alçak yerleri (0-500 m), kahverengi yüksek dağları gösterir. Karadeniz iklimi her mevsim yağışlıdır; Akdeniz ikliminde yazlar sıcak ve kurak, kışlar ılık ve yağışlıdır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 35,
      },
      {
        unitNumber: 4,
        unitName: '4. Ünite: Bilim, Teknoloji ve Toplum',
        shortTitle: 'Doğru Bilgiye Ulaşma ve Buluşlar',
        learningObjectives: [
          'Teknolojinin günlük yaşantımıza olumlu ve olumsuz etkilerini değerlendirir.',
          'İnternet ortamında doğru ve güvenilir bilgiye ulaşma yöntemlerini açıklar.',
          'Bilim insanlarının ve mucitlerin ortak özelliklerini (merak, sabır, kararlılık) kavrar.',
          'Fikir ve sanat eserlerinde telif ve patent haklarına saygı gösterir.',
        ],
        keyConcepts: ['Sanal Güvenlik', 'Güvenilir Kaynaklar (.edu, .gov)', 'Mucitlerin Özellikleri', 'Telif Hakkı ve Patent', 'Kütüphane Kullanımı'],
        summary:
          'İnternetteki her bilgi doğru değildir; kaynaklar sorgulanmalı ve güvenilir sitelerden yararlanılmalıdır. Başkalarının fikir ve ürünlerini kullanırken kaynak belirtmek ve telif haklarına uymak yasal zorunluluktur.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 5,
        unitName: '5. Ünite: Üretim, Dağıtım ve Tüketim',
        shortTitle: 'Ekonomik Faaliyetler ve Bilinçli Tüketici',
        learningObjectives: [
          'Yaşadığı bölgedeki başlıca ekonomik faaliyetleri (tarım, hayvancılık, sanayi, turizm, ticaret, madencilik) açıklar.',
          'Ekonomik faaliyetlerin ortaya çıkardığı meslekleri tanır.',
          'Bilinçli bir tüketici olarak haklarını korur; alışverişte fiş/fatura alır, son kullanma tarihine ve TSE damgasına bakar.',
        ],
        keyConcepts: ['Tarım, Hayvancılık, Sanayi', 'Meslekler', 'Bilinçli Tüketici', 'TSE Damgası ve Garanti Belgesi', 'Tüketici Hakem Heyeti'],
        summary:
          'Coğrafi özellikler ekonomik faaliyetleri belirler. Bilinçli tüketici ihtiyacına göre harcama yapar, ayıplı mal karşısında değişim veya iade hakkını kullanır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 6,
        unitName: '6. Ünite: Etkin Vatandaşlık',
        shortTitle: 'Yönetim Birimleri ve Temel Haklarımız',
        learningObjectives: [
          'Merkeze bağlı yönetim birimlerini (Valilik, Kaymakamlık) ve yerel yönetimleri (Belediye, Muhtarlık) görevleriyle tanır.',
          'Temel hak ve hürriyetlerimizi (yaşama, eğitim, sağlık, dilekçe hakkı) öğrenir.',
          'Toplumsal sorunlara duyarlılık gösterir ve dilekçe yazma hakkını kullanır.',
        ],
        keyConcepts: ['Valilik ve Kaymakamlık', 'Belediye ve Muhtarlık', 'Temel Haklar', 'Dilekçe Hakkı', 'Sivil Toplum Kuruluşları (STK)'],
        summary:
          'İli vali, ilçeyi kaymakam yönetir. Belediye ve muhtarlıklar seçimle iş başına gelir. Vatandaşlar istek ve şikayetlerini yetkili kurumlara dilekçe vererek iletme hakkına sahiptir.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 7,
        unitName: '7. Ünite: Küresel Bağlantılar',
        shortTitle: 'Dünya Çocukları ve Kültür Köprüleri',
        learningObjectives: [
          'Ülkemizin diğer ülkelerle olan ekonomik ve kültürel ilişkilerini kavrar.',
          'Dünyadaki farklı kültürleri ve çocuk bayramlarını tanır.',
          'Uluslararası turizmin barışa ve hoşgörüye katkısını değerlendirir.',
        ],
        keyConcepts: ['İhracat (Dış Satım)', 'İthalat (Dış Alım)', 'Farklı Kültürler', '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı'],
        summary:
          '23 Nisan dünyada çocuklara armağan edilmiş tek evrensel çocuk bayramıdır. Ülkeler arası ticaret ve turizm karşılıklı saygı ve dostluğu güçlendirir.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
    ],
  },

  // ==========================================
  // 5. İNGİLİZCE - MEB 5. SINIF
  // ==========================================
  {
    id: 'İngilizce',
    name: 'İngilizce',
    shortName: 'İngilizce',
    icon: '🇬🇧',
    gradeLevel: '5. Sınıf',
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
        unitName: 'Unit 1: Hello',
        shortTitle: 'Unit 1: Hello & School Subjects',
        learningObjectives: [
          'Introduce oneself and greet others politely.',
          'Ask and answer about country, nationality, and spoken languages.',
          'Express likes and dislikes about school subjects (Maths, Science, Art, English, PE).',
        ],
        keyConcepts: ['Greetings', 'Countries & Nationalities', 'Languages', 'School Subjects', 'Like / Dislike / Love'],
        summary:
          '"Where are you from? - I am from Turkey. I am Turkish." Öğrenciler okul dersleri hakkında konuşur: "My favourite class is Science."',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 2,
        unitName: 'Unit 2: My Town',
        shortTitle: 'Unit 2: My Town & Directions',
        learningObjectives: [
          'Identify public buildings in a town (pharmacy, bakery, museum, hospital, library).',
          'Give and understand simple directions (turn left, turn right, go straight ahead).',
          'Use prepositions of place (opposite, next to, between, in front of, behind).',
        ],
        keyConcepts: ['Places in Town', 'Prepositions (Next to, Between)', 'Giving Directions', 'Excuse me, where is the...'],
        summary:
          '"The pharmacy is between the bakery and the bank. Turn left and go straight ahead."',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 3,
        unitName: 'Unit 3: Games and Hobbies',
        shortTitle: 'Unit 3: Games and Hobbies',
        learningObjectives: [
          'Talk about traditional and modern games (hopscotch, blind man’s buff, dodgeball, origami).',
          'Express ability and inability using can and can’t.',
          'Talk about hobbies and free-time activities.',
        ],
        keyConcepts: ['Traditional Games', 'Can / Can’t', 'Origami / Sculpting', 'Likes and Hobbies'],
        summary:
          '"Can you play chess? - Yes, I can. I like playing hide and seek and dodgeball."',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 4,
        unitName: 'Unit 4: My Daily Routine',
        shortTitle: 'Unit 4: My Daily Routine',
        learningObjectives: [
          'Tell the time (o’clock, half past, quarter past, quarter to).',
          'Describe daily routines from morning to evening (wake up, brush teeth, have breakfast, do homework).',
          'Use Simple Present Tense for regular habits.',
        ],
        keyConcepts: ['Telling the Time', 'Daily Routine Verbs', 'Simple Present Tense', 'Morning / Afternoon / Night'],
        summary:
          '"What time is it? - It is half past eight. I wake up at 7 o’clock and brush my teeth."',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 5,
        unitName: 'Unit 5: Health',
        shortTitle: 'Unit 5: Health & Illnesses',
        learningObjectives: [
          'Express health problems and illnesses (a headache, a toothache, a sore throat, the flu, a cough).',
          'Give advice to someone who is ill using should and shouldn’t.',
          'Understand doctor-patient dialogues.',
        ],
        keyConcepts: ['Illnesses (Cold, Fever, Broken arm)', 'Should / Shouldn’t', 'See a doctor', 'Drink warm mint tea'],
        summary:
          '"What is the matter with you? - I have a bad headache. You should rest and take your medicine."',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 6,
        unitName: 'Unit 6: Movies',
        shortTitle: 'Unit 6: Movies & Characters',
        learningObjectives: [
          'Describe movie types (animation, comedy, drama, science fiction, action).',
          'Express opinions about characters (brave, evil, funny, friendly, strong).',
        ],
        keyConcepts: ['Movie Genres', 'Character Adjectives', 'What type of movie is it?', 'I think it is funny'],
        summary:
          '"What kind of movies do you like? - I love animation movies because they are colourful and exciting."',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 7,
        unitName: 'Unit 7: Party Time',
        shortTitle: 'Unit 7: Party Time & Days/Months',
        learningObjectives: [
          'Ask and tell dates, months of the year, and ordinal numbers (first, second, third).',
          'Make invitations and permission requests (Can I have a birthday party? Must buy balloons).',
        ],
        keyConcepts: ['Months of the Year', 'Ordinal Numbers (1st, 2nd, 3rd)', 'Party Needs (Candles, Cake, Gifts)', 'Invitation Cards'],
        summary:
          '"When is your birthday? - It is on the fifth of May. Can I invite my classmates to the party?"',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 8,
        unitName: 'Unit 8: Fitness',
        shortTitle: 'Unit 8: Fitness & Sports',
        learningObjectives: [
          'Name various sports and fitness activities (cycling, swimming, running, hiking, roller skating).',
          'Make suggestions using "Let’s...", "How about...?", "Shall we...?"',
          'Accept and refuse invitations politely.',
        ],
        keyConcepts: ['Sports Activities', 'Suggestions (Let’s swim / How about cycling?)', 'Accepting / Refusing'],
        summary:
          '"Let’s go roller skating in the park! - That sounds great / I am sorry, I am too tired."',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 9,
        unitName: 'Unit 9: The Animal Shelter',
        shortTitle: 'Unit 9: The Animal Shelter',
        learningObjectives: [
          'Identify domestic and farm animals in a shelter (puppy, kitten, rabbit, horse, duck).',
          'Describe actions happening at the moment using Present Continuous Tense (is sleeping, are feeding).',
          'Express responsibility for animal welfare.',
        ],
        keyConcepts: ['Animals in Shelter', 'Present Continuous (am/is/are + -ing)', 'Feeding, Bathing, Playing', 'Adopting a pet'],
        summary:
          '"Look! The vet is examining the puppy. The children are feeding the kittens."',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 10,
        unitName: 'Unit 10: Festivals',
        shortTitle: 'Unit 10: Festivals & Celebrations',
        learningObjectives: [
          'Talk about national and religious festivals (Children’s Day, Republic Day, Ramadan Feast).',
          'Count numbers up to 1000.',
          'Describe festival traditions and celebrations (wear costumes, decorate classrooms, watch parades).',
        ],
        keyConcepts: ['Festivals', 'Numbers 100-1000', 'Traditions & Costumes', 'Parades & Fireworks'],
        summary:
          '"We celebrate Children’s Day on the 23rd of April. We sing songs, wave flags and watch ceremonies."',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
    ],
  },

  // ==========================================
  // 6. DİN KÜLTÜRÜ VE AHLAK BİLGİSİ - MEB 5. SINIF
  // ==========================================
  {
    id: 'Din Kültürü',
    name: 'Din Kültürü ve Ahlak Bilgisi',
    shortName: 'Din Kültürü',
    icon: '🕌',
    gradeLevel: '5. Sınıf',
    colorScheme: {
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      border: 'border-teal-200',
      activeBg: 'bg-teal-600',
      ring: 'ring-teal-400',
    },
    units: [
      {
        unitNumber: 1,
        unitName: '1. Ünite: Allah İnancı',
        shortTitle: 'Allah İnancı ve İhlas Suresi',
        learningObjectives: [
          'Evrendeki mükemmel düzen ile Allah’ın varlığı ve birliği arasında bağ kurar.',
          'Allah’ın yaratan (el-Hâlık), gören (el-Basîr), işiten (es-Semî’) ve her şeye gücü yeten (el-Kâdir) olduğunu açıklar.',
          'İhlas Suresi’ni okur ve anlamını açıklar.',
        ],
        keyConcepts: ['Tevhid (Allah’ın Birliği)', 'Esma-i Hüsna (El-Hâlık, Es-Semî, El-Basîr)', 'Dua Etmenin Önemi', 'İhlas Suresi'],
        summary:
          'Evrendeki her şey belirli bir ölçü ve düzen içinde yaratılmıştır. Allah tektir; hiçbir şeye muhtaç değildir. İhlas Suresi tevhid inancını en güzel şekilde açıklar.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 2,
        unitName: '2. Ünite: Ramazan ve Oruç',
        shortTitle: 'Ramazan Ayı ve Oruç İbadeti',
        learningObjectives: [
          'Ramazan ayının ve Kur’an-ı Kerim’in bu ayda indirilmeye başlanmasının önemini kavrar.',
          'Oruç ibadetini, sahur, imsak, iftar ve teravih namazı kavramlarını açıklar.',
          'Orucun insana kazandırdığı sabır, yardımlaşma ve paylaşma duygularını fark eder.',
        ],
        keyConcepts: ['Sahur ve İmsak', 'İftar Vakti', 'Teravih Namazı', 'Fitre (Fıtır Sadakası)', 'Kadir Gecesi'],
        summary:
          'Ramazan on bir ayın sultanıdır. İmsak vaktinden akşam ezanına kadar yeme içmeden uzak durularak oruç tutulur. Ramazan ayı dayanışma ve yardımlaşma ayıdır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 3,
        unitName: '3. Ünite: Adap ve Nezaket',
        shortTitle: 'Görgü Kuralları ve Nezaket',
        learningObjectives: [
          'Toplumsal ilişkilerde selamlaşma, konuşma ve dinleme adabına uyar.',
          'Sofra adabını ve yemek yerken uyulması gereken nezaket kurallarını uygular.',
          'Evde, okulda ve sokakta başkalarının haklarına saygılı, kibar bir dil kullanır.',
        ],
        keyConcepts: ['Selamlaşma Adabı', 'Güzel Söz ve Nezaket', 'Sofra Kuralları (Besmele, Sağ el)', 'Mahremiyet ve İzin İsteme'],
        summary:
          'Güzel ahlak dinimizin temelidir. Selam vermek sevgi ve barışın anahtarıdır. Yemek yerken besmele ile başlamak ve israftan kaçınmak sofra adabındandır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 4,
        unitName: '4. Ünite: Hz. Muhammed ve Aile Hayatı',
        shortTitle: 'Peygamberimizin Aile Hayatı',
        learningObjectives: [
          'Hz. Muhammed’in (s.a.v.) evliliğini ve çocuklarına olan şefkatini örneklerle açıklar.',
          'Peygamberimizin torunları Hz. Hasan ve Hz. Hüseyin’e gösterdiği sevgiyi kavrar.',
          'Aile içi dayanışma, adalet ve istişare (danışma) ilkelerini öğrenir.',
        ],
        keyConcepts: ['Hz. Hatice', 'Hz. Fatıma', 'Hz. Hasan ve Hz. Hüseyin', 'İstişare (Danışma)', 'Aile İçi Sevgi ve Saygı'],
        summary:
          'Peygamberimiz ailesine son derece nazik, adil ve anlayışlı davranmıştır. Önemli kararları aile bireylerine danışarak (istişare ile) almıştır.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
      {
        unitNumber: 5,
        unitName: '5. Ünite: Çevremizde Dinin İzleri',
        shortTitle: 'Mimaride, Musikide ve Edebiyatta Dinin İzleri',
        learningObjectives: [
          'Camilerimizin bölümlerini (kubbe, minare, şerefe, minber, mihrap, vaaz kürsüsü, şadırvan) tanır.',
          'Kültürümüzde, musikimizde ve edebiyatımızda dinin izlerini fark eder.',
        ],
        keyConcepts: ['Kubbe ve Minare', 'Mihrap (İmamın durduğu yer)', 'Minber (Cuma hutbesi)', 'Şadırvan', 'İlahi ve Ezan'],
        summary:
          'Mimarimizde camiler önemli bir yer tutar. Mihrap Kabe yönünü gösterir, minber cuma ve bayram hutbelerinin okunduğu basamaklı yerdir.',
        sampleTestCount: 20,
        recommendedStudyMinutes: 30,
      },
    ],
  },
];
