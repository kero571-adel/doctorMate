import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const addPrescriptions = createAsyncThunk(
  "prescriptions/addPrescriptions",
  async ({ diagnosisId, medications }, { rejectWithValue }) => {
    try {
      const response = await api.post("/prescriptions", {
        diagnosisId,
        medications,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "حدث خطأ");
    }
  }
);

const prescriptions = createSlice({
  name: "prescriptions",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(addPrescriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default prescriptions.reducer;
