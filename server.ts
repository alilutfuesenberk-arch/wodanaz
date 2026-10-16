import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser limits for photos
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helper to fetch PubChem chemical data (Science Skill)
async function fetchPubChemData(compoundName: string) {
  try {
    const cleanName = compoundName.trim().toLowerCase();
    const translations: Record<string, string> = {
      'asetilsalisilik asit': 'aspirin',
      'asetil salisilik asit': 'aspirin',
      'benzen': 'benzene',
      'glukoz': 'glucose',
      'glikoz': 'glucose',
      'kafein': 'caffeine',
      'etanol': 'ethanol',
      'metanol': 'methanol',
      'su': 'water',
      'aseton': 'acetone',
      'karbondioksit': 'carbon dioxide',
      'asetik asit': 'acetic acid',
      'sükroz': 'sucrose',
      'metan': 'methane',
      'amonyak': 'ammonia',
      'sülfürik asit': 'sulfuric acid',
      'hidroklorik asit': 'hydrochloric acid',
    };
    const query = translations[cleanName] || cleanName;
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(query)}/property/Title,IUPACName,MolecularFormula,MolecularWeight,CanonicalSMILES/JSON`;
    const res = await fetch(url, { headers: { 'User-Agent': 'aistudio-build/1.0' } });
    if (!res.ok) return null;
    const json = await res.json();
    const prop = json?.PropertyTable?.Properties?.[0];
    if (!prop || !prop.CID) return null;
    return {
      cid: prop.CID,
      name: prop.Title || compoundName,
      iupacName: prop.IUPACName,
      molecularFormula: prop.MolecularFormula,
      molecularWeight: `${prop.MolecularWeight} g/mol`,
      smiles: prop.CanonicalSMILES,
      pngUrl: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${prop.CID}/PNG?image_size=large`,
      pubchemUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${prop.CID}`,
    };
  } catch {
    return null;
  }
}

// Helper to fetch Europe PMC literature (Science Skill)
async function fetchEuropePmcLiterature(query: string) {
  try {
    const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(query)}&resultType=core&pageSize=2&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': 'aistudio-build/1.0' } });
    if (!res.ok) return null;
    const json = await res.json();
    const articles = json?.resultList?.result || [];
    return articles.map((a: any) => ({
      title: a.title,
      authorString: a.authorString,
      journalTitle: a.journalTitle || 'Europe PMC İndeksli Kaynak',
      pubYear: a.pubYear,
      doi: a.doi,
      url: a.doi ? `https://doi.org/${a.doi}` : `https://europepmc.org/article/${a.source || 'MED'}/${a.id}`,
    }));
  } catch {
    return null;
  }
}

// Multi-model generator with fallback against 503 high demand spikes
async function generateWithFallback(client: any, params: any) {
  const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let lastErr = null;

  for (const model of models) {
    try {
      const response = await client.models.generateContent({
        ...params,
        model,
      });
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      console.warn(`[Gemini Model ${model}] temporary issue, checking fallback...`, err.message);
      lastErr = err;
      await new Promise((r) => setTimeout(r, 600));
    }
  }
  throw lastErr;
}

// API Endpoints

