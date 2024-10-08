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
    addFood: (state, action: PayloadAction<FoodEntry>) => {
      state.entries.push(action.payload);
    },
  },
});

export const { addFood } = foodSlice.actions;
export default foodSlice.reducer;