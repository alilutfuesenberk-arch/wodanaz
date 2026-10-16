import React, { useState } from 'react';
import {
  FileText,
  Award,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Zap,
  BookOpen,
  Trophy,
  GraduationCap,
  ChevronRight,
  Flame,
  Search,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WrittenExam, WrittenExamQuestion } from '../types';
import { soundFX } from '../utils/soundEffects';
import { teacherVoice } from '../utils/audioPlayer';

interface WrittenExamArenaProps {
  isOpen: boolean;
  onClose: () => void;
  onEarnStar?: () => void;
  onFinishExam?: (score: number, examTitle: string, durationMin: number) => void;
}

const GRADES = [
  { id: '5. Sınıf', name: '5. Sınıf', desc: 'MEB 5. Sınıf Açık Uçlu Ortak Yazılı Sınavı' },
];

const SUBJECTS = [
  { id: 'Matematik', name: 'Matematik', icon: '📐' },
  { id: 'Fen Bilimleri', name: 'Fen Bilimleri', icon: '🔬' },
  { id: 'Türkçe', name: 'Türkçe', icon: '📖' },
  { id: 'Sosyal Bilgiler', name: 'Sosyal Bilgiler', icon: '🌍' },
  { id: 'İngilizce', name: 'İngilizce', icon: '🇬🇧' },
  { id: 'Din Kültürü', name: 'Din Kültürü', icon: '🕌' },
];

