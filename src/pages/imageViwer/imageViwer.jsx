import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import cornerstone from "cornerstone-core";
import {
  isDicomFile,
  loadDicomOnElement,
  cleanupDicomElement,
  getDisplayImageUrl,
} from "../../utils/dicomUtils";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  Divider,
  Tooltip,
  Stack,
  Chip,
  Card,
  CardContent,
  Fade,
  Slider,
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
import { useSnackbar } from "../../hooks/useSnackbar";
import GlobalSnackbar from "../../components/GlobalSnackbar";

export default function DicomViewer() {
  const [loadingFailed, setLoadingFailed] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [inverted, setInverted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRef = useRef(null);
  const [localMedicalImages, setLocalMedicalImages] = useState([]);
  const medicalImages = useSelector(
    (state) => state.dataSliceImgViwer.mediclImage
  );
  const userInfo = useSelector((state) => state.dataSliceImgViwer.userInfo);

  const defaultDicomImages = [
    {
      src: "/assets/default-dicom/concurrent-adrenal-phaeochromocytoma-and-adrenal-adenoma.jpeg",
      thumbnail:
        "/assets/default-dicom/concurrent-adrenal-phaeochromocytoma-and-adrenal-adenoma.jpeg",
      description: "CT Head Scan",
      type: ".jpg",
      fileName: "ct-head.jpg",
      uploadDate: new Date().toISOString(),
      id: "demo-ct-1",
    },
    {
      src: "/assets/default-dicom/patellar-resurfacing-heterotopic-ossification (1).jpeg",
      thumbnail:
        "/assets/default-dicom/patellar-resurfacing-heterotopic-ossification (1).jpeg",
      description: "MRI Brain Scan",
      type: ".jpg",
      fileName: "mri-brain.jpg",
      uploadDate: new Date().toISOString(),
      id: "demo-mri-1",
    },
    {
      src: "/assets/default-dicom/patellar-resurfacing-heterotopic-ossification.jpeg",
      thumbnail:
        "/assets/default-dicom/patellar-resurfacing-heterotopic-ossification.jpeg",
      description: "Chest X-Ray",
      type: ".jpg",
      fileName: "xray-chest.jpg",
      uploadDate: new Date().toISOString(),
      id: "demo-xray-1",
    },
    {
      src: "/assets/default-dicom/proximal-interphalangeal-dislocation-ulnarmedial.jpeg",
      thumbnail:
        "/assets/default-dicom/proximal-interphalangeal-dislocation-ulnarmedial.jpeg",
      description: "Chest X-Ray",
      type: ".jpg",
      fileName: "xray-chest.jpg",
      uploadDate: new Date().toISOString(),
      id: "demo-xray-2",
    },
  ];
  // Get images from navigation state or use default
  const receivedImages = location.state?.allImages || [];
  const selectedImage = location.state?.image;
  const patientInfo = userInfo || {
    name: "_",
    age: "_",
    gender: "_",
    bloodType: "_",
    id: "_",
    lastVisit: "_",
  };
  // ✅ دالة مساعدة لجلب الـ appointmentId الصحيح من أي مصدر متاح
  const getAppointmentId = () => {
    return (
      selectedImage?.appointmentId ||
      location.state?.image?.appointmentId ||
      location.state?.allImages?.[0]?.appointmentId ||
      userInfo?.appointmentId ||
      userInfo?.id // fallback لو مفيش حاجة تانية
    );
  };
  // Add DICOM file to default images
  const images = useMemo(() => {
    const appointmentId = getAppointmentId();

    // ✅ 1️⃣ جهز الصور المحلية (من localStorage) لنفس الـ appointmentId
    const localImagesForAppointment = localMedicalImages
      .filter((img) => img.appointmentId === appointmentId)
      .map((img) => ({
        ...img,
        type: img.type || img.fileType || ".jpg", // ✅ أضف type لو مفيش
        thumbnail: img.thumbnail || img.src, // ✅ أضف thumbnail لو مفيش
        uploadDate:
          img.uploadDate || img.uploadedAt || new Date().toISOString(),
      }));

    let resultImages = [];

    // ✅ 2️⃣ لو التحميل نجح (السيرفر شغال) وفيه صور من الـ Backend
    if (!loadingFailed && medicalImages?.length > 0) {
      const backendImages = medicalImages.map((img) => ({
        src: img.viewerUrl,
        thumbnail: img.viewerUrl,
        description: img.description || img.fileName || "Medical Image",
        type: img.fileType || ".dcm",
        fileName: img.fileName,
        uploadDate: img.createdAt,
        id: img.id,
        appointmentId: img.appointmentId,
      }));

      // منع التكرار (لو فيه صورة محلية بنفس الاسم)
      const uniqueBackendImages = backendImages.filter(
        (backendImg) =>
          !localImagesForAppointment.some(
            (localImg) => localImg.fileName === backendImg.fileName
          )
      );

      // ✅ الصور المحلية تظهر الأول، وبعدين صور الـ Backend
      resultImages = [...localImagesForAppointment, ...uniqueBackendImages];
    }
    // ✅ 3️⃣ لو التحميل فشل (السيرفر مش شغال) → اعرض الـ default images
    else if (loadingFailed && medicalImages?.length > 0) {
      // خلط الـ default images مع الصور المحلية
      resultImages = [...localImagesForAppointment, ...defaultDicomImages];
    }
    // ✅ 4️⃣ لو مفيش صور من الـ Backend خالص
    else {
      resultImages = [...localImagesForAppointment, ...defaultDicomImages];
    }

    // ✅ لو مفيش صور خالص
    if (resultImages.length === 0) {
      return [];
    }

    console.log("📸 Final images array:", resultImages); // ✅ logging
    return resultImages;
  }, [
    medicalImages,
    loadingFailed,
    localMedicalImages,
    selectedImage?.appointmentId,
    location.state?.image?.appointmentId,
    userInfo?.appointmentId,
    userInfo?.id,
  ]);

  // Set initial image based on selected image

  useEffect(() => {
    if (selectedImage && medicalImages?.length > 0) {
      const index = medicalImages.findIndex(
        (img) => img.id === selectedImage.id
      );
      if (index !== -1) {
        setCurrentImage(index); // ✅ من غير +1
      }
    }
  }, [selectedImage, medicalImages]);

  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  // ✅ تحميل وعرض صورة DICOM عند تغيير الصورة الحالية
  useEffect(() => {
    const current = images[currentImage];
    const element = imageRef.current;

    if (!element || !current?.src) return;

    // ✅ لو الصورة من الـ default، متحاولش تحملها من السيرفر
    if (current.id?.startsWith("demo-")) {
      return;
    }

    // ✅ نظّف فقط لو الصورة السابقة كانت DICOM
    if (isDicomFile(current.type, current.fileName)) {
      cleanupDicomElement(element);

      loadDicomOnElement(element, current.src, {
        baseUrl: import.meta.env.VITE_ORTHANC_URL || "http://localhost:8042",
        fitToWindow: false,
        onLoading: () => console.log("🔄 Loading DICOM from backend..."),
        onSuccess: () => {
          console.log("✅ Backend DICOM loaded successfully");
          // ✅ التحميل نجح → نغير loadingFailed لـ false عشان نعرض صور الـ Backend
          setLoadingFailed(false);
          setTimeout(() => applyCornerstoneTransforms(), 100);
        },
        onError: (err) => {
          console.error("❌ Backend DICOM failed:", err);
          // ✅ التحميل فشل → نفضل على الـ default images (loadingFailed = true)
          // مفيش حاجة نتغير هنا لأننا بدأنا بـ true أصلاً
        },
      });
    }

    return () => {
      if (isDicomFile(current?.type, current?.fileName)) {
        cleanupDicomElement(element);
      }
    };
  }, [currentImage, images]);
  // ✅ useEffect جديد: يطبق الـ transforms لما الـ controls تتغير
  useEffect(() => {
    const current = images[currentImage];
    // ✅ يطبق الـ transforms فقط لو الصورة الحالية نوعها DICOM
    if (isDicomFile(current?.type, current?.fileName)) {
      applyCornerstoneTransforms();
    }
  }, [zoom, brightness, contrast, rotation, inverted, currentImage]); // ✅ يعتمد على كل الـ controls

  // ✅ Cleanup عند الـ unmount
  useEffect(() => {
    return () => {
      document.querySelectorAll(".dicom-viewer-element").forEach((el) => {
        cleanupDicomElement(el);
      });
    };
  }, []);

  const handlePrevious = () => {
    setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleThumbnailClick = (index) => {
    setCurrentImage(index);
  };

  // const handleZoomIn = () => {
  //   setZoom((prev) => Math.min(prev + 10, 300));
  // };

  // const handleZoomOut = () => {
  //   setZoom((prev) => Math.max(prev - 10, 25));
  // };

  // const handleRotateRight = () => {
  //   setRotation((prev) => (prev + 90) % 360);
  // };

  // const handleRotateLeft = () => {
  //   setRotation((prev) => (prev - 90 + 360) % 360);
  //};

  // const handleReset = () => {
  //   setZoom(100);
  //   setRotation(0);
  //   // setBrightness(100);
  //   // setContrast(100);
  //   setInverted(false);
  // };

  const handleInvert = () => {
    const newInverted = !inverted;
    setInverted(newInverted);

    // ✅ لو الصورة الحالية DICOM، طبق الـ invert فوراً
    if (
      isDicomFile(images[currentImage]?.type, images[currentImage]?.fileName)
    ) {
      const element = imageRef.current;
      if (element) {
        const viewport = cornerstone.getViewport(element);
        if (viewport) {
          cornerstone.setViewport(element, {
            ...viewport,
            invert: newInverted,
          });
        }
      }
    }
  };
  const toggleFullscreen = () => {
    const targetElement =
      document.querySelector(".dicom-viewer-element") || imageRef.current;

    if (!document.fullscreenElement && targetElement) {
      targetElement.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const applyCornerstoneTransforms = () => {
    const element = imageRef.current;
    if (!element) return;

    try {
      const viewport = cornerstone.getViewport(element);
      if (viewport) {
        cornerstone.setViewport(element, {
          ...viewport,
          scale: zoom / 100, // ✅ الزوم هنا بدل setZoom
          voi: {
            windowWidth: (contrast / 100) * 4096,
            windowCenter: (brightness - 100) * 20,
          },
          rotation: rotation,
          invert: inverted,
        });
      }
    } catch (error) {
      console.warn("⚠️ Cornerstone transform error:", error);
    }
  };

  // ✅ دوال التحكم المعدلة عشان تشتغل مع DICOM فوراً

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 10, 300);
    setZoom(newZoom);
    // ✅ لو الصورة الحالية DICOM، طبق الـ zoom فوراً
    if (
      isDicomFile(images[currentImage]?.type, images[currentImage]?.fileName)
    ) {
      const element = imageRef.current;
      if (element) cornerstone.setZoom(element, newZoom / 100);
    }
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 10, 25);
    setZoom(newZoom);
    if (
      isDicomFile(images[currentImage]?.type, images[currentImage]?.fileName)
    ) {
      const element = imageRef.current;
      if (element) cornerstone.setZoom(element, newZoom / 100);
    }
  };

  const handleBrightnessChange = (e, val) => {
    setBrightness(val);
    if (
      isDicomFile(images[currentImage]?.type, images[currentImage]?.fileName)
    ) {
      const element = imageRef.current;
      if (element) {
        const viewport = cornerstone.getViewport(element);
        if (viewport) {
          cornerstone.setViewport(element, {
            ...viewport,
            voi: { ...viewport.voi, windowCenter: (val - 100) * 20 },
          });
        }
      }
    }
  };

  const handleContrastChange = (e, val) => {
    setContrast(val);
    if (
      isDicomFile(images[currentImage]?.type, images[currentImage]?.fileName)
    ) {
      const element = imageRef.current;
      if (element) {
        const viewport = cornerstone.getViewport(element);
        if (viewport) {
          cornerstone.setViewport(element, {
            ...viewport,
            voi: { ...viewport.voi, windowWidth: (val / 100) * 4096 },
          });
        }
      }
    }
  };

  const handleRotateRight = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    if (
      isDicomFile(images[currentImage]?.type, images[currentImage]?.fileName)
    ) {
      const element = imageRef.current;
      if (element) {
        const viewport = cornerstone.getViewport(element);
        if (viewport)
          cornerstone.setViewport(element, {
            ...viewport,
            rotation: newRotation,
          });
      }
    }
  };

  const handleRotateLeft = () => {
    const newRotation = (rotation - 90 + 360) % 360;
    setRotation(newRotation);
    if (
      isDicomFile(images[currentImage]?.type, images[currentImage]?.fileName)
    ) {
      const element = imageRef.current;
      if (element) {
        const viewport = cornerstone.getViewport(element);
        if (viewport)
          cornerstone.setViewport(element, {
            ...viewport,
            rotation: newRotation,
          });
      }
    }
  };

  const handleReset = () => {
    setZoom(100);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setInverted(false);

    // ✅ لو الصورة الحالية DICOM، طبق الـ reset فوراً
    if (
      isDicomFile(images[currentImage]?.type, images[currentImage]?.fileName)
    ) {
      const element = imageRef.current;
      if (element) {
        cornerstone.reset(element);
      }
    }
  };
  const getImageStyle = () => {
    // ✅ لو الصورة الحالية DICOM، مرجعش أي ستايل (لأن Cornerstone هيمسكها)
    if (
      isDicomFile(images[currentImage]?.type, images[currentImage]?.fileName)
    ) {
      return {};
    }

    // ✅ للصور العادية، طبق الـ CSS transforms زي ما هو
    return {
      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
      filter: `brightness(${brightness}%) contrast(${contrast}%) ${
        inverted ? "invert(1)" : ""
      }`,
      transition: "transform 0.3s ease, filter 0.3s ease",
    };
  };

  const getImageSrc = (image) => {
    if (!image?.src) return null;

    // ✅ لو الـ src ده Base64 → استخدمه زي ما هو
    if (image.src.startsWith("data:")) {
      return image.src;
    }

    // لو الرابط كامل (بيبدأ بـ http) أو محلي (بيبدأ بـ /) → استخدمه زي ما هو
    if (image.src.startsWith("http") || image.src.startsWith("/")) {
      return image.src;
    }

    // لو رابط نسبي → اضف الـ base URL
    return `${import.meta.env.VITE_ORTHANC_URL || "http://localhost:8042"}/${
      image.src
    }`;
  };
  // ✅ دالة لتحويل File أو Blob إلى Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // ✅ دالة قراءة الصور المحلية حسب الـ appointmentId
  const getLocalImagesByAppointmentId = (appointmentId) => {
    try {
      const key = `medical_images_${appointmentId}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading local images:", error);
      return [];
    }
  };

  // ✅ دالة لتحويل الصور القديمة من Blob إلى Base64
  const migrateBlobImages = async (appointmentId) => {
    if (!appointmentId) return [];

    const key = `medical_images_${appointmentId}`;
    const stored = localStorage.getItem(key);
    if (!stored) return [];

    const localImages = JSON.parse(stored);

    // نفلتر بس الصور اللي عندها blob URL
    const imagesToMigrate = localImages.filter((img) =>
      img.src?.startsWith("blob:")
    );
    if (imagesToMigrate.length === 0) return localImages;

    console.log(
      `🔄 Migrating ${imagesToMigrate.length} blob images to base64...`
    );

    const migratedImages = await Promise.all(
      localImages.map(async (img) => {
        if (img.src?.startsWith("blob:")) {
          try {
            const response = await fetch(img.src);
            const blob = await response.blob();
            const base64 = await fileToBase64(blob);
            return { ...img, src: base64 };
          } catch (error) {
            console.error("❌ Failed to migrate image:", img.id, error);
            return img;
          }
        }
        return img;
      })
    );

    // نحفظ الصور المُهاجرة
    localStorage.setItem(key, JSON.stringify(migratedImages));
    return migratedImages;
  };
  // ✅ تحميل الصور المحلية والـ migration
  // ✅ الجديد: يستخدم الـ appointmentId الصحيح
  useEffect(() => {
    const appointmentId = getAppointmentId();

    if (appointmentId) {
      migrateBlobImages(appointmentId).then((migrated) => {
        // ✅ فلتر بس الصور اللي لنفس الـ appointmentId
        const filteredImages = migrated.filter(
          (img) => img.appointmentId === appointmentId
        );
        setLocalMedicalImages(filteredImages);
      });
    }
  }, [
    selectedImage?.appointmentId,
    location.state?.image?.appointmentId,
    userInfo?.appointmentId,
    userInfo?.id,
  ]);
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
                  label={".dcm"}
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
                  {images.length === 0 ? (
                    <Box
                      sx={{
                        p: 3,
                        textAlign: "center",
                        color: "text.secondary",
                        fontSize: "14px",
                      }}
                    >
                      <Typography fontSize="24px" mb={1}>
                        📷
                      </Typography>
                      <Typography fontWeight={600}>
                        No images available
                      </Typography>
                      <Typography
                        fontSize="12px"
                        color="text.secondary"
                        mt={0.5}
                      >
                        Images will appear here when uploaded
                      </Typography>
                    </Box>
                  ) : (
                    <Stack direction={{ xs: "row", md: "column" }} spacing={2}>
                      {images.map((image, index) => (
                        <Box
                          key={index}
                          onClick={() => handleThumbnailClick(index)}
                          sx={{
                            cursor: "pointer",
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
                          {!medicalImages?.length &&
                            image.id?.startsWith("demo-") && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 8,
                                  right: 8,
                                  bgcolor: "primary.main",
                                  color: "white",
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: "4px",
                                  fontSize: "10px",
                                  fontWeight: 700,
                                  zIndex: 10,
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                                }}
                              >
                                Demo
                              </Box>
                            )}
                          <img
                            src={
                              // ✅ لو الـ src ده Base64 أو رابط كامل، استخدمه زي ما هو
                              image.src?.startsWith("data:") ||
                              image.src?.startsWith("http") ||
                              image.src?.startsWith("/")
                                ? image.src
                                : image.thumbnail
                            }
                            alt={image.description}
                            style={{
                              width: "100%",
                              height: "120px",
                              objectFit: "cover",
                              display: "block",
                            }}
                            onError={(e) => {
                              console.error(
                                "❌ Failed to load thumbnail:",
                                image.src || image.thumbnail
                              );
                              e.target.src =
                                "https://via.placeholder.com/120x120/5cb998/ffffff?text=No+Image";
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
                  )}
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
                  {images.length > 0 &&
                  currentImage >= 0 &&
                  currentImage < images.length ? (
                    // ✅ الصورة موجودة والـ index صحيح
                    (() => {
                      const currentImg = images[currentImage];
                      console.log("🖼️ Rendering image:", currentImg); // ✅ logging

                      // ✅ تأكد إن فيه src
                      if (!currentImg?.src) {
                        return (
                          <Box
                            sx={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              flexDirection: "column",
                            }}
                          >
                            <Typography fontSize="24px">⚠️</Typography>
                            <Typography fontSize="16px">
                              No image source available
                            </Typography>
                          </Box>
                        );
                      }

                      // ✅ لو الصورة DICOM حقيقية (مش demo و مش local)
                      if (
                        isDicomFile(currentImg?.type, currentImg?.fileName) &&
                        !currentImg?.id?.startsWith("demo-") &&
                        !currentImg?.isLocal
                      ) {
                        return (
                          <Box
                            ref={imageRef}
                            className="dicom-viewer-element"
                            sx={{
                              width: "100%",
                              height: "100%",
                              bgcolor: "#000",
                            }}
                          />
                        );
                      }

                      // ✅ للصور العادية (بما فيها الـ local images والـ default)
                      return (
                        <img
                          ref={imageRef}
                          src={getImageSrc(currentImg)}
                          alt={currentImg?.description || "No image"}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            ...getImageStyle(),
                          }}
                          onError={(e) => {
                            console.error(
                              "❌ Failed to load main image:",
                              currentImg
                            );
                            console.error(
                              "❌ Image src:",
                              currentImg.src?.substring(0, 100)
                            );
                            e.target.src =
                              "https://via.placeholder.com/400x400/5cb998/ffffff?text=Image+Not+Found";
                          }}
                          onLoad={() => {
                            console.log("✅ Main image loaded successfully");
                          }}
                        />
                      );
                    })()
                  ) : (
                    // ✅ لو مفيش صور أو الـ index غلط
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        bgcolor: "#1a1a1a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Typography fontSize="32px">🩻</Typography>
                      <Typography fontSize="16px">
                        {images.length === 0
                          ? "No images available"
                          : "Invalid image index"}
                      </Typography>
                      <Typography fontSize="12px" color="text.secondary">
                        {images.length === 0
                          ? "Upload images to view them here"
                          : `Current index: ${currentImage}, Total: ${images.length}`}
                      </Typography>
                    </Box>
                  )}

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
                        {images[currentImage]?.description || "No image"}
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
                  {images[currentImage]?.uploadDate && (
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
                          images[currentImage]?.uploadDate
                        )?.toLocaleDateString()}
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
                      onChange={(e, val) => {
                        setZoom(val);
                        // ✅ لو الصورة الحالية DICOM، طبق الـ zoom فوراً
                        if (
                          isDicomFile(
                            images[currentImage]?.type,
                            images[currentImage]?.fileName
                          )
                        ) {
                          const element = imageRef.current;
                          if (element) {
                            cornerstone.setViewport(element, {
                              scale: val / 100,
                            });
                          }
                        }
                      }}
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
                      onChange={handleBrightnessChange} // ✅ غيّر من (e, val) => setBrightness(val) للدالة الجديدة
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
                      onChange={handleContrastChange} // ✅ غيّر من (e, val) => setContrast(val) للدالة الجديدة
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
                    label: "Blood Type",
                    value: patientInfo.bloodType,
                    icon: <Bloodtype />,
                    color: "#f44336",
                  },
                  {
                    label: "Patient ID",
                    value: patientInfo.id?.slice(-6) || "_",
                    icon: <Badge />,
                    color: "#9c27b0",
                  },
                ].map((item, index) => (
                  <Card
                    key={item.id || index}
                    sx={{
                      width: "200px",
                      minWidth: "200px",
                      borderRadius: "16px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                      flexShrink: 0,
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
      <GlobalSnackbar snackbar={snackbar} onClose={hideSnackbar} />
    </Box>
  );
}
