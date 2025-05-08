import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";


export const fetchShifts = createAsyncThunk(
  "shifts/fetchShifts",
  async (branchId: number, { rejectWithValue }) => {
    try {
      const res = await API.get(`/company/shifts/${branchId}/`);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Xatolik yuz berdi");
    }
  }
);


export const createShift = createAsyncThunk(
  "shifts/createShift",
  async (shiftData: any) => {
    const res = await API.post("/company/shift-create/", shiftData);
    return res.data;
  }
);



export const updateShift = createAsyncThunk(
  "shifts/updateShift",
  async ({ id, shiftData }: { id: number; shiftData: any }, { rejectWithValue }) => {
    try {
      const res = await API.post(`/company/shift-detail/${id}/`, shiftData);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Shiftni yangilashda xatolik");
    }
  }
);


export const deleteShift = createAsyncThunk(
  "shifts/deleteShift",
  async (id: number, { rejectWithValue }) => {
    try {
      await API.delete(`/company/shift-detail/${id}/`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Shiftni o‘chirishda xatolik");
    }
  }
);


const shiftSlice = createSlice({
  name: "shifts",
  initialState: {
    data: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchShifts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      
      .addCase(createShift.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(createShift.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      
      .addCase(updateShift.fulfilled, (state, action) => {
        const index = state.data.findIndex((shift) => shift.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateShift.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      
      .addCase(deleteShift.fulfilled, (state, action) => {
        state.data = state.data.filter((shift) => shift.id !== action.payload);
      })
      .addCase(deleteShift.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default shiftSlice.reducer;