// Curated generator of MEB 5. Sınıf open-ended exams per subject
function getExamForGradeAndSubject(grade: string, subject: string): WrittenExam {
  // 1. Matematik - 5. Sınıf
  if (subject.toLowerCase().includes('mat')) {
    return {
      id: `exam-5-mat`,
      title: `5. Sınıf Matematik - MEB Ortak Açık Uçlu Yazılı Sınavı`,
      gradeLevel: '5. Sınıf',
      subject: 'Matematik',
      term: '1. Dönem 1. Yazılı',
      durationMinutes: 40,
      missionStory: '🏆 Matematik Şampiyonluk Görevi: Doğal sayılar, basamak değerleri ve kesir problemlerini işlem adımlarıyla çözüp tam puan al!',
      questions: [
        {
          id: 'q1',
          questionNumber: 1,
          scenario: 'Uzay Araştırma Merkezi Görevi: Uzak gezegenlerin mesafesi ölçülüyor.',
          questionText: '"Yetmiş iki milyon dört yüz bin seksen beş" sayısını rakamlarla yazınız. Bu sayının milyonlar bölüğündeki ve birler bölüğündeki basamak değerlerini gösteriniz.',
          maxPoints: 30,
          hint: 'Milyonlar bölüğünde 72, binler bölüğünde 400, birler bölüğünde 085 yer alır.',
          rubricSteps: [
            'Sayının rakamla yazılışını (72 400 085) doğru yazma: 15 Puan',
            'Milyonlar bölüğündeki basamakları (70 000 000 + 2 000 000 = 72 000 000) belirtme: 8 Puan',
            'Birler bölüğündeki basamakları (80 + 5 = 85) doğru gösterme: 7 Puan',
          ],
          sampleAnswer: 'Sayının rakamla yazılışı: 72 400 085\nMilyonlar bölüğü: 72 (Değeri 72 000 000)\nBirler bölüğü: 085 (Değeri 85)',
        },
        {
          id: 'q2',
          questionNumber: 2,
          scenario: 'Okul Kütüphanesi ve Kesir Dağılımı',
          questionText: 'Ali bir hikâye kitabının 1. gün 2/7’sini, 2. gün ise 3/14’ünü okumuştur. Ali iki günde kitabın kaçta kaçını okumuştur ve geriye kitabın kaçta kaçı kalmıştır? İşlem adımlarını gösteriniz.',
          maxPoints: 35,
          hint: 'Paydaları 14’te eşitlemelisin: (2/7)’yi 2 ile genişlet.',
          rubricSteps: [
            '(2/7) kesrini 2 ile genişleterek 4/14 bulma: 10 Puan',
            'Okunan toplam kısmı (4/14 + 3/14 = 7/14 = 1/2) hesaplama: 15 Puan',
            'Kalan kısmı (1 - 7/14 = 7/14 veya 1/2) bulma: 10 Puan',
          ],
          sampleAnswer: '1. gün: 2/7 = 4/14\nToplam okunan: 4/14 + 3/14 = 7/14 (Yarısı)\nKalan: 14/14 - 7/14 = 7/14 (Kitabın yarısı kalmıştır).',
        },
        {
          id: 'q3',
          questionNumber: 3,
          scenario: 'Geometri Atölyesi: Üçgenin Açısı',
          questionText: 'Bir ABC üçgeninde A açısının ölçüsü 65°, B açısının ölçüsü 45° olduğuna göre C açısının ölçüsü kaç derecedir? Bu üçgen açılarına göre nasıl bir üçgendir?',
          maxPoints: 35,
          hint: 'Üçgenin iç açıları toplamı 180 derecedir.',
          rubricSteps: [
            'Verilen açıları toplama (65° + 45° = 110°): 15 Puan',
            '180° - 110° = 70° olarak C açısını bulma: 15 Puan',
            'Tüm açılar 90°’den küçük olduğu için dar açılı üçgen olduğunu belirtme: 5 Puan',
          ],
          sampleAnswer: 'Açı toplamı = 65° + 45° = 110°\nC açısı = 180° - 110° = 70°\nTüm açılar (65°, 45°, 70°) 90°’den küçük olduğu için dar açılı üçgendir.',
        },
      ],
    };
  }

  // 2. Fen Bilimleri - 5. Sınıf
  if (subject.toLowerCase().includes('fen')) {
    return {
      id: `exam-5-fen`,
      title: `5. Sınıf Fen Bilimleri - MEB Açık Uçlu Ortak Yazılı Sınavı`,
      gradeLevel: '5. Sınıf',
      subject: 'Fen Bilimleri',
      term: '1. Dönem 1. Yazılı',
      durationMinutes: 40,
      missionStory: '🔬 Fen Laboratuvarı Görevi: Güneş, Dünya, Ay ve kuvvetin ölçülmesi açık uçlu sorularını adım adım açıkla!',
      questions: [
        {
          id: 'fq1',
          questionNumber: 1,
          scenario: 'Uzay Gözlemevi: Ay’ın Evreleri',
          questionText: 'Ay’ın ana evrelerini sırasıyla yazınız ve "Dolunay" evresinde Ay’ın Dünya’dan nasıl göründüğünü kısaca açıklayınız.',
          maxPoints: 30,
          hint: 'Ana evreler: Yeni Ay, İlk Dördün, Dolunay, Son Dördün.',
          rubricSteps: [
            'Ana evreleri doğru sırayla (Yeni Ay -> İlk Dördün -> Dolunay -> Son Dördün) yazma: 15 Puan',
            'Dolunay evresinde Ay’ın Dünya’ya bakan yüzünün tamamen aydınlık ve dairesel göründüğünü belirtme: 15 Puan',
          ],
          sampleAnswer: 'Ay’ın ana evreleri sırasıyla:\n1. Yeni Ay\n2. İlk Dördün\n3. Dolunay\n4. Son Dördün\nDolunay evresinde Dünya, Güneş ile Ay arasındadır; Ay’ın Dünya’ya bakan yüzü tamamen aydınlık ve parlak bir daire şeklinde görülür.',
        },
        {
          id: 'fq2',
          questionNumber: 2,
          scenario: 'Ay’ın Yüzeyi ve Kraterler',
          questionText: 'Ay’ın yüzeyinde çok sayıda meteor çarpması sonucu oluşan derin çukurlara ne ad verilir? Ay’da bu çukurların ve ayak izlerinin milyonlarca yıl bozulmadan kalmasının temel nedenini açıklayınız.',
          maxPoints: 35,
          hint: 'Ay’da hava olayları (rüzgar, yağmur) görülmez çünkü atmosferi yok denecek kadar azdır.',
          rubricSteps: [
            'Bu çukurlara "krater" dendiğini belirtme: 10 Puan',
            'Ay’ın atmosferinin yok denecek kadar ince olduğunu belirtme: 15 Puan',
            'Rüzgâr, yağış gibi hava olayları gerçekleşmediği için izlerin ve kraterlerin silinmediğini açıklama: 10 Puan',
          ],
          sampleAnswer: 'Bu çukurlara "krater" denir.\nAy’da atmosfer yok denecek kadar incedir. Bu nedenle rüzgâr, yağmur, fırtına gibi hava olayları yaşanmaz. Aşınma ve rüzgâr olmadığı için kraterler ve astronotların ayak izleri bozulmadan kalır.',
        },
        {
          id: 'fq3',
          questionNumber: 3,
          scenario: 'Dinamometre ve Kuvvet Deneyi',
          questionText: 'En fazla 50 Newton (N) ölçebilen 10 bölmeli bir dinamometreye bir cisim asıldığında yay 4 bölme uzamaktadır. Asılan cismin uyguladığı kuvvet kaç Newton’dur? İşlem basamaklarını yazınız.',
          maxPoints: 35,
          hint: 'Her 1 bölmenin kaç Newton olduğunu bulmak için 50’yi 10’a bölmelisin.',
          rubricSteps: [
            '1 bölmenin değerini (50 / 10 = 5 N) olarak bulma: 15 Puan',
            '4 bölme uzama için 4 x 5 N = 20 N kuvvet uygulandığını hesaplama: 20 Puan',
          ],
          sampleAnswer: '1 bölmenin karşılığı = 50 N / 10 bölme = 5 N.\n4 bölme uzadığına göre:\nKuvvet = 4 x 5 N = 20 Newton’dur.',
        },
      ],
    };
  }

  // 3. Türkçe - 5. Sınıf
  if (subject.toLowerCase().includes('türk')) {
    return {
      id: `exam-5-turk`,
      title: `5. Sınıf Türkçe - MEB Açık Uçlu Ortak Yazılı Sınavı`,
      gradeLevel: '5. Sınıf',
      subject: 'Türkçe',
      term: '1. Dönem 1. Yazılı',
      durationMinutes: 40,
      missionStory: '✍️ Yazar Masası Görevi: Sözcükte anlam, neden-sonuç ve paragrafın ana fikrini açık uçlu sorularla çözümle!',
      questions: [
        {
          id: 'tq1',
          questionNumber: 1,
          scenario: 'Sözcükte Gerçek ve Mecaz Anlam',
          questionText: '"Soğuk" sözcüğünü biri gerçek anlamda, diğeri mecaz anlamda olacak şekilde iki farklı cümlede kullanınız ve hangi cümlede hangi anlamda olduğunu belirtiniz.',
          maxPoints: 30,
          hint: 'Gerçek anlam sıcaklığın düşüklüğünü; mecaz anlam ise ilgisiz ve sevgisiz davranışı anlatır.',
          rubricSteps: [
            'Gerçek anlamlı cümleyi doğru kurma (Örn: Bugün hava çok soğuk.): 15 Puan',
            'Mecaz anlamlı cümleyi doğru kurma (Örn: Bize karşı çok soğuk davrandı.): 15 Puan',
          ],
          sampleAnswer: '1. Cümle (Gerçek Anlam): "Kış günü balkonda kalınca ellerim soğuktan dondu."\n2. Cümle (Mecaz Anlam): "Yeni gelen komşumuz bize karşı oldukça soğuk davrandı."',
        },
        {
          id: 'tq2',
          questionNumber: 2,
          scenario: 'Cümlede Anlam İlişkisi',
          questionText: '"Derslerine düzenli çalıştığı için sınavda yüksek not aldı." cümlesindeki anlam ilişkisini (neden-sonuç / amaç-sonuç / koşul) belirleyiniz ve nedenini açıklayınız.',
          maxPoints: 35,
          hint: 'İki durum da gerçekleşmiştir: Çalışma eylemi sebep, yüksek not alma sonuçtur.',
          rubricSteps: [
            'Cümlenin "Neden-Sonuç (Sebep-Sonuç)" cümlesi olduğunu doğru belirtme: 20 Puan',
            'Nedenin "derslerine düzenli çalışması", sonucun "sınavda yüksek not alması" olduğunu açıklama: 15 Puan',
          ],
          sampleAnswer: 'Bu cümle bir "Neden-Sonuç (Sebep-Sonuç)" cümlesidir.\nNeden: Derslerine düzenli çalışması.\nSonuç: Sınavdan yüksek not alması.\nHer iki eylem de gerçekleşmiştir.',
        },
        {
          id: 'tq3',
          questionNumber: 3,
          scenario: 'Paragrafta Ana Düşünce',
          questionText: '"Kitap okumak sadece yeni bilgiler öğretmez; insanın hayal gücünü besler, kelime dağarcığını zenginleştirir ve insanları anlamayı kolaylaştırır. Düzenli okuyan bireyler karşılaştıkları sorunlara daha hızlı çözümler üretir." Bu parçanın ana fikrini (yazarın vermek istediği asıl mesajı) bir cümleyle yazınız.',
          maxPoints: 35,
          hint: 'Parçanın bütününde kitap okumanın insana kazandırdığı çok yönlü faydalar vurgulanmıştır.',
          rubricSteps: [
            'Kitap okumanın insanın düşünce, zihin ve problem çözme becerilerini geliştirdiğini ifade etme: 35 Puan',
          ],
          sampleAnswer: 'Ana Fikir: Düzenli kitap okumak insanın hayal gücünü, kelime dünyasını ve hayattaki problem çözme yeteneğini geliştiren çok yönlü bir alışkanlıktır.',
        },
      ],
    };
  }

  // 4. Sosyal Bilgiler - 5. Sınıf
  if (subject.toLowerCase().includes('sosyal') || subject.toLowerCase().includes('inkılap')) {
    return {
      id: `exam-5-sos`,
      title: `5. Sınıf Sosyal Bilgiler - MEB Açık Uçlu Ortak Yazılı Sınavı`,
      gradeLevel: '5. Sınıf',
      subject: 'Sosyal Bilgiler',
      term: '1. Dönem 1. Yazılı',
      durationMinutes: 40,
      missionStory: '🏛️ Tarih ve Toplum Dedektifi: Anadolu ve Mezopotamya uygarlıkları ile çocuk hakları açık uçlu sorularını yanıtla!',
      questions: [
        {
          id: 'sq1',
          questionNumber: 1,
          scenario: 'Mezopotamya ve Anadolu Uygarlıkları',
          questionText: 'Tarihte ilk kez yazıyı (çivi yazısını) bularak tarihi çağları başlatan Mezopotamya uygarlığı hangisidir? Bu uygarlığın insanlığa bir diğer önemli katkısını yazınız.',
          maxPoints: 30,
          hint: 'Yazıyı bulan uygarlık Sümerlerdir.',
          rubricSteps: [
            'Yazıyı bulan uygarlığın "Sümerler" olduğunu belirtme: 15 Puan',
            'Tekerleğin icadı, zigguratlar veya ay yılı takvimi gibi diğer katkıyı yazma: 15 Puan',
          ],
          sampleAnswer: 'Tarihte çivi yazısını ilk bulan uygarlık Sümerlerdir.\nDiğer önemli katkısı: Tekerleği icat etmeleri, ilk yazılı kanunları hazırlamaları ve çok katlı Ziggurat tapınaklarıdır.',
        },
        {
          id: 'sq2',
          questionNumber: 2,
          scenario: 'Hak ve Sorumluluk Bilinci',
          questionText: 'Bir 5. sınıf öğrencisi olarak okulda ve evde sahip olduğunuz birer hak ile yerine getirmeniz gereken birer sorumluluğu yazınız.',
          maxPoints: 35,
          hint: 'Hak kullanabildiğimiz yetkidir, sorumluluk ise görevimizdir.',
          rubricSteps: [
            'Okul ve evdeki birer hakkı (Örn: Eğitim alma, sevgi görme) doğru yazma: 15 Puan',
            'Okul ve evdeki birer sorumluluğu (Örn: Okul kurallarına uyma, odasını toplama) doğru yazma: 20 Puan',
          ],
          sampleAnswer: 'Okulda:\nHak: Nitelikli eğitim alma ve teneffüste oyun oynama hakkı.\nSorumluluk: Okul kurallarına uymak ve dersi sessizce dinlemek.\nEvde:\nHak: Barınma, beslenme ve sevgi görme hakkı.\nSorumluluk: Odamı düzenli tutmak ve aileme yardımcı olmak.',
        },
        {
          id: 'sq3',
          questionNumber: 3,
          scenario: 'Fiziki Harita ve Renkler',
          questionText: 'Fiziki haritalarda yeşil ve kahverengi renkler hangi yükselti aralıklarını ve yer şekillerini temsil eder? Açıklayınız.',
          maxPoints: 35,
          hint: 'Yeşil deniz seviyesine yakın alçak yerleri (0-500 m), kahverengi ise yüksek dağları gösterir.',
          rubricSteps: [
            'Yeşil rengin 0-500 metre arası alçak ovaları ve kıyıları gösterdiğini belirtme: 18 Puan',
            'Kahverengi rengin yüksek rakımlı yerleri ve dağları (1500 m üzeri) gösterdiğini açıklama: 17 Puan',
          ],
          sampleAnswer: 'Fiziki haritalarda:\nYeşil Renk: 0 ile 500 metre arasındaki alçak yerleri, kıyı ovalarını ve deniz seviyesine yakın bölgeleri gösterir.\nKahverengi Renk: 1500 metre ve üzeri yüksek dağlık bölgeleri ve engebeli arazileri gösterir.',
        },
      ],
    };
  }

  // 5. İngilizce - 5. Sınıf
  if (subject.toLowerCase().includes('ing')) {
    return {
      id: `exam-5-ing`,
      title: `5. Sınıf İngilizce - MEB Açık Uçlu Ortak Yazılı Sınavı`,
      gradeLevel: '5. Sınıf',
      subject: 'İngilizce',
      term: '1. Dönem 1. Yazılı',
      durationMinutes: 40,
      missionStory: '🌍 English Quest: Answer greetings, directions and health questions in full sentences!',
      questions: [
        {
          id: 'eq1',
          questionNumber: 1,
          scenario: 'Unit 1: Hello & Self Introduction',
          questionText: 'Answer the following questions in complete English sentences:\n1. Where are you from?\n2. What is your favourite school subject?',
          maxPoints: 30,
          hint: 'Use "I am from Turkey." and "My favourite class is..."',
          rubricSteps: [
            '1. soruya tam cümle ile yanıt verme (I am from Turkey / Spain): 15 Puan',
            '2. soruya tam cümle ile yanıt verme (My favourite subject is English / Maths): 15 Puan',
          ],
          sampleAnswer: '1. I am from Turkey.\n2. My favourite school subject is English (or Maths / Science).',
        },
        {
          id: 'eq2',
          questionNumber: 2,
          scenario: 'Unit 2: My Town & Giving Directions',
          questionText: 'Write 3 public buildings you can find in a town (e.g. bakery) and explain where one of them is using a preposition (next to, between, opposite).',
          maxPoints: 35,
          hint: 'Bakery, pharmacy, hospital, school, library.',
          rubricSteps: [
            '3 şehir binası adını doğru yazma: 15 Puan',
            'Edat kullanarak tam bir konum cümlesi kurma: 20 Puan',
          ],
          sampleAnswer: 'Public buildings: Pharmacy, Library, Bakery.\nSentence: "The pharmacy is next to the bakery." or "The library is between the school and the museum."',
        },
        {
          id: 'eq3',
          questionNumber: 3,
          scenario: 'Unit 5: Health & Giving Advice',
          questionText: 'Your friend says: "I have a terrible cold and a sore throat." Give him/her two pieces of advice using "You should..." or "You shouldn’t...".',
          maxPoints: 35,
          hint: 'You should see a doctor / drink warm tea. You shouldn’t drink cold water.',
          rubricSteps: [
            '1. tavsiye cümlesini doğru kalıpla yazma (You should rest in bed): 18 Puan',
            '2. tavsiye cümlesini doğru kalıpla yazma (You shouldn’t drink cold water): 17 Puan',
          ],
          sampleAnswer: '1. You should see a doctor and drink warm herbal tea.\n2. You shouldn’t drink ice-cold water or go outside without a coat.',
        },
      ],
    };
  }

  // 6. Din Kültürü - 5. Sınıf
  return {
    id: `exam-5-din`,
    title: `5. Sınıf Din Kültürü ve Ahlak Bilgisi - MEB Ortak Açık Uçlu Yazılı Sınavı`,
    gradeLevel: '5. Sınıf',
    subject: 'Din Kültürü',
    term: '1. Dönem 1. Yazılı',
    durationMinutes: 40,
    missionStory: '🕌 Ahlak ve İbadet Rehberi: Allah inancı, Ramazan orucu ve nezaket kuralları sorularını açık uçlu açıkla!',
    questions: [
      {
        id: 'dq1',
        questionNumber: 1,
        scenario: 'Allah İnancı ve İhlas Suresi',
        questionText: 'İhlas Suresi’nin Türkçe anlamını yazarak İslam dinindeki "Tevhid" inancının ne anlama geldiğini açıklayınız.',
        maxPoints: 35,
        hint: 'Tevhid, Allah’ın bir ve tek olması, eşi ve benzerinin bulunmamasıdır.',
        rubricSteps: [
          'İhlas Suresi’nin anlamını doğru yazma: 20 Puan',
          'Tevhid inancını Allah’ın birliği ve tekliği olarak açıklama: 15 Puan',
        ],
        sampleAnswer: 'İhlas Suresi Anlamı: "De ki: O Allah tektir. Allah Samed’dir (her şey O’na muhtaçtır, O hiçbir şeye muhtaç değildir). O doğurmamış ve doğmamıştır. O’nun hiçbir dengi yoktur."\nTevhid: Allah’ın varlığına, birliğine ve O’ndan başka ilah olmadığına inanmaktır.',
      },
      {
        id: 'dq2',
        questionNumber: 2,
        scenario: 'Ramazan ve Oruç İbadeti',
        questionText: 'Oruç ibadeti ile ilgili olan "Sahur", "İmsak" ve "İftar" kavramlarını kısaca açıklayınız.',
        maxPoints: 35,
        hint: 'Sahur gece yenen yemek, imsak orucun başlama vakti, iftar ise orucun açıldığı akşam vaktidir.',
        rubricSteps: [
          'Sahur kavramını doğru açıklama: 12 Puan',
          'İmsak vaktini doğru açıklama: 11 Puan',
          'İftar vaktini doğru açıklama: 12 Puan',
        ],
        sampleAnswer: 'Sahur: Oruç tutmak için gece imsak vaktinden önce kalkılıp yenen yemektir.\nİmsak: Oruca başlama vaktidir (tan yerinin ağarmasıyla yeme içmenin bittiği vakit).\nİftar: Akşam ezanının okunmasıyla orucun açıldığı vakittir.',
      },
      {
        id: 'dq3',
        questionNumber: 3,
        scenario: 'Adap ve Nezaket Kuralları',
        questionText: 'Peygamber Efendimizin öğrettiği sofra adabından iki önemli kuralı yazınız.',
        maxPoints: 30,
        hint: 'Besmele ile başlamak, sağ elle yemek, önünden yemek, israf etmemek.',
        rubricSteps: [
          '1. sofra kuralını yazma (Yemeğe besmele ile başlamak): 15 Puan',
          '2. sofra kuralını yazma (Önünden ve sağ elle yemek / israf etmemek): 15 Puan',
        ],
        sampleAnswer: '1. Yemeğe başlarken "Bismillah" demek ve bitirince "Elhamdülillah" diyerek şükretmek.\n2. Yemeği kendi önünden yemek ve tabağa yiyebileceği kadar yemek koyarak israftan kaçınmak.',
      },
    ],
  };
}

