import {
  Container,
  Stack,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  Fade,
  Chip,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useState, useEffect } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetPass, clearAuthError } from "../redux/auth/authSlice";
import CircularProgress from "@mui/material/CircularProgress";

export default function ResetPass() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
  });

  // حالة الحقول
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  // Redux
  const dispatch = useDispatch();
  const { loading, error, forgotPasswordEmail } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();
  const location = useLocation();

  // تحقق من وجود الإيميل
  useEffect(() => {
    if (!forgotPasswordEmail) {
      navigate("/logIn/forgetpass", { replace: true });
    }
  }, [forgotPasswordEmail, navigate]);

  // مسح الخطأ من Redux
  useEffect(() => {
    if (error) {
      setLocalError(error);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  // دوال إظهار/إخفاء الباسورد
  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleToggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // دالة التحقق من صحة الباسورد
  const getPasswordValidation = (password) => ({
    length: password.length >= 8,
    upperCase: /[A-Z]/.test(password),
    lowerCase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  });

  // دالة إعادة تعيين الباسورد
  const handleResetPassword = () => {
    setLocalError("");

    // التحقق من وجود الإيميل
    if (!forgotPasswordEmail) {
      setLocalError(
        "Session expired. Please restart the password reset process."
      );
      return;
    }

    // التحقق من ملء جميع الحقول
    if (!password || !confirmPassword) {
      setLocalError("⚠️ Please fill in all fields");
      return;
    }

    // التحقق من تطابق الباسورد
    if (password !== confirmPassword) {
      setLocalError("⚠️ Passwords do not match");
      return;
    }

    // التحقق من شروط الباسورد
    const allValid = Object.values(passwordValidation).every(Boolean);
    if (!allValid) {
      setLocalError("⚠️ Password does not meet all requirements");
      return;
    }
    dispatch(
      resetPass({
        email: forgotPasswordEmail,
        password,
        confirmPassword,
      })
    )
      .unwrap()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        setLocalError(error || "Failed to reset password. Please try again.");
      });
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordValidation(getPasswordValidation(newPassword));
    setLocalError("");
  };

  // تحديث حالة تأكيد الباسورد
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setLocalError("");
  };

  return (
    <Stack
      spacing={4}
      sx={{
        height: "100vh",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: { xs: "center", md: "space-between" },
        alignItems: "center",
      }}
    >
      {/* LEFT SIDE DESIGN */}
      <Box
        sx={{
          height: "100%",
          width: "40%",
          display: { xs: "none", md: "block" },
          position: "relative",
        }}
      >
        <img
          src="/assets/auth/Group 1.png"
          alt=""
          style={{
            position: "absolute",
            zIndex: "1",
            right: "0",
            top: "96px",
            width: "85%",
            height: "70%",
          }}
        />
        <Box
          sx={{
            height: "100%",
            width: "80%",
            padding: "0 20px 20px",
            backgroundColor: "primary.main",
            display: "flex",
            alignItems: "end",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: "400",
              fontSize: "20px",
              textAlign: "center",
              color: "white",
            }}
          >
            People pay the doctor for his trouble, for his kindness they still
            remain in his debt
          </Typography>
        </Box>
      </Box>

      {/* RIGHT SIDE FORM */}
      <Box
        sx={{
          width: { xs: "100%", md: "60%" },
          height: password === "" ? "auto" : "100vh",
          overflow: "auto",
        }}
      >
        <Stack
          direction={"column"}
          sx={{
            width: { xs: "100%", md: "70%" },
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto",
          }}
        >
          <img
            src="/assets/auth/H-Logo 1.png"
            alt=""
            style={{ width: "98px", height: "86px" }}
          />

          <Typography
            sx={{
              fontWeight: "600",
              fontSize: { xs: "24px", md: "36px" },
              color: "primary.main",
              mb: 1,
            }}
          >
            Reset Password
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: { xs: "14px", md: "16px" },
              fontWeight: "400",
              marginBottom: { xs: "20px", md: "20px" },
              textAlign: "center",
            }}
          >
            Enter your new password below
          </Typography>

          {/* Error Alert */}
          {localError && (
            <Fade in={!!localError}>
              <Alert
                severity="error"
                sx={{
                  width: "90%",
                  mb: 2,
                  borderRadius: "10px",
                }}
                onClose={() => setLocalError("")}
              >
                {localError}
              </Alert>
            </Fade>
          )}

          {/* New Password */}
          <TextField
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            sx={{
              width: "90%",
              marginTop: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#F9FAFB",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#F3F4F6",
                },
                "&.Mui-focused": {
                  backgroundColor: "white",
                  boxShadow: "0 0 0 3px rgba(82, 172, 140, 0.1)",
                },
              },
              "& .MuiInputBase-input": {
                fontSize: "16px",
                fontWeight: 400,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "action.disabled" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePassword}
                    edge="end"
                    sx={{
                      color: "action.disabled",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Password Requirements */}
          <Box
            sx={{
              width: "90%",
              mt: 1,
              display: password === "" ? "none" : "block",
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                color: passwordValidation.length ? "green" : "red",
              }}
            >
              {passwordValidation.length ? "✅" : "❌"} At least 8 characters
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: passwordValidation.upperCase ? "green" : "red",
              }}
            >
              {passwordValidation.upperCase ? "✅" : "❌"} At least one
              uppercase letter
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: passwordValidation.lowerCase ? "green" : "red",
              }}
            >
              {passwordValidation.lowerCase ? "✅" : "❌"} At least one
              lowercase letter
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: passwordValidation.number ? "green" : "red",
              }}
            >
              {passwordValidation.number ? "✅" : "❌"} At least one number
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: passwordValidation.specialChar ? "green" : "red",
              }}
            >
              {passwordValidation.specialChar ? "✅" : "❌"} At least one
              special character
            </Typography>
          </Box>

          {/* Confirm Password */}
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            sx={{
              width: "90%",
              margin: "20px 0",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#F0F2F6",
              },
              "& .MuiInputBase-input": {
                fontSize: "19px",
                fontWeight: 300,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleToggleConfirmPassword} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Error Message */}
          {localError && (
            <Box
              sx={{
                width: "90%",
                mt: 1,
                mb: 2,
                p: 2,
                backgroundColor: "#ffe6e6",
                color: "#cc0000",
                borderRadius: "10px",
                fontSize: "15px",
                textAlign: "center",
              }}
            >
              {localError}
            </Box>
          )}
          {/* Reset Password Button */}
          <Button
            variant="contained"
            onClick={handleResetPassword}
            disabled={loading}
            sx={{
              backgroundColor: "primary.main",
              fontSize: "19px",
              fontWeight: "400",
              width: "90%",
              color: "white",
              textTransform: "none",
              margin: "20px 0",
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Reset Password"
            )}
          </Button>

          {/* Terms and Conditions */}
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "400",
              width: "90%",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    "& .MuiSvgIcon-root": {
                      color: "primary.main",
                      borderColor: "primary.main",
                      borderRadius: "20px",
                    },
                  }}
                />
              }
              sx={{
                color: "#555555",
                fontSize: "15px",
                fontWeight: "600",
                margin: "0",
              }}
            />
            By Creating an account , you agree to our{" "}
            <span style={{ color: "#52AC8C", cursor: "pointer" }}>
              Terms of Service
            </span>{" "}
            and{" "}
            <span style={{ color: "#52AC8C", cursor: "pointer" }}>
              Privacy Policy
            </span>
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}
