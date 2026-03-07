import React from "react";
import {
  Box,
  //Grid,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  //Card,
  useTheme,
  alpha,
  Stack,
  Divider,
} from "@mui/material";
import { useEffect } from "react";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Assessment as AssessmentIcon,
  //CalendarToday as CalendarIcon,
  EventNote as EventNoteIcon,
  // Medication as MedicationIcon,
  //TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import NavBar from "../../components/navBar";
//import CircleIcon from "@mui/icons-material/Circle";
//import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import { useSelector, useDispatch } from "react-redux";
import { getReport } from "../../redux/doctor/report";
import { getDataDoctor } from "../../redux/doctor/doctor";
//import { useMediaQuery } from "@mui/material";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
//import { tr } from "date-fns/locale";

// بيانات الرسم البياني
// const monthlyData = [
//   { month: "Jan", appointments: 340, diagnoses: 260 },
//   { month: "Feb", appointments: 340, diagnoses: 310 },
//   { month: "Mar", appointments: 330, diagnoses: 290 },
//   { month: "Apr", appointments: 410, diagnoses: 350 },
//   { month: "May", appointments: 435, diagnoses: 370 },
//   { month: "Jun", appointments: 450, diagnoses: 390 },
//   { month: "Jul", appointments: 470, diagnoses: 405 },
// ];

const StatCard = ({ title, value, icon, color }) => {
  const theme = useTheme();

  const colorMap = {
    blue: {
      bg: alpha(theme.palette.primary.main, 0.1),
      icon: theme.palette.primary.main,
    },
    purple: {
      bg: alpha(theme.palette.secondary.main, 0.1),
      icon: theme.palette.secondary.main,
    },
    green: {
      bg: alpha(theme.palette.success.main, 0.1),
      icon: theme.palette.success.main,
    },
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <Paper
      elevation={0}
      sx={{
        width: { xs: "100%", sm: "250px", md: "300px" }, // Responsive width
        p: 3,
        marginBottom: "20px",
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1, fontWeight: 500, fontSize: { xs: "0.8rem", md: "0.875rem" } }}
          >
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: "1.5rem", md: "2rem" } }}>
            {value}
          </Typography>
          {/* <Typography
            variant="body2"
            sx={{
              color: percentage.startsWith("+") ? "primary.main" : "warning",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <TrendingUpIcon sx={{ fontSize: 11, fontWeight: "300" }} />
            {percentage}{" "}
            <span
              style={{ color: "black", fontSize: "16px", fontWeight: "600" }}
            >
              vs last period
            </span>
          </Typography> */}
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: selectedColor.bg,
            color: selectedColor.icon,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
};

