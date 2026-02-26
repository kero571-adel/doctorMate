import NavBar from "../../components/navBar";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  Chip,
  Divider,
  TextField,
  Stack,
  Card,
  CardContent,
  Fade,
  IconButton,
  Skeleton,
  Alert,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import UploadIcon from "@mui/icons-material/Upload";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ImageIcon from "@mui/icons-material/Image";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import LinkIcon from "@mui/icons-material/Link";
import VideocamIcon from "@mui/icons-material/Videocam";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MedicalRecord from "./medicalRecord";
import AddPrescription from "./Modal/prescriptionModal";
import MedicalModal from "./Modal/MedicalModal";
import AddDiagnosis from "./Modal/diagnosis";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getPatientDetals } from "../../redux/schedule/appoinmantDetals";
import { useSelector, useDispatch } from "react-redux";
import { getAppDetById } from "../../redux/schedule/appoinmantDetals";
//import { setSelectedPatient } from "../../redux/schedule/schedule";
const cardStyle = {
  p: 3,
  borderRadius: "20px",
  backgroundColor: "white",
  boxShadow: "0 4px 20px rgba(82, 172, 140, 0.15)",
  border: "1px solid rgba(82, 172, 140, 0.2)",
};

const statusConfig = {
  completed: {
    label: "Completed",
    bg: "linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%)",
    color: "#6B7280",
  },
  inprogress: {
    label: "In Progress",
    bg: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)",
    color: "#10B981",
  },
  scheduled: {
    label: "Scheduled",
    bg: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)",
    color: "#3B82F6",
  },
  confirmed: {
    label: "Confirmed",
    bg: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
    color: "#F59E0B",
  },
  cancelled: {
    label: "Cancelled",
    bg: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
    color: "#EF4444",
  },
};
export default function AppointmentsDetails() {
  const navigate = useNavigate();
  const [openAddPrescription, setopenAddPrescription] = useState(false);
  const [openMedicalModal, setOpenMedicalModal] = useState(false);
  const [openDiagnosis, setOpenDiagnosis] = useState(false);
  const selectedPatient = useSelector(
    (state) => state.schedule.selectedPatient
  );
  const patientDetails = useSelector((state) => state.patientdet.datapatient);
  console.log("patientDetails: ", patientDetails);
  const appoinDetails = useSelector((state) => state.patientdet.dataApp);
  console.log("appoinDetails: ", appoinDetails?.data);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPatientDetals({ id: selectedPatient?.patient?.id }));
    dispatch(getAppDetById({ id: selectedPatient?.id }));
  }, [selectedPatient]);
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
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

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusStyle = (status) => {
    return statusConfig[status?.toLowerCase()] || statusConfig.scheduled;
  };

  // Mockup DICOM data
  const mockupDicomImages = [
    {
      id: "dicom-1",
      fileName: "Brain MRI Scan",
      description: "Brain MRI with Contrast",
      viewerUrl: "/assets/dashboard/dicom/Rectangle 48.png",
      uploadDate: "2024-12-15",
      size: "2.4 MB",
      type: "MRI",
    },
    {
      id: "dicom-2",
      fileName: "Chest CT Scan",
      description: "Chest CT with IV Contrast",
      viewerUrl: "/assets/dashboard/dicom/Rectangle 49.png",
      uploadDate: "2024-12-12",
      size: "45.2 MB",
      type: "CT-Scan",
    },
    {
      id: "dicom-3",
      fileName: "Chest X-Ray",
      description: "Chest X-Ray PA View",
      viewerUrl: "/assets/dashboard/dicom/Rectangle 50.png",
      uploadDate: "2024-12-10",
      size: "128.7 MB",
      type: "X-Ray",
    },
    {
      id: "dicom-4",
      fileName: "Abdominal CT",
      description: "Abdominal CT Scan",
      viewerUrl: "/assets/dashboard/dicom/Rectangle 51.png",
      uploadDate: "2024-12-08",
      size: "38.5 MB",
      type: "CT-Scan",
    },
    {
      id: "dicom-5",
      fileName: "Spine MRI",
      description: "Lumbar Spine MRI",
      viewerUrl: "/assets/dashboard/dicom/Rectangle 52.png",
      uploadDate: "2024-12-05",
      size: "52.1 MB",
      type: "MRI",
    },
    {
      id: "dicom-6",
      fileName: "Knee X-Ray",
      description: "Bilateral Knee X-Ray",
      viewerUrl: "/assets/dashboard/dicom/Rectangle 54.png",
      uploadDate: "2024-12-01",
      size: "15.3 MB",
      type: "X-Ray",
    },
  ];

  // Use mockup data if medical images are empty
  const displayImages =
    appoinDetails?.data?.medicalImages?.length > 0
      ? appoinDetails.data.medicalImages
      : mockupDicomImages;

  const handleImageClick = (image) => {
    // Navigate to DICOM viewer with image data
    navigate("/dicom/imageViwer", {
      state: { image, allImages: displayImages },
    });
  };

  console.log(
    "appoinDetails?.data?.medicalImages ",
    appoinDetails?.data?.medicalImages
  );
  console.log("appoinDetails?.data? ", appoinDetails?.data);
  return (
    <>
      <AddPrescription
        openAddPrescription={openAddPrescription}
        setopenAddPrescription={setopenAddPrescription}
      />
      <MedicalModal
        openMedicalModal={openMedicalModal}
        SetopenMedicalModal={setOpenMedicalModal}
      />
      <AddDiagnosis
        openDiagnosis={openDiagnosis}
        setopenDiagnosis={setOpenDiagnosis}
      />
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
                    <IconButton
                      onClick={() => navigate(-1)}
                      sx={{
                        color: "white",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                    <Box>
                      <Typography variant="h5" fontWeight="700">
                        Appointment Details
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ opacity: 0.9, mt: 0.5 }}
                      >
                        Complete information about the appointment
                      </Typography>
                    </Box>
                  </Stack>
                  <Avatar
                    src={appoinDetails?.data?.doctorImage}
                    sx={{
                      width: 48,
                      height: 48,
                      border: "3px solid white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    {appoinDetails?.data?.doctorName?.charAt(0) || "D"}
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Fade>

          <Grid container spacing={3}>
            {/* LEFT COLUMN */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Fade in timeout={600}>
                <Card
                  sx={{
                    ...cardStyle,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Header Background */}
                  <Box
                    sx={{
                      background:
                        "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                      width: "100%",
                      height: "120px",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />

                  {/* Patient Avatar & Info */}
                  <Box
                    sx={{ textAlign: "center", position: "relative", pt: 2 }}
                  >
                    <Box
                      sx={{
                        width: "fit-content",
                        position: "relative",
                        mx: "auto",
                      }}
                    >
                      <Avatar
                        src={appoinDetails?.data?.patientImage}
                        sx={{
                          width: 120,
                          height: 120,
                          border: "4px solid white",
                          boxShadow: "0 4px 16px rgba(82, 172, 140, 0.3)",
                        }}
                      >
                        {appoinDetails?.data?.patientName?.charAt(0) || "P"}
                      </Avatar>
                      <CheckCircleIcon
                        sx={{
                          color: "primary.main",
                          fontSize: 32,
                          position: "absolute",
                          bottom: "4px",
                          right: "8px",
                          backgroundColor: "white",
                          borderRadius: "50%",
                        }}
                      />
                    </Box>

                    <Typography
                      mt={2}
                      variant="h4"
                      fontWeight="700"
                      color="primary.main"
                    >
                      {appoinDetails?.data?.patientName || "N/A"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight="500"
                      mt={0.5}
                    >
                      ID: #{appoinDetails?.data?.patientId?.slice(-6)}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      mt={2}
                      justifyContent="center"
                      flexWrap="wrap"
                    >
                      <Chip
                        icon={<PersonIcon sx={{ fontSize: 16 }} />}
                        label={`${appoinDetails?.data?.patientAge}y`}
                        size="small"
                        sx={{
                          borderRadius: "8px",
                          fontWeight: 600,
                          bgcolor: "rgba(59, 130, 246, 0.1)",
                          color: "#3B82F6",
                          border: "1px solid #3B82F6",
                        }}
                      />
                      <Chip
                        label={appoinDetails?.data?.patientGender}
                        size="small"
                        sx={{
                          borderRadius: "8px",
                          fontWeight: 600,
                          bgcolor: "rgba(236, 72, 153, 0.1)",
                          color: "#EC4899",
                          border: "1px solid #EC4899",
                          textTransform: "capitalize",
                        }}
                      />
                      {patientDetails?.data?.basicInfo?.bloodType && (
                        <Chip
                          label={patientDetails?.data?.basicInfo?.bloodType}
                          size="small"
                          sx={{
                            borderRadius: "8px",
                            fontWeight: 600,
                            bgcolor: "rgba(139, 92, 246, 0.1)",
                            color: "#8B5CF6",
                            border: "1px solid #8B5CF6",
                          }}
                        />
                      )}
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Contact Information */}
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        backgroundColor: "rgba(82, 172, 140, 0.05)",
                        borderRadius: "12px",
                        p: 2,
                        border: "1px solid rgba(82, 172, 140, 0.2)",
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
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
                          }}
                        >
                          <PhoneIcon sx={{ fontSize: 20, color: "white" }} />
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="500"
                          >
                            Phone Number
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            color="primary.main"
                          >
                            {appoinDetails?.data?.patientPhone || "N/A"}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <Box
                      sx={{
                        backgroundColor: "rgba(82, 172, 140, 0.05)",
                        borderRadius: "12px",
                        p: 2,
                        border: "1px solid rgba(82, 172, 140, 0.2)",
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
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
                          }}
                        >
                          <EmailIcon sx={{ fontSize: 20, color: "white" }} />
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="500"
                          >
                            Email Address
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            color="primary.main"
                          >
                            {patientDetails?.data?.basicInfo?.email || "N/A"}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <Box
                      sx={{
                        backgroundColor: "rgba(82, 172, 140, 0.05)",
                        borderRadius: "12px",
                        p: 2,
                        border: "1px solid rgba(82, 172, 140, 0.2)",
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
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
                          }}
                        >
                          <LocationOnIcon
                            sx={{ fontSize: 20, color: "white" }}
                          />
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="500"
                          >
                            Location
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            color="primary.main"
                          >
                            New York, NY
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Card>
              </Fade>

              {/* Appointment Summary Card */}
              <Fade in timeout={700}>
                <Card sx={{ ...cardStyle, mt: 3 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="700"
                      color="primary.main"
                    >
                      Appointment Summary
                    </Typography>
                    {appoinDetails?.data?.status && (
                      <Chip
                        label={
                          getStatusStyle(appoinDetails?.data?.status).label
                        }
                        sx={{
                          background: getStatusStyle(
                            appoinDetails?.data?.status
                          ).bg,
                          color: getStatusStyle(appoinDetails?.data?.status)
                            .color,
                          fontWeight: 700,
                          fontSize: "12px",
                        }}
                      />
                    )}
                  </Stack>

                  <Stack spacing={3}>
                    {/* Date & Time */}
                    <Box>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "12px",
                            background:
                              "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CalendarTodayIcon
                            sx={{ color: "#3B82F6", fontSize: 24 }}
                          />
                        </Box>
                        <Box flex={1}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="600"
                          >
                            Date & Time
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="700"
                            color="primary.main"
                          >
                            {formatDate(appoinDetails?.data?.scheduledStart)}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight="500"
                          >
                            {formatTime(appoinDetails?.data?.scheduledStart)} -{" "}
                            {formatTime(appoinDetails?.data?.scheduledEnd)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <Divider />

                    {/* Doctor Info */}
                    <Box>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "12px",
                            background:
                              "linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(236, 72, 153, 0.1) 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <LocalHospitalIcon
                            sx={{ color: "#EC4899", fontSize: 24 }}
                          />
                        </Box>
                        <Box flex={1}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="600"
                          >
                            Healthcare Provider
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="700"
                            color="primary.main"
                          >
                            Dr. {appoinDetails?.data?.doctorName}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight="500"
                          >
                            {appoinDetails?.data?.specialty}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <Divider />

                    {/* Visit Type */}
                    <Box>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "12px",
                            background:
                              "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MedicalServicesIcon
                            sx={{ color: "#8B5CF6", fontSize: 24 }}
                          />
                        </Box>
                        <Box flex={1}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="600"
                          >
                            Reason for Visit
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="700"
                            color="primary.main"
                          >
                            {appoinDetails?.data?.reason}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight="500"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {appoinDetails?.data?.appointmentType} Call • $
                            {appoinDetails?.data?.price}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Card>
              </Fade>
            </Grid>

            {/* MIDDLE COLUMN */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Fade in timeout={600}>
                <Stack spacing={3}>
                  {/* Medical Records Card */}
                  <Card sx={cardStyle}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={3}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "10px",
                            background:
                              "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <NoteAddIcon sx={{ color: "white", fontSize: 20 }} />
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight="700"
                          color="primary.main"
                        >
                          Medical Records
                        </Typography>
                      </Stack>
                      <Button
                        onClick={() => setOpenMedicalModal(true)}
                        startIcon={<AddIcon />}
                        sx={{
                          textTransform: "none",
                          color: "primary.main",
                          fontWeight: 600,
                          fontSize: "13px",
                          "&:hover": {
                            backgroundColor: "rgba(82, 172, 140, 0.05)",
                          },
                        }}
                      >
                        Add Record
                      </Button>
                    </Stack>

                    {appoinDetails?.data?.medicalRecord ? (
                      <Box
                        sx={{
                          p: 2.5,
                          background:
                            "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)",
                          border: "1px solid rgba(139, 92, 246, 0.2)",
                          borderRadius: "12px",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 16px rgba(139, 92, 246, 0.15)",
                          },
                        }}
                      >
                        <Typography
                          variant="body1"
                          fontWeight="700"
                          color="#8B5CF6"
                          mb={0.5}
                        >
                          {appoinDetails?.data?.medicalRecord?.title}
                        </Typography>
                        <Chip
                          label={appoinDetails?.data?.medicalRecord?.recordType}
                          size="small"
                          sx={{
                            height: "20px",
                            fontSize: "11px",
                            fontWeight: 600,
                            backgroundColor: "rgba(139, 92, 246, 0.1)",
                            color: "#8B5CF6",
                            border: "none",
                            textTransform: "capitalize",
                            mt: 0.5,
                          }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight="500"
                          display="block"
                          mt={1.5}
                        >
                          Date:{" "}
                          {formatDate(
                            appoinDetails?.data?.medicalRecord?.recordDate
                          )}
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          p: 3,
                          textAlign: "center",
                          backgroundColor: "rgba(82, 172, 140, 0.05)",
                          borderRadius: "12px",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          No medical records added yet
                        </Typography>
                      </Box>
                    )}
                  </Card>

                  {/* Diagnoses */}
                  <Card sx={cardStyle}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={3}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "10px",
                            background:
                              "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MedicalServicesIcon
                            sx={{ color: "white", fontSize: 20 }}
                          />
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight="700"
                          color="primary.main"
                        >
                          Current Diagnoses
                        </Typography>
                      </Stack>
                      <Button
                        onClick={() => setOpenDiagnosis(true)}
                        startIcon={<AddIcon />}
                        sx={{
                          textTransform: "none",
                          color: "primary.main",
                          fontWeight: 600,
                          fontSize: "13px",
                          "&:hover": {
                            backgroundColor: "rgba(82, 172, 140, 0.05)",
                          },
                        }}
                      >
                        Add New
                      </Button>
                    </Stack>

                    {appoinDetails?.data?.diagnoses &&
                    appoinDetails?.data?.diagnoses.length > 0 ? (
                      appoinDetails?.data?.diagnoses.map((item, index) => (
                        <Box
                          key={item?.id}
                          sx={{
                            p: 2.5,
                            mb: 2,
                            background:
                              "linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%)",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            borderRadius: "12px",
                            position: "relative",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 16px rgba(239, 68, 68, 0.15)",
                            },
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                          >
                            <Box flex={1}>
                              <Typography
                                variant="body1"
                                fontWeight="700"
                                color="error.main"
                                mb={0.5}
                              >
                                {item.description}
                              </Typography>
                              {item.icdCode && (
                                <Chip
                                  label={`ICD: ${item.icdCode}`}
                                  size="small"
                                  sx={{
                                    height: "20px",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                                    color: "error.main",
                                    border: "none",
                                    mr: 1,
                                    mt: 0.5,
                                  }}
                                />
                              )}
                              {item.severity && (
                                <Chip
                                  label={item.severity}
                                  size="small"
                                  sx={{
                                    height: "20px",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    backgroundColor:
                                      item.severity === "High"
                                        ? "rgba(239, 68, 68, 0.2)"
                                        : "rgba(251, 191, 36, 0.2)",
                                    color:
                                      item.severity === "High"
                                        ? "error.main"
                                        : "#F59E0B",
                                    border: "none",
                                    mt: 0.5,
                                    textTransform: "capitalize",
                                  }}
                                />
                              )}
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                fontWeight="500"
                                display="block"
                                mt={1.5}
                              >
                                Diagnosed: {formatDate(item.createdAt)}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "8px",
                                backgroundColor: "rgba(239, 68, 68, 0.15)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                ml: 2,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "16px",
                                  fontWeight: "700",
                                  color: "error.main",
                                }}
                              >
                                !
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      ))
                    ) : (
                      <Box
                        sx={{
                          p: 3,
                          textAlign: "center",
                          backgroundColor: "rgba(82, 172, 140, 0.05)",
                          borderRadius: "12px",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          No diagnoses recorded yet
                        </Typography>
                      </Box>
                    )}

                    <Stack width="100%" alignItems="flex-end" mt={2}>
                      <Button
                        sx={{
                          textTransform: "none",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "primary.main",
                          "&:hover": {
                            backgroundColor: "rgba(82, 172, 140, 0.05)",
                          },
                        }}
                      >
                        View History
                      </Button>
                    </Stack>
                  </Card>

                  {/* Medical Images */}
                  <Card sx={{ ...cardStyle, mt: 3 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={3}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "10px",
                            background:
                              "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ImageIcon sx={{ color: "white", fontSize: 20 }} />
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight="700"
                          color="primary.main"
                        >
                          Medical Images
                        </Typography>
                      </Stack>
                      <Button
                        size="small"
                        startIcon={<UploadIcon />}
                        variant="contained"
                        sx={{
                          textTransform: "none",
                          color: "white",
                          background:
                            "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                          fontWeight: 600,
                          fontSize: "13px",
                          px: 2,
                          py: 0.75,
                          borderRadius: "10px",
                          boxShadow: "0 4px 12px rgba(82, 172, 140, 0.3)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #3D8B6F 0%, #2E6B55 100%)",
                            boxShadow: "0 6px 16px rgba(82, 172, 140, 0.4)",
                          },
                        }}
                        onClick={() => navigate("/medicalimaging")}
                      >
                        Upload
                      </Button>
                    </Stack>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(110px, 1fr))",
                        gap: 2,
                      }}
                    >
                      {displayImages?.map((item) => (
                        <Box
                          key={item.id}
                          onClick={() => handleImageClick(item)}
                          sx={{
                            width: "100%",
                            paddingTop: "100%", // 1:1 aspect ratio
                            position: "relative",
                            overflow: "hidden",
                            borderRadius: "12px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            "&:hover": {
                              transform: "scale(1.05)",
                              boxShadow: "0 4px 16px rgba(82, 172, 140, 0.3)",
                            },
                          }}
                        >
                          <img
                            src={item.viewerUrl}
                            alt={item.fileName || item.description}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          {item.description && (
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background:
                                  "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                                color: "white",
                                padding: "8px",
                                fontSize: "10px",
                                fontWeight: 600,
                              }}
                            >
                              {item.description}
                            </Box>
                          )}
                        </Box>
                      ))}

                      <Box
                        onClick={() => navigate("/medicalimaging")}
                        sx={{
                          width: "100%",
                          paddingTop: "100%",
                          position: "relative",
                          borderRadius: "12px",
                          border: "2px dashed rgba(82, 172, 140, 0.3)",
                          backgroundColor: "rgba(82, 172, 140, 0.05)",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: "rgba(82, 172, 140, 0.1)",
                            borderColor: "rgba(82, 172, 140, 0.5)",
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            textAlign: "center",
                          }}
                        >
                          <AddAPhotoIcon
                            sx={{
                              fontSize: 32,
                              color: "primary.main",
                              mb: 0.5,
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: "primary.main",
                              fontWeight: 600,
                              display: "block",
                            }}
                          >
                            Add Image
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Card>

                  {/* Prescriptions */}
                  <Card sx={{ ...cardStyle, mt: 3 }}>
                    {/* Header */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={3}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "10px",
                            background:
                              "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <LinkIcon sx={{ color: "white", fontSize: 20 }} />
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight="700"
                          color="primary.main"
                        >
                          Prescriptions
                        </Typography>
                      </Stack>

                      <Button
                        onClick={() => setopenAddPrescription(true)}
                        startIcon={<AddIcon />}
                        sx={{
                          textTransform: "none",
                          color: "#10B981",
                          fontWeight: 600,
                          fontSize: "13px",
                          "&:hover": {
                            backgroundColor: "rgba(16, 185, 129, 0.05)",
                          },
                        }}
                      >
                        Add New
                      </Button>
                    </Stack>

                    {/* Table Header */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 2fr 1fr",
                        gap: 2,
                        pb: 2,
                        borderBottom: "2px solid rgba(82, 172, 140, 0.1)",
                      }}
                    >
                      <Typography
                        fontWeight={700}
                        fontSize="12px"
                        color="text.secondary"
                        letterSpacing="0.5px"
                      >
                        MEDICATION
                      </Typography>
                      <Typography
                        fontWeight={700}
                        fontSize="12px"
                        color="text.secondary"
                        letterSpacing="0.5px"
                      >
                        DOSAGE
                      </Typography>
                      <Typography
                        fontWeight={700}
                        fontSize="12px"
                        color="text.secondary"
                        letterSpacing="0.5px"
                      >
                        FREQUENCY
                      </Typography>
                      <Typography
                        fontWeight={700}
                        fontSize="12px"
                        color="text.secondary"
                        letterSpacing="0.5px"
                      >
                        STATUS
                      </Typography>
                    </Box>

                    {/* Rows */}
                    <Stack spacing={0} mt={2}>
                      {appoinDetails?.data?.prescriptions?.map((prescription) =>
                        prescription?.medications?.map((item, index) => (
                          <Box
                            key={item.id || index}
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "2fr 1fr 2fr 1fr",
                              gap: 2,
                              alignItems: "center",
                              py: 2,
                              borderBottom:
                                "1px solid rgba(82, 172, 140, 0.05)",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                backgroundColor: "rgba(82, 172, 140, 0.03)",
                                borderRadius: "8px",
                              },
                            }}
                          >
                            <Typography
                              fontWeight={600}
                              fontSize="13px"
                              color="primary.main"
                            >
                              {item.drugName}
                            </Typography>
                            <Typography
                              fontWeight={500}
                              fontSize="13px"
                              color="text.secondary"
                            >
                              {item.dosage}
                            </Typography>
                            <Typography
                              fontWeight={500}
                              fontSize="13px"
                              color="text.secondary"
                            >
                              {item.frequency}
                            </Typography>

                            <Chip
                              label="Active"
                              size="small"
                              sx={{
                                width: "fit-content",
                                height: "24px",
                                backgroundColor: "rgba(59, 130, 246, 0.1)",
                                color: "#1D4ED8",
                                fontWeight: 600,
                                fontSize: "11px",
                                border: "1px solid #1D4ED8",
                              }}
                            />
                          </Box>
                        ))
                      )}
                    </Stack>

                    {/* Footer */}
                    <Stack width="100%" alignItems="flex-end" mt={3}>
                      <Button
                        sx={{
                          textTransform: "none",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#10B981",
                          "&:hover": {
                            backgroundColor: "rgba(16, 185, 129, 0.05)",
                          },
                        }}
                      >
                        View History
                      </Button>
                    </Stack>
                  </Card>
                </Stack>
              </Fade>
            </Grid>

            {/* RIGHT COLUMN */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Fade in timeout={700}>
                <Stack spacing={3}>
                  {/**Session */}
                  <Card sx={cardStyle}>
                    {/* Header */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={4}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="700"
                        color="primary.main"
                      >
                        Session
                      </Typography>

                      {/* Online Dot */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: "#22C55E",
                            boxShadow: "0 0 8px rgba(34, 197, 94, 0.5)",
                            animation: "pulse 2s infinite",
                            "@keyframes pulse": {
                              "0%, 100%": { opacity: 1 },
                              "50%": { opacity: 0.5 },
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          color="#22C55E"
                        >
                          Online
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Timer */}
                    <Box textAlign="center" mb={4}>
                      <Typography
                        sx={{
                          fontSize: "56px",
                          fontWeight: "700",
                          background:
                            "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          lineHeight: 1,
                        }}
                      >
                        10:01
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          mt: 1,
                          fontWeight: 500,
                        }}
                      >
                        Elapsed Time
                      </Typography>
                    </Box>

                    {/* Buttons */}
                    <Stack spacing={2}>
                      <Button
                        fullWidth
                        startIcon={<VideocamIcon />}
                        sx={{
                          py: 1.8,
                          borderRadius: "12px",
                          textTransform: "none",
                          fontSize: "15px",
                          fontWeight: 600,
                          background:
                            "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                          color: "white",
                          boxShadow: "0 4px 16px rgba(82, 172, 140, 0.3)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #3D8B6F 0%, #2E6B55 100%)",
                            boxShadow: "0 6px 20px rgba(82, 172, 140, 0.4)",
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        Start Video Call
                      </Button>

                      <Button
                        fullWidth
                        startIcon={<ChatBubbleOutlineIcon />}
                        sx={{
                          py: 1.8,
                          borderRadius: "12px",
                          textTransform: "none",
                          fontSize: "15px",
                          fontWeight: 600,
                          border: "2px solid #52AC8C",
                          color: "primary.main",
                          backgroundColor: "white",
                          "&:hover": {
                            backgroundColor: "rgba(82, 172, 140, 0.05)",
                            borderColor: "#3D8B6F",
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        Join Chat
                      </Button>
                    </Stack>
                  </Card>

                  {/**Quick Notes */}
                  <Card sx={cardStyle}>
                    {/* Header */}
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      mb={3}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "10px",
                          background:
                            "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <StickyNote2Icon
                          sx={{ color: "white", fontSize: 20 }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        fontWeight="700"
                        color="primary.main"
                      >
                        Quick Notes
                      </Typography>
                    </Stack>

                    {/* Text Area */}
                    <TextField
                      multiline
                      fullWidth
                      rows={10}
                      placeholder="Write quick observations here..."
                      variant="outlined"
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#FEF3C7",
                          borderRadius: "14px",
                          fontWeight: 500,
                          fontSize: "14px",
                          "& fieldset": {
                            border: "2px solid #FDE68A",
                          },
                          "&:hover fieldset": {
                            borderColor: "#FCD34D",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#F59E0B",
                          },
                        },
                        "& textarea::placeholder": {
                          color: "#92400E",
                          opacity: 0.6,
                        },
                      }}
                    />

                    {/* Save Button */}
                    <Stack direction="row" justifyContent="flex-end">
                      <Button
                        sx={{
                          px: 4,
                          py: 1.2,
                          borderRadius: "10px",
                          textTransform: "none",
                          fontWeight: 600,
                          background:
                            "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                          color: "white",
                          boxShadow: "0 4px 12px rgba(82, 172, 140, 0.3)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #3D8B6F 0%, #2E6B55 100%)",
                            boxShadow: "0 6px 16px rgba(82, 172, 140, 0.4)",
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        Save Note
                      </Button>
                    </Stack>
                  </Card>

                  {/**NEXT PATIENT */}
                  <Card sx={cardStyle}>
                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: "12px",
                        fontWeight: "700",
                        letterSpacing: "0.5px",
                        mb: 2,
                      }}
                    >
                      NEXT PATIENT
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src="https://i.pravatar.cc/150?img=5"
                        sx={{
                          width: 56,
                          height: 56,
                          border: "3px solid rgba(82, 172, 140, 0.2)",
                        }}
                      />
                      <Box flex={1}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "15px",
                            fontWeight: "700",
                            color: "primary.main",
                          }}
                        >
                          John Doe
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "text.secondary",
                            mt: 0.5,
                          }}
                        >
                          11:00 AM · Follow-up
                        </Typography>
                      </Box>
                      <IconButton
                        sx={{
                          backgroundColor: "rgba(82, 172, 140, 0.1)",
                          "&:hover": {
                            backgroundColor: "rgba(82, 172, 140, 0.2)",
                          },
                        }}
                      >
                        <ArrowForwardIcon sx={{ color: "primary.main" }} />
                      </IconButton>
                    </Stack>
                  </Card>
                </Stack>
              </Fade>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </>
  );
}
