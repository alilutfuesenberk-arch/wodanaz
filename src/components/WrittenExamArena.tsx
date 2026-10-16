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
  ShieldAlert,
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
  { id: '5. Sınıf', name: '5. Sınıf', desc: 'Temel Kavramlar & Giriş Sınavları' },
  { id: '6. Sınıf', name: '6. Sınıf', desc: 'Beceri Temelli Açık Uçlu Sınavlar' },
  { id: '7. Sınıf', name: '7. Sınıf', desc: 'Tam Sayılar & Formüller & Mantık' },
  { id: '8. Sınıf / LGS', name: '8. Sınıf / LGS', desc: 'LGS Ortak Yazılı Sınav Kampı' },
];

const SUBJECTS = [
  { id: 'Matematik', name: 'Matematik', icon: '📐' },
  { id: 'Fen Bilimleri', name: 'Fen Bilimleri', icon: '🔬' },
  { id: 'Türkçe', name: 'Türkçe', icon: '📖' },
  { id: 'İnkılap / Sosyal', name: 'İnkılap Tarihi / Sosyal', icon: '🏛️' },
  { id: 'İngilizce', name: 'İngilizce', icon: '🌍' },
  { id: 'Din Kültürü', name: 'Din Kültürü', icon: '🕌' },
];

