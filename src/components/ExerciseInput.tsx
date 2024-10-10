import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addExerciseEntry } from '../redux/reducers/exerciseReducer';

const ExerciseInput: React.FC = () => {
  const [exercise, setExercise] = useState('');
  const [duration, setDuration] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const dispatch = useDispatch();

  const handleAddExercise = () => {
    dispatch(addExerciseEntry({ exercise, duration, caloriesBurned }));
  };

  return (
    <div>
      <h2>Exercise Input</h2>
      <input type="text" value={exercise} onChange={(e) => setExercise(e.target.value)} placeholder="Exercise" />
      <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} placeholder="Duration (minutes)" />
      <input type="number" value={caloriesBurned} onChange={(e) => setCaloriesBurned(Number(e.target.value))} placeholder="Calories Burned" />
      <button onClick={handleAddExercise}>Add Exercise</button>
    </div>
  );
};

export default ExerciseInput;