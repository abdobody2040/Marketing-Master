
export enum ViewState {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  QUEST_MAP = 'QUEST_MAP',
  LESSON = 'LESSON',
  QUIZ = 'QUIZ',
  SCENARIO = 'SCENARIO',
  SIMULATOR = 'SIMULATOR',
  ADMIN_PANEL = 'ADMIN_PANEL',
  LIBRARY = 'LIBRARY',
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum Difficulty {
  INTERN = 'INTERN', // Easy: Lenient grading, simpler concepts
  MANAGER = 'MANAGER', // Medium: Standard
  CMO = 'CMO' // Hard: Strict grading, complex scenarios
}

export interface UserProfile {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  badges: string[];
  completedModules: string[];
  completedTopics: string[]; // Format: "moduleId:topicName"
  difficulty: Difficulty;
  hasSeenTutorial?: boolean;
  theme: 'light' | 'dark';
  isPro?: boolean;
}

export interface AppConfig {
    price: number;
}

export interface MarketingModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  topics: string[];
  phase: number; // 1: Foundation, 2: Tactics, 3: Growth, 4: Leadership
  aiContext?: string; // Optional context to guide AI lesson generation
  tooltip?: string; // Extended description for tooltips
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ScenarioResult {
  score: number; // 0-100
  feedback: string;
  xpEarned: number;
}

// Simulator Types
export interface BusinessCase {
  companyName: string;
  industry: string;
  context: string;
  targetAudience: string;
  budget: string;
  objective: string;
}

export interface MarketingPlan {
  executiveSummary: string;
  targetAudienceAnalysis: string;
  channelsAndTactics: string;
  budgetAllocation: string;
}

export interface PlanEvaluation {
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  score: number; // 0-100
  summary: string;
  strengths: string[];
  weaknesses: string[];
  tacticalAdvice: string;
}

// Library Types
export interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
    thumbnail: string;
    summary: string;
    keyTakeaways: string[];
}

export interface Template {
    id: string;
    title: string;
    category: string;
    format: 'pdf' | 'excel' | 'doc';
    description: string;
    // For Excel: Array of arrays (Rows). For Doc/PDF: String content.
    content: string | string[][]; 
}