// 1. Analyze homework / test photo
app.post('/api/analyze-homework', async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY bulunamadı veya yapılandırılmadı.' });
    }

    const { imageBase64, mimeType = 'image/jpeg', gradeLevel, subjectHint } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Lütfen bir ödev veya test görseli gönderin.' });
    }

    // Parse base64 and detect mime type safely
    let cleanBase64 = imageBase64;
    let detectedMime = 'image/jpeg';

    if (imageBase64.includes(';base64,')) {
      const parts = imageBase64.split(';base64,');
      const mimePart = parts[0].replace(/^data:/, '').trim();
      if (mimePart) {
        detectedMime = mimePart.split(';')[0].trim();
      }
      cleanBase64 = parts[1];
    } else {
      cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
    }

    // Strip any whitespaces or newlines
    cleanBase64 = cleanBase64.replace(/\s+/g, '');

    // Normalize to standard image MIME types supported by Gemini
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(detectedMime)) {
      detectedMime = 'image/jpeg';
    }

    const systemPrompt = `Sen Türkiye MEB Ortaokul müfredatına (5. Sınıf, 6. Sınıf, 7. Sınıf, 8. Sınıf ve LGS Hazırlık) tam hakim, cana yakın, pedagojik açıdan uzman ve teşvik edici bir süper ortaokul rehber öğretmenisin.
Görevin:
1. Öğrencinin yüklediği ortaokul ödevini, çalışma yaprağını, konu testini veya deneme sınavı görselini dikkatle incele.
2. Sayfadaki her bir soruyu tespit et (özellikle Matematik, Fen Bilimleri, Türkçe, T.C. İnkılap Tarihi ve Sosyal Bilgiler, İngilizce, Din Kültürü dersleri).
3. Varsa şıkları (A, B, C, D), sorunun MEB kazanım konusunu, öğrencinin işaretlediği cevabı ve DOĞRU cevabı belirle.
4. Öğrencinin cevabının doğru mu, yanlış mı yoksa boş mu olduğunu tespit et.
5. Her yanlış veya boş soru için ortaokul öğrencisine hitap eden "Ders Gibi Adım Adım Anlatım" hazırla:
   - Dil ve üslup: Sevecen, motive edici, anlaşılır ve cesaretlendirici ("Harika bir soru canım öğrencim!", "Gel bu LGS/ortaokul sorusuna adım adım bakalım...").
   - Adım adım çözüm yolu (en fazla 3-5 net işlem/düşünce basamağı).
   - "Neden Yanlış Yapıldı / Düşülen Tuzak" analizi (öğrencinin neden yanıldığını, çeldiricinin tuzağını açıkla).
   - "Altın Püf Noktası / Akılda Tutma Kuralı" (LGS'de ve yazılıda işine yarayacak pratik kural).
   - MATEMATİK PROBLEMLERİNDE MUTLAKA FARKLI ÇÖZÜM YOLLARI SUN ('alternativeSolutions' dizisi):
     * 1. Yol: Denklem / Cebirsel Yöntem (Klasik Yol)
     * 2. Yol: Model / Şekil Çizme Yöntemi (Görsel Yol)
     * 3. Yol: LGS Pratik Taktik / Akıl Yürütme Yolu (Hızlı Çözüm)
   - Öğrencinin hemen kendini denemesi için aynı MEB kazanımını ölçen 1 adet "Şimdi Sıra Sende!" mini pekiştirme sorusu.
6. Doğru yapılan soruları da tebrik et, teyit et. Hataları birer öğrenme fırsatı olarak kutla!`;

    const promptText = `Lütfen bu ortaokul ödev/test görselini MEB müfredatı çerçevesinde titizlikle incele. 
${gradeLevel ? `Öğrencinin Sınıf Seviyesi: ${gradeLevel}.` : 'Ortaokul Seviyesi (5-8. Sınıf).'}
${subjectHint ? `Ders İpucu: ${subjectHint}.` : ''}
Her bir soruyu belirle, öğrencinin cevabını kontrol et, doğru cevabı ver ve özellikle yapılan yanlışları adım adım açıkla. Matematik sorularında varsa mutlaka farklı çözüm yöntemlerini (cebirsel, şekil/model, pratik taktik) alternativeSolutions olarak ekle.`;

    const response = await generateWithFallback(ai, {
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: detectedMime,
            },
          },
          { text: promptText },
        ],
      },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'Ödevin veya testin konusu/başlığı (Örn: 7. Sınıf Matematik - Rasyonel Sayılarla İşlemler)',
            },
            subject: {
              type: Type.STRING,
              description: 'Ortaokul ders adı (Matematik, Fen Bilimleri, Türkçe, T.C. İnkılap Tarihi ve Atatürkçülük, Sosyal Bilgiler, İngilizce, Din Kültürü)',
            },
            gradeLevel: {
              type: Type.STRING,
              description: 'Sınıf düzeyi (5. Sınıf, 6. Sınıf, 7. Sınıf, 8. Sınıf / LGS Hazırlık)',
            },
            overallFeedback: {
              type: Type.STRING,
              description: 'Öğrenciye genel sevecen öğretmen mesajı ve cesaretlendirici yorum',
            },
            scoreSummary: {
              type: Type.OBJECT,
              properties: {
                totalQuestions: { type: Type.INTEGER },
                correctCount: { type: Type.INTEGER },
                incorrectCount: { type: Type.INTEGER },
                emptyCount: { type: Type.INTEGER },
                estimatedPercentage: { type: Type.INTEGER },
              },
              required: ['totalQuestions', 'correctCount', 'incorrectCount', 'emptyCount', 'estimatedPercentage'],
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionNumber: { type: Type.INTEGER },
                  questionText: { type: Type.STRING, description: 'Sorunun tam metni veya kökü' },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Varsa seçenekler (A, B, C, D)',
                  },
                  studentAnswer: {
                    type: Type.STRING,
                    description: 'Öğrencinin kağıda işaretlediği ya da yazdığı cevap. Tespit edilemiyorsa "Boş"',
                  },
                  correctAnswer: {
                    type: Type.STRING,
                    description: 'Doğru olan cevap',
                  },
                  isCorrect: {
                    type: Type.BOOLEAN,
                    description: 'Öğrencinin cevabı doğru mu?',
                  },
                  topic: {
                    type: Type.STRING,
                    description: 'Sorunun spesifik MEB alt konusu (Örn: Rasyonel Sayılarda Toplama, Mitoz Evreleri)',
                  },
                  teacherLesson: {
                    type: Type.STRING,
                    description: 'Ders tadında öğretmen/hoca anlatımı',
                  },
                  stepByStepSolution: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Madde madde çözüm adımları',
                  },
                  alternativeSolutions: {
                    type: Type.ARRAY,
                    description: 'Matematik veya fen problemleri için alternatif/farklı çözüm yöntemleri',
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        methodTitle: { type: Type.STRING, description: 'Yöntem başlığı (örn: 1. Yol: Denklem Yolu, 2. Yol: Model Çizme, 3. Yol: Pratik Oran)' },
                        explanation: { type: Type.STRING, description: 'Yöntemin açıklaması ve adımları' },
                        steps: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                          description: 'Madde madde adımlar',
                        },
                      },
                      required: ['methodTitle', 'explanation'],
                    },
                  },
                  mistakeReason: {
                    type: Type.STRING,
                    description: 'Öğrencinin neden yanılmış olabileceği, düşülen tuzak',
                  },
                  goldenRule: {
                    type: Type.STRING,
                    description: 'Altın kural veya unutulmaması gereken püf noktası / teorem',
                  },
                  chemicalCompoundName: {
                    type: Type.STRING,
                    description: 'Soruda adı geçen kimyasal bileşik (varsa)',
                  },
                  academicLiteratureQuery: {
                    type: Type.STRING,
                    description: 'Konuya dair literatür sorgusu (varsa)',
                  },
                  practiceQuestion: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      correctAnswer: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                    },
                  },
                },
                required: [
                  'questionNumber',
                  'questionText',
                  'studentAnswer',
                  'correctAnswer',
                  'isCorrect',
                  'topic',
                  'teacherLesson',
                  'stepByStepSolution',
                  'goldenRule',
                ],
              },
            },
          },
          required: ['title', 'subject', 'gradeLevel', 'overallFeedback', 'scoreSummary', 'questions'],
        },
      },
    });

    // Safe JSON parser
    let rawText = (response.text || '').trim();
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    } else if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let parsedData: any = {};
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      const firstB = rawText.indexOf('{');
      const lastB = rawText.lastIndexOf('}');
      if (firstB !== -1 && lastB !== -1 && lastB > firstB) {
        parsedData = JSON.parse(rawText.substring(firstB, lastB + 1));
      } else {
        throw new Error('Yapay zeka yanıtı JSON formatında çözümlenemedi.');
      }
    }

    // Enrich questions with live Science Skills (PubChem and Europe PMC) if applicable
    if (parsedData.questions && Array.isArray(parsedData.questions)) {
      for (const q of parsedData.questions) {
        if (q.chemicalCompoundName) {
          const chemicalData = await fetchPubChemData(q.chemicalCompoundName);
          if (chemicalData) {
            q.scientificData = {
              ...q.scientificData,
              compound: chemicalData,
            };
          }
        }
        if (q.academicLiteratureQuery && (parsedData.gradeLevel?.toLowerCase().includes('üniversite') || parsedData.gradeLevel?.toLowerCase().includes('lise'))) {
          const literatureData = await fetchEuropePmcLiterature(q.academicLiteratureQuery);
          if (literatureData && literatureData.length > 0) {
            q.scientificData = {
              ...q.scientificData,
              literature: literatureData,
            };
          }
        }
      }

      // Sanitize and guarantee question shape
      parsedData.questions = parsedData.questions.map((q: any, idx: number) => {
        const questionNumber = typeof q.questionNumber === 'number' ? q.questionNumber : idx + 1;
        const options = Array.isArray(q.options)
          ? q.options.filter(Boolean).map(String)
          : typeof q.options === 'string'
          ? [q.options]
          : [];

        const stepByStepSolution = Array.isArray(q.stepByStepSolution)
          ? q.stepByStepSolution.filter(Boolean).map(String)
          : typeof q.stepByStepSolution === 'string' && q.stepByStepSolution
          ? [q.stepByStepSolution]
          : [];

        let practiceQuestion = q.practiceQuestion;
        if (practiceQuestion && typeof practiceQuestion === 'object') {
          practiceQuestion = {
            question: String(practiceQuestion.question || 'Bu konuyu pekiştirmek için benzer bir soru çözelim.'),
            options: Array.isArray(practiceQuestion.options)
              ? practiceQuestion.options.filter(Boolean).map(String)
              : [],
            correctAnswer: practiceQuestion.correctAnswer != null ? String(practiceQuestion.correctAnswer) : '',
            explanation: practiceQuestion.explanation != null ? String(practiceQuestion.explanation) : '',
          };
        } else {
          practiceQuestion = undefined;
        }

        const alternativeSolutions = Array.isArray(q.alternativeSolutions)
          ? q.alternativeSolutions.map((alt: any) => ({
              methodTitle: String(alt.methodTitle || 'Alternatif Çözüm Yolu'),
              explanation: String(alt.explanation || ''),
              steps: Array.isArray(alt.steps) ? alt.steps.map(String) : [],
            }))
          : undefined;

        return {
          ...q,
          questionNumber,
          questionText: String(q.questionText || `Soru ${questionNumber}`),
          options,
          studentAnswer: q.studentAnswer != null ? String(q.studentAnswer) : 'Boş',
          correctAnswer: q.correctAnswer != null ? String(q.correctAnswer) : '',
          isCorrect: Boolean(q.isCorrect),
          topic: String(q.topic || 'Genel Konu'),
          teacherLesson: String(q.teacherLesson || 'Bu sorunun çözümünü adım adım inceleyelim.'),
          stepByStepSolution,
          alternativeSolutions,
          mistakeReason: q.mistakeReason ? String(q.mistakeReason) : undefined,
          goldenRule: String(q.goldenRule || 'Her adımı dikkatle gözden geçir!'),
          practiceQuestion,
          scientificData: q.scientificData || undefined,
        };
      });
    } else {
      parsedData.questions = [];
    }

    // Ensure scoreSummary is always valid
    const totalQ = parsedData.questions.length;
    const correctQ = parsedData.questions.filter((q: any) => q.isCorrect).length;
    const incorrectQ = totalQ - correctQ;

    if (!parsedData.scoreSummary || typeof parsedData.scoreSummary !== 'object') {
      parsedData.scoreSummary = {
        totalQuestions: totalQ,
        correctCount: correctQ,
        incorrectCount: incorrectQ,
        emptyCount: 0,
        estimatedPercentage: totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0,
      };
    } else {
      parsedData.scoreSummary.totalQuestions =
        typeof parsedData.scoreSummary.totalQuestions === 'number' ? parsedData.scoreSummary.totalQuestions : totalQ;
      parsedData.scoreSummary.correctCount =
        typeof parsedData.scoreSummary.correctCount === 'number' ? parsedData.scoreSummary.correctCount : correctQ;
      parsedData.scoreSummary.incorrectCount =
        typeof parsedData.scoreSummary.incorrectCount === 'number' ? parsedData.scoreSummary.incorrectCount : incorrectQ;
      parsedData.scoreSummary.emptyCount =
        typeof parsedData.scoreSummary.emptyCount === 'number' ? parsedData.scoreSummary.emptyCount : 0;
      parsedData.scoreSummary.estimatedPercentage =
        typeof parsedData.scoreSummary.estimatedPercentage === 'number'
          ? parsedData.scoreSummary.estimatedPercentage
          : (totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0);
    }

    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error analyzing homework:', error);
    return res.status(500).json({
      error: 'Ödev analiz edilirken bir sorun oluştu. Lütfen fotoğrafın net olduğundan emin olup tekrar deneyin.',
      details: error.message,
    });
  }
});

