import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FoodEntry } from '../types/FoodEntry';

interface FoodInputProps {
  onAddFoodEntry: (entry: FoodEntry) => void;
  user_id: number; // Add userId prop
}

const FoodInput: React.FC<FoodInputProps> = ({ onAddFoodEntry, user_id }) => {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [fat, setFat] = useState('');
  const [protein, setProtein] = useState('');
  const [sodium, setSodium] = useState('');
  const [carbs, setCarbs] = useState('');
  const [entryDate, setEntryDate] = useState<Date | null>(new Date());

  const handleAddFoodEntry = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    const dateKey = entryDate ? entryDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const newEntry: FoodEntry = {
      id: Date.now(), // or any other unique identifier
      food,
      calories: parseInt(calories, 10),
      fat: parseInt(fat, 10),
      protein: parseInt(protein, 10),
      sodium: parseInt(sodium, 10),
      carbs: parseInt(carbs, 10),
      date: dateKey,
      user_id, // Include userId in the new entry
    };
    onAddFoodEntry(newEntry);
    setFood('');
    setCalories('');
    setFat('');
    setProtein('');
    setSodium('');
    setCarbs('');
    setEntryDate(new Date());
  };

  return (
    <form onSubmit={handleAddFoodEntry}>
      <input type="text" value={food} onChange={(e) => setFood(e.target.value)} placeholder="Food Name" required />
      <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="Calories" required />
      <input type="number" value={fat} onChange={(e) => setFat(e.target.value)} placeholder="Fat (g)" required />
      <input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="Protein (g)" required />
      <input type="number" value={sodium} onChange={(e) => setSodium(e.target.value)} placeholder="Sodium (mg)" required />
      <input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="Carbs (g)" required />
      <DatePicker
        selected={entryDate}
        onChange={(date: Date | null) => date && setEntryDate(date)}
      />
      <button type="submit">Add Food Entry</button>
    </form>
  );
};

export default FoodInput;