// src/components/GlobalSnackbar.jsx
import React from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';

// ✅ استورد أي clear actions محتاجها (ضيف أي slice تاني هنا)
import { clearAuthError } from '../redux/auth/authSlice';
import { clearError } from '../redux/patientList/patientList';
// import { clearScheduleError } from '../redux/schedule/schedule';  // ← لو فيه
// import { clearPatientError } from '../redux/patient/patientSlice';  // ← لو فيه

export default function GlobalSnackbar({ snackbar, onClose }) {
  const dispatch = useDispatch();

  // ✅ دالة موحدة للإغلاق: تقفل الـ Snackbar + تمسح كل الـ errors
  const handleClose = () => {
    onClose?.(); 

    dispatch(clearAuthError());
    dispatch(clearError());
  
  };

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={handleClose}  // ✅ نستخدم الـ handleClose المخصصة
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}  // ✅ نفس الدالة لزر الإغلاق
        severity={snackbar.severity}
        sx={{ width: '100%' }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}  // ✅ نفس الدالة لزر ×
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}