// 2. Ask follow-up question to the teacher (Always resilient, never fails)
app.post('/api/ask-teacher', async (req, res) => {
  try {
    const { questionContext, studentQuery } = req.body;
    if (!studentQuery || !studentQuery.trim()) {
      return res.status(400).json({ error: 'Lütfen öğretmene sormak istediğin soruyu yaz.' });
    }

    const cleanQuery = studentQuery.trim();

    if (ai) {
      try {
        const systemPrompt = `Sen Türkiye MEB Ortaokul (5, 6, 7, 8. Sınıf ve LGS) düzeyindeki bir öğrencinin cana yakın, sabırlı, neşeli ve teşvik edici özel rehber öğretmenisin.
Öğrenci ödevindeki bir soru veya çözüm adımı hakkında sana soru soruyor.
Görevin:
- Çocuğa 'canım öğrencim', 'sevgili arkadaşım' veya 'çalışkan dedektifim' diye sevecen bir dille hitap et.
- Soruyu ortaokul öğrencisinin kavrayabileceği şekilde somut günlük hayat örnekleri, modeller veya adım adım düşünme basamaklarıyla açıkla.
- Eğer matematik sorusuysa alternatif çözüm yolları (denklem veya şekil/model) veya pratik LGS taktiği ver.
- Pozitif ol, hata yapmanın öğrenmenin en doğal parçası olduğunu hissettir.
- 2-3 samimi, anlaşılır paragrafta açıklayıp cesaretlendirici bir cümleyle bitir.`;

        const contents = [
          {
            role: 'user',
            parts: [
              {
                text: `Soru Metni ve Bağlamı:\n${JSON.stringify(questionContext || {})}\n\nÖğrencinin Sana Sorduğu Soru:\n${cleanQuery}`,
              },
            ],
          },
        ];

        const response = await generateWithFallback(ai, {
          contents,
          config: {
            systemInstruction: systemPrompt,
          },
        });

        if (response && response.text) {
          return res.json({
            success: true,
            answer: response.text,
          });
        }
      } catch (geminiErr: any) {
        console.warn('Gemini API temporary issue in ask-teacher, applying pedagogical fallback...', geminiErr?.message);
      }
    }

    // High quality pedagogical fallback when AI key is absent or network fails:
    const topic = questionContext?.topic || 'Bu soru';
    const correctAns = questionContext?.correctAnswer || '';
    const qLower = cleanQuery.toLowerCase();

    let teacherAnswer = `Harika bir soru sordun canım öğrencim! 🦉\n\n`;

    if (qLower.includes('neden') || qLower.includes('nasıl') || qLower.includes('niçin') || qLower.includes('niye')) {
      teacherAnswer += `"${topic}" konusunda bu adımı anlamak çok kıymetli. Bu tip sorularda kuralımız: Önce sorunun bizden ne istediğini netleştirmek ve işlem önceliğine (parantez içi, çarpma/bölme, toplama/çıkarma) dikkat etmektir.\n\n`;
      teacherAnswer += correctAns
        ? `Adımları sırasıyla yerine getirdiğimizde doğru cevabın **${correctAns}** olduğunu güvenle bulabiliyoruz. `
        : `Verilen ipuçlarını sırayla denkleme döktüğümüzde taşlar yerine oturuyor. `;
      teacherAnswer += `Takıldığın herhangi bir ara işlem olursa hiç çekinmeden tekrar sorabilirsin, birlikte çözmek çok keyifli!`;
    } else if (qLower.includes('kısa yol') || qLower.includes('taktik') || qLower.includes('kolay yol') || qLower.includes('pratik')) {
      teacherAnswer += `LGS ve yazılı sınavlarda zaman kazandıracak pratik taktiğimiz şu: Önce seçenekleri incele, mantıksız olan uç değerleri ele! Ardından soruyu bir şekil veya basit bir model çizerek görselleştir.\n\n`;
      teacherAnswer += `Görselleştirme yaptığında cevabın ${correctAns ? `**${correctAns}**` : 'doğru seçenek'} olduğunu tek bakışta fark edebilirsin.`;
    } else if (qLower.includes('anlamadım') || qLower.includes('anlamıyorum') || qLower.includes('karıştı')) {
      teacherAnswer += `Hiç endişelenme, bu konu ilk bakışta kafa karıştırıcı görünebilir ama kesinlikle çok kolay kavrayacaksın! Gel zihninde küçük bir örnek hayal edelim:\n\n`;
      teacherAnswer += `Örneğin elimizde bir pasta dilimi veya renkli kutular olduğunu düşünelim. Bize verilen parçaları birleştirdiğimizde ${correctAns ? `sonucun **${correctAns}** olduğunu` : 'çözümü'} görürüz. Adım adım gidelim, sen harika gidiyorsun!`;
    } else {
      teacherAnswer += `"${topic}" konusunda sorduğun "${cleanQuery}" sorusu tam bir öğrenme sorusu!\n\n`;
      teacherAnswer += `Burada dikkat etmemiz gereken en temel altın kural: Soru kökünü ve verilen sayıları acele etmeden adım adım incelemek. ${correctAns ? `Böylece doğru yanıt olan **${correctAns}** sonucuna ulaşıyoruz.` : ''}\n\n`;
      teacherAnswer += `Kendine güven, pratik yaptıkça bu soruları gözün kapalı çözeceksin!`;
    }

    return res.json({
      success: true,
      answer: teacherAnswer,
    });
  } catch (error: any) {
    console.error('Error answering student:', error);
    return res.json({
      success: true,
      answer: 'Çok güzel bir soru sordun canım öğrencim! Bu konuyu pekiştirmek için adım adım işlem sırasına dikkat etmeli ve acele etmeden tekrar kontrol etmeliyiz. Ben her zaman yanındayım!',
    });
  }
});

