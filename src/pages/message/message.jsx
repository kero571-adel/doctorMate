import React, { useState, useEffect } from "react";
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
  Grid,
  InputAdornment,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  Info as InfoIcon,
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
} from "@mui/icons-material";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";

const Message = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [sessionState, setSessionState] = useState("active");

  const handleNextStage = () => {
    if (sessionState === "waiting") setSessionState("active");
    else if (sessionState === "active") setSessionState("ended");
    else setSessionState("waiting");
  };

  // 🔹 Responsive Styles Helper
  const responsiveStyles = {
    container: {
      minHeight: "100vh",
      bgcolor: "#F9FAFB",
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      display: "flex",
      flexDirection: "column",
    },
    header: {
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
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      gap: { xs: 1.5, md: 2 },
      width: "100%",
    },
    avatarContainer: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: { xs: 48, md: 56 },
      height: { xs: 48, md: 56 },
      borderRadius: "50%",
      p: { xs: 0.5, md: 1 },
    },
    avatar: {
      width: { xs: 50, md: 58 },
      height: { xs: 50, md: 58 },
    },
    statusDot: {
      position: "absolute",
      bottom: { xs: 1, md: 2 },
      right: { xs: 1, md: 2 },
      width: { xs: 10, md: 12 },
      height: { xs: 10, md: 12 },
      bgcolor:
        sessionState === "active"
          ? "#10B981"
          : sessionState === "waiting"
          ? "#FBBF24"
          : "#6B7280",
      borderRadius: "50%",
      border: "2px solid white",
    },
    headerActions: {
      display: "flex",
      alignItems: "center",
      gap: { xs: 1, md: 2 },
      width: { xs: "100%", md: "auto" },
      justifyContent: { xs: "space-between", md: "flex-end" },
      flexWrap: "wrap",
    },
    contentContainer: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      px: { xs: 2, sm: 3, md: 4 },
      py: { xs: 2, md: 4 },
      pb: { xs: 0, md: 0 },
      overflow: "hidden",
    },
    waitingCard: {
      p: { xs: 3, md: 5 },
      width: "100%",
      maxWidth: { xs: "100%", sm: 450, md: 500 },
      mx: "auto",
      textAlign: "center",
      border: "1px solid #F3F4F6",
      mt: { xs: 4, md: 8 },
    },
    chatContainer: {
      flex: 1,
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: { xs: 1.5, md: 2 },
      pb: { xs: 10, md: 2 }, // Space for fixed input on mobile
    },
    messageBubble: {
      patient: {
        p: { xs: 1.5, md: 2 },
        bgcolor: "white",
        border: "1px solid #E5E7EB",
        maxWidth: { xs: "85%", md: "60%" },
        borderRadius: "12px 12px 12px 0",
        boxShadow: "none",
      },
      doctor: {
        p: { xs: 1.5, md: 2 },
        bgcolor: "primary.main",
        color: "white",
        borderRadius: "12px 12px 0 12px",
        maxWidth: { xs: "85%", md: "60%" },
        boxShadow: "none",
      },
    },
    inputArea: {
      position: { xs: "fixed", md: "relative" },
      bottom: { xs: 0, md: "auto" },
      left: { xs: 0, md: "auto" },
      right: { xs: 0, md: "auto" },
      px: { xs: 2, md: 4 },
      py: { xs: 2, md: 3 },
      bgcolor: "white",
      borderTop: "1px solid #E5E7EB",
      zIndex: 1000,
      width: "100%", // ← 100% على كل الشاشات
      boxSizing: "border-box", // ← عشان الـ padding مايؤثرش على العرض
    },
    textField: {
      "& .MuiOutlinedInput-root": {
        borderRadius: { xs: 2, md: 3 },
        bgcolor: "#F9FAFB",
        "& fieldset": { border: "none" },
      },
    },
    readOnlyBanner: {
      p: { xs: 1.5, md: 2 },
      bgcolor: "#F9FAFB",
      borderRadius: { xs: 2, md: 3 },
      display: "flex",
      alignItems: { xs: "flex-start", md: "center" },
      justifyContent: "space-between",
      flexDirection: { xs: "column", md: "row" },
      gap: { xs: 2, md: 0 },
      border: "1px solid #E5E7EB",
    },
    waitingInput: {
      "& .MuiOutlinedInput-root": {
        borderRadius: { xs: 2, md: 3 },
        bgcolor: "#F9FAFB",
        "& fieldset": { border: "none" },
      },
    },
  };

  return (
    <Box sx={responsiveStyles.container}>
      {/* 🔹 Debug Control Bar (Hide on mobile for cleaner UX) */}
      {!isSmallMobile && (
        <Box
          sx={{
            p: { xs: 1, md: 2 },
            textAlign: "center",
            bgcolor: "#eee",
            position: "sticky",
            top: 0,
            zIndex: 1200,
            display: { xs: "none", md: "block" },
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
            Current Stage: <strong>{sessionState.toUpperCase()}</strong>
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={handleNextStage}
            sx={{ bgcolor: "primary.main" }}
          >
            Switch Stage (Waiting → Active → Ended)
          </Button>
        </Box>
      )}

      {/* 🔹 Header - Responsive */}
      <Box sx={responsiveStyles.header}>
        <Box sx={responsiveStyles.userInfo}>
          <Box sx={responsiveStyles.avatarContainer}>
            <Avatar
              src="https://i.pravatar.cc/150?img=5"
              sx={responsiveStyles.avatar}
            />
            <Box sx={responsiveStyles.statusDot} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              fontWeight="bold"
              noWrap
            >
              Mia Hamm
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
              {sessionState === "waiting" && (
                <>
                  <span>General Consultation</span>
                  <span>•</span>
                </>
              )}
              {(sessionState === "active" || sessionState === "waiting") && (
                <span>10:00 AM - 10:30 AM</span>
              )}
              {sessionState === "ended" && (
                <>
                  <span>Follow-up Consultation</span>
                  <span>•</span>
                  <span>Oct 24, 10:00 AM - 10:30 AM</span>
                </>
              )}
              {sessionState === "active" && (
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
            </Box>
          </Box>
        </Box>

        <Box sx={responsiveStyles.headerActions}>
          {sessionState === "waiting" && (
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

          {sessionState === "ended" && (
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

          {sessionState === "waiting" && (
            <IconButton size={isMobile ? "small" : "medium"}>
              <HistoryIcon
                sx={{ color: "#9CA3AF", fontSize: { xs: 20, md: 24 } }}
              />
            </IconButton>
          )}

          {sessionState === "active" && (
            <>
              <Button
                startIcon={
                  <MedicalRecordIcon fontSize={isMobile ? "small" : "medium"} />
                }
                size={isMobile ? "small" : "medium"}
                sx={{
                  color: "#4B5563",
                  textTransform: "none",
                  border: "1px solid #E5E7EB",
                  borderRadius: 1,
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                  px: { xs: 1, md: 2 },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  Medical Record
                </Typography>
              </Button>
              <Button
                startIcon={
                  <EndCallIcon fontSize={isMobile ? "small" : "medium"} />
                }
                size={isMobile ? "small" : "medium"}
                sx={{
                  bgcolor: "#FEF2F2",
                  color: "#DC2626",
                  textTransform: "none",
                  borderRadius: 1,
                  "&:hover": { bgcolor: "#FEE2E2" },
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                  px: { xs: 1, md: 2 },
                }}
                onClick={() => setSessionState("ended")}
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

          {sessionState === "ended" && (
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

      {/* 🔹 Main Content Area */}
      <Box sx={responsiveStyles.contentContainer}>
        {/* ================= PAGE 1: WAITING ROOM ================= */}
        {sessionState === "waiting" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Paper elevation={0} sx={responsiveStyles.waitingCard}>
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
                You are ready for the session. The secure room is open, and we
                will notify you immediately once Sarah Johnson connects.
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
                    <Typography variant="body2">Appointment Time</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="500">
                    10:00 AM
                  </Typography>
                </Box>
                <Divider sx={{ my: { xs: 1, md: 2 } }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
                    Follow-up
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

        {/* ================= PAGE 2 & 3: CHAT AREA ================= */}
        {(sessionState === "active" || sessionState === "ended") && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
            }}
          >
            {/* Chat Messages Area */}
            <Box sx={responsiveStyles.chatContainer}>
              {/* System Message */}
              <Box sx={{ textAlign: "center", my: { xs: 1, md: 2 } }}>
                <Chip
                  label={
                    sessionState === "active"
                      ? "Secure connection established at 10:00 AM"
                      : "Session started Oct 24, 10:00 AM"
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

              {/* Patient Message */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Paper
                  elevation={0}
                  sx={responsiveStyles.messageBubble.patient}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}
                  >
                    Hi Dr. Smith, thank you for taking the time. I've been
                    having this persistent headache for about 3 days now and
                    over-the-counter meds aren't helping much.
                  </Typography>
                </Paper>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.5 }}
                >
                  10:01 AM
                </Typography>
              </Box>

              {/* Doctor Message */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Paper elevation={0} sx={responsiveStyles.messageBubble.doctor}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}
                  >
                    I see. Have you noticed any sensitivity to light or nausea
                    accompanying these episodes?
                  </Typography>
                </Paper>
                <Typography
                  variant="caption"
                  sx={{ display: "block", mt: 0.5, color: alpha("#fff", 0.9) }}
                >
                  10:02 AM
                </Typography>
              </Box>

              {/* Additional Patient Message */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Paper
                  elevation={0}
                  sx={responsiveStyles.messageBubble.patient}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}
                  >
                    Yes, actually. The light sensitivity is pretty strong, and I
                    feel a bit nauseous in the mornings.
                  </Typography>
                </Paper>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.5 }}
                >
                  10:05 AM
                </Typography>
              </Box>

              {sessionState === "ended" && (
                <Box sx={{ textAlign: "center", my: { xs: 1, md: 2 } }}>
                  <Typography variant="caption" color="text.secondary">
                    Session ended by Dr. Smith • 10:15 AM
                  </Typography>
                </Box>
              )}
            </Box>

            {/* 🔹 Input Area - Fixed on Mobile */}
            <Box sx={responsiveStyles.inputArea}>
              {sessionState === "active" ? (
                <TextField
                  fullWidth
                  placeholder="Type your message..."
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={responsiveStyles.textField}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton size={isMobile ? "small" : "medium"}>
                          <AttachFileIcon sx={{ color: "#9CA3AF" }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size={isMobile ? "small" : "medium"}
                          sx={{ color: "#10B981" }}
                        >
                          <SendIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              ) : (
                // Read-Only State (Session Ended)
                <Paper elevation={0} sx={responsiveStyles.readOnlyBanner}>
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
                        sx={{ color: "#9CA3AF", fontSize: { xs: 18, md: 20 } }}
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
                        This consultation session has officially ended. You can
                        review the history above.
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      color: "#059669",
                      borderColor: "#D1FAE5",
                      fontSize: { xs: "0.75rem", md: "0.875rem" },
                      width: { xs: "100%", md: "auto" },
                      justifyContent: { xs: "center", md: "flex-start" },
                    }}
                    onClick={() => setSessionState("waiting")}
                  >
                    Back to Dashboard
                  </Button>
                </Paper>
              )}
            </Box>
          </Box>
        )}

        {/* 🔹 Waiting State - Disabled Input + Info Chip */}
        {sessionState === "waiting" && (
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
              placeholder="Chat will be enabled once the patient joins the session..."
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={responsiveStyles.waitingInput}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton size={isMobile ? "small" : "medium"} disabled>
                      <AttachFileIcon sx={{ color: "#9CA3AF" }} />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size={isMobile ? "small" : "medium"} disabled>
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
              label="Waiting for Sarah Johnson to join the room to enable chat."
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
                "& .MuiChip-icon": {
                  color: "#F59E0B",
                  ml: { xs: 0.5, md: 0.5 },
                },
                "& .MuiChip-label": {
                  px: { xs: 0.5, md: 1 },
                  py: { xs: 0.3, md: 0.5 },
                },
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                width: { xs: "100%", md: "auto" },
                justifyContent: { xs: "flex-start", md: "center" },
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Message;
