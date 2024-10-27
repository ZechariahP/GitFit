import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExerciseEntry } from '../../types/ExerciseEntry';

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
    setExerciseEntries: (state, action: PayloadAction<ExerciseEntry[]>) => {
      state.entries = action.payload;
    },
    addExerciseEntry: (state, action: PayloadAction<ExerciseEntry>) => {
      state.entries = [...state.entries, action.payload];
    },
    removeExerciseEntry: (state, action: PayloadAction<number>) => {
      state.entries.splice(action.payload, 1);
    },
  },
});

export const { setExerciseEntries, addExerciseEntry, removeExerciseEntry } = exerciseSlice.actions;
export default exerciseSlice.reducer;