// components/AppointmentScheduleTable.jsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  Stack,
  Avatar,
  CircularProgress,
  Alert,
  IconButton,
  Card,
  CardContent,
  Divider,
  Fade,
  Container,
} from "@mui/material";
import { Pagination, Stack as MuiStack } from "@mui/material";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import EventIcon from "@mui/icons-material/Event";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTheme, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
// ==================== Responsive Config ====================
const getResponsiveValues = (theme) => ({
  isXs: useMediaQuery(theme.breakpoints.down("xs")),
  isSm: useMediaQuery(theme.breakpoints.down("sm")),
  isMd: useMediaQuery(theme.breakpoints.down("md")),
  isTablet: useMediaQuery(theme.breakpoints.between("sm", "md")),
});

// ==================== Helpers ====================

// Format date and time
const formatAppointmentTime = (dateStr, timeStr) => {
  try {
    const date = new Date(dateStr);
    const [hours, minutes] = timeStr.split(":");
    date.setHours(parseInt(hours), parseInt(minutes));

    return {
      date: format(date, "EEEE, MMMM dd, yyyy", { locale: enUS }),
      time: format(date, "hh:mm a", { locale: enUS }),
      shortDate: format(date, "MM/dd/yyyy"),
    };
  } catch (error) {
    return { date: dateStr, time: timeStr, shortDate: dateStr };
  }
};

// Status Chip configuration with primary colors
const getStatusConfig = (status) => {
  const configs = {
    completed: {
      label: "Completed",
      icon: <CheckCircleIcon fontSize="small" />,
      bg: "linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%)",
      text: "#6B7280",
      border: "#6B7280",
    },
    inprogress: {
      label: "In Progress",
      icon: <HourglassEmptyIcon fontSize="small" />,
      bg: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)",
      text: "#10B981",
      border: "#10B981",
    },
    cancelled: {
      label: "Cancelled",
      icon: <CancelIcon fontSize="small" />,
      bg: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
      text: "#EF4444",
      border: "#EF4444",
    },
    scheduled: {
      label: "Scheduled",
      icon: <EventIcon fontSize="small" />,
      bg: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)",
      text: "#3B82F6",
      border: "#3B82F6",
    },
    confirmed: {
      label: "Confirmed",
      icon: <CheckCircleIcon fontSize="small" />,
      bg: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
      text: "#F59E0B",
      border: "#F59E0B",
    },
  };
  return configs[status?.toLowerCase()] || configs.scheduled;
};

// Appointment type configuration with primary colors
const getAppointmentTypeConfig = (type) => {
  return type === "video"
    ? {
        icon: <VideoCallIcon fontSize="small" />,
        label: "Video Call",
        color: "#52AC8C",
        bg: "rgba(82, 172, 140, 0.1)",
      }
    : {
        icon: <PhoneIcon fontSize="small" />,
        label: "Voice Call",
        color: "#3B82F6",
        bg: "rgba(59, 130, 246, 0.1)",
      };
};

// Patient Avatar with fallback
const PatientAvatar = ({ patient, size = "md" }) => {
  const hasValidImage =
    patient?.image &&
    !patient.image.includes("Default") &&
    !patient.image.startsWith("//");

  const sizeMap = {
    sm: { xs: 36, sm: 40, md: 44 },
    md: { xs: 40, sm: 48, md: 56 },
    lg: { xs: 48, sm: 56, md: 64 },
  };

  const size_value = sizeMap[size];

  return (
    <Avatar
      src={hasValidImage ? patient.image.trim() : undefined}
      sx={{
        width: size_value,
        height: size_value,
        bgcolor: hasValidImage ? "transparent" : "primary.main",
        border: "3px solid",
        borderColor: "primary.main",
        boxShadow: "0 4px 12px rgba(82, 172, 140, 0.3)",
        flexShrink: 0,
      }}
    >
      {!hasValidImage && patient?.name?.charAt(0).toUpperCase()}
    </Avatar>
  );
};

