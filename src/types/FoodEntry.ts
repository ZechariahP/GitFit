export interface FoodEntry {
    id: number;
    food: string;
    calories: number;
    fat: number;
    protein: number;
    sodium: number;
    carbs: number;
    user_id: number; // Include userId field
    date: string;
  }

  export default FoodEntry;