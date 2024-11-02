import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ExerciseEntry } from '../types/ExerciseEntry';

interface ExerciseInputProps {
  onAddExerciseEntry: (entry: ExerciseEntry) => void;
  user_id: number; // Add userId prop
}

const ExerciseInput: React.FC<ExerciseInputProps> = ({ onAddExerciseEntry, userId }) => {
  const [exercise, setExercise] = useState('');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [entryDate, setEntryDate] = useState<Date | null>(new Date());

  const handleAddExerciseEntry = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    const dateKey = entryDate ? entryDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const newEntry: ExerciseEntry = {
      id: Date.now(), // or any other unique identifier
      exercise,
      duration: parseInt(duration, 10),
      caloriesBurned: parseInt(caloriesBurned, 10),
      date: dateKey,
      user_id, // Include userId in the new entry
    };
    onAddExerciseEntry(newEntry);
    setExercise('');
    setDuration('');
    setCaloriesBurned('');
    setEntryDate(new Date());
  };

  return (
    <form onSubmit={handleAddExerciseEntry}>
      <input
        type="text"
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
        placeholder="Exercise"
        required
      />
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Duration (minutes)"
        required
      />
      <input
        type="number"
        value={caloriesBurned}
        onChange={(e) => setCaloriesBurned(e.target.value)}
        placeholder="Calories Burned"
        required
      />
      <DatePicker
        selected={entryDate}
        onChange={(date: Date | null) => date && setEntryDate(date)}
      />
      <button type="submit">Add Exercise Entry</button>
    </form>
  );
};

export default ExerciseInput;