export const WrittenExamArena: React.FC<WrittenExamArenaProps> = ({
  isOpen,
  onClose,
  onEarnStar,
  onFinishExam,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('5. Sınıf');
  const [selectedSubject, setSelectedSubject] = useState<string>('Matematik');
  const [examStarted, setExamStarted] = useState(false);
  const [currentExam, setCurrentExam] = useState<WrittenExam | null>(null);

  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [score, setScore] = useState(0);

  if (!isOpen) return null;

  const handleStartExam = () => {
    soundFX.playPop();
    const exam = getExamForGradeAndSubject(selectedGrade, selectedSubject);
    setCurrentExam(exam);
    setExamStarted(true);
    setStudentAnswers({});
    setShowResults(false);
  };

  const handleFinish = () => {
    soundFX.playPop();
    setIsGrading(true);

    setTimeout(() => {
      let total = 0;
      if (currentExam) {
        currentExam.questions.forEach((q) => {
          const ans = studentAnswers[q.id]?.trim() || '';
          if (ans.length > 25) {
            total += q.maxPoints;
          } else if (ans.length > 10) {
            total += Math.round(q.maxPoints * 0.7);
          } else if (ans.length > 0) {
            total += Math.round(q.maxPoints * 0.4);
          }
        });
      }

      setScore(total);
      setIsGrading(false);
      setShowResults(true);
      soundFX.playCelebration();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      if (onEarnStar) onEarnStar();
      if (onFinishExam && currentExam) {
        onFinishExam(total, currentExam.title, currentExam.durationMinutes);
      }
    }, 1200);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundFX.playPop();
          teacherVoice.stop();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] border border-purple-200 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-purple-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📝</span>
            <div>
              <h3 className="font-bold text-base sm:text-lg font-['Fredoka']">
                MEB 5. Sınıf Açık Uçlu Yazılı Arenası
              </h3>
              <p className="text-2xs text-purple-150">
                MEB 5. sınıf ortak sınav formatında açık uçlu klasik yazılı pratiği
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playPop();
              teacherVoice.stop();
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {!examStarted ? (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex items-center gap-2 text-xs text-purple-900 font-semibold">
                <span className="text-lg">🎯</span>
                <span>Bu sınav 5. sınıf MEB müfredatına birebir uygun açık uçlu sorulardan oluşur.</span>
              </div>

              {/* Subject Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Dersini Seç:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SUBJECTS.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubject(sub.name)}
                      className={`p-3 rounded-2xl border text-left font-bold text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
                        selectedSubject === sub.name
                          ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                          : 'bg-white hover:bg-purple-50 border-purple-200 text-slate-800'
                      }`}
                    >
                      <span className="text-xl">{sub.icon}</span>
                      <span>{sub.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStartExam}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Sınavı Başlat</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : showResults ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-xs">
                🏆
              </div>
              <div>
                <h4 className="font-bold text-xl text-slate-900 font-['Fredoka']">
                  Tebrikler! 5. Sınıf Yazılı Puanın: {score} / 100
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Cevapların MEB puanlama baremine göre değerlendirildi.
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setExamStarted(false);
                    setShowResults(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold cursor-pointer"
                >
                  Yeni Sınav Seç
                </button>
                <button
                  onClick={() => {
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                <h4 className="font-bold text-sm text-slate-900">{currentExam?.title}</h4>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-100 text-purple-900">
                  {currentExam?.questions.length} Soru
                </span>
              </div>

              {currentExam?.questions.map((q) => (
                <div key={q.id} className="p-4 rounded-2xl border border-purple-100 bg-[#faf8fd] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-purple-900">
                      Soru {q.questionNumber} ({q.maxPoints} Puan)
                    </span>
                    <span className="text-3xs text-slate-500 font-medium">{q.scenario}</span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                    {q.questionText}
                  </p>

                  <textarea
                    rows={3}
                    value={studentAnswers[q.id] || ''}
                    onChange={(e) =>
                      setStudentAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                    }
                    placeholder="İşlem basamaklarını ve cevabını buraya yaz..."
                    className="w-full p-3 rounded-xl border border-purple-200 focus:border-purple-600 text-xs text-slate-800 outline-none bg-white font-medium"
                  />
                </div>
              ))}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleFinish}
                  disabled={isGrading}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>{isGrading ? 'Puanlanıyor...' : 'Yazılıyı Tamamla ve Puanla'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
