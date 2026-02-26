import {
  Box,
  Card,
  Typography,
  Button,
  Stack,
  Avatar,
  Grid,
  Chip,
  IconButton,
  Fade,
  CardContent,
  Skeleton,
  Alert,
  Pagination,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  AccessTime,
  VideoCall,
  ChatBubbleOutline,
  CalendarToday,
  EventAvailable,
  CheckCircle,
  HourglassEmpty,
  Cancel,
  MoreVert,
  Refresh,
  ArrowForward,
  Phone,
} from "@mui/icons-material";
import { setSelectedPatient } from "../../redux/schedule/schedule";
import NavBar from "../../components/navBar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appointmentsDoctor } from "../../redux/schedule/schedule";
import { useNavigate } from "react-router";
import { appointmentsStatus } from "../../redux/schedule/schedule";
import AppointmentScheduleTable from "./timeLineAppomint";

export default function Schedule() {
  const [timeReady, settimeReady] = useState(false);
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.schedule);
  const userLS = JSON.parse(localStorage.getItem("user") || "{}");

  const [btnHeader, setbtnHeader] = useState({
    Upcoming: true,
    InProgress: false,
    Completed: false,
    Cancel: false,
  });

  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const navigate = useNavigate();
  // Helper Functions
  const handleMenuOpen = (event, appointment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointment(appointment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAppointment(null);
  };

  const handleStatusChange = (newStatus, appointment = null) => {
    const targetAppointment = appointment || selectedAppointment;
    if (targetAppointment) {
      dispatch(
        appointmentsStatus({
          status: newStatus,
          id: targetAppointment.id,
        })
      ).then(() => {
        dispatch(appointmentsDoctor({ page, limit: 10 }));
        handleMenuClose();
      });
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRefresh = () => {
    dispatch(appointmentsDoctor({ page, limit: 10 }));
  };

  const combineDateTime = (date, time) => {
    const datePart = date.split("T")[0];
    return new Date(`${datePart}T${time}`);
  };
  const getTimeStatus = (appointmentDate, appointmentTime) => {
    if (!appointmentDate || !appointmentTime) return null;
    const now = new Date();
    const target = combineDateTime(appointmentDate, appointmentTime);
    const diffInMs = target - now;
    const totalHours = Math.floor(Math.abs(diffInMs) / (1000 * 60 * 60));

    if (totalHours >= 24) return null;

    const hours = totalHours;
    const minutes = Math.floor((Math.abs(diffInMs) / (1000 * 60)) % 60);
    let parts = [];

    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
    if (parts.length === 0) parts.push("less than a minute");

    const result = parts.join(" ");
    return diffInMs > 0 ? `In ${result}` : `${result} ago`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return isToday ? `Today, ${formatted}` : formatted;
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const statusConfig = {
    scheduled: {
      label: "Scheduled",
      color: "#3B82F6",
      bg: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)",
      icon: CalendarToday,
      nextStatus: "confirmed",
      nextLabel: "Confirm",
    },
    confirmed: {
      label: "Confirmed",
      color: "#F59E0B",
      bg: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
      icon: CheckCircle,
      nextStatus: "inprogress",
      nextLabel: "Start",
    },
    inprogress: {
      label: "In Progress",
      color: "#10B981",
      bg: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)",
      icon: HourglassEmpty,
      nextStatus: "completed",
      nextLabel: "Complete",
    },
    completed: {
      label: "Completed",
      color: "#6B7280",
      bg: "linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%)",
      icon: CheckCircle,
      nextStatus: null,
      nextLabel: null,
    },
    cancelled: {
      label: "Cancelled",
      color: "#EF4444",
      bg: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
      icon: Cancel,
      nextStatus: null,
      nextLabel: null,
    },
  };

  // Filter appointments based on selected tab
  const getFilteredAppointments = () => {
    const appointments = data?.data?.appointments || [];
    const statusMap = {
      Upcoming: ["scheduled", "confirmed"],
      InProgress: ["inprogress"],
      Completed: ["completed"],
      Cancel: ["cancelled"],
    };

    const activeFilter = Object.keys(btnHeader).find((key) => btnHeader[key]);
    if (!activeFilter) return appointments;

    return appointments.filter((apt) =>
      statusMap[activeFilter]?.includes(apt.status?.toLowerCase())
    );
  };

  const filteredAppointments = getFilteredAppointments();
  // Fetch appointments on mount and when page changes
  useEffect(() => {
    dispatch(appointmentsDoctor({ page, limit: 10 }));
  }, [dispatch, page]);
  const { user } = useSelector((state) => state.doctor);
  return (
    <Stack direction="row">
      <NavBar />
      <Box
        sx={{
          backgroundColor: "#F5F7FA",
          padding: "20px",
          height: "100vh",
          overflowY: "auto",
          flex: 1,
        }}
      >
        {/* Header Card */}
        <Fade in timeout={500}>
          <Card
            sx={{
              mb: 3,
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(82, 172, 140, 0.25)",
              background: "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
              color: "white",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                right: 0,
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.08)",
                transform: "translate(30%, -50%)",
              },
            }}
          >
            <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "14px",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <EventAvailable sx={{ fontSize: 28, color: "white" }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="700">
                      Appointments Schedule
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                      Manage your patient appointments and sessions
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    onClick={handleRefresh}
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
                    }}
                  >
                    <Refresh />
                  </IconButton>
                  <Avatar
                    src={user?.data?.imageUrl}
                    sx={{
                      width: 48,
                      height: 48,
                      border: "3px solid white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    {userLS?.fullName?.charAt(0) || "D"}
                  </Avatar>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Fade>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: "16px",
              border: "2px solid #f44336",
              boxShadow: "0 4px 20px rgba(244, 67, 54, 0.2)",
            }}
          >
            {error}
          </Alert>
        )}

        {/* Filter Tabs Card */}
        <Card
          sx={{
            mb: 3,
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(82, 172, 140, 0.15)",
            border: "1px solid rgba(82, 172, 140, 0.2)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                onClick={() => {
                  setbtnHeader({
                    Upcoming: true,
                    InProgress: false,
                    Completed: false,
                    Cancel: false,
                  });
                  setPage(1);
                }}
                startIcon={<CalendarToday />}
                sx={{
                  textTransform: "none",
                  px: 3,
                  py: 1.5,
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "15px",
                  background: btnHeader.Upcoming
                    ? "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)"
                    : "transparent",
                  color: btnHeader.Upcoming ? "white" : "#52AC8C",
                  border: btnHeader.Upcoming
                    ? "none"
                    : "2px solid rgba(82, 172, 140, 0.3)",
                  "&:hover": {
                    background: btnHeader.Upcoming
                      ? "linear-gradient(135deg, #3D8B6F 0%, #2E7A5F 100%)"
                      : "rgba(82, 172, 140, 0.1)",
                  },
                }}
              >
                Upcoming
              </Button>
              <Button
                onClick={() => {
                  setbtnHeader({
                    Upcoming: false,
                    InProgress: true,
                    Completed: false,
                    Cancel: false,
                  });
                  setPage(1);
                }}
                startIcon={<HourglassEmpty />}
                sx={{
                  textTransform: "none",
                  px: 3,
                  py: 1.5,
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "15px",
                  background: btnHeader.InProgress
                    ? "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)"
                    : "transparent",
                  color: btnHeader.InProgress ? "white" : "#52AC8C",
                  border: btnHeader.InProgress
                    ? "none"
                    : "2px solid rgba(82, 172, 140, 0.3)",
                  "&:hover": {
                    background: btnHeader.InProgress
                      ? "linear-gradient(135deg, #3D8B6F 0%, #2E7A5F 100%)"
                      : "rgba(82, 172, 140, 0.1)",
                  },
                }}
              >
                In Progress
              </Button>
              <Button
                onClick={() => {
                  setbtnHeader({
                    Upcoming: false,
                    InProgress: false,
                    Completed: true,
                    Cancel: false,
                  });
                  setPage(1);
                }}
                startIcon={<CheckCircle />}
                sx={{
                  textTransform: "none",
                  px: 3,
                  py: 1.5,
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "15px",
                  background: btnHeader.Completed
                    ? "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)"
                    : "transparent",
                  color: btnHeader.Completed ? "white" : "#52AC8C",
                  border: btnHeader.Completed
                    ? "none"
                    : "2px solid rgba(82, 172, 140, 0.3)",
                  "&:hover": {
                    background: btnHeader.Completed
                      ? "linear-gradient(135deg, #3D8B6F 0%, #2E7A5F 100%)"
                      : "rgba(82, 172, 140, 0.1)",
                  },
                }}
              >
                Completed
              </Button>
              <Button
                onClick={() => {
                  setbtnHeader({
                    Upcoming: false,
                    InProgress: false,
                    Completed: false,
                    Cancel: true,
                  });
                  setPage(1);
                }}
                startIcon={<Cancel />}
                sx={{
                  textTransform: "none",
                  px: 3,
                  py: 1.5,
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "15px",
                  background: btnHeader.Cancel
                    ? "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)"
                    : "transparent",
                  color: btnHeader.Cancel ? "white" : "#52AC8C",
                  border: btnHeader.Cancel
                    ? "none"
                    : "2px solid rgba(82, 172, 140, 0.3)",
                  "&:hover": {
                    background: btnHeader.Cancel
                      ? "linear-gradient(135deg, #3D8B6F 0%, #2E7A5F 100%)"
                      : "rgba(82, 172, 140, 0.1)",
                  },
                }}
              >
                Cancelled
              </Button>
            </Stack>

            {/* Stats Row */}
            <Stack
              direction="row"
              spacing={3}
              sx={{
                mt: 2,
                pt: 2,
                borderTop: "1px solid rgba(82, 172, 140, 0.1)",
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="500"
                >
                  Total Appointments
                </Typography>
                <Typography variant="h6" fontWeight="700" color="primary.main">
                  {data?.data?.pagination?.totalItems || 0}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="500"
                >
                  Filtered
                </Typography>
                <Typography variant="h6" fontWeight="700" color="primary.main">
                  {filteredAppointments.length}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="500"
                >
                  Current Page
                </Typography>
                <Typography variant="h6" fontWeight="700" color="primary.main">
                  {data?.data?.pagination?.page || 1} /{" "}
                  {data?.data?.pagination?.totalPages || 1}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Timeline Component */}
        <Box sx={{ mb: 3 }}>
          <AppointmentScheduleTable
            appointments={data?.data?.appointments || []}
            loading={loading}
            error={error}
            onRefresh={handleRefresh}
          />
        </Box>

        {/* Appointments Grid */}
        {loading ? (
          <Grid container spacing={2}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    borderRadius: "20px",
                    p: 3,
                    boxShadow: "0 4px 20px rgba(82, 172, 140, 0.15)",
                  }}
                >
                  <Stack direction="row" spacing={2} mb={2}>
                    <Skeleton variant="circular" width={70} height={70} />
                    <Box flex={1}>
                      <Skeleton variant="text" width="60%" height={30} />
                      <Skeleton variant="text" width="40%" height={20} />
                    </Box>
                  </Stack>
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="80%" height={20} />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={40}
                    sx={{ mt: 2, borderRadius: "12px" }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : filteredAppointments && filteredAppointments.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {filteredAppointments.map((session) => {
                const timeStatus = getTimeStatus(
                  session?.appointmentDate,
                  session?.appointmentTime
                );
                const config =
                  statusConfig[session.status?.toLowerCase()] ||
                  statusConfig.scheduled;
                const StatusIcon = config.icon;

                return (
                  <Grid item xs={12} md={6} key={session.id}>
                    <Fade in timeout={300}>
                      <Card
                        sx={{
                          borderRadius: "20px",
                          boxShadow: "0 4px 20px rgba(82, 172, 140, 0.15)",
                          border: "1px solid rgba(82, 172, 140, 0.2)",
                          position: "relative",
                          overflow: "visible",
                          p: 3,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 8px 30px rgba(82, 172, 140, 0.25)",
                          },
                        }}
                      >
                        {/* Ready Badge */}
                        {timeStatus &&
                          session.status?.toLowerCase() === "confirmed" && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: -12,
                                left: 20,
                                px: 2,
                                py: 0.5,
                                borderRadius: "8px",
                                background:
                                  "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                                color: "white",
                                fontSize: "12px",
                                fontWeight: 600,
                                boxShadow: "0 2px 8px rgba(82, 172, 140, 0.4)",
                                zIndex: 10,
                              }}
                            >
                              Ready to Start
                            </Box>
                          )}

                        {/* Header: Patient Info & Status */}
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          mb={2}
                        >
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Avatar
                              src={session?.patient?.image}
                              sx={{
                                width: 70,
                                height: 70,
                                border: "3px solid",
                                borderColor: config.color,
                                boxShadow: `0 2px 8px ${config.color}40`,
                              }}
                            >
                              {session?.patient?.name?.charAt(0) || "?"}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="h6"
                                fontWeight="700"
                                color="primary.main"
                              >
                                {session?.patient?.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                fontWeight="500"
                              >
                                ID: #{session?.patient?.id?.slice(-6)}
                              </Typography>
                              <Stack direction="row" spacing={1} mt={0.5}>
                                <Chip
                                  label={`${session?.patient?.age}y`}
                                  size="small"
                                  sx={{
                                    height: "20px",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                  }}
                                />
                                <Chip
                                  label={session?.patient?.gender}
                                  size="small"
                                  sx={{
                                    height: "20px",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                  }}
                                />
                              </Stack>
                            </Box>
                          </Stack>

                          <Stack spacing={1} alignItems="flex-end">
                            <Chip
                              icon={<StatusIcon />}
                              label={config.label}
                              sx={{
                                background: config.bg,
                                color: config.color,
                                fontWeight: 700,
                                fontSize: "12px",
                                height: "28px",
                                border: `1px solid ${config.color}`,
                                "& .MuiChip-icon": {
                                  color: config.color,
                                },
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, session)}
                              sx={{
                                color: "primary.main",
                                "&:hover": {
                                  backgroundColor: "rgba(82, 172, 140, 0.1)",
                                },
                              }}
                            >
                              <MoreVert />
                            </IconButton>
                          </Stack>
                        </Stack>

                        {/* Appointment Details */}
                        <Stack spacing={1.5} mb={2}>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <CalendarToday
                              sx={{ fontSize: 18, color: "primary.main" }}
                            />
                            <Typography
                              variant="body2"
                              fontWeight="600"
                              color="text.secondary"
                            >
                              {formatDate(session?.appointmentDate)}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <AccessTime
                              sx={{ fontSize: 18, color: "primary.main" }}
                            />
                            <Typography
                              variant="body2"
                              fontWeight="600"
                              color="text.secondary"
                            >
                              {formatTime(session.appointmentTime)}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <ChatBubbleOutline
                              sx={{ fontSize: 18, color: "primary.main" }}
                            />
                            <Typography
                              variant="body2"
                              fontWeight="600"
                              color="text.secondary"
                            >
                              {session.reason}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            {session.appointmentType === "video" ? (
                              <VideoCall
                                sx={{ fontSize: 18, color: "primary.main" }}
                              />
                            ) : (
                              <Phone
                                sx={{ fontSize: 18, color: "primary.main" }}
                              />
                            )}
                            <Typography
                              variant="body2"
                              fontWeight="600"
                              color="text.secondary"
                              sx={{ textTransform: "capitalize" }}
                            >
                              {session.appointmentType} Call
                            </Typography>
                          </Stack>
                        </Stack>

                        {/* Time Status Badge */}
                        {timeStatus && (
                          <Box
                            sx={{
                              backgroundColor: "rgba(82, 172, 140, 0.1)",
                              color: "primary.main",
                              border: "1px solid",
                              borderColor: "primary.main",
                              borderRadius: "10px",
                              py: 0.8,
                              px: 2,
                              mb: 2,
                              textAlign: "center",
                              fontSize: "13px",
                              fontWeight: 600,
                            }}
                          >
                            {timeStatus}
                          </Box>
                        )}

                        {/* Action Buttons */}
                        <Stack direction="row" spacing={1.5}>
                          {config.nextStatus && (
                            <Button
                              fullWidth
                              variant="contained"
                              endIcon={<ArrowForward />}
                              onClick={() =>
                                handleStatusChange(config.nextStatus, session)
                              }
                              sx={{
                                background:
                                  "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                                color: "white",
                                fontWeight: 600,
                                py: 1.2,
                                borderRadius: "12px",
                                textTransform: "none",
                                boxShadow: "0 4px 12px rgba(82, 172, 140, 0.3)",
                                "&:hover": {
                                  background:
                                    "linear-gradient(135deg, #3D8B6F 0%, #2E7A5F 100%)",
                                  boxShadow:
                                    "0 6px 16px rgba(82, 172, 140, 0.4)",
                                },
                              }}
                            >
                              {config.nextLabel}
                            </Button>
                          )}
                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => {
                              navigate("/schedule/appointmentsdetails");
                              dispatch(setSelectedPatient(session));
                            }}
                            sx={{
                              borderColor: "primary.main",
                              color: "primary.main",
                              fontWeight: 600,
                              py: 1.2,
                              borderRadius: "12px",
                              textTransform: "none",
                              borderWidth: "2px",
                              "&:hover": {
                                borderWidth: "2px",
                                backgroundColor: "rgba(82, 172, 140, 0.1)",
                              },
                            }}
                          >
                            View Details
                          </Button>
                        </Stack>
                      </Card>
                    </Fade>
                  </Grid>
                );
              })}
            </Grid>

            {/* Pagination */}
            {data?.data?.pagination?.totalPages > 1 && (
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Pagination
                  count={data?.data?.pagination?.totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: "12px",
                      fontWeight: 600,
                      "&.Mui-selected": {
                        background:
                          "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                        color: "white",
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        ) : (
          <Card
            sx={{
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(82, 172, 140, 0.15)",
              border: "1px solid rgba(82, 172, 140, 0.2)",
              p: 6,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                opacity: 0.8,
              }}
            >
              <EventAvailable sx={{ fontSize: 40, color: "white" }} />
            </Box>
            <Typography
              variant="h6"
              fontWeight="700"
              color="primary.main"
              mb={1}
            >
              No Appointments Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              There are no appointments in this category
            </Typography>
          </Card>
        )}

        {/* Status Update Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(82, 172, 140, 0.2)",
              border: "1px solid rgba(82, 172, 140, 0.2)",
              mt: 1,
            },
          }}
        >
          <MenuItem
            onClick={() => handleStatusChange("scheduled")}
            sx={{ fontWeight: 600, color: "#3B82F6" }}
          >
            <CalendarToday sx={{ mr: 1, fontSize: 18 }} />
            Mark as Scheduled
          </MenuItem>
          <MenuItem
            onClick={() => handleStatusChange("confirmed")}
            sx={{ fontWeight: 600, color: "#F59E0B" }}
          >
            <CheckCircle sx={{ mr: 1, fontSize: 18 }} />
            Mark as Confirmed
          </MenuItem>
          <MenuItem
            onClick={() => handleStatusChange("inprogress")}
            sx={{ fontWeight: 600, color: "#10B981" }}
          >
            <HourglassEmpty sx={{ mr: 1, fontSize: 18 }} />
            Mark as In Progress
          </MenuItem>
          <MenuItem
            onClick={() => handleStatusChange("completed")}
            sx={{ fontWeight: 600, color: "#6B7280" }}
          >
            <CheckCircle sx={{ mr: 1, fontSize: 18 }} />
            Mark as Completed
          </MenuItem>
          <MenuItem
            onClick={() => handleStatusChange("cancelled")}
            sx={{ fontWeight: 600, color: "#EF4444" }}
          >
            <Cancel sx={{ mr: 1, fontSize: 18 }} />
            Mark as Cancelled
          </MenuItem>
        </Menu>

        {/* Footer */}
        <Box
          sx={{ mt: 4, py: 2, textAlign: "center", color: "text.secondary" }}
        >
          <Typography variant="caption">
            © 2026 DoctorMate | Your Digital Healthcare Partner
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
}
