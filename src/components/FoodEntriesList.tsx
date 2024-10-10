import React from 'react';
import { FoodEntry } from '../types/FoodEntry';

interface FoodEntriesListProps {
    entries: FoodEntry[];
    isEditing: boolean;
    onRemove: (index: number) => void;  
    onCheckboxChange?: (index: number) => void;  
    selectedEntries?: number[];  
  }
  

const FoodEntriesList: React.FC<FoodEntriesListProps> = ({ entries, isEditing, onRemove, onCheckboxChange, selectedEntries }) => {
  return (
    <ul>
      {entries.map((entry, index) => (
        <li key={index}>
          {onCheckboxChange && (
            <input
              type="checkbox"
              checked={selectedEntries?.includes(index) || false}
              onChange={() => onCheckboxChange(index)}
            />
          )}
          {entry.food}: {entry.calories} calories, {entry.fat}g fat, {entry.protein}g protein, {entry.sodium}mg sodium, {entry.carbs}g carbs
          {isEditing && onRemove && <button onClick={() => onRemove(index)}>Remove</button>}
        </li>
      ))}
    </ul>
  );
};

export default FoodEntriesList;