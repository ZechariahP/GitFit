import React from 'react';
import { ExerciseEntry } from '../types/ExerciseEntry';

interface ExerciseEntriesListProps {
    entries: ExerciseEntry[];  
    isEditing: boolean;  
    onRemove: (index: number) => void;  
    onCheckboxChange?: (index: number) => void;  
    selectedEntries?: number[];  
  }

const ExerciseEntriesList: React.FC<ExerciseEntriesListProps> = ({ entries, isEditing, onRemove, onCheckboxChange, selectedEntries }) => {
  return (
    <ul>
      {entries.map((entry, index) => (
        <li key={index}>
          <input
            type="checkbox"
            checked={selectedEntries?.includes(index) || false}
            onChange={() => onCheckboxChange && onCheckboxChange(index)}
          />
          {entry.exercise}: {entry.duration} minutes, {entry.caloriesBurned} calories burned
          {isEditing && onRemove && <button onClick={() => onRemove(index)}>Remove</button>}
        </li>
      ))}
    </ul>
  );
};

export default ExerciseEntriesList;