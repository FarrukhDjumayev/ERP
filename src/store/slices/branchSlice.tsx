import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";

export const fetchBranches = createAsyncThunk(
  "branches/fetchBranches",
  async () => {
    const res = await API.get("/company/get/");
    return res.data.branches;
  }
);

const branchesSlice = createSlice({
  name: "branches",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchBranches.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default branchesSlice.reducer;
