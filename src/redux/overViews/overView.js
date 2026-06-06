import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// ========================== fetchDoctorDashboard ==========================
export const fetchDoctorDashboard = createAsyncThunk(
  "overView/fetchDoctorDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/doctor/dashboard");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  }
);

// Keeping old action for backward compatibility
export const overViewSec2 = fetchDoctorDashboard;

// ========================== Slice ==========================
const overView = createSlice({
  name: "overView",
  initialState: {
    stats: null,
    todayAppointments: [],
    recentPatients: [],
    urgentAlerts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.todayAppointments = action.payload.todayAppointments || [];
        state.recentPatients = action.payload.recentPatients || [];
        state.urgentAlerts = action.payload.urgentAlerts || [];
      })
      .addCase(fetchDoctorDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearError } = overView.actions;
export default overView.reducer;
