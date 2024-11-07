export interface ExerciseEntry {
    id: number;
    exercise: string;
    duration: number;
    calories_burned: number;
    user_id: number; // Include userId field
    date: string;
  }

export default ExerciseEntry;