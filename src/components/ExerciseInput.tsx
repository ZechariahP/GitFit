import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addExercise } from '../redux/reducers/exerciseReducer';

const ExerciseInput: React.FC = () => {
  const [exercise, setExercise] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const dispatch = useDispatch();

  const handleAddExercise = () => {
    dispatch(addExercise({ exercise, caloriesBurned }));
  };

  return (
    <div>
      <h2>Exercise Input</h2>
      <input type="text" value={exercise} onChange={(e) => setExercise(e.target.value)} placeholder="Exercise" />
      <input type="number" value={caloriesBurned} onChange={(e) => setCaloriesBurned(Number(e.target.value))} placeholder="Calories Burned" />
      <button onClick={handleAddExercise}>Add Exercise</button>
    </div>
  );
};

export default ExerciseInput;