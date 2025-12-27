
export enum AppView {
  CHAT = 'CHAT',
  FLASHCARDS = 'FLASHCARDS',
  QUIZ = 'QUIZ',
  PLANNER = 'PLANNER'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  thinking?: string;
  timestamp: number;
  attachments?: string[];
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface StudyPlanItem {
  id: string;
  title: string;
  duration: string;
  tasks: string[];
}

export interface AppState {
  view: AppView;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  studyPlan: StudyPlanItem[];
  messages: Message[];
}
