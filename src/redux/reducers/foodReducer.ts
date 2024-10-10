import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FoodEntry {
  food: string;
  calories: number;
  fat?: number;
  protein?: number;
  sodium?: number;
  carbs?: number;
}

interface FoodState {
  entries: FoodEntry[];
}

const initialState: FoodState = {
  entries: [],
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    addFoodEntry: (state, action: PayloadAction<FoodEntry>) => {
      state.entries.push(action.payload);
    },
    removeFoodEntry: (state, action: PayloadAction<number>) => {
      state.entries.splice(action.payload, 1);
    },
    // Add any other existing reducers here
  },
});

export const { addFoodEntry, removeFoodEntry } = foodSlice.actions;
export default foodSlice.reducer;