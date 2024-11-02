import { FoodEntry } from '../types/FoodEntry';
import { ExerciseEntry } from '../types/ExerciseEntry';

export const mapExerciseEntries = (exerciseEntries: ExerciseEntry[]) => {
  return exerciseEntries.map(entry => ({
    ...entry,
    caloriesBurned: entry.calories_burned,
  }));
};

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const calculateFoodTotals = (foodEntries: FoodEntry[]) => {
  return foodEntries.reduce(
    (totals, entry) => {
      totals.calories += entry.calories || 0;
      totals.fat += entry.fat || 0;
      totals.protein += entry.protein || 0;
      totals.sodium += entry.sodium || 0;
      totals.carbs += entry.carbs || 0;
      return totals;
    },
    { calories: 0, fat: 0, protein: 0, sodium: 0, carbs: 0 }
  );
};

export const calculateExerciseTotals = (exerciseEntries: ExerciseEntry[]) => {
  return exerciseEntries.reduce(
    (totals, entry) => {
      totals.duration += entry.duration || 0;
      totals.caloriesBurned += entry.calories_burned || 0;
      return totals;
    },
    { duration: 0, caloriesBurned: 0 }
  );
};

export const calculateNetGainLoss = (foodCalories: number, exerciseCaloriesBurned: number): number => {
  const validFoodCalories = isNaN(foodCalories) ? 0 : foodCalories;
  const validExerciseCaloriesBurned = isNaN(exerciseCaloriesBurned) ? 0 : exerciseCaloriesBurned;

  return validFoodCalories - validExerciseCaloriesBurned;
};

export default { mapExerciseEntries, formatDate, calculateFoodTotals, calculateExerciseTotals, calculateNetGainLoss };