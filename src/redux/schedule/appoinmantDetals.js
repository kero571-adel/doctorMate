import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
export const getPatientDetals = createAsyncThunk(
  "patientdet/getPatientDetals",
  async ({ id }, { rejectWithValue }) => {
    try {
      console.log("id: ", id);
      const response = await api.get(`/doctor/patients/${id}/details`);
      console.log("getPatientDetals response.data: ", response.data.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "حدث خطأ");
    }
  }
);
export const getPatientDetals2 = createAsyncThunk(
  "patientdet/getPatientDetals2",
  async ({ id }, { rejectWithValue }) => {
    try {
      console.log("id: ", id);
      const response = await api.get(`/doctor/patients/${id}/details`);
      console.log("getPatientDetals response.data: ", response.data.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "حدث خطأ");
    }
  }
);
export const getAppDetById = createAsyncThunk(
  "patientdet/getAppDetById",
  async ({ id }, { rejectWithValue }) => {
    console.log(" getAppDetById id: ", id);
    try {
      const response = await api.get(`/appointments/${id}/details`);
      console.log("response.data: ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "حدث خطأ");
    }
  }
);
export const getAppDetById2 = createAsyncThunk(
  "patientdet/getAppDetById2",
  async ({ id }, { rejectWithValue }) => {
    console.log(" getAppDetById id: ", id);
    try {
      const response = await api.get(`/appointments/${id}/details`);
      console.log("response.data: ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "حدث خطأ");
    }
  }
);
const patientdet = createSlice({
  name: "patientdet",
  initialState: {
    datapatient: null,
    dataApp2: null,
    dataApp: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPatientDetals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatientDetals.fulfilled, (state, action) => {
        state.loading = false;
        state.datapatient = action.payload;
      })
      .addCase(getPatientDetals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getPatientDetals2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatientDetals2.fulfilled, (state, action) => {
        state.loading = false;
        state.datapatient2 = action.payload;
      })
      .addCase(getPatientDetals2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getAppDetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppDetById.fulfilled, (state, action) => {
        state.loading = false;
        state.dataApp = action.payload;
      })
      .addCase(getAppDetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getAppDetById2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppDetById2.fulfilled, (state, action) => {
        state.loading = false;
        state.dataApp2 = action.payload;
      })
      .addCase(getAppDetById2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default patientdet.reducer;
