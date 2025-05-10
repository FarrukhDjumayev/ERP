import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (branchId: number, thunkAPI) => {
    try {
      const response = await API.get(`/employee/employees/branch/${branchId}/`);
      return response.data.results;
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Xodimlar yuklanmadi.");
    }
  }
);

export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (employeeData: any, thunkAPI) => {
    try {
      const response = await API.post("/employee/employees/", employeeData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Xodim yaratishda xatolik.");
    }
  }
);

interface User {
  full_name: string;
  avatar: string;
  gender: string | null;
  phone_number: string;
  passport_number: string | null;
  jshshr: string | null;
  birth_date: string | null;
  salary_type: string | null;
}

interface Employee {
  id: number;
  user: User;
  user_full_name: string;
  user_role: string;
  branch_name: string;
  position: string;
  salary: string;
  official_salary: string;
  start_time: string;
  end_time: string;
}

interface EmployeesState {
  data: Employee[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeesState = {
  data: [],
  loading: false,
  error: null,
};

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default employeesSlice.reducer;
