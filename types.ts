
export enum Goal {
  FAT_LOSS = 'Fat Loss',
  HYPERTROPHY = 'Hypertrophy',
  STRENGTH_POWER = 'Strength/Power',
  STAMINA_ENDURANCE = 'Stamina/Endurance',
}

export interface UserData {
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: Goal;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
}

export interface DaySchedule {
  day_name: string;
  focus_area: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  schedule: DaySchedule[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}
   