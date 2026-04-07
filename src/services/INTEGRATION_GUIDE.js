/**
 * ============================================================================
 * SCHEDULE PAGE INTEGRATION - ADD COMMUNICATION BUTTON
 * ============================================================================
 *
 * Location: src/pages/schedule/Schedule.jsx
 *
 * Add these imports at the top:
 */

// import { startSession } from "../../redux/communication/communicationSlice";

/**
 * ============================================================================
 * CODE SNIPPET TO ADD IN APPOINTMENT CARD BUTTONS SECTION
 * ============================================================================
 *
 * Find the section where buttons are rendered (around line 850-900)
 * Currently has: "Start" button (config.nextLabel) and "View Details" button
 *
 * ADD THIS BUTTON BETWEEN THE TWO EXISTING BUTTONS:
 */

{
  session.status?.toLowerCase() === "confirmed" && (
    <Button
      fullWidth
      variant="contained"
      startIcon={<ChatBubbleOutline />}
      onClick={async () => {
        try {
          // Dispatch Redux action to start session
          const result = await dispatch(
            startSession({ appointmentId: session.id })
          ).unwrap();

          // Store the appointment for context in message page
          dispatch(setSelectedPatient(session));

          // Navigate to message page
          navigate("/message");
        } catch (error) {
          alert(`Failed to start communication: ${error}`);
          console.error("Start session error:", error);
        }
      }}
      sx={{
        background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
        color: "white",
        fontWeight: 600,
        py: { xs: 1, md: 1.2 },
        borderRadius: "12px",
        textTransform: "none",
        fontSize: { xs: "11px", md: "15px" },
        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
        "&:hover": {
          background: "linear-gradient(135deg, #764BA2 0%, #667EEA 100%)",
        },
      }}
    >
      Start Communication
    </Button>
  );
}

/**
 * ============================================================================
 * FULL BUTTON SECTION EXAMPLE
 * ============================================================================
 *
 * Replace existing button stack with:
 */

<Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 1.5 }}>
  {config.nextStatus && (
    <Button
      fullWidth
      variant="contained"
      endIcon={<ArrowForward />}
      onClick={() => handleStatusChange(config.nextStatus, session)}
      sx={{
        background: "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
        color: "white",
        fontWeight: 600,
        py: { xs: 1, md: 1.2 },
        borderRadius: "12px",
        textTransform: "none",
        fontSize: { xs: "11px", md: "15px" },
        boxShadow: "0 4px 12px rgba(82, 172, 140, 0.3)",
      }}
    >
      {config.nextLabel}
    </Button>
  )}

  {/* COMMUNICATION BUTTON - NEW */}
  {session.status?.toLowerCase() === "confirmed" && (
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
        py: { xs: 1, md: 1.2 },
        borderRadius: "12px",
        textTransform: "none",
        fontSize: { xs: "11px", md: "15px" },
        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
      }}
    >
      Start Communication
    </Button>
  )}

  <Button
    fullWidth
    variant="outlined"
    onClick={() => {
      const currentIndex = data?.data?.appointments.findIndex(
        (p) => p.id === session.id
      );
      const nextPatient = data?.data?.appointments[currentIndex + 1] || null;
      dispatch(setSelectedPatient2(nextPatient));
      dispatch(setSelectedPatient(session));
      navigate("/schedule/appointmentsdetails");
    }}
    sx={{
      borderColor: "primary.main",
      color: "primary.main",
      fontWeight: 600,
      py: { xs: 1, md: 1.2 },
      borderRadius: "12px",
      textTransform: "none",
      fontSize: { xs: "11px", md: "15px" },
      borderWidth: "2px",
    }}
  >
    View Details
  </Button>
</Stack>;

/**
 * ============================================================================
 * MESSAGE PAGE INTEGRATION - SIMPLIFIED VERSION
 * ============================================================================
 *
 * For now, use the existing message.jsx UI and add Redux handling like:
 */

import { useDispatch, useSelector } from "react-redux";
import {
  endSession,
  startCall,
  setMessages,
  clearSession,
} from "../../redux/communication/communicationSlice";
import {
  subscribeToSessionMessages,
  sendMessage as firebaseSendMessage,
} from "../../services/firebaseService";
import useCommunicationSession from "../../hooks/useCommunicationSession";

const Message = () => {
  // ... existing code ...

  const dispatch = useDispatch();
  const { session, sessionStatus, messages, call } = useSelector(
    (state) => state.communication
  );
  const { user } = useSelector((state) => state.auth);

  // Use custom hook for lifecycle management
  const {
    isSessionActive,
    sessionId,
    endSession: hookEndSession,
  } = useCommunicationSession();

  const [messageInput, setMessageInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  // Handle send message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !session?.id) return;

    setSendingMessage(true);
    try {
      await firebaseSendMessage(session.id, {
        text: messageInput.trim(),
        senderType: "doctor",
        senderId: user?.id || user?.userId,
        senderName: user?.fullName || "Doctor",
        senderImage: user?.imageUrl,
      });
      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle start call
  const handleStartCall = async () => {
    if (!session?.id) return;
    try {
      const callResult = await dispatch(
        startCall({ sessionId: session.id })
      ).unwrap();
      console.log("Call initiated with token:", callResult);
      // Agora integration would go here
    } catch (error) {
      console.error("Failed to start call:", error);
      alert("Failed to start call");
    }
  };

  // Handle end session
  const handleEndSession = async () => {
    if (!session?.id) return;
    try {
      await dispatch(endSession({ sessionId: session.id })).unwrap();
    } catch (error) {
      console.error("Failed to end session:", error);
      alert("Failed to end session");
    }
  };

  // Redirect if no session
  if (!isSessionActive) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Alert severity="info">
          No active session. Start from the Schedule page.
        </Alert>
      </Box>
    );
  }

  // ... rest of existing UI rendering code ...
};

export default Message;
