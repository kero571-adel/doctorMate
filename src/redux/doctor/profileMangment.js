import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// ========================== overViewSec2 profile ==========================
export const profileManagement = createAsyncThunk(
  "profile/profileManagement",
  async (form, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("phoneNumber", form.phone);
      formData.append("Specialty", form.speciality);
      formData.append("address", form.address);
      formData.append("ConsultationFee", form.consultationFee);
      formData.append("workingTime", form.workingTime);
      if (form.profilePhoto instanceof File) {
        formData.append("imageFile", form.profilePhoto);
      }
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      const response = await api.put(
        "/Profile_Management/update",
        formData
      );
     
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Server Error");
    }
  }
);

// ========================== Slice ==========================
const profile = createSlice({
  name: "profile",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(profileManagement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(profileManagement.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(profileManagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default profile.reducer;
