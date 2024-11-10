import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodInput from './FoodInput';
import ExerciseInput from './ExerciseInput';
import ProgressTracker from './ProgressTracker';
import BMRDisplay from './BMRDisplay';
import './MainPage.css'; // Import the CSS file

const MainPage: React.FC = () => {
  const [user, setUser] = useState<{ id: number, firstname: string, email: string, weight?: number } | null>(null);
  const [date] = useState(new Date().toLocaleDateString('en-CA'));
  const [foodEntries, setFoodEntries] = useState<any[]>([]);
  const [exerciseEntries, setExerciseEntries] = useState<any[]>([]);
  const [bmr, setBmr] = useState<number | null>(null);
  const [loadingBmr, setLoadingBmr] = useState(true);
  const [newWeight, setNewWeight] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/')
      .then(response => response.text())
      .catch(error => console.error('Error fetching API message:', error));

    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/bmr?email=${user.email}`)
        .then(response => response.json())
        .then(data => {
          console.log('BMR data:', data);
          setBmr(data.bmr);
          setLoadingBmr(false);
        })
        .catch(error => {
          console.error('Error fetching BMR:', error);
          setLoadingBmr(false);
        });

      fetch(`http://localhost:5000/api/progress/food?date=${date}&user_id=${user.id}`)
        .then(response => {
          if (!response.ok) {
            if (response.status === 404) {
              console.warn('No food entries found for the specified date and user.');
              return [];
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Food entries:', data);
          setFoodEntries(data);
        })
        .catch(error => console.error('Error fetching food entries:', error));

      fetch(`http://localhost:5000/api/progress/exercise?date=${date}&user_id=${user.id}`)
        .then(response => {
          if (!response.ok) {
            if (response.status === 404) {
              console.warn('No exercise entries found for the specified date and user.');
              return [];
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Exercise entries:', data);
          setExerciseEntries(data);
        })
        .catch(error => console.error('Error fetching exercise entries:', error));
    }
  }, [user, date]);

  const handleWeightUpdate = async () => {
    if (user && newWeight) {
      try {
        const response = await fetch('http://localhost:5000/api/update-weight', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: user.email, weight: newWeight }),
        });

        if (!response.ok) {
          throw new Error('Failed to update weight');
        }

        const data = await response.json();
        setUser({ ...user, weight: newWeight });
        setBmr(data.bmr); // Update BMR state with the new BMR value
        setNewWeight(null);

        // Fetch the updated BMR from the database
        const bmrResponse = await fetch(`http://localhost:5000/api/bmr?email=${user.email}`);
        if (!bmrResponse.ok) {
          throw new Error('Failed to fetch updated BMR');
        }
        const bmrData = await bmrResponse.json();
        setBmr(bmrData.bmr); // Update BMR state with the fetched BMR value
      } catch (error) {
        console.error('Error updating weight:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleAddFoodEntry = async (newEntry: any) => {
    if (user) {
      try {
        const response = await fetch('http://localhost:5000/api/progress/food', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...newEntry, userId: user.id }),
        });

        if (!response.ok) {
          throw new Error('Failed to add food entry');
        }

        const data = await response.json();
        setFoodEntries([...foodEntries, data]);
      } catch (error) {
        console.error('Error adding food entry:', error);
      }
    }
  };

  const handleAddExerciseEntry = async (newEntry: any) => {
    if (user) {
      try {
        const response = await fetch('http://localhost:5000/api/progress/exercise', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...newEntry, userId: user.id }),
        });

        if (!response.ok) {
          throw new Error('Failed to add exercise entry');
        }

        const data = await response.json();
        setExerciseEntries([...exerciseEntries, data]);
      } catch (error) {
        console.error('Error adding exercise entry:', error);
      }
    }
  };

  const handleRemoveFoodEntry = async (id: number) => {
    if (id) {
      try {
        const response = await fetch(`http://localhost:5000/api/progress/food?id=${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to remove food entry');
        }

        setFoodEntries(foodEntries.filter(entry => entry.id !== id));
      } catch (error) {
        console.error('Error removing food entry:', error);
      }
    }
  };

  const handleRemoveExerciseEntry = async (id: number) => {
    if (exerciseEntries) {
      try {
        const response = await fetch(`http://localhost:5000/api/progress/exercise?id=${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to remove exercise entry');
        }

        setExerciseEntries(exerciseEntries.filter(entry => entry.id !== id));
      } catch (error) {
        console.error('Error removing exercise entry:', error);
      }
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Main Page</h1>
      </header>
      <div className="welcome-container">
        {user && (
          <p>
            Welcome, {user.firstname}!
            <button style={{ marginLeft: '20px' }} onClick={handleLogout}>Logout</button>
          </p>
        )}
      </div>
      <div className="update-weight-container">
        <label>
          Update Weight (kg):
          <input
            type="number"
            value={newWeight !== null ? newWeight : ''}
            onChange={(e) => setNewWeight(Number(e.target.value))}
          />
        </label>
        <button onClick={handleWeightUpdate}>Update Weight</button>
      </div>
      {loadingBmr ? <p>Loading BMR...</p> : bmr !== null && user !== null && <BMRDisplay bmr={bmr} />}
      <div className="main-content">
        <div className="input-container">
          {user && <FoodInput onAddFoodEntry={handleAddFoodEntry} user_id={user.id} />}
          {user && <ExerciseInput onAddExerciseEntry={handleAddExerciseEntry} user_id={user.id} />}
        </div>
        <div className="progress-tracker-container">
          {user && (
            <ProgressTracker 
              date={date} 
              foodEntries={foodEntries} 
              exerciseEntries={exerciseEntries}
              onRemoveFoodEntry={handleRemoveFoodEntry} 
              onRemoveExerciseEntry={handleRemoveExerciseEntry}
              user_id={user.id}
              bmr={bmr}
              email={user.email}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;