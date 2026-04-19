import {
  Stack,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { signIn } from "../redux/auth/authSlice";
import { Link } from "react-router";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router";
import { useSnackbar } from "../hooks/useSnackbar";
import GlobalSnackbar from "../components/GlobalSnackbar";
export default function LogIn() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const handleTogglePassword = () => setShowPassword(!showPassword);

  // → Handle login click
  const handleLogin = () => {
    if (!email && !password) {
      showSnackbar("Please enter email and password", "error");
      return;
    }
    if (!password) {
      showSnackbar("Please enter password", "error");
      return;
    }
    if (!email) {
      showSnackbar("Please enter email", "error");
      return;
    }
    if (!isValidEmail(email)) {
      showSnackbar("Please enter a valid email", "error");
      return;
    }

    dispatch(signIn({ emailOrPhone: email, password }))
      .unwrap()
      .then((response) => {
        if (response.data.user.isVerified == false) {
          dispatch(forgotPass({ email, isForgetPass: false }));
          navigate("/logIn/forgetpass/otp");
        } else if (response.data.user.isCompletedProfile == false) {
          navigate("/compeleteprofile");
        } else {
          // ✅ لو نجح اللوجين، اعرض رسالة نجاح
          showSnackbar("Welcome back!", "success");
          navigate("/");
        }
      })
      .catch((error) => {
        showSnackbar(error || "Login failed. Please try again.", "error");
      });
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
            height: "100vh",
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
              color: "#FFFFFF",
            }}
          >
            People pay the doctor for his trouble, for his kindness they still
            remain in his debt
          </Typography>
        </Box>
      </Box>

      {/* RIGHT SIDE FORM */}
      <Box sx={{ width: { xs: "100%", md: "60%" } }}>
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
              fontSize: { xs: "28px", md: "36px" },
              color: "primary.main",
              mb: 1,
            }}
          >
            Welcome Back!
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "14px", md: "16px" },
              color: "text.secondary",
              mb: 3,
            }}
          >
            Please login to continue
          </Typography>

          {/* Email */}
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon
                    sx={{
                      color: emailFocused ? "primary.main" : "action.disabled",
                      transition: "color 0.3s",
                    }}
                  />
                </InputAdornment>
              ),
            }}
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
                padding: "14px 14px 14px 0",
              },
            }}
          />

          {/* Password */}
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon
                    sx={{
                      color: passwordFocused
                        ? "primary.main"
                        : "action.disabled",
                      transition: "color 0.3s",
                    }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePassword}
                    edge="end"
                    sx={{
                      color: "action.disabled",
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              width: "90%",
              marginTop: "20px",
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
                padding: "14px 14px 14px 0",
              },
            }}
          />
          <Stack
            direction={"row"}
            sx={{
              width: "90%",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "20px 0",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  sx={{ "& .MuiSvgIcon-root": { color: "primary.main" } }}
                />
              }
              sx={{ color: "#555555" }}
              label="Remember me"
            />
            <Link to="/logIn/forgetpass" style={{ textDecoration: "none" }}>
              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: { xs: "12px", md: "15px" },
                  color: "primary.main",
                  cursor: "pointer",
                }}
              >
                Forget password?
              </Typography>
            </Link>
          </Stack>

          {/* LOGIN BUTTON */}
          <Button
            variant="contained"
            onClick={handleLogin}
            disabled={loading}
            sx={{
              backgroundColor: "primary.main",
              fontSize: "18px",
              fontWeight: "500",
              width: "90%",
              height: "52px",
              color: "white",
              textTransform: "none",
              borderRadius: "12px",
              mt: 1,
              boxShadow: "0 4px 12px rgba(82, 172, 140, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "primary.dark",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(82, 172, 140, 0.4)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
              "&:disabled": {
                backgroundColor: "action.disabledBackground",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Login"
            )}
          </Button>

          {/* Divider */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ width: "90%", marginY: 3 }}
          >
            <Divider sx={{ flexGrow: 1 }} />
            <Typography
              sx={{
                fontSize: { xs: "12px", md: "22px" },
                fontWeight: 400,
                color: "primary.main",
              }}
            >
              Or
            </Typography>
            <Divider sx={{ flexGrow: 1 }} />
          </Stack>

          {/* Social Login */}
          <Stack direction={"row"} spacing={2} sx={{ width: "90%" }}>
            <Button
              variant="outlined"
              sx={{
                width: "49%",
                borderRadius: "12px",
                textTransform: "none",
                borderColor: "#E5E7EB",
                color: "text.primary",
                py: 1.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#3b5998",
                  backgroundColor: "rgba(59, 89, 152, 0.04)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
              }}
            >
              Facebook
            </Button>
            <Button
              variant="outlined"
              sx={{
                width: "49%",
                borderRadius: "12px",
                textTransform: "none",
                borderColor: "#E5E7EB",
                color: "text.primary",
                py: 1.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#DB4437",
                  backgroundColor: "rgba(219, 68, 55, 0.04)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
              }}
            >
              Google
            </Button>
          </Stack>

          <Typography
            sx={{
              fontSize: { xs: "14px", md: "16px" },
              fontWeight: "400",
              marginTop: "20px",
              color: "text.secondary",
            }}
          >
            Don't have an account?{" "}
            <Link to="/signUp" style={{ textDecoration: "none" }}>
              <span
                style={{
                  color: "#52AC8C",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                Sign Up
              </span>
            </Link>
          </Typography>
        </Stack>
      </Box>
      <GlobalSnackbar snackbar={snackbar} onClose={hideSnackbar} />
    </Stack>
  );
}
