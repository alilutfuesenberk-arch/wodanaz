import { Achievement, HomeworkAnalysisResult } from '../types';

export function calculateAchievements(
  history: HomeworkAnalysisResult[],
  stars: number
): Achievement[] {
  // Aggregate statistics from history
  const totalHomeworks = history.length;
  
  let totalQuestionsCount = 0;
  let totalCorrectCount = 0;
  let mathCorrectCount = 0;
  let scienceHomeworkCount = 0;
  let hasExamOver80 = false;
  let hasPracticedMistake = false;

  history.forEach((hw) => {
    totalQuestionsCount += hw.scoreSummary.totalQuestions;
    totalCorrectCount += hw.scoreSummary.correctCount;

    if (hw.scoreSummary.estimatedPercentage >= 80) {
      hasExamOver80 = true;
    }

    const sub = hw.subject.toLowerCase();
    const grade = hw.gradeLevel.toLowerCase();
    if (sub.includes('fen') || sub.includes('kimya') || sub.includes('biyoloji') || sub.includes('fizik')) {
      scienceHomeworkCount += 1;
    }

    hw.questions.forEach((q) => {
      if ((sub.includes('matematik') || sub.includes('calculus')) && q.isCorrect) {
        mathCorrectCount += 1;
      }
    });

    if (hw.scoreSummary.incorrectCount > 0) {
      // If there were mistakes in homework
      hasPracticedMistake = true;
    }
  });

  const hasUniversityWork = history.some(
    (h) => h.gradeLevel.toLowerCase().includes('üniversite') || h.subject.toLowerCase().includes('calculus') || h.subject.toLowerCase().includes('organik')
  );

  const achievements: Achievement[] = [
    {
      id: 'first-step',
      title: 'İlk Adım',
      description: 'İlk ödevini başarıyla sisteme yükle ve incelet.',
      category: 'general',
      icon: '🚀',
      unlocked: totalHomeworks >= 1,
      progress: Math.min(totalHomeworks, 1),
      maxProgress: 1,
      rarity: 'bronze',
    },
    {
      id: 'academic-researcher',
      title: 'Akademik Araştırmacı',
      description: 'Üniversite ve ileri bilim/Calculus seviyesinde bir çalışma analiz et.',
      category: 'science',
      icon: '🧪',
      unlocked: hasUniversityWork,
      progress: hasUniversityWork ? 1 : 0,
      maxProgress: 1,
      rarity: 'diamond',
    },
    {
      id: 'math-master',
      title: 'Matematik Ustası',
      description: 'Matematik sorularında en az 3 doğru çözüme ulaş.',
      category: 'math',
      icon: '📐',
      unlocked: mathCorrectCount >= 3,
      progress: Math.min(mathCorrectCount, 3),
      maxProgress: 3,
      rarity: 'gold',
    },
    {
      id: 'problem-solving-hero',
      title: 'Problem Çözme Kahramanı',
      description: 'En az 10 başarı yıldızı toplayarak azmini kanıtla!',
      category: 'mastery',
      icon: '🦸‍♂️',
      unlocked: stars >= 10,
      progress: Math.min(stars, 10),
      maxProgress: 10,
      rarity: 'gold',
    },
    {
      id: 'science-explorer',
      title: 'Fen Kaşifi',
      description: 'Fen Bilimleri deney ve kuvvet ödevini incele.',
      category: 'science',
      icon: '🔬',
      unlocked: scienceHomeworkCount >= 1,
      progress: Math.min(scienceHomeworkCount, 1),
      maxProgress: 1,
      rarity: 'silver',
    },
    {
      id: 'mistake-detective',
      title: 'Hata Dedektifi',
      description: 'Yanlış yaptığın sorunun ders anlatımını dinleyip mantığını kavra.',
      category: 'mastery',
      icon: '🕵️‍♀️',
      unlocked: hasPracticedMistake || stars >= 9,
      progress: hasPracticedMistake || stars >= 9 ? 1 : 0,
      maxProgress: 1,
      rarity: 'silver',
    },
    {
      id: 'super-star-hunter',
      title: 'Süper Yıldız Avcısı',
      description: 'Tüm pekiştirme sorularıyla 20 yıldız barajına ulaş.',
      category: 'stars',
      icon: '⭐️',
      unlocked: stars >= 20,
      progress: Math.min(stars, 20),
      maxProgress: 20,
      rarity: 'diamond',
    },
    {
      id: 'homework-champion',
      title: 'Ödev Şampiyonu',
      description: 'Farklı 3 ödev incelemesiyle çalışma disiplini kazan.',
      category: 'general',
      icon: '🏆',
      unlocked: totalHomeworks >= 3,
      progress: Math.min(totalHomeworks, 3),
      maxProgress: 3,
      rarity: 'gold',
    },
    {
      id: 'bullseye',
      title: 'Tam İsabet!',
      description: 'Bir ödevden %80 ve üzeri üstün başarı elde et.',
      category: 'mastery',
      icon: '🎯',
      unlocked: hasExamOver80,
      progress: hasExamOver80 ? 1 : 0,
      maxProgress: 1,
      rarity: 'gold',
    },
  ];

  return achievements;
}
