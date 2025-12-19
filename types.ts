export enum UnitId {
  CONDUCTION = 'conduction',
  CONVECTION = 'convection',
  BOILING = 'boiling',
  RADIATION = 'radiation',
  MASS_TRANSFER = 'mass_transfer',
}

export interface Unit {
  id: UnitId;
  title: string;
  topics: string[];
  icon: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  attachments?: { name: string; type: string }[];
}

export interface SimulationParams {
  t1: number;
  t2: number;
  k: number;
  thickness: number;
}
