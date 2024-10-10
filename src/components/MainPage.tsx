import React, { useEffect, useState } from 'react';
import FoodInput from './FoodInput';
import ExerciseInput from './ExerciseInput';
import ProgressTracker from './ProgressTracker';
import BMRDisplay from './BMRDisplay';

const MainPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<{ firstName: string, email: string } | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/')
      .then(response => response.text())
      .then(data => setMessage(data));

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div>
      <h1>GitFit Health Tracker</h1>
      <p>{message}</p>
      {user && (
        <div>
          <p>Welcome {user.firstName}</p>
          <BMRDisplay />
        </div>
      )}
      <FoodInput />
      <ExerciseInput />
      <ProgressTracker />
    </div>
  );
};

export default MainPage;