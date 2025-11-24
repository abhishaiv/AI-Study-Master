export type View = 'dashboard' | 'topic' | 'quiz' | 'chat' | 'assignment';

export interface Topic {
  id: string;
  title: string;
  description: string;
  category: 'Foundation' | 'RAG' | 'Agents' | 'Deployment';
  contextData: string; // Simulated RAG context
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface QuizResult {
  topicId: string;
  score: number;
  totalQuestions: number;
  date: string;
  feedback: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isThinking?: boolean;
}

export interface UserProgress {
  completedTopics: string[];
  quizScores: Record<string, number>; // topicId -> best score percentage
  recentActivity: {
    type: 'quiz' | 'study' | 'assignment';
    topicId?: string;
    timestamp: number;
    details: string;
  }[];
}

export interface LessonContent {
  overview: string;
  keyConcepts: { title: string; content: string }[];
  codeExample?: string;
  pitfalls: string[];
  checklist: string[];
}
