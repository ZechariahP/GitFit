import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExerciseEntry {
  exercise: string;
  duration: number;
  caloriesBurned: number;
}

interface ExerciseState {
  entries: ExerciseEntry[];
}

const initialState: ExerciseState = {
  entries: [],
};

const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    addExerciseEntry: (state, action: PayloadAction<ExerciseEntry>) => {
      state.entries.push(action.payload);
    },
    removeExerciseEntry: (state, action: PayloadAction<number>) => {
      state.entries.splice(action.payload, 1);
    },
    // Add any other existing reducers here
  },
});

export const { addExerciseEntry, removeExerciseEntry } = exerciseSlice.actions;
export default exerciseSlice.reducer;