import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BMRState {
  weight: number;
  height: number;
  age: number;
  bmr: number;
}

const initialState: BMRState = {
  weight: 0,
  height: 0,
  age: 0,
  bmr: 0,
};

const bmrSlice = createSlice({
  name: 'bmr',
  initialState,
  reducers: {
    setBMR: (state, action: PayloadAction<{ weight: number; height: number; age: number }>) => {
      const { weight, height, age } = action.payload;
      state.weight = weight;
      state.height = height;
      state.age = age;
      state.bmr = 10 * weight + 6.25 * height - 5 * age + 5; // Simplified BMR calculation
    },
    updateWeight: (state, action: PayloadAction<number>) => {
      state.weight = action.payload;
      state.bmr = 10 * state.weight + 6.25 * state.height - 5 * state.age + 5; // Update BMR
    },
  },
});

export const { setBMR, updateWeight } = bmrSlice.actions;
export default bmrSlice.reducer;