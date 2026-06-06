import "./App.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import ProtectedRoute from "./components/ProtectedRoute";

const LogIn       = lazy(() => import("./auth/logIn"));
const SignUp      = lazy(() => import("./auth/signUp"));
const ForgetPass  = lazy(() => import("./auth/forgetPass"));
const Otp         = lazy(() => import("./auth/Otp"));
const ResetPass   = lazy(() => import("./auth/resetPass"));
const ComPro      = lazy(() => import("./auth/compeleteProfile"));
const Dashboard   = lazy(() => import("./pages/dashboard/dashboard"));
const Patients    = lazy(() => import("./pages/patients/patients"));
const HelpSupport = lazy(() => import("./pages/help/h&s"));
const DoctorProfile = lazy(() => import("./pages/doctorsProfile/doctors"));
const Settings    = lazy(() => import("./pages/settings/settings"));
const Schedule    = lazy(() => import("./pages/schedule/Schedule"));
const Dicom       = lazy(() => import("./pages/dicom/dicom"));
const Reports     = lazy(() => import("./pages/reports/reports"));
const Message     = lazy(() => import("./pages/message/message"));
const ImageViwer  = lazy(() => import("./pages/imageViwer/imageViwer"));
const PatientList = lazy(() => import("./pages/pathientList/PatientList"));
const OverView    = lazy(() => import("./pages/overView/overView"));
const AppointmentsDetails      = lazy(() => import("./pages/schedule/appoinmantDetals"));
const MedicalImaging           = lazy(() => import("./pages/schedule/uploadImage"));
const AppointmentScheduleTable = lazy(() => import("./pages/schedule/timeLineAppomint"));

// Loading fallback
const PageLoader = () => (
  <div style={{ display:"flex", justifyContent:"center", 
                alignItems:"center", height:"100vh" }}>
    <CircularProgress />
  </div>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* ✅ لف الـ Routes بـ Suspense */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/signup"            element={<SignUp />} />
          <Route path="/logIn"             element={<LogIn />} />
          <Route path="/compeleteprofile"  element={<ComPro />} />
          <Route path="/resetpass"         element={<ResetPass />} />
          <Route path="/forgetpass"        element={<ForgetPass />} />
          <Route path="/otp"               element={<Otp />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/patient" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
          <Route path="/patientlist" element={<ProtectedRoute><PatientList /></ProtectedRoute>} />
          <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
          <Route path="/medicalimaging" element={<ProtectedRoute><MedicalImaging /></ProtectedRoute>} />
          <Route path="/appointmentsdetails" element={<ProtectedRoute><AppointmentsDetails /></ProtectedRoute>} />
          <Route path="/dicom" element={<ProtectedRoute><Dicom /></ProtectedRoute>} />
          <Route path="/imageViwer" element={<ProtectedRoute><ImageViwer /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/doctorprofile" element={<ProtectedRoute><DoctorProfile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/helpsupport" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />
          <Route path="/message" element={<ProtectedRoute><Message /></ProtectedRoute>} />
          <Route path="/overview" element={<ProtectedRoute><OverView /></ProtectedRoute>} />
          <Route path="/AppointmentTimeline" element={<ProtectedRoute><AppointmentScheduleTable /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;