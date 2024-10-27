import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addExerciseEntry } from '../redux/reducers/exerciseReducer';

interface ExerciseEntry {
  id: number;
  exercise: string;
  duration: number;
  caloriesBurned: number;
  date: string;
}

interface ExerciseInputProps {
  exerciseEntries: ExerciseEntry[];
  setExerciseEntries: (entries: ExerciseEntry[]) => void;
  onAddExerciseEntry: (newEntry: ExerciseEntry) => void;
}

const ExerciseInput: React.FC<ExerciseInputProps> = ({ exerciseEntries, setExerciseEntries }) => {
  const [exercise, setExercise] = useState('');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [entryDate, setEntryDate] = useState(new Date());
  const dispatch = useDispatch();

  const handleAddExerciseEntry = () => {
    const dateKey = entryDate.toISOString().split('T')[0];
    const newEntry = {
      id: Date.now(), // or any other unique identifier
      exercise: exercise,
      duration: parseFloat(duration),
      caloriesBurned: parseFloat(caloriesBurned),
      date: dateKey,
    };
    setExerciseEntries([...exerciseEntries, newEntry]);
    dispatch(addExerciseEntry(newEntry));
    setExercise('');
    setDuration('');
    setCaloriesBurned('');
  };

  return (
    <div className="exercise-input">
      <input
        type="text"
        placeholder="Exercise"
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
      />
      <input
        type="text"
        placeholder="Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <input
        type="text"
        placeholder="Calories Burned"
        value={caloriesBurned}
        onChange={(e) => setCaloriesBurned(e.target.value)}
      />
      <DatePicker
        selected={entryDate}
        onChange={(date: Date | null) => date && setEntryDate(date)}
      />
      <button onClick={handleAddExerciseEntry}>Add Exercise Entry</button>
    </div>
  );
};

export default ExerciseInput;