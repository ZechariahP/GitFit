import React, { useEffect, useState } from 'react';
import FoodInput from './FoodInput';
import ExerciseInput from './ExerciseInput';
import ProgressTracker from './ProgressTracker';

const MainPage: React.FC = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/')
      .then(response => response.text())
      .then(data => setMessage(data));
  }, []);

  return (
    <div>
      <h1>GitFit Health Tracker</h1>
      <p>{message}</p>
      <FoodInput />
      <ExerciseInput />
      <ProgressTracker />
    </div>
  );
};

export default MainPage;