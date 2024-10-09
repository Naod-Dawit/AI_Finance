// src/store/store.ts
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import expenseReducer from "../features/auth/expensesSlice";
import { useDispatch } from "react-redux";

const reducers = combineReducers({
  auth: authReducer,
  expenses: expenseReducer,
});
const store = configureStore({
  reducer: {
    reducers,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export default store;
