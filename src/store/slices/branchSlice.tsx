import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../../utils/api";


export interface Branch {
  id: number;
  name: string;
}


interface BranchesState {
  data: Branch[];
  loading: boolean;
  error: string | null;
}


const initialState: BranchesState = {
  data: [],
  loading: false,
  error: null,
};


export const fetchBranches = createAsyncThunk<Branch[]>(
  "branches/fetchBranches",
  async () => {
    const res = await API.get("/company/get/");
    return res.data.branches;
  }
);


const branchesSlice = createSlice({
  name: "branches",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBranches.fulfilled, (state, action: PayloadAction<Branch[]>) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchBranches.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default branchesSlice.reducer;
