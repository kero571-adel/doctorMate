import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// ========================== overViewSec2 profile ==========================
export const addDiagnoses = createAsyncThunk(
  "Diagnoses/adddiagnoses",
  async (
    { medicalRecordId, appointmentId, description, icdCode, severity },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        "/diagnoses",
        {
          medicalRecordId,
          appointmentId,
          description,
          icdCode,
          severity,
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || "حدث خطأ");
    }
  }
);
// ========================== Slice ==========================
const diagnoses = createSlice({
  name: "diagnoses",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addDiagnoses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDiagnoses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addDiagnoses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default diagnoses.reducer;
