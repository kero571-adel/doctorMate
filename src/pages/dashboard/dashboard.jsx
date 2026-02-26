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

export default function Dashboard() {
  const dispatch = useDispatch();
  const {
    stats,
    todayAppointments,
    recentPatients,
    urgentAlerts,
    loading,
    error,
  } = useSelector((state) => state.overView);
  const userLS = JSON.parse(localStorage.getItem("user") || "{}");

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

  // Stats cards configuration with primary theme colors
  const statsCards = [
    {
      icon: <CalendarTodayIcon sx={{ fontSize: 32 }} />,
      title: "Total Appointments",
      value: stats?.totalAppointments?.total || 0,
      subtitle: `${stats?.totalAppointments?.today || 0} today`,
      gradient: "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
      iconBg: "rgba(255, 255, 255, 0.2)",
    },
    {
      icon: <EventAvailableIcon sx={{ fontSize: 32 }} />,
      title: "Upcoming",
      value: stats?.totalAppointments?.upcoming || 0,
      subtitle: `${stats?.totalAppointments?.completed || 0} completed`,
      gradient: "linear-gradient(135deg, #4DB8A8 0%, #2E9B8C 100%)",
      iconBg: "rgba(255, 255, 255, 0.2)",
    },
    {
      icon: <PeopleAltIcon sx={{ fontSize: 32 }} />,
      title: "Total Patients",
      value: stats?.totalPatients || 0,
      subtitle: "Registered patients",
      gradient: "linear-gradient(135deg, #5CB89D 0%, #3D9D85 100%)",
      iconBg: "rgba(255, 255, 255, 0.2)",
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: 32 }} />,
      title: "Diagnoses",
      value: stats?.totalDiagnoses || 0,
      subtitle: `${stats?.totalPrescriptions || 0} prescriptions`,
      gradient: "linear-gradient(135deg, #45A087 0%, #2E8770 100%)",
      iconBg: "rgba(255, 255, 255, 0.2)",
    },
    {
      icon: <StarIcon sx={{ fontSize: 32 }} />,
      title: "Average Rating",
      value: stats?.averageRating?.toFixed(1) || "0.0",
      subtitle: `${stats?.totalReviews || 0} reviews`,
      gradient: "linear-gradient(135deg, #66C4A8 0%, #52AC8C 100%)",
      iconBg: "rgba(255, 255, 255, 0.2)",
    },
  ];
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
        {/* Header */}
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
                  <Avatar
                    src={user?.data?.imageUrl || ""}
                    sx={{ width: 64, height: 64, border: "3px solid white" }}
                  >
                    {userLS?.fullName?.charAt(0) || "D"}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="600">
                      Welcome back, Dr. {userLS?.fullName || "Doctor"}!
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
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: "16px",
              border: "2px solid #f44336",
              boxShadow: "0 4px 20px rgba(244, 67, 54, 0.2)",
              fontWeight: 600,
            }}
          >
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
                        borderRadius: "20px",
                        background: card.gradient,
                        color: "white",
                        boxShadow: "0 4px 20px rgba(82, 172, 140, 0.3)",
                        height: "100%",
                        overflow: "hidden",
                        position: "relative",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "translateY(-8px) scale(1.02)",
                          boxShadow: "0 12px 40px rgba(82, 172, 140, 0.4)",
                        },
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                          background: "rgba(255, 255, 255, 0.1)",
                          transform: "translate(30%, -30%)",
                        },
                      }}
                    >
                      <CardContent
                        sx={{ position: "relative", zIndex: 1, p: 3 }}
                      >
                        <Stack spacing={2.5}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box
                              sx={{
                                width: 64,
                                height: 64,
                                borderRadius: "16px",
                                backgroundColor: card.iconBg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backdropFilter: "blur(10px)",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              {card.icon}
                            </Box>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor: "white",
                                opacity: 0.6,
                              }}
                            />
                          </Stack>
                          <Box>
                            <Typography
                              variant="h3"
                              fontWeight="800"
                              sx={{
                                color: "white",
                                mb: 1,
                                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              }}
                            >
                              {card.value}
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="600"
                              sx={{
                                color: "white",
                                opacity: 0.95,
                                mb: 0.5,
                              }}
                            >
                              {card.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "white",
                                opacity: 0.8,
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
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
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(82, 172, 140, 0.15)",
                height: "100%",
                border: "1px solid rgba(82, 172, 140, 0.2)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 8px 30px rgba(82, 172, 140, 0.25)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 3 }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background:
                        "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(82, 172, 140, 0.3)",
                    }}
                  >
                    <CalendarTodayIcon sx={{ color: "white", fontSize: 20 }} />
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    color="primary.main"
                  >
                    Today's Appointments
                  </Typography>
                  <Chip
                    label={todayAppointments?.length || 0}
                    size="small"
                    sx={{
                      ml: "auto",
                      background:
                        "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                      color: "white",
                      fontWeight: 600,
                    }}
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
                        sx={{
                          borderRadius: "16px",
                          background:
                            "linear-gradient(135deg, rgba(82, 172, 140, 0.05) 0%, rgba(82, 172, 140, 0.1) 100%)",
                          border: "2px solid rgba(82, 172, 140, 0.2)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            border: "2px solid #52AC8C",
                            boxShadow: "0 6px 20px rgba(82, 172, 140, 0.2)",
                            transform: "translateX(4px)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Avatar
                              src={appointment.patientImage}
                              sx={{
                                width: 52,
                                height: 52,
                                border: "3px solid white",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              }}
                            >
                              {appointment.patientName?.charAt(0)}
                            </Avatar>
                            <Box flex={1}>
                              <Typography
                                variant="subtitle1"
                                fontWeight="700"
                                color="primary.main"
                              >
                                {appointment.patientName}
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <AccessTimeIcon
                                  sx={{
                                    fontSize: 16,
                                    color: "primary.main",
                                    opacity: 0.7,
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  fontWeight="500"
                                >
                                  {formatTime(appointment.appointmentDate)}
                                </Typography>
                              </Stack>
                            </Box>
                            <Chip
                              label={appointment.status || "Scheduled"}
                              size="small"
                              sx={{
                                background:
                                  appointment.status === "Completed"
                                    ? "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)"
                                    : "linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)",
                                color: "white",
                                fontWeight: 600,
                              }}
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
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, rgba(82, 172, 140, 0.05) 0%, rgba(82, 172, 140, 0.02) 100%)",
                      border: "2px dashed rgba(82, 172, 140, 0.3)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                        opacity: 0.8,
                      }}
                    >
                      <CalendarTodayIcon
                        sx={{ fontSize: 32, color: "white" }}
                      />
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight="600"
                      color="primary.main"
                    >
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
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(82, 172, 140, 0.15)",
                height: "100%",
                border: "1px solid rgba(82, 172, 140, 0.2)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 8px 30px rgba(82, 172, 140, 0.25)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 3 }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background:
                        "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)",
                    }}
                  >
                    <WarningAmberIcon sx={{ color: "white", fontSize: 20 }} />
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    sx={{ color: "#FF9800" }}
                  >
                    Urgent Alerts
                  </Typography>
                  <Chip
                    label={urgentAlerts?.length || 0}
                    size="small"
                    sx={{
                      ml: "auto",
                      background:
                        "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
                      color: "white",
                      fontWeight: 600,
                    }}
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
                      <Box
                        key={index}
                        sx={{
                          borderRadius: "16px",
                          background:
                            "linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(245, 124, 0, 0.05) 100%)",
                          border: "2px solid rgba(255, 152, 0, 0.3)",
                          p: 2.5,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            border: "2px solid #FF9800",
                            boxShadow: "0 6px 20px rgba(255, 152, 0, 0.2)",
                            transform: "translateX(4px)",
                          },
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "10px",
                              background:
                                "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)",
                            }}
                          >
                            <WarningAmberIcon
                              sx={{ color: "white", fontSize: 20 }}
                            />
                          </Box>
                          <Box flex={1}>
                            <Typography
                              variant="subtitle2"
                              fontWeight="700"
                              color="#FF9800"
                            >
                              {alert.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontWeight="500"
                            >
                              {alert.message}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 6,
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, rgba(82, 172, 140, 0.05) 0%, rgba(82, 172, 140, 0.02) 100%)",
                      border: "2px dashed rgba(82, 172, 140, 0.3)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                        opacity: 0.8,
                      }}
                    >
                      <WarningAmberIcon sx={{ fontSize: 32, color: "white" }} />
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight="600"
                      color="primary.main"
                      mb={0.5}
                    >
                      No urgent alerts at this time
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
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
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(82, 172, 140, 0.15)",
            border: "1px solid rgba(82, 172, 140, 0.2)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 8px 30px rgba(82, 172, 140, 0.25)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(82, 172, 140, 0.3)",
                }}
              >
                <PeopleAltIcon sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Typography variant="h6" fontWeight="700" color="primary.main">
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
                  borderRadius: "16px",
                  border: "2px solid rgba(82, 172, 140, 0.2)",
                  overflow: "hidden",
                }}
              >
                <Table>
                  <TableHead
                    sx={{
                      background:
                        "linear-gradient(135deg, rgba(82, 172, 140, 0.1) 0%, rgba(82, 172, 140, 0.05) 100%)",
                    }}
                  >
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          color: "primary.main",
                          fontSize: "0.95rem",
                        }}
                      >
                        Patient
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          color: "primary.main",
                          fontSize: "0.95rem",
                        }}
                      >
                        Age/Gender
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          color: "primary.main",
                          fontSize: "0.95rem",
                        }}
                      >
                        Contact
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          color: "primary.main",
                          fontSize: "0.95rem",
                        }}
                      >
                        Current Condition
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          color: "primary.main",
                          fontSize: "0.95rem",
                        }}
                      >
                        Last Visit
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          color: "primary.main",
                          fontSize: "0.95rem",
                        }}
                      >
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentPatients.map((patient, index) => (
                      <TableRow
                        key={patient.patientId || index}
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(82, 172, 140, 0.05)",
                          },
                          transition: "all 0.2s ease",
                          borderBottom: "1px solid rgba(82, 172, 140, 0.1)",
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
                              sx={{
                                width: 44,
                                height: 44,
                                border: "2px solid",
                                borderColor: "primary.main",
                                boxShadow: "0 2px 8px rgba(82, 172, 140, 0.2)",
                              }}
                            >
                              {patient.name?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="subtitle2"
                                fontWeight="700"
                                color="primary.main"
                              >
                                {patient.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                fontWeight="500"
                              >
                                ID: {patient.patientId?.slice(0, 8)}...
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="600">
                            {patient.age} years
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {patient.gender}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
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
                          <Typography variant="body2" fontWeight="500">
                            {formatDate(patient.lastAppointmentDate)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={patient.status}
                            size="small"
                            sx={{
                              background:
                                patient.status === "Active"
                                  ? "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)"
                                  : patient.status === "Inactive"
                                  ? "linear-gradient(135deg, #9E9E9E 0%, #757575 100%)"
                                  : "linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)",
                              color: "white",
                              fontWeight: 600,
                              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            }}
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
                  borderRadius: "16px",
                  background:
                    "linear-gradient(135deg, rgba(82, 172, 140, 0.05) 0%, rgba(82, 172, 140, 0.02) 100%)",
                  border: "2px dashed rgba(82, 172, 140, 0.3)",
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    opacity: 0.8,
                  }}
                >
                  <PeopleAltIcon sx={{ fontSize: 32, color: "white" }} />
                </Box>
                <Typography
                  variant="body1"
                  fontWeight="600"
                  color="primary.main"
                >
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
