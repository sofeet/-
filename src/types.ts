export type Role = 'counselor' | 'patient';

export interface Message {
  id: string;
  role: Role;
  content: string;
  isStable: boolean; // For ASR confidence
}

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  duration: string;
  status: 'completed' | 'processing' | 'recording' | 'pending';
  summary?: string;
  issues?: string[];
  anxietyScore?: number;
  depressionScore?: number;
  sleepScore?: number;
  transcript?: Message[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: '男' | '女';
  avatarUrl?: string;
  totalConsultations: number;
  firstConsultationDate: string;
  lastConsultationDate: string;
  tags: string[];
  anxietyTrend: 'up' | 'stable' | 'down';
  depressionTrend: 'up' | 'stable' | 'down';
  sleepTrend: 'up' | 'stable' | 'down';
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Assessment {
  id: string;
  name: string;
  date: string;
  score: number;
  riskText: string;
  status: 'completed' | 'pending';
}
