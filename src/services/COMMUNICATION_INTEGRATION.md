/\*\*

- ============================================================================
- DOCTOR COMMUNICATION SYSTEM INTEGRATION GUIDE
- ============================================================================
-
- This document outlines the complete implementation of the Doctor
- Communication System with Redux state management, Firebase real-time chat,
- and Agora video/audio call integration.
-
- ============================================================================
- FILES CREATED/MODIFIED
- ============================================================================
  \*/

// ==================== 1. REDUX COMMUNICATION SLICE ====================
// FILE: src/redux/communication/communicationSlice.js
//
// State Structure:
// {
// session: {
// id: string,
// appointmentId: string,
// patientId: string,
// patientName: string,
// appointmentTime: string,
// appointmentType: string,
// ...
// },
// sessionStatus: "idle" | "loading" | "active" | "ended",
// sessionError: null | string,
// messages: [
// {
// id: string,
// text: string,
// senderType: "doctor" | "patient",
// senderId: string,
// senderName: string,
// createdAt: ISO string,
// timestamp: Firestore timestamp
// }
// ],
// call: {
// active: boolean,
// token: string,
// channelName: string,
// uid: number
// },
// callError: null | string
// }
//
// Async Thunks:
// - startSession({ appointmentId })
// POST /api/communication/sessions
// Sets sessionStatus = "active"
// Stores session data in Redux
//
// - endSession({ sessionId })
// POST /api/communication/sessions/{id}/close
// Clears session and messages
// Sets sessionStatus = "ended"
//
// - startCall({ sessionId })
// POST /api/communication/call-token
// Returns: { token, channelName, uid }
// Sets call.active = true
//
// Reducers:
// - setMessages(messages) - Replace messages array
// - addMessage(message) - Add single message
// - setCallActive(boolean) - Toggle call state
// - clearSession() - Reset all communication state
// - clearMessages() - Clear messages only
// - setSessionStatus(status) - Set session status

// ==================== 2. FIREBASE SERVICE ====================
// FILE: src/services/firebaseService.js
//
// Functions:
//
// subscribeToSessionMessages(sessionId, onMessagesChange)
// - Returns unsubscribe function
// - Listens to sessions/{sessionId}/messages collection
// - Real-time updates via Firestore listener
// - Auto-orders by timestamp (ascending)
//
// sendMessage(sessionId, messageData)
// - Adds message to sessions/{sessionId}/messages
// - Auto-adds Firestore timestamp
// - Returns message document ID
// - CRITICAL: Must have active session in Redux first
//
// initializeSessionRoom(sessionId, sessionData)
// - Prepares Firebase structure (optional)
// - Called before first message

// ==================== 3. AGORA SERVICE ====================
// FILE: src/services/agoraService.js
//
// Methods:
//
// initializeClient(appId)
// - Creates Agora RTC client
// - Sets mode to "rtc" with VP8 codec
// - Requires: window.AgoraRTC (SDK loaded)
//
// joinChannel(token, channelName, uid = 0)
// - Joins Agora channel
// - Returns assigned UID
// - CRITICAL: Must have token from backend
//
// publishLocalStream(options)
// - Requests microphone + camera permissions
// - Creates audio and video tracks
// - Publishes to channel
// - Returns: { audioTrack, videoTrack }
//
// muteLocalAudio(muted, audioTrack)
// muteLocalVideo(muted, videoTrack)
// - Toggle audio/video
//
// leaveChannel()
// - Leaves channel and cleans up
//
// setupEventListeners(onUserJoined, onUserLeft, onError)
// - Listen to user-joined, user-left, user-published, error events

// ==================== 4. REDUX STORE ====================
// FILE: src/redux/store.js
//
// Added:
// import communicationReducer from "./communication/communicationSlice";
//
// In configureStore():
// communication: communicationReducer,

// ==================== 5. SCHEDULE PAGE - COMMUNICATION BUTTON ====================
// FILE: src/pages/schedule/Schedule.jsx
//
// Add button in appointment card action section:
//
// <Button
// startIcon={<ChatBubbleOutline />}
// onClick={() => {
// dispatch(startSession({ appointmentId: session.id }))
// .unwrap()
// .then(() => {
// dispatch(setSelectedPatient(session));
// navigate("/message");
// })
// .catch((error) => alert(`Failed: ${error}`));
// }}
// disabled={sessionStatus === "loading"}
// sx={{ /* styling */ }}
// >
// Start Communication
// </Button>

// ==================== 6. MESSAGE PAGE - REDUX INTEGRATION ====================
// FILE: src/pages/message/message.jsx
//
// Redux Integration:
// - useSelector to get: session, sessionStatus, messages, call
// - useDispatch for: startCall, endSession, setMessages, setCallActive
//
// Lifecycle:
// 1. Component checks if session exists
// 2. If sessionStatus = "active", subscribes to Firebase
// 3. Firebase subscription triggers setMessages reducer
// 4. Messages auto-render in chat UI
// 5. User types message -> handleSendMessage()
// 6. sendMessage() uploads to Firebase
// 7. Firebase listener receives message
// 8. dispatch(setMessages) updates Redux
// 9. Component re-renders with new message
//
// Call Flow:
// 1. User clicks "Start Call"
// 2. dispatch(startCall({ sessionId }))
// 3. Backend returns: { token, channelName, uid }
// 4. Agora service joins channel with token
// 5. call.active = true
// 6. Video element shows remote user
//
// End Session:
// 1. User clicks "End Session"
// 2. dispatch(endSession({ sessionId }))
// 3. Firebase unsubscribe
// 4. Messages become read-only
// 5. sessionStatus = "ended"

