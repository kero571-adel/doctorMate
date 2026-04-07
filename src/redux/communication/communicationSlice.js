import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// ========================== START SESSION ==========================
export const startSession = createAsyncThunk(
  "communication/startSession",
  async ({ appointmentId }, { rejectWithValue }) => {
    console.log("🔹 [START SESSION] Beginning session creation...");
    console.log("🔹 [START SESSION] Appointment ID:", appointmentId);
    try {
      console.log(
        "🔹 [START SESSION] Sending API request to /communication/sessions..."
      );
      const response = await api.post("/communication/sessions", {
        appointmentId,
      });
      console.log("✅ [START SESSION] API Response:", response.data);
      console.log("✅ [START SESSION] Session created successfully!");
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
    console.log("🔹 [END SESSION] Beginning session end...");
    console.log("🔹 [END SESSION] Session ID:", sessionId);

    try {
      console.log("🔹 [END SESSION] Sending API request to close session...");
      const response = await api.post(
        `/communication/sessions/${sessionId}/close`,
        {}
      );

      console.log("✅ [END SESSION] API Response:", response.data);
      console.log("✅ [END SESSION] Session ended successfully!");

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
    console.log("🔹 [START CALL] Beginning call initialization...");
    console.log("🔹 [START CALL] Session ID:", appointmentId);
    try {
      console.log(
        "🔹 [START CALL] Sending API request to /communication/call-token..."
      );
      const response = await api.post("/communication/call-token", {
        appointmentId,
      });

      console.log("✅ [START CALL] API Response:", response.data);
      console.log("✅ [START CALL] Call token received successfully!");
      console.log(
        "✅ [START CALL] Token:",
        response.data.data?.token?.substring(0, 20) + "..."
      );
      console.log("✅ [START CALL] Channel:", response.data.data?.channelName);
      console.log("✅ [START CALL] UID:", response.data.data?.uid);

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
    setMessages: (state, action) => {
      console.log(
        "🔹 [SET MESSAGES] Messages updated:",
        action.payload.length,
        "messages"
      );
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      console.log("🔹 [ADD MESSAGE] New message added:", action.payload);
      state.messages.push(action.payload);
    },
    setCallActive: (state, action) => {
      console.log("🔹 [SET CALL ACTIVE] Call status:", action.payload);
      state.call.active = action.payload;
    },
    clearSession: (state) => {
      console.log("🔹 [CLEAR SESSION] Clearing all session data...");
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
      console.log("🔹 [CLEAR MESSAGES] Clearing all messages...");
      state.messages = [];
    },
    clearSessionError: (state) => {
      state.sessionError = null;
    },
    setSessionStatus: (state, action) => {
      console.log("🔹 [SET STATUS] Session status changed to:", action.payload);
      state.sessionStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ===== START SESSION =====
    builder
      .addCase(startSession.pending, (state) => {
        console.log("⏳ [START SESSION] Pending...");
        state.sessionStatus = "loading";
        state.sessionError = null;
      })
      // .addCase(startSession.fulfilled, (state, action) => {
      //   console.log("✅ [START SESSION] Fulfilled! Session:", action.payload);
      //   state.sessionStatus = "active";
      //   state.session = action.payload;
      //   state.sessionError = null;
      // })
      .addCase(startSession.fulfilled, (state, action) => {
        console.log("✅ [START SESSION] Fulfilled! Session:", action.payload);
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
        console.log("⏳ [END SESSION] Pending...");
        state.sessionStatus = "loading";
      })
      .addCase(endSession.fulfilled, (state) => {
        console.log("✅ [END SESSION] Fulfilled! Session ended.");
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
        console.log("⏳ [START CALL] Pending...");
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
