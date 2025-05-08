import { configureStore } from "@reduxjs/toolkit";
import employeesReducer from "./slices/employeeSlice";
import branchesReducer from "./slices/branchSlice";
import clientsReducer from "./slices/clientSlice"; 
import shiftsReducer from "./slices/shiftSlice";

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
    branches: branchesReducer,
    clients: clientsReducer,
    shifts: shiftsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