export default function Reports() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.report);
  const report = data?.data;
  console.log("Report Data:", data?.data);
  const theme = useTheme();
  const { user } = useSelector((state) => state.doctor);
  //const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    dispatch(getReport());
    dispatch(getDataDoctor());
  }, [dispatch]);
  return (
    <Stack direction="row">
      <NavBar />
      {/* ✅ Main Container - Flex Column Layout */}
      <Box
        sx={{
          backgroundColor: "#F5F7FA",
          padding: { xs: "10px", md: "20px" },
          height: "100vh",
          display: "flex", // ✅ تفعيل Flexbox
          flexDirection: "column", // ✅ ترتيب العناصر عموديًا
          flex: 1,
          overflow: "hidden", // ✅ منع السكرول على الكونتينر الرئيسي
        }}
      >
        {/* ✅ Scrollable Content Area */}
        <Box
          sx={{
            flex: 1, // ✅ ياخد المساحة الفاضية ويدفع الفوتر لتحت
            overflowY: "auto", // ✅ السكرول يشتغل على المحتوى بس
            overflowX: "hidden",
            width: "100%",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              backgroundColor: "white",
              p: 2,
              mb: 3,
              borderRadius: 3,
            }}
          >
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                mb: { xs: 2, md: "0" },
                flexWrap: "wrap", // ✅ لمنع تداخل العناصر في الموبايل
                gap: { xs: 2, md: 0 }
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: "1.2rem", md: "1.5rem" } }}>
                Reports
              </Typography>
              <TextField
                size="small"
                placeholder="Search reports..."
                variant="outlined"
                sx={{
                  display: { xs: "none", sm: "flex" },
                  width: 350,
                  mb: { xs: 3, sm: "0" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.grey[100], 0.5),
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Stack direction={"row"} sx={{ alignItems: "center", mb: 1 }}>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    borderColor: alpha(theme.palette.divider, 0.2),
                    display: { xs: "none", sm: "flex" },
                    marginRight: "30px",
                  }}
                />
                <Avatar
                  sx={{ bgcolor: "primary.main", width: 40, height: 40 }}
                  src={user?.data?.imageUrl}
                >
                  {user?.data?.imageUrl ? "" : <PersonIcon />}
                </Avatar>
              </Stack>
            </Stack>
            <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
              <TextField
                size="small"
                placeholder="Search reports..."
                variant="outlined"
                sx={{
                  width: "90%",
                  display: { xs: "flex", sm: "none" },
                  mt: { xs: 3, sm: "0" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.grey[100], 0.5),
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Box>
          {/* Stats Cards */}
          <Stack
            direction={"row"}
            sx={{
              mb: 2,
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: { xs: "center", md: "space-between" },
              gap: { xs: 1, md: 0 }
            }}
          >
            <StatCard
              title="TOTAL APPOINTMENTS (THIS MONTH)"
              value={report?.totalAppointmentsThisMonth || 0}
              color="blue"
              width="300px"
              icon={<AssessmentIcon sx={{ fontSize: 28 }} />}
            />

            {/* <StatCard
              title="TOTAL APPOINTMENTS"
              value="1,247"
              
              color="purple"
              width="300px"
              icon={<CalendarIcon sx={{ fontSize: 28 }} />}
            /> */}

            <StatCard
              title="COMPLETED APPOINTMENTS"
              value={report?.completedAppointments || 0}
              color="green"
              icon={<EventNoteIcon sx={{ fontSize: 28 }} />}
            />
            <StatCard
              title="CANCELLED APPOINTMENTS"
              value={report?.cancelledAppointments || 0}
              color="blue"
              icon={<AssessmentIcon sx={{ fontSize: 28 }} />}
            />
            <StatCard
              title="PENDING APPOINTMENTS"
              value={report?.pendingAppointments || 0}
              color="purple"
              icon={<NotificationsIcon sx={{ fontSize: 28 }} />}
            />
            <StatCard
              title="TOTAL PATIENTS SEEN"
              value={report?.totalPatientsSeen || 0}
              color="blue"
              icon={<GroupsIcon sx={{ fontSize: 28 }} />}
            />
            <StatCard
              title="NEW PATIENTS (THIS MONTH)"
              value={report?.newPatientsThisMonth || 0}
              color="green"
              icon={<PersonIcon sx={{ fontSize: 28 }} />}
            />
          </Stack>

          {/* Chart Section */}
          {/* <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              // overflow: "auto", // احنا هنحط الـ overflow على الـ wrapper بتاع/chart مش على الـ Paper نفسه
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }} // Responsive direction for header
              spacing={2}
              sx={{
                mb: 3,
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
              }}
            >
              <Box sx={{ mb: { xs: 2, sm: 0 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    fontSize: { xs: "1.1rem", sm: "1.25rem" }, // Responsive font
                  }}
                >
                  Monthly Overview
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                >
                  Appointments and Diagnoses comparison
                </Typography>
              </Box>

              <Stack
                direction={"row"}
                spacing={2}
                sx={{ alignItems: "center", flexWrap: "wrap" }}
              >
                <Stack
                  direction={"row"}
                  spacing={0.5}
                  sx={{ alignItems: "center" }}
                >
                  <CircleIcon sx={{ fontSize: 12, color: "#3378F2" }} />
                  <Typography
                    sx={{
                      color: "#3378F2",
                      fontSize: { xs: "12px", sm: "14px" }, // Responsive font
                      fontWeight: 400,
                    }}
                  >
                    Appointments
                  </Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  spacing={0.5}
                  sx={{ alignItems: "center" }}
                >
                  <CircleIcon sx={{ fontSize: 12, color: "#9333EA" }} />
                  <Typography
                    sx={{
                      color: "#9333EA",
                      fontSize: { xs: "12px", sm: "14px" },
                      fontWeight: 400,
                    }}
                  >
                    Diagnoses
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            {/* ✅ Wrapper للـ Chart عشان الـ Scroll 
            <Box
              sx={{
                height: { xs: 300, sm: 400 }, // Responsive height
                overflowX: "auto", // سكرول أفقي لما العرض يقل
                overflowY: "hidden",
                "&::-webkit-scrollbar": {
                  height: 6,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: theme.palette.divider,
                  borderRadius: 3,
                },
                pb: 1, // مساحة صغيرة للسكرول بار
              }}
            >
              <Box sx={{ minWidth: 650, height: "100%" }}>
                {" "}
                {/* ✅ minWidth يمنع الضغط 
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }} // Responsive margin
                  >
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#999",
                        fontSize: 12,
                      }}
                      dy={10}
                      interval={0}
                      // ✅ منع تداخل النصوص في الموبايل
                      angle={isMobile ? -45 : 0}
                      textAnchor={isMobile ? "end" : "middle"}
                      height={isMobile ? 60 : 40} // زيادة المساحة للنصوص المائلة
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#999",
                        fontSize: 12,
                      }}
                      domain={[250, 450]}
                      ticks={[300, 350, 400, 450]}
                      width={30} // تقليل المساحة اللي ياخدها المحور
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: 8,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        padding: "8px 12px",
                        fontSize: "12px",
                      }}
                    />

                    <Line
                      type="linear"
                      dataKey="appointments"
                      stroke="#2196F3"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5, fill: "#2196F3", strokeWidth: 0 }}
                    />

                    <Line
                      type="linear"
                      dataKey="diagnoses"
                      stroke="#9C27B0"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5, fill: "#9C27B0", strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Paper> */}

          {/* Bottom Cards */}
          {/* <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  backgroundColor: `#3478F2`,
                  color: "white",
                  padding: "30px 20px",
                  width: "100%",
                  borderRadius: "20px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: "14px", alignItems: "500" }}>
                      AVG APPOINTMENTS PER DAY
                    </Typography>
                    <Typography sx={{ fontSize: "24px", fontWeight: 600 }}>
                      {report?.avgAppointmentsPerDay?.toFixed(2) || 0}
                    </Typography>
                    <Typography sx={{ fontSize: "14px", alignItems: "500" }}>
                      appointments per month
                    </Typography>
                  </Box>
                  <Stack
                    sx={{
                      p: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      borderRadius: "50%",
                    }}
                  >
                    <SignalCellularAltIcon
                      sx={{ fontSize: 28, borderRadius: "50%" }}
                    />
                  </Stack>
                </Box>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  backgroundColor: `primary.main`,
                  color: "white",
                  padding: "30px 20px",
                  width: "100%",
                  borderRadius: "20px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: "14px", alignItems: "500" }}>
                      PATIENT GROWTH
                    </Typography>
                    <Typography sx={{ fontSize: "24px", alignItems: "500" }}>
                      +15%
                    </Typography>
                    <Typography sx={{ fontSize: "14px", alignItems: "600" }}>
                      increase from last month
                    </Typography>
                  </Box>
                  <Stack
                    sx={{
                      p: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#60C184",
                      borderRadius: "50%",
                    }}
                  >
                    <GroupsIcon sx={{ fontSize: 28 }} />
                  </Stack>
                </Box>
              </Card>
            </Grid>
          </Grid> */}
        </Box> {/* ✅ End of Scrollable Content Area */}

        {/* ✅ Footer - خارج منطقة السكرول عشان يفضل ثابت في الآخر */}
        <Stack
          sx={{
            pt: 3,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            flexDirection: { xs: "column", md: "row" },
            justifyContent: { xs: "center", md: "space-between" },
            alignItems: "center",
            flexShrink: 0, // ✅ منع الانكماش
            backgroundColor: "#F5F7FA", // ✅ نفس خلفية الصفحة عشان الدمج يكون نضيف
            pb: { xs: 2, md: 0 }
          }}
        >
          <Typography variant="caption" color="text.secondary" mb={{ xs: 1, md: 0 }} sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}>
            2024 HEALTHCARE ADMIN PORTAL I V 2.4.0
          </Typography>
          <Typography variant="caption" color="text.secondary" mb={{ xs: 1, md: 0 }} sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}>
            PRIVACY POLICY
          </Typography>
          <Typography variant="caption" color="text.secondary" mb={{ xs: 1, md: 0 }} sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}>
            SYSTEM HEALTH STATUS
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}