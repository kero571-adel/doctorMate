import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../utils/api";

// ========================== signIn thunk ==========================
export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ emailOrPhone, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://doctormate.runasp.net/api/Login",
        { emailOrPhone, password }
      );
     
      const { token, user } = response.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
// ========================== forgot pass thunk ==========================
export const forgotPass = createAsyncThunk(
  "auth/forgotpass",
  async ({ email, isForgetPass }, { rejectWithValue }) => {
    try {
     
      const response = await axios.post(
        "https://doctormate.runasp.net/api/Otp/send",
        { email, isForgetPass: false }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ========================== signUp thunk ==========================
export const signUp = createAsyncThunk(
  "auth/signUp",
  async (
    { fullName, email, phoneNumber, role, password },
    { rejectWithValue }
  ) => {
    console.log("fullName = ", fullName);
    console.log("email = ", email);
    console.log("phoneNumber = ", phoneNumber);
    console.log("role = ", role);
    try {
      const response = await axios.post(
        "https://doctormate.runasp.net/api/Register",
        { email, phoneNumber, password, role, fullName }
      );
      console.log("response.data = ", response.data);
      const { token, user } = response.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ========================== verify OTP ==========================
export const verfyOtp = createAsyncThunk(
  "auth/verfyOtp",
  async ({ email, otp, isForgetPass }, { rejectWithValue }) => {
    console.log("verfyOtp email: ", email);
    console.log("verfyOtp otp  ", otp);
    console.log("verfyOtp isForgetPass: ", isForgetPass);
    try {
      const response = await axios.post(
        "https://doctormate.runasp.net/api/Otp/verify",
        { email, otpCode: otp, isForgetPass }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ========================== resetPass thunk ==========================
export const resetPass = createAsyncThunk(
  "auth/logoutUser",
  async ({ email, password, confirmPassword }, { rejectWithValue }) => {
    try {
     
      const getEmail = email.email;

      const response = await axios.post(
        "https://doctormate.runasp.net/api/PasswordReset/reset-password",
        { email: getEmail, newPassword: password, confirmPassword }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ========================== fetchSpecialties ==========================
export const fetchSpecialties = createAsyncThunk(
  "auth/fetchSpecialties",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/Specialties");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch specialties"
      );
    }
  }
);

// ========================== completeProfile profile ==========================
export const completeProfile = createAsyncThunk(
  "user/completeProfile",
  async (profileData, { rejectWithValue }) => {
    console.log("profileData = ", profileData);
    try {
      const response = await api.post(
        "/CompleteProfile/complete",
        profileData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "فشل في استكمال بيانات الحساب"
      );
    }
  }
);

// ========================== Slice ==========================
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("user") 
      ? JSON.parse(localStorage.getItem("user")) 
      : null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    specialties: [],
    specialtiesLoading: false,
    forgotPasswordEmail: {
      email: "",
      forgotPass: false,
    },
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = "";
    },
    setForgotPasswordEmail: (state, action) => {
      state.forgotPasswordEmail = action.payload;
    },
    clearForgotPasswordEmail: (state) => {
      state.forgotPasswordEmail = {
        email: "",
        forgotPass: false,
      };
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    // signIn
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // forgot pass
    builder
      .addCase(forgotPass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPass.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.forgotPasswordEmail = {
          email: action.meta.arg.email,
          forgotPass: action.meta.arg.isForgetPass,
        };
      })
      .addCase(forgotPass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // signUp
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // verifyOtp
    builder
      .addCase(verfyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verfyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;

        const userData = action.payload.data;
        if (userData?.accessToken) {
          localStorage.setItem("accessToken", userData.accessToken);
        }
        if (userData?.refreshToken) {
          localStorage.setItem("refreshToken", userData.refreshToken);
        }
      })
      .addCase(verfyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // resetPass
    builder
      .addCase(resetPass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPass.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(resetPass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // complete user
    builder
      .addCase(completeProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(completeProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchSpecialties
    builder
      .addCase(fetchSpecialties.pending, (state) => {
        state.specialtiesLoading = true;
        state.error = null;
      })
      .addCase(fetchSpecialties.fulfilled, (state, action) => {
        state.specialtiesLoading = false;
        state.specialties = action.payload;
      })
      .addCase(fetchSpecialties.rejected, (state, action) => {
        state.specialtiesLoading = false;
        state.error = action.payload;
      });
  },
});
export const {
  clearAuthError,
  setForgotPasswordEmail,
  clearForgotPasswordEmail,
  logout,
  setUser,
} = authSlice.actions;
export default authSlice.reducer;
