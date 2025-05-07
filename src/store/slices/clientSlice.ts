// src/store/slices/clientsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api"; // API instance to'g'ri yo'lni import qilamiz

type Client = {
  id: number;
  name: string;
  phone: string;
  avatar: string | null;
  branch_name?: string | null;
  license_file?: string | null;
  created_at: string;
};

interface ClientsState {
  clients: Client[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientsState = {
  clients: [],
  loading: false,
  error: null,
};

// 1) Fetch qilish uchun thunk
export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/company/clients/");
      return response.data.results;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 2) Add client
export const createClient = createAsyncThunk(
  "clients/createClient",
  async (clientData: FormData, thunkAPI) => {
    try {
      const response = await API.post("/company/clients/", clientData);
      return response.data; // New client added
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 3) Update client
export const updateClient = createAsyncThunk(
  "clients/updateClient",
  async ({ id, clientData }: { id: number, clientData: FormData }, thunkAPI) => {
    try {
      const response = await API.patch(`/company/clients/${id}/`, clientData);
      return response.data; // Client updated
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 4) Delete client
export const deleteClient = createAsyncThunk(
  "clients/deleteClient",
  async (id: number, thunkAPI) => {
    try {
      await API.delete(`/company/clients/${id}/`);
      return id; // Deleted client ID
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Slice
const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch clients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create client
      .addCase(createClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients.push(action.payload);
      })
      .addCase(createClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update client
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.clients.findIndex((client) => client.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete client
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = state.clients.filter((client) => client.id !== action.payload);
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default clientsSlice.reducer;
