# 🎯 DOCTOR COMMUNICATION SYSTEM - IMPLEMENTATION COMPLETE

## ✅ WHAT HAS BEEN IMPLEMENTED

### 1️⃣ Redux Communication Slice

**File**: `src/redux/communication/communicationSlice.js`

**State Structure**:

```javascript
{
  session: {
    id, appointmentId, patientId, patientName, appointmentTime, appointmentType
  },
  sessionStatus: "idle" | "loading" | "active" | "ended",
  sessionError: null,
  messages: [],
  call: {
    active: false,
    token: null,
    channelName: null,
    uid: null
  },
  callError: null
}
```

**Async Thunks** (use Redux Toolkit `createAsyncThunk`):

- `startSession({ appointmentId })` → POST `/api/communication/sessions`
- `endSession({ sessionId })` → POST `/api/communication/sessions/{id}/close`
- `startCall({ sessionId })` → POST `/api/communication/call-token`

**Synchronous Reducers**:

- `setMessages(messages)` - Real-time message updates from Firebase
- `addMessage(message)` - Add single message
- `setCallActive(boolean)` - Toggle call state
- `clearSession()` - Reset all state
- `setSessionStatus(status)` - Update status

---

### 2️⃣ Firebase Real-Time Chat Service

**File**: `src/services/firebaseService.js`

**Functions**:

```javascript
// Subscribe to real-time messages
const unsubscribe = subscribeToSessionMessages(sessionId, (messages) => {
  dispatch(setMessages(messages));
});

// Send message to Firestore
await sendMessage(sessionId, {
  text: "Hello",
  senderType: "doctor",
  senderId: userId,
  senderName: "Dr. Smith",
});

// Initialize session room (optional)
await initializeSessionRoom(sessionId, sessionData);
```

**Firebase Structure**:

```
firestore:
  sessions/{sessionId}/
    messages/
      {messageId}/
        - text: string
        - senderType: "doctor" | "patient"
        - senderId: string
        - senderName: string
        - senderImage: string
        - timestamp: Firestore.Timestamp
        - createdAt: ISO string
```

---

### 3️⃣ Agora Video/Audio SDK Service

**File**: `src/services/agoraService.js`

**Core Methods**:

```javascript
// Initialize Agora client
await agoraService.initializeClient(appId);

// Join video channel
const uid = await agoraService.joinChannel(token, channelName);

// Publish local audio/video
const { audioTrack, videoTrack } = await agoraService.publishLocalStream();

// Mute/unmute controls
await agoraService.muteLocalAudio(true, audioTrack);
await agoraService.muteLocalVideo(false, videoTrack);

// Leave channel
await agoraService.leaveChannel();

// Setup event listeners
agoraService.setupEventListeners(onUserJoined, onUserLeft, onError);
```

**Note**: Requires Agora SDK installation: `npm install agora-rtc-sdk-ng`

---

### 4️⃣ Custom React Hook for Session Management

**File**: `src/hooks/useCommunicationSession.js`

```javascript
const { isSessionActive, sessionId, endSession } = useCommunicationSession();
```

**Features**:

- Auto-subscribes to Firebase messages when session is active
- Handles cleanup on unmount
- Exposes session state

---

### 5️⃣ Redux Store Updated

**File**: `src/redux/store.js`

Added communication reducer to store configuration.

---

## 🚀 HOW TO INTEGRATE WITH YOUR UI

### **Step 1: Add Communication Button to Schedule Page**

In `src/pages/schedule/Schedule.jsx`, add this import:

```javascript
import { startSession } from "../../redux/communication/communicationSlice";
```

In the appointment card buttons section (around line 900), add:

```javascript
{
  session.status?.toLowerCase() === "confirmed" && (
    <Button
      fullWidth
      variant="contained"
      startIcon={<ChatBubbleOutline />}
      onClick={async () => {
        try {
          await dispatch(startSession({ appointmentId: session.id })).unwrap();
          dispatch(setSelectedPatient(session));
          navigate("/message");
        } catch (error) {
          alert(`Failed: ${error}`);
        }
      }}
      sx={{
        background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
        color: "white",
        fontWeight: 600,
        borderRadius: "12px",
        textTransform: "none",
      }}
    >
      Start Communication
    </Button>
  );
}
```

---

### **Step 2: Update Message Component with Redux**

In `src/pages/message/message.jsx`, add these imports:

```javascript
import { useDispatch, useSelector } from "react-redux";
import {
  endSession,
  startCall,
  setMessages,
} from "../../redux/communication/communicationSlice";
import { sendMessage as firebaseSendMessage } from "../../services/firebaseService";
import useCommunicationSession from "../../hooks/useCommunicationSession";
```

Add Redux hooks:

```javascript
const dispatch = useDispatch();
const { session, sessionStatus, messages, call } = useSelector(
  (state) => state.communication
);
const { user } = useSelector((state) => state.auth);
const { isSessionActive } = useCommunicationSession();
```

Add message handler:

```javascript
const handleSendMessage = async () => {
  if (!messageInput.trim() || !session?.id) return;

  try {
    await firebaseSendMessage(session.id, {
      text: messageInput.trim(),
      senderType: "doctor",
      senderId: user?.id,
      senderName: user?.fullName,
      senderImage: user?.imageUrl,
    });
    setMessageInput("");
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};
```

Add call handler:

```javascript
const handleStartCall = async () => {
  try {
    const callResult = await dispatch(
      startCall({ sessionId: session.id })
    ).unwrap();

    // TODO: Initialize Agora with returned token
    console.log("Call token received:", callResult);
  } catch (error) {
    alert("Failed to start call");
  }
};
```

Add end session handler:

