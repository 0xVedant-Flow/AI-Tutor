export type View = 'landing' | 'dashboard' | 'chat' | 'mcq' | 'plan' | 'history' | 'profile' | 'auth' | 'settings';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface HistoryItem {
  id: string;
  type: 'chat' | 'mcq';
  title: string;
  subject: string;
  date: Date;
}
