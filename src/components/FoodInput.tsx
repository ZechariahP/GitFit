import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FoodEntry } from '../types/FoodEntry';

interface FoodInputProps {
  onAddFoodEntry: (entry: FoodEntry) => void;
}

const FoodInput: React.FC<FoodInputProps> = ({ onAddFoodEntry }) => {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [fat, setFat] = useState('');
  const [protein, setProtein] = useState('');
  const [sodium, setSodium] = useState('');
  const [carbs, setCarbs] = useState('');
  const [entryDate, setEntryDate] = useState<Date | null>(new Date());

  const handleAddFoodEntry = async () => {
    const dateKey = entryDate ? entryDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const newEntry: FoodEntry = {
      id: Date.now(), // or any other unique identifier
      foodName,
      calories: parseFloat(calories),
      fat: parseFloat(fat),
      protein: parseFloat(protein),
      sodium: parseFloat(sodium),
      carbs: parseFloat(carbs),
      date: dateKey,
    };

    try {
      const response = await fetch('http://localhost:5000/api/progress/food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: dateKey, foodEntries: [newEntry] }),
      });

      if (!response.ok) {
        throw new Error('Failed to add food entry');
      }

      const data = await response.json();
      console.log('Food entry added successfully:', data);
      onAddFoodEntry(newEntry);
      setFoodName('');
      setCalories('');
      setFat('');
      setProtein('');
      setSodium('');
      setCarbs('');
    } catch (error) {
      console.error('Error adding food entry:', error);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleAddFoodEntry(); }}>
      <input type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} placeholder="Food Name" required />
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