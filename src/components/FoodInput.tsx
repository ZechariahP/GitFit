import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import { addFoodEntry } from '../redux/reducers/foodReducer';
import { fetchFoodData, fetchFoodSuggestions } from '../services/foodService';
import './FoodInput.css';

const FoodInput: React.FC = () => {
  const [food, setFood] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [calories, setCalories] = useState('');
  const [fat, setFat] = useState('');
  const [protein, setProtein] = useState('');
  const [sodium, setSodium] = useState('');
  const [carbs, setCarbs] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleAddFood = async () => {
    try {
      const data = await fetchFoodData(food);
      if (data.results && data.results.length > 0) {
        const foodItem = data.results[0];
        setCalories(foodItem.calories || '');
        setFat(foodItem.fat || '');
        setProtein(foodItem.protein || '');
        setSodium(foodItem.sodium || '');
        setCarbs(foodItem.carbs || '');

        dispatch(addFoodEntry({
          food,
          calories: foodItem.calories || 0,
          fat: foodItem.fat || 0,
          protein: foodItem.protein || 0,
          sodium: foodItem.sodium || 0,
          carbs: foodItem.carbs || 0
        }));

        // Clear the input fields
        setFood('');
        setCalories('');
        setFat('');
        setProtein('');
        setSodium('');
        setCarbs('');
        setAmount('');
        setError('');
      } else {
        console.error('No food data found');
        setError('No food data found. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching food data:', error);
      setError('Failed to fetch food data. Please try again.');
    }
  };

  const handleManualAddFood = () => {
    const manualFoodEntry = {
      food,
      amount: Number(amount),
      calories: Number(calories),
      fat: Number(fat),
      protein: Number(protein),
      sodium: Number(sodium),
      carbs: Number(carbs)
    };
    const existingEntries = JSON.parse(localStorage.getItem('manualFoodEntries') || '[]');
    existingEntries.push(manualFoodEntry);
    localStorage.setItem('manualFoodEntries', JSON.stringify(existingEntries));
    dispatch(addFoodEntry(manualFoodEntry));

    // Clear the input fields
    setFood('');
    setAmount('');
    setCalories('');
    setFat('');
    setProtein('');
    setSodium('');
    setCarbs('');
    setError('');
  };

  const onSuggestionsFetchRequested = async ({ value }: { value: string }) => {
    try {
      const data = await fetchFoodSuggestions(value);
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setError('Failed to fetch suggestions. Please try again.');
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion: { title: string }) => suggestion.title;

  const renderSuggestion = (suggestion: { title: string }) => (
    <div>
      {suggestion.title}
    </div>
  );

  const inputProps = {
    placeholder: 'Search for food',
    value: food,
    onChange: (_: React.FormEvent<any>, { newValue }: { newValue: string }) => setFood(newValue)
  };

  return (
    <div>
      <h2>Food Input</h2>
      {error && <div className="error">{error}</div>}
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
      <button onClick={handleAddFood}>Add Food from API</button>
      <div>
        <h3>Manual Entry</h3>
        <input type="text" value={food} onChange={(e) => setFood(e.target.value)} placeholder="Food Name" />
        <input type="number" className="no-spinner" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (g)" />
        <input type="number" className="no-spinner" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="Calories" />
        <input type="number" className="no-spinner" value={fat} onChange={(e) => setFat(e.target.value)} placeholder="Fat (g)" />
        <input type="number" className="no-spinner" value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="Protein (g)" />
        <input type="number" className="no-spinner" value={sodium} onChange={(e) => setSodium(e.target.value)} placeholder="Sodium (mg)" />
        <input type="number" className="no-spinner" value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="Carbs (g)" />
        <button onClick={handleManualAddFood}>Add Manual Food</button>
      </div>
    </div>
  );
};

export default FoodInput;