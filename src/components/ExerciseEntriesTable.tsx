import React from 'react';
import { ExerciseEntry } from '../types/ExerciseEntry';

interface ExerciseEntriesTableProps {
  exerciseEntries: ExerciseEntry[];
  onRemoveExerciseEntry: (id: number) => void;
  calculateExerciseTotals: (entries: ExerciseEntry[]) => { duration: number, caloriesBurned: number };
  user_id: number | undefined;
}

const ExerciseEntriesTable: React.FC<ExerciseEntriesTableProps> = ({ exerciseEntries, onRemoveExerciseEntry, calculateExerciseTotals, user_id }) => {

  const handleRemove = (id: number) => {
    onRemoveExerciseEntry(id);
  };

  return (
    <div>
      <h4>Exercise Entries</h4>
      <table style={{ border: '1px solid black', width: '100%', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Duration (mins)</th>
            <th>Calories Burned</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {exerciseEntries.map((entry) => (
            <tr key={entry.id?.toString() || `exercise-${entry.exercise}-${entry.duration}`}>
              <td>{entry.exercise}</td>
              <td>{entry.duration}</td>
              <td>{entry.calories_burned}</td>
              <td>
                <button onClick={() => handleRemove(entry.id || 0)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
        <p>Duration: {calculateExerciseTotals(exerciseEntries).duration} mins</p>
        <p>Calories Burned: {calculateExerciseTotals(exerciseEntries).caloriesBurned}</p>
      </div>
    </div>
  );
};

export default ExerciseEntriesTable;