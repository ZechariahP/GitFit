import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ExerciseEntry } from '../types/ExerciseEntry';

interface ExerciseInputProps {
  onAddExerciseEntry: (entry: ExerciseEntry) => void;
}

const ExerciseInput: React.FC<ExerciseInputProps> = ({ onAddExerciseEntry }) => {
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
      duration: parseFloat(duration),
      caloriesBurned: parseFloat(caloriesBurned),
      date: dateKey,
    };

    try {
      const response = await fetch('http://localhost:5000/api/progress/exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      });

      if (!response.ok) {
        throw new Error('Failed to add exercise entry');
      }

      const data = await response.json();
      console.log('Exercise entry added successfully:', data);
      onAddExerciseEntry(data);
    } catch (error) {
      console.error('Error adding exercise entry:', error);
    }
  };

  return (
    <form onSubmit={handleAddExerciseEntry}>
      <input
        type="text"
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
        placeholder="Enter exercise"
      />
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Enter duration (minutes)"
      />
      <input
        type="number"
        value={caloriesBurned}
        onChange={(e) => setCaloriesBurned(e.target.value)}
        placeholder="Enter calories burned"
      />
      <DatePicker
        selected={entryDate}
        onChange={(date: Date | null) => setEntryDate(date)}
      />
      <button type="submit">Add Exercise Entry</button>
    </form>
  );
};

export default ExerciseInput;