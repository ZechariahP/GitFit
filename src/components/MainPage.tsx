import React, { useEffect, useState } from 'react';
import FoodInput from './FoodInput';
import ExerciseInput from './ExerciseInput';
import ProgressTracker from './ProgressTracker';
import BMRDisplay from './BMRDisplay';

const MainPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<{ firstName: string, email: string } | null>(null);
  const [date, setDate] = useState('');
  const [foodEntries, setFoodEntries] = useState<any[]>([]);
  const [exerciseEntries, setExerciseEntries] = useState<any[]>([]);
  const [bmr, setBmr] = useState<number | null>(null);
  const [loadingBmr, setLoadingBmr] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/')
      .then(response => response.text())
      .then(data => setMessage(data));

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch BMR data from local storage
    const bmrData = localStorage.getItem('bmr');
    if (bmrData) {
      setBmr(parseFloat(bmrData));
      setLoadingBmr(false);
    } else {
      // Fetch BMR data from server if not found in local storage
      fetch('http://localhost:5000/api/bmr')
        .then(response => response.json())
        .then(data => {
          setBmr(data.bmr);
          setLoadingBmr(false);
        })
        .catch(error => {
          console.error('Error fetching BMR data:', error);
          setLoadingBmr(false);
        });
    }
  }, []);

  const addEntry = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, foodEntries, exerciseEntries }),
      });

      if (!response.ok) {
        throw new Error('Failed to add entry');
      }

      const data = await response.json();
      console.log('Entry added successfully:', data);
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  const handleRemoveFoodEntry = (id: number) => {
    setFoodEntries(foodEntries.filter(entry => entry.id !== id));
  };

  const handleRemoveExerciseEntry = (id: number) => {
    setExerciseEntries(exerciseEntries.filter(entry => entry.id !== id));
  };

  return (
    <div>
      <h1>Main Page</h1>
      <p>{message}</p>
      {user && <p>Welcome, {user.firstName}!</p>}
      {loadingBmr ? <p>Loading BMR...</p> : bmr !== null && <BMRDisplay bmr={bmr} />}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <FoodInput 
        foodEntries={foodEntries} 
        setFoodEntries={setFoodEntries} 
        onAddFoodEntry={(newEntry) => setFoodEntries([...foodEntries, newEntry])} 
      />
      <ExerciseInput 
        exerciseEntries={exerciseEntries} 
        setExerciseEntries={setExerciseEntries} 
        onAddExerciseEntry={(newEntry) => setExerciseEntries([...exerciseEntries, newEntry])} 
      />
      <ProgressTracker 
        date={date} 
        foodEntries={foodEntries} 
        exerciseEntries={exerciseEntries} 
        onRemoveFoodEntry={handleRemoveFoodEntry} 
        onRemoveExerciseEntry={handleRemoveExerciseEntry} 
      />
    </div>
  );
};

export default MainPage;
