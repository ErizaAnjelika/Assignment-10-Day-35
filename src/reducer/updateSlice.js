import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUpdateUser = createAsyncThunk(
  'update/fetchUpdateUser',
  async ({ userId, newData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://reqres.in/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const updateSlice = createSlice({
  name: 'update',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUpdateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUpdateUser.rejected, (state, action) => {
        state.loading = 'error';
        state.error = action.error.message;
      });
  },
});

export default updateSlice.reducer;
