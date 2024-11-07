import React from 'react';
import { FoodEntry } from '../types/FoodEntry';

interface FoodEntriesTableProps {
  foodEntries: FoodEntry[];
  onRemoveFoodEntry: (id: number) => void;
  calculateFoodTotals: (entries: FoodEntry[]) => { calories: number, fat: number, protein: number, sodium: number, carbs: number };
  user_id: number | undefined;
}

const FoodEntriesTable: React.FC<FoodEntriesTableProps> = ({ foodEntries, onRemoveFoodEntry, calculateFoodTotals }) => {

  const handleRemove = (id: number) => {
    onRemoveFoodEntry(id);
  };

  return (
    <div>
      <h4>Food Entries</h4>
      <table style={{ border: '1px solid black', width: '100%', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th>Food</th>
            <th>Calories</th>
            <th>Fat (g)</th>
            <th>Protein (g)</th>
            <th>Sodium (mg)</th>
            <th>Carbs (g)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {foodEntries.map((entry) => (
            <tr key={entry.id?.toString() || `food-${entry.food}-${entry.calories}`}>
              <td>{entry.food}</td>
              <td>{entry.calories}</td>
              <td>{entry.fat}</td>
              <td>{entry.protein}</td>
              <td>{entry.sodium}</td>
              <td>{entry.carbs}</td>
              <td>
                <button onClick={() => handleRemove(entry.id || 0)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p>Calories: {calculateFoodTotals(foodEntries).calories}</p>
        <p>Fat: {calculateFoodTotals(foodEntries).fat}g</p>
        <p>Protein: {calculateFoodTotals(foodEntries).protein}g</p>
        <p>Sodium: {calculateFoodTotals(foodEntries).sodium}mg</p>
        <p>Carbs: {calculateFoodTotals(foodEntries).carbs}g</p>
      </div>
    </div>
  );
};

export default FoodEntriesTable;