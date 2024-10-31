export interface ExerciseEntry {
    id: number;
    exercise: string;
    duration: number;
    caloriesBurned: number;
    date: string;
    userId: number; // Include userId field
  }