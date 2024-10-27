import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FoodEntry } from '../../types/FoodEntry';

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
    setFoodEntries: (state, action: PayloadAction<FoodEntry[]>) => {
      state.entries = action.payload;
    },
    addFoodEntry: (state, action: PayloadAction<FoodEntry>) => {
      state.entries.push(action.payload);
    },
    removeFoodEntry: (state, action: PayloadAction<number>) => {
      state.entries.splice(action.payload, 1);
    },
  },
});

export const { setFoodEntries, addFoodEntry, removeFoodEntry } = foodSlice.actions;
export default foodSlice.reducer;