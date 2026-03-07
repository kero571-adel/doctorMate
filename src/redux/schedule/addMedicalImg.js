import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
export const addMedicalImg = createAsyncThunk(
  "MedicalImg/addMedicalImg",
  async ({ formData, onUploadProgress }, { rejectWithValue }) => {
    console.log([...formData.entries()]);
    try {
      const response = await api.post("/medical-images", formData, {
        onUploadProgress,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "حدث خطأ");
    }
  }
);
export const getMedicalImg = createAsyncThunk(
  "MedicalImg/getMedicalImg",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/medical-images?appointmentId=${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "حدث خطأ");
    }
  }
);
export const delMedicalImg = createAsyncThunk(
  "MedicalImg/delMedicalImg",
  async (id, { rejectWithValue }) => {
    console.log("id: ", id);
    try {
      const response = await api.delete(`/medical-images/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Delete Medical Image Error:",
        error.response?.status,
        error.response?.data
      );
      return rejectWithValue(error.response?.data || "حدث خطأ");
    }
  }
);
const MedicalImg = createSlice({
  name: "MedicalImg",
  initialState: {
    data: null,
    images: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMedicalImg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMedicalImg.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addMedicalImg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getMedicalImg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMedicalImg.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(getMedicalImg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(delMedicalImg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(delMedicalImg.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(delMedicalImg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default MedicalImg.reducer;
