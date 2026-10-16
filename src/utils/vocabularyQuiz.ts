import { HomeworkAnalysisResult } from '../types';

export interface VocabularyWord {
  id: string;
  term: string;
  definition: string;
  subject: string;
  sourceTopic: string;
  exampleSentence: string;
  options: string[]; // 4 options: 1 correct definition, 3 plausible distractors
  correctOptionIndex: number;
  funFactOrTip: string;
}

interface CorpusEntry {
  subject: string;
  definition: string;
  distractors: string[];
  funFactOrTip: string;
  example: string;
}

// Comprehensive dictionary categorized by middle school subjects
const DICTIONARY_CORPUS: Record<string, CorpusEntry> = {
  // ==========================================
  // İNGİLİZCE (LGS VOCABULARY & PHRASAL VERBS)
  // ==========================================
  'reliable': {
    subject: 'İngilizce',
    definition: 'Güvenilir, dürüst ve sır tutabilen, arkasını yaslanabileceğin kişidir.',
    distractors: [
      'İnatçı ve asla fikrini değiştirmeyen kişidir.',
      'Sadece kendini düşünen bencil kimsedir.',
      'Sürekli şakalar yapan eğlenceli insandır.',
    ],
    funFactOrTip: '"Rely on" (güvenmek) fiilinden türemiştir: A true friend is always reliable!',
    example: 'Ayşe is my best friend because she is always honest and reliable.',
  },
  'count on': {
    subject: 'İngilizce',
    definition: 'Birine güvenmek, bel bağlamak ve zor zamanında ona inanmaktır.',
    distractors: [
      'Matematiksel olarak sayıları tek tek saymaktır.',
      'Bir teklifi kibarca geri çevirmektir.',
      'Yemek tarifindeki malzemeleri karıştırmaktır.',
    ],
    funFactOrTip: '"Trust" ve "Rely on" ile eş anlamlıdır: You can count on me!',
    example: 'True friends can count on each other in times of trouble.',
  },
  'back up': {
    subject: 'İngilizce',
    definition: 'Birini desteklemek, arkasında durmak ve yardım etmektir (support).',
    distractors: [
      'Geriye doğru yürümek veya arabayı geri vitese takmaktır.',
      'Gürültülü bir ortamdan hızla uzaklaşmaktır.',
      'Sınavdan önce tüm notları çöpe atmaktır.',
    ],
    funFactOrTip: 'LGS Unit 1 Friendship’in en favori sorusudur: Good friends always back each other up.',
    example: 'My best buddy always backs me up when I have a problem at school.',
  },
  'stubborn': {
    subject: 'İngilizce',
    definition: 'İnatçı, fikrini kolay kolay değiştirmeyen, dik kafalı kimsedir.',
    distractors: [
      'Cömert ve hediyeler almayı seven kişidir.',
      'Çekingen ve kalabalıkta konuşmaktan korkan kimsedir.',
      'Çok zeki ve her sınavdan yüz alan öğrencidir.',
    ],
    funFactOrTip: 'Keçi gibi inatçı! Eş anlamlısı "obstinate" olarak bilinir.',
    example: 'He is so stubborn that he never changes his mind even when he is wrong.',
  },
  'generous': {
    subject: 'İngilizce',
    definition: 'Cömert, elindekini ve parasını sevdikleriyle paylaşmayı seven kişidir.',
    distractors: [
      'Cimri ve parasını asla harcamayan kimsedir.',
      'Sabırsız ve beklemeyi sevmeyen insandır.',
      'Kıskanç ve başkalarının başarısını çekemeyen kimsedir.',
    ],
    funFactOrTip: 'Zıt anlamlısı "stingy" veya "mean" (cimri) kelimesidir.',
    example: 'Our teacher is very generous; she brought books and gifts for all of us.',
  },
  'apologize': {
    subject: 'İngilizce',
    definition: 'Yapılan bir hata veya yanlış davranış için özür dilemektir.',
    distractors: [
      'Biriyle alay etmek ve kötü söz söylemektir.',
      'Bir daveti kabul edip partiye katılmaktır.',
      'Yabancı bir dilde yeni kelimeler ezberlemektir.',
    ],
    funFactOrTip: '"Make an excuse" (bahane bulmak) ile karıştırma; apologize samimi bir özürdür!',
    example: 'If you hurt someone’s feelings, you should apologize sincerely.',
  },
  'keep a secret': {
    subject: 'İngilizce',
    definition: 'Bir sırrı saklamak ve kimseye anlatmamaktır.',
    distractors: [
      'Önemli bir haberi herkese dedikodu olarak yaymaktır.',
      'Gizli bir hediye kutusunu kaybetmektir.',
      'Arkadaşının ödevini gizlice kopyalamaktır.',
    ],
    funFactOrTip: 'A best friend never tells your secrets to other people!',
    example: 'I can tell her everything because I know she will keep my secret.',
  },

  // ==========================================
  // TÜRKÇE (DİL BİLGİSİ & EDEBİ KAVRAMLAR)
  // ==========================================
  'fiilimsi': {
    subject: 'Türkçe',
    definition: 'Fiil kök veya gövdesinden türeyen ancak isim, sıfat veya zarf görevinde kullanılan eylemsilerdir.',
    distractors: [
      'Zaman ve şahıs eki alarak çekimlenen kurallı temel yüklemdir.',
      'Cümledeki kelimeleri sadece birbirine bağlayan bağlaçtır.',
      'Yalnızca çoğul eki almış somut isim grubudur.',
    ],
    funFactOrTip: '3 çeşittir: İsim-Fiil (Ma-yış-mak), Sıfat-Fiil (Anası mezar dikecekmiş), Zarf-Fiil (Kenyalı asiye...)!',
    example: '"Koşan çocukları izledi" cümlesinde "koşan" bir sıfat-fiildir.',
  },
  'özne': {
    subject: 'Türkçe',
    definition: 'Cümlede bildirilen işi, oluşu, hareketi yapan veya yargının durumunda bulunan temel ögedir.',
    distractors: [
      'İşten etkilenen ve "neyi, kimi" sorularına cevap veren ögedir.',
      'Yüklemin bildirdiği işin ne zaman veya nerede yapıldığını belirten tümleçtir.',
      'Cümleyi bir yargıya bağlayan çekimli fiildir.',
    ],
    funFactOrTip: 'Yükleme "Yapan kim?" veya "Olan ne?" sorusunu sorarsan sana hemen özneyi verir!',
    example: '"Kerem bugün kütüphaneye gitti" cümlesinde "Kerem" öznedir.',
  },
  'yüklem': {
    subject: 'Türkçe',
    definition: 'Cümlede işi, hareketi, durumu veya yargıyı bildiren, cümlenin kurucu ve en temel ögesidir.',
    distractors: [
      'Yalnızca yer bildiren dolaylı tümleç ögesidir.',
      'Bir nesnenin kime ait olduğunu belirten iyelik ekidir.',
      'Cümledeki kelimeleri birbirine bağlayan bağlaçtır.',
    ],
    funFactOrTip: 'Yüklem olmadan bir cümle ayakta duramaz; cümlenin kalbidir!',
    example: '"Çocuklar bahçede neşeyle koşuyordu" cümlesinde "koşuyordu" yüklemdir.',
  },
  'örtülü anlam': {
    subject: 'Türkçe',
    definition: 'Cümlede açıkça söylenmediği halde cümlenin anlamından ve vurgusundan çıkarılabilen yan anlamdır.',
    distractors: [
      'Cümledeki kelimelerin sözlükteki ilk ve gerçek temel anlamıdır.',
      'Yalnızca terim ve bilimsel ifadelerle kurulan anlamdır.',
      'Yazım hatası yapılmış kelimelerin oluşturduğu anlamsızlıktır.',
    ],
    funFactOrTip: '"Ahmet de sinemaya geldi" cümlesinde Ahmet\'ten başkalarının da geldiği örtülü anlamdır!',
    example: '"Bugün hava dünden daha güzel" cümlesinde dünkü havanın güzel olmadığı örtülüdür.',
  },
  'teşbih': {
    subject: 'Türkçe',
    definition: 'Aralarında ilgi bulunan iki şeyden zayıf olanı güçlü olana benzetme sanatıdır (Benzetme).',
    distractors: [
      'İnsan dışındaki varlıklara insan özelliği verme sanatıdır (Teşhis).',
      'Birbirine zıt iki kavramı bir arada kullanma sanatıdır (Tezat).',
      'Bir durumu olduğundan çok daha büyük veya küçük göstermektir (Mübalağa).',
    ],
    funFactOrTip: '4 ögesi vardır: Benzeyen, kendisine benzetilen, benzetme yönü ve benzetme edatı (gibi, kadar).',
    example: '"Aslan gibi kuvvetli bir çocuktu" cümlesinde teşbih sanatı vardır.',
  },

  // ==========================================
  // MATEMATİK (TERİMLER & FORMÜLLER)
  // ==========================================
  'ebob': {
    subject: 'Matematik',
    definition: 'İki veya daha fazla doğal sayının ortak bölenlerinin en büyüğüdür.',
    distractors: [
      'İki sayının ortak katlarının en küçüğüdür (EKOK).',
      'İki sayının birbirine çarpımı sonucunda elde edilen çarpandır.',
      'Bir sayının karesi ile karekökünün farkıdır.',
    ],
    funFactOrTip: 'Büyük parçaları küçük eşit parçalara bölme ve poşetleme sorularında EBOB kullanılır!',
    example: '12 ve 18 sayılarının EBOB’u 6’dır.',
  },
  'ekok': {
    subject: 'Matematik',
    definition: 'İki veya daha fazla doğal sayının ortak katlarının en küçüğüdür.',
    distractors: [
      'İki sayının ortak bölenlerinin en büyüğüdür (EBOB).',
      'Bir sayının asal çarpanlarının toplamıdır.',
      'Bir dik üçgenin dik kenarlarının çarpımıdır.',
    ],
    funFactOrTip: 'Zil çalma, nöbet tutma veya küçük parçalardan büyük kare oluşturma sorularında EKOK koşar!',
    example: '4 ve 6 sayılarının EKOK’u 12’dir.',
  },
  'asal sayılar': {
    subject: 'Matematik',
    definition: '1’den ve kendisinden başka hiçbir pozitif tam sayıya tam bölünemeyen 1’den büyük doğal sayılardır.',
    distractors: [
      'Yalnızca çift sayılardan oluşan ve 2’ye tam bölünen sayılardır.',
      'Negatif tam sayıların sayı doğrusundaki karşılıklarıdır.',
      'Paydası sıfır olan tüm tanımsız rasyonel sayılardır.',
    ],
    funFactOrTip: 'En küçük asal sayı 2’dir ve 2 haricinde hiçbir çift asal sayı yoktur!',
    example: '2, 3, 5, 7, 11, 13, 17, 19 ilk asal sayılardır.',
  },
  'hipotenüs': {
    subject: 'Matematik',
    definition: 'Bir dik üçgende 90 derecelik dik açının karşısında bulunan en uzun kenardır.',
    distractors: [
      'Dik üçgende dik açıyı oluşturan kısa kenarlardan biridir.',
      'Üçgenin iç açılarının ölçüleri toplamını veren doğrudur.',
      'Çemberin merkezinden geçen en kısa kiriştir.',
    ],
    funFactOrTip: 'Pisagor teoremine göre: a² + b² = c² (c hipotenüstür)!',
    example: '3-4-5 dik üçgeninde hipotenüs uzunluğu 5 santimetredir.',
  },
  'eğim': {
    subject: 'Matematik',
    definition: 'Bir doğrunun dikey uzunluğunun yatay uzunluğa oranıdır (m = dikey / yatay).',
    distractors: [
      'Bir doğrunun x eksenini kestiği koordinat noktasıdır.',
      'Doğrunun orijine olan mutlak uzaklığıdır.',
      'İki doğrunun kesiştiği ortak açının derece cinsinden değeridir.',
    ],
    funFactOrTip: 'Sağa yatık doğruların eğimi pozitif (+), sola yatık doğruların eğimi negatiftir (-)!',
    example: 'Dikey uzunluğu 6 m, yatay uzunluğu 3 m olan rampanın eğimi 6/3 = 2 olur.',
  },

  // ==========================================
  // FEN BİLİMLERİ (DENEY & KAVRAMLAR)
  // ==========================================
  'fotosentez': {
    subject: 'Fen Bilimleri',
    definition: 'Klorofilli bitkilerin güneş ışığını kullanarak su ve karbondioksitten besin (glikoz) ve oksijen üretmesidir.',
    distractors: [
      'Canlıların glikozu parçalayarak enerji (ATP) üretme sürecidir.',
      'Topraktaki minerallerin köklerden yapraklara taşınmasıdır.',
      'Bitkilerin gece boyunca yapraklarından su buharı atmasıdır.',
    ],
    funFactOrTip: 'Dünyadaki oksijen kaynağımızın temeli kloroplastlardaki fotosentez mucizesidir!',
    example: 'Yeşil yapraklar gündüz güneş ışığı altında fotosentez yapar.',
  },
  'mutasyon': {
    subject: 'Fen Bilimleri',
    definition: 'Radyasyon, kimyasal maddeler gibi etkenlerle DNA diziliminde veya kromozom yapısında meydana gelen kalıcı bozulmadır.',
    distractors: [
      'Çevre şartlarıyla genlerin sadece işleyişinin değişmesidir (Modifikasyon).',
      'Bir canlının bulunduğu çevreye uyum sağlayarak yaşama şansını artırmasıdır (Adaptasyon).',
      'Hücrenin kendi kendini mitoz bölünmeyle yenilemesidir.',
    ],
    funFactOrTip: 'Üreme hücrelerindeki mutasyonlar kalıtsaldır; vücut hücrelerindekiler sonraki nesle geçmez!',
    example: 'Van kedisinin gözlerinin farklı renklerde olması yararlı bir mutasyon örneğidir.',
  },
  'modifikasyon': {
    subject: 'Fen Bilimleri',
    definition: 'Çevre etkisiyle genlerin yapısı bozulmadan sadece işleyişinde meydana gelen ve kalıtsal olmayan değişikliklerdir.',
    distractors: [
      'DNA nükleotid diziliminin tamamen hasar görmesidir (Mutasyon).',
      'Ortama uyum sağlayan güçlü canlıların hayatta kalmasıdır (Doğal Seçilim).',
      'Canlıların genlerinin laboratuvarda değiştirilmesidir (Klonlama).',
    ],
    funFactOrTip: 'Himalaya tavşanının beyaz tüyleri kazınıp buz bağlanınca siyah tüy çıkması modifikasyondur!',
    example: 'Güneşte tenimizin bronzlaşması kalıtsal olmayan bir modifikasyondur.',
  },
  'katı basıncı': {
    subject: 'Fen Bilimleri',
    definition: 'Katı cisimlerin ağırlıklarından dolayı temas ettikleri yüzeye birim alanda uyguladıkları dik kuvvettir (P = G / S).',
    distractors: [
      'Sıvıların kabın tabanına ve yan yüzeylerine derinlikle uyguladığı basınçtır.',
      'Açık havadaki gaz taneciklerinin uyguladığı atmosferik kuvvettir.',
      'Mıknatısların zıt kutuplarının birbirini itme kuvvetidir.',
    ],
    funFactOrTip: 'Temas yüzeyi küçüldükçe basınç artar (bıçağın bilenmesi veya çivinin sivri ucu)!',
    example: 'Kar ayakkabısı giyildiğinde yüzey alanı büyür ve kara batma basıncı azalır.',
  },
  'periyodik sistem': {
    subject: 'Fen Bilimleri',
    definition: 'Elementlerin artan atom numaralarına (proton sayılarına) ve benzer kimyasal özelliklerine göre sıralandığı tablodur.',
    distractors: [
      'Yalnızca metallerin ağırlıklarına göre dizildiği özel laboratuvar listesidir.',
      'Güneş sistemindeki gezegenlerin yörünge hızlarını gösteren haritadır.',
      'Hücre organellerinin büyüklük sırasına göre dizildiği biyolojik şemadır.',
    ],
    funFactOrTip: 'Yatay sıralara "periyot" (7 adet), düşey sütunlara "grup" (18 adet) adı verilir!',
    example: 'Periyodik tablonun en solunda metaller, en sağında ise 8A soygazları yer alır.',
  },

  // ==========================================
  // T.C. İNKILAP TARİHİ VE SOSYAL BİLGİLER
  // ==========================================
  'kuvayı milliye': {
    subject: 'T.C. İnkılap Tarihi ve Atatürkçülük / Sosyal Bilgiler',
    definition: 'Mondros Ateşkesi sonrası vatanın işgali karşısında halkın kurduğu gönüllü ve bölgesel direniş güçleridir.',
    distractors: [
      'İtilaf Devletleri tarafından kurulan işgalci düzenli ordudur.',
      'Osmanlı saray muhafızlarından oluşan özel birliktir.',
      'TBMM açıldıktan sonra kurulan ilk düzenli süvari tugayıdır.',
    ],
    funFactOrTip: 'Milli bilinci uyandırmış ve düzenli ordu kurulana kadar düşmanı oyalamıştır!',
    example: 'Güney Cephesi’nde Fransız işgaline karşı Kuvâ-yı Millîye destansı bir savunma yaptı.',
  },
  'misakı milli': {
    subject: 'T.C. İnkılap Tarihi ve Atatürkçülük / Sosyal Bilgiler',
    definition: 'Son Osmanlı Mebusan Meclisi’nde kabul edilen, milli ve bölünmez vatan sınırlarını çizen antlaşma/yemindir.',
    distractors: [
      'I. Dünya Savaşı’nı başlatan uluslararası ittifak sözleşmesidir.',
      'Kapitülasyonların yabancı devletlere süresiz verildiği fermandır.',
      'Padişahın yetkilerini kısıtlayan ilk anayasa maddesidir.',
    ],
    funFactOrTip: '"Milli Ant" anlamına gelir ve kapitülasyonların kabul edilemeyeceğini dünyaya haykırmıştır!',
    example: 'Misak-ı Millî kararları ile Türk vatanının parçalanamaz bir bütün olduğu ilan edildi.',
  },
  'laiklik': {
    subject: 'T.C. İnkılap Tarihi ve Atatürkçülük / Sosyal Bilgiler',
    definition: 'Din ve devlet işlerinin birbirinden ayrılması, devlet yönetiminde akıl ve bilimin esas alınmasıdır.',
    distractors: [
      'Tüm fabrikaların ve sanayi yatırımlarının yalnızca devlet eliyle yapılmasıdır.',
      'Seçimlerde halkın yöneticilerini belirlemesi ve milli egemenlik ilkesidir.',
      'Toplumdaki tüm ayrıcalıklı sınıf ve unvanların yasaklanmasıdır.',
    ],
    funFactOrTip: 'Laiklik aynı zamanda herkesin vicdan ve inanç özgürlüğünün devlet güvencesinde olmasıdır!',
    example: 'Halifeliğin kaldırılması ve Medeni Kanun’un kabulü laiklik yolunda atılan dev adımlardır.',
  },

  // ==========================================
  // DİN KÜLTÜRÜ VE AHLAK BİLGİSİ
  // ==========================================
  'kaza ve kader': {
    subject: 'Din Kültürü ve Ahlak Bilgisi',
    definition: 'Kader Allah’ın evrendeki her şeyi bir ölçüye göre takdir etmesi; kaza ise zamanı gelince gerçekleşmesidir.',
    distractors: [
      'İnsanın hiçbir iradesi olmadan rüzgardaki yaprak gibi savrulmasıdır.',
      'Yalnızca zenginlerin yapması gereken yıllık zekat ibadetidir.',
      'Peygamberlerin kavimlerine gösterdikleri mucizelerin genel adıdır.',
    ],
    funFactOrTip: 'Plan kaderdir, planın gerçekleşmesi ise kazadır!',
    example: 'Su 100 derecede kaynar kuralı kader; ocağa konan suyun 100 derecede kaynaması kazadır.',
  },
  'tevekkül': {
    subject: 'Din Kültürü ve Ahlak Bilgisi',
    definition: 'Bir hedefe ulaşmak için gereken tüm çaba ve tedbirleri aldıktan sonra sonucu Allah’a bırakıp güvenmektir.',
    distractors: [
      'Hiç çalışmadan ve önlem almadan şansına güvenip beklemektir.',
      'Fakirlere yılda bir kez belirli miktarda para dağıtmaktır.',
      'Kötü söz ve iftiralardan uzak durarak oruç tutmaktır.',
    ],
    funFactOrTip: 'Deveyi sağlam bağlayıp sonra Allah’a emanet etmek gerçek tevekkül örneğidir!',
    example: 'Sınava gecesini gündüzüne katarak çalışan öğrencinin tevekkülü tamdır.',
  },
  'sadaka-i cariye': {
    subject: 'Din Kültürü ve Ahlak Bilgisi',
    definition: 'Kişi öldükten sonra da sevabı devam eden okul, çeşme, köprü, faydalı ilim gibi kalıcı hayır eserleridir.',
    distractors: [
      'Ramazan ayında bayramdan önce verilen fitre (fıtır sadakası) miktarıdır.',
      'Yılda bir kez nisap miktarı mala sahip zenginlerin verdiği zekattır.',
      'Yalnızca yoldaki bir taşı kenara çekmek gibi anlık küçük iyiliklerdir.',
    ],
    funFactOrTip: 'Cariye "akan, devam eden" demektir; iyilik ırmağının hiç durmadan akması gibidir!',
    example: 'Yaptırılan bir kütüphane veya dikilen bir meyve ağacı sadaka-i cariyedir.',
  },
};

