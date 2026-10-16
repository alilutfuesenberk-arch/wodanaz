export interface ScientificData {
  compound?: {
    cid: number;
    name: string;
    iupacName?: string;
    molecularFormula: string;
    molecularWeight: string;
    smiles?: string;
    pngUrl: string;
    pubchemUrl: string;
  };
  literature?: {
    title: string;
    authorString?: string;
    journalTitle?: string;
    pubYear?: string;
    doi?: string;
    url?: string;
  }[];
}

export interface AlternativeSolution {
  methodTitle: string; // örn: "1. Yol: Denklem / Cebirsel Çözüm", "2. Yol: Model / Şekil Çizme", "3. Yol: Pratik Oran / Kısa Yol"
  explanation: string;
  steps?: string[];
}

export interface QuestionData {
  questionNumber: number;
  questionText: string;
  options?: string[];
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  topic: string;
  teacherLesson: string;
  stepByStepSolution: string[];
  alternativeSolutions?: AlternativeSolution[];
  mistakeReason?: string;
  goldenRule: string;
  scientificData?: ScientificData;
  practiceQuestion?: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
}

export interface HomeworkAnalysisResult {
  id: string;
  date: string;
  title: string;
  subject: string;
  gradeLevel: string;
  overallFeedback: string;
  imageUrl?: string;
  scoreSummary: {
    totalQuestions: number;
    correctCount: number;
    incorrectCount: number;
    emptyCount: number;
    estimatedPercentage: number;
  };
  questions: QuestionData[];
}

export interface StarProgress {
  totalStars: number;
  solvedHomeworkCount: number;
  masteredTopics: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'math' | 'science' | 'general' | 'stars' | 'mastery';
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'diamond';
}

export type DayOfWeek = 'pazartesi' | 'sali' | 'carsamba' | 'persembe' | 'cuma' | 'cumartesi' | 'pazar';

export interface WeeklyTask {
  id: string;
  day: DayOfWeek;
  title: string;
  subject: string; // e.g. 'Matematik', 'Türkçe', 'Fen Bilimleri', 'Sosyal Bilgiler', 'İngilizce', 'Genel'
  durationMinutes: number; // e.g. 15, 20, 30, 45
  completed: boolean;
  priority?: 'high' | 'normal' | 'low';
  notes?: string;
  createdAt: string;
}

export type ActivityType = 'homework' | 'reading' | 'written_exam' | 'study' | 'quiz';

export interface StudySession {
  id: string;
  startTime: string;
  endTime?: string;
  durationSeconds: number;
  activityType: ActivityType;
  title: string;
  subject?: string;
  difficulty?: 'Kolay' | 'Orta' | 'Zor' | 'LGS';
  correctCount?: number;
  totalQuestions?: number;
  pointsEarned: number;
  gameMinutesEarned: number;
}

export interface GameBankState {
  totalPoints: number;
  totalGameMinutes: number;
  usedGameMinutes: number;
  sessions: StudySession[];
}

export interface WrittenExamQuestion {
  id: string;
  questionNumber: number;
  scenario?: string; // Eğlenceli hikaye/görev senaryosu
  questionText: string;
  maxPoints: number;
  hint?: string;
  rubricSteps: string[]; // MEB Puanlama baremi (Hangi adıma kaç puan)
  sampleAnswer: string;
  alternativeSolutions?: string[];
}

export interface WrittenExam {
  id: string;
  title: string;
  gradeLevel: string;
  subject: string;
  term?: string;
  durationMinutes: number;
  missionStory: string; // Eğlenceli görev konsepti
  questions: WrittenExamQuestion[];
}

export interface TopicMasteryStat {
  topic: string;
  subject: string;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  percentage: number;
  status: 'needs_urgent_review' | 'practicing' | 'mastered';
  lastReviewedDate?: string;
}

