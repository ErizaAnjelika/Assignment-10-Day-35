// userSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (currentPage) => {
  const response = await fetch(`https://reqres.in/api/users?page=${currentPage}&per_page=6`);
  const data = await response.json();
  return {
    user: data.data,
    totalPages: data.total_pages,
    currentPage: data.page,
  };
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    user: [],
    currentPage: 1,
    totalPages: 0,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
