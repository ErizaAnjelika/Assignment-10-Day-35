import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchLogin = createAsyncThunk('login/fetchLogin', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await fetch('https://reqres.in/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    // Simpan token ke localStorage saat berhasil
    localStorage.setItem('token', data.token);
    console.log(data);
    return data;
  } catch (error) {
    // Tangani kesalahan dan kirim ke reducer
    return rejectWithValue(error.message);
  }
});

const loginSlice = createSlice({
  //nama state
  name: 'login',
  initialState: {
    token: localStorage.getItem('token') || null,
    status: 'idle',
    error: null,
  },

  reducers: {
    logoutUser: (state) => {
      // Hapus token dari localStorage saat logout
      localStorage.removeItem('token');
      state.token = null;
      state.status = 'idle';
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.status = 'succeded';
        state.token = action.payload.token;
      })

      .addCase(fetchLogin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(loginSlice.actions.logoutUser, (state) => {
        // Reset state saat logout
        state.token = null;
        state.status = 'idle';
        state.error = null;
      });
  },
});

export const { logoutUser } = loginSlice.actions;

export default loginSlice.reducer;
