import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
const toSerializableTimestamp = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp?.toDate && typeof timestamp.toDate === "function") {
    return timestamp.toDate().toISOString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  return timestamp;
};

// ========================== START SESSION ===\=======================
export const startSession = createAsyncThunk(
  "communication/startSession",
  async ({ appointmentId }, { rejectWithValue }) => {
    try {
      const response = await api.post("/communication/sessions", {
        appointmentId,
      });
      return response.data.data;
    } catch (error) {
      console.error("❌ [START SESSION] Error occurred:", error);
      console.error("❌ [START SESSION] Error Response:", error.response?.data);
      console.error("❌ [START SESSION] Error Status:", error.response?.status);
      return rejectWithValue(
        error.response?.data?.message || "Failed to start session"
      );
    }
  }
);

// ========================== END SESSION ==========================
export const endSession = createAsyncThunk(
  "communication/endSession",
  async ({ sessionId }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/communication/sessions/${sessionId}/close`,
        {}
      );
      return response.data.data;
    } catch (error) {
      console.error("❌ [END SESSION] Error occurred:", error);
      console.error("❌ [END SESSION] Error Response:", error.response?.data);

      return rejectWithValue(
        error.response?.data?.message || "Failed to end session"
      );
    }
  }
);

// ========================== START CALL ==========================
export const startCall = createAsyncThunk(
  "communication/startCall",
  async ({ appointmentId }, { rejectWithValue }) => {
    try {
      const response = await api.post("/communication/call-token", {
        appointmentId,
      });
      return response.data.data;
    } catch (error) {
      console.error("❌ [START CALL] Error occurred:", error);
      console.error("❌ [START CALL] Error Response:", error.response?.data);
      console.error("❌ [START CALL] Error Status:", error.response?.status);

      return rejectWithValue(
        error.response?.data?.message || "Failed to get call token"
      );
    }
  }
);
// ========================== COMMUNICATION SLICE ==========================
const communicationSlice = createSlice({
  name: "communication",
  initialState: {
    session: null,
    sessionStatus: "idle",
    sessionError: null,
    messages: [],
    messagesLoading: false,
    call: {
      active: false,
      token: null,
      channelName: null,
      uid: null,
    },
    callError: null,
  },
  reducers: {
    // ✅ الكود الجديد
    setMessages: (state, action) => {
      state.messages = action.payload.map((msg) => ({
        ...msg,
        timestamp: toSerializableTimestamp(msg.timestamp),
      }));
    },
    // ✅ الكود الجديد
    addMessage: (state, action) => {
      const serializableMsg = {
        ...action.payload,
        timestamp: toSerializableTimestamp(action.payload.timestamp),
      };
      state.messages.push(serializableMsg);
    },
    setCallActive: (state, action) => {
      state.call.active = action.payload;
    },
    clearSession: (state) => {
      state.session = null;
      state.sessionStatus = "idle";
      state.messages = [];
      state.call = {
        active: false,
        token: null,
        channelName: null,
        uid: null,
      };
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearSessionError: (state) => {
      state.sessionError = null;
    },
    setSessionStatus: (state, action) => {
      state.sessionStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ===== START SESSION =====
    builder
      .addCase(startSession.pending, (state) => {
        state.sessionStatus = "loading";
        state.sessionError = null;
      })
      .addCase(startSession.fulfilled, (state, action) => {
        state.sessionStatus = "active";
        // ✅ تأكد إن الـ session فيه كلا الحقلين
        state.session = {
          ...action.payload,
          sessionId: action.payload.sessionId || action.payload.id,
        };
        state.sessionError = null;
      })
      .addCase(startSession.rejected, (state, action) => {
        console.error("❌ [START SESSION] Rejected! Error:", action.payload);
        state.sessionStatus = "idle";
        state.sessionError = action.payload;
      });

    // ===== END SESSION =====
    builder
      .addCase(endSession.pending, (state) => {
        state.sessionStatus = "loading";
      })
      .addCase(endSession.fulfilled, (state) => {
        state.sessionStatus = "ended";
        state.session = null;
        state.call.active = false;
        state.messages = [];
      })
      .addCase(endSession.rejected, (state, action) => {
        console.error("❌ [END SESSION] Rejected! Error:", action.payload);
        state.sessionError = action.payload;
      });

    // ===== START CALL =====
    builder
      .addCase(startCall.pending, (state) => {
        state.callError = null;
      })
      .addCase(startCall.fulfilled, (state, action) => {
        state.call = {
          active: true,
          token: action.payload.token,
          channelName: action.payload.channel,
          uid: action.payload.uid || 1,
        };
      })
      .addCase(startCall.rejected, (state, action) => {
        console.error("❌ [START CALL] Rejected! Error:", action.payload);
        state.callError = action.payload;
      });
  },
});

export const {
  setMessages,
  addMessage,
  setCallActive,
  clearSession,
  clearMessages,
  clearSessionError,
  setSessionStatus,
} = communicationSlice.actions;

export default communicationSlice.reducer;
