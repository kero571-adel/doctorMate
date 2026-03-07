import NavBar from "../../components/navBar";
import React from "react";
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
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Skeleton,
  Alert,
  alpha,
  Tooltip,
  InputAdornment,
  useTheme,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
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
import MedicalRecord from "../schedule/medicalRecord";
import AddPrescription from "../schedule/Modal/prescriptionModal";
import MedicalModal from "../schedule/Modal/MedicalModal";
import AddDiagnosis from "../schedule/Modal/diagnosis";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getPatientDetals } from "../../redux/schedule/appoinmantDetals";
import { getPatientDetals2 } from "../../redux/schedule/appoinmantDetals";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/imageViwer/data";
import { setMediclImage } from "../../redux/imageViwer/data";
import { setpatientDet } from "../../redux/patientList/patientList";
import { setpatientDet2 } from "../../redux/patientList/patientList";
const cardStyle = {
  p: { xs: 2, sm: 3 },
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

const getStatusColor = (status, theme) => {
  switch (status) {
    case "Completed":
      return {
        bg: alpha(theme.palette.success.main, 0.1),
        color: theme.palette.success.main,
      };
    case "Scheduled":
      return {
        bg: alpha(theme.palette.info.main, 0.1),
        color: theme.palette.info.main,
      };
    case "No Show":
      return {
        bg: alpha(theme.palette.error.main, 0.1),
        color: theme.palette.error.main,
      };
    case "Active":
      return {
        bg: alpha(theme.palette.success.main, 0.1),
        color: theme.palette.success.main,
      };
    default:
      return {
        bg: alpha(theme.palette.grey[500], 0.1),
        color: theme.palette.grey[600],
      };
  }
};

export default function Patients() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // States for Modals
  const [openAddPrescription, setopenAddPrescription] = useState(false);
  const [openMedicalModal, setOpenMedicalModal] = useState(false);
  const [openDiagnosis, setOpenDiagnosis] = useState(false);
  // ✅ States for Show More/Less (Maximum 6 items)
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [showAllDiagnoses, setShowAllDiagnoses] = useState(false);
  const [showAllPrescriptions, setShowAllPrescriptions] = useState(false);
  const ITEM_LIMIT = 4;
  const pateintDet = useSelector((state) => state.patients.patientDet);
  const pateintDet2 = useSelector((state) => state.patients.patientDet2);
  const patientDetails = useSelector((state) => state.patientdet.datapatient);
  const patientDetails2 = useSelector((state) => state.patientdet.datapatient2);
  const { patients } = useSelector((state) => state.patients);
  console.log("patients", patients);
  function handleNextPatientClick() {
    dispatch(setpatientDet(patientDetails2.data.basicInfo));
    for (let index = 0; index < patients.length; index++) {
      if (patients[index].id === patientDetails2?.data?.basicInfo?.id) {
        dispatch(setpatientDet2(patients[index + 1]));
        return;
      }
    }
  }
  // المريض الحالي
  useEffect(() => {
    if (pateintDet?.id) {
      dispatch(getPatientDetals({ id: pateintDet.id }));
    }
  }, [pateintDet]);

  // المريض التالي
  useEffect(() => {
    if (pateintDet2?.id) {
      dispatch(getPatientDetals2({ id: pateintDet2.id }));
    }
  }, [pateintDet2]);
  useEffect(() => {
    if (patientDetails) {
      dispatch(setUserInfo(patientDetails?.data?.basicInfo));
      dispatch(setMediclImage(patientDetails?.data?.medicalImages));
    }
  }, [patientDetails]);

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

  // ✅ Prepare Data with Limits
  const records = patientDetails?.data?.medicalRecords || [];
  const visibleRecords = showAllRecords
    ? records
    : records.slice(0, ITEM_LIMIT);

  const diagnoses = patientDetails?.data?.diagnoses || [];
  const visibleDiagnoses = showAllDiagnoses
    ? diagnoses
    : diagnoses.slice(0, ITEM_LIMIT);

  // Flatten prescriptions to count medications individually
  const allMedications =
    patientDetails?.data?.prescriptions?.flatMap((p) => p.medications) || [];
  const visibleMedications = showAllPrescriptions
    ? allMedications
    : allMedications.slice(0, ITEM_LIMIT);

  const displayImages = patientDetails?.data?.medicalImages;
  const handleImageClick = (image) => {
    navigate("/dicom/imageViwer", {
      state: { image, allImages: displayImages },
    });
  };

  return (
    <>
      <AddPrescription
        openAddPrescription={openAddPrescription}
        setopenAddPrescription={setopenAddPrescription}
      />
      <MedicalModal
        openMedicalModal={openMedicalModal}
        SetopenMedicalModal={setOpenMedicalModal}
        id={patientDetails?.data?.basicInfo?.id}
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
            padding: { xs: "10px", sm: "20px" },
            height: "100vh",
            overflowY: "auto",
            flex: 1,
            width: "100%",
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
                  width: { xs: "150px", sm: "300px" },
                  height: { xs: "150px", sm: "300px" },
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.08)",
                  transform: "translate(30%, -50%)",
                },
              }}
            >
              <CardContent
                sx={{
                  p: { xs: 2, sm: 3 },
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <IconButton
                      onClick={() => navigate(-1)}
                      sx={{
                        color: "white",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.3)",
                        },
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                    <Box>
                      <Typography
                        variant="h5"
                        fontWeight="700"
                        fontSize={{ xs: "18px", sm: "24px" }}
                      >
                        Patient Details
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ opacity: 0.9, mt: 0.5 }}
                        fontSize={{ xs: "12px", sm: "14px" }}
                      >
                        Complete information about the appointment
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Fade>
          <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
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
                      height: { xs: "100px", sm: "120px" },
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />
                  {/* Patient Avatar & Info */}
                  <Box
                    sx={{
                      textAlign: "center",
                      position: "relative",
                      pt: { xs: 1, sm: 2 },
                    }}
                  >
                    <Box
                      sx={{
                        width: "fit-content",
                        position: "relative",
                        mx: "auto",
                      }}
                    >
                      <Avatar
                        src={patientDetails?.data?.basicInfo?.imageUrl}
                        sx={{
                          width: { xs: 100, sm: 120 },
                          height: { xs: 100, sm: 120 },
                          border: "4px solid white",
                          boxShadow: "0 4px 16px rgba(82, 172, 140, 0.3)",
                        }}
                      >
                        {patientDetails?.data?.basicInfo?.name?.charAt(0) ||
                          "P"}
                      </Avatar>
                      <CheckCircleIcon
                        sx={{
                          color: "primary.main",
                          fontSize: { xs: 24, sm: 32 },
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
                      fontSize={{ xs: "20px", sm: "28px" }}
                      sx={{ wordBreak: "break-word" }}
                    >
                      {patientDetails?.data?.basicInfo?.name || "N/A"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight="500"
                      mt={0.5}
                      fontSize={{ xs: "12px", sm: "14px" }}
                    >
                      ID: #{patientDetails?.data?.basicInfo?.id?.slice(-6)}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      mt={2}
                      justifyContent="center"
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {patientDetails?.data?.basicInfo?.age && (
                        <Chip
                          icon={<PersonIcon sx={{ fontSize: 16 }} />}
                          label={`${patientDetails?.data?.basicInfo?.age}y`}
                          size="small"
                          sx={{
                            borderRadius: "8px",
                            fontWeight: 600,
                            bgcolor: "rgba(59, 130, 246, 0.1)",
                            color: "#3B82F6",
                            border: "1px solid #3B82F6",
                          }}
                        />
                      )}
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
                            flexShrink: 0,
                          }}
                        >
                          <PhoneIcon sx={{ fontSize: 20, color: "white" }} />
                        </Box>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="500"
                            fontSize={{ xs: "10px", sm: "12px" }}
                          >
                            Phone Number
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            color="primary.main"
                            fontSize={{ xs: "12px", sm: "14px" }}
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {patientDetails?.data?.basicInfo?.phone || "N/A"}
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
                            flexShrink: 0,
                          }}
                        >
                          <EmailIcon sx={{ fontSize: 20, color: "white" }} />
                        </Box>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="500"
                            fontSize={{ xs: "10px", sm: "12px" }}
                          >
                            Email Address
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            color="primary.main"
                            fontSize={{ xs: "12px", sm: "14px" }}
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
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
                            flexShrink: 0,
                          }}
                        >
                          <LocationOnIcon
                            sx={{ fontSize: 20, color: "white" }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="500"
                            fontSize={{ xs: "10px", sm: "12px" }}
                          >
                            Location
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            color="primary.main"
                            fontSize={{ xs: "12px", sm: "14px" }}
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            New York, NY
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Card>
              </Fade>
              {/* Appointment History */}
              <Paper
                sx={{
                  p: 2,
                  mt: 2,
                  width: "100%",
                  borderRadius: "15px",
                  boxShadow: "0 4px 20px rgba(82, 172, 140, 0.15)",
                  maxHeight: { xs: "300px", sm: "400px" },
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    fontWeight="bold"
                    fontSize={{ xs: "14px", sm: "16px" }}
                  >
                    Appointment History
                  </Typography>
                  <Button
                    size="small"
                    sx={{ color: "primary.main", fontSize: "12px" }}
                  >
                    View All
                  </Button>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: "#898989",
                            fontWeight: 600,
                            fontSize: { xs: "10px", sm: "11px" },
                            whiteSpace: "nowrap",
                          }}
                        >
                          DATE
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#898989",
                            fontWeight: 600,
                            fontSize: { xs: "10px", sm: "11px" },
                            whiteSpace: "nowrap",
                          }}
                        >
                          DOCTOR
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#898989",
                            fontWeight: 600,
                            fontSize: { xs: "10px", sm: "11px" },
                            whiteSpace: "nowrap",
                          }}
                        >
                          TYPE
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#898989",
                            fontWeight: 600,
                            fontSize: { xs: "10px", sm: "11px" },
                            whiteSpace: "nowrap",
                          }}
                        >
                          STATUS
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {patientDetails?.data?.appointments.map((apt) => (
                        <TableRow key={apt.id} hover>
                          <TableCell
                            sx={{
                              fontSize: { xs: "9px", sm: "10px" },
                              fontWeight: "400",
                              padding: "2px 7px ",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatDate(apt.date)}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: { xs: "9px", sm: "11px" },
                              fontWeight: "500",
                              color: "#898989",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {apt.doctor ? apt.doctor : "N/A"}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: { xs: "9px", sm: "11px" },
                              fontWeight: "500",
                              color: "#898989",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {apt.reason}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={apt.status}
                              size="small"
                              sx={{
                                borderRadius: "8px",
                                bgcolor: getStatusColor(apt.status, theme).bg,
                                color: getStatusColor(apt.status, theme).color,
                                fontWeight: 400,
                                fontSize: { xs: "7px", sm: "8px" },
                                minWidth: "50px",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            {/* MIDDLE COLUMN */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Fade in timeout={600}>
                <Stack spacing={3}>
                  {/* Medical Records Card */}
                  <Card sx={cardStyle}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      mb={3}
                      spacing={2}
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
                            flexShrink: 0,
                          }}
                        >
                          <NoteAddIcon sx={{ color: "white", fontSize: 20 }} />
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight="700"
                          color="primary.main"
                          fontSize={{ xs: "16px", sm: "18px" }}
                        >
                          Medical Records
                        </Typography>
                      </Stack>
                    </Stack>
                    {visibleRecords.length > 0 ? (
                      visibleRecords.map((record) => (
                        <Box
                          key={record?.id}
                          sx={{
                            p: 2.5,
                            mb: 1,
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
                            fontSize={{ xs: "14px", sm: "16px" }}
                          >
                            {record?.title}
                          </Typography>
                          <Chip
                            label={record?.recordType}
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
                            fontSize={{ xs: "11px", sm: "12px" }}
                          >
                            Date: {formatDate(record?.recordDate)}
                          </Typography>
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
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontSize={{ xs: "12px", sm: "14px" }}
                        >
                          No medical records added yet
                        </Typography>
                      </Box>
                    )}
                    {/* ✅ Show More/Less Button for Records */}
                    {records.length > ITEM_LIMIT && (
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          onClick={() => setShowAllRecords(!showAllRecords)}
                          sx={{
                            textTransform: "none",
                            fontSize: { xs: "12px", sm: "13px" },
                            fontWeight: 600,
                            color: "primary.main",
                            "&:hover": {
                              backgroundColor: "rgba(82, 172, 140, 0.05)",
                            },
                          }}
                        >
                          {showAllRecords ? "Show Less" : "Show More"}
                        </Button>
                      </Box>
                    )}
                  </Card>
                  {/* Diagnoses */}
                  <Card sx={cardStyle}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      mb={3}
                      spacing={1}
                    >
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
                          flexShrink: 0,
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
                        fontSize={{ xs: "16px", sm: "18px" }}
                      >
                        Current Diagnoses
                      </Typography>
                    </Stack>
                    {visibleDiagnoses.length > 0 ? (
                      visibleDiagnoses.map((item) => (
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
                            direction={{ xs: "column", sm: "row" }}
                            justifyContent="space-between"
                            alignItems="flex-start"
                            spacing={1}
                          >
                            <Box flex={1} width="100%">
                              <Typography
                                variant="body1"
                                fontWeight="700"
                                color="error.main"
                                mb={0.5}
                                fontSize={{ xs: "14px", sm: "16px" }}
                              >
                                {item.description}
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                useFlexGap
                              >
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
                              </Stack>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                fontWeight="500"
                                display="block"
                                mt={1.5}
                                fontSize={{ xs: "11px", sm: "12px" }}
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
                                ml: { xs: 0, sm: 2 },
                                mt: { xs: 1, sm: 0 },
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
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontSize={{ xs: "12px", sm: "14px" }}
                        >
                          No diagnoses recorded yet
                        </Typography>
                      </Box>
                    )}
                    {/* ✅ Show More/Less Button for Diagnoses */}
                    {diagnoses.length > ITEM_LIMIT && (
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          onClick={() => setShowAllDiagnoses(!showAllDiagnoses)}
                          sx={{
                            textTransform: "none",
                            fontSize: { xs: "12px", sm: "13px" },
                            fontWeight: 600,
                            color: "primary.main",
                            "&:hover": {
                              backgroundColor: "rgba(82, 172, 140, 0.05)",
                            },
                          }}
                        >
                          {showAllDiagnoses ? "Show Less" : "Show More"}
                        </Button>
                      </Box>
                    )}
                  </Card>
                  {/* Medical Images */}
                  <Card sx={{ ...cardStyle, mt: 3 }}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      mb={3}
                      spacing={2}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: "10px",
                            background:
                              "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <ImageIcon sx={{ color: "white", fontSize: 20 }} />
                        </Box>
                        <Typography
                          fontWeight="700"
                          color="primary.main"
                          fontSize={{ xs: "9px", sm: "12px", md: "18px" }}
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
                          fontSize: { xs: "12px", sm: "13px" },
                          px: 2,
                          py: 0.75,
                          borderRadius: "10px",
                          boxShadow: "0 4px 12px rgba(82, 172, 140, 0.3)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #3D8B6F 0%, #2E6B55 100%)",
                            boxShadow: "0 6px 16px rgba(82, 172, 140, 0.4)",
                          },
                          width: { xs: "100%", sm: "auto" },
                        }}
                        onClick={() => navigate("/medicalimaging")}
                      >
                        Upload
                      </Button>
                    </Stack>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "repeat(2, 1fr)",
                          sm: "repeat(3, 1fr)",
                          md: "repeat(auto-fill, minmax(110px, 1fr))",
                        },
                        gap: 2,
                      }}
                    >
                      {displayImages?.map((item) => (
                        <Box
                          key={item.id}
                          onClick={() => {
                            handleImageClick(item);
                            navigate("/dicom/imageViwer");
                          }}
                          sx={{
                            width: "100%",
                            paddingTop: "100%",
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
                                fontSize: { xs: "9px", sm: "10px" },
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
                              fontSize: { xs: 24, sm: 32 },
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
                              fontSize: { xs: "10px", sm: "12px" },
                            }}
                          >
                            Add Image
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </Stack>
              </Fade>
            </Grid>
            {/* RIGHT COLUMN */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Fade in timeout={700}>
                <Stack spacing={3}>
                  {/**NEXT PATIENT */}
                  <Card sx={cardStyle}>
                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: { xs: "11px", sm: "12px" },
                        fontWeight: "700",
                        letterSpacing: "0.5px",
                        mb: 2,
                      }}
                    >
                      NEXT PATIENT
                    </Typography>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      alignItems="center"
                    >
                      <Avatar
                        src={patientDetails2?.data?.basicInfo?.imageUrl}
                        sx={{
                          width: { xs: 48, sm: 56 },
                          height: { xs: 48, sm: 56 },
                          border: "3px solid rgba(82, 172, 140, 0.2)",
                        }}
                      />
                      <Box flex={1} textAlign={{ xs: "center", sm: "left" }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: { xs: "14px", sm: "15px" },
                            fontWeight: "700",
                            color: "primary.main",
                          }}
                        >
                          {patientDetails2?.data?.basicInfo?.name}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => {
                          handleNextPatientClick();
                        }}
                        sx={{
                          backgroundColor: "rgba(82, 172, 140, 0.1)",
                          "&:hover": {
                            backgroundColor: "rgba(82, 172, 140, 0.2)",
                          },
                        }}
                      >
                        <ArrowForwardIcon
                          sx={{ color: "primary.main", fontSize: 20 }}
                        />
                      </IconButton>
                    </Stack>
                  </Card>
                </Stack>
              </Fade>
              {/* Prescriptions */}
              <Card sx={{ ...cardStyle, mt: 2 }}>
                {/* Header - Compact */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  justifyContent="space-between"
                  mb={2}
                  spacing={1.5}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "8px",
                        background:
                          "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LinkIcon sx={{ color: "white", fontSize: 16 }} />
                    </Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight="700"
                      color="primary.main"
                      fontSize="15px"
                    >
                      Prescriptions
                    </Typography>
                  </Stack>
                </Stack>

                {/* Table - Compact & Responsive */}
                <TableContainer
                  component={Paper}
                  sx={{
                    boxShadow: "none",
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    overflowX: "auto",
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                        <TableCell
                          sx={{
                            py: 1,
                            px: 1.5,
                            fontWeight: 700,
                            fontSize: "10px",
                            color: "#6c757d",
                            textTransform: "uppercase",
                          }}
                        >
                          Medication
                        </TableCell>
                        <TableCell
                          sx={{
                            py: 1,
                            px: 1.5,
                            fontWeight: 700,
                            fontSize: "10px",
                            color: "#6c757d",
                            textTransform: "uppercase",
                          }}
                        >
                          Dosage
                        </TableCell>
                        <TableCell
                          sx={{
                            py: 1,
                            px: 1.5,
                            fontWeight: 700,
                            fontSize: "10px",
                            color: "#6c757d",
                            textTransform: "uppercase",
                          }}
                        >
                          Frequency
                        </TableCell>
                        {/* <TableCell
                          sx={{
                            py: 1,
                            px: 1.5,
                            fontWeight: 700,
                            fontSize: "10px",
                            color: "#6c757d",
                            textTransform: "uppercase",
                          }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          sx={{
                            py: 1,
                            px: 1,
                            fontWeight: 700,
                            fontSize: "10px",
                            color: "#6c757d",
                            textTransform: "uppercase",
                          }}
                          align="center"
                        >
                          Actions
                        </TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {visibleMedications.map((item) => (
                        <TableRow
                          key={item?.id}
                          hover
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(82, 172, 140, 0.04)",
                            },
                            "&:last-child td": { borderBottom: "none" },
                          }}
                        >
                          <TableCell sx={{ py: 1.5, px: 1.5 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: 1.5,
                                  background:
                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  fontWeight: 600,
                                  fontSize: "11px",
                                  flexShrink: 0,
                                }}
                              >
                                {item?.drugName?.charAt(0)}
                              </Box>
                              <Typography
                                fontWeight={600}
                                fontSize="12px"
                                color="#1a1a1a"
                                noWrap
                              >
                                {item?.drugName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 1.5, px: 1.5 }}>
                            <Chip
                              label={item?.dosage}
                              size="small"
                              sx={{
                                height: 24,
                                fontSize: "10px",
                                fontWeight: 600,
                                backgroundColor: "#e3f2fd",
                                color: "#1976d2",
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 1.5, px: 1.5 }}>
                            <Typography fontSize="11px" color="#6c757d" noWrap>
                              {item?.frequency}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Show More/Less - Compact */}
                {allMedications.length > ITEM_LIMIT && (
                  <Box
                    sx={{ mt: 1.5, display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      onClick={() =>
                        setShowAllPrescriptions(!showAllPrescriptions)
                      }
                      size="small"
                      sx={{
                        textTransform: "none",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "primary.main",
                        py: 0.5,
                        px: 2,
                        "&:hover": {
                          backgroundColor: "rgba(82, 172, 140, 0.05)",
                        },
                      }}
                    >
                      {showAllPrescriptions ? "Show Less" : "Show More"}
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </>
  );
}
