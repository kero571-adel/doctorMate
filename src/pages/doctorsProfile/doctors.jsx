import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Fade,
  Grid,
  Rating,
  Stack,
  Typography,
  Badge,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navBar";
import { getDataDoctor, getPatient } from "../../redux/doctor/doctor";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import SchoolIcon from "@mui/icons-material/School";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VerifiedIcon from "@mui/icons-material/Verified";

const cardStyle = {
  borderRadius: "20px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  border: "1px solid rgba(0, 0, 0, 0.06)",
  background: "linear-gradient(to bottom, #ffffff 0%, #f9fafb 100%)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 30px rgba(82, 172, 140, 0.25)",
  },
};

export default function DoctorProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, data, loading, error } = useSelector((state) => state.doctor);

  useEffect(() => {
    dispatch(getDataDoctor());
    dispatch(getPatient());
  }, [dispatch]);

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
        <Fade in timeout={400}>
          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            justifyContent="space-between" 
            alignItems={{ xs: "stretch", sm: "center" }} 
            spacing={{ xs: 2, sm: 0 }}
            mb={3}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                boxShadow: "0 4px 12px rgba(82, 172, 140, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #3D8B6F 0%, #2E6B55 100%)",
                  boxShadow: "0 6px 16px rgba(82, 172, 140, 0.4)",
                },
              }}
            >
              Back
            </Button>
            <Button
              startIcon={<EditIcon />}
              onClick={() => navigate("/settings")}
              sx={{
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                boxShadow: "0 4px 12px rgba(82, 172, 140, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #3D8B6F 0%, #2E6B55 100%)",
                  boxShadow: "0 6px 16px rgba(82, 172, 140, 0.4)",
                },
              }}
            >
              Edit Profile
            </Button>
          </Stack>
        </Fade>

        {/* Main Profile Card */}
        <Fade in timeout={600}>
          <Card
            sx={{
              ...cardStyle,
              p: { xs: 2, sm: 3, md: 4 },
              mb: 3,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                right: 0,
                width: "400px",
                height: "400px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(82, 172, 140, 0.1) 0%, rgba(82, 172, 140, 0.05) 100%)",
                transform: "translate(30%, -50%)",
                display: { xs: "none", md: "block" },
              },
            }}
          >
            <Box position="relative" zIndex={1}>
              <Grid container spacing={4}>
                {/* Profile Header Section */}
                <Grid item xs={12}>
                  <Stack 
                    direction={{ xs: "column", sm: "row" }} 
                    spacing={3} 
                    alignItems={{ xs: "center", sm: "flex-start" }}
                  >
                    <Box position="relative">
                      <Avatar
                        src={user?.data?.imageUrl}
                        sx={{
                          width: { xs: 100, sm: 120, md: 140 },
                          height: { xs: 100, sm: 120, md: 140 },
                          border: "4px solid white",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                        }}
                      />
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <VerifiedIcon
                            sx={{
                              width: { xs: 24, md: 32 },
                              height: { xs: 24, md: 32 },
                              color: "#1976d2",
                              backgroundColor: "white",
                              borderRadius: "50%",
                              p: 0.5,
                            }}
                          />
                        }
                      />
                    </Box>

                    <Box flex={1} textAlign={{ xs: "center", sm: "left" }}>
                      <Typography 
                        variant="h4" 
                        fontWeight="700" 
                        color="primary.main" 
                        mb={1}
                        sx={{ fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" } }}
                      >
                        Dr. {user?.data?.fullName}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        color="text.secondary" 
                        fontWeight={500} 
                        mb={2}
                        sx={{ fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" } }}
                      >
                        {user?.data?.specialty || "Medical Specialist"}
                      </Typography>
                      <Box display="flex" justifyContent={{ xs: "center", sm: "flex-start" }}>
                        <Rating value={4.5} precision={0.5} readOnly size="large" />
                      </Box>

                      <Grid container spacing={2} mt={2}>
                        <Grid item xs={12} sm={6} lg={3}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: "12px",
                              background: "linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)",
                              border: "1px solid rgba(244, 67, 54, 0.2)",
                            }}
                          >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <LocationOnIcon sx={{ color: "#f44336" }} />
                              <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                  Location
                                </Typography>
                                <Typography variant="body2" fontWeight={600} color="text.primary">
                                  {user?.data?.address || "N/A"}
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} lg={3}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: "12px",
                              background: "linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)",
                              border: "1px solid rgba(33, 150, 243, 0.2)",
                            }}
                          >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <EmailIcon sx={{ color: "#2196f3" }} />
                              <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                  Email
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  fontWeight={600} 
                                  color="text.primary" 
                                  noWrap
                                  sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                                >
                                  {user?.data?.email}
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} lg={3}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: "12px",
                              background: "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)",
                              border: "1px solid rgba(76, 175, 80, 0.2)",
                            }}
                          >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <PhoneIcon sx={{ color: "#4caf50" }} />
                              <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                  Phone
                                </Typography>
                                <Typography variant="body2" fontWeight={600} color="text.primary">
                                  {user?.data?.phone}
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} lg={3}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: "12px",
                              background: "linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)",
                              border: "1px solid rgba(255, 152, 0, 0.2)",
                            }}
                          >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Typography fontSize={20}>⭐</Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                  Rating
                                </Typography>
                                <Typography variant="body2" fontWeight={600} color="text.primary">
                                  4.5 / 5.0
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Professional Information Grid */}
                <Grid item xs={12} lg={8}>
                  <Grid container spacing={3}>
                    {/* Qualifications Card */}
                    <Grid item xs={12} sm={6}>
                      <Card sx={cardStyle}>
                        <CardContent>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <SchoolIcon sx={{ color: "white", fontSize: 24 }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                Qualifications
                              </Typography>
                              <Typography variant="h6" fontWeight="700" color="primary.main">
                                {user?.data?.qualifications || "N/A"}
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* License Number Card */}
                    <Grid item xs={12} sm={6}>
                      <Card sx={cardStyle}>
                        <CardContent>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <BadgeIcon sx={{ color: "white", fontSize: 24 }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                License Number
                              </Typography>
                              <Typography variant="h6" fontWeight="700" color="primary.main">
                                {user?.data?.licenseNumber || "N/A"}
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Consultation Fee Card */}
                    <Grid item xs={12} sm={6}>
                      <Card sx={cardStyle}>
                        <CardContent>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <AttachMoneyIcon sx={{ color: "white", fontSize: 24 }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                Consultation Fee
                              </Typography>
                              <Typography variant="h6" fontWeight="700" color="primary.main">
                                ${user?.data?.consultationFee?.toFixed(2) || "0.00"}
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Working Hours Card */}
                    <Grid item xs={12} sm={6}>
                      <Card sx={cardStyle}>
                        <CardContent>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <AccessTimeIcon sx={{ color: "white", fontSize: 24 }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                Working Hours
                              </Typography>
                              <Typography variant="h6" fontWeight="700" color="primary.main">
                                {user?.data?.workingTime?.start || "09:00"} - {user?.data?.workingTime?.end || "17:00"}
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Working Days Card */}
                    <Grid item xs={12}>
                      <Card sx={cardStyle}>
                        <CardContent>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <CalendarTodayIcon sx={{ color: "white", fontSize: 24 }} />
                            </Box>
                            <Box flex={1}>
                              <Typography variant="caption" color="text.secondary" fontWeight={500} mb={1} display="block">
                                Working Days
                              </Typography>
                              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                {user?.data?.workingDays?.map((day, index) => (
                                  <Chip
                                    key={index}
                                    label={day}
                                    sx={{
                                      background: "linear-gradient(135deg, rgba(82, 172, 140, 0.2) 0%, rgba(82, 172, 140, 0.1) 100%)",
                                      color: "primary.main",
                                      fontWeight: 600,
                                      border: "1px solid rgba(82, 172, 140, 0.3)",
                                    }}
                                  />
                                )) || <Typography variant="body2">Not specified</Typography>}
                              </Stack>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Biography Card */}
                    <Grid item xs={12}>
                      <Card sx={cardStyle}>
                        <CardContent>
                          <Typography variant="h6" fontWeight="700" color="primary.main" mb={2}>
                            Biography
                          </Typography>
                          <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
                            Dr. {user?.data?.fullName} is a highly qualified medical professional with {user?.data?.qualifications}. 
                            Licensed under {user?.data?.licenseNumber}, they provide exceptional healthcare services. 
                            With expertise in {user?.data?.specialty || "general practice"}, Dr. {user?.data?.fullName?.split(' ')[1] || user?.data?.fullName} is committed 
                            to delivering quality patient care and has earned an excellent reputation in the medical community.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Patient List Section */}
                <Grid item xs={12} lg={4}>
                  <Card sx={cardStyle}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h6" fontWeight="700" color="primary.main">
                          Patient List
                        </Typography>
                        <Chip
                          label="Today"
                          icon={<CalendarTodayIcon sx={{ fontSize: 16 }} />}
                          sx={{
                            background: "linear-gradient(135deg, #52AC8C 0%, #45988F 100%)",
                            color: "white",
                            fontWeight: 600,
                          }}
                        />
                      </Stack>

                      <Stack spacing={2} sx={{ maxHeight: { xs: "400px", md: "500px" }, overflowY: "auto", pr: 1 }}>
                        {data?.data?.patients?.map((p, i) => (
                          <Fade in key={p.patientId}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                p: 1.5,
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, rgba(82, 172, 140, 0.05) 0%, rgba(82, 172, 140, 0.02) 100%)",
                                border: "1px solid rgba(82, 172, 140, 0.2)",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 4px 12px rgba(82, 172, 140, 0.2)",
                                  borderColor: "primary.main",
                                },
                              }}
                            >
                              <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                  <Box
                                    sx={{
                                      width: 12,
                                      height: 12,
                                      borderRadius: "50%",
                                      bgcolor: "#4CAF50",
                                      border: "2px solid white",
                                    }}
                                  />
                                }
                              >
                                <Avatar
                                  src={p.imageUrl}
                                  sx={{ 
                                    width: 48, 
                                    height: 48,
                                    border: "2px solid rgba(82, 172, 140, 0.3)",
                                  }}
                                />
                              </Badge>

                              <Box sx={{ flex: 1 }}>
                                <Typography fontSize="15px" fontWeight={600} color="text.primary">
                                  {p.fullName}
                                </Typography>
                                <Typography fontSize="12px" color="text.secondary" fontWeight={500}>
                                  Patient #{i + 1}
                                </Typography>
                              </Box>
                            </Box>
                          </Fade>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Fade>
      </Box>
    </Stack>
  );
}
