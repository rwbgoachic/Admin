export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  service: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}