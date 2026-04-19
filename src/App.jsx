//import { useState } from "react";
import "./App.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import LogIn from "./auth/logIn";
import SignUp from "./auth/signUp";
import ForgetPass from "./auth/forgetPass";
import Otp from "./auth/Otp";
import ResetPass from "./auth/resetPass";
import ComPro from "./auth/compeleteProfile";
import Dashboard from "./pages/dashboard/dashboard";
import Patients from "./pages/patients/patients";
import HelpSupport from "./pages/help/h&s";
import DoctorProfile from "./pages/doctorsProfile/doctors";
import Settings from "./pages/settings/settings";
import Schedule from "./pages/schedule/Schedule";
import Dicom from "./pages/dicom/dicom";
import Reports from "./pages/reports/reports";
import Message from "./pages/message/message";
import { Routes, Route } from "react-router-dom";
import ImageViwer from "./pages/imageViwer/imageViwer";
import PatientList from "./pages/pathientList/PatientList";
import OverView from "./pages/overView/overView";
import BasicModal from "./pages/schedule/Modal/MedicalModal";
import AddPrescription from "./pages/schedule/Modal/prescriptionModal";
import AddDiagnosis from "./pages/schedule/Modal/diagnosis";
import AppointmentsDetails from "./pages/schedule/appoinmantDetals";
//import Details1 from "./pages/schedule/details1";
import MedicalImaging from "./pages/schedule/uploadImage";
import AppointmentScheduleTable from "./pages/schedule/timeLineAppomint";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/logIn" element={<LogIn />} />
        <Route path="/compeleteprofile" element={<ComPro />} />
        <Route path="/logIn/forgetpass/otp/resetpass" element={<ResetPass />} />
        <Route path="/logIn/forgetpass" element={<ForgetPass />} />
        <Route path="/logIn/forgetpass/otp" element={<Otp />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patientlist/patient"
          element={
            <ProtectedRoute>
              <Patients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patientlist"
          element={
            <ProtectedRoute>
              <PatientList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medicalimaging"
          element={
            <ProtectedRoute>
              <MedicalImaging />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule/appointmentsdetails"
          element={
            <ProtectedRoute>
              <AppointmentsDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dicom"
          element={
            <ProtectedRoute>
              <Dicom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dicom/imageViwer"
          element={
            <ProtectedRoute>
              <ImageViwer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctorprofile"
          element={
            <ProtectedRoute>
              <DoctorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/helpsupport"
          element={
            <ProtectedRoute>
              <HelpSupport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/message"
          element={
            <ProtectedRoute>
              <Message />
            </ProtectedRoute>
          }
        />
        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <OverView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AppointmentTimeline"
          element={
            <ProtectedRoute>
              <AppointmentScheduleTable />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}
export default App;
