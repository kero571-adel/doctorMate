import React from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Card,
  CardContent,
  useTheme,
  alpha,
  Stack,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
  EventNote as EventNoteIcon,
  Medication as MedicationIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import NavBar from "../../components/navBar";
import CircleIcon from "@mui/icons-material/Circle";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { tr } from "date-fns/locale";

// بيانات الرسم البياني
const monthlyData = [
  { month: "Jan", appointments: 340, diagnoses: 260 },
  { month: "Feb", appointments: 340, diagnoses: 310 },
  { month: "Mar", appointments: 330, diagnoses: 290 },
  { month: "Apr", appointments: 410, diagnoses: 350 },
  { month: "May", appointments: 435, diagnoses: 370 },
  { month: "Jun", appointments: 450, diagnoses: 390 },
  { month: "Jul", appointments: 470, diagnoses: 405 },
];

const StatCard = ({ title, value, percentage, icon, color }) => {
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
        width: "300px",
        p: 3,
        // marginBottom: "20px",
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
            sx={{ mb: 1, fontWeight: 500 }}
          >
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {value}
          </Typography>
          <Typography
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
          </Typography>
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
  const theme = useTheme();
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
          overflowX: "hidden",
          flex: 1,
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
            backgroundColor: "#f5f7fa",
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
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
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
                  {user?.data?.imageUrl? "" : <PersonIcon />}
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
            }}
          >
            <StatCard
              title="TOTAL DIAGNOSES"
              value="982"
              percentage="+8.3%"
              color="blue"
              width="300px"
              icon={<AssessmentIcon sx={{ fontSize: 28 }} />}
            />

            <StatCard
              title="TOTAL APPOINTMENTS"
              value="1,247"
              percentage="+12.5%"
              color="purple"
              width="300px"
              icon={<CalendarIcon sx={{ fontSize: 28 }} />}
            />

            <StatCard
              title="TOTAL PRESCRIPTIONS"
              value="1,456"
              percentage="+15.7%"
              color="green"
              icon={<MedicationIcon sx={{ fontSize: 28 }} />}
            />
          </Stack>

          {/* Chart Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Stack
              direction={"row"}
              sx={{
                mb: 2,
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Monthly Overview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Appointments and Diagnoses comparison
                </Typography>
              </Box>
              <Stack
                direction={"row"}
                spacing={2}
                sx={{ alignItems: "center" }}
              >
                <Stack
                  direction={"row"}
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <CircleIcon
                    sx={{ fontSize: 12, color: "#3378F2", mr: 0.5 }}
                  />
                  <Typography
                    sx={{ color: "#3378F2", fontSize: "14px", fontWeight: 400 }}
                  >
                    Appointments
                  </Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <CircleIcon
                    sx={{ fontSize: 12, color: "#9333EA", mr: 0.5 }}
                  />
                  <Typography
                    sx={{ color: "#9333EA", fontSize: "14px", fontWeight: 400 }}
                  >
                    Diagnoses
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  {/* 1. إزالة الشبكة تماماً */}
                  {/* CartesianGrid مش موجود خالص */}

                  {/* 2. التحكم في المحور الأفقي */}
                  <XAxis
                    dataKey="month"
                    axisLine={false} // إخفاء خط المحور
                    tickLine={false} // إخفاء العلامات
                    tick={{
                      fill: "#999", // لون رمادي فاتح
                      fontSize: 12,
                    }}
                    dy={10} // مسافة إضافية
                    interval={0} // إظهار كل الشهور
                  />

                  {/* 3. التحكم في المحور الرأسي */}
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#999",
                      fontSize: 12,
                    }}
                    domain={[250, 450]} // تحديد المدى من 250 لـ 450
                    ticks={[300, 350, 400, 450]} // إظهار أرقام محددة بس
                  />

                  {/* 4. Tooltip منسق */}
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: 8,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      padding: "8px 12px",
                    }}
                  />

                  {/* 5. الخط الأزرق - Appointments */}
                  <Line
                    type="linear" // خطوط مستقيمة مش منحنية
                    dataKey="appointments"
                    stroke="#2196F3" // لون أزرق ثابت
                    strokeWidth={2} // سمك أقل شوية
                    dot={false} // بدون نقاط
                    activeDot={{
                      r: 5, // دائرة صغيرة لما تقف عليها
                      fill: "#2196F3",
                      strokeWidth: 0,
                    }}
                  />

                  {/* 6. الخط البنفسجي - Diagnoses */}
                  <Line
                    type="linear"
                    dataKey="diagnoses"
                    stroke="#9C27B0" // لون بنفسجي ثابت
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: "#9C27B0",
                      strokeWidth: 0,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          {/* Bottom Cards */}
          <Grid container spacing={3}>
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
                      AVG APPOINTMENTS/MONTH
                    </Typography>
                    <Typography sx={{ fontSize: "24px", alignItems: "600" }}>
                      415
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
          </Grid>
          {/* Footer */}
          <Stack
            sx={{
              mt: 4,
              flexDirection: { xs: "column", md: "row" },
              flexWrap: "wrap",
              justifyContent: { xs: "center", md: "space-between" },
              alignItems: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary" mb={1}>
              2024 HEALTHCARE ADMIN PORTAL I V 2.4.0
            </Typography>
            <Typography variant="caption" color="text.secondary" mb={1}>
              PRIVACY POLICY
            </Typography>
            <Typography variant="caption" color="text.secondary" mb={1}>
              SYSTEM HEALTH STATUS
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
}
