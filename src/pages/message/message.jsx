import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  TextField,
  IconButton,
  Paper,
  Divider,
  Button,
  InputAdornment,
  useTheme,
  useMediaQuery,
  alpha,
  Alert,
  CircularProgress,
  Stack,
  Fade,
  Snackbar,
  Tooltip,
} from "@mui/material";
import {
  History as HistoryIcon,
  Description as MedicalRecordIcon,
  CallEnd as EndCallIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon,
  AccessTime as AccessTimeIcon,
  NoteAlt as ReasonIcon,
  ArrowBack as ArrowBackIcon,
  VideoCall as VideoCallIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
} from "@mui/icons-material";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";

// Redux Actions & Selectors
import {
  endSession,
  startCall,
  setMessages,
  clearSession,
  setSessionStatus,
} from "../../redux/communication/communicationSlice";

// Firebase Service
import {
  subscribeToSessionMessages,
  sendMessage as firebaseSendMessage,
} from "../../services/firebaseService";

// Agora Service
import agoraService from "../../services/agoraService";
import { useSnackbar } from "../../hooks/useSnackbar";
import GlobalSnackbar from "../../components/GlobalSnackbar";
const Message = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // 🔹 Redux State
  const { session, sessionStatus, messages, call } = useSelector(
    (state) => state.communication
  );

  const selectedPatient = useSelector(
    (state) => state.schedule.selectedPatient
  );

  const { user: doctorUser } = useSelector((state) => state.doctor);

  // 🔹 Local State
  const [messageInput, setMessageInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const chatEndRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);
  const [networkWarning, setNetworkWarning] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Video Call State
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Video Container Refs - CRITICAL: These must be stable refs for Agora SDK
  const localVideoContainerRef = useRef(null);
  const remoteVideoContainerRef = useRef(null);

  // Track refs to avoid re-renders breaking video playback
  const localVideoTrackRef = useRef(null);
  const remoteVideoTracksRef = useRef({}); // { uid: { audio, video } }
  const playedUsers = useRef({});
  const expiryWarningShownRef = useRef(false);
  const expiryTimerRef = useRef(null);

  // ✅ Remote User Status - track which users have audio/video
  const [remoteUsersStatus, setRemoteUsersStatus] = useState({}); // { uid: { hasAudio, hasVideo } }

  // 🔹 Get User Info
  const userLS = JSON.parse(localStorage.getItem("user") || "{}");
  const senderId = doctorUser?.data?.id || userLS?.id || "doctor-id";
  const senderName = doctorUser?.data?.fullName || userLS?.fullName || "Doctor";
  const senderImage = doctorUser?.data?.imageUrl || userLS?.imageUrl;
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  // 🔹 Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Firebase Subscription
  useEffect(() => {
    const sessionId = session?.id || session?.sessionId;

    if (
      sessionId &&
      (sessionStatus === "active" || sessionStatus === "ended")
    ) {
      const unsubscribe = subscribeToSessionMessages(
        sessionId,
        (fetchedMessages) => {
          dispatch(setMessages(fetchedMessages));
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [session?.id, session?.sessionId, sessionStatus, dispatch]);
  useEffect(() => {
    // إعادة تعيين الـ Ref عند تحميل جلسة جديدة
    expiryWarningShownRef.current = false;
  }, [session?.sessionId]);

  useEffect(() => {
    if (
      !session?.expiresAt ||
      sessionStatus !== "active" ||
      expiryWarningShownRef.current
    )
      return;

    const expiresAt = new Date(session.expiresAt).getTime();
    const fiveMinutesBefore = expiresAt - 5 * 60 * 1000;
    const now = Date.now();
    const timeUntilWarning = fiveMinutesBefore - now;

    if (timeUntilWarning > 0) {
      const timer = setTimeout(() => {
        if (sessionStatus === "active") {
          showSnackbar(
            "⚠️Warning: The session will end in 5 minutes. Calls and messages will be automatically disabled.",
            "warning"
          );
          expiryWarningShownRef.current = true;
        }
      }, timeUntilWarning);

      return () => clearTimeout(timer);
    } else if (now < expiresAt) {
      const timer = setTimeout(() => {
        if (sessionStatus === "active") {
          showSnackbar(
            "⚠️ Warning: The session will end in 5 minutes. Calls and messages will be automatically disabled.",
            "warning"
          );
          expiryWarningShownRef.current = true;
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [session?.expiresAt, sessionStatus]);
  // 🔹 Handle Send Message
  const handleSendMessage = async () => {
    const sessionId = session?.id || session?.sessionId;
    if (!messageInput.trim() || !sessionId || sessionStatus !== "active") {
      return;
    }
    setSendingMessage(true);
    try {
      await firebaseSendMessage(sessionId, {
        text: messageInput.trim(),
        senderType: "doctor",
        senderId: senderId,
        senderName: senderName,
        senderImage: senderImage,
        type: "text",
      });
      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
      showSnackbar("Failed to send message. Please check connection.", "error");
    } finally {
      setSendingMessage(false);
    }
  };

  const checkMediaPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      return true;
    } catch (error) {
      console.error("Permission error:", error);

      if (error.name === "NotAllowedError") {
        showSnackbar("Please allow camera & microphone access", "error");
      } else if (error.name === "NotFoundError") {
        showSnackbar("No camera or microphone found", "error");
      } else {
        showSnackbar("Media device error: " + error.message, "error");
      }

      return false;
    }
  };

  // ✅ FIX: Reliable video player with DOM readiness check and retry logic
  // This handles the most common issue: trying to play before container is in DOM
  const playVideoTrack = useCallback((track, containerRef, label = "video") => {
    if (!track || !containerRef?.current) {
      console.warn(
        `⚠️ [VIDEO] Cannot play ${label}: track or container missing`
      );
      return false;
    }

    const container = containerRef.current;

    // CRITICAL: Check if element is actually in the DOM and rendered
    if (!(container instanceof HTMLElement) || !document.contains(container)) {
      console.warn(
        `⚠️ [VIDEO] Container not ready for ${label}, will retry...`
      );
      // Retry after short delay - DOM might still be rendering
      setTimeout(() => playVideoTrack(track, containerRef, label), 100);
      return false;
    }

    try {
      // Agora SDK: track.play() attaches the video to the container
      track.play(container);
      return true;
    } catch (err) {
      // Retry a few times in case of transient DOM issues
      let attempts = 0;
      const maxAttempts = 5;
      const retry = () => {
        attempts++;
        if (attempts < maxAttempts && document.contains(container)) {
          setTimeout(() => {
            try {
              track.play(container);
            } catch (e) {
              retry();
            }
          }, 150 * attempts); // Exponential backoff
        }
      };
      retry();
      return false;
    }
  }, []);

  //  FIX: Subscribe and play remote user's tracks - handles both new and existing users
  const handleRemoteUserTracks = useCallback(
    async (user, mediaType = "both") => {
      try {
        // Subscribe to the tracks via Agora SDK
        const { audio, video } = await agoraService.subscribeToRemoteStream(
          user,
          mediaType
        );

        // Store tracks in ref for cleanup/access later
        if (!remoteVideoTracksRef.current[user.uid]) {
          remoteVideoTracksRef.current[user.uid] = {};
        }

        // Handle video track
        if (video && mediaType !== "audio") {
          remoteVideoTracksRef.current[user.uid].video = video;
          // Play immediately - use our reliable player
          playVideoTrack(
            video,
            remoteVideoContainerRef,
            `remote video (uid: ${user.uid})`
          );

          setRemoteUsersStatus((prev) => ({
            ...prev,
            [user.uid]: { ...(prev[user.uid] || {}), hasVideo: true },
          }));
        }
        // Handle audio track
        if (audio && mediaType !== "video") {
          const existingAudio = remoteVideoTracksRef.current[user.uid]?.audio;

          if (!existingAudio) {
            remoteVideoTracksRef.current[user.uid].audio = audio;

            try {
              if (audio && !playedUsers.current[user.uid]) {
                audio.play();
                playedUsers.current[user.uid] = true;
              }
            } catch (e) {
              console.warn("⚠️ Audio autoplay blocked:", e);
            }

            setRemoteUsersStatus((prev) => ({
              ...prev,
              [user.uid]: { ...(prev[user.uid] || {}), hasAudio: true },
            }));
          }
        }
      } catch (err) {
        console.error(`❌ Failed to handle tracks for user ${user?.uid}:`, err);
        showSnackbar("Failed to load remote media", "error");
      }
    },
    [playVideoTrack]
  );

  // ✅ FIX: Main call flow - CORRECT ORDER IS CRITICAL
  const handleStartCall = async () => {
    // ✅ 1. Check media permissions first
    const hasPermission = await checkMediaPermissions();
    if (!hasPermission) {
      setConnecting(false);
      return;
    }

    // ✅ 2. If call already active, end it first
    if (isInCall) {
      await handleEndCall();
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const sessionId = session?.id || session?.sessionId;
    const appointmentId = session?.appointmentId;

    if (!sessionId) {
      setConnecting(false);
      showSnackbar("No active session", "error");
      return;
    }

    if (!appointmentId) {
      setConnecting(false);
      showSnackbar("Invalid session data", "error");
      return;
    }

    setConnecting(true);
    let tokenToUse = null;
    let channelToUse = null;
    let uidToUse = 1;

    try {
      const callResult = await dispatch(startCall({ appointmentId })).unwrap();

      tokenToUse = callResult.token;
      channelToUse = callResult.channelName || callResult.channel;
      uidToUse = callResult.uid || 1;

      if (!tokenToUse || !channelToUse) {
        throw new Error("Invalid token or channel from backend");
      }
    } catch (error) {
      console.error("❌ [CALL] Failed to get token:", error);
      showSnackbar("Failed to start call: " + error.message, "error");
      setConnecting(false);
      return;
    }

    try {
      const appId =
        import.meta.env.VITE_AGORA_APP_ID || process.env.REACT_APP_AGORA_APP_ID;

      if (!appId || appId === "undefined") {
        throw new Error("Agora App ID missing!");
      }

      await agoraService.initializeClient(appId);

      // CRITICAL FIX #1: Setup event listeners BEFORE joining
      // This ensures we don't miss "user-published" events from users already in channel
      agoraService.setupEventListeners({
        onUserJoined: async (user) => {
          setRemoteUsersStatus((prev) => ({
            ...prev,
            [user.uid]: { hasAudio: false, hasVideo: false },
          }));
        },

        onUserPublished: async (user, mediaType) => {
          await handleRemoteUserTracks(user, mediaType);
        },

        onUserUnpublished: (user, mediaType) => {
          const updates = {};
          if (mediaType === "video") {
            updates.hasVideo = false;
            if (remoteVideoTracksRef.current[user.uid]?.video)
              remoteVideoTracksRef.current[user.uid].video = null;
          }
          // ✅ FIX: التعامل مع كتم الميكروفون أيضاً
          if (mediaType === "audio") {
            updates.hasAudio = false;
            if (remoteVideoTracksRef.current[user.uid]?.audio)
              remoteVideoTracksRef.current[user.uid].audio = null;
          }

          if (Object.keys(updates).length > 0) {
            setRemoteUsersStatus((prev) => ({
              ...prev,
              [user.uid]: { ...(prev[user.uid] || {}), ...updates },
            }));
          }
        },

        onUserLeft: (user) => {
          // Clean up this user's tracks
          if (remoteVideoTracksRef.current[user.uid]) {
            const tracks = remoteVideoTracksRef.current[user.uid];
            if (tracks.video) {
              tracks.video.stop?.();
              tracks.video.close?.();
            }
            if (tracks.audio) {
              tracks.audio.stop?.();
              tracks.audio.close?.();
            }
            delete remoteVideoTracksRef.current[user.uid];
          }
          setRemoteUsersStatus((prev) => {
            const updated = { ...prev };
            delete updated[user.uid];
            return updated;
          });
          // Clear remote video container if this was the only remote user
          if (remoteVideoContainerRef.current) {
            remoteVideoContainerRef.current.innerHTML = "";
          }
        },

        onError: (error) => {
          console.error("❌ Agora error:", error);
          showSnackbar("Call error: " + error.msg, "error");
        },
      });

      await agoraService.joinChannel(tokenToUse, channelToUse, uidToUse);
      const remoteUsers = agoraService.getRemoteUsers();
      for (const user of remoteUsers) {
        // Check what tracks this user has already published
        if (user.hasVideo || user.videoTrack) {
          await handleRemoteUserTracks(user, "video");
        }
        if (user.hasAudio || user.audioTrack) {
          await handleRemoteUserTracks(user, "audio");
        }
      }

      const tracks = await agoraService.publishLocalStream({
        audioOptions: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        videoOptions: { encoderConfig: "640x480" },
      });
      // Don't wait for state updates - use refs for immediate access
      if (tracks.video) {
        localVideoTrackRef.current = tracks.video;
        // Play local video with our reliable player
        // Small delay to ensure container is rendered
        playVideoTrack(tracks.video, localVideoContainerRef, "local video");
      }
      if (tracks.audio) {
        // Audio doesn't need DOM playback, just keep reference
        localVideoTrackRef.current = localVideoTrackRef.current || {};
      }

      // Update UI state last
      setIsInCall(true);
      setShowVideo(true);
    } catch (error) {
      console.error("❌ [CALL] Agora failed:", error);
      showSnackbar("Failed to start video call: " + error.message, "error");
      // Cleanup on error
      await agoraService.cleanup();
    } finally {
      setConnecting(false);
    }
  };

  // ✅ FIX: Proper cleanup when ending call
  const handleEndCall = async () => {
    try {
      // Stop and close all remote tracks
      Object.values(remoteVideoTracksRef.current).forEach((tracks) => {
        if (tracks.video) {
          tracks.video.stop?.();
          tracks.video.close?.();
        }
        if (tracks.audio) {
          tracks.audio.stop?.();
          tracks.audio.close?.();
        }
      });
      remoteVideoTracksRef.current = {};

      // Stop and close local tracks via service
      await agoraService.leaveChannel();

      // Clear video containers
      if (localVideoContainerRef.current) {
        localVideoContainerRef.current.innerHTML = "";
      }
      if (remoteVideoContainerRef.current) {
        remoteVideoContainerRef.current.innerHTML = "";
      }

      // Reset all state
      setIsInCall(false);
      setIsMuted(false);
      setIsVideoOff(false);
      setShowVideo(false);
      setRemoteUsersStatus({});
      localVideoTrackRef.current = null;
    } catch (error) {
      console.error("❌ Failed to end call:", error);
    }
  };

  const handleToggleMute = async () => {
    try {
      const tracks = agoraService.getLocalTracks();
      if (!tracks.audio) {
        console.warn("⚠️ Audio track not found!");
        showSnackbar("Microphone not ready, please try again", "warning");
        return;
      }

      await agoraService.muteLocalAudio(!isMuted);
      setIsMuted((prev) => !prev);
      showSnackbar(isMuted ? "Microphone enabled" : "Microphone muted", "info");
    } catch (error) {
      console.error("❌ Failed to toggle mute:", error);
      showSnackbar("Failed to toggle microphone: " + error.message, "error");
    }
  };

  const handleToggleVideo = async () => {
    try {
      const tracks = agoraService.getLocalTracks();
      if (!tracks.video) {
        console.warn("⚠️ Video track not found!");
        showSnackbar("Camera not ready, please try again", "warning");
        return;
      }

      await agoraService.muteLocalVideo(!isVideoOff);
      setIsVideoOff((prev) => !prev);

      showSnackbar(isVideoOff ? "Camera enabled" : "Camera disabled", "info");
    } catch (error) {
      console.error("❌ Failed to toggle video:", error);
      showSnackbar("Failed to toggle camera: " + error.message, "error");
    }
  };

  const handleEndSession = async () => {
    const sessionId = session?.id || session?.sessionId;

    if (!sessionId) {
      showSnackbar("No active session to end", "warning");
      return;
    }

    try {
      await dispatch(endSession({ sessionId })).unwrap();
      dispatch(clearSession());
      navigate("/schedule");
    } catch (error) {
      showSnackbar("Failed to end session: " + error.message, "error");
    }
  };

  const handleBackToDashboard = () => {
    dispatch(clearSession());
    navigate("/schedule");
  };

  const formatSessionTime = () => {
    try {
      let start, end;

      // 🔹 الحالة 1: لو فيه startedAt و expiresAt (الجلسة فعلية)
      if (session?.startedAt && session?.expiresAt) {
        start = new Date(session.startedAt);
        end = new Date(session.expiresAt);
      }
      // 🔹 الحالة 2: لو فيه appointmentDate و appointmentTime (موعد مستقبلي)
      else if (session?.appointmentDate && session?.appointmentTime) {
        const date = new Date(session.appointmentDate);
        const [hours, minutes] = session.appointmentTime.split(":");
        start = new Date(date);
        start.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        end = new Date(start);
        end.setMinutes(start.getMinutes() + 30);
      }
      // 🔹 الحالة 3: fallback من selectedPatient
      else if (selectedPatient?.appointmentDate) {
        const date = new Date(selectedPatient.appointmentDate);
        start = date;
        end = new Date(date);
        end.setMinutes(date.getMinutes() + 30);
      }
      // 🔹 الحالة 4: مفيش بيانات
      else {
        return "Session Time";
      }

      // 🔹 التحقق من صحة التواريخ
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.warn("⚠️ Invalid session dates:", {
          startedAt: session?.startedAt,
          expiresAt: session?.expiresAt,
        });
        return "Session Time";
      }

      // 🔹 تنسيق الوقت للعرض
      const format = (d) =>
        d.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });

      return `${format(start)} - ${format(end)}`;
    } catch (error) {
      console.error("❌ Error formatting session time:", error);
      return "Session Time";
    }
  };

  const formattedTime = formatSessionTime();
  const isExpired = session?.expiresAt
    ? new Date(session.expiresAt) <= new Date()
    : false;

  // 🔹 No Session State
  if (!session && sessionStatus === "idle") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F9FAFB",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Alert severity="warning" sx={{ maxWidth: 500, mb: 2 }}>
          No Active Session
        </Alert>
        <Button
          variant="contained"
          onClick={handleBackToDashboard}
          sx={{ color: "white", textTransform: "none" }}
        >
          Back to Schedule
        </Button>
      </Box>
    );
  }

  // ✅ دالة لتنسيق وقت الرسالة
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "Just now";

    try {
      let date;

      if (timestamp?.toDate && typeof timestamp.toDate === "function") {
        date = timestamp.toDate();
      } else if (typeof timestamp === "string") {
        date = new Date(timestamp);
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else {
        return "Just now";
      }

      if (isNaN(date.getTime())) {
        return "Just now";
      }

      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("❌ Error formatting time:", error);
      return "Just now";
    }
  };

  // ✅ FIX: Cleanup effect - runs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      // Cleanup Agora resources
      agoraService.cleanup();
      // Clear refs
      remoteVideoTracksRef.current = {};
      localVideoTrackRef.current = null;
    };
  }, []);

  // ✅ FIX: Re-play videos when showVideo toggles (handles UI re-renders)
  useEffect(() => {
    if (showVideo && isInCall) {
      // Small delay to ensure DOM is fully rendered after showing video UI
      const timer = setTimeout(() => {
        // Re-play local video if track exists
        if (localVideoTrackRef.current && localVideoContainerRef.current) {
          playVideoTrack(
            localVideoTrackRef.current,
            localVideoContainerRef,
            "local video (replay)"
          );
        }
        // Re-play all remote videos
        Object.entries(remoteVideoTracksRef.current).forEach(
          ([uid, tracks]) => {
            if (tracks.video && remoteVideoContainerRef.current) {
              playVideoTrack(
                tracks.video,
                remoteVideoContainerRef,
                `remote video uid:${uid} (replay)`
              );
            }
          }
        );
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showVideo, isInCall, playVideoTrack]);
  useEffect(() => {
    if (!session?.expiresAt || !isInCall) return;

    const expiresAt = new Date(session.expiresAt).getTime();
    const now = Date.now();
    const timeLeft = expiresAt - now;

    // لو الوقت خلص بالفعل أو خلص دلوقتي
    if (timeLeft <= 0) {
      handleEndCall();
      showSnackbar(
        "⏰ The session has expired. The call has been automatically closed.",
        "warning"
      );
      return;
    }

    //  ضبط مؤقت دقيق لوقت الانتهاء بالض
    expiryTimerRef.current = setTimeout(() => {
      if (isInCall) {
        handleEndCall();
        showSnackbar(
          "⏰ The session has expired. The call has been automatically closed.",
          "warning"
        );
      }
    }, timeLeft);

    // ✅ تنظيف المؤقت عند تغيير الجلسة أو إغلاق المكالمة يدوياً
    return () => {
      if (expiryTimerRef.current) {
        clearTimeout(expiryTimerRef.current);
        expiryTimerRef.current = null;
      }
    };
  }, [session?.expiresAt, isInCall]);
  const responsiveStyles = {
    videoContainer: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100vh",
      bgcolor: "black",
      zIndex: 1300,
    },

    remoteVideo: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },

    localVideo: {
      position: "absolute",
      bottom: { xs: 100, sm: 90, md: 20 },
      right: 20,
      width: { xs: "100px", sm: "140px", md: "200px" },
      height: { xs: "140px", sm: "180px", md: "240px" },
      borderRadius: "12px",
      overflow: "hidden",
      border: "2px solid white",
      bgcolor: "black",
      zIndex: 150,
    },

    callControls: {
      position: "absolute",
      bottom: { xs: 20, md: 20 },
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: 2,
      zIndex: 200,
    },
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F9FAFB",
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          display: "flex",
          flexDirection: "column",
        }}
      >
        {networkWarning && (
          <Box
            sx={{
              position: "fixed",
              top: 20,
              right: 20,
              bgcolor: "#F59E0B",
              color: "white",
              px: 2,
              py: 1,
              borderRadius: 2,
              zIndex: 2000,
            }}
          >
            Network is unstable ⚠️
          </Box>
        )}

        {/* ================= VIDEO CALL UI ================= */}
        {isInCall && showVideo && (
          <Box sx={{ ...responsiveStyles.videoContainer }}>
            {/* ✅ Remote User Status Icons - يعرض الحالة بوضوح (أخضر=مفتوح، أحمر=مغلق) */}
            {/* <Box
              sx={{
                position: "absolute",
                top: { xs: 80, md: 100 },
                left: { xs: 20, md: 30 },
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                zIndex: 500,
                pointerEvents: "none",
              }}
            >
              
              {Object.entries(remoteUsersStatus).map(([uid, status]) => (
                <React.Fragment key={uid}>
                  {/* حالة الميكروفون 
                  {status.hasAudio !== undefined && (
                    <Box
                      sx={{
                        width: { xs: 50, md: 60 },
                        height: { xs: 50, md: 60 },
                        borderRadius: "50%",
                        bgcolor: status.hasAudio
                          ? "rgba(16, 185, 129, 0.9)"
                          : "rgba(239, 68, 68, 0.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        transition: "background-color 0.3s",
                      }}
                    >
                      {status.hasAudio ? (
                        <MicIcon
                          sx={{ fontSize: { xs: 24, md: 28 }, color: "white" }}
                        />
                      ) : (
                        <MicOffIcon
                          sx={{ fontSize: { xs: 24, md: 28 }, color: "white" }}
                        />
                      )}
                    </Box>
                  )}
                  {/* حالة الكاميرا 
                  {status.hasVideo !== undefined && (
                    <Box
                      sx={{
                        width: { xs: 50, md: 60 },
                        height: { xs: 50, md: 60 },
                        borderRadius: "50%",
                        bgcolor: status.hasVideo
                          ? "rgba(16, 185, 129, 0.9)"
                          : "rgba(239, 68, 68, 0.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        transition: "background-color 0.3s",
                      }}
                    >
                      {status.hasVideo ? (
                        <VideocamIcon
                          sx={{ fontSize: { xs: 24, md: 28 }, color: "white" }}
                        />
                      ) : (
                        <VideocamOffIcon
                          sx={{ fontSize: { xs: 24, md: 28 }, color: "white" }}
                        />
                      )}
                    </Box>
                  )}
                </React.Fragment>
              ))}
            </Box> */}

            {/* زر الرجوع للخلف */}
            <Box sx={{ position: "absolute", top: 20, left: 20, zIndex: 200 }}>
              <IconButton
                onClick={() => setShowVideo(false)}
                sx={{
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: "white",
                  backdropFilter: "blur(6px)",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Box>

            {/* ✅ Remote Video - with fallback background */}
            <Box sx={responsiveStyles.remoteVideo}>
              <div
                ref={remoteVideoContainerRef}
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#000",
                }}
              />
            </Box>

            {/* ✅ Local Video (Picture-in-Picture) - with fallback background */}
            <Box sx={responsiveStyles.localVideo}>
              <div
                ref={localVideoContainerRef}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  backgroundColor: "#000",
                }}
              />
            </Box>

            {/* Call Controls */}
            <Box sx={responsiveStyles.callControls}>
              <IconButton
                onClick={handleToggleMute}
                sx={{
                  bgcolor: isMuted ? "#DC2626" : "rgba(255,255,255,0.2)",
                  color: "white",
                  width: 50,
                  height: 50,
                  "&:hover": {
                    bgcolor: isMuted ? "#B91C1C" : "rgba(255,255,255,0.3)",
                  },
                }}
              >
                {isMuted ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
              <IconButton
                onClick={handleToggleVideo}
                sx={{
                  bgcolor: isVideoOff ? "#DC2626" : "rgba(255,255,255,0.2)",
                  color: "white",
                  width: 50,
                  height: 50,
                  "&:hover": {
                    bgcolor: isVideoOff ? "#B91C1C" : "rgba(255,255,255,0.3)",
                  },
                }}
              >
                {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
              </IconButton>
              <IconButton
                onClick={handleEndCall}
                sx={{
                  bgcolor: "#DC2626",
                  color: "white",
                  width: 60,
                  height: 60,
                  "&:hover": { bgcolor: "#B91C1C" },
                }}
              >
                <EndCallIcon sx={{ transform: "rotate(135deg)" }} />
              </IconButton>
            </Box>
          </Box>
        )}

        {/* ================= HEADER ================= */}
        {(!isInCall || !showVideo) && (
          <Box
            sx={{
              bgcolor: "white",
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 1.5, md: 2 },
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2, md: 0 },
              borderBottom: "1px solid #E5E7EB",
              position: "sticky",
              top: 0,
              zIndex: 1100,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.5, md: 2 },
                width: "100%",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: { xs: 48, md: 56 },
                  height: { xs: 48, md: 56 },
                  borderRadius: "50%",
                  p: { xs: 0.5, md: 1 },
                }}
              >
                <Avatar
                  src={selectedPatient?.patient?.image}
                  sx={{
                    width: { xs: 50, md: 58 },
                    height: { xs: 50, md: 58 },
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: { xs: 1, md: 2 },
                    right: { xs: 1, md: 2 },
                    width: { xs: 10, md: 12 },
                    height: { xs: 10, md: 12 },
                    bgcolor:
                      sessionStatus === "active"
                        ? "#10B981"
                        : sessionStatus === "waiting"
                        ? "#FBBF24"
                        : "#6B7280",
                    borderRadius: "50%",
                    border: "2px solid white",
                  }}
                />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  fontWeight="bold"
                  noWrap
                >
                  {selectedPatient?.patient?.name || "Patient"}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "text.secondary",
                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                    flexWrap: "wrap",
                  }}
                >
                  {(sessionStatus === "active" ||
                    sessionStatus === "waiting") && (
                    <span>{formattedTime}</span>
                  )}
                  {sessionStatus === "active" && (
                    <>
                      <span>•</span>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          color: "#2474ED",
                          fontWeight: 500,
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: 6, md: 8 },
                            height: { xs: 6, md: 8 },
                            borderRadius: "50%",
                            bgcolor: "#2474ED",
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ display: { xs: "none", sm: "inline" } }}
                        >
                          Session Active
                        </Typography>
                      </Box>
                    </>
                  )}
                  {call.active && (
                    <>
                      <span>•</span>
                      <Chip
                        label="Call Ready"
                        size="small"
                        sx={{ bgcolor: "#10B981", color: "white", height: 20 }}
                      />
                    </>
                  )}
                </Box>
              </Box>

              {/* {isInCall && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    ml: 2,
                  }}
                >
                  <Tooltip
                    title={
                      Object.values(remoteUsersStatus)[0]?.hasAudio
                        ? "Microphone On"
                        : "Microphone Off"
                    }
                  >
                    <IconButton
                      size="small"
                      sx={{
                        color: Object.values(remoteUsersStatus)[0]?.hasAudio
                          ? "#10B981"
                          : "#EF4444",
                        bgcolor: alpha(
                          Object.values(remoteUsersStatus)[0]?.hasAudio
                            ? "#10B981"
                            : "#EF4444",
                          0.1
                        ),
                        width: 32,
                        height: 32,
                      }}
                    >
                      {Object.values(remoteUsersStatus)[0]?.hasAudio ? (
                        <MicIcon fontSize="small" />
                      ) : (
                        <MicOffIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={
                      Object.values(remoteUsersStatus)[0]?.hasVideo
                        ? "Camera On"
                        : "Camera Off"
                    }
                  >
                    <IconButton
                      size="small"
                      sx={{
                        color: Object.values(remoteUsersStatus)[0]?.hasVideo
                          ? "#10B981"
                          : "#EF4444",
                        bgcolor: alpha(
                          Object.values(remoteUsersStatus)[0]?.hasVideo
                            ? "#10B981"
                            : "#EF4444",
                          0.1
                        ),
                        width: 32,
                        height: 32,
                      }}
                    >
                      {Object.values(remoteUsersStatus)[0]?.hasVideo ? (
                        <VideocamIcon fontSize="small" />
                      ) : (
                        <VideocamOffIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              )} */}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, md: 2 },
                width: { xs: "100%", md: "auto" },
                justifyContent: { xs: "space-between", md: "flex-end" },
                flexWrap: "wrap",
              }}
            >
              {sessionStatus === "waiting" && (
                <Chip
                  label="Waiting for patient"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    bgcolor: "#FFF7ED",
                    color: "#C2410C",
                    fontWeight: 500,
                    "& .MuiChip-label": { px: { xs: 2, md: 3 } },
                  }}
                />
              )}
              {sessionStatus === "ended" && (
                <Chip
                  label="Session Ended"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    bgcolor: "#F3F4F6",
                    color: "#6B7280",
                    fontWeight: 500,
                    "& .MuiChip-label": { px: { xs: 2, md: 3 } },
                  }}
                />
              )}
              {sessionStatus === "waiting" && (
                <IconButton size={isMobile ? "small" : "medium"}>
                  <HistoryIcon
                    sx={{ color: "#9CA3AF", fontSize: { xs: 20, md: 24 } }}
                  />
                </IconButton>
              )}
              {sessionStatus === "active" && (
                <>
                  <Button
                    startIcon={
                      <VideoCallIcon fontSize={isMobile ? "small" : "medium"} />
                    }
                    size={isMobile ? "small" : "medium"}
                    onClick={() => {
                      if (session.isExpired) {
                        showSnackbar(
                          "⏰ انتهت مدة الجلسة. لا يمكن بدء مكالمة جديدة.",
                          "warning"
                        );
                        return;
                      }
                      if (isInCall) {
                        setShowVideo(true);
                      } else {
                        handleStartCall();
                      }
                    }}
                    disabled={connecting || isExpired}
                    sx={{
                      bgcolor: isExpired
                        ? "#9CA3AF"
                        : connecting
                        ? "#ccc"
                        : isInCall || call.active
                        ? "#10B981"
                        : "#2474ED",
                      color: "white",
                      textTransform: "none",
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: isExpired
                          ? "#9CA3AF"
                          : connecting
                          ? "#ccc"
                          : isInCall || call.active
                          ? "#059669"
                          : "#1d4ed8",
                      },
                      fontSize: { xs: "0.75rem", md: "0.875rem" },
                      px: { xs: 1, md: 2 },
                      opacity: isExpired ? 0.8 : 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ display: { xs: "none", sm: "inline" } }}
                    >
                      {isExpired
                        ? "Session Expired"
                        : connecting
                        ? "Connecting..."
                        : isInCall
                        ? "In Call"
                        : call.active
                        ? "Join Call"
                        : "Start Video Call"}
                    </Typography>
                  </Button>
                  <Button
                    startIcon={
                      <EndCallIcon fontSize={isMobile ? "small" : "medium"} />
                    }
                    size={isMobile ? "small" : "medium"}
                    onClick={handleEndSession}
                    sx={{
                      bgcolor: "#FEF2F2",
                      color: "#DC2626",
                      textTransform: "none",
                      borderRadius: 1,
                      "&:hover": { bgcolor: "#FEE2E2" },
                      fontSize: { xs: "0.75rem", md: "0.875rem" },
                      px: { xs: 1, md: 2 },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ display: { xs: "none", sm: "inline" } }}
                    >
                      End Session
                    </Typography>
                  </Button>
                </>
              )}
              {sessionStatus === "ended" && (
                <>
                  <IconButton size={isMobile ? "small" : "medium"}>
                    <DownloadIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
                  </IconButton>
                  <IconButton size={isMobile ? "small" : "medium"}>
                    <PrintIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>
        )}

        {/* ================= MAIN CONTENT ================= */}
        {(!isInCall || !showVideo) && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              px: { xs: 0, sm: 0, md: 0 },
              py: { xs: 0, md: 0 },
              pb: { xs: 0, md: 0 },
              overflow: "hidden",
              position: "relative",
            }}
          >
            {sessionStatus === "waiting" && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 5 },
                    width: "100%",
                    maxWidth: { xs: "100%", sm: 450, md: 500 },
                    mx: "auto",
                    textAlign: "center",
                    border: "1px solid #F3F4F6",
                    mt: { xs: 4, md: 8 },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 56, md: 64 },
                      height: { xs: 56, md: 64 },
                      borderRadius: "50%",
                      bgcolor: "#ECFDF5",
                      mx: "auto",
                      mb: { xs: 1.5, md: 2 },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AccessTimeIcon
                      sx={{
                        color: "#10B981",
                        fontSize: { xs: 28, md: 32 },
                      }}
                    />
                  </Box>
                  <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    fontWeight="bold"
                    gutterBottom
                  >
                    Patient has not joined yet
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: { xs: 3, md: 4 } }}
                  >
                    You are ready for the session. The secure room is open, and
                    we will notify you immediately once the patient connects.
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: "#F9FAFB",
                      borderRadius: 2,
                      p: { xs: 1.5, md: 2 },
                      mb: { xs: 2, md: 3 },
                      textAlign: "left",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: { xs: 1, md: 2 },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "#6B7280",
                        }}
                      >
                        <AccessTimeIcon fontSize="small" />
                        <Typography variant="body2">
                          Appointment Time
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="500">
                        10:00 AM
                      </Typography>
                    </Box>
                    <Divider sx={{ my: { xs: 1, md: 2 } }} />
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "#6B7280",
                        }}
                      >
                        <ReasonIcon fontSize="small" />
                        <Typography variant="body2">Reason</Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="500">
                        {session?.reason || "Follow-up"}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    startIcon={<NotificationsIcon fontSize="small" />}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      color: "#059669",
                      textTransform: "none",
                      mb: { xs: 3, md: 4 },
                      fontSize: { xs: "0.75rem", md: "0.875rem" },
                    }}
                  >
                    Send reminder
                  </Button>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5,
                    }}
                  >
                    <LockIcon fontSize="small" /> End-to-end encrypted session
                  </Typography>
                </Paper>
              </Box>
            )}

            {(sessionStatus === "active" || sessionStatus === "ended") && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  minHeight: 0,
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 1.5, md: 2 },
                    pb: { xs: 10, md: 2 },
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 2, md: 4 },
                  }}
                >
                  <Box sx={{ textAlign: "center", my: { xs: 1, md: 2 } }}>
                    <Chip
                      label={
                        sessionStatus === "active"
                          ? "Secure connection established"
                          : "Session started"
                      }
                      size="small"
                      sx={{
                        bgcolor: "#F3F4F6",
                        color: "#6B7280",
                        height: 24,
                        fontSize: { xs: "0.65rem", md: "0.75rem" },
                      }}
                    />
                  </Box>

                  {messages.length === 0 && (
                    <Box sx={{ textAlign: "center", mt: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No messages yet. Start the conversation.
                      </Typography>
                    </Box>
                  )}

                  {messages.map((msg) => {
                    const isDoctor = msg.senderType === "doctor";
                    const messageText =
                      msg.text || msg.content || msg.body || "";

                    return (
                      <Box
                        key={msg.id || msg.timestamp || Math.random()}
                        sx={{
                          display: "flex",
                          justifyContent: isDoctor ? "flex-end" : "flex-start",
                          flexDirection: "column",
                          alignItems: isDoctor ? "flex-end" : "flex-start",
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: { xs: 1.5, md: 2 },
                            bgcolor: isDoctor ? "primary.main" : "white",
                            color: isDoctor ? "white" : "inherit",
                            border: isDoctor ? "none" : "1px solid #E5E7EB",
                            maxWidth: { xs: "85%", md: "60%" },
                            borderRadius: isDoctor
                              ? "12px 12px 0 12px"
                              : "12px 12px 12px 0",
                            boxShadow: "none",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}
                          >
                            {messageText}
                          </Typography>
                        </Paper>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            mt: 0.5,
                            color: "text.secondary",
                          }}
                        >
                          {formatMessageTime(msg.timestamp)}
                        </Typography>
                      </Box>
                    );
                  })}

                  <div ref={chatEndRef} />

                  {sessionStatus === "ended" && (
                    <Box sx={{ textAlign: "center", my: { xs: 1, md: 2 } }}>
                      <Typography variant="caption" color="text.secondary">
                        Session ended by Doctor
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box
                  sx={{
                    position: { xs: "fixed", md: "relative" },
                    bottom: { xs: 0, md: "auto" },
                    left: { xs: 0, md: "auto" },
                    right: { xs: 0, md: "auto" },
                    px: { xs: 2, md: 4 },
                    py: { xs: 2, md: 3 },
                    bgcolor: "white",
                    borderTop: "1px solid #E5E7EB",
                    zIndex: 1000,
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  {sessionStatus === "active" ? (
                    <TextField
                      fullWidth
                      placeholder="Type your message..."
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage();
                        }
                      }}
                      disabled={sendingMessage}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: { xs: 2, md: 3 },
                          bgcolor: "#F9FAFB",
                          "& fieldset": { border: "none" },
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconButton size={isMobile ? "small" : "medium"}>
                              <AttachFileIcon sx={{ color: "primary.main" }} />
                            </IconButton>
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size={isMobile ? "small" : "medium"}
                              onClick={handleSendMessage}
                              disabled={sendingMessage || !messageInput.trim()}
                              sx={{ color: "primary.main" }}
                            >
                              {sendingMessage ? (
                                <CircularProgress size={20} />
                              ) : (
                                <SendIcon
                                  fontSize={isMobile ? "small" : "medium"}
                                />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  ) : (
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 1.5, md: 2 },
                        bgcolor: "#F9FAFB",
                        borderRadius: { xs: 2, md: 3 },
                        display: "flex",
                        alignItems: { xs: "flex-start", md: "center" },
                        justifyContent: "space-between",
                        flexDirection: { xs: "column", md: "row" },
                        gap: { xs: 2, md: 0 },
                        border: "1px solid #E5E7EB",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: { xs: 1.5, md: 2 },
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: 36, md: 40 },
                            height: { xs: 36, md: 40 },
                            borderRadius: "50%",
                            bgcolor: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #E5E7EB",
                            flexShrink: 0,
                          }}
                        >
                          <LockIcon
                            sx={{
                              color: "#9CA3AF",
                              fontSize: { xs: 18, md: 20 },
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
                          >
                            Chat is Read-Only
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: { xs: "none", sm: "block" } }}
                          >
                            This consultation session has officially ended.
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        size={isMobile ? "small" : "medium"}
                        onClick={handleBackToDashboard}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          color: "#059669",
                          borderColor: "#D1FAE5",
                          fontSize: { xs: "0.75rem", md: "0.875rem" },
                          width: { xs: "100%", md: "auto" },
                          justifyContent: { xs: "center", md: "flex-start" },
                        }}
                      >
                        Back to Dashboard
                      </Button>
                    </Paper>
                  )}
                </Box>
              </Box>
            )}

            {sessionStatus === "waiting" && (
              <Box
                sx={{
                  position: { xs: "fixed", md: "relative" },
                  bottom: { xs: 0, md: "auto" },
                  left: 0,
                  right: 0,
                  bgcolor: "white",
                  p: { xs: 2, md: 3 },
                  mt: { md: 2 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  zIndex: 1000,
                  borderTop: { xs: "1px solid #E5E7EB", md: "none" },
                }}
              >
                <TextField
                  fullWidth
                  disabled
                  placeholder="Chat will be enabled once the patient joins..."
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: { xs: 2, md: 3 },
                      bgcolor: "#F9FAFB",
                      "& fieldset": { border: "none" },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          size={isMobile ? "small" : "medium"}
                          disabled
                        >
                          <AttachFileIcon sx={{ color: "#9CA3AF" }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size={isMobile ? "small" : "medium"}
                          disabled
                        >
                          <SendIcon sx={{ color: "#10B981" }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Chip
                  icon={
                    <InfoOutlineIcon
                      sx={{
                        color: "#F59E0B",
                        fontSize: { xs: 16, md: 18 },
                        mr: { xs: 1, md: 2 },
                      }}
                    />
                  }
                  label="Waiting for patient to join the room to enable chat."
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    mt: { xs: 1.5, md: 2 },
                    bgcolor: "#FFF7ED",
                    color: "#C2410C",
                    fontWeight: 500,
                    fontSize: { xs: "0.7rem", md: "14px" },
                    px: { xs: 1.5, md: 2 },
                    py: { xs: 1, md: 1.5 },
                    borderRadius: "50px",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                    width: { xs: "100%", md: "auto" },
                    justifyContent: { xs: "flex-start", md: "center" },
                  }}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
      <GlobalSnackbar snackbar={snackbar} onClose={hideSnackbar} />
    </>
  );
};

export default Message;
