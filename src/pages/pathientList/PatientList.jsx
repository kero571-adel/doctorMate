import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Chip,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  IconButton,
  Pagination,
  InputAdornment,
  Skeleton,
  Alert,
  Fade,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useSelector, useDispatch } from "react-redux";
import { patientsList } from "../../redux/patientList/patientList";
import NavBar from "../../components/navBar";

export default function PatientList() {
  const dispatch = useDispatch();
  const { patients, pagination, loading, error } = useSelector(
    (state) => state.patients
  );
  const userLS = JSON.parse(localStorage.getItem("user") || "{}");
  const {user} = useSelector((state) => state.doctor);

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch patients when page or search changes
  useEffect(() => {
    dispatch(patientsList({ page, limit: 10, search: debouncedSearch }));
  }, [dispatch, page, debouncedSearch]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRefresh = () => {
    dispatch(patientsList({ page, limit: 10, search: debouncedSearch }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return {
          bg: "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
          color: "white",
        };
      case "follow-up":
        return {
          bg: "linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)",
          color: "white",
        };
      case "offline":
        return {
          bg: "linear-gradient(135deg, #EF5350 0%, #E53935 100%)",
          color: "white",
        };
      default:
        return {
          bg: "linear-gradient(135deg, #78909C 0%, #607D8B 100%)",
          color: "white",
        };
    }
  };

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
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "14px",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <PeopleAltIcon sx={{ fontSize: 28, color: "white" }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="700">
                      Patient List
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                      Manage and view patient records
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    onClick={handleRefresh}
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                  <Avatar
                    src={user?.data?.imageUrl}
                    sx={{
                      width: 48,
                      height: 48,
                      border: "3px solid white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    {userLS?.fullName?.charAt(0) || "D"}
                  </Avatar>
                </Stack>
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
            }}
          >
            {error}
          </Alert>
        )}

        {/* Search and Filter Bar */}
        <Card
          sx={{
            mb: 3,
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(82, 172, 140, 0.15)",
            border: "1px solid rgba(82, 172, 140, 0.2)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              {/* Search Field */}
              <TextField
                placeholder="Search patients by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  flex: 1,
                  minWidth: { xs: "100%", md: "300px" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "rgba(82, 172, 140, 0.05)",
                    "&:hover": {
                      backgroundColor: "rgba(82, 172, 140, 0.08)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "white",
                      "& fieldset": {
                        borderColor: "primary.main",
                        borderWidth: "2px",
                      },
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Action Buttons */}
              <Stack direction="row" spacing={1}>
                <IconButton
                  sx={{
                    background:
                      "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                    color: "white",
                    borderRadius: "12px",
                    width: 44,
                    height: 44,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #3D8B6F 0%, #2E7A5F 100%)",
                    },
                  }}
                >
                  <FilterAltOutlinedIcon />
                </IconButton>
                <IconButton
                  sx={{
                    background:
                      "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                    color: "white",
                    borderRadius: "12px",
                    width: 44,
                    height: 44,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #3D8B6F 0%, #2E7A5F 100%)",
                    },
                  }}
                >
                  <DownloadOutlinedIcon />
                </IconButton>
              </Stack>
            </Stack>

            {/* Stats Row */}
            <Stack
              direction="row"
              spacing={3}
              sx={{
                mt: 2,
                pt: 2,
                borderTop: "1px solid rgba(82, 172, 140, 0.1)",
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="500"
                >
                  Total Patients
                </Typography>
                <Typography variant="h6" fontWeight="700" color="primary.main">
                  {pagination.totalItems}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="500"
                >
                  Current Page
                </Typography>
                <Typography variant="h6" fontWeight="700" color="primary.main">
                  {pagination.page} / {pagination.totalPages}
                </Typography>
              </Box>
              {searchQuery && (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="500"
                  >
                    Search Results
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    color="primary.main"
                  >
                    {patients.length}
                  </Typography>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Patients Table */}
        <Card
          sx={{
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(82, 172, 140, 0.15)",
            border: "1px solid rgba(82, 172, 140, 0.2)",
            overflow: "hidden",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead
                sx={{
                  background:
                    "linear-gradient(135deg, rgba(82, 172, 140, 0.1) 0%, rgba(82, 172, 140, 0.05) 100%)",
                }}
              >
                <TableRow>
                  {[
                    "PATIENT",
                    "AGE",
                    "PHONE",
                    "LAST VISIT",
                    "STATUS",
                    "ACTIONS",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontWeight: 700,
                        color: "primary.main",
                        fontSize: "0.95rem",
                        py: 2,
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: 6 }).map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton variant="text" height={40} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : patients && patients.length > 0 ? (
                  patients.map((patient, index) => (
                    <TableRow
                      key={patient.id || index}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(82, 172, 140, 0.05)",
                        },
                        transition: "all 0.2s ease",
                        borderBottom: "1px solid rgba(82, 172, 140, 0.1)",
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            src={patient.imageUrl}
                            sx={{
                              width: 44,
                              height: 44,
                              border: "2px solid",
                              borderColor: "primary.main",
                              boxShadow: "0 2px 8px rgba(82, 172, 140, 0.2)",
                            }}
                          >
                            {patient.name?.charAt(0) || "?"}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight="700"
                              color="primary.main"
                            >
                              {patient.name || "N/A"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              fontWeight="500"
                            >
                              ID: {patient.id?.slice(0, 8)}...
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600">
                          {patient.age || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {patient.phone || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {formatDate(patient.lastVisit)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={patient.status || "N/A"}
                          size="small"
                          sx={{
                            background: getStatusColor(patient.status).bg,
                            color: getStatusColor(patient.status).color,
                            fontWeight: 600,
                            textTransform: "capitalize",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton
                            size="small"
                            sx={{
                              color: "primary.main",
                              "&:hover": {
                                backgroundColor: "rgba(82, 172, 140, 0.1)",
                              },
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{
                              color: "#FFA726",
                              "&:hover": {
                                backgroundColor: "rgba(255, 167, 38, 0.1)",
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{
                              color: "#EF5350",
                              "&:hover": {
                                backgroundColor: "rgba(239, 83, 80, 0.1)",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box
                        sx={{
                          textAlign: "center",
                          py: 6,
                          borderRadius: "16px",
                          background:
                            "linear-gradient(135deg, rgba(82, 172, 140, 0.05) 0%, rgba(82, 172, 140, 0.02) 100%)",
                          border: "2px dashed rgba(82, 172, 140, 0.3)",
                          margin: 2,
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
                          <PeopleAltIcon
                            sx={{ fontSize: 32, color: "white" }}
                          />
                        </Box>
                        <Typography
                          variant="body1"
                          fontWeight="600"
                          color="primary.main"
                          mb={0.5}
                        >
                          {searchQuery
                            ? "No patients found"
                            : "No patients to display"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {searchQuery
                            ? "Try adjusting your search query"
                            : "Patients will appear here once added"}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {!loading && patients && patients.length > 0 && (
            <Box
              sx={{
                p: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid rgba(82, 172, 140, 0.1)",
                background:
                  "linear-gradient(135deg, rgba(82, 172, 140, 0.02) 0%, rgba(82, 172, 140, 0.05) 100%)",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="500"
              >
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.totalItems
                )}{" "}
                of {pagination.totalItems} patients
              </Typography>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: "12px",
                    fontWeight: 600,
                    "&.Mui-selected": {
                      background:
                        "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                      color: "white",
                    },
                  },
                }}
              />
            </Box>
          )}
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
