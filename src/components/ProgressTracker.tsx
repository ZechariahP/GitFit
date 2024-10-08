import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const ProgressTracker: React.FC = () => {
  const foodEntries = useSelector((state: RootState) => state.food.entries);
  const exerciseEntries = useSelector((state: RootState) => state.exercise.entries);
  const [manualFoodEntries, setManualFoodEntries] = useState([]);

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem('manualFoodEntries') || '[]');
    setManualFoodEntries(storedEntries);
  }, []);

  return (
    <div>
      <h2>Progress Tracker</h2>
      <h3>Food Entries</h3>
      <ul>
        {foodEntries.map((entry, index) => (
          <li key={index}>
            {entry.food}: {entry.calories} calories, {entry.fat}g fat, {entry.protein}g protein, {entry.sodium}mg sodium, {entry.carbs}g carbs
          </li>
        ))}
        {manualFoodEntries.map((entry, index) => (
          <li key={index}>
            {entry.food}: {entry.calories} calories, {entry.fat}g fat, {entry.protein}g protein, {entry.sodium}mg sodium, {entry.carbs}g carbs
          </li>
        ))}
      </ul>
      <h3>Exercise Entries</h3>
      <ul>
        {exerciseEntries.map((entry, index) => (
          <li key={index}>{entry.exercise}: {entry.caloriesBurned} calories burned</li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressTracker;