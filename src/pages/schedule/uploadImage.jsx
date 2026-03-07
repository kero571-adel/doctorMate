import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  LinearProgress,
  IconButton,
  Breadcrumbs,
  Link,
  Paper,
  Avatar,
  Snackbar,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Chip,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Add,
  Description,
  Close,
  ExpandMore,
  Delete,
  CheckCircle,
  Error as ErrorIcon,
  VisibilityOutlined,
  WarningAmber,
  InsertDriveFile,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addMedicalImg } from "../../redux/schedule/addMedicalImg";
import { getMedicalImg } from "../../redux/schedule/addMedicalImg";
import { delMedicalImg } from "../../redux/schedule/addMedicalImg";
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";

// ✅ Initialize Cornerstone with proper configuration
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

cornerstoneWADOImageLoader.configure({
  useWebWorkers: true,
  decodeConfig: {
    convertFloatPixelDataToInt: true,
  },
});

// Register image loaders
cornerstone.registerImageLoader(
  "wadouri",
  cornerstoneWADOImageLoader.loadImage
);
cornerstone.registerImageLoader(
  "dicomweb",
  cornerstoneWADOImageLoader.loadImage
);

export default function MedicalImaging() {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [displayedImages, setDisplayedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDescriptionModal, setOpenDescriptionModal] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [imageDescription, setImageDescription] = useState("");
  const [itemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  const selectedPatient = useSelector(
    (state) => state.schedule.selectedPatient
  );
  const pateintDet = useSelector((state) => state.patients.patientDet);
  const { data, images, error, loading } = useSelector(
    (state) => state.MedicalImg
  );
  console.log("images: ", images);
  // ✅ تعريف آمن للبيانات
  const allImages = images?.data || [];
  const displayableImages =
    displayedImages.length > 0 ? displayedImages : allImages;
  const hasMoreImages = displayableImages.length < allImages.length;

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  function handelDel(id) {
    dispatch(delMedicalImg(id));
  }
  // ✅ بناء رابط الصورة من API response
  const getImageUrl = (image) => {
    // إذا كانت الصورة تحتوي على رابط مباشر كامل
    if (image.src && image.src.startsWith("http")) return image.src;
    if (image.url && image.url.startsWith("http")) return image.url;
    if (image.fileUrl && image.fileUrl.startsWith("http")) return image.fileUrl;
    // إذا كانت الصورة لها رابط نسبي
    if (image.src) return image.src;
    if (image.url) return image.url;
    if (image.fileUrl) return image.fileUrl;
    // بناء رابط من معرف الملف والمريض
    // تأكد من أن API endpoint صحيح
    if (image.id) {
      const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      return `${apiBaseUrl}/api/medical-images/${image.id}/download`;
    }
    return null;
  };

  // ✅ دالة لعرض محتوى الصورة
  const renderImageContent = (image) => {
    const isDicomFile =
      image.fileType?.toLowerCase() === ".dcm" ||
      image.fileType?.toLowerCase() === ".dicom" ||
      image.fileName?.toLowerCase().endsWith(".dcm");

    if (isDicomFile) {
      return (
        <Box
          className="cornerstone-element"
          ref={(el) => {
            if (el && image.id) {
              try {
                // تفعيل العنصر
                cornerstone.enable(el);
                
                const imageUrl = getImageUrl(image);
                if (!imageUrl) {
                  console.warn("No image URL for DICOM:", image);
                  el.innerHTML = '<div style="color:#999;text-align:center;padding:20px;height:100%;display:flex;align-items:center;justify-content:center;">No URL</div>';
                  return;
                }

                // تحميل وعرض صورة DICOM
                const imageId = imageUrl.includes("wadouri:")
                  ? imageUrl
                  : `wadouri:${imageUrl}`;

                cornerstone
                  .loadAndCacheImage(imageId)
                  .then((img) => {
                    if (el) {
                      cornerstone.displayImage(el, img);
                    }
                  })
                  .catch((err) => {
                    console.error("Error loading DICOM:", err);
                    if (el) {
                      el.innerHTML = '<div style="color:#f44336;text-align:center;padding:20px;font-size:12px;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;"><div style="font-size:20px;margin-bottom:8px;">⚠️</div><div>Failed to load</div></div>';
                    }
                  });
              } catch (err) {
                console.error("Cornerstone error:", err);
              }
            }
          }}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "#1a1a1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ position: "absolute", top: 8, left: 8, bgcolor: "#5cb998", color: "white", px: 1, py: 0.3, borderRadius: "4px", fontSize: "10px", fontWeight: 600, zIndex: 2 }}>
            {image.modality || "DICOM"}
          </Box>
        </Box>
      );
    }

    return (
      <CardMedia
        component="img"
        image={getImageUrl(image)}
        alt={image.fileName}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    );
  };

  // ✅ Improved file validation with clear messages
  const validateFile = (file) => {
    const validExtensions = [
      ".dcm",
      ".dicom",
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
    ];
    const fileExtension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      return {
        valid: false,
        error: `File "${file.name}" is not supported. Please upload image files (.jpg, .png,  .dcm, etc.)`,
      };
    }

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File "${file.name}" is too large. Maximum size is 50MB`,
      };
    }

    return { valid: true };
  };

  // ✅ Improved server error message extraction
  const extractServerError = (err) => {
    if (!err) return "An unexpected error occurred";

    if (typeof err === "string") return err;

    if (err?.response?.data) {
      const data = err.response.data;

      // Direct error message
      if (data.message) return data.message;
      if (data.error) return data.error;
      if (data.title) return data.title;

      // Validation errors
      if (data.errors) {
        if (Array.isArray(data.errors)) {
          return data.errors.join(", ");
        }
        if (typeof data.errors === "object") {
          return Object.values(data.errors).flat().join(", ");
        }
      }

      // Common error messages
      if (data.detail) return data.detail;
    }

    if (err?.message) return err.message;
    if (err?.error) return err.error;

    // Network errors
    if (err?.code === "ECONNABORTED") {
      return "Connection timeout. Please try again";
    }

    if (err?.code === "ERR_NETWORK") {
      return "Server connection error. Please check your internet connection";
    }

    return "An error occurred while uploading the file. Please try again";
  };

  // ✅ Upload file with improvements
  const uploadToRedux = async (file, description) => {
    const uploadId = Date.now() + Math.random();
    const newFile = {
      id: uploadId,
      file,
      name: file.name,
      progress: 0,
      status: "uploading",
    };

    setUploadingFiles((prev) => [...prev, newFile]);

    try {
      const formData = new FormData();
      formData.append("File", file);
      formData.append("Description", description || "");
      formData.append("AppointmentId", selectedPatient?.id || "");

      await dispatch(
        addMedicalImg({
          formData,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadingFiles((prev) =>
              prev.map((f) => (f.id === uploadId ? { ...f, progress } : f))
            );
          },
        })
      ).unwrap();

      setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadId));

      const newImage = {
        id: uploadId,
        name: file.name,
        fileName: file.name,
        description,
        uploadedAt: "Just now",
        isDicom: true,
        src: URL.createObjectURL(file),
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        modality: "DX", // Default modality
      };

      setDisplayedImages((prev) =>
        [newImage, ...prev].slice(0, currentPage * itemsPerPage)
      );
      showSnackbar(`${file.name} uploaded successfully`, "success");

      // ✅ Refresh gallery section only
      if (selectedPatient?.id) {
        dispatch(getMedicalImg(selectedPatient?.id));
      }
    } catch (err) {
      console.error("❌ Upload error full details:", err);
      console.error("Error response:", err?.response?.data);
      console.error("Error message:", err?.message);
      console.error("Error status:", err?.response?.status);

      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === uploadId ? { ...f, status: "error", progress: 100 } : f
        )
      );

      const serverErrorMessage = extractServerError(err);
      showSnackbar(
        `Failed to upload ${file.name}: ${serverErrorMessage}`,
        "error"
      );
    }
  };

  // ✅ Process files after adding description
  const handleFilesWithDescription = async () => {
    setOpenDescriptionModal(false);
    if (!imageDescription.trim()) {
      showSnackbar("Please add a description for the medical image", "warning");
      return;
    }

    for (const fileData of pendingFiles) {
      await uploadToRedux(fileData.file, imageDescription);
    }

    setPendingFiles([]);
    setImageDescription("");
  };

  // ✅ Process files with validation
  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const validFiles = [];
    const invalidFiles = [];

    for (const file of fileArray) {
      const validation = validateFile(file);
      if (!validation.valid) {
        invalidFiles.push({ name: file.name, error: validation.error });
      } else {
        validFiles.push({ file, name: file.name });
      }
    }

    // Show invalid files errors
    if (invalidFiles.length > 0) {
      const errorMessages = invalidFiles.map((f) => f.error).join("\n");
      showSnackbar(errorMessages, "error");
    }

    if (validFiles.length > 0) {
      setPendingFiles(validFiles);
      setOpenDescriptionModal(true);
    }
  };

  const handleInputChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    event.target.value = "";
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleRemoveUploading = (id) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDeleteImage = (id) => {
    dispatch(delMedicalImg(id))
      .unwrap()
      .then(() => {
        showSnackbar("Image deleted successfully", "success");
        // إعادة جلب الصور بدون loader
        if (selectedPatient?.id) {
          dispatch(getMedicalImg(selectedPatient?.id));
        }
      })
      .catch((err) => {
        const errorMessage = extractServerError(err);
        showSnackbar(`Failed to delete image: ${errorMessage}`, "error");
      });
  };

  const handleViewImage = (image) => {
    window.open(image.src, "_blank");
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const endIndex = nextPage * itemsPerPage;
    const newDisplayedImages = allImages.slice(0, endIndex);

    setDisplayedImages(newDisplayedImages);
    setCurrentPage(nextPage);
  };

  // ✅ تنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

      if (diffHours < 1) {
        return "Just now";
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      } else if (diffDays === 1) {
        return "Yesterday";
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    if (selectedPatient?.id) {
      dispatch(getMedicalImg(selectedPatient?.id));
    }
    // ✅ Cleanup: تعطيل جميع عناصر cornerstone عندUnmount
    return () => {
      const elements = document.querySelectorAll(".cornerstone-element");
      elements.forEach((el) => cornerstone.disable(el));
    };
  }, [selectedPatient?.id, dispatch]);

  // تهيئة الـ WADO Image Loader
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

  // إعدادات الـ Loader
  cornerstoneWADOImageLoader.configure({
    useWebWorkers: true,
    decodeConfig: {
      convertFloatPixelDataToInt: true,
    },
  });

  // تسجيل الـ image loaders
  cornerstone.registerImageLoader(
    "wadouri",
    cornerstoneWADOImageLoader.loadImage
  );
  cornerstone.registerImageLoader(
    "dicomweb",
    cornerstoneWADOImageLoader.loadImage
  );
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".dcm,.dicom,.jpg,.jpeg,.png,.webp"
        style={{ display: "none" }}
        onChange={handleInputChange}
      />

      {/* ✅ Improved Dialog */}
      <Dialog
        open={openDescriptionModal}
        onClose={() => {
          setOpenDescriptionModal(false);
          setPendingFiles([]);
          setImageDescription("");
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            p: { xs: 1, sm: 2 },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: { xs: "18px", sm: "20px" },
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Avatar sx={{ bgcolor: "#5cb998", width: 32, height: 32 }}>
            <Description fontSize="small" />
          </Avatar>
          Add Image Details
          <IconButton
            onClick={() => {
              setOpenDescriptionModal(false);
              setPendingFiles([]);
              setImageDescription("");
            }}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2.5}>
            {/* File preview */}
            <Box
              sx={{
                p: 2,
                borderRadius: "12px",
                bgcolor: "#f0f9f4",
                border: "1px solid #5cb998",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#5cb998",
                    color: "white",
                  }}
                >
                  <InsertDriveFile fontSize="small" />
                </Avatar>
                <Box>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    fontSize={{ xs: "12px", sm: "14px" }}
                    color="#2d3748"
                  >
                    {pendingFiles.length} DICOM file
                    {pendingFiles.length > 1 ? "s" : ""}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontSize={{ xs: "10px", sm: "12px" }}
                    sx={{
                      display: "block",
                      maxWidth: 300,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {pendingFiles.map((f) => f.name).join(", ")}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Description field */}
            <FormControl fullWidth>
              <TextField
                label="Description / Medical Notes"
                placeholder="Enter a brief description for the medical image..."
                multiline
                rows={4}
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                required
                fullWidth
                helperText="This description will help organize medical images"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    fontSize: { xs: "13px", sm: "14px" },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "13px", sm: "14px" },
                  },
                }}
              />
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1, gap: 1 }}>
          <Button
            onClick={() => {
              setOpenDescriptionModal(false);
              setPendingFiles([]);
              setImageDescription("");
            }}
            sx={{
              textTransform: "none",
              fontSize: { xs: "13px", sm: "14px" },
              fontWeight: 500,
              color: "text.secondary",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleFilesWithDescription}
            variant="contained"
            disabled={!imageDescription.trim() || loading}
            sx={{
              textTransform: "none",
              fontSize: { xs: "13px", sm: "14px" },
              fontWeight: 600,
              bgcolor: "#5cb998",
              px: 3,
              color: "white",
              borderRadius: "10px",
              "&:hover": { bgcolor: "#4caf8a" },
              "&.Mui-disabled": { bgcolor: "#ccc" },
            }}
          >
            {loading ? "Uploading..." : "Upload Images"}
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          bgcolor: "#f5f7fa",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          mb={3}
          gap={2}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={600}
              mb={0.5}
              fontSize={{ xs: "20px", sm: "24px", md: "28px" }}
            >
              Medical Images
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              fontSize={{ xs: "12px", sm: "14px" }}
            >
              Manage patient radiology and medical scans
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleClickUpload}
            disabled={loading}
            sx={{
              bgcolor: "#5cb998",
              textTransform: "none",
              borderRadius: 1,
              px: { xs: 2, sm: 3 },
              py: { xs: 0.75, sm: 1 },
              color: "white",
              fontSize: { xs: "13px", sm: "14px" },
              fontWeight: 500,
              width: { xs: "100%", sm: "auto" },
              "&:hover": { bgcolor: "#4caf8a" },
              "&.Mui-disabled": { bgcolor: "#ccc" },
            }}
          >
            {loading ? "Processing..." : "Upload Image"}
          </Button>
        </Box>

        {/* Main Container */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            border: "1px solid #e9ecef",
            bgcolor: "white",
          }}
        >
          {/* Upload Area */}
          <Box
            onClick={handleClickUpload}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              border: `2px dashed ${isDragging ? "#5cb998" : "#d1e7dd"}`,
              borderRadius: 2,
              p: { xs: 3, sm: 4, md: 6 },
              textAlign: "center",
              mb: 3,
              cursor: "pointer",
              transition: "all 0.2s ease",
              bgcolor: isDragging ? "#f0f9f4" : "transparent",
              "&:hover": {
                border: "2px dashed #5cb998",
                bgcolor: "#f8f9fa",
              },
            }}
          >
            <Avatar
              sx={{
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                bgcolor: "#d1fae5",
                color: "#5cb998",
                mx: "auto",
                mb: 2,
              }}
            >
              <CloudUploadIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
            </Avatar>
            <Typography
              variant="h6"
              fontWeight={600}
              mb={1}
              fontSize={{ xs: "14px", sm: "16px", md: "18px" }}
            >
              Click or drag file here to upload
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              mb={0.5}
              fontSize={{ xs: "11px", sm: "13px" }}
              px={{ xs: 1, sm: 0 }}
            >
              Supports single or bulk upload
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              flexWrap="wrap"
            >
              <Typography>DICOM Only</Typography>
              <Typography>Max 50MB</Typography>
            </Stack>
          </Box>

          {/* Uploading Section */}
          {uploadingFiles.length > 0 && (
            <Box mb={4}>
              <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#5cb998",
                    animation: "pulse 1.5s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%": { opacity: 1 },
                      "50%": { opacity: 0.5 },
                      "100%": { opacity: 1 },
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  fontWeight={500}
                  fontSize={{ xs: "12px", sm: "13px" }}
                >
                  Uploading ({uploadingFiles.length})
                </Typography>
              </Box>
              {uploadingFiles.map((uploadingFile) => (
                <Box
                  key={uploadingFile.id}
                  sx={{
                    p: { xs: 1, sm: 1.5 },
                    borderRadius: 1,
                    bgcolor: "#f8f9fa",
                    border: "1px solid #e9ecef",
                    mb: 1,
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={{ xs: 1, sm: 2 }}
                    flexDirection={{ xs: "column", sm: "row" }}
                  >
                    <Description
                      sx={{
                        color: "#6c757d",
                        fontSize: { xs: 18, sm: 20 },
                      }}
                    />
                    <Box flex={1} width="100%">
                      <Typography
                        variant="body2"
                        fontWeight={400}
                        mb={0.5}
                        fontSize={{ xs: "12px", sm: "13px" }}
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {uploadingFile.name}
                      </Typography>
                      <Box sx={{ position: "relative", width: "100%" }}>
                        <LinearProgress
                          variant="determinate"
                          value={uploadingFile.progress}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: "#e9ecef",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: "#5cb998",
                              borderRadius: 3,
                              transition: "width 0.3s ease",
                            },
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontSize={{ xs: "12px", sm: "13px" }}
                      minWidth={40}
                      textAlign={{ xs: "center", sm: "right" }}
                    >
                      {Math.round(uploadingFile.progress)}%
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveUploading(uploadingFile.id)}
                      sx={{ color: "#adb5bd" }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Gallery Section */}
          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
              mb={2.5}
              fontSize={{ xs: "14px", sm: "16px", md: "18px" }}
            >
              Gallery ({images?.data?.length} image
              {images?.data?.length !== 1 ? "s" : ""})
            </Typography>

            {images?.data?.length === 0 ? (
              <Box
                sx={{
                  p: { xs: 4, sm: 6 },
                  textAlign: "center",
                  border: "2px dashed #e9ecef",
                  borderRadius: 2,
                }}
              >
                <Box
                  component="img"
                  src="/assets/schudle/image 217.png"
                  alt="No images"
                  sx={{
                    width: { xs: 80, sm: 100 },
                    height: { xs: 80, sm: 100 },
                    mb: 2,
                    opacity: 0.5,
                  }}
                />
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontSize={{ xs: "13px", sm: "14px" }}
                  mb={0.5}
                >
                  No images uploaded yet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontSize={{ xs: "11px", sm: "12px" }}
                >
                  Start by uploading medical images in DICOM format
                </Typography>
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 1.5, sm: 2, md: 2.5 },
                    overflowX: "auto",
                    pb: 2,
                    scrollBehavior: "smooth",
                    "&::-webkit-scrollbar": {
                      height: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                      bgcolor: "#f0f0f0",
                      borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      bgcolor: "#5cb998",
                      borderRadius: "10px",
                      "&:hover": {
                        bgcolor: "#4caf8a",
                      },
                    },
                  }}
                >
                  {images?.data?.map((image) => (
                    <Box
                      key={image.id}
                      sx={{
                        flex: "0 0 auto",
                        width: { xs: 140, sm: 160, md: 180 },
                        position: "relative",
                        borderRadius: "8px",
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                        },
                        "&:hover .imageOverlay": {
                          opacity: 1,
                        },
                        "&:hover .deleteBtn": {
                          opacity: 1,
                        },
                      }}
                    >
                      {/* Image Container */}
                      <Box
                        sx={{
                          position: "relative",
                          paddingTop: "100%",
                          bgcolor: "#f0f0f0",
                          overflow: "hidden",
                        }}
                      >
                        {renderImageContent(image)}

                        {/* Overlay on Hover */}
                        <Box
                          className="imageOverlay"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            bgcolor: "rgba(0, 0, 0, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                            cursor: "pointer",
                          }}
                          onClick={() => handleViewImage(image)}
                        >
                          <VisibilityOutlined
                            sx={{
                              color: "white",
                              fontSize: { xs: 24, sm: 28 },
                            }}
                          />
                        </Box>

                        {/* Delete Button */}
                        <IconButton
                          className="deleteBtn"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image.id);
                          }}
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            bgcolor: "rgba(220, 53, 69, 0.9)",
                            color: "white",
                            width: 28,
                            height: 28,
                            opacity: 0,
                            transition: "all 0.3s ease",
                            zIndex: 10,
                            "&:hover": {
                              bgcolor: "rgba(200, 35, 51, 1)",
                            },
                          }}
                        >
                          <Close sx={{ fontSize: 16 }} />
                        </IconButton>

                        {/* Critical Badge */}
                        {image.isCritical && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 4,
                              left: 4,
                              bgcolor: "#fff3cd",
                              color: "#856404",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "10px",
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: "2px",
                              zIndex: 5,
                            }}
                          >
                            <WarningAmber sx={{ fontSize: 12 }} />
                          </Box>
                        )}
                      </Box>

                      {/* Info Section */}
                      <Box
                        sx={{
                          p: { xs: "8px", sm: "10px" },
                          bgcolor: "white",
                          borderTop: "1px solid #e9ecef",
                        }}
                      >
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          fontSize={{ xs: "10px", sm: "11px" }}
                          noWrap
                          title={image.fileName}
                          sx={{
                            color: "#2d3748",
                            display: "block",
                            mb: "3px",
                          }}
                        >
                          {image.fileName}
                        </Typography>

                        <Typography
                          variant="caption"
                          fontSize={{ xs: "9px", sm: "10px" }}
                          color="text.secondary"
                          sx={{
                            display: "block",
                            color: "#6c757d",
                          }}
                        >
                          Uploaded {formatDate(image.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {hasMoreImages && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    mt={{ xs: 2, sm: 3 }}
                  >
                    <Button
                      endIcon={<ExpandMore />}
                      onClick={handleLoadMore}
                      disabled={loading}
                      sx={{
                        color: "#5cb998",
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: { xs: "13px", sm: "14px" },
                        px: 3,
                        py: 1,
                        border: "1px solid #5cb998",
                        borderRadius: "10px",
                        "&:hover": {
                          bgcolor: "rgba(92, 185, 152, 0.05)",
                          color: "#4caf8a",
                          borderColor: "#4caf8a",
                        },
                        "&.Mui-disabled": {
                          color: "#ccc",
                          borderColor: "#ccc",
                        },
                      }}
                    >
                      {loading ? "Loading..." : "Load More Images"}
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            fontSize: "14px",
            fontWeight: 500,
          }}
          icon={
            snackbar.severity === "success" ? (
              <CheckCircle />
            ) : snackbar.severity === "warning" ? (
              <WarningAmber />
            ) : (
              <ErrorIcon />
            )
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
