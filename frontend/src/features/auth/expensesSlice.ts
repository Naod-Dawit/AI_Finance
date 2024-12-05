import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_URL;

export interface CustomExpense {
  id: string;
  name: string;
  amount: number;
}

export interface ExpenseDetails {
  Housing: number;
  Transportation: {
    mode: String;
    cost: number;
    carPayment: number;
    insurance: number;
  };
  Monthly_saving_Goal: number;
  food: number;
  customExpenses: CustomExpense[];
}

interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
  expensesUpdated: boolean;
  expenses: ExpenseDetails;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  expensesUpdated: false,
  expenses: {
    Housing: 0,
    Transportation: {
      mode: "public",
      cost: 0,
      carPayment: 0,
      insurance: 0,
    },
    Monthly_saving_Goal: 0,
    food: 0,
    customExpenses: [],
  },
};

export const updateExpenses = createAsyncThunk(
  "expenses/update",
  async (details: ExpenseDetails, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/expenses`, details, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
export const getExpenses = createAsyncThunk(
  "expenses/getExpenses",
  async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const currentMonth = new Date().getMonth()

      

      return response.data.monthlyExpenses;
    } catch (err) {
      console.error(err);
    }
  }
);
export const fetchOldExpenses = createAsyncThunk(
  "expenses/fetcholdexpenses",
  async (monthdata: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/fetchOldExpenses`,
        { monthdata }, // Send as an object
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      console.error(err);
    }
  }
);

export const editExpenses = createAsyncThunk(
  "expenses/editExpenses",
  async (details: ExpenseDetails, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/expenses`, details, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchPercentages = createAsyncThunk(
  "expenses/fetchPercentages",
  async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.monthlyExpenses;
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  }
);

export const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    addCustomExpense: (state, action: PayloadAction<CustomExpense>) => {
      state.expenses.customExpenses.push(action.payload);
    },
    updateCustomExpense: (state, action: PayloadAction<CustomExpense>) => {
      const index = state.expenses.customExpenses.findIndex(
        (expense) => expense.id === action.payload.id
      );
      if (index !== -1) {
        state.expenses.customExpenses[index] = action.payload;
      }
    },
    removeCustomExpense: (state, action: PayloadAction<string>) => {
      const index = state.expenses.customExpenses.findIndex(
        (expense) => expense.id === action.payload
      );
      if (index !== -1) {
        state.expenses.customExpenses.splice(index, 1);
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(updateExpenses.pending, (state) => {
        state.loading = true;
        state.expensesUpdated = false;
      })
      .addCase(updateExpenses.rejected, (state, action) => {
        state.loading = false;
        state.expensesUpdated = false;
        state.error = action.payload as string;
      })
      .addCase(updateExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expensesUpdated = true;
        state.expenses = action.payload;
      })
      .addCase(editExpenses.fulfilled, (state, action) => {
        state.expenses = action.payload;
        state.expensesUpdated = true;
        console.log("Redux state after update:", state.expenses);
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.expenses = action.payload;
        state.expensesUpdated = true;
      });
  },
});

export const { addCustomExpense, updateCustomExpense, removeCustomExpense } =
  expensesSlice.actions;

export default expensesSlice.reducer;
