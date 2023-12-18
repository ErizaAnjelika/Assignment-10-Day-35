import { createSlice } from '@reduxjs/toolkit';

export const passwordSlice = createSlice({
  name: 'password',
  initialState: {
    isVisible: false,
  },
  reducers: {
    toggleVisibility: (state) => {
      state.isVisible = !state.isVisible;
    },
  },
});

export const { toggleVisibility } = passwordSlice.actions;
export const selectPasswordVisibility = (state) => state.password.isVisible;
export default passwordSlice.reducer;
