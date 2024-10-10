import React from 'react';
import { ExerciseEntry } from '../types/ExerciseEntry';

interface ExerciseEntriesListProps {
  entries: ExerciseEntry[];
  isEditing: boolean;
  onRemove: (index: number) => void;
}

const ExerciseEntriesList: React.FC<ExerciseEntriesListProps> = ({ entries, isEditing, onRemove }) => {
  return (
    <ul>
      {entries.map((entry, index) => (
        <li key={index}>
          {entry.exercise}: {entry.duration} minutes, {entry.caloriesBurned} calories burned
          {isEditing && <button onClick={() => onRemove(index)}>Remove</button>}
        </li>
      ))}
    </ul>
  );
};

export default ExerciseEntriesList;