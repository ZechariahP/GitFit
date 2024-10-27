import React, { useState } from 'react';
import { FoodEntry } from '../types/FoodEntry';

interface FoodInputProps {
  onAddFoodEntry: (newEntry: FoodEntry) => void;
  foodEntries: FoodEntry[];
  setFoodEntries: (entries: FoodEntry[]) => void;
}

const FoodInput: React.FC<FoodInputProps> = ({ onAddFoodEntry }) => {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [fat, setFat] = useState('');
  const [protein, setProtein] = useState('');
  const [sodium, setSodium] = useState('');
  const [carbs, setCarbs] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: FoodEntry = {
      id: Date.now(),
      food: foodName,
      calories: parseInt(calories),
      fat: parseInt(fat),
      protein: parseInt(protein),
      sodium: parseInt(sodium),
      carbs: parseInt(carbs),
      date: new Date().toISOString().split('T')[0]
    };
    onAddFoodEntry(newEntry);
    // Reset form fields
    setFoodName('');
    setCalories('');
    setFat('');
    setProtein('');
    setSodium('');
    setCarbs('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} placeholder="Food Name" required />
      <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="Calories" required />
      <input type="number" value={fat} onChange={(e) => setFat(e.target.value)} placeholder="Fat (g)" required />
      <input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="Protein (g)" required />
      <input type="number" value={sodium} onChange={(e) => setSodium(e.target.value)} placeholder="Sodium (mg)" required />
      <input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="Carbs (g)" required />
      <button type="submit">Add Food Entry</button>
    </form>
  );
};

export default FoodInput;