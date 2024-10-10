import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RootState } from '../redux/store';
import { removeFoodEntry } from '../redux/reducers/foodReducer';
import { removeExerciseEntry } from '../redux/reducers/exerciseReducer';
import FoodEntriesList from './FoodEntriesList';
import ExerciseEntriesList from './ExerciseEntriesList';
import { ExerciseEntry } from '../types/ExerciseEntry';
import { FoodEntry } from '../types/FoodEntry';

const ProgressTracker: React.FC = () => {
  const dispatch = useDispatch();
  const foodEntries = useSelector((state: RootState) => state.food.entries);
  const exerciseEntries: ExerciseEntry[] = useSelector((state: RootState) => state.exercise.entries);

  const [currentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<Date | null>(null);
  const [filter, setFilter] = useState<'week' | 'month' | 'date'>('week');
  const [pastEntries, setPastEntries] = useState<{ date: Date, foodEntries: FoodEntry[], exerciseEntries: ExerciseEntry[] }[]>([]);

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
      }).filter(filterWeek);
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
        const response = await fetch(`http://localhost:5000/api/progress/${date.toISOString().split('T')[0]}`);
        if (!response.ok) {
          if (response.status === 404) {
            return { date, foodEntries: [], exerciseEntries: [] };
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return { date, foodEntries: data.foodEntries, exerciseEntries: data.exerciseEntries };
      } catch (error) {
        console.error('Error fetching data:', error);
        return { date, foodEntries: [], exerciseEntries: [] };
      }
    }));
  };

  const handleRemoveFoodEntry = (index: number) => {
    dispatch(removeFoodEntry(index));
  };

  const handleRemoveExerciseEntry = (index: number) => {
    dispatch(removeExerciseEntry(index));
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
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const isCurrentMonth = date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
    const isPastMonth = date < new Date(today.getFullYear(), today.getMonth(), 1);
    return isCurrentMonth ? date < yesterday : isPastMonth;
  };

  const filterWeek = (date: Date) => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    return date < today && date >= sevenDaysAgo;
  };

  const filterDate = (date: Date) => {
    const today = new Date();
    return date < today;
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <h2>Progress Tracker</h2>
        <div>
          <h3>Current Day: {currentDate}</h3>
          <h4>Food Entries</h4>
          <FoodEntriesList
            entries={foodEntries}
            isEditing={true}
            onRemove={handleRemoveFoodEntry}
          />
          <h4>Exercise Entries</h4>
          <ExerciseEntriesList
            entries={exerciseEntries}
            isEditing={true}
            onRemove={handleRemoveExerciseEntry}
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
        {pastEntries.map((entry, index) => (
          <div key={index}>
            <h4>{entry.date.toDateString()}</h4>
            <h5>Food Entries</h5>
            <FoodEntriesList
              entries={entry.foodEntries}
              isEditing={true}
              onRemove={(i) => handleRemoveFoodEntry(i)}
            />
            <h5>Exercise Entries</h5>
            <ExerciseEntriesList
              entries={entry.exerciseEntries}
              isEditing={true}
              onRemove={(i) => handleRemoveExerciseEntry(i)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;