```javascript
const handleEndSession = async () => {
  try {
    await dispatch(endSession({ sessionId: session.id })).unwrap();
  } catch (error) {
    alert("Failed to end session");
  }
};
```

---

## 🔄 COMPLETE FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. DOCTOR SCHEDULE PAGE                                         │
│    - Sees appointment card                                      │
│    - Clicks "Start Communication" button                        │
└─────────────────────────────────────────┬───────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. REDUX ACTION: startSession                                   │
│    - POST /api/communication/sessions                           │
│    - Backend creates session                                    │
│    - sessionStatus = "loading" → "active"                       │
│    - Redux stores session data                                  │
└─────────────────────────────────────────┬───────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. NAVIGATE TO MESSAGE PAGE                                     │
│    - Pass sessionId in Redux                                    │
└─────────────────────────────────────────┬───────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. FIREBASE SUBSCRIPTION (Auto in hook)                         │
│    - useEffect checks sessionStatus = "active"                  │
│    - subscribeToSessionMessages(sessionId)                      │
│    - Real-time listener on messages collection                  │
└─────────────────────────────────────────┬───────────────────────┘
                                          │
                    ┌─────────────────────┴─────────────────────┐
                    │                                           │
                    ▼                                           ▼
        ┌──────────────────────┐                  ┌──────────────────────┐
        │ 5A. SEND MESSAGE     │                  │ 5B. START VIDEO CALL │
        │ - Doctor types text  │                  │ - Click "Start Call" │
        │ - firebaseSendMessage│                  │ - Redux: startCall   │
        │ - Firebase updates   │                  │ - Get Agora token    │
        │ - Listener triggers  │                  │ - Initialize Agora   │
        │ - setMessages()      │                  │ - Join channel       │
        │ - UI re-renders      │                  │ - Publish stream     │
        └──────────────────────┘                  └──────────────────────┘
                    │                                           │
                    └─────────────────────┬─────────────────────┘
                                          │
                                          ▼
        ┌─────────────────────────────────────────────────────┐
        │ 6. END SESSION                                      │
        │ - Doctor clicks "End Session"                       │
        │ - Redux: endSession                                 │
        │ - POST /api/communication/sessions/{id}/close       │
        │ - Firebase unsubscribe                              │
        │ - sessionStatus = "ended"                           │
        │ - Chat becomes read-only                            │
        └─────────────────────────────────────────────────────┘
```

---

## ⚙️ BACKEND API REQUIREMENTS

Your backend must implement these endpoints:

### `POST /api/communication/sessions`

**Request**:

```json
{
  "appointmentId": "string"
}
```

**Response**:

```json
{
  "data": {
    "id": "session-id-123",
    "appointmentId": "apt-123",
    "patientId": "patient-456",
    "patientName": "John Doe",
    "appointmentTime": "10:30 AM",
    "appointmentType": "video",
    "createdAt": "2026-03-27T10:00:00Z"
  }
}
```

### `POST /api/communication/call-token`

**Request**:

```json
{
  "sessionId": "string"
}
```

**Response**:

```json
{
  "data": {
    "token": "agora-token-string",
    "channelName": "session-id-123",
    "uid": 0
  }
}
```

### `POST /api/communication/sessions/{id}/close`

**Request**: (empty body)
**Response**:

```json
{
  "data": {
    "id": "session-id-123",
    "status": "closed",
    "endedAt": "2026-03-27T10:30:00Z"
  }
}
```

---

## 🔒 STRICT RULES - DO NOT BREAK

| ❌ DON'T                                    | ✅ DO                              |
| ------------------------------------------- | ---------------------------------- |
| Send chat without Redux session             | Check `if (!session?.id) return;`  |
| Start call without token                    | Call `startCall` thunk first       |
| Use local state for critical logic          | Keep all state in Redux            |
| Bypass backend API                          | Always use proper endpoints        |
| Subscribe to Firebase before session active | Check `sessionStatus === "active"` |
| Keep Firebase listener after session ends   | Unsubscribe in cleanup             |

---

## 📦 DEPENDENCIES NEEDED

Add to `package.json`:

```bash
npm install agora-rtc-sdk-ng
```

Already installed:

- ✅ Redux Toolkit
- ✅ Firebase
- ✅ React Router
- ✅ Axios

---

## 🧪 TESTING CHECKLIST

- [ ] Communication button appears on confirmed appointments
- [ ] Clicking button dispatches `startSession`
- [ ] Redux state updates with session data
- [ ] Navigates to `/message` successfully
- [ ] Firebase messages load in real-time
- [ ] Can send message from message page
- [ ] Message appears in chat instantly
- [ ] "Start Call" button visible when session active
- [ ] Call button triggers `startCall` thunk
- [ ] End Session button ends session
- [ ] Chat becomes read-only after session ends
- [ ] Error messages display properly

---

## 📝 NEXT STEPS

1. **Install Agora SDK**:

   ```bash
   npm install agora-rtc-sdk-ng
   ```

2. **Update Schedule.jsx** with communication button (use code snippet above)

3. **Update message.jsx** with Redux integration (use code snippet above)

4. **Add environment variable** in `.env`:

   ```
   REACT_APP_AGORA_APP_ID=your_app_id
   ```

5. **Test the complete flow** using checklist above

6. **Deploy** when all tests pass

---

## 📞 SUPPORT FILES

Reference these documentation files:

- `src/services/COMMUNICATION_INTEGRATION.md` - Detailed architecture
- `src/services/INTEGRATION_GUIDE.js` - Code examples
- `src/redux/communication/communicationSlice.js` - State management
- `src/services/firebaseService.js` - Firebase integration
- `src/services/agoraService.js` - Video call SDK

---

**🎉 Implementation Status: READY FOR INTEGRATION**

All Redux, Firebase, and Agora services are created and ready. Just add the UI integration following the code snippets above!