// ==================== Timeline Row Component ====================
const TimelineAppointmentRow = ({ appointment, isFirst, isLast, isMobile }) => {
  const {
    patient,
    status,
    reason,
    appointmentType,
    appointmentDate,
    appointmentTime,
  } = appointment;

  const { date, time, shortDate } = formatAppointmentTime(
    appointmentDate,
    appointmentTime
  );
  const statusConfig = getStatusConfig(status);
  const typeConfig = getAppointmentTypeConfig(appointmentType);

  if (isMobile) {
    return (
      <Box
        sx={{
          border: "1px solid rgba(82, 172, 140, 0.2)",
          borderRadius: "6px",
          p: "8px",
          mb: "6px",
          boxShadow: "0 2px 8px rgba(82, 172, 140, 0.08)",
          transition: "all 0.3s ease",
          "&:active": {
            boxShadow: "0 4px 12px rgba(82, 172, 140, 0.15)",
            transform: "translateY(-2px)",
          },
          backgroundColor: "background.paper",
          width: "100%",
        }}
      >
        <Stack spacing="4px">
          {/* Time */}
          <Stack direction="row" spacing={0.25} alignItems="center">
            <AccessTimeIcon
              sx={{
                fontSize: 12,
                color: "primary.main",
                flexShrink: 0,
              }}
            />
            <Typography
              fontWeight="700"
              color="primary.main"
              sx={{
                fontSize: "0.6rem",
                whiteSpace: "nowrap",
                lineHeight: 1,
              }}
            >
              {time}
            </Typography>
          </Stack>

          {/* Patient */}
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar
              src={patient?.image}
              sx={{
                width: 28,
                height: 28,
                flexShrink: 0,
                bgcolor: "primary.main",
                fontSize: "0.7rem",
                fontWeight: 700,
              }}
            >
              {patient?.name?.charAt(0)}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
              <Typography
                fontWeight="700"
                sx={{
                  fontSize: "0.7rem",
                  lineHeight: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {patient?.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: "0.6rem",
                  mt: "1px",
                  lineHeight: 1,
                }}
              >
                {shortDate}
              </Typography>
            </Box>
          </Stack>

          {/* Status */}
          <Chip
            icon={statusConfig.icon}
            label={statusConfig.label}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 1,
              background: statusConfig.bg,
              color: statusConfig.text,
              border: `1px solid ${statusConfig.border}`,
              width: "fit-content",
              fontWeight: 700,
              fontSize: "0.6rem",
              height: "20px",
              px: "4px",
              "& .MuiChip-icon": {
                fontSize: "10px",
                color: statusConfig.text,
              },
              "& .MuiChip-label": {
                px: "4px",
              },
            }}
          />

          {/* Type */}
          <Stack direction="row" spacing={0.25} alignItems="center">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: typeConfig.color,
                fontSize: "0.65rem",
                flexShrink: 0,
              }}
            >
              {typeConfig.icon}
            </Box>
            <Typography
              fontWeight="600"
              sx={{
                fontSize: "0.65rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: 1,
              }}
            >
              {typeConfig.label}
            </Typography>
          </Stack>

          {/* Reason */}
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.6rem",
              color: "text.secondary",
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            {reason || "No reason"}
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <TableRow
      sx={{
        position: "relative",
        "&:hover": {
          backgroundColor: "rgba(82, 172, 140, 0.03)",
          "& .timeline-dot": {
            transform: "scale(1.15)",
          },
          "& .appointment-card": {
            transform: "translateX(3px)",
            boxShadow: "0 6px 20px rgba(82, 172, 140, 0.15)",
          },
        },
        transition: "all 0.3s ease",
      }}
    >
      {/* Timeline Column with Time */}
      <TableCell
        sx={{
          width: { xs: "60px", sm: "110px", md: "160px", lg: "180px" },
          verticalAlign: "top",
          pt: { xs: 1, sm: 2, md: 2.5, lg: 3 },
          pb: { xs: 1, sm: 2, md: 2.5, lg: 3 },
          borderBottom: isLast ? "none" : "1px solid rgba(82, 172, 140, 0.1)",
          position: "relative",
          px: { xs: 0.5, sm: 1, md: 1.5, lg: 2 },
        }}
      >
        <Stack
          alignItems="flex-end"
          spacing={0.25}
          mr={{ xs: 0.5, sm: 1, md: 1.5, lg: 2 }}
        >
          <Typography
            variant="h6"
            fontWeight="700"
            color="primary.main"
            sx={{
              lineHeight: 1,
              fontSize: {
                xs: "0.75rem",
                sm: "0.95rem",
                md: "1.1rem",
                lg: "1.25rem",
              },
              whiteSpace: "nowrap",
            }}
          >
            {time}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight="500"
            sx={{
              fontSize: {
                xs: "0.6rem",
                sm: "0.7rem",
                md: "0.75rem",
                lg: "0.8rem",
              },
              whiteSpace: "nowrap",
            }}
          >
            {shortDate}
          </Typography>
        </Stack>

        {/* Timeline Dot */}
        <Box
          className="timeline-dot"
          sx={{
            position: "absolute",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
            border: "3px solid white",
            boxShadow: "0 0 0 2px rgba(82, 172, 140, 0.3)",
            zIndex: 2,
            transition: "transform 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: { xs: 10, sm: 16, md: 20, lg: 24 },
            height: { xs: 10, sm: 16, md: 20, lg: 24 },
            right: { xs: -5, sm: -8, md: -10, lg: -12 },
            top: { xs: 12, sm: 18, md: 22, lg: 24 },
          }}
        >
          <AccessTimeIcon
            sx={{
              fontSize: { xs: 4, sm: 8, md: 10, lg: 12 },
              color: "white",
            }}
          />
        </Box>

        {/* Timeline Line */}
        {!isLast && (
          <Box
            sx={{
              position: "absolute",
              right: -1,
              top: { xs: 24, sm: 40, md: 48, lg: 48 },
              bottom: 0,
              width: 2,
              background:
                "linear-gradient(180deg, rgba(82, 172, 140, 0.3) 0%, rgba(82, 172, 140, 0.1) 100%)",
              zIndex: 1,
            }}
          />
        )}
      </TableCell>

      {/* Appointment Details Column */}
      <TableCell
        sx={{
          verticalAlign: "top",
          pt: { xs: 0.75, sm: 1.5, md: 2, lg: 2 },
          pb: { xs: 0.75, sm: 1.5, md: 2.5, lg: 3 },
          borderBottom: isLast ? "none" : "1px solid rgba(82, 172, 140, 0.1)",
          px: { xs: 0.5, sm: 1, md: 1.5, lg: 2 },
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Card
          className="appointment-card"
          sx={{
            borderRadius: { xs: "8px", sm: "12px", md: "14px", lg: "16px" },
            border: "1px solid rgba(82, 172, 140, 0.15)",
            boxShadow: "0 2px 10px rgba(82, 172, 140, 0.1)",
            transition: "all 0.3s ease",
            overflow: "hidden",
            position: "relative",
            backgroundColor: "background.paper",
            width: "100%",
          }}
        >
          <CardContent
            sx={{
              p: { xs: "10px", sm: "12px", md: "16px", lg: "20px" },
              "&:last-child": {
                pb: { xs: "10px", sm: "12px", md: "16px", lg: "20px" },
              },
            }}
          >
            {/* Patient Info & Status */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "flex-start" }}
              mb={{ xs: "8px", sm: "10px", md: "12px", lg: "16px" }}
              spacing={{ xs: "8px", sm: "8px", md: "12px" }}
            >
              <Stack
                direction="row"
                spacing={{ xs: "6px", sm: "8px", md: "10px", lg: "12px" }}
                alignItems="center"
                flex={1}
                minWidth={0}
              >
                <PatientAvatar patient={patient} size="sm" />
                <Box sx={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    color="primary.main"
                    sx={{
                      fontSize: {
                        xs: "0.75rem",
                        sm: "0.85rem",
                        md: "0.95rem",
                        lg: "1rem",
                      },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      lineHeight: 1.2,
                    }}
                  >
                    {patient?.name || "Unknown Patient"}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={{ xs: "3px", sm: "4px" }}
                    alignItems="center"
                    mt="2px"
                    flexWrap="wrap"
                    useFlexGap
                  >
                    <Chip
                      label={`ID: ${patient?.id?.slice(-4)}`}
                      size="small"
                      sx={{
                        height: { xs: 16, sm: 18, md: 20 },
                        fontSize: {
                          xs: "7px",
                          sm: "8px",
                          md: "9px",
                          lg: "10px",
                        },
                        fontWeight: 600,
                        bgcolor: "rgba(82, 172, 140, 0.1)",
                        color: "primary.main",
                        "& .MuiChip-label": {
                          px: "4px",
                        },
                      }}
                    />
                    {patient?.age && (
                      <Chip
                        label={`${patient.age}y`}
                        size="small"
                        sx={{
                          height: { xs: 16, sm: 18, md: 20 },
                          fontSize: {
                            xs: "7px",
                            sm: "8px",
                            md: "9px",
                            lg: "10px",
                          },
                          fontWeight: 600,
                          "& .MuiChip-label": {
                            px: "4px",
                          },
                        }}
                      />
                    )}
                    {patient?.gender && (
                      <Chip
                        label={patient.gender}
                        size="small"
                        sx={{
                          height: { xs: 16, sm: 18, md: 20 },
                          fontSize: {
                            xs: "7px",
                            sm: "8px",
                            md: "9px",
                            lg: "10px",
                          },
                          fontWeight: 600,
                          textTransform: "capitalize",
                          "& .MuiChip-label": {
                            px: "4px",
                          },
                        }}
                      />
                    )}
                  </Stack>
                </Box>
              </Stack>

              {/* Status Badge */}
              <Chip
                icon={statusConfig.icon}
                label={statusConfig.label}
                sx={{
                  background: statusConfig.bg,
                  color: statusConfig.text,
                  gap: 1,
                  fontWeight: 700,
                  fontSize: { xs: "7px", sm: "9px", md: "10px", lg: "11px" },
                  height: { xs: "22px", sm: "24px", md: "28px", lg: "30px" },
                  border: `1px solid ${statusConfig.border}`,
                  "& .MuiChip-icon": {
                    color: statusConfig.text,
                    fontSize: {
                      xs: "10px",
                      sm: "12px",
                      md: "14px",
                      lg: "16px",
                    },
                  },
                  "& .MuiChip-label": {
                    px: "4px",
                  },
                  flexShrink: 0,
                  alignSelf: { xs: "flex-start", sm: "flex-start" },
                }}
              />
            </Stack>

            <Divider
              sx={{ my: { xs: "6px", sm: "8px", md: "10px", lg: "12px" } }}
            />

            {/* Appointment Details */}
            <Stack spacing={{ xs: "6px", sm: "8px", md: "10px", lg: "12px" }}>
              <Stack
                direction="row"
                spacing={{ xs: "6px", sm: "8px" }}
                alignItems="center"
              >
                <Box
                  sx={{
                    width: { xs: 20, sm: 24, md: 28, lg: 32 },
                    height: { xs: 20, sm: 24, md: 28, lg: 32 },
                    borderRadius: "6px",
                    bgcolor: typeConfig.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Box
                    sx={{
                      fontSize: {
                        xs: "10px",
                        sm: "12px",
                        md: "14px",
                        lg: "16px",
                      },
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {typeConfig.icon}
                  </Box>
                </Box>
                <Box sx={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="500"
                    sx={{
                      fontSize: {
                        xs: "0.6rem",
                        sm: "0.65rem",
                        md: "0.7rem",
                        lg: "0.75rem",
                      },
                    }}
                  >
                    Type
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    color={typeConfig.color}
                    sx={{
                      fontSize: {
                        xs: "0.7rem",
                        sm: "0.75rem",
                        md: "0.8rem",
                        lg: "0.85rem",
                      },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {typeConfig.label}
                  </Typography>
                </Box>
              </Stack>

              <Stack
                direction="row"
                spacing={{ xs: "6px", sm: "8px" }}
                alignItems="flex-start"
              >
                <Box
                  sx={{
                    width: { xs: 20, sm: 24, md: 28, lg: 32 },
                    height: { xs: 20, sm: 24, md: 28, lg: 32 },
                    borderRadius: "6px",
                    bgcolor: "rgba(82, 172, 140, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <EventIcon
                    sx={{
                      fontSize: { xs: 10, sm: 12, md: 14, lg: 16 },
                      color: "primary.main",
                    }}
                  />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="500"
                    sx={{
                      fontSize: {
                        xs: "0.6rem",
                        sm: "0.65rem",
                        md: "0.7rem",
                        lg: "0.75rem",
                      },
                    }}
                  >
                    Reason
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      fontSize: {
                        xs: "0.65rem",
                        sm: "0.7rem",
                        md: "0.75rem",
                        lg: "0.8rem",
                      },
                      lineHeight: 1.2,
                    }}
                  >
                    {reason || "No reason"}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </TableCell>
    </TableRow>
  );
};

// ==================== Main Component ====================
const AppointmentScheduleTable = ({
  appointments = [],
  loading = false,
  error = null,
  onRefresh,
  setPage,
  page,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data } = useSelector((state) => state.schedule);
  const totalPages = data?.data?.pagination?.totalPages || 1;
  // Group appointments by date
  const groupedAppointments =
    appointments?.reduce((acc, apt) => {
      const dateKey = apt.appointmentDate.split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(apt);
      return acc;
    }, {}) || {};

  const sortedDates = Object.keys(groupedAppointments).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  // Loading state
  if (loading) {
    return (
      <Card
        sx={{
          borderRadius: { xs: "16px", sm: "18px", md: "20px" },
          boxShadow: "0 4px 20px rgba(82, 172, 140, 0.12)",
          border: "1px solid rgba(82, 172, 140, 0.15)",
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: { xs: 4, sm: 5, md: 6, lg: 8 },
          }}
        >
          <CircularProgress sx={{ color: "primary.main" }} />
        </Box>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          mb: 3,
          borderRadius: { xs: "12px", sm: "14px", md: "16px" },
          border: "2px solid #f44336",
          boxShadow: "0 4px 20px rgba(244, 67, 54, 0.15)",
          fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
        }}
        action={
          <IconButton color="inherit" size="small" onClick={onRefresh}>
            <RefreshIcon />
          </IconButton>
        }
      >
        {error}
      </Alert>
    );
  }

  // Empty state
  if (!appointments?.length) {
    return (
      <Card
        sx={{
          borderRadius: { xs: "16px", sm: "18px", md: "20px" },
          boxShadow: "0 4px 20px rgba(82, 172, 140, 0.12)",
          border: "1px solid rgba(82, 172, 140, 0.15)",
          mb: 3,
          p: { xs: 3, sm: 4, md: 5, lg: 6 },
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: { xs: 60, sm: 70, md: 80, lg: 100 },
            height: { xs: 60, sm: 70, md: 80, lg: 100 },
            borderRadius: "50%",
            background: "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            opacity: 0.85,
          }}
        >
          <EventIcon
            sx={{
              fontSize: { xs: 28, sm: 32, md: 40, lg: 50 },
              color: "white",
            }}
          />
        </Box>
        <Typography
          variant="h6"
          fontWeight="700"
          color="primary.main"
          mb={1}
          sx={{
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem", lg: "1.4rem" },
          }}
        >
          No Appointments Today
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem", lg: "1rem" },
          }}
        >
          Patient appointments will appear here once scheduled
        </Typography>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        borderRadius: { xs: "12px", sm: "18px", md: "20px" },
        boxShadow: "0 4px 20px rgba(82, 172, 140, 0.12)",
        border: "1px solid rgba(82, 172, 140, 0.15)",
        mb: 3,
        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{ p: { xs: "12px", sm: "16px", md: "20px", lg: "24px" } }}
      >
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          mb={{ xs: "16px", sm: "20px", md: "24px", lg: "28px" }}
          spacing={{ xs: "10px", sm: "12px" }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: "8px", sm: "12px", md: "16px" }}
          >
            <Box
              sx={{
                width: { xs: 32, sm: 40, md: 44, lg: 48 },
                height: { xs: 32, sm: 40, md: 44, lg: 48 },
                borderRadius: "10px",
                background: "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <EventIcon
                sx={{
                  fontSize: { xs: 16, sm: 20, md: 22, lg: 24 },
                  color: "white",
                }}
              />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="h5"
                fontWeight="700"
                color="primary.main"
                sx={{
                  fontSize: {
                    xs: "0.9rem",
                    sm: "1rem",
                    md: "1.1rem",
                    lg: "1.25rem",
                  },
                  lineHeight: 1.1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Daily Schedule
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="500"
                sx={{
                  fontSize: {
                    xs: "0.65rem",
                    sm: "0.75rem",
                    md: "0.8rem",
                    lg: "0.85rem",
                  },
                  mt: "2px",
                }}
              >
                Today's appointments
              </Typography>
            </Box>
          </Stack>
          {onRefresh && (
            <IconButton
              onClick={onRefresh}
              sx={{
                background: "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                color: "white",
                width: { xs: 36, sm: 40, md: 44 },
                height: { xs: 36, sm: 40, md: 44 },
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #3D8B6F 0%, #2E7A5F 100%)",
                },
                flexShrink: 0,
                fontSize: { xs: "16px", sm: "20px" },
              }}
            >
              <RefreshIcon fontSize="inherit" />
            </IconButton>
          )}
        </Stack>

        {/* Timeline Display */}
        <Stack spacing={{ xs: "16px", sm: "20px", md: "24px", lg: "28px" }}>
          {sortedDates.map((dateKey, dateIndex) => {
            const { date: formattedDate } = formatAppointmentTime(
              dateKey,
              "00:00:00"
            );
            const dayAppointments = groupedAppointments[dateKey];

            return (
              <Fade in timeout={300 * (dateIndex + 1)} key={dateKey}>
                <Box sx={{ overflow: "hidden" }}>
                  {/* Date Header */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={{ xs: "8px", sm: "10px", md: "12px" }}
                    sx={{
                      mb: { xs: "10px", sm: "12px", md: "16px", lg: "18px" },
                      pb: { xs: "8px", sm: "10px", md: "12px", lg: "14px" },
                      borderBottom: "2px solid rgba(82, 172, 140, 0.15)",
                      flexWrap: "wrap",
                      useFlexGap: true,
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 32, sm: 34, md: 36, lg: 40 },
                        height: { xs: 32, sm: 34, md: 36, lg: 40 },
                        borderRadius: "8px",
                        background:
                          "linear-gradient(135deg, rgba(82, 172, 140, 0.15) 0%, rgba(82, 172, 140, 0.08) 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <EventIcon
                        sx={{
                          fontSize: { xs: 16, sm: 18, md: 20, lg: 22 },
                          color: "primary.main",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight="700"
                      color="primary.main"
                      sx={{
                        fontSize: {
                          xs: "0.55rem",
                          sm: "0.95rem",
                          md: "1rem",
                          lg: "1.1rem",
                        },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {formattedDate}
                    </Typography>
                    <Chip
                      label={`${dayAppointments.length}`}
                      size="small"
                      sx={{
                        background:
                          "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                        color: "white",
                        fontWeight: 700,
                        fontSize: { xs: "9px", sm: "10px", md: "11px" },
                        height: { xs: 20, sm: 22, md: 24 },
                        "& .MuiChip-label": {
                          px: "6px",
                        },
                      }}
                    />
                  </Stack>
                  {/* ===== Mobile View ===== */}
                  {isMobile && (
                    <Box sx={{ mt: { xs: "8px", sm: "10px" } }}>
                      {dayAppointments.map((appointment, index) => (
                        <TimelineAppointmentRow
                          key={appointment.id}
                          appointment={appointment}
                          isFirst={index === 0}
                          isLast={index === dayAppointments.length - 1}
                          isMobile={true}
                        />
                      ))}
                    </Box>
                  )}
                  {/* Timeline Table */}
                  {!isMobile && (
                    <TableContainer
                      sx={{
                        borderRadius: { xs: "10px", sm: "12px", md: "14px" },
                        border: "1px solid rgba(82, 172, 140, 0.12)",
                        overflow: "hidden",
                      }}
                    >
                      <Table>
                        <TableBody>
                          {dayAppointments
                            .sort((a, b) =>
                              a.appointmentTime.localeCompare(b.appointmentTime)
                            )
                            .map((appointment, index) => (
                              <TimelineAppointmentRow
                                key={appointment.id}
                                appointment={appointment}
                                isFirst={index === 0}
                                isLast={index === dayAppointments.length - 1}
                                isMobile={isMobile}
                              />
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              </Fade>
            );
          })}
        </Stack>
      </CardContent>
      {/* ================= Pagination ================= */}
      {totalPages > 1 && (
        <Box
          sx={{
       
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => {
              setPage(value);
            }}
            shape="rounded"
            color="white"
            siblingCount={1}
            boundaryCount={1}
            sx={{
              color: "white",
              mb:2,
              "& .MuiPaginationItem-root": {
                fontWeight: 600,
              },
              "& .Mui-selected": {
                background:
                  "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%) !important",
                color: "#fff",
              },
            }}
          />
        </Box>
      )}
    </Card>
  );
};

export default AppointmentScheduleTable;
