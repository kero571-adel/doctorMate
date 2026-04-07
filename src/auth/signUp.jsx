import { useState } from "react";
import {
  Stack,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Fade,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useSelector, useDispatch } from "react-redux";
import { signUp, clearAuthError } from "../redux/auth/authSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { forgotPass } from "../redux/auth/authSlice";
export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  // Dropdown State
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "Egypt",
    code: "+20",
    flag: "/assets/auth/Flag_of_Egypt.svg.webp",
    placeholder: "+20 100 000 0000",
  });

  const countries = [
    {
      name: "Egypt",
      code: "+20",
      flag: "/assets/auth/Flag_of_Egypt.svg.webp",
      placeholder: "+20 100 000 0000",
    },
    {
      name: "Italy",
      code: "+39",
      flag: "/assets/italiaFlag.png",
      placeholder: "+39 333 123 4567",
    },
    {
      name: "Spain",
      code: "+34",
      flag: "/assets/spanishFlag.png",
      placeholder: "+34 612 345 678",
    },
  ];
  // Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [role, setRole] = useState("Doctor");

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleToggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    handleCloseMenu();
  };
  const handleSignUp = () => {
    setLocalError("");
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      setLocalError("⚠️ Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("⚠️ Passwords do not match");
      return;
    }
    const allValid = Object.values(passwordValidation).every(Boolean);
    if (!allValid) {
      setLocalError("⚠️ Password does not meet all requirements");
      return;
    }
    if (!isValidEmail(email)) {
      setLocalError("Please enter a valid email");
      return;
    }

    const fullName = `${firstName} ${lastName}`;
    const phoneNumber = `${phone}`;
    dispatch(signUp({ fullName, email, phoneNumber, password, role }))
      .unwrap()
      .then((data) => {
        // data هو اللي بيرجع من الـ thunk بعد unwrap
        const user = data.data.user; // حسب هيكل الرد اللي بيرجع من السيرفر
        if (user?.isVerified === false) {
          dispatch(forgotPass({ email, isForgetPass: false }));
          navigate("/logIn/forgetpass/otp");
        } else {
          navigate("/completeProfile");
        }
      })
      .catch((err) => {
        console.error("SignUp failed:", err);
        // هنا ممكن تعرض رسالة للمستخدم أو تحفظها في state
      });
  };
  const getPasswordValidation = (password) => ({
    length: password.length >= 8,
    upperCase: /[A-Z]/.test(password),
    lowerCase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  });
  return (
    <Stack
      spacing={4}
      sx={{
        height: { xs: "auto", md: "100vh" },
        overflow: "hidden",
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
          overflowY: "auto",
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
            style={{ width: "98px", height: "80px" }}
          />
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: { xs: "28px", md: "36px" },
              color: "primary.main",
              mb: 1,
            }}
          >
            Create an account
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "14px", md: "16px" },
              color: "text.secondary",
              mb: 2,
            }}
          >
            Join DoctorMate today
          </Typography>

          {/* Error Alert */}
          {(localError || error) && (
            <Fade in={!!(localError || error)}>
              <Alert
                severity="error"
                sx={{
                  width: "90%",
                  mb: 2,
                  borderRadius: "10px",
                }}
                onClose={() => {
                  setLocalError("");
                  dispatch(clearAuthError());
                }}
              >
                {localError || error}
              </Alert>
            </Fade>
          )}

          {/* FIRST + LAST NAME */}
          <Stack
            direction={"row"}
            sx={{ width: "90%", marginTop: "10px" }}
            spacing={2}
          >
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setLocalError("");
                dispatch(clearAuthError());
              }}
              fullWidth
              sx={{
                marginTop: "10px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "#F0F2F6",
                },
                "& .MuiInputBase-input": { fontSize: "19px", fontWeight: 300 },
              }}
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setLocalError("");
                dispatch(clearAuthError());
              }}
              fullWidth
              sx={{
                marginTop: "10px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "#F0F2F6",
                },
                "& .MuiInputBase-input": { fontSize: "19px", fontWeight: 300 },
              }}
            />
          </Stack>

          {/* EMAIL */}
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setLocalError("");
              dispatch(clearAuthError());
            }}
            sx={{
              width: "90%",
              marginTop: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#F0F2F6",
              },
              "& .MuiInputBase-input": { fontSize: "19px", fontWeight: 300 },
            }}
          />

          {/* PHONE NUMBER + COUNTRY DROPDOWN */}
          <Box
            sx={{
              width: "90%",
              display: "flex",
              alignItems: "center",
              borderRadius: "10px",
              overflow: "hidden",
              mt: 2,
            }}
          >
            <Button
              onClick={handleOpenMenu}
              sx={{
                height: "56px",
                borderRight: "1px solid #D8DEE5",
                borderRadius: 0,
                px: 2,
                backgroundColor: "primary.main",
              }}
            >
              <img
                src={selectedCountry.flag}
                alt={selectedCountry.name}
                style={{ width: "26px", height: "26px", borderRadius: "50%" }}
              />
              <ArrowDropDownIcon sx={{ color: "white" }} />
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
              {countries.map((country) => (
                <MenuItem
                  key={country.name}
                  onClick={() => handleSelectCountry(country)}
                >
                  <img
                    src={country.flag}
                    alt={country.name}
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                  {country.name}
                </MenuItem>
              ))}
            </Menu>
            <TextField
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setLocalError("");
                dispatch(clearAuthError());
              }}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0px 10px 10px 0px",
                  backgroundColor: "#F0F2F6",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #D8DEE5",
                  borderLeft: "none",
                },
              }}
            />
          </Box>
          {/* PASSWORD */}
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordValidation(getPasswordValidation(e.target.value));
              setLocalError(""); // مسح أي خطأ موجود
              dispatch(clearAuthError());
            }}
            sx={{
              width: "90%",
              marginTop: "14px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#F0F2F6",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
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
          {/* CONFIRM PASSWORD */}
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setLocalError("");
              dispatch(clearAuthError());
            }}
            sx={{
              width: "90%",
              margin: "10px 0",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#F0F2F6",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleToggleConfirmPassword}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* CREATE BTN */}
          <Button
            variant="contained"
            disabled={loading}
            onClick={handleSignUp}
            sx={{
              backgroundColor: "primary.main",
              fontSize: "19px",
              width: "90%",
              color: "white",
              textTransform: "none",
              height: "48px",
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Create Account"
            )}
          </Button>

          {/* SHOW LOCAL ERROR */}
          {/* SHOW ERROR */}
          {(localError || error) && (
            <Box
              sx={{
                width: "90%",
                mt: 2,
                p: 2,
                backgroundColor: "#ffe6e6",
                color: "#cc0000",
                borderRadius: "10px",
                fontSize: "15px",
                textAlign: "center",
              }}
            >
              {localError || error}
            </Box>
          )}

          {/* TERMS */}
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"start"}
            sx={{ width: "90%" }}
            marginTop={"10px"}
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
            <Typography
              sx={{ fontSize: "12px", fontWeight: "400", width: "90%" }}
            >
              By Creating an account, you agree to our{" "}
              <span style={{ color: "#52AC8C", cursor: "pointer" }}>
                Terms of Service
              </span>{" "}
              and{" "}
              <span style={{ color: "#52AC8C", cursor: "pointer" }}>
                Privacy Policy
              </span>
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: "12px" }}>
            Already have an account?{" "}
            <Link to="/login">
              <span style={{ color: "#52AC8C", cursor: "pointer" }}>
                Log in
              </span>
            </Link>
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}
