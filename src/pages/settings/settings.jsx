import { useState, useEffect, use } from "react";
import { CircularProgress } from "@mui/material";
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Stack,
  MenuItem,
  Divider,
  FormLabel,
  Checkbox,
  Fade,
  Card,
  CardContent,
} from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import NavBar from "../../components/navBar";
import { useNavigate } from "react-router-dom";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SaveIcon from "@mui/icons-material/Save";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDispatch, useSelector } from "react-redux";
import { profileManagement } from "../../redux/doctor/profileMangment";
import { getDataDoctor } from "../../redux/doctor/doctor";
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
import dayjs from "dayjs";

export default function Settings() {
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.doctor);
  const [date, setdate] = useState({ startTime: null, endTime: null });
  const [selectedDays, setSelectedDays] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    speciality: "",
    address: "",
    workingTime: "",
    consultationFee: "",
    profilePhoto: null,
  });
  // Populate form with existing doctor data
  useEffect(() => {
    // Fetch doctor data when component mounts
    dispatch(getDataDoctor());
  }, [dispatch]);

  useEffect(() => {
    if (user?.data) {
      setForm({
        fullName: user.data.fullName || "",
        phone: user.data.phone || "",
        speciality: user.data.specialty || "",
        address: user.data.address || "",
        workingTime: "",
        consultationFee: user.data.consultationFee?.toString() || "",
        profilePhoto: null,
      });

      // Parse workingTime if it exists
      // Expected format: "Sunday, Tuesday, Thursday from 6 PM to 10 PM"
      if (user.data.workingTime) {
        const workingTimeStr =
          typeof user.data.workingTime === "string"
            ? user.data.workingTime
            : `${user.data.workingTime?.start || ""} - ${
                user.data.workingTime?.end || ""
              }`;

        // Try to parse the working time string
        const daysMatch = workingTimeStr.match(/^([^f]+) from/);
        const timeMatch = workingTimeStr.match(
          /from ([\d:]+ [AP]M) to ([\d:]+ [AP]M)/
        );

        if (daysMatch) {
          const daysStr = daysMatch[1].trim();
          const parsedDays = daysStr.split(",").map((d) => d.trim());
          setSelectedDays(parsedDays);
        }

        if (timeMatch) {
          const startTimeStr = timeMatch[1];
          const endTimeStr = timeMatch[2];

          // Parse time strings to dayjs objects
          setdate({
            startTime: dayjs(startTimeStr, "h A"),
            endTime: dayjs(endTimeStr, "h A"),
          });
        }
      }
    }
  }, [user]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      workingTime: [
        selectedDays.join(", "),
        `from ${date.startTime ? dayjs(date.startTime).format("h A") : ""} to ${
          date.endTime ? dayjs(date.endTime).format("h A") : ""
        }`,
      ],
    }));
  }, [selectedDays, date]);
  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      profilePhoto: file,
    }));
  };
  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error || "Something went wrong",
        severity: "error",
      });
    }
    if (data) {
      setSnackbar({
        open: true,
        message: data.message,
        severity: "success",
      });
    }
  }, [error, data]);
  function handleSave() {
    const workingTimeString = `${selectedDays.join(", ")} from ${
      date.startTime ? dayjs(date.startTime).format("h A") : ""
    } to ${date.endTime ? dayjs(date.endTime).format("h A") : ""}`;
    const formToSend = {
      ...form,
      workingTime: workingTimeString,
    };
    dispatch(profileManagement(formToSend))
      .unwrap()
      .then(() => {
        // Refresh doctor data after successful update
        dispatch(getDataDoctor());
        // Show success message and navigate
        setTimeout(() => {
          navigate("/doctorprofile");
        }, 1000);
      })
      .catch((err) => {
        console.error("Profile update failed:", err);
      });
  }

  useEffect(() => {
    const allEmpty =
      form.fullName.trim() === "" &&
      form.phone.trim() === "" &&
      form.speciality.trim() === "" &&
      form.address.trim() === "" &&
      form.consultationFee.trim() === "" &&
      form.profilePhoto === null &&
      selectedDays.length === 0 &&
      date.startTime === null &&
      date.endTime === null;
    setDisabled(allEmpty);
  }, [form, selectedDays, date]);
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
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2500}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Header */}
        <Fade in timeout={400}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={{ xs: 2, sm: 0 }}
            mb={3}
          >
            <Box
              sx={{
                background: "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                borderRadius: "20px",
                p: { xs: 2, sm: 3 },
                boxShadow: "0 4px 20px rgba(82, 172, 140, 0.3)",
                flex: 1,
                mr: { xs: 0, sm: 2 },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "24px", sm: "28px", md: "32px" },
                  fontWeight: "700",
                  color: "white",
                  mb: 0.5,
                }}
              >
                Edit Profile
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "14px", sm: "16px" },
                  fontWeight: "400",
                  color: "rgba(255, 255, 255, 0.9)",
                }}
              >
                Update your professional information and settings
              </Typography>
            </Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/doctorprofile")}
              sx={{
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6B7280 0%, #4B5563 100%)",
                boxShadow: "0 4px 12px rgba(107, 114, 128, 0.3)",
                whiteSpace: "nowrap",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #4B5563 0%, #374151 100%)",
                  boxShadow: "0 6px 16px rgba(107, 114, 128, 0.4)",
                },
              }}
            >
              Back
            </Button>
          </Stack>
        </Fade>
        {/* Profile Photo */}
        <Fade in timeout={600}>
          <Card
            sx={{
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              mb: 3,
              overflow: "hidden",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(82, 172, 140, 0.2)",
              },
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                alignItems="center"
                mb={4}
              >
                <Box position="relative">
                  <Avatar
                    src={
                      form.profilePhoto
                        ? URL.createObjectURL(form.profilePhoto)
                        : user?.data?.imageUrl || ""
                    }
                    sx={{
                      width: { xs: 120, sm: 140, md: 160 },
                      height: { xs: 120, sm: 140, md: 160 },
                      border: "4px solid white",
                      boxShadow: "0 8px 24px rgba(82, 172, 140, 0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 12px 32px rgba(82, 172, 140, 0.4)",
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      background:
                        "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                      borderRadius: "50%",
                      width: { xs: 32, md: 40 },
                      height: { xs: 32, md: 40 },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(82, 172, 140, 0.4)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <CameraAltIcon
                      sx={{ color: "white", fontSize: { xs: 18, md: 22 } }}
                    />
                  </Box>
                </Box>
                <Box flex={1} textAlign={{ xs: "center", sm: "left" }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "22px", sm: "26px" },
                      fontWeight: "700",
                      color: "primary.main",
                      mb: 1,
                    }}
                  >
                    Profile Photo
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", sm: "16px" },
                      fontWeight: "400",
                      color: "text.secondary",
                      mb: 2,
                    }}
                  >
                    Upload a professional photo to complete your profile
                  </Typography>
                  <input
                    accept="image/*"
                    id="upload-photo"
                    type="file"
                    hidden
                    onChange={handlePhotoChange}
                  />
                  <Button
                    variant="contained"
                    component="label"
                    htmlFor="upload-photo"
                    startIcon={<CameraAltIcon />}
                    sx={{
                      background:
                        "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                      fontSize: { xs: "14px", sm: "16px" },
                      fontWeight: "600",
                      color: "white",
                      textTransform: "none",
                      px: 3,
                      py: 1.5,
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(82, 172, 140, 0.3)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #3D8B6F 0%, #2E6B55 100%)",
                        boxShadow: "0 6px 16px rgba(82, 172, 140, 0.4)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Change Photo
                  </Button>
                </Box>
              </Stack>

              {/* Form */}
              <Box mb={3}>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <PersonIcon sx={{ color: "primary.main", fontSize: 28 }} />
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    color="primary.main"
                  >
                    Personal Information
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 3 }} />
              </Box>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <FormLabel
                    sx={{
                      fontWeight: "600",
                      fontSize: "16px",
                      color: "text.primary",
                      mb: 1,
                      display: "block",
                    }}
                  >
                    Full Name
                  </FormLabel>
                  <TextField
                    fullWidth
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    placeholder="Enter your full name"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />
                </Grid>
                {/* <Grid size={{ xs: 12, md: 6 }}>
              <FormLabel
                sx={{ fontWeight: "400", fontSize: "20px", color: "#555555" }}
              >
                Email
              </FormLabel>
              <TextField
                fullWidth
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Grid> */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormLabel
                    sx={{
                      fontWeight: "600",
                      fontSize: "16px",
                      color: "text.primary",
                      mb: 1,
                      display: "block",
                    }}
                  >
                    Phone Number
                  </FormLabel>
                  <TextField
                    type="number"
                    fullWidth
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormLabel
                    sx={{
                      fontWeight: "600",
                      fontSize: "16px",
                      color: "text.primary",
                      mb: 1,
                      display: "block",
                    }}
                  >
                    Speciality
                  </FormLabel>
                  <TextField
                    select
                    fullWidth
                    value={form.speciality}
                    onChange={(e) =>
                      setForm({ ...form, speciality: e.target.value })
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  >
                    <MenuItem value="Cardiology">Cardiology</MenuItem>
                    <MenuItem value="Dermatology">Dermatology</MenuItem>
                    <MenuItem value="Neurology">Neurology</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormLabel
                    sx={{
                      fontWeight: "600",
                      fontSize: "16px",
                      color: "text.primary",
                      mb: 1,
                      display: "block",
                    }}
                  >
                    Address
                  </FormLabel>
                  <TextField
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    value={form.address}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Complete address with building name, street, and area"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* Working Schedule */}
              <Box mt={5}>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <CalendarTodayIcon
                    sx={{ color: "primary.main", fontSize: 28 }}
                  />
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    color="primary.main"
                  >
                    Working Schedule
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 3 }} />

                <Typography
                  sx={{
                    fontWeight: "600",
                    fontSize: "16px",
                    color: "text.primary",
                    mb: 2,
                  }}
                >
                  Select Working Days
                </Typography>
                <Grid container spacing={2}>
                  {days.map((day) => {
                    const checked = selectedDays.includes(day);
                    return (
                      <Grid
                        key={day}
                        size={{ xs: 6, sm: 4, md: 3, lg: 12 / 7 }}
                      >
                        <Box
                          onClick={() => toggleDay(day)}
                          sx={{
                            height: "100px",
                            borderRadius: "16px",
                            border: "2px solid",
                            borderColor: checked
                              ? "primary.main"
                              : "rgba(0, 0, 0, 0.12)",
                            background: checked
                              ? "linear-gradient(135deg, rgba(82, 172, 140, 0.15) 0%, rgba(82, 172, 140, 0.05) 100%)"
                              : "white",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            transition: "all 0.3s ease",
                            boxShadow: checked
                              ? "0 4px 12px rgba(82, 172, 140, 0.2)"
                              : "0 2px 8px rgba(0, 0, 0, 0.05)",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: checked
                                ? "0 8px 20px rgba(82, 172, 140, 0.3)"
                                : "0 4px 12px rgba(0, 0, 0, 0.1)",
                              borderColor: "primary.main",
                            },
                          }}
                        >
                          <Checkbox
                            checked={checked}
                            sx={{
                              color: "primary.main",
                              "&.Mui-checked": {
                                color: "primary.main",
                              },
                            }}
                          />
                          <Typography
                            fontWeight={checked ? 700 : 500}
                            fontSize={{ xs: "14px", sm: "16px" }}
                            color={checked ? "primary.main" : "text.secondary"}
                          >
                            {day}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>

                <Grid container spacing={3} mt={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormLabel
                      sx={{
                        fontWeight: "600",
                        fontSize: "16px",
                        color: "text.primary",
                        mb: 1,
                        display: "block",
                      }}
                    >
                      Start Time
                    </FormLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        ampm
                        value={date.startTime}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            placeholder: "09:00 AM",
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                                "&:hover fieldset": {
                                  borderColor: "primary.main",
                                },
                              },
                            },
                          },
                        }}
                        onChange={(newValue) =>
                          setdate({ ...date, startTime: newValue })
                        }
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormLabel
                      sx={{
                        fontWeight: "600",
                        fontSize: "16px",
                        color: "text.primary",
                        mb: 1,
                        display: "block",
                      }}
                    >
                      End Time
                    </FormLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        value={date.endTime}
                        onChange={(newValue) =>
                          setdate({ ...date, endTime: newValue })
                        }
                        ampm
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            placeholder: "05:00 PM",
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                                "&:hover fieldset": {
                                  borderColor: "primary.main",
                                },
                              },
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Box>

              {/* Consultation Fee */}
              <Box mt={5}>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <AttachMoneyIcon
                    sx={{ color: "primary.main", fontSize: 28 }}
                  />
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    color="primary.main"
                  >
                    Consultation Fee
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 3 }} />
                <FormLabel
                  sx={{
                    fontWeight: "600",
                    fontSize: "16px",
                    color: "text.primary",
                    mb: 1,
                    display: "block",
                  }}
                >
                  Fee Amount (EGP)
                </FormLabel>
                <TextField
                  fullWidth
                  type="number"
                  value={form.consultationFee}
                  onChange={(e) =>
                    setForm({ ...form, consultationFee: e.target.value })
                  }
                  placeholder="Enter consultation fee"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              </Box>

              <Divider sx={{ my: 5 }} />

              {/* Actions */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="flex-end"
                spacing={2}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate("/doctorprofile")}
                  sx={{
                    color: "text.secondary",
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: "12px",
                    "&:hover": {
                      borderColor: "text.secondary",
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={loading ? null : <SaveIcon />}
                  onClick={handleSave}
                  disabled={disabled || loading}
                  sx={{
                    background:
                      disabled || loading
                        ? "rgba(0, 0, 0, 0.12)"
                        : "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                    color: "white",
                    textTransform: "none",
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: "12px",
                    boxShadow:
                      disabled || loading
                        ? "none"
                        : "0 4px 12px rgba(82, 172, 140, 0.3)",
                    "&:hover": {
                      background:
                        disabled || loading
                          ? "rgba(0, 0, 0, 0.12)"
                          : "linear-gradient(135deg, #3D8B6F 0%, #2E6B55 100%)",
                      boxShadow:
                        disabled || loading
                          ? "none"
                          : "0 6px 16px rgba(82, 172, 140, 0.4)",
                      transform:
                        disabled || loading ? "none" : "translateY(-2px)",
                    },
                    "&.Mui-disabled": {
                      color: "rgba(0, 0, 0, 0.26)",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: "rgba(0, 0, 0, 0.26)",
                      }}
                    />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Fade>
      </Box>
    </Stack>
  );
}
