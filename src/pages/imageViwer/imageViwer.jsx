import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Grid,
  CardMedia,
  Divider,
  Tooltip,
  Stack,
  Chip,
  Card,
  CardContent,
  Fade,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Fullscreen,
  FullscreenExit,
  Person,
  CakeOutlined,
  Male,
  Bloodtype,
  Badge,
  CalendarToday,
  AccountCircle,
  CropRotate,
  PanTool,
  RotateRight,
  RotateLeft,
  InvertColors,
  Refresh,
  Remove,
  Add,
  ArrowBack,
  ZoomIn,
  ZoomOut,
  Brightness6,
  Contrast,
  Info,
  Download,
  Share,
  Print,
  GridView,
  ViewList,
} from "@mui/icons-material";
import { setSelectedPatient } from "../../redux/schedule/schedule";
import { useSelector, useDispatch } from "react-redux";
export default function DicomViewer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [inverted, setInverted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tool, setTool] = useState("pan");
  const [viewMode, setViewMode] = useState("grid");
  const imageRef = useRef(null);
  const medicalImages = useSelector(
    (state) => state.dataSliceImgViwer.mediclImage
  );
  const userInfo = useSelector((state) => state.dataSliceImgViwer.userInfo);
  console.log("userInfo: ", userInfo);
  console.log("medicalImages: ", medicalImages);
  // Get images from navigation state or use default
  const receivedImages = location.state?.allImages || [];
  const selectedImage = location.state?.image;
  const patientInfo = userInfo || {
    name: "_",
    age: _,
    gender: "_",
    bloodType: "_",
    id: "_",
    lastVisit: "_",
  };
  // Add DICOM file to default images
  const dicomFile = {
    src: "/assets/IMG-0001-00001.dcm",
    thumbnail: "/assets/dashboard/dicom/Rectangle 48.png",
    description: "DICOM Medical Scan",
    type: "DICOM",
    uploadDate: new Date().toISOString(),
    isDicom: true,
  };
  // Convert DICOM images to the format expected by the viewer
  const images =
    medicalImages.length > 0
      ? [
          dicomFile,
          ...medicalImages.map((img) => ({
            src: img.viewerUrl,
            thumbnail: img.viewerUrl,
            description: img.description || img.fileName,
            type: img.type,
            uploadDate: img.uploadDate,
          })),
        ]
      : [
          dicomFile,
          {
            src: "/assets/imageView/image 1.png",
            thumbnail: "/assets/imageView/image 2.png",
            description: "Sample Medical Image 1",
            type: "X-Ray",
          },
          {
            src: "/assets/imageView/image 3.png",
            thumbnail: "/assets/imageView/image 3.png",
            description: "Sample Medical Image 2",
            type: "MRI",
          },
        ];

  // Set initial image based on selected image
  useEffect(() => {
    if (selectedImage && medicalImages.length > 0) {
      const index = medicalImages.findIndex(
        (img) => img.id === selectedImage.id
      );
      if (index !== -1) {
        setCurrentImage(index + 1); // +1 because we added dicomFile at beginning
      }
    }
  }, [selectedImage, medicalImages]);

  const handlePrevious = () => {
    setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleThumbnailClick = (index) => {
    setCurrentImage(index);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 300));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 25));
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const handleReset = () => {
    setZoom(100);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setInverted(false);
  };

  const handleInvert = () => {
    setInverted((prev) => !prev);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      imageRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getImageStyle = () => ({
    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
    filter: `brightness(${brightness}%) contrast(${contrast}%) ${
      inverted ? "invert(1)" : ""
    }`,
    transition: "transform 0.3s ease, filter 0.3s ease",
  });

  return (
    <Box
      sx={{
        bgcolor: "#F5F7FA",
        minHeight: "100vh",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Enhanced Header with Gradient */}
      <Fade in timeout={400}>
        <Card
          sx={{
            mb: { xs: 2, md: 3 },
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(82, 172, 140, 0.15)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
              p: { xs: 2, sm: 3 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Tooltip title="Go Back">
                <IconButton
                  onClick={() => navigate(-1)}
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.3)",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <ArrowBack />
                </IconButton>
              </Tooltip>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: { xs: "20px", sm: "28px" },
                  }}
                >
                  OHIF Medical Imaging Viewer
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.9)", fontSize: "14px" }}
                >
                  Advanced DICOM Viewer • {images[currentImage]?.description}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              {images[currentImage]?.type && (
                <Chip
                  icon={<Info sx={{ color: "white !important" }} />}
                  label={images[currentImage].type}
                  sx={{
                    background: "rgba(255, 255, 255, 0.25)",
                    color: "white",
                    fontWeight: 700,
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                />
              )}
              <Chip
                label={`${currentImage + 1} / ${images.length}`}
                sx={{
                  background: "rgba(255, 255, 255, 0.25)",
                  color: "white",
                  fontWeight: 600,
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              />
            </Stack>
          </Box>
        </Card>
      </Fade>

      {/* Main Viewer Area */}
      <Fade in timeout={600}>
        <div>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {/* Left Sidebar - Thumbnails */}
            <Grid size={{ xs: 12, md: 3, lg: 2 }}>
              <Card
                sx={{
                  borderRadius: "16px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  width: "100%",
                  minHeight: { xs: "auto", md: "calc(100vh - 138px)" },
                  maxHeight: { xs: "auto", md: "calc(100vh - 280px)" },
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    background:
                      "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                    p: { xs: 2, md: 2.5 },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color="white"
                    sx={{ mb: 1, fontSize: { xs: "14px", md: "16px" } }}
                  >
                    Image Series
                  </Typography>

                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton
                      onClick={handlePrevious}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                      }}
                    >
                      <ChevronLeft />
                    </IconButton>

                    <Typography
                      variant="body2"
                      color="white"
                      sx={{ display: "flex", alignItems: "center", px: 1 }}
                    >
                      {currentImage + 1} / {images.length}
                    </Typography>

                    <IconButton
                      onClick={handleNext}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                      }}
                    >
                      <ChevronRight />
                    </IconButton>
                  </Stack>
                </Box>

                {/* Thumbnails */}
                <Box
                  sx={{
                    p: { xs: 2, md: 2.5 },

                    // 📱 موبايل أفقي
                    overflowX: { xs: "auto", md: "hidden" },
                    overflowY: { xs: "hidden", md: "auto" },

                    scrollSnapType: { xs: "x mandatory", md: "none" },

                    "&::-webkit-scrollbar": {
                      height: { xs: "6px", md: "8px" },
                      width: { md: "8px" },
                    },
                    "&::-webkit-scrollbar-track": {
                      bgcolor: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      bgcolor: "primary.main",
                      borderRadius: "4px",
                    },
                  }}
                >
                  <Stack direction={{ xs: "row", md: "column" }} spacing={2}>
                    {images.map((image, index) => (
                      <Box
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        sx={{
                          cursor: "pointer",

                          // 📱 عرض ثابت في الموبايل
                          minWidth: { xs: 120, md: "100%" },
                          maxWidth: { xs: 120, md: "100%" },

                          scrollSnapAlign: "start",

                          border:
                            currentImage === index
                              ? "3px solid"
                              : "2px solid transparent",
                          borderColor: "primary.main",
                          borderRadius: "12px",
                          overflow: "hidden",
                          transition: "all 0.3s ease",
                          position: "relative",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0 4px 12px rgba(82, 172, 140, 0.3)",
                          },
                        }}
                      >
                        <img
                          src={image.thumbnail}
                          alt={image.description}
                          style={{
                            width: "100%",
                            height: "120px",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />

                        {currentImage === index && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              bgcolor: "primary.main",
                              borderRadius: "50%",
                              width: 24,
                              height: 24,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="white"
                              fontWeight={700}
                            >
                              ✓
                            </Typography>
                          </Box>
                        )}

                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            bgcolor: "rgba(0,0,0,0.6)",
                            color: "white",
                            p: 0.5,
                            fontSize: "10px",
                            textAlign: "center",
                          }}
                        >
                          {index + 1}
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Card>
            </Grid>
            {/* Center - Main Viewer */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  borderRadius: "16px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  height: {
                    xs: "500px",
                    sm: "600px",
                    md: "calc(100vh - 280px)",
                  },
                  minHeight: { xs: "500px", md: "600px" },
                  position: "relative",
                  width: "100%",
                }}
              >
                <Box
                  ref={imageRef}
                  sx={{
                    bgcolor: "#000",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={images[currentImage].src}
                    alt={images[currentImage].description}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      ...getImageStyle(),
                    }}
                  />

                  {/* Image Overlay Info */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
                      color: "white",
                      p: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2" fontWeight={600}>
                        {images[currentImage].description}
                      </Typography>
                      <Chip
                        label={`${zoom}%`}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* Bottom Info */}
                  {images[currentImage].uploadDate && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                        color: "white",
                        p: 2,
                      }}
                    >
                      <Typography variant="caption">
                        Uploaded:{" "}
                        {new Date(
                          images[currentImage].uploadDate
                        ).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}

                  {/* Fullscreen Toggle */}
                  <Tooltip
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    <IconButton
                      onClick={toggleFullscreen}
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        bgcolor: "rgba(0,0,0,0.6)",
                        color: "white",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                      }}
                    >
                      {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            </Grid>
            {/* Controls */}
            <Grid size={{ xs: 12, md: 3, lg: 4 }}>
              <Card
                sx={{
                  borderRadius: "16px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  width: "100%",
                }}
              >
                <CardContent
                  sx={{
                    p: { xs: 2, md: 3 },
                    "&:last-child": { pb: { xs: 2, md: 3 } },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color="primary.main"
                    sx={{
                      mb: { xs: 2, md: 2.5 },
                      fontSize: { xs: "15px", md: "16px" },
                    }}
                  >
                    Viewing Tools
                  </Typography>

                  {/* Zoom Controls */}
                  <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                      >
                        Zoom: {zoom}%
                      </Typography>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Zoom Out">
                          <IconButton
                            size="small"
                            onClick={handleZoomOut}
                            color="primary"
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Zoom In">
                          <IconButton
                            size="small"
                            onClick={handleZoomIn}
                            color="primary"
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                    <Slider
                      value={zoom}
                      onChange={(e, val) => setZoom(val)}
                      min={25}
                      max={300}
                      sx={{ color: "primary.main" }}
                    />
                  </Box>

                  {/* Brightness */}
                  <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                        sx={{ fontSize: { xs: "12px", md: "13px" } }}
                      >
                        Brightness
                      </Typography>
                      <Typography
                        variant="caption"
                        color="primary.main"
                        fontWeight={700}
                      >
                        {brightness}%
                      </Typography>
                    </Stack>
                    <Slider
                      value={brightness}
                      onChange={(e, val) => setBrightness(val)}
                      min={0}
                      max={200}
                      sx={{ color: "primary.main" }}
                    />
                  </Box>

                  {/* Contrast */}
                  <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                        sx={{ fontSize: { xs: "12px", md: "13px" } }}
                      >
                        Contrast
                      </Typography>
                      <Typography
                        variant="caption"
                        color="primary.main"
                        fontWeight={700}
                      >
                        {contrast}%
                      </Typography>
                    </Stack>
                    <Slider
                      value={contrast}
                      onChange={(e, val) => setContrast(val)}
                      min={0}
                      max={200}
                      sx={{ color: "primary.main" }}
                    />
                  </Box>

                  {/* Action Buttons */}
                  <Stack spacing={1}>
                    <Button
                      fullWidth
                      variant={inverted ? "contained" : "outlined"}
                      startIcon={<InvertColors />}
                      onClick={handleInvert}
                      sx={{
                        textTransform: "none",
                        borderRadius: "10px",
                        ...(inverted && {
                          background:
                            "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                        }),
                      }}
                    >
                      Invert Colors
                    </Button>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Rotate Left">
                        <IconButton
                          onClick={handleRotateLeft}
                          sx={{
                            flex: 1,
                            border: "1px solid",
                            borderColor: "primary.main",
                            borderRadius: "10px",
                            color: "primary.main",
                          }}
                        >
                          <RotateLeft />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Rotate Right">
                        <IconButton
                          onClick={handleRotateRight}
                          sx={{
                            flex: 1,
                            border: "1px solid",
                            borderColor: "primary.main",
                            borderRadius: "10px",
                            color: "primary.main",
                          }}
                        >
                          <RotateRight />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Refresh />}
                      onClick={handleReset}
                      color="error"
                      sx={{
                        textTransform: "none",
                        borderRadius: "10px",
                      }}
                    >
                      Reset All
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          {/* Patient Information */}
          <Card
            sx={{
              borderRadius: "20px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              mt: 3,
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              <Typography
                variant="h6"
                fontWeight={700}
                color="primary.main"
                sx={{ mb: 3 }}
              >
                Patient Information
              </Typography>

              {/* <Grid container spacing={2}> */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                sx={{
                  justifyContent: "space-between",
                  alignItems: { xs: "stretch", md: "center" },
                  flexWrap: "wrap",
                  gap: 3,
                }}
              >
                {[
                  {
                    label: "Name",
                    value: patientInfo.name,
                    icon: <Person />,
                    color: "#607d8b",
                  },
                  {
                    label: "Age",
                    value: `${patientInfo.age} years`,
                    icon: <CakeOutlined />,
                    color: "#8bc34a",
                  },
                  {
                    label: "Gender",
                    value: patientInfo.gender,
                    icon: <Male />,
                    color: "#2196f3",
                  },
                  {
                    label: "Blood Type",
                    value: patientInfo.bloodType,
                    icon: <Bloodtype />,
                    color: "#f44336",
                  },
                  {
                    label: "Patient ID",
                    value: patientInfo.id.slice(-6),
                    icon: <Badge />,
                    color: "#9c27b0",
                  },
                ].map((item, index) => (
                  <Card
                    key={index}
                    sx={{
                      width: "200px", // ✅ عرض ثابت
                      minWidth: "200px",
                      borderRadius: "16px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                      flexShrink: 0, // ✅ يمنع الانكماش
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        justifyContent: "space-between",
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      <Box
                        sx={{
                          width: 45,
                          height: 45,
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: item.color + "20",
                          color: item.color,
                        }}
                      >
                        {item.icon}
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {item.label}
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {item.value}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
              {/* </Grid> */}

              <Divider sx={{ my: 3 }} />

              <Button
                onClick={() => {
                  navigate("/patientlist/patient");
                }}
                fullWidth
                variant="contained"
                sx={{
                  color: "white",
                  textTransform: "none",
                  borderRadius: "12px",
                  py: 1.5,
                  fontWeight: 500,
                  fontSize: "24px",
                  background:
                    "linear-gradient(135deg, #52AC8C 0%, #3D8B6F 100%)",
                  boxShadow: "0 6px 18px rgba(82, 172, 140, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #3D8B6F 0%, #2E6B55 100%)",
                  },
                }}
              >
                View Patient Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </Fade>
    </Box>
  );
}
