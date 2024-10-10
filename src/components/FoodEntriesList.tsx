import React from 'react';
import { FoodEntry } from '../types/FoodEntry';

interface FoodEntriesListProps {
  entries: FoodEntry[];
  isEditing: boolean;
  onRemove: (index: number) => void;
}

const FoodEntriesList: React.FC<FoodEntriesListProps> = ({ entries, isEditing, onRemove }) => {
  return (
    <ul>
      {entries.map((entry, index) => (
        <li key={index}>
          {entry.food}: {entry.calories} calories, {entry.fat}g fat, {entry.protein}g protein, {entry.sodium}mg sodium, {entry.carbs}g carbs
          {isEditing && <button onClick={() => onRemove(index)}>Remove</button>}
        </li>
      ))}
    </ul>
  );
};

export default FoodEntriesList;