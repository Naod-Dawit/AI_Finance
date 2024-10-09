import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

interface CustomExpense {
  id: string;
  name: string;
  amount: number;
}

export interface ExpenseDetails {
  rent: number;
  car_Payment: number;
  savings: number;
  food: number;
  others: number;
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
    rent: 0,
    car_Payment: 0,
    savings: 0,
    food: 0,
    others: 0,
    customExpenses: [],
  },
};

export const updateExpenses = createAsyncThunk(
  "expenses/update",
  async (details: ExpenseDetails, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/expenses`, details, {
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

export const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    addCustomExpense: (state, action: PayloadAction<CustomExpense>) => {
      state.expenses.customExpenses.push(action.payload);
      state.expenses.others += action.payload.amount;
    },
    updateCustomExpense: (state, action: PayloadAction<CustomExpense>) => {
      const index = state.expenses.customExpenses.findIndex(
        (expense) => expense.id === action.payload.id
      );
      if (index !== -1) {
        state.expenses.others -= state.expenses.customExpenses[index].amount;
        state.expenses.others += action.payload.amount;
        state.expenses.customExpenses[index] = action.payload;
      }
    },
    removeCustomExpense: (state, action: PayloadAction<string>) => {
      const index = state.expenses.customExpenses.findIndex(
        (expense) => expense.id === action.payload
      );
      if (index !== -1) {
        state.expenses.others -= state.expenses.customExpenses[index].amount;
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
      });
  },
});

export const { addCustomExpense, updateCustomExpense, removeCustomExpense } = expensesSlice.actions;

export default expensesSlice.reducer;