/**
 * Extracts and prepares exactly 5 vocabulary quiz questions based on selected subject and history
 */
export function generateVocabularyQuiz(
  history: HomeworkAnalysisResult[] = [],
  targetSubject?: string
): VocabularyWord[] {
  // Normalize targetSubject
  const cleanTarget = (targetSubject || '').trim().toLowerCase();

  // Filter dictionary keys by subject if targetSubject is provided
  let candidateKeys = Object.keys(DICTIONARY_CORPUS);

  if (cleanTarget && cleanTarget !== 'tümü' && cleanTarget !== 'genel') {
    const matched = candidateKeys.filter((term) => {
      const entry = DICTIONARY_CORPUS[term];
      const entrySub = entry.subject.toLowerCase();
      return (
        entrySub.includes(cleanTarget) ||
        cleanTarget.includes(entrySub) ||
        (cleanTarget.includes('inkılap') && entrySub.includes('inkılap')) ||
        (cleanTarget.includes('sosyal') && entrySub.includes('sosyal')) ||
        (cleanTarget.includes('ingilizce') && entrySub.includes('ingilizce')) ||
        (cleanTarget.includes('fen') && entrySub.includes('fen')) ||
        (cleanTarget.includes('mat') && entrySub.includes('mat')) ||
        (cleanTarget.includes('türk') && entrySub.includes('türk')) ||
        (cleanTarget.includes('din') && entrySub.includes('din'))
      );
    });

    if (matched.length > 0) {
      candidateKeys = matched;
    }
  }

  // Shuffle candidate keys
  const shuffledKeys = candidateKeys.sort(() => Math.random() - 0.5);

  // Pick top 5 terms
  const selectedTerms = shuffledKeys.slice(0, 5);

  // Fallback if less than 5
  if (selectedTerms.length < 5) {
    const allKeys = Object.keys(DICTIONARY_CORPUS).sort(() => Math.random() - 0.5);
    for (const k of allKeys) {
      if (selectedTerms.length >= 5) break;
      if (!selectedTerms.includes(k)) selectedTerms.push(k);
    }
  }

  // Build Quiz objects
  return selectedTerms.slice(0, 5).map((term, index) => {
    const data = DICTIONARY_CORPUS[term];
    const correctDef = data.definition;

    // Create shuffled 4 options
    const allOptions = [correctDef, ...data.distractors.slice(0, 3)];
    const shuffledOptions = allOptions
      .map((opt) => ({ opt, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((item) => item.opt);

    const correctIdx = shuffledOptions.indexOf(correctDef);

    return {
      id: `vocab-${index}-${term}-${Date.now()}`,
      term: term.charAt(0).toUpperCase() + term.slice(1),
      definition: correctDef,
      subject: data.subject,
      sourceTopic: `${data.subject} MEB Terimleri`,
      exampleSentence: data.example,
      options: shuffledOptions,
      correctOptionIndex: correctIdx,
      funFactOrTip: data.funFactOrTip,
    };
  });
}
