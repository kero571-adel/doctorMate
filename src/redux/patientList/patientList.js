import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// ========================== fetchPatients ==========================
export const patientsList = createAsyncThunk(
  "patients/patientsList",
  async ({ page = 1, limit = 10, search = "" } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (search) {
        params.append("search", search);
      }

      const response = await api.get(`/doctor/patients?${params.toString()}`);
      console.log("Patients Data:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch patients"
      );
    }
  }
);
const patients = createSlice({
  name: "patients",
  initialState: {
    patients: [],
    pagination: {
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 0,
    },
    patientDet: null,
    patientDet2: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setpatientDet: (state, action) => {
      state.patientDet = action.payload; 
    },
    setpatientDet2: (state, action) => {
      state.patientDet2 = action.payload;
    },
    setclearpatientDet: (state) => {
      state.patientDet = null;
    },
  },
  extraReducers: (builder) => {
    // fetch user
    builder
      .addCase(patientsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patientsList.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload.data?.patients || [];
        state.pagination = action.payload.data?.pagination || state.pagination;
      })
      .addCase(patientsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setpatientDet, setclearpatientDet,setpatientDet2 } =
  patients.actions;
export default patients.reducer;
