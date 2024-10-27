import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodInput from './FoodInput';
import ExerciseInput from './ExerciseInput';
import ProgressTracker from './ProgressTracker';
import BMRDisplay from './BMRDisplay';

const MainPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<{ firstName: string, email: string } | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [foodEntries, setFoodEntries] = useState<any[]>([]);
  const [exerciseEntries, setExerciseEntries] = useState<any[]>([]);
  const [bmr, setBmr] = useState<number | null>(null);
  const [loadingBmr, setLoadingBmr] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/')
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(error => console.error('Error fetching API message:', error));

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch BMR data from the server
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

  const handleRemoveFoodEntry = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/progress/food/${date}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete food entry');
      }

      setFoodEntries(foodEntries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting food entry:', error);
    }
  };

  const handleRemoveExerciseEntry = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/progress/exercise/${date}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete exercise entry');
      }

      setExerciseEntries(exerciseEntries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting exercise entry:', error);
    }
  };

  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  };

  const handleAddFoodEntry = (newEntry: any) => {
    setFoodEntries([...foodEntries, newEntry]);
    // Send the new entry to the server
    fetch('http://localhost:5000/api/progress/food', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEntry),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add food entry');
      }
      return response.json();
    })
    .then(data => {
      console.log('Food entry added successfully:', data);
      // Fetch the latest progress data
      fetchProgressData();
    })
    .catch(error => {
      console.error('Error adding food entry:', error);
    });
  };

  const handleAddExerciseEntry = (newEntry: any) => {
    setExerciseEntries([...exerciseEntries, newEntry]);
    // Send the new entry to the server
    fetch('http://localhost:5000/api/progress/exercise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEntry),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add exercise entry');
      }
      return response.json();
    })
    .then(data => {
      console.log('Exercise entry added successfully:', data);
      // Fetch the latest progress data
      fetchProgressData();
    })
    .catch(error => {
      console.error('Error adding exercise entry:', error);
    });
  };

  const fetchProgressData = async () => {
    try {
      const foodResponse = await fetch(`http://localhost:5000/api/progress/food/${date}`);
      const exerciseResponse = await fetch(`http://localhost:5000/api/progress/exercise/${date}`);

      if (!foodResponse.ok || !exerciseResponse.ok) {
        throw new Error('Failed to fetch progress data');
      }

      const foodData = await foodResponse.json();
      const exerciseData = await exerciseResponse.json();

      setFoodEntries(foodData);
      setExerciseEntries(exerciseData);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  return (
    <div>
      <h1>Main Page</h1>
      <p>{message}</p>
      {user && <p>Welcome, {user.firstName}!</p>}
      <button onClick={handleLogout}>Logout</button>
      {loadingBmr ? <p>Loading BMR...</p> : bmr !== null && <BMRDisplay bmr={bmr} />}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <FoodInput onAddFoodEntry={handleAddFoodEntry} />
      <ExerciseInput 
        onAddExerciseEntry={handleAddExerciseEntry} 
        exerciseEntries={exerciseEntries} 
        setExerciseEntries={setExerciseEntries} 
      />
      <button onClick={addEntry}>Add Entry</button>
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