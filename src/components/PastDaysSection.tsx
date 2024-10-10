import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import FoodEntriesList from './FoodEntriesList';
import ExerciseEntriesList from './ExerciseEntriesList';
import { FoodEntry } from '../types/FoodEntry';
import { ExerciseEntry } from '../types/ExerciseEntry';

interface PastDaysSectionProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  filter: 'day' | 'week' | 'month';
  onFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  pastDayFoodEntries: FoodEntry[];
  pastDayExerciseEntries: ExerciseEntry[];
  isEditing: boolean;
  toggleEditing: () => void;
  handleRemoveFoodEntry: (index: number, isCurrentDay: boolean) => void;
  handleRemoveExerciseEntry: (index: number, isCurrentDay: boolean) => void;
}

const PastDaysSection: React.FC<PastDaysSectionProps> = ({
  selectedDate,
  onDateChange,
  filter,
  onFilterChange,
  pastDayFoodEntries,
  pastDayExerciseEntries,
  isEditing,
  toggleEditing,
  handleRemoveFoodEntry,
  handleRemoveExerciseEntry,
}) => {
  const getFilterOptions = () => {
    switch (filter) {
      case 'day':
        return (
          <>
            <option value="week">By Week</option>
            <option value="month">By Month</option>
          </>
        );
      case 'week':
        return (
          <>
            <option value="day">By Day</option>
            <option value="month">By Month</option>
          </>
        );
      case 'month':
        return (
          <>
            <option value="day">By Day</option>
            <option value="week">By Week</option>
          </>
        );
    }
  };

  return (
    <div>
      <h3>Past Days</h3>
      <select value={filter} onChange={onFilterChange}>
        {getFilterOptions()}
      </select>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => onDateChange(date as Date | null)}
        dateFormat="yyyy-MM-dd"
        placeholderText="Select a date"
        maxDate={new Date(new Date().setDate(new Date().getDate() - 1))} // Set maxDate to yesterday
      />
      {selectedDate && (
        <div>
          <button onClick={toggleEditing}>{isEditing ? 'Done' : 'Edit'}</button>
          <h4>Food Entries</h4>
          <FoodEntriesList
            entries={pastDayFoodEntries}
            isEditing={isEditing}
            onRemove={(index) => handleRemoveFoodEntry(index, false)}
          />
          <h4>Exercise Entries</h4>
          <ExerciseEntriesList
            entries={pastDayExerciseEntries}
            isEditing={isEditing}
            onRemove={(index) => handleRemoveExerciseEntry(index, false)}
          />
        </div>
      )}
    </div>
  );
};

export default PastDaysSection;