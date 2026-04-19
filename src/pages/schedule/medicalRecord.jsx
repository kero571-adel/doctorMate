import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  IconButton,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
} from "@mui/material";
import { useState } from "react";
import MedicationIcon from "@mui/icons-material/Medication";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NotesIcon from "@mui/icons-material/Notes";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { useSnackbar } from '../../hooks/useSnackbar';
const conditions = [
  {
    id: 1,
    description: "Acute Bronchitis",
    icd10Code: "J20.9",
    severity: "High",
    status: "Active",
  },
  {
    id: 2,
    description: "Vitamin D Deficiency",
    icd10Code: "E55.9",
    severity: "Medium",
    status: "Active",
  },
  {
    id: 3,
    description: "Seasonal Allergies",
    icd10Code: "J30.9",
    severity: "High",
    status: "Active",
  },
];

const consultations = [
  {
    id: 1,
    title: "Follow-up Consultation",
    recordedDate: "Jan 10, 2025",
    doctorName: "Dr. Sarah Williams",
    icon: <AccessTimeIcon />,
  },
  {
    id: 2,
    title: "Follow-up Consultation",
    recordedDate: "Jan 10, 2025",
    doctorName: "Dr. Robert Williams",
    icon: <MedicalServicesIcon />,
  },
];
import AddDiagnosis from "./Modal/diagnosis";
export default function MedicalRecord({ appoinDetails, formatDate }) {
  const { showSnackbar } = useSnackbar();
  const [openDiagnosis, setopenDiagnosis] = useState(false);
  return (
    <>
      <AddDiagnosis
        openDiagnosis={openDiagnosis}
        setopenDiagnosis={setopenDiagnosis}
      />
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Box sx={{ p: 2 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <Stack direction={"row"} spacing={2} alignItems={"center"}>
                <Box
                  sx={{
                    backgroundColor: "#4caf8a",
                    width: 22.916667938232422,
                    height: 17,
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PersonIcon sx={{ color: "white" }} />
                </Box>

                <Box>
                  <Typography fontWeight={600} fontSize={13}>
                    Annual physical Examination
                  </Typography>
                  <Typography
                    color="text.secondary"
                    fontWeight={400}
                    fontSize={10}
                  >
                    Recorded on{" "}
                    {formatDate(appoinDetails?.data?.scheduledStart)} &nbsp; Dr.{" "}
                    {appoinDetails?.data?.doctorName}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction={"row"}>
                <IconButton>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton>
                  <ExpandMoreIcon />
                </IconButton>
              </Stack>
            </Box>
          </Box>
          <Divider />
          {/* Diagnosis Section */}
          <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <PlaylistAddIcon />
                <Typography fontWeight={600} fontSize={18}>
                  Diagnosis List
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={() => {
                  setopenDiagnosis(true);
                }}
                sx={{
                  color: "white",
                  backgroundColor: "#4caf8a",
                  textTransform: "none",
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "#3f9f7e" },
                }}
              >
                + Add Diagnosos
              </Button>
            </Box>

            {/* Updated Table */}
            <Paper
              elevation={0}
              sx={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid #f0f0f0",
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 60px",
                  backgroundColor: "#f8f9fa",
                  padding: "16px 24px",
                  borderBottom: "1px solid #e9ecef",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6c757d",
                    fontWeight: 600,
                    fontSize: "8px",
                    
                  }}
                >
                  Description
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6c757d",
                    fontWeight: 600,
                    fontSize: "8px",
                  }}
                >
                  ICD-10 Code
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6c757d",
                    fontWeight: 600,
                    fontSize: "8px",
                  }}
                >
                  Severity
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6c757d",
                    fontWeight: 600,
                    fontSize: "8px",
                  }}
                >
                  Status
                </Typography>
                <Box></Box>
              </Box>

              {/* Rows */}
              {appoinDetails?.data?.diagnoses?.map((condition, index) => (
                <Box
                  key={condition.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr 60px",
                    padding: "20px 24px",
                    alignItems: "center",
                    borderBottom:
                      index !== conditions.length - 1
                        ? "1px solid #f8f9fa"
                        : "none",
                    "&:hover": {
                      backgroundColor: "#fafbfc",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "#495057",
                      fontSize: "10px",
                      fontWeight: 400,
                      lineHeight: 1.4,
                    }}
                  >
                    {condition.description}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#6c757d",
                      fontSize: "10px",
                      fontWeight: 400,
                    }}
                  >
                    {condition.icdCode}
                  </Typography>
                  <Box>
                    <Chip
                      label={condition.severity}
                      sx={{
                        width:"fit-content",
                        backgroundColor:
                          condition.severity === "High" ? "#ffe5e5" : "#fff4e5",
                        color:
                          condition.severity === "High" ? "#dc3545" : "#fd7e14",
                        border:
                          condition.severity === "High"
                            ? "1px solid #ffb3b3"
                            : "1px solid #ffe0b3",
                        fontSize: "10px",
                        fontWeight: 400,
                        borderRadius: "14px",
                        marginRight:"10px"
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      color: "#28a745",
                      fontSize: "10px",
                      fontWeight: 400,
                    }}
                  >
                    Active
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{
                        color: "#dee2e6",
                        padding: "4px",
                        "&:hover": {
                          backgroundColor: "transparent",
                          color: "#6c757d",
                        },
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Paper>
          </Box>
          {/* Bottom Section */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
              p: 2,
            }}
          >
            {/* Provider Notes Card */}
            <Paper
              elevation={0}
              sx={{
                flex: "1 1 300px",
                maxWidth: 400,
                p: 3,
                backgroundColor: "#F8F9FA",
                borderRadius: 2,
                border: "1px solid #E9ECEF",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <NotesIcon sx={{ color: "#6C757D", mr: 1, fontSize: 20 }} />
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "#6C757D",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    fontSize: "11px",
                  }}
                >
                  PROVIDER NOTES
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#495057",
                  lineHeight: 1.6,
                  fontSize: "14px",
                }}
              >
                Patient presents with persistent cough and fatigue.
                <br />
                Recommended increased fluid intake and rest.
              </Typography>
            </Paper>

            {/* Prescriptions Card */}
            <Paper
              elevation={0}
              sx={{
                flex: "1 1 300px",
                maxWidth: 400,
                p: 3,
                backgroundColor: "#F8F9FA",
                borderRadius: 2,
                border: "1px solid #E9ECEF",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <MedicationIcon
                  sx={{ color: "#6C757D", mr: 1, fontSize: 20 }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "#6C757D",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    fontSize: "11px",
                  }}
                >
                  PRESCRIPTIONS
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#495057",
                    fontSize: "14px",
                  }}
                >
                  3 Active Prescriptions
                </Typography>
                <IconButton
                  size="small"
                  sx={{
                    color: "#20C997",
                    "&:hover": {
                      backgroundColor: "rgba(32, 201, 151, 0.1)",
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#20C997",
                      fontWeight: 500,
                      mr: 0.5,
                      fontSize: "12px",
                    }}
                  >
                    View all
                  </Typography>
                  <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Paper>
          </Box>
        </CardContent>
      </Card>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 3,
          width: "100%",
        }}
      >
        {consultations.map((consultation) => (
          <Paper
            key={consultation.id}
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: "#fff",
              borderRadius: 2,
              border: "1px solid #E8EAED",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#F8F9FA",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  color: "#5F6368",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {consultation.icon}
              </Box>
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    color: "#202124",
                    fontSize: "15px",
                  }}
                >
                  {consultation.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#5F6368",
                    fontSize: "13px",
                    mt: 0.5,
                  }}
                >
                  Recorded on {consultation.recordedDate} •{" "}
                  {consultation.doctorName}
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              sx={{
                color: "#5F6368",
                "&:hover": {
                  backgroundColor: "rgba(95, 99, 104, 0.08)",
                },
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Paper>
        ))}
      </Box>
    </>
  );
}
