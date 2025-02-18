export interface Question {
  id: number;
  text: string;
  options?: string[];
  correctAnswer: number;
  type: 'multiple-choice' | 'integer';
}

export interface QuizAttempt {
  id: string;
  date: string;
  score: number;
  timeSpent: number;
  answers: Record<number, number | string>;
  totalQuestions: number;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<number, number | string>;
  timeRemaining: number;
  isComplete: boolean;
}