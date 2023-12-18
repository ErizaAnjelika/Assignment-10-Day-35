import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchDeleteUser = createAsyncThunk('delete/fetchDeleteUser', async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch(`https://reqres.in/api/users/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Delete request failed');
    }

    return userId;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const deleteSlice = createSlice({
  name: 'delete',
  initialState: {
    deletedUserId: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedUserId = action.payload;
      })
      .addCase(fetchDeleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default deleteSlice.reducer;
