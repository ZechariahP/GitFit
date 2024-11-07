import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  user: {
    id: number;
  } | null;
}



const initialState: AuthState = {
  isAuthenticated: false,
  email: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ id: number }>) => {
      state.user = action.payload;
    },
    login: (state, action: PayloadAction<{ email: string }>) => {
      state.isAuthenticated = true;
      state.email = action.payload.email;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.email = null;
    }
  },
});

export const { setUser, login, logout } = authSlice.actions;
export default authSlice.reducer;