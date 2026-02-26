import React, { useEffect } from "react";
import {
  Grid,
  Typography,
  Avatar,
  Box,
  Stack,
  Card,
  CardContent,
  Chip,
  Fade,
  Skeleton,
  Alert,
  IconButton,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MedicationIcon from "@mui/icons-material/Medication";
import StarIcon from "@mui/icons-material/Star";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RefreshIcon from "@mui/icons-material/Refresh";
import NavBar from "../../components/navBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctorDashboard } from "../../redux/overViews/overView";

export default function OverView() {
  const dispatch = useDispatch();
  const {
    stats,
    todayAppointments,
    recentPatients,
    urgentAlerts,
    loading,
    error,
  } = useSelector((state) => state.overView);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    dispatch(fetchDoctorDashboard());
  }, [dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Stats cards configuration
  const statsCards = [
    {
      icon: <CalendarTodayIcon sx={{ fontSize: 32 }} />,
      title: "Total Appointments",
      value: stats?.totalAppointments?.total || 0,
      subtitle: `${stats?.totalAppointments?.today || 0} today`,
      color: "#4CAF50",
      bgColor: "#E8F5E9",
    },
    {
      icon: <EventAvailableIcon sx={{ fontSize: 32 }} />,
      title: "Upcoming",
      value: stats?.totalAppointments?.upcoming || 0,
      subtitle: `${stats?.totalAppointments?.completed || 0} completed`,
      color: "#2196F3",
      bgColor: "#E3F2FD",
    },
    {
      icon: <PeopleAltIcon sx={{ fontSize: 32 }} />,
      title: "Total Patients",
      value: stats?.totalPatients || 0,
      subtitle: "Registered patients",
      color: "#FF9800",
      bgColor: "#FFF3E0",
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: 32 }} />,
      title: "Diagnoses",
      value: stats?.totalDiagnoses || 0,
      subtitle: `${stats?.totalPrescriptions || 0} prescriptions`,
      color: "#9C27B0",
      bgColor: "#F3E5F5",
    },
    {
      icon: <StarIcon sx={{ fontSize: 32 }} />,
      title: "Average Rating",
      value: stats?.averageRating?.toFixed(1) || "0.0",
      subtitle: `${stats?.totalReviews || 0} reviews`,
      color: "#FFC107",
      bgColor: "#FFF8E1",
    },
  ];

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
        {/* Header */}
        <Fade in timeout={500}>
          <Card
            sx={{
              mb: 3,
              borderRadius: "16px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    src={user?.imageUrl}
                    sx={{ width: 64, height: 64, border: "3px solid white" }}
                  >
                    {user?.fullName?.charAt(0) || "D"}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="600">
                      Welcome back, Dr. {user?.fullName || "Doctor"}!
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                      Here's what's happening with your practice today
                    </Typography>
                  </Box>
                </Stack>
                <IconButton
                  onClick={() => dispatch(fetchDoctorDashboard())}
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
        </Fade>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={2.4} key={index}>
                  <Skeleton
                    variant="rectangular"
                    height={140}
                    sx={{ borderRadius: "16px" }}
                  />
                </Grid>
              ))
            : statsCards.map((card, index) => (
                <Grid item xs={12} sm={6} md={2.4} key={index}>
                  <Fade in timeout={300 * (index + 1)}>
                    <Card
                      sx={{
                        borderRadius: "16px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        height: "100%",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        },
                      }}
                    >
                      <CardContent>
                        <Stack spacing={2}>
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: "12px",
                              backgroundColor: card.bgColor,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: card.color,
                            }}
                          >
                            {card.icon}
                          </Box>
                          <Box>
                            <Typography
                              variant="h4"
                              fontWeight="700"
                              color="text.primary"
                            >
                              {card.value}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontWeight="500"
                              sx={{ mt: 0.5 }}
                            >
                              {card.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ mt: 0.5, display: "block" }}
                            >
                              {card.subtitle}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
        </Grid>

        {/* Two Column Layout */}
        <Grid container spacing={3}>
          {/* Today's Appointments */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: "16px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                height: "100%",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 2 }}
                >
                  <CalendarTodayIcon color="primary" />
                  <Typography variant="h6" fontWeight="600">
                    Today's Appointments
                  </Typography>
                  <Chip
                    label={todayAppointments?.length || 0}
                    size="small"
                    color="primary"
                    sx={{ ml: "auto" }}
                  />
                </Stack>

                {loading ? (
                  <Stack spacing={2}>
                    {[1, 2, 3].map((i) => (
                      <Skeleton
                        key={i}
                        variant="rectangular"
                        height={80}
                        sx={{ borderRadius: "12px" }}
                      />
                    ))}
                  </Stack>
                ) : todayAppointments && todayAppointments.length > 0 ? (
                  <Stack spacing={2}>
                    {todayAppointments.map((appointment, index) => (
                      <Card
                        key={index}
                        variant="outlined"
                        sx={{
                          borderRadius: "12px",
                          borderColor: "#E0E0E0",
                          "&:hover": {
                            borderColor: "primary.main",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Avatar
                              src={appointment.patientImage}
                              sx={{ width: 48, height: 48 }}
                            >
                              {appointment.patientName?.charAt(0)}
                            </Avatar>
                            <Box flex={1}>
                              <Typography variant="subtitle1" fontWeight="600">
                                {appointment.patientName}
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <AccessTimeIcon
                                  sx={{ fontSize: 16, color: "text.secondary" }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {formatTime(appointment.appointmentDate)}
                                </Typography>
                              </Stack>
                            </Box>
                            <Chip
                              label={appointment.status || "Scheduled"}
                              size="small"
                              color={
                                appointment.status === "Completed"
                                  ? "success"
                                  : "warning"
                              }
                            />
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 6,
                      color: "text.secondary",
                    }}
                  >
                    <CalendarTodayIcon
                      sx={{ fontSize: 48, opacity: 0.3, mb: 2 }}
                    />
                    <Typography variant="body1">
                      No appointments scheduled for today
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Urgent Alerts */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: "16px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                height: "100%",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 2 }}
                >
                  <WarningAmberIcon color="warning" />
                  <Typography variant="h6" fontWeight="600">
                    Urgent Alerts
                  </Typography>
                  <Chip
                    label={urgentAlerts?.length || 0}
                    size="small"
                    color="warning"
                    sx={{ ml: "auto" }}
                  />
                </Stack>

                {loading ? (
                  <Stack spacing={2}>
                    {[1, 2].map((i) => (
                      <Skeleton
                        key={i}
                        variant="rectangular"
                        height={80}
                        sx={{ borderRadius: "12px" }}
                      />
                    ))}
                  </Stack>
                ) : urgentAlerts && urgentAlerts.length > 0 ? (
                  <Stack spacing={2}>
                    {urgentAlerts.map((alert, index) => (
                      <Alert
                        key={index}
                        severity="warning"
                        sx={{ borderRadius: "12px" }}
                      >
                        <Typography variant="subtitle2" fontWeight="600">
                          {alert.title}
                        </Typography>
                        <Typography variant="body2">{alert.message}</Typography>
                      </Alert>
                    ))}
                  </Stack>
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 6,
                      color: "text.secondary",
                    }}
                  >
                    <WarningAmberIcon
                      sx={{ fontSize: 48, opacity: 0.3, mb: 2 }}
                    />
                    <Typography variant="body1">
                      No urgent alerts at this time
                    </Typography>
                    <Typography variant="caption">
                      All patients are stable
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Patients Table */}
        <Card
          sx={{
            mt: 3,
            borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <CardContent>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 3 }}
            >
              <PeopleAltIcon color="primary" />
              <Typography variant="h6" fontWeight="600">
                Recent Patients
              </Typography>
            </Stack>

            {loading ? (
              <Skeleton
                variant="rectangular"
                height={300}
                sx={{ borderRadius: "12px" }}
              />
            ) : recentPatients && recentPatients.length > 0 ? (
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  borderRadius: "12px",
                  border: "1px solid #E0E0E0",
                }}
              >
                <Table>
                  <TableHead sx={{ backgroundColor: "#F8F9FA" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Patient</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Age/Gender</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Current Condition
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Last Visit</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentPatients.map((patient, index) => (
                      <TableRow
                        key={patient.patientId || index}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#F8F9FA",
                          },
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Avatar
                              src={patient.image}
                              sx={{ width: 40, height: 40 }}
                            >
                              {patient.name?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="600">
                                {patient.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                ID: {patient.patientId?.slice(0, 8)}...
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {patient.age} years
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {patient.gender}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {patient.phoneNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {patient.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 250,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {patient.currentCondition || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(patient.lastAppointmentDate)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={patient.status}
                            size="small"
                            color={
                              patient.status === "Active"
                                ? "success"
                                : patient.status === "Inactive"
                                ? "default"
                                : "warning"
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 6,
                  color: "text.secondary",
                }}
              >
                <PeopleAltIcon sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
                <Typography variant="body1">
                  No recent patients to display
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <Box
          sx={{
            mt: 4,
            py: 2,
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          <Typography variant="caption">
            © 2026 DoctorMate | Your Digital Healthcare Partner
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
}
