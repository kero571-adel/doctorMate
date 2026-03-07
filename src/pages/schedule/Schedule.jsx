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
import { getDataDoctor } from "../../redux/doctor/doctor";
import { setSelectedPatient2 } from "../../redux/schedule/schedule";
export default function Schedule() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.schedule);
  const userLS = JSON.parse(localStorage.getItem("user") || "{}");
  const ITEMS_PER_PAGE = 6;
  const [btnHeader, setbtnHeader] = useState({
    Upcoming: true,
    InProgress: false,
    Completed: false,
    Cancel: false,
  });
  const [localPage, setLocalPage] = useState(1);
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
        dispatch(appointmentsDoctor({ page: page, limit: 10 }));
        handleMenuClose();
      });
    }
  };

  const handlePageChange = (event, value) => {
    event.preventDefault();
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
  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);

  const displayedAppointments = filteredAppointments.slice(
    (localPage - 1) * ITEMS_PER_PAGE,
    localPage * ITEMS_PER_PAGE
  );
  useEffect(() => {
    dispatch(appointmentsDoctor({ page, limit: 10 }));
  }, [dispatch, page]);
  const { user } = useSelector((state) => state.doctor);

  useEffect(() => {
    setLocalPage(1);
  }, [btnHeader]);
  useEffect(() => {
    dispatch(getDataDoctor());
  }, []);
  return (
    <Stack direction="row">
      <NavBar />
      <Box
        sx={{
          backgroundColor: "#F5F7FA",
          padding: { xs: "8px", md: "10px" },
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
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                right: 0,
                width: { xs: "200px", md: "300px" },
                height: { xs: "200px", md: "300px" },
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.08)",
                transform: "translate(30%, -50%)",
              },
            }}
          >
            <CardContent
              sx={{ p: { xs: 2, md: 1.5 }, position: "relative", zIndex: 1 }}
            >
              <Stack
                alignItems="center"
                justifyContent="space-between"
                sx={{ flexDirection: { xs: "column", md: "row" } }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "14px",
                      backgroundColor: {
                        xs: "",
                        md: "rgba(255, 255, 255, 0.2)",
                      },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <EventAvailable
                      sx={{ fontSize: { xs: 24, md: 28 }, color: "white" }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      fontWeight="700"
                      sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}
                    >
                      Appointments Schedule
                    </Typography>
                    <Typography
                      sx={{
                        opacity: 0.9,
                        mt: 0.5,
                        fontSize: { xs: "0.85rem", md: "0.95rem" },
                      }}
                    >
                      Manage your patient appointments and sessions
                    </Typography>
                  </Box>
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: { xs: "100%", md: "auto" },
                    mt: { xs: 2, md: 0 },
                  }}
                >
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
          <Alert severity="error">
            {typeof error === "string"
              ? error
              : error.message || JSON.stringify(error)}
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
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 1, md: 1 }}
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
                  fontSize: { xs: "14px", md: "15px" },
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
                  width: { xs: "100%", md: "160px" },
                  mb: { xs: 1, md: 0 },
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
                  fontSize: { xs: "14px", md: "15px" },
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
                  width: { xs: "100%", md: "160px" },
                  mb: { xs: 1, md: 0 },
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
                  fontSize: { xs: "14px", md: "15px" },
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
                  width: { xs: "100%", md: "160px" },
                  mb: { xs: 1, md: 0 },
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
                  fontSize: { xs: "14px", md: "15px" },
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
                  width: { xs: "100%", md: "160px" },
                }}
              >
                Cancelled
              </Button>
            </Stack>

            {/* Stats Row */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1.5, md: 3 }}
              sx={{
                mt: 2,
                pt: 2,
                borderTop: "1px solid rgba(82, 172, 140, 0.1)",
                justifyContent: "space-around",
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

        {/* Timeline Component - Responsive Wrapper */}
        <Box
          sx={{
            mb: 3,
            // overflowX: "auto",
            // "& > *": {
            //   minWidth: { xs: "600px", md: "100%" },
            // },
            px: { xs: 0.5, md: 0 },
          }}
        >
          <AppointmentScheduleTable
            page={page}
            setPage={setPage}
            appointments={data?.data?.appointments || []}
            loading={loading}
            error={error}
            onRefresh={handleRefresh}
          />
        </Box>

        {/* Appointments Grid */}
        {loading ? (
          <Grid container spacing={{ xs: 2, md: 2 }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  sx={{
                    borderRadius: "20px",
                    p: { xs: 2, md: 3 },
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
            <Grid container spacing={{ xs: 2, md: 2 }}>
              {displayedAppointments.map((session) => {
                const timeStatus = getTimeStatus(
                  session?.appointmentDate,
                  session?.appointmentTime
                );
                const config =
                  statusConfig[session.status?.toLowerCase()] ||
                  statusConfig.scheduled;
                const StatusIcon = config.icon;

                return (
                  <Grid size={{ xs: 12, md: 6 }} key={session.id}>
                    {/* <Fade in timeout={300}> */}
                    <Card
                      sx={{
                        borderRadius: { xs: "16px", md: "20px" },
                        boxShadow: "0 4px 20px rgba(82, 172, 140, 0.15)",
                        border: "1px solid rgba(82, 172, 140, 0.2)",
                        position: "relative",
                        overflow: "hidden",
                        p: { xs: 2, md: 3 },
                        transition: "all 0.3s ease",
                        width: "100%",
                        boxSizing: "border-box",
                        "&:hover": {
                          transform: { md: "translateY(-4px)" },
                          boxShadow: {
                            md: "0 8px 30px rgba(82, 172, 140, 0.25)",
                          },
                        },
                      }}
                    >
                      {/* Ready Badge */}
                      {timeStatus &&
                        session.status?.toLowerCase() === "confirmed" && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: { xs: -10, md: -12 },
                              left: { xs: 12, md: 20 },
                              px: { xs: 1.5, md: 2 },
                              py: 0.5,
                              borderRadius: "8px",
                              background:
                                "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                              color: "white",
                              fontSize: { xs: "8px", md: "12px" },
                              fontWeight: 600,
                              boxShadow: "0 2px 8px rgba(82, 172, 140, 0.4)",
                              zIndex: 10,
                              whiteSpace: "nowrap",
                            }}
                          >
                            Ready to Start
                          </Box>
                        )}

                      {/* Header */}
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems="flex-start"
                        mb={2}
                        spacing={{ xs: 2, md: 2 }}
                        sx={{ minWidth: 0 }}
                      >
                        <Stack
                          direction="row"
                          spacing={{ xs: 1.5, md: 2 }}
                          alignItems="center"
                          sx={{ minWidth: 0 }}
                        >
                          <Avatar
                            src={session?.patient?.image}
                            sx={{
                              width: { xs: 50, md: 70 },
                              height: { xs: 50, md: 70 },
                              border: "3px solid",
                              borderColor: config.color,
                              boxShadow: `0 2px 8px ${config.color}40`,
                              flexShrink: 0,
                            }}
                          >
                            {session?.patient?.name?.charAt(0) || "?"}
                          </Avatar>

                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              variant="h6"
                              fontWeight="700"
                              color="primary.main"
                              sx={{
                                fontSize: { xs: ".9rem", md: "1.25rem" },
                                wordBreak: "break-word",
                              }}
                            >
                              {session?.patient?.name}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                              fontWeight="500"
                              sx={{
                                display: { xs: "none", sm: "block" },
                                wordBreak: "break-word",
                              }}
                            >
                              ID: #{session?.patient?.id?.slice(-6)}
                            </Typography>

                            <Stack
                              direction="row"
                              spacing={0.5}
                              mt={0.5}
                              flexWrap="wrap"
                            >
                              {session?.patient?.age && (
                                <Chip
                                  label={`${session?.patient?.age}y`}
                                  size="small"
                                  sx={{
                                    height: "24px",
                                    fontSize: { xs: "9px", md: "11px" },
                                    fontWeight: 600,
                                  }}
                                />
                              )}
                              {session?.patient?.gender && (
                                <Chip
                                  label={session?.patient?.gender}
                                  size="small"
                                  sx={{
                                    height: "24px",
                                    fontSize: { xs: "9px", md: "11px" },
                                    fontWeight: 600,
                                  }}
                                />
                              )}
                            </Stack>
                          </Box>
                        </Stack>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="flex-end"
                          sx={{
                            width: { xs: "100%", sm: "auto" },
                          }}
                        >
                          <Chip
                            icon={<StatusIcon />}
                            label={config.label}
                            size="small"
                            sx={{
                              background: config.bg,
                              color: config.color,
                              fontWeight: 700,
                              fontSize: { xs: "9px", md: "12px" },
                              height: { xs: "24px", md: "28px" },
                              border: `1px solid ${config.color}`,
                              "& .MuiChip-icon": {
                                color: config.color,
                              },
                              maxWidth: "100%",
                            }}
                          />

                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, session)}
                            sx={{
                              color: "primary.main",
                              flexShrink: 0,
                              "&:hover": {
                                backgroundColor: "rgba(82, 172, 140, 0.1)",
                              },
                            }}
                          >
                            <MoreVert sx={{ fontSize: { xs: 18, md: 22 } }} />
                          </IconButton>
                        </Stack>
                      </Stack>

                      {/* Appointment Details */}
                      <Stack spacing={{ xs: 1.2, md: 1.5 }} mb={2}>
                        {/* Date */}
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          alignItems={{ xs: "flex-start", sm: "center" }}
                          sx={{ minWidth: 0 }}
                        >
                          <CalendarToday
                            sx={{
                              fontSize: { xs: 16, md: 18 },
                              color: "primary.main",
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            color="text.secondary"
                            sx={{
                              fontSize: { xs: "0.75rem", md: "0.875rem" },
                              wordBreak: "break-word",
                              whiteSpace: { xs: "normal", sm: "nowrap" },
                              minWidth: 0,
                            }}
                          >
                            {formatDate(session?.appointmentDate)}
                          </Typography>
                        </Stack>

                        {/* Time */}
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          alignItems={{ xs: "flex-start", sm: "center" }}
                          sx={{ minWidth: 0 }}
                        >
                          <AccessTime
                            sx={{
                              fontSize: { xs: 16, md: 18 },
                              color: "primary.main",
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            color="text.secondary"
                            sx={{
                              fontSize: { xs: "0.75rem", md: "0.875rem" },
                              wordBreak: "break-word",
                              whiteSpace: { xs: "normal", sm: "nowrap" },
                              minWidth: 0,
                            }}
                          >
                            {formatTime(session.appointmentTime)}
                          </Typography>
                        </Stack>

                        {/* Reason */}
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          alignItems={{ xs: "flex-start", sm: "center" }}
                          sx={{ minWidth: 0 }}
                        >
                          <ChatBubbleOutline
                            sx={{
                              fontSize: { xs: 16, md: 18 },
                              color: "primary.main",
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            color="text.secondary"
                            sx={{
                              fontSize: { xs: "0.75rem", md: "0.875rem" },
                              wordBreak: "break-word",
                              whiteSpace: { xs: "normal", sm: "nowrap" },
                              minWidth: 0,
                            }}
                          >
                            {session.reason}
                          </Typography>
                        </Stack>

                        {/* Type */}
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          alignItems={{ xs: "flex-start", sm: "center" }}
                          sx={{ minWidth: 0 }}
                        >
                          {session.appointmentType === "video" ? (
                            <VideoCall
                              sx={{
                                fontSize: { xs: 16, md: 18 },
                                color: "primary.main",
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <Phone
                              sx={{
                                fontSize: { xs: 16, md: 18 },
                                color: "primary.main",
                                flexShrink: 0,
                              }}
                            />
                          )}

                          <Typography
                            variant="body2"
                            fontWeight="600"
                            color="text.secondary"
                            sx={{
                              textTransform: "capitalize",
                              fontSize: { xs: "0.75rem", md: "0.875rem" },
                              wordBreak: "break-word",
                              whiteSpace: { xs: "normal", sm: "nowrap" },
                              minWidth: 0,
                            }}
                          >
                            {session.appointmentType} Call
                          </Typography>
                        </Stack>
                      </Stack>

                      {/* Time Status */}
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
                            fontSize: { xs: "10px", md: "13px" },
                            fontWeight: 600,
                            wordBreak: "break-word",
                          }}
                        >
                          {timeStatus}
                        </Box>
                      )}

                      {/* Buttons */}
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={{ xs: 1, sm: 1.5 }}
                      >
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

                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => {
                            const currentIndex =
                              data?.data?.appointments.findIndex(
                                (p) => p.id === session.id
                              );
                            const nextPatient =
                              data?.data?.appointments[currentIndex + 1] ||
                              null;
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
                      </Stack>
                    </Card>
                    {/* </Fade> */}
                  </Grid>
                );
              })}
            </Grid>
            {/* Pagination */}
            {filteredAppointments.length > ITEMS_PER_PAGE && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Pagination
                  count={totalPages}
                  page={localPage}
                  onChange={(e, value) => setLocalPage(value)}
                  size={window.innerWidth < 600 ? "small" : "medium"}
                  shape="rounded"
                  color="white"
                  sx={{
                    color: "white",
                    mb: 2,
                    mt: 2,
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
          </>
        ) : (
          <Card
            sx={{
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(82, 172, 140, 0.15)",
              border: "1px solid rgba(82, 172, 140, 0.2)",
              p: { xs: 4, md: 6 },
              textAlign: "center",
              mx: { xs: 1, md: 0 },
            }}
          >
            <Box
              sx={{
                width: { xs: 60, md: 80 },
                height: { xs: 60, md: 80 },
                borderRadius: "50%",
                background: "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                opacity: 0.8,
              }}
            >
              <EventAvailable
                sx={{ fontSize: { xs: 25, md: 40 }, color: "white" }}
              />
            </Box>
            <Typography
              variant="h6"
              fontWeight="700"
              color="primary.main"
              mb={1}
              sx={{ fontSize: { xs: ".8rem", md: "1.25rem" } }}
            >
              No Appointments Found
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.65rem", md: "0.95rem" } }}
            >
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
              minWidth: { xs: 200, md: 250 },
            },
          }}
        >
          <MenuItem
            onClick={() => handleStatusChange("scheduled")}
            sx={{
              fontWeight: 600,
              color: "#3B82F6",
              fontSize: { xs: "10px", md: "14px" },
            }}
          >
            <CalendarToday sx={{ mr: 1, fontSize: { xs: 15, md: 18 } }} />
            Mark as Scheduled
          </MenuItem>
          <MenuItem
            onClick={() => handleStatusChange("confirmed")}
            sx={{
              fontWeight: 600,
              color: "#F59E0B",
              fontSize: { xs: "10px", md: "14px" },
            }}
          >
            <CheckCircle sx={{ mr: 1, fontSize: { xs: 15, md: 18 } }} />
            Mark as Confirmed
          </MenuItem>
          <MenuItem
            onClick={() => handleStatusChange("inprogress")}
            sx={{
              fontWeight: 600,
              color: "#10B981",
              fontSize: { xs: "10px", md: "14px" },
            }}
          >
            <HourglassEmpty sx={{ mr: 1, fontSize: { xs: 15, md: 18 } }} />
            Mark as In Progress
          </MenuItem>
          <MenuItem
            onClick={() => handleStatusChange("completed")}
            sx={{
              fontWeight: 600,
              color: "#6B7280",
              fontSize: { xs: "10px", md: "14px" },
            }}
          >
            <CheckCircle sx={{ mr: 1, fontSize: { xs: 15, md: 18 } }} />
            Mark as Completed
          </MenuItem>
          <MenuItem
            onClick={() => handleStatusChange("cancelled")}
            sx={{
              fontWeight: 600,
              color: "#EF4444",
              fontSize: { xs: "10px", md: "14px" },
            }}
          >
            <Cancel sx={{ mr: 1, fontSize: { xs: 15, md: 18 } }} />
            Mark as Cancelled
          </MenuItem>
        </Menu>
        {/* Footer */}
        <Box
          sx={{
            mt: 4,
            py: 2,
            textAlign: "center",
            color: "text.secondary",
            px: { xs: 1, md: 0 },
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontSize: { xs: "0.5rem", md: "0.75rem" } }}
          >
            © 2026 DoctorMate | Your Digital Healthcare Partner
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
}
