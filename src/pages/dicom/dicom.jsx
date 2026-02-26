import React from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  IconButton,
  MenuItem,
  Select,
  InputAdornment,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import IosShareIcon from "@mui/icons-material/IosShare";
import AddIcon from "@mui/icons-material/Add";
import NavBar from "../../components/navBar";
import WestIcon from "@mui/icons-material/West";
const exams = [
  {
    id: 1,
    type: "MRI",
    description: "Brain MRI with Contrast",
    date: "Dec 15, 2024",
    size: "2.4 MB",
    img: "/assets/dashboard/dicom/Rectangle 48.png",
  },
  {
    id: 2,
    type: "CT-Scan",
    description: "Chest CT with IV Contrast",
    date: "Dec 12, 2024",
    size: "45.2 MB",
    img: "/assets/dashboard/dicom/Rectangle 49.png",
  },
  {
    id: 3,
    type: "X-Ray",
    description: "Chest X-Ray PA View",
    date: "Dec 10, 2024",
    size: "128.7 MB",
    img: "/assets/dashboard/dicom/Rectangle 50.png",
  },
  {
    id: 4,
    type: "CT-Scan",
    description: "Chest CT with IV Contrast",
    date: "Dec 12, 2024",
    size: "45.2 MB",
    img: "/assets/dashboard/dicom/Rectangle 51.png",
  },
  {
    id: 5,
    type: "MRI",
    description: "Brain MRI with Contrast",
    date: "Dec 15, 2024",
    size: "2.4 MB",
    img: "/assets/dashboard/dicom/Rectangle 52.png",
  },

  {
    id: 6,
    type: "CT-Scan",
    description: "Chest CT with IV Contrast",
    date: "Dec 12, 2024",
    size: "45.2 MB",
    img: "/assets/dashboard/dicom/Rectangle 54.png",
  },
];

export default function Dicom() {
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
        <Box
          sx={{
            p: 4,
            mb: 3,
            backgroundColor: "white",
            borderRadius: "20px",
          }}
        >
          <Box
            sx={{
              cursor: "pointer",
              width: "fit-content",
              height: "fit-content",
              padding: "5px 5px 0",
              color: "white",
              backgroundColor: "#9CE3CA",
              borderRadius: "10px",
            }}
          >
            <WestIcon sx={{ margin: "0" }} />
          </Box>
          <Stack
            sx={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontSize={"20px"} fontWeight={400} marginLeft={7}>
              DICOM Examinations for Patient
            </Typography>
            <Button
              variant="contained"
              fontSize={"16px"}
              fontWeight={400}
              sx={{ color: "white", textTransform: "none" }}
              startIcon={<AddIcon />}
            >
              Upload New Scan
            </Button>
          </Stack>
        </Box>

        {/* Filters */}
        <Stack
          sx={{
            p: 4,
            mb: 3,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: "20px",
          }}
        >
          <Stack
            sx={{
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              justifyContent: "space-between",
              width: "50%",
            }}
          >
            <TextField
              placeholder="Search examinations..."
              size="large"
              sx={{ width: "90%", boxShadow: "0px 4px 4px 0px #00000040" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              startIcon={<FilterAltIcon />}
              sx={{ color: "white", height: "56px", borderRadius: "15px" }}
            >
              Filter
            </Button>
          </Stack>
          <Stack
            sx={{
              flexDirection: "row",
              gap: 2,
              alignItems: "center",
              justifyContent: "flex-end",
              width: "50%",
            }}
          >
            <Select
              size="small"
              value="all"
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                "& .MuiSelect-icon": {
                  color: "white",
                },
                padding: "2px",
                fontSize: "16px",
                fontWeight: "400px",
                borderRadius: "15px",
                height: "56px",
              }}
            >
              <MenuItem value="all">All Dates</MenuItem>
            </Select>
            <Select
              size="small"
              value="all"
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                "& .MuiSelect-icon": {
                  color: "white",
                },
                padding: "2px",
                fontSize: "16px",
                fontWeight: "400px",
                borderRadius: "15px",
                height: "56px",
              }}
            >
              <MenuItem value="all">All Types</MenuItem>
            </Select>
          </Stack>
        </Stack>

        {/* Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "primary.main" }}>
              <TableRow>
                <TableCell
                  sx={{ color: "#fff", fontSize: "20px", fontWeight: "400" }}
                >
                  Preview
                </TableCell>
                <TableCell
                  sx={{ color: "#fff", fontSize: "20px", fontWeight: "400" }}
                >
                  Type
                </TableCell>
                <TableCell
                  sx={{ color: "#fff", fontSize: "20px", fontWeight: "400" }}
                >
                  Study Description
                </TableCell>
                <TableCell
                  sx={{ color: "#fff", fontSize: "20px", fontWeight: "400" }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{ color: "#fff", fontSize: "20px", fontWeight: "400" }}
                >
                  File Size
                </TableCell>
                <TableCell
                  sx={{ color: "#fff", fontSize: "20px", fontWeight: "400" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id} hover>
                  <TableCell>
                    <Avatar variant="rounded" src={exam.img} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={exam.type}
                      sx={{
                        width: "80px",
                        height: "30px",
                        borderRadius: "10px",
                        fontSize: "16px",
                        fontWeight: "400",
                        color:
                          exam.type === "MRI"
                            ? "#7705B1"
                            : exam.type === "CT-Scan"
                            ? "#52AC8C"
                            : exam.type === "X-Ray"
                            ? "#009EE6"
                            : "black",
                        border:
                          exam.type === "MRI"
                            ? "1.5px solid #7705B1"
                            : exam.type === "CT-Scan"
                            ? " 1.5px solid #0EBE7F"
                            : exam.type === "X-Ray"
                            ? "1.5px solid #009EE6"
                            : "1.5px solid black",
                        backgroundColor:
                          exam.type === "MRI"
                            ? "#F1D6FFB8"
                            : exam.type === "CT-Scan"
                            ? "#C4FBE79E"
                            : exam.type === "X-Ray"
                            ? "#B5D8FFB0"
                            : "gray",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: "16px", fontWeight: "400" }}>
                    {exam.description}
                  </TableCell>
                  <TableCell sx={{ fontSize: "16px", fontWeight: "400" }}>
                    {exam.date}
                  </TableCell>
                  <TableCell sx={{ fontSize: "16px", fontWeight: "400" }}>
                    {exam.size}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" sx={{ color: "primary.main" }}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "primary.main" }}>
                      <DownloadIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "primary.main" }}>
                      <IosShareIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Stack>
  );
}
