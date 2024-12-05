// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_URL


interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
  profileUpdated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  profileUpdated: false,
};

// Async actions for signup and signin

export interface ProfileDetails {
  name: string;
  amount: string;
  monthlyIncome: string;
  goal: string;
}

export const signup = createAsyncThunk(
  "auth/signup",
  async (
    userData: { email: string; password: string },
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
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token available");
      }

      const response = await axios.put(`${API_URL}/profile`, details, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue("Profile update failed");
    }
  }
);

export const fetchDetails = createAsyncThunk("auth/details", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token available");
  }

  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token} `,
      },
    });
    return response.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.response?.data?.message || "Failed to fetch details");
  }
});
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
        state.user = { ...state.user, ...action.payload };
        state.profileUpdated = true;
      })
      .addCase(profile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.profileUpdated = false;
      })
      .addCase(fetchDetails.fulfilled, (state, action) => {
        (state.loading = false), (state.user = action.payload as string);
      })
      .addCase(fetchDetails.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