// 2.5 Study Room AI Coach endpoint (Resilient and supportive)
app.post('/api/study-coach', async (req, res) => {
  try {
    const { action, subject, topic, targetMinutes, currentMinutes, studentMessage } = req.body;
    const cleanSubject = String(subject || 'Ders');
    const cleanTopic = String(topic || 'Konu Çalışması');
    const targetMin = Number(targetMinutes) || 25;
    const currentMin = Number(currentMinutes) || 0;
    const userMsg = studentMessage ? String(studentMessage).trim() : '';

    if (ai) {
      try {
        const systemPrompt = `Sen Türkiye MEB Ortaokul (5, 6, 7, 8. Sınıf ve LGS) öğrencilerine çalışma odasında eşlik eden, çok sevecen, neşeli, motive edici 'Baykuş Çalışma Hocası'sın (AI Odak Koçu).
Öğrenci çalışma odasında ders çalışıyor.
Mevcut Bilgiler:
- Branş: ${cleanSubject}
- Konu / Hedef: ${cleanTopic}
- Hedef Süre: ${targetMin} dakika
- Şu ana kadar çalışılan süre: ${currentMin} dakika
- Eylem Türü: ${action || 'chat'} (start: derse başlama, pause: mola, finish: dersi tamamlama, chat: öğrencinin sorusu veya sohbeti)

Görevin:
- Çocuğa 'çalışkan dedektifim', 'sevgili şampiyon', 'güzel öğrencim' gibi motive edici tatlı bir dille hitap et.
- Eğer derse yeni başlıyorsa (action === 'start'): Onu heyecanlandır, masasını düzenlemesini, derin bir nefes almasını ve sayacın başladığını tatlı bir dille söyle.
- Eğer mola veriyorsa (action === 'pause'): Onu 5 dakikalık sağlıklı mola (su içme, göz dinlendirme) için teşvik et.
- Eğer öğrenci soru soruyorsa: Konuyu veya dikkat dağınıklığını aşmak için ortaokul seviyesinde somut, uygulanabilir taktikler ver.
- Asla azarlama, daima yapabileceğine inandır.
- Cevabını 2-3 kısa paragrafta tut ve bitirirken tatlı bir moral sözü ekle.`;

        let promptText = '';
        if (action === 'start') {
          promptText = `Öğrenci ${cleanSubject} dersinde '${cleanTopic}' konusunu ${targetMin} dakika çalışmak üzere 'Çalışmaya Başlıyorum' butonuna bastı. Sayacı başlattık. Ona enerjik ve motive edici bir başlangıç konuşması yap!`;
        } else if (action === 'pause') {
          promptText = `Öğrenci ${currentMin} dakika çalıştıktan sonra kısa bir mola verdi. Ona 5 dakikalık sağlıklı bir mola (su içme, göz dinlendirme, esneme) tavsiyesi ver.`;
        } else if (action === 'finish') {
          promptText = `Öğrenci ${currentMin} dakikalık çalışmasını başarıyla tamamladı ve ödevini bitirdi! Onu harika bir şekilde kutla, kazandığı puan ve oyun hakkından bahset.`;
        } else {
          promptText = `Öğrencinin Sana İlettiği Mesaj/Soru:\n"${userMsg}"\n\n(Ders: ${cleanSubject}, Konu: ${cleanTopic}, Çalışılan Süre: ${currentMin} dk)`;
        }

        const contents = [
          {
            role: 'user',
            parts: [{ text: promptText }],
          },
        ];

        const response = await generateWithFallback(ai, {
          contents,
          config: {
            systemInstruction: systemPrompt,
          },
        });

        if (response && response.text) {
          return res.json({
            success: true,
            coachMessage: response.text,
          });
        }
      } catch (geminiErr: any) {
        console.warn('Gemini error in study-coach, using pedagogical fallback...', geminiErr?.message);
      }
    }

    // High quality offline fallback responses:
    let fallbackText = '';
    if (action === 'start') {
      fallbackText = `Harika bir karar şampiyon! 🦉 ${cleanSubject} dersinde '${cleanTopic}' hedefin için sayacımız tam şu an başladı!\n\nŞimdi derin bir nefes al, sırtını dikleştir ve zihnini sadece sorularına ver. Unutma, en zor problemler bile küçük adımlarla çözülür. Masanda seninle birlikteyim, hadi başaralım! 🚀`;
    } else if (action === 'pause') {
      fallbackText = `Tebrikler! ${currentMin} dakikadır harika bir odaklanma sergiledin. 🍵 Şimdi ekrandan ve kitaplardan 5 dakika uzaklaş, bir bardak ılık su iç ve omuzlarını hafifçe esnet. Gözlerini dinlendir, hazır olduğunda geri dön!`;
    } else if (action === 'finish') {
      fallbackText = `İşte bu! 🌟 ${currentMin} dakikalık disiplinli çalışmanı başarıyla tamamladın! Bu harika emek karşılığında kumbarana puan ve oyun süresi hakkı eklendi. Kendinle gurur duyabilirsin!`;
    } else {
      const msgLower = (userMsg || '').toLowerCase();
      if (msgLower.includes('odaklan') || msgLower.includes('dikkat')) {
        fallbackText = `Dikkat dağılması çok normal güzel öğrencim! 🦉 Hemen 4 saniye derin nefes al, 4 saniye tut ve yavaşça ver. Masandaki gereksiz eşyaları kenara çek. Önündeki tek bir soruya odaklan, başaracaksın!`;
      } else if (msgLower.includes('mola')) {
        fallbackText = `Etkili bir mola için: Telefon veya tablete bakmak yerine pencereden dışarı bak, derin bir nefes al ve bir bardak su iç! 5 dakika sonra zihnin canlanmış olarak dönecektir.`;
      } else if (msgLower.includes('taktik') || msgLower.includes('zor')) {
        fallbackText = `Sorular zor göründüğünde kuralımız: Büyük problemi küçük parçalara böl! Verilenleri alt alta yaz, gerekirse bir şekil çiz. Çözüm kendiliğinden belirecektir.`;
      } else {
        fallbackText = `Harika bir soru canım öğrencim! 🦉 ${cleanSubject} çalışırken zihnini diri tutmak için adımları kendi kendine fısıldayarak çözmeyi deneyebilirsin. Ben hep buradayım, harika gidiyorsun!`;
      }
    }

    return res.json({
      success: true,
      coachMessage: fallbackText,
    });
  } catch (error: any) {
    console.error('Error in study coach:', error);
    return res.json({
      success: true,
      coachMessage: 'Harika gidiyorsun şampiyon! Adım adım ilerle, kendine güven ve zihnini rahat tut. Ben yanındayım! 🦉',
    });
  }
});

