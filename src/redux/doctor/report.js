import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
export const getReport = createAsyncThunk(
  "doctor/getPatient",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("reports/doctor-summary");
      console.log("response.data = ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "فشل في استكمال بيانات الحساب"
      );
    }
  }
);
const report = createSlice({
  name: "report",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReport.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default report.reducer;
