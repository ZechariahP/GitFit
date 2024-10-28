import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RootState } from '../redux/store';
import { ExerciseEntry } from '../types/ExerciseEntry';
import { FoodEntry } from '../types/FoodEntry';

const mapExerciseEntries = (entries: ExerciseEntry[]) => {
  return entries.map(entry => ({
    ...entry,
    caloriesBurned: entry.calories_burned,
  }));
};

interface ProgressTrackerProps {
  date: string;
  foodEntries: FoodEntry[];
  exerciseEntries: ExerciseEntry[];
  onRemoveFoodEntry: (id: number) => void;
  onRemoveExerciseEntry: (id: number) => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ date, foodEntries, exerciseEntries, onRemoveFoodEntry, onRemoveExerciseEntry }) => {
  const bmr = useSelector((state: RootState) => state.bmr.bmr);

  const [currentDayEntries, setCurrentDayEntries] = useState<{ foodEntries: FoodEntry[], exerciseEntries: ExerciseEntry[] }>({ foodEntries: [], exerciseEntries: [] });
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<Date | null>(null);
  const [filter, setFilter] = useState<'week' | 'month' | 'date'>('week');
  const [pastEntries, setPastEntries] = useState<{ date: Date, foodEntries: FoodEntry[], exerciseEntries: ExerciseEntry[] }[]>([]);
  
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const foodResponse = await fetch(`http://localhost:5000/api/progress/food/${date}`);
        const exerciseResponse = await fetch(`http://localhost:5000/api/progress/exercise/${date}`);

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
        if (error instanceof Error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('An unknown error occurred');
          }
        } else {
          setError('An unknown error occurred');
        }
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchProgressData();
  }, [date, foodEntries, exerciseEntries]);

  useEffect(() => {
    fetchPastEntries();
  }, [filter, selectedDate, selectedMonth, selectedWeek]);

  const fetchPastEntries = async () => {
    let dates: Date[] = [];

    if (filter === 'week' && selectedWeek) {
      dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(selectedWeek);
        date.setDate(selectedWeek.getDate() + i);
        return date;
      });
    } else if (filter === 'month' && selectedMonth) {
      const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
      const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
      dates = Array.from({ length: endOfMonth.getDate() }, (_, i) => {
        const day = new Date(startOfMonth);
        day.setDate(startOfMonth.getDate() + i);
        return day;
      }).filter(filterMonth);
    } else if (filter === 'date' && selectedDate) {
      dates = [selectedDate].filter(filterDate);
    }

    const entries = await fetchEntriesForDateRange(dates);
    setPastEntries(entries);
  };

  const fetchEntriesForDateRange = async (dates: Date[]) => {
    return await Promise.all(dates.map(async (date) => {
      try {
        const foodResponse = await fetch(`http://localhost:5000/api/progress/food/${date}`);
        const exerciseResponse = await fetch(`http://localhost:5000/api/progress/exercise/${date}`);

        if (!foodResponse.ok || !exerciseResponse.ok) {
          if (foodResponse.status === 404 || exerciseResponse.status === 404) {
            return { date, foodEntries: [], exerciseEntries: [] };
          }
          throw new Error(`HTTP error! status: ${foodResponse.status} or ${exerciseResponse.status}`);
        }

        const foodData = await foodResponse.json();
        const exerciseData = await exerciseResponse.json();

        return { date, foodEntries: foodData, exerciseEntries: exerciseData };
      } catch (error) {
        console.error('Error fetching data:', error);
        return { date, foodEntries: [], exerciseEntries: [] };
      }
    }));
  };

  const handleRemoveFoodEntry = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/progress/food/${date}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete food entry');
      }

      onRemoveFoodEntry(id);
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

      onRemoveExerciseEntry(id);
    } catch (error) {
      console.error('Error deleting exercise entry:', error);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setFilter('date');
  };

  const handleMonthChange = (date: Date | null) => {
    setSelectedMonth(date);
    setFilter('month');
  };

  const handleWeekChange = (date: Date | null) => {
    setSelectedWeek(date);
    setFilter('week');
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

  const calculateFoodTotals = (entries: FoodEntry[]) => {
    return entries.reduce(
      (totals, entry) => {
        totals.calories += entry.calories || 0;
        totals.fat += entry.fat || 0;
        totals.protein += entry.protein || 0;
        totals.sodium += entry.sodium || 0;
        totals.carbs += entry.carbs || 0;
        return totals;
      },
      { calories: 0, fat: 0, protein: 0, sodium: 0, carbs: 0 }
    );
  };

  const calculateExerciseTotals = (exerciseEntries: ExerciseEntry[]) => {
    return exerciseEntries.reduce(
      (totals, entry) => {
        totals.duration += entry.duration || 0;
        totals.caloriesBurned += entry.caloriesBurned || 0;
        return totals;
      },
      { duration: 0, caloriesBurned: 0 }
    );
  };

console.log('exerciseEntries:', exerciseEntries);


  const calculateNetGainLoss = (foodCalories: number, exerciseCaloriesBurned: number, bmr: number) => {
    return foodCalories - exerciseCaloriesBurned - bmr;
  };

  // Filter entries for the current date
  const currentFoodEntries = currentDayEntries.foodEntries;
  const currentExerciseEntries = currentDayEntries.exerciseEntries;

  // Calculate net calories for the current date
  const currentFoodTotals = calculateFoodTotals(currentFoodEntries);
  const currentExerciseTotals = calculateExerciseTotals(currentExerciseEntries);
  const currentNetCalories = currentFoodEntries.length === 0 && currentExerciseEntries.length === 0
    ? -bmr
    : calculateNetGainLoss(currentFoodTotals.calories, currentExerciseTotals.caloriesBurned, bmr);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <h2>Progress Tracker</h2>
        <div>
          <h3>Current Day: {date}</h3>
          <h4>Net Gain/Loss</h4>
          <p>Net Calories: {currentNetCalories}</p>
          <h4>Food Entries</h4>
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
              {currentFoodEntries.map((entry) => (
                <tr key={entry.id?.toString() || `food-${entry.food}-${entry.calories}`}>
                  <td>{entry.food}</td>
                  <td>{entry.calories}</td>
                  <td>{entry.fat}</td>
                  <td>{entry.protein}</td>
                  <td>{entry.sodium}</td>
                  <td>{entry.carbs}</td>
                  <td>
                    <button onClick={() => handleRemoveFoodEntry(entry.id || 0)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p>Calories: {calculateFoodTotals(currentDayEntries.foodEntries).calories}</p>
            <p>Fat: {calculateFoodTotals(currentDayEntries.foodEntries).fat}g</p>
            <p>Protein: {calculateFoodTotals(currentDayEntries.foodEntries).protein}g</p>
            <p>Sodium: {calculateFoodTotals(currentDayEntries.foodEntries).sodium}mg</p>
            <p>Carbs: {calculateFoodTotals(currentDayEntries.foodEntries).carbs}g</p>
          </div>
          <h4>Exercise Entries</h4>
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
              {currentExerciseEntries.map((entry) => (
                <tr key={entry.id?.toString() || `exercise-${entry.exercise}-${entry.duration}`}>
                  <td>{entry.exercise}</td>
                  <td>{entry.duration}</td>
                  <td>{entry.caloriesBurned}</td>
                  <td>
                    <button onClick={() => handleRemoveExerciseEntry(entry.id || 0)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <p>Duration: {calculateExerciseTotals(currentDayEntries.exerciseEntries).duration} mins</p>
            <p>Calories Burned: {calculateExerciseTotals(currentDayEntries.exerciseEntries).caloriesBurned}</p>
          </div>
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
              <h4>{entry.date.toDateString()}</h4>
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
                        <button onClick={() => handleRemoveFoodEntry(foodEntry.id || 0)}>Remove</button>
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
                      <td>{exerciseEntry.caloriesBurned}</td>
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