// 3. Audio / TTS for teacher explanation
app.post('/api/speak', async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY bulunamadı.' });
    }

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Seslendirilecek metin belirtilmedi.' });
    }

    // Limit text length for TTS to ensure fast response and natural teacher tone
    const trimmedText = text.slice(0, 500);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: trimmedText,
              speechMetadata: {
                style: 'Sevecen, samimi ve tane tane konuşan anaokulu/ilkokul öğretmeni',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'Ses verisi oluşturulamadı.' });
    }

    return res.json({
      success: true,
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('Error generating speech:', error);
    return res.status(500).json({
      error: 'Seslendirme hatası.',
      details: error.message,
    });
  }
});

// 4. Dedicated Science Endpoints (PubChem & Europe PMC)
app.get('/api/science/compound/:name', async (req, res) => {
  try {
    const data = await fetchPubChemData(req.params.name);
    if (!data) {
      return res.status(404).json({ error: 'Bileşik PubChem veritabanında bulunamadı.' });
    }
    return res.json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/science/literature', async (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Sorgu terimi gereklidir.' });
    }
    const articles = await fetchEuropePmcLiterature(query);
    return res.json({ success: true, articles });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Mount Vite or serve static files
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Ödev Dostum Sunucusu hazır: http://localhost:${PORT}`);
  });
}

startServer();