// ============================================================================
// STRICT RULES - DO NOT BYPASS
// ============================================================================
//
// ❌ DO NOT send chat without Redux session
// Check: if (!session || sessionStatus !== "active") return;
//
// ❌ DO NOT start call without token
// Must call startCall thunk first to get token from backend
//
// ❌ DO NOT use local state for core logic
// All critical state MUST be in Redux
//
// ❌ DO NOT bypass backend API
// Session creation/termination MUST go through:
// - POST /api/communication/sessions
// - POST /api/communication/sessions/{id}/close
// - POST /api/communication/call-token
//
// ============================================================================
// FIREBASE STRUCTURE
// ============================================================================
//
// collections:
// sessions/{sessionId}/
// messages/
// {messageId}/
// - text: string
// - senderType: "doctor" | "patient"
// - senderId: string
// - senderName: string
// - senderImage: string
// - timestamp: Firestore Timestamp
// - createdAt: ISO string

// ============================================================================
// ENVIRONMENT VARIABLES NEEDED
// ============================================================================
//
// In .env file:
// REACT_APP_AGORA_APP_ID=your_agora_app_id
// REACT_APP_API_BASE_URL=https://your-api.com
// (Firebase config should already be in utils/firebase.js)

// ============================================================================
// USAGE EXAMPLE - START COMMUNICATION
// ============================================================================
//
// In Schedule.jsx:
// const handleStartCommunication = async () => {
// try {
// const result = await dispatch(
// startSession({ appointmentId: appointment.id })
// ).unwrap();
//  
// dispatch(setSelectedPatient(appointment));
// navigate("/message");
// } catch (error) {
// alert(`Error: ${error}`);
// }
// };

// ============================================================================
// USAGE EXAMPLE - SEND MESSAGE
// ============================================================================
//
// In message.jsx:
// const handleSendMessage = async () => {
// if (!session?.id) {
// console.error("No active session");
// return;
// }
//  
// try {
// await sendMessage(session.id, {
// text: messageInput,
// senderType: "doctor",
// senderId: user.id,
// senderName: user.fullName
// });
// setMessageInput("");
// } catch (error) {
// alert("Failed to send message");
// }
// };

// ============================================================================
// USAGE EXAMPLE - START VIDEO CALL
// ============================================================================
//
// In message.jsx:
// const handleStartCall = async () => {
// try {
// const callResult = await dispatch(
// startCall({ sessionId: session.id })
// ).unwrap();
//  
// // Initialize Agora with returned token
// await agoraService.initializeClient(process.env.REACT_APP_AGORA_APP_ID);
// await agoraService.joinChannel(
// callResult.token,
// callResult.channelName,
// callResult.uid
// );
// await agoraService.publishLocalStream();
// dispatch(setCallActive(true));
// } catch (error) {
// alert("Failed to start call");
// }
// };

// ============================================================================
// TESTING CHECKLIST
// ============================================================================
//
// Redux Integration:
// ✓ communicationSlice created with correct initial state
// ✓ Thunks: startSession, endSession, startCall
// ✓ Added to store.js
// ✓ Redux DevTools shows communication state
//
// Firebase Integration:
// ✓ subscribeToSessionMessages works
// ✓ Real-time messages update Redux
// ✓ sendMessage uploads to Firestore
// ✓ Messages appear in chat UI
//
// Message Component:
// ✓ Shows active session
// ✓ Sends and receives messages
// ✓ Chat disabled when session ends
// ✓ Read-only UI after session ends
//
// Schedule Integration:
// ✓ Communication button on appointment cards
// ✓ Button triggers startSession
// ✓ Navigates to /message after success
// ✓ Error handling if session fails
//
// Agora Integration (when SDK installed):
// ✓ startCall gets token from backend
// ✓ Agora client initializes
// ✓ Joins channel successfully
// ✓ Video/audio transmits
// ✓ Remote user visible
// ✓ End call cleans up

export const COMMUNICATION_SYSTEM_DOCS = {
version: "1.0.0",
status: "ready_for_integration",
files_created: [
"src/redux/communication/communicationSlice.js",
"src/redux/communication/communicationHelpers.js",
"src/services/firebaseService.js",
"src/services/agoraService.js"
],
files_modified: [
"src/redux/store.js",
"src/pages/message/message.jsx (needs integration)",
"src/pages/schedule/Schedule.jsx (needs communication button)"
],
next_steps: [
"Install Agora SDK: npm install agora-rtc-sdk-ng",
"Update message.jsx with Redux integration",
"Add communication button to Schedule.jsx",
"Test session start/end flow",
"Test message sending via Firebase",
"Test Agora call initialization"
]
};
