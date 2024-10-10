import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { addFoodEntry, removeFoodEntry } from '../redux/reducers/foodReducer';
import { addExerciseEntry, removeExerciseEntry } from '../redux/reducers/exerciseReducer';
import FoodEntriesList from './FoodEntriesList';
import ExerciseEntriesList from './ExerciseEntriesList';
import PastDaysSection from './PastDaysSection';
import { ExerciseEntry } from '../types/ExerciseEntry';
import { FoodEntry } from '../types/FoodEntry';

const ProgressTracker: React.FC = () => {
  const dispatch = useDispatch();
  const foodEntries = useSelector((state: RootState) => state.food.entries);
  const exerciseEntries: ExerciseEntry[] = useSelector((state: RootState) => state.exercise.entries);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [pastDayFoodEntries, setPastDayFoodEntries] = useState<FoodEntry[]>([]);
  const [pastDayExerciseEntries, setPastDayExerciseEntries] = useState<ExerciseEntry[]>([]);
  const [filter, setFilter] = useState<'day' | 'week' | 'month'>('week');
  const [last7DaysEntries, setLast7DaysEntries] = useState<{ date: Date, foodEntries: FoodEntry[], exerciseEntries: ExerciseEntry[] }[]>([]);
  const [monthlyEntries, setMonthlyEntries] = useState<{ date: Date, foodEntries: FoodEntry[], exerciseEntries: ExerciseEntry[] }[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newFoodEntry, setNewFoodEntry] = useState<FoodEntry>({ food: '', calories: 0, fat: 0, protein: 0, sodium: 0, carbs: 0 });
  const [newExerciseEntry, setNewExerciseEntry] = useState<ExerciseEntry>({ exercise: '', duration: 0, caloriesBurned: 0 });
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedEntries, setSelectedEntries] = useState<{ food: number[], exercise: number[] }>({ food: [], exercise: [] });

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem('manualFoodEntries') || '[]');
    setManualFoodEntries(storedEntries);
    fetchLast7DaysEntries();
  }, []);

  const fetchLast7DaysEntries = async () => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i - 1); // Exclude the current date
      return date;
    });
    const entries = await Promise.all(last7Days.map(async (date) => {
      try {
        const response = await fetch(`http://localhost:5000/api/progress/${date.toISOString().split('T')[0]}`);
        if (!response.ok) {
          if (response.status === 404) {
            const storedEntries = JSON.parse(localStorage.getItem('manualFoodEntries') || '[]');
            return { date, foodEntries: storedEntries, exerciseEntries: [] };
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return { date, foodEntries: data.foodEntries, exerciseEntries: data.exerciseEntries };
      } catch (error) {
        console.error('Error fetching data:', error);
        const storedEntries = JSON.parse(localStorage.getItem('manualFoodEntries') || '[]');
        return { date, foodEntries: storedEntries, exerciseEntries: [] };
      }
    }));
    setLast7DaysEntries(entries);
  };

  const fetchMonthlyEntries = async (date: Date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysInMonth = Array.from({ length: endOfMonth.getDate() }, (_, i) => {
      const day = new Date(startOfMonth);
      day.setDate(startOfMonth.getDate() + i);
      return day;
    });

    const entries = await Promise.all(daysInMonth.map(async (date) => {
      try {
        const response = await fetch(`http://localhost:5000/api/progress/${date.toISOString().split('T')[0]}`);
        if (!response.ok) {
          if (response.status === 404) {
            const storedEntries = JSON.parse(localStorage.getItem('manualFoodEntries') || '[]');
            return { date, foodEntries: storedEntries, exerciseEntries: [] };
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return { date, foodEntries: data.foodEntries, exerciseEntries: data.exerciseEntries };
      } catch (error) {
        console.error('Error fetching data:', error);
        const storedEntries = JSON.parse(localStorage.getItem('manualFoodEntries') || '[]');
        return { date, foodEntries: storedEntries, exerciseEntries: [] };
      }
    }));
    setMonthlyEntries(entries);
  };

  const fetchEntries = async (date: Date, filter: 'day' | 'week' | 'month') => {
    if (filter === 'month') {
      await fetchMonthlyEntries(date);
      return;
    }

    let url = `http://localhost:5000/api/progress/${date.toISOString().split('T')[0]}`;
    if (filter === 'week') {
      const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
      url = `http://localhost:5000/api/progress/week/${startOfWeek.toISOString().split('T')[0]}`;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          const storedEntries = JSON.parse(localStorage.getItem('manualFoodEntries') || '[]');
          setPastDayFoodEntries(storedEntries);
          setPastDayExerciseEntries([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPastDayFoodEntries(data.foodEntries);
      setPastDayExerciseEntries(data.exerciseEntries);
    } catch (error) {
      console.error('Error fetching data:', error);
      const storedEntries = JSON.parse(localStorage.getItem('manualFoodEntries') || '[]');
      setPastDayFoodEntries(storedEntries);
      setPastDayExerciseEntries([]);
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      fetchEntries(date, filter);
    }
  };
    fetchEntries(new Date(), filter);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = event.target.value as 'day' | 'week' | 'month';
    setFilter(newFilter);
    if (selectedDate) {
      fetchEntries(selectedDate, newFilter);
    }
  };

  const handleRemoveFoodEntry = (index: number, isCurrentDay: boolean) => {
    if (isCurrentDay) {
      dispatch(removeFoodEntry(index));
    } else {
      const updatedEntries = [...pastDayFoodEntries];
      updatedEntries.splice(index, 1);
      setPastDayFoodEntries(updatedEntries);
    }
  };

  const handleRemoveExerciseEntry = (index: number, isCurrentDay: boolean) => {
    if (isCurrentDay) {
      dispatch(removeExerciseEntry(index));
    } else {
      const updatedEntries = [...pastDayExerciseEntries];
      updatedEntries.splice(index, 1);
      setPastDayExerciseEntries(updatedEntries);
    }
  };

  const handleAddFoodEntry = (entry: FoodEntry) => {
    const date = new Date(entryDate);
    if (date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]) {
      dispatch(addFoodEntry(entry));
    } else {
      // Handle adding entry to a past date
      const updatedEntries = [...pastDayFoodEntries, entry];
      setPastDayFoodEntries(updatedEntries);
    }
  };

  const handleAddExerciseEntry = (entry: ExerciseEntry) => {
    const date = new Date(entryDate);
    if (date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]) {
      dispatch(addExerciseEntry(entry));
    } else {
      // Handle adding entry to a past date
      const updatedEntries = [...pastDayExerciseEntries, entry];
      setPastDayExerciseEntries(updatedEntries);
    }
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleExerciseInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewExerciseEntry((prev) => ({
      ...prev,
      [name]: name === 'duration' || name === 'caloriesBurned' ? Number(value) : value,
    }));
  };

  const handleFoodFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAddFoodEntry(newFoodEntry);
    setNewFoodEntry({ food: '', calories: 0, fat: 0, protein: 0, sodium: 0, carbs: 0 });
  };

  const handleExerciseFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAddExerciseEntry(newExerciseEntry);
    setNewExerciseEntry({ exercise: '', duration: 0, caloriesBurned: 0 });
  };

  const handleFoodInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewFoodEntry((prev) => ({
      ...prev,
      [name]: name === 'calories' || name === 'fat' || name === 'protein' || name === 'sodium' || name === 'carbs' ? Number(value) : value,
    }));
  };

  const handleCheckboxChange = (type: 'food' | 'exercise', index: number) => {
    setSelectedEntries((prev) => {
      const updated = { ...prev };
      if (updated[type].includes(index)) {
        updated[type] = updated[type].filter((i) => i !== index);
      } else {
        updated[type].push(index);
      }
      return updated;
    });
  };

  const handleRemoveSelectedEntries = () => {
    selectedEntries.food.forEach((index) => handleRemoveFoodEntry(index, false));
    selectedEntries.exercise.forEach((index) => handleRemoveExerciseEntry(index, false));
    setSelectedEntries({ food: [], exercise: [] });
  };

  return (
    <div>
      <h2>Progress Tracker</h2>
      <div>
        <h3>Current Day</h3>
        <h4>Food Entries</h4>
        <FoodEntriesList
          entries={foodEntries}
          isEditing={isEditing}
          onRemove={(index) => handleRemoveFoodEntry(index, true)}
        />
        <form onSubmit={handleFoodFormSubmit}>
          <input
            type="text"
            name="food"
            value={newFoodEntry.food}
            onChange={handleFoodInputChange}
            placeholder="Food"
            required
          />
          <input
            type="number"
            name="calories"
            value={newFoodEntry.calories}
            onChange={handleFoodInputChange}
            placeholder="Calories"
            required
          />
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            required
          />
          <button type="submit">Add Food Entry</button>
        </form>
        <h4>Exercise Entries</h4>
        <ExerciseEntriesList
          entries={exerciseEntries}
          isEditing={true}
          onRemove={(index) => handleRemoveExerciseEntry(index, true)}
        />
        <form onSubmit={handleExerciseFormSubmit}>
          <input
            type="text"
            name="exercise"
            value={newExerciseEntry.exercise}
            onChange={handleExerciseInputChange}
            placeholder="Exercise"
            required
          />
          <input
            type="number"
            name="duration"
            value={newExerciseEntry.duration}
            onChange={handleExerciseInputChange}
            placeholder="Duration (minutes)"
            required
          />
          <input
            type="number"
            name="caloriesBurned"
            value={newExerciseEntry.caloriesBurned}
            onChange={handleExerciseInputChange}
            placeholder="Calories Burned"
            required
          />
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            required
          />
          <button type="submit">Add Exercise Entry</button>
        </form>
      </div>
      <PastDaysSection
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        filter={filter}
        onFilterChange={handleFilterChange}
        pastDayFoodEntries={pastDayFoodEntries}
        pastDayExerciseEntries={pastDayExerciseEntries}
        isEditing={isEditing}
        toggleEditing={toggleEditing}
        handleRemoveFoodEntry={handleRemoveFoodEntry}
        handleRemoveExerciseEntry={handleRemoveExerciseEntry}
      />
      {filter === 'week' && (
        <>
          <h4>Last 7 Days Entries</h4>
          {last7DaysEntries.map((dayEntries, index) => (
            <div key={index}>
              <h5>{dayEntries.date.toDateString()}</h5>
              <h6>Food Entries</h6>
              <FoodEntriesList
                entries={dayEntries.foodEntries}
                isEditing={isEditing}
                onRemove={(i) => handleRemoveFoodEntry(i, false)}
                onCheckboxChange={(i) => handleCheckboxChange('food', i)}
                selectedEntries={selectedEntries.food}
              />
              <h6>Exercise Entries</h6>
              <ExerciseEntriesList
                entries={dayEntries.exerciseEntries}
                isEditing={isEditing}
                onRemove={(i) => handleRemoveExerciseEntry(i, false)}
                onCheckboxChange={(i) => handleCheckboxChange('exercise', i)}
                selectedEntries={selectedEntries.exercise}
              />
            </div>
          ))}
        </>
      )}
      {filter === 'month' && (
        <>
          <h4>Monthly Entries</h4>
          {monthlyEntries.map((dayEntries, index) => (
            <div key={index}>
              <h5>{dayEntries.date.toDateString()}</h5>
              <h6>Food Entries</h6>
              <FoodEntriesList
                entries={dayEntries.foodEntries}
                isEditing={isEditing}
                onRemove={(i) => handleRemoveFoodEntry(i, false)}
                onCheckboxChange={(i) => handleCheckboxChange('food', i)}
                selectedEntries={selectedEntries.food}
              />
              <h6>Exercise Entries</h6>
              <ExerciseEntriesList
                entries={dayEntries.exerciseEntries}
                isEditing={isEditing}
                onRemove={(i) => handleRemoveExerciseEntry(i, false)}
                onCheckboxChange={(i) => handleCheckboxChange('exercise', i)}
                selectedEntries={selectedEntries.exercise}
              />
            </div>
          ))}
        </>
      )}
      {isEditing && (
        <button onClick={handleRemoveSelectedEntries}>Remove Selected Entries</button>
      )}
    </div>
  );
};

export default ProgressTracker;