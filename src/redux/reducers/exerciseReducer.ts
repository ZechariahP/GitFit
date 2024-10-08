import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExerciseEntry {
  exercise: string;
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
    addExercise: (state, action: PayloadAction<ExerciseEntry>) => {
      state.entries.push(action.payload);
    },
  },
});

export const { addExercise } = exerciseSlice.actions;
export default exerciseSlice.reducer;