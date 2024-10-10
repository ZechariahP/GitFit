import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addExerciseEntry } from '../redux/reducers/exerciseReducer';

const ExerciseInput: React.FC = () => {
  const [exercise, setExercise] = useState('');
  const [duration, setDuration] = useState<number | null>(null);
  const [caloriesBurned, setCaloriesBurned] = useState<number | null>(null);
  const [entryDate, setEntryDate] = useState(new Date());
  const dispatch = useDispatch();

  const handleAddExercise = () => {
    dispatch(addExerciseEntry({
      exercise,
      duration: duration ?? 0,
      caloriesBurned: caloriesBurned ?? 0,
      date: entryDate.toISOString().split('T')[0]
    }));
    // Clear the input fields
    setExercise('');
    setDuration(null);
    setCaloriesBurned(null);
    setEntryDate(new Date());
  };

  return (
    <div>
      <h2>Exercise Input</h2>
      <input
        type="text"
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
        placeholder="Exercise"
      />
      <input
        type="number"
        value={duration !== null ? duration : ''}
        onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : null)}
        placeholder="Duration (minutes)"
      />
      <input
        type="number"
        value={caloriesBurned !== null ? caloriesBurned : ''}
        onChange={(e) => setCaloriesBurned(e.target.value ? Number(e.target.value) : null)}
        placeholder="Calories Burned"
      />
      <DatePicker
        selected={entryDate}
        onChange={(date: Date | null) => date && setEntryDate(date)}
        dateFormat="yyyy-MM-dd"
      />
      <button onClick={handleAddExercise}>Add Exercise</button>
    </div>
  );
};

export default ExerciseInput;