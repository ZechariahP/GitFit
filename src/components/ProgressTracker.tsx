import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RootState } from '../redux/store';
import { ExerciseEntry } from '../types/ExerciseEntry';
import { FoodEntry } from '../types/FoodEntry';
import FoodEntriesTable from './FoodEntriesTable';
import ExerciseEntriesTable from './ExerciseEntriesTable';
import { mapExerciseEntries, formatDate, calculateFoodTotals, calculateExerciseTotals } from '../utils/utils';
import './ProgressTracker.css';

interface ProgressTrackerProps {
  date: string;
  foodEntries: FoodEntry[];
  exerciseEntries: ExerciseEntry[];
  onRemoveFoodEntry: (id: number) => void;
  onRemoveExerciseEntry: (id: number) => void;
  user_id: number;
  email: string;
  bmr: number | null;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ date, foodEntries, exerciseEntries, onRemoveFoodEntry, onRemoveExerciseEntry }) => {
  const user_id = useSelector((state: RootState) => state.auth.user?.id);
  const [currentDayEntries, setCurrentDayEntries] = useState<{ foodEntries: FoodEntry[], exerciseEntries: ExerciseEntry[] }>({ foodEntries: [], exerciseEntries: [] });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<Date | null>(null);
  const [filter, setFilter] = useState<'week' | 'month' | 'date'>('week');
  const [pastEntries, setPastEntries] = useState<{ date: string, foodEntries: FoodEntry[], exerciseEntries: ExerciseEntry[] }[]>([]);
  const [user, setUser] = useState<{ id: number, firstName: string, email: string, weight?: number, bmr?: number }>({ id: 0, firstName: '', email: ''});
  const [bmr, setBmr] = useState<number>(0);


  useEffect(() => {
    fetch('http://localhost:5000/api/')
      .then(response => response.text())
      .catch(error => console.error('Error fetching API message:', error));

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/bmr?email=${user.email}`)
        .then(response => response.json())
        .then(data => {
          setBmr(data.bmr);
        })
        .catch(error => {
          console.error('Error fetching BMR:', error);
        });
    }
  }, [user]);

  const [currentDate] = useState(new Date(date).toLocaleDateString('en-CA'));

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const foodResponse = await fetch(`http://localhost:5000/api/progress/food?date=${currentDate}&user_id=${user.id}`);
        const exerciseResponse = await fetch(`http://localhost:5000/api/progress/exercise?date=${currentDate}&user_id=${user.id}`);

        if (!foodResponse.ok || !exerciseResponse.ok) {
          throw new Error('Failed to fetch progress data');
        }

        const foodData = await foodResponse.json();
        const exerciseData = await exerciseResponse.json();



        const mappedExerciseEntries = mapExerciseEntries(exerciseData);


        setCurrentDayEntries({
          foodEntries: foodData,
          exerciseEntries: mappedExerciseEntries
        });
      } catch (error) {
        console.error('Error fetching progress data:', error);
      }
    };

    if (user.id) {
      fetchProgressData();
    }
  }, [currentDate, user.id, foodEntries, exerciseEntries]);

  useEffect(() => {
    if (user_id !== undefined) {
      fetchPastEntries();
    }
  }, [filter, selectedDate, selectedMonth, selectedWeek]);

  const fetchPastEntries = async (user_id: number = user.id) => {
    let dates: Date[] = [];

    if (filter === 'week' && selectedWeek) {
      const startOfWeek = new Date(selectedWeek);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date;
      });
    } else if (filter === 'month' && selectedMonth) {
      const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
      const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
      dates = Array.from({ length: endOfMonth.getDate() }, (_, i) => {
        const day = new Date(startOfMonth);
        day.setDate(startOfMonth.getDate() + i);
        return day;
      });
    } else if (filter === 'date' && selectedDate) {
      dates = [selectedDate];
    }

    const entries = user_id !== undefined ? await fetchEntriesForDateRange(dates) : [];
    setPastEntries(entries);
  };

  const fetchEntriesForDateRange = async (date: Date[]) => {
    return await Promise.all(date.map(async (date) => {
      const formattedDate = formatDate(date);
      try {
        const foodResponse = await fetch(`http://localhost:5000/api/progress/food?date=${formattedDate}&user_id=${user.id}`);
        const exerciseResponse = await fetch(`http://localhost:5000/api/progress/exercise?date=${formattedDate}&user_id=${user.id}`);

        if (!foodResponse.ok || !exerciseResponse.ok) {
          if (foodResponse.status === 404 || exerciseResponse.status === 404) {
            return { date: formattedDate, foodEntries: [], exerciseEntries: [] };
          }
          throw new Error(`HTTP error! status: ${foodResponse.status} or ${exerciseResponse.status}`);
        }

        const foodData = await foodResponse.json();
        const exerciseData = await exerciseResponse.json();

        return { date: formattedDate, foodEntries: foodData, exerciseEntries: exerciseData };
      } catch (error) {
        console.error('Error fetching data:', error);
        return { date: formattedDate, foodEntries: [], exerciseEntries: [] };
      }
    }));
  };

  const handleRemoveFoodEntry = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/progress/food?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete food entry');
      }

      setCurrentDayEntries(prevState => ({
        ...prevState,
        foodEntries: prevState.foodEntries.filter(entry => entry.id !== id)
      }));

      setPastEntries(prevEntries => prevEntries.map(foodEntry => ({
        ...foodEntry,
        foodEntries: foodEntry.foodEntries.filter(foodEntry => foodEntry.id !== id)
      })));

      onRemoveFoodEntry(id);
    } catch (error) {
      console.error('Error deleting food entry:', error);
    }
  };

  const handleRemoveExerciseEntry = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/progress/exercise?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete exercise entry');
      }

      setCurrentDayEntries(prevState => ({
        ...prevState,
        exerciseEntries: prevState.exerciseEntries.filter(entry => entry.id !== id)
      }));

      setPastEntries(prevEntries => prevEntries.map(exerciseEntry => ({
        ...exerciseEntry,
        exerciseEntries: exerciseEntry.exerciseEntries.filter(exerciseEntry => exerciseEntry.id !== id)
      })));

      onRemoveExerciseEntry(id);
    } catch (error) {
      console.error('Error deleting exercise entry:', error);
    }
  };

  const handleDateChange = async (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      const formattedDate = formatDate(date);
      const user_id = user.id; // Ensure user_id is defined
      try {
        const foodResponse = await fetch(`http://localhost:5000/api/progress/food?date=${formattedDate}&user_id=${user_id}`);
        const exerciseResponse = await fetch(`http://localhost:5000/api/progress/exercise?date=${formattedDate}&user_id=${user_id}`);

        if (!foodResponse.ok || !exerciseResponse.ok) {
          throw new Error('Failed to fetch progress data');
        }

        const foodData = await foodResponse.json();
        const exerciseData = await exerciseResponse.json();

        const mappedExerciseEntries = mapExerciseEntries(exerciseData);

        setPastEntries([{ date: formattedDate, foodEntries: foodData, exerciseEntries: mappedExerciseEntries }]);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      }
    }
  };

  const handleMonthChange = async (date: Date | null) => {
    if (date) {
      setSelectedMonth(date);
      setFilter('month');
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const today = new Date();
      let endOfMonth;
  
      if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth()) {
        // If the selected month is the current month, set the end date to yesterday
        endOfMonth = new Date(today);
        endOfMonth.setDate(today.getDate() - 1);
      } else {
        // Otherwise, set the end date to the last day of the selected month
        endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      }
  
      const dates = Array.from({ length: endOfMonth.getDate() - startOfMonth.getDate() + 1 }, (_, i) => {
        const day = new Date(startOfMonth);
        day.setDate(startOfMonth.getDate() + i);
        return day;
      });
  
      const entries = await fetchEntriesForDateRange(dates);
      setPastEntries(entries);
    }
  };

  const handleWeekChange = async (date: Date | null) => {
    if (date) {
      setSelectedWeek(date);
      setFilter('week');
      const startOfWeek = new Date(date);
      const dates = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        return day;
      });
      const entries = await fetchEntriesForDateRange(dates);
      setPastEntries(entries);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value as 'week' | 'month' | 'date');
  };

  const filterMonth = (date: Date) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    return date.getFullYear() < currentYear || (date.getFullYear() === currentYear && date.getMonth() <= currentMonth);
  };

  const filterWeek = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison
    const dayDifference = Math.floor((today.getTime() - date.getTime()) / (1000 * 3600 * 24));
    return dayDifference % 7 === 0 && date < today;
  };

  const filterDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison
    return date < today;
  };

  const currentFoodEntries = currentDayEntries.foodEntries;
  const currentExerciseEntries = currentDayEntries.exerciseEntries;

  // Calculate net calories for the current date
  const currentFoodTotals = calculateFoodTotals(currentFoodEntries);
  const currentExerciseTotals = calculateExerciseTotals(currentExerciseEntries);
  const calculateNetGainLoss = (currentFoodTotals.calories || 0) - (currentExerciseTotals.caloriesBurned || 0);

  
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <h2>Progress Tracker</h2>
        <div>
          <h3>Current Day: {new Date().toLocaleDateString('en-US', { timeZone: 'GMT' })}</h3>
          <h4>Net Gain/Loss</h4>
          <p>Net Calories: {calculateNetGainLoss - bmr}</p>
              <FoodEntriesTable
                foodEntries={currentFoodEntries}
                onRemoveFoodEntry={handleRemoveFoodEntry}
                calculateFoodTotals={calculateFoodTotals}
                user_id={user_id}
              />
              <ExerciseEntriesTable
                exerciseEntries={currentExerciseEntries}
                onRemoveExerciseEntry={handleRemoveExerciseEntry}
                calculateExerciseTotals={calculateExerciseTotals}
                user_id={user_id}
              />
          </div>
        </div>
          <div style={{ flex: 1, marginLeft: '20px' }}>
        <h2>Previous Entries</h2>
        <div>
          {filter === 'date' && (
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a date"
              filterDate={filterDate}
            />
          )}
          {filter === 'month' && (
            <DatePicker
              selected={selectedMonth}
              onChange={handleMonthChange}
              dateFormat="yyyy-MM"
              showMonthYearPicker
              placeholderText="Select a month"
              filterDate={filterMonth}
            />
          )}
          {filter === 'week' && (
            <DatePicker
              selected={selectedWeek}
              onChange={handleWeekChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a week"
              filterDate={filterWeek}
              showWeekNumbers
              showFullMonthYearPicker
            />
          )}
          <select value={filter} onChange={handleFilterChange}>
            <option value="week">By Week</option>
            <option value="month">By Month</option>
            <option value="date">By Date</option>
          </select>
        </div>
        {pastEntries.map((entry, index) => {
          const entryFoodTotals = calculateFoodTotals(entry.foodEntries);
          const entryExerciseTotals = calculateExerciseTotals(entry.exerciseEntries);
          return (
            <div key={index}>
              <h4>{new Date(entry.date).toLocaleDateString('en-US', { timeZone: 'GMT' })}</h4>
              <h5>Food Entries</h5>
              <table style={{ border: '1px solid black', width: '100%', marginBottom: '20px' }}>
                <thead>
                  <tr>
                    <th>Food</th>
                    <th>Calories</th>
                    <th>Fat (g)</th>
                    <th>Protein (g)</th>
                    <th>Sodium (mg)</th>
                    <th>Carbs (g)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {entry.foodEntries.map((foodEntry) => (
                    <tr key={foodEntry.id?.toString() || `food-${foodEntry.food}-${foodEntry.calories}`}>
                      <td>{foodEntry.food}</td>
                      <td>{foodEntry.calories}</td>
                      <td>{foodEntry.fat}</td>
                      <td>{foodEntry.protein}</td>
                      <td>{foodEntry.sodium}</td>
                      <td>{foodEntry.carbs}</td>
                      <td>
                        <button onClick={() => handleRemoveFoodEntry(foodEntry.id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p>Calories: {entryFoodTotals.calories}</p>
                <p>Fat: {entryFoodTotals.fat}g</p>
                <p>Protein: {entryFoodTotals.protein}g</p>
                <p>Sodium: {entryFoodTotals.sodium}mg</p>
                <p>Carbs: {entryFoodTotals.carbs}g</p>
              </div>
              <h5>Exercise Entries</h5>
              <table style={{ border: '1px solid black', width: '100%', marginBottom: '20px' }}>
                <thead>
                  <tr>
                    <th>Exercise</th>
                    <th>Duration (mins)</th>
                    <th>Calories Burned</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {entry.exerciseEntries.map((exerciseEntry) => (
                    <tr key={exerciseEntry.id?.toString() || `exercise-${exerciseEntry.exercise}-${exerciseEntry.duration}`}>
                      <td>{exerciseEntry.exercise}</td>
                      <td>{exerciseEntry.duration}</td>
                      <td>{exerciseEntry.calories_burned}</td>
                      <td>
                        <button onClick={() => handleRemoveExerciseEntry(exerciseEntry.id || 0)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <p>Duration: {entryExerciseTotals.duration} mins</p>
                <p>Calories Burned: {entryExerciseTotals.caloriesBurned}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;