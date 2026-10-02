export interface Task {
  id: string;
  title: string;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: 'great' | 'good' | 'neutral' | 'down' | 'bad';
  note?: string;
}

export interface MedicalEntry {
  id: string;
  type: 'medication' | 'symptom' | 'appointment' | 'measurement';
  title: string;
  value?: string;
  date: string;
}

export interface OwnedItem {
  id: string;
  name: string;
  location: string;
  category: string;
  photoUrl?: string;
}

export interface CBTReflection {
  id: string;
  date: string;
  situation: string;
  thought: string;
  emotion: string;
  reframed: string;
}
