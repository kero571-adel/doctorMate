import React, { useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import IosShareIcon from "@mui/icons-material/IosShare";
import AddIcon from "@mui/icons-material/Add";
import NavBar from "../../components/navBar";
import WestIcon from "@mui/icons-material/West";
import { useDispatch,useSelector } from "react-redux";
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
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(getDataDoctor());
  // })
  const navigate = useNavigate();
  return (
    <Stack direction="row">
      <NavBar />
      <Box
        sx={{
          backgroundColor: "#F5F7FA",
          padding: { xs: "10px", sm: "20px" }, // Padding أقل في الموبايل
          height: "100vh",
          overflowY: "auto",
          flex: 1,
          width: "100%",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: { xs: 2, sm: 4 }, // Padding متجاوب
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
              mb: 2, // مسافة أسفل زر الرجوع في الموبايل
            }}
          >
            <WestIcon sx={{ margin: "0" }} />
          </Box>
          <Stack
            sx={{
              flexDirection: { xs: "column", sm: "row" }, // عمودي في الموبايل، أفقي في الشاشات الأكبر
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" }, // محاذاة مختلفة للموبايل
              gap: 2, // مسافة بين العناصر بدلاً من margin ثابت
            }}
          >
            <Typography
              fontSize={{ xs: "18px", sm: "20px" }} // خط أصغر قليلاً في الموبايل
              fontWeight={400}
              // removed marginLeft={7} to prevent overflow
            >
              DICOM Examinations for Patient
            </Typography>
            <Button
              variant="contained"
              fontSize={{ xs: "14px", sm: "16px" }}
              fontWeight={400}
              sx={{
                color: "white",
                textTransform: "none",
                width: { xs: "100%", sm: "auto" }, // زر كامل العرض في الموبايل
              }}
              startIcon={<AddIcon />}
            >
              Upload New Scan
            </Button>
          </Stack>
        </Box>

        {/* Filters */}
        <Stack
          sx={{
            p: { xs: 2, sm: 4 },
            mb: 3,
            flexDirection: { xs: "column", md: "row" }, // ترتيب عمودي في التابلت والموبايل
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: "20px",
            gap: 3, // مسافة بين قسم البحث وقسم الفلتر
          }}
        >
          {/* Search & Filter Button Section */}
          <Stack
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: 2,
              justifyContent: "space-between",
              width: { xs: "100%", md: "50%" }, // عرض كامل في الموبايل
            }}
          >
            <TextField
              placeholder="Search examinations..."
              size="large"
              sx={{
                width: "100%", // يأخذ عرض الحاوية بالكامل
                boxShadow: "0px 4px 4px 0px #00000040",
                "& .MuiInputBase-root": {
                  height: { xs: "45px", sm: "56px" }, // ارتفاع مناسب للموبايل
                },
              }}
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
              sx={{
                color: "white",
                height: { xs: "45px", sm: "56px" },
                borderRadius: "15px",
                width: { xs: "100%", sm: "auto" }, // زر فلتر كامل العرض في الموبايل إذا لزم
              }}
            >
              Filter
            </Button>
          </Stack>

          {/* Date & Type Selects Section */}
          <Stack
            sx={{
              flexDirection: "row",
              gap: 2,
              alignItems: "center",
              justifyContent: { xs: "center", md: "flex-end" },
              width: { xs: "100%", md: "50%" },
              flexWrap: "wrap", // يسمح للعناصر بالنزول لسطر جديد إذا ضاق المكان
            }}
          >
            <Select
              size="small"
              value="all"
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                "& .MuiSelect-icon": { color: "white" },
                padding: "2px",
                fontSize: "16px",
                fontWeight: "400px",
                borderRadius: "15px",
                height: { xs: "45px", sm: "56px" },
                minWidth: "140px", // عرض أدنى لضمان عدم انكماش القائمة
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
                "& .MuiSelect-icon": { color: "white" },
                padding: "2px",
                fontSize: "16px",
                fontWeight: "400px",
                borderRadius: "15px",
                height: { xs: "45px", sm: "56px" },
                minWidth: "140px",
              }}
            >
              <MenuItem value="all">All Types</MenuItem>
            </Select>
          </Stack>
        </Stack>

        {/* Table */}
        {/* Box wrapper to handle horizontal scroll on mobile */}
        <Box sx={{ overflowX: "auto", borderRadius: 3 }}>
          <TableContainer component={Paper} sx={{ borderRadius: 3, minWidth: 800 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "primary.main" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontSize: { xs: "14px", sm: "20px" },
                      fontWeight: "400",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Preview
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontSize: { xs: "14px", sm: "20px" },
                      fontWeight: "400",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Type
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontSize: { xs: "14px", sm: "20px" },
                      fontWeight: "400",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Study Description
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontSize: { xs: "14px", sm: "20px" },
                      fontWeight: "400",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontSize: { xs: "14px", sm: "20px" },
                      fontWeight: "400",
                      whiteSpace: "nowrap",
                    }}
                  >
                    File Size
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontSize: { xs: "14px", sm: "20px" },
                      fontWeight: "400",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id} hover>
                    <TableCell>
                      <Avatar
                        variant="rounded"
                        src={exam.img}
                        sx={{ width: 40, height: 40 }} // حجم ثابت للأفاتار
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={exam.type}
                        sx={{
                          width: "80px",
                          height: "30px",
                          borderRadius: "10px",
                          fontSize: { xs: "12px", sm: "16px" },
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
                    <TableCell
                      sx={{
                        fontSize: { xs: "14px", sm: "16px" },
                        fontWeight: "400",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {exam.description}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: "14px", sm: "16px" },
                        fontWeight: "400",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {exam.date}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: "14px", sm: "16px" },
                        fontWeight: "400",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {exam.size}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          size="small"
                          sx={{ color: "primary.main" }}
                          onClick={() => navigate(`/dicom/imageViwer`)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "primary.main" }}
                        >
                          <DownloadIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "primary.main" }}
                        >
                          <IosShareIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Stack>
  );
}