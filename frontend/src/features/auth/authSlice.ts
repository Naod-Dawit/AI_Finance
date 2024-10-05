// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
  profileUpdated: boolean,

}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  profileUpdated: false,

};

// Async actions for signup and signin
export const signup = createAsyncThunk(
  "auth/signup",
  async (
    userData: { username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, userData);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

export interface ProfileDetails {
  name:string,
  amount: string;
  creditcard: string;
  monthlyIncome:string
  goal:string

}

export const signin = createAsyncThunk(
  "auth/signin",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/signin`, credentials);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Signin failed");
    }
  }
);
export const profile = createAsyncThunk(
  "auth/profile",
  async (details: ProfileDetails, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/profile`, details);
      return response.data;
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue("Profile update failed");
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(profile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.profileUpdated = false;
      })
      .addCase(profile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload }; // Merge updated profile data
        state.profileUpdated = true;
      })
      .addCase(profile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.profileUpdated = false;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