// Curated generator of MEB open-ended exams per grade and subject
function getExamForGradeAndSubject(grade: string, subject: string): WrittenExam {
  // 1. Matematik
  if (subject.toLowerCase().includes('mat')) {
    if (grade.includes('8')) {
      return {
        id: `exam-${grade}-${subject}`,
        title: `${grade} ${subject} - MEB Ortak Açık Uçlu Yazılı Sınavı`,
        gradeLevel: grade,
        subject: 'Matematik',
        term: '1. Dönem 1. Yazılı',
        durationMinutes: 40,
        missionStory: '🏆 LGS Şampiyonluk Görevi: EBOB-EKOK ve Üslü Sayılar açık uçlu sorularını işlem adımlarıyla çözüp tam puan al!',
        questions: [
          {
            id: 'q1',
            questionNumber: 1,
            scenario: 'Meyve Bahçesi Görevi: Çiftçi Ahmet amca eşit ağırlıkta çuvallama yapıyor.',
            questionText: 'Kenar uzunlukları 48 metre ve 60 metre olan dikdörtgen şeklindeki bir bahçenin etrafına, köşelere de gelmek şartıyla eşit aralıklarla fidan dikilecektir. İki fidan arasındaki mesafe en fazla kaç metre olabilir ve toplam en az kaç fidan gerekir? İşlem adımlarını gösteriniz.',
            maxPoints: 25,
            hint: 'Aralığın en fazla olması için 48 ve 60 sayılarının EBOB’unu bulmalısın.',
            rubricSteps: [
              '48 ve 60 sayılarının EBOB’unu 12 olarak hesaplama: 10 Puan',
              'Bahçenin çevresini 2 x (48 + 60) = 216 m olarak bulma: 7 Puan',
              'Toplam fidan sayısını 216 / 12 = 18 olarak belirleme: 8 Puan',
            ],
            sampleAnswer: 'EBOB(48, 60) = 12 metredir (Aralık en fazla 12 m).\nBahçe Çevresi = 2 x (48 + 60) = 216 m.\nToplam Fidan = 216 / 12 = 18 fidan gereklidir.',
          },
          {
            id: 'q2',
            questionNumber: 2,
            scenario: 'Bilimsel Gösterim Laboratuvarı: Mikroskobik hücre sayımı.',
            questionText: 'Bir laboratuvarda bulunan 8 x 10^7 adet bakteri her 2 saatin sonunda 2 katına çıkmaktadır. Buna göre 6 saatin sonunda laboratuvarda kaç adet bakteri olacağını üslü ifade ve bilimsel gösterimle yazınız.',
            maxPoints: 25,
            hint: '6 saatte 3 kez 2 katına çıkar (yani 2^3 = 8 ile çarpılır).',
            rubricSteps: [
              '6 / 2 = 3 kez 2 ile çarpılacağını belirleme (2^3): 8 Puan',
              '(8 x 10^7) x 8 = 64 x 10^7 işlemini yapma: 9 Puan',
              'Bilimsel gösterim kuralına göre 6.4 x 10^8 olarak ifade etme: 8 Puan',
            ],
            sampleAnswer: '6 saatte 6/2 = 3 periyot vardır.\nBakteri sayısı = (8 x 10^7) x 2^3 = (8 x 10^7) x 8 = 64 x 10^7.\nBilimsel Gösterim = 6.4 x 10^8 adettir.',
          },
          {
            id: 'q3',
            questionNumber: 3,
            scenario: 'Kareköklü Sayılar ve Alan Problemi',
            questionText: 'Alanı 192 cm² olan bir karenin bir kenar uzunluğunu a√b şeklinde yazınız ve bu kenar uzunluğunun hangi iki ardışık tam sayı arasında olduğunu gösteriniz.',
            maxPoints: 25,
            hint: '√192 sayısını tam kare çarpanına ayır (64 x 3).',
            rubricSteps: [
              '√192 = √(64 x 3) = 8√3 şeklinde yazma: 13 Puan',
              '√169 < √192 < √196 olduğunu tespit ederek 13 ile 14 arasında olduğunu belirtme: 12 Puan',
            ],
            sampleAnswer: 'Karenin bir kenarı = √192 = √(64 x 3) = 8√3 cm.\n13² = 169 ve 14² = 196 olduğundan kenar uzunluğu 13 ile 14 tam sayıları arasındadır (14’e çok yakındır).',
          },
          {
            id: 'q4',
            questionNumber: 4,
            scenario: 'Olasılık ve Kart Seçimi',
            questionText: '1’den 30’a kadar (1 ve 30 dahil) numaralandırılmış özdeş kartlar bir torbaya atılıyor. Torbadan rastgele çekilen bir kartın numarasının tam kare bir sayı olma olasılığını işlem basamaklarıyla hesaplayınız.',
            maxPoints: 25,
            hint: '30’a kadar olan tam kare sayılar: 1, 4, 9, 16, 25.',
            rubricSteps: [
              'Tüm olası durumların sayısını 30 olarak belirleme: 5 Puan',
              'İstenen tam kare sayıları (1, 4, 9, 16, 25) yazarak 5 adet olduğunu bulma: 10 Puan',
              'Olasılığı 5/30 = 1/6 olarak sadeleştirip yazma: 10 Puan',
            ],
            sampleAnswer: 'Tüm durumlar = 30 kart.\nİstenen durumlar (tam kare sayılar) = {1, 4, 9, 16, 25} -> 5 adet.\nOlasılık = 5 / 30 = 1/6’dır.',
          },
        ],
      };
    } else {
      // 5, 6, 7. Sınıf Matematik
      return {
        id: `exam-${grade}-${subject}`,
        title: `${grade} ${subject} - MEB Ortak Yazılı Sınavı`,
        gradeLevel: grade,
        subject: 'Matematik',
        term: '1. Dönem 1. Yazılı',
        durationMinutes: 40,
        missionStory: '🕵️ Dedektif Görevi: Açık uçlu problemleri adım adım çözerek tam puan al!',
        questions: [
          {
            id: 'q1',
            questionNumber: 1,
            scenario: 'Denizaltı ve Derinlik Görevi',
            questionText: 'Bir dalgıç denizin 18 metre altındadır (-18). Dalgıç her dakikada 3 metre yukarı yüzmektedir. 4 dakika sonraki konumunu tam sayı işlemiyle adımlarıyla gösteriniz.',
            maxPoints: 30,
            hint: 'Yukarı çıkış pozitif (+3 x 4) olarak eklenir.',
            rubricSteps: [
              'Başlangıç konumunu -18 olarak belirleme: 10 Puan',
              '4 x (+3) = +12 yükselmeyi bulma: 10 Puan',
              '(-18) + (+12) = -6 sonucunu doğru yazma: 10 Puan',
            ],
            sampleAnswer: 'Başlangıç = -18 m\n4 dakikada alınan yol = 4 x (+3) = +12 m\nSon konum = (-18) + (+12) = -6 metre.',
          },
          {
            id: 'q2',
            questionNumber: 2,
            scenario: 'Kesir Problemi ve Su Deposu',
            questionText: 'Bir deponun 3/5’i doludur. Depoya 60 litre su eklendiğinde deponun 3/4’ü doluyor. Deponun tamamı kaç litredir?',
            maxPoints: 35,
            hint: 'Paydaları 20’de eşitle: (3/4) - (3/5).',
            rubricSteps: [
              '(15/20) - (12/20) = 3/20 farkını bulma: 15 Puan',
              'Deponun 3/20’si 60 L ise tamamını (60/3)*20 = 400 L bulma: 20 Puan',
            ],
            sampleAnswer: 'Depodaki artış = (3/4) - (3/5) = 15/20 - 12/20 = 3/20.\n3/20’si 60 L ise tamamı 60 / 3 x 20 = 400 litredir.',
          },
          {
            id: 'q3',
            questionNumber: 3,
            scenario: 'Tümler Açılar Problemi',
            questionText: 'Tümler iki açıdan birinin ölçüsü diğerinin 4 katından 15 eksiktir. Büyük açının ölçüsü kaç derecedir?',
            maxPoints: 35,
            hint: 'Tümler iki açının toplamı 90 derecedir.',
            rubricSteps: [
              'Denklem kurma [x + (4x - 15) = 90]: 15 Puan',
              '5x = 105 -> x = 21 ve büyük açıyı 90 - 21 = 69 derece bulma: 20 Puan',
            ],
            sampleAnswer: 'x + 4x - 15 = 90 => 5x = 105 => x = 21.\nBüyük açı = 90 - 21 = 69 derecedir.',
          },
        ],
      };
    }
  }

  // 2. Fen Bilimleri
  if (subject.toLowerCase().includes('fen')) {
    return {
      id: `exam-${grade}-${subject}`,
      title: `${grade} ${subject} - MEB Açık Uçlu Ortak Yazılı Sınavı`,
      gradeLevel: grade,
      subject: 'Fen Bilimleri',
      term: '1. Dönem 1. Yazılı',
      durationMinutes: 40,
      missionStory: '🔬 Fen Laboratuvarı Görevi: Hipotezleri kur, deney sonuçlarını açık uçlu açıkla!',
      questions: [
        {
          id: 'fq1',
          questionNumber: 1,
          scenario: 'Güneş Işınları ve Mevsim Oluşumu',
          questionText: '21 Haziran tarihinde Kuzey Yarım Küre’de öğle vakti birim yüzeye düşen ışık enerjisi miktarını ve gölge boyunu Güney Yarım Küre ile karşılaştırarak iki gerekçeyle açıklayınız.',
          maxPoints: 30,
          hint: '21 Haziran’da Güneş ışınları Kuzey Yarım Küre’deki Yengeç Dönencesi’ne dik açıyla düşer.',
          rubricSteps: [
            'Kuzey Yarım Küre’ye ışınların dik geldiğini ve birim alana düşen enerjinin fazla olduğunu belirtme: 15 Puan',
            'Işınlar dik geldikçe gölge boyunun kısaldığını, Güney’de ise kış yaşandığından gölgenin uzun olduğunu açıklama: 15 Puan',
          ],
          sampleAnswer: '1. 21 Haziran’da Kuzey Yarım Küre’ye Güneş ışınları dik açıyla düşer; birim yüzeye düşen enerji fazladır ve gölge boyu en kısadır.\n2. Güney Yarım Küre’ye ise eğik açıyla düşer; bu nedenle birim alana düşen enerji azdır ve gölge boyu çok uzundur.',
        },
        {
          id: 'fq2',
          questionNumber: 2,
          scenario: 'DNA ve Nükleotid Eşleşmesi',
          questionText: 'Bir DNA molekülünün tek zincirinde 300 Adenin, 200 Guanin, 200 Sitozin ve 100 Timin nükleotidi bulunmaktadır. Bu DNA molekülünün çift zincirindeki toplam şeker ve fosfat sayısını hesaplayınız.',
          maxPoints: 35,
          hint: 'Toplam Nükleotid = Toplam Deoksiriboz Şekeri = Toplam Fosfat Sayısı.',
          rubricSteps: [
            '1. zincirdeki toplam nükleotit sayısını (300+200+200+100 = 800) bulma: 15 Puan',
            'Çift zincirde 800 x 2 = 1600 nükleotit olduğunu ve 1600 şeker ile 1600 fosfat bulunduğunu belirtme: 20 Puan',
          ],
          sampleAnswer: '1. zincir nükleotit toplamı = 300 + 200 + 200 + 100 = 800.\nÇift zincirde toplam 800 x 2 = 1600 nükleotit bulunur.\nDolayısıyla DNA’da 1600 deoksiriboz şekeri ve 1600 fosfat molekülü vardır.',
        },
        {
          id: 'fq3',
          questionNumber: 3,
          scenario: 'Katı Basıncı Deneyi',
          questionText: 'Ağırlıkları eşit olan bir ördek ile tavuk çamurlu bir yolda yürümektedir. Ördeğin ayakları perdelidir, tavuğun ayakları ise perdesizdir. Hangisinin çamura daha çok batacağını katı basıncı formülüyle açıklayınız.',
          maxPoints: 35,
          hint: 'Katı Basıncı = Ağırlık / Yüzey Alanı. Yüzey alanı arttıkça basınç azalır.',
          rubricSteps: [
            'Basıncın temas yüzey alanıyla ters orantılı olduğunu belirtme: 15 Puan',
            'Ördeğin perde ayakları sayesinde temas alanının geniş, tavuğun ise dar olduğunu ve tavuğun çamura daha çok batacağını netleştirme: 20 Puan',
          ],
          sampleAnswer: 'Katı basıncı formülü P = G / S’dir. Ağırlıklar eşit olduğuna göre temas alanı küçük olan tavuğun yere uyguladığı basınç daha büyüktür. Bu nedenle tavuk çamura ördekten daha fazla batar.',
        },
      ],
    };
  }

  // 3. Türkçe
  if (subject.toLowerCase().includes('türk')) {
    return {
      id: `exam-${grade}-${subject}`,
      title: `${grade} ${subject} - MEB Açık Uçlu Ortak Yazılı Sınavı`,
      gradeLevel: grade,
      subject: 'Türkçe',
      term: '1. Dönem 1. Yazılı',
      durationMinutes: 40,
      missionStory: '✍️ Yazar Masası Görevi: Paragrafı ve dil bilgisi ögelerini çözümle, açık uçlu soruları eksiksiz yanıtla!',
      questions: [
        {
          id: 'tq1',
          questionNumber: 1,
          scenario: 'Fiilimsi ve Cümle Analizi',
          questionText: '"Güneş doğarken yola çıkan yolcular, tepeye varınca biraz dinlendiler." Bu cümledeki fiilimsileri bularak türlerini (isim-fiil, sıfat-fiil, zarf-fiil) belirtiniz.',
          maxPoints: 30,
          hint: '-ken ve -ınca ekleri zarf-fiil; -an eki sıfat-fiildir.',
          rubricSteps: [
            '"doğarken" kelimesini Zarf-Fiil olarak belirleme: 10 Puan',
            '"çıkan" kelimesini Sıfat-Fiil olarak belirleme: 10 Puan',
            '"varınca" kelimesini Zarf-Fiil olarak belirleme: 10 Puan',
          ],
          sampleAnswer: '1. "doğarken" -> Zarf-Fiil (-ken eki)\n2. "çıkan" -> Sıfat-Fiil (-an eki)\n3. "varınca" -> Zarf-Fiil (-ınca eki).',
        },
        {
          id: 'tq2',
          questionNumber: 2,
          scenario: 'Cümlenin Ögeleri Tespiti',
          questionText: '"Küçük çocuk, elindeki renkli balonu sevinçle gökyüzüne bıraktı." Bu cümlenin ögelerini sırasıyla yazınız.',
          maxPoints: 35,
          hint: 'Önce yüklemi bul, sonra özneyi sor (YÖNT kuralı).',
          rubricSteps: [
            'Yüklem: bıraktı, Özne: Küçük çocuk: 15 Puan',
            'Nesne: elindeki renkli balonu, Zarf Tamlayıcısı: sevinçle, Yer Tamlayıcısı: gökyüzüne: 20 Puan',
          ],
          sampleAnswer: 'Küçük çocuk (Özne) / elindeki renkli balonu (Belirtili Nesne) / sevinçle (Zarf Tamlayıcısı) / gökyüzüne (Yer Tamlayıcısı) / bıraktı (Yüklem).',
        },
        {
          id: 'tq3',
          questionNumber: 3,
          scenario: 'Metin Tahlili ve Ana Düşünce',
          questionText: '"Kitap okumak sadece bilgi edinmek değil, insan ruhunu kanatlandıran en güzel yolculuktur." Bu cümlenin yazarının vermek istediği asıl mesajı (ana düşünceyi) iki cümleyle açıklayınız.',
          maxPoints: 35,
          hint: 'Kitabın bireyin duygu ve düşünce dünyasını zenginleştirmesi üzerinde durmalısın.',
          rubricSteps: [
            'Kitabın yalnızca ders ve bilgi aracı olmadığını vurgulama: 15 Puan',
            'İnsanın iç dünyasını, hayal gücünü ve empati yeteneğini geliştirdiğini belirtme: 20 Puan',
          ],
          sampleAnswer: 'Yazar, kitap okumanın zihinsel ve ruhsal gelişimin anahtarı olduğunu belirtmektedir. Kitaplar insana yeni bakış açıları kazandırır ve onu içsel olarak zenginleştirir.',
        },
      ],
    };
  }

  // 4. İnkılap / Sosyal
  if (subject.toLowerCase().includes('inkılap') || subject.toLowerCase().includes('sosyal')) {
    return {
      id: `exam-${grade}-${subject}`,
      title: `${grade} ${subject} - MEB Açık Uçlu Ortak Yazılı Sınavı`,
      gradeLevel: grade,
      subject: 'İnkılap Tarihi / Sosyal',
      term: '1. Dönem 1. Yazılı',
      durationMinutes: 40,
      missionStory: '🏛️ Tarih Arşivi Görevi: Milli Mücadele belgelerini incele, açık uçlu soruları gerekçeleriyle açıkla!',
      questions: [
        {
          id: 'iq1',
          questionNumber: 1,
          scenario: 'Amasya Genelgesi Maddesi',
          questionText: 'Amasya Genelgesi’nde yer alan "Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır." maddesinin Kurtuluş Savaşı’nın gerekçesi, amacı ve yöntemi açısından önemini açıklayınız.',
          maxPoints: 50,
          hint: 'İlk kez milli egemenlik ve milli irade ilkesinden bahsedilmiştir.',
          rubricSteps: [
            'Maddenin Kurtuluş Savaşı’nın amacı ve yöntemi olduğunu belirtme: 25 Puan',
            'Millet egemenliğine dayalı yeni bir yönetimin ilk sinyali olduğunu açıklama: 25 Puan',
          ],
          sampleAnswer: 'Bu madde Kurtuluş Savaşı’nın amacı ve yöntemini belirtir. Kurtuluşun ancak milletin kendi iradesi ve mücadelesiyle sağlanacağını ifade ederek ilk kez milli egemenliğe vurgu yapmıştır.',
        },
        {
          id: 'iq2',
          questionNumber: 2,
          scenario: 'Mondros Ateşkesi 7. Madde Analizi',
          questionText: 'Mondros Ateşkes Antlaşması’nın 7. maddesinin ("İtilaf Devletleri güvenliklerini tehdit eden herhangi bir stratejik noktayı işgal edebilecektir.") İtilaf Devletleri tarafından antlaşmaya konulma amacını yazınız.',
          maxPoints: 50,
          hint: 'Tüm Anadolu’yu hukuken işgale açık hale getirmek hedeflenmiştir.',
          rubricSteps: [
            'Anadolu’da yapılacak haksız işgallere hukuki zemin hazırlama amacını belirtme: 25 Puan',
            'İstediği an güvenlik bahanesiyle Türk topraklarını işgal edebilme niyetini açıklama: 25 Puan',
          ],
          sampleAnswer: 'İtilaf Devletleri bu madde ile Anadolu’da gerçekleştirecekleri işgallere hukuki bir dayanak oluşturmayı amaçlamışlardır. Güvenlik bahanesi uydurarak tüm vatanı işgal etme fırsatı yaratmışlardır.',
        },
      ],
    };
  }

  // 5. İngilizce
  if (subject.toLowerCase().includes('ingilizce')) {
    return {
      id: `exam-${grade}-${subject}`,
      title: `${grade} ${subject} - Open-Ended MEB Written Exam`,
      gradeLevel: grade,
      subject: 'İngilizce',
      term: '1st Term 1st Exam',
      durationMinutes: 40,
      missionStory: '🌍 Global Communication Mission: Answer open-ended questions about Friendship & Teen Life!',
      questions: [
        {
          id: 'eq1',
          questionNumber: 1,
          scenario: 'Personal Qualities of a Best Friend',
          questionText: 'Write down 3 positive personality traits of an ideal friend and explain briefly why they are important for you.',
          maxPoints: 50,
          hint: 'You can use words like "honest", "reliable", "supportive", "generous".',
          rubricSteps: [
            'Mentioning 3 positive traits (honest, reliable, supportive): 25 Points',
            'Explaining importance with full sentences: 25 Points',
          ],
          sampleAnswer: '1. Honest: A true friend never lies to me.\n2. Reliable: I can always count on my friend and tell my secrets.\n3. Supportive: A real friend always backs me up in difficult times.',
        },
        {
          id: 'eq2',
          questionNumber: 2,
          scenario: 'Accepting and Refusing Invitations',
          questionText: 'Your friend invites you to a slumber party on Saturday. Write one polite acceptance sentence and one polite refusal sentence with an excuse.',
          maxPoints: 50,
          hint: 'Acceptance: "I\'d love to...", Refusal: "I\'m sorry, but I can\'t because..."',
          rubricSteps: [
            'Writing a proper accepting expression: 25 Points',
            'Writing a polite refusal with a clear excuse: 25 Points',
          ],
          sampleAnswer: 'Acceptance: "Sure, that sounds great! I would love to join your slumber party."\nRefusal: "I am sorry, but I can\'t come because I have to visit my grandparents on Saturday."',
        },
      ],
    };
  }

  // 6. Din Kültürü
  return {
    id: `exam-${grade}-${subject}`,
    title: `${grade} ${subject} - MEB Açık Uçlu Ortak Yazılı Sınavı`,
    gradeLevel: grade,
    subject: 'Din Kültürü',
    term: '1. Dönem 1. Yazılı',
    durationMinutes: 40,
    missionStory: '🕌 Ahlak & Bilgi Görevi: Kaza, kader ve tevekkül ilkelerini açık uçlu açıkla!',
    questions: [
      {
        id: 'dq1',
        questionNumber: 1,
        scenario: 'Kaza ve Kader Kavramları',
        questionText: 'Kader ve kaza kavramlarını anlam yönünden tanımlayarak aralarındaki farkı günlük hayattan birer örnekle açıklayınız.',
        maxPoints: 50,
        hint: 'Kader takdir ve planlama, kaza ise onun zamanı gelince gerçekleşmesidir.',
        rubricSteps: [
          'Kader ve kaza tanımlarını eksiksiz yazma: 25 Puan',
          'Aralarındaki farkı doğru örnekle somutlaştırma: 25 Puan',
        ],
        sampleAnswer: 'Kader, Allah’ın evrendeki her şeyi bir ölçü ve düzene göre takdir etmesidir. Kaza ise bu planın zamanı gelince gerçekleşmesidir. Örneğin suyun 100 derecede kaynama kuralı kader, çaydanlıktaki suyun 100 dereceye ulaşıp kaynaması kazadır.',
      },
      {
        id: 'dq2',
        questionNumber: 2,
        scenario: 'Gerçek Tevekkül İlkesi',
        questionText: 'İslam dinindeki gerçek "Tevekkül" anlayışını açıklayınız. Sınava hazırlanan bir öğrenci üzerinden doğru tevekkülü iki maddeyle özetleyiniz.',
        maxPoints: 50,
        hint: 'Tevekkül, tüm tedbir ve çalışmaları yaptıktan sonra sonucu Allah’a bırakmaktır.',
        rubricSteps: [
          'Tevekkülün doğru tanımını yapma: 25 Puan',
          'Öğrencinin önce ders çalışıp sonra dua etmesi örneğini verme: 25 Puan',
        ],
        sampleAnswer: 'Tevekkül, bir amaca ulaşmak için gereken tüm çaba ve tedbirleri aldıktan sonra sonucu Allah’a bırakıp güvenmektir. Öğrenci önce derslerine planlı çalışır ve tekrar eder, sonra sınav sabahı başarılı olmak için Allah’a dua eder.',
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
  // Step 1: 'select_grade_and_subject' | Step 2: 'exam'
  const [setupStep, setSetupStep] = useState<'select_grade_and_subject' | 'exam'>('select_grade_and_subject');
  const [selectedGrade, setSelectedGrade] = useState<string>('8. Sınıf / LGS');
  const [selectedSubject, setSelectedSubject] = useState<string>('Matematik');

  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [isGraded, setIsGraded] = useState(false);
  const [earnedScore, setEarnedScore] = useState<number>(0);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  if (!isOpen) return null;

  const currentExam = getExamForGradeAndSubject(selectedGrade, selectedSubject);
  const currentQuestion = currentExam.questions[activeQuestionIdx] || currentExam.questions[0];

  const handleStartExam = () => {
    soundFX.playPop();
    setStudentAnswers({});
    setShowHints({});
    setIsGraded(false);
    setActiveQuestionIdx(0);
    setSetupStep('exam');
  };

  const handleBackToSetup = () => {
    soundFX.playPop();
    teacherVoice.stop();
    setSetupStep('select_grade_and_subject');
  };

  const handleAnswerChange = (qId: string, val: string) => {
    setStudentAnswers((prev) => ({
      ...prev,
      [qId]: val,
    }));
  };

  const toggleHint = (qId: string) => {
    soundFX.playPop();
    setShowHints((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleGradeExam = () => {
    soundFX.playCelebration();
    let total = 0;
    currentExam.questions.forEach((q) => {
      const ans = (studentAnswers[q.id] || '').trim();
      if (ans.length > 25) {
        total += q.maxPoints;
      } else if (ans.length > 5) {
        total += Math.round(q.maxPoints * 0.7);
      } else {
        total += Math.round(q.maxPoints * 0.2);
      }
    });

    const finalScore = Math.min(100, Math.max(40, total));
    setEarnedScore(finalScore);
    setIsGraded(true);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
    });

    if (onEarnStar) onEarnStar();
    if (onFinishExam) {
      onFinishExam(finalScore, currentExam.title, currentExam.durationMinutes);
    }
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-sky-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95">
        {/* Header */}
        <div className="px-5 sm:px-6 py-3.5 bg-linear-to-r from-sky-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-2.5">
            {setupStep === 'exam' && (
              <button
                onClick={handleBackToSetup}
                className="mr-1 px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Sınıf ve Dersi Değiştir"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sınıf / Dersi Değiştir</span>
              </button>
            )}
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg shrink-0">
              📝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base">
                  MEB Açık Uçlu Yazılı Arenası
                </h3>
                <span className="text-3xs font-extrabold bg-sky-400/30 border border-sky-300/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Klasik Sınav
                </span>
              </div>
              <p className="text-3xs text-sky-100 font-medium">
                {setupStep === 'select_grade_and_subject'
                  ? 'Sınıfını ve dersini seç, açık uçlu sınavına başla!'
                  : `${selectedGrade} · ${selectedSubject} Açık Uçlu Sınavı`}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playPop();
              teacherVoice.stop();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* STEP 1: SINIF VE DERS SEÇİMİ                             */}
        {/* ======================================================== */}
        {setupStep === 'select_grade_and_subject' && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
            {/* 1. Sınıf Seçimi */}
            <div className="space-y-2.5">
              <div className="border-b border-slate-100 pb-1.5 flex items-center justify-between">
                <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-sky-600" />
                  <span>1. Adım: Hangi Sınıftasın?</span>
                </h4>
                <span className="text-3xs font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                  Seçilen: {selectedGrade}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {GRADES.map((g) => {
                  const isSelected = selectedGrade === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => {
                        soundFX.playPop();
                        setSelectedGrade(g.id);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 shadow-2xs ${
                        isSelected
                          ? 'bg-sky-600 text-white border-sky-700 ring-2 ring-sky-300 shadow-xs'
                          : 'bg-white hover:bg-sky-50/70 border-slate-200 text-slate-800'
                      }`}
                    >
                      <h5 className="font-extrabold text-xs sm:text-sm">{g.name}</h5>
                      <span className={`text-3xs ${isSelected ? 'text-sky-100' : 'text-slate-500'}`}>
                        {g.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Ders Seçimi */}
            <div className="space-y-2.5">
              <div className="border-b border-slate-100 pb-1.5 flex items-center justify-between">
                <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span>2. Adım: Hangi Dersin Yazılı Sınavına Girmek İstersin?</span>
                </h4>
                <span className="text-3xs font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                  Seçilen: {selectedSubject}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SUBJECTS.map((sub) => {
                  const isSelected = selectedSubject === sub.name;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        soundFX.playPop();
                        setSelectedSubject(sub.name);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 shadow-2xs ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-700 ring-2 ring-purple-300 shadow-xs'
                          : 'bg-white hover:bg-purple-50/70 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className="text-2xl">{sub.icon}</span>
                      <div>
                        <h5 className="font-extrabold text-xs sm:text-sm leading-snug">{sub.name}</h5>
                        <span className={`text-3xs ${isSelected ? 'text-purple-100' : 'text-slate-400'}`}>
                          Açık Uçlu Yazılı
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sınavı Başlat Butonu */}
            <div className="pt-2">
              <button
                onClick={handleStartExam}
                className="w-full py-3.5 bg-linear-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-700 hover:to-purple-700 text-white font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>{selectedGrade} · {selectedSubject} Sınavını Başlat</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: SINAV SORULARI & CEVAPLAMA                       */}
        {/* ======================================================== */}
        {setupStep === 'exam' && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* Story Banner */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-center gap-2">
              <span className="text-lg">📜</span>
              <p className="font-medium leading-relaxed">{currentExam.missionStory}</p>
            </div>

            {/* Question Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
              {currentExam.questions.map((q, idx) => {
                const hasAnswer = Boolean((studentAnswers[q.id] || '').trim());
                const isActive = activeQuestionIdx === idx;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      soundFX.playPop();
                      setActiveQuestionIdx(idx);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-xs'
                        : hasAnswer
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>Soru {idx + 1}</span>
                    <span className="text-3xs opacity-80">({q.maxPoints}P)</span>
                    {hasAnswer && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>
                );
              })}
            </div>

            {/* Current Question View */}
            {currentQuestion && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xs font-extrabold uppercase px-2 py-0.5 rounded bg-sky-200/80 text-sky-900">
                      Senaryo: {currentQuestion.scenario}
                    </span>
                    <span className="text-xs font-black text-sky-800">
                      {currentQuestion.maxPoints} Puan
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-relaxed">
                    {currentQuestion.questionText}
                  </h4>
                </div>

                {/* Hint toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleHint(currentQuestion.id)}
                    className="text-2xs font-extrabold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHints[currentQuestion.id] ? 'İpucunu Gizle' : '💡 İpucu Al'}</span>
                  </button>
                  {showHints[currentQuestion.id] && (
                    <div className="mt-1.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 animate-in fade-in">
                      {currentQuestion.hint}
                    </div>
                  )}
                </div>

                {/* Answer input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Cevabın ve İşlem Basamakların (Açık Uçlu):
                  </label>
                  <textarea
                    rows={4}
                    value={studentAnswers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    placeholder="İşlem adımlarını, formülleri ve cevabını buraya açıkça yazınız..."
                    className="w-full p-3.5 rounded-2xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-xs sm:text-sm text-slate-900 transition-all outline-hidden resize-none bg-white shadow-inner font-mono"
                  />
                </div>

                {/* Rubric Step details */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-3xs font-extrabold uppercase text-slate-500 block">
                    📋 MEB Puanlama Baremi (Nasıl Puan Alınır?):
                  </span>
                  <ul className="text-2xs text-slate-700 space-y-0.5 list-disc list-inside">
                    {currentQuestion.rubricSteps.map((step, sIdx) => (
                      <li key={sIdx}>{step}</li>
                    ))}
                  </ul>
                </div>

                {/* Graded Solution View if already graded */}
                {isGraded && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2 animate-in fade-in">
                    <div className="font-extrabold text-xs flex items-center gap-1.5 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Öğretmen Örnek Çözümü ve Değerlendirmesi:</span>
                    </div>
                    <pre className="text-2xs whitespace-pre-wrap font-sans bg-white p-3 rounded-xl border border-emerald-100 text-slate-800">
                      {currentQuestion.sampleAnswer}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Actions: Grade or Next Question */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleBackToSetup}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sınıf / Dersi Değiştir</span>
              </button>

              <div className="flex items-center gap-2">
                {!isGraded ? (
                  <button
                    onClick={handleGradeExam}
                    className="px-5 py-2.5 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Sınavı Bitir ve Notlandır</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200">
                      Puanın: {earnedScore} / 100 ⭐
                    </span>
                    <button
                      onClick={() => {
                        soundFX.playPop();
                        setIsGraded(false);
                        setStudentAnswers({});
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Tekrar Çöz</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
