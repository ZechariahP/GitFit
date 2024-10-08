import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import bmrReducer from './reducers/bmrReducer';
import foodReducer from './reducers/foodReducer';
import exerciseReducer from './reducers/exerciseReducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bmr: bmrReducer,
    food: foodReducer,
    exercise: exerciseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;