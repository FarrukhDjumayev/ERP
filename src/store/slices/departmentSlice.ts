import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (branchId: number, { rejectWithValue }) => {
    try {
      const response = await API.get(`/company/departments/${branchId}/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An unknown error occurred');
    }
  }
);

interface DepartmentState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DepartmentState = {
  data: [],
  loading: false,
  error: null,
};

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default departmentSlice.reducer;
