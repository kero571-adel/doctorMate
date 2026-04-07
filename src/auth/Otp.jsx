import {
  Stack,
  Box,
  Typography,
  Button,
  Alert,
  Fade,
  Chip,
} from "@mui/material";
import { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Alarm } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { verfyOtp } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
export default function Otp() {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(true);
  const dispatch = useDispatch();
  const email = useSelector((state) => state.auth.forgotPasswordEmail.email);
  const forgotPass = useSelector(
    (state) => state.auth.forgotPasswordEmail.forgotPass
  );
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);
  const resetTimer = () => {
    setTimeLeft(60);
    setIsActive(true);
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };
  const handelVerfyOtp = () => {
    if (otp.length !== 6) {
      return;
    }
    dispatch(verfyOtp({ email, otp, isForgetPass: forgotPass }))
      .unwrap()
      .then(() => {
        let user = JSON.parse(localStorage.getItem("user"));
        user = {
          ...user,
          isVerified: true,
        };
        localStorage.setItem("user", JSON.stringify(user));
        if (forgotPass) {
          navigate("/logIn/forgetpass/otp/resetpass");
          return;
        }
        if (!user.isCompletedProfile) {
          navigate("/compeleteprofile");
          return;
        }
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
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
              fontSize: { xs: "24px", md: "36px" },
              color: "primary.main",
              mb: 1,
            }}
          >
            Verify OTP
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: { xs: "14px", md: "16px" },
              fontWeight: "400",
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            Enter the 6-digit code sent to your email
          </Typography>

          {/* Error Alert */}
          {error && (
            <Fade in={!!error}>
              <Alert
                severity="error"
                sx={{
                  width: "90%",
                  mb: 2,
                  borderRadius: "10px",
                }}
              >
                {error}
              </Alert>
            </Fade>
          )}

          {otp.length > 0 && otp.length < 6 && (
            <Chip
              label={`${otp.length}/6 digits entered`}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            />
          )}
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span style={{ width: "min(2vw, 10px)" }}></span>}
            renderInput={(props) => (
              <input
                {...props}
                style={{
                  width: "clamp(40px, 8vw, 62px)",
                  height: "clamp(50px, 9vw, 68px)",
                  fontSize: "clamp(18px, 3vw, 24px)",
                  textAlign: "center",
                  border: "2px solid #E5E7EB",
                  borderRadius: "clamp(12px, 2vw, 16px)",
                  outline: "none",
                  transition: "all 0.3s ease",
                  backgroundColor: "#F9FAFB",
                  margin: "0 clamp(4px, 1.5vw, 10px)",
                  fontWeight: "600",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#52AC8C";
                  e.target.style.backgroundColor = "white";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(82, 172, 140, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E5E7EB";
                  e.target.style.backgroundColor = "#F9FAFB";
                  e.target.style.boxShadow = "none";
                }}
              />
            )}
          />
          <Stack
            direction={"row"}
            sx={{
              marginTop: "20px",
              alignItems: "center",
              justifyContent: "start",
              textAlign: "start",
              width: "90%",
            }}
          >
            <Alarm
              sx={{
                color: timeLeft < 10 ? "red" : "primary.main",
                fill: timeLeft < 10 ? "red" : "primary.main",
                fontSize: "24px",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: timeLeft < 10 ? "red" : "primary.main",
                minWidth: "70px",
                marginLeft: "7px",
              }}
            >
              {formatTime(timeLeft)}
            </Typography>
          </Stack>

          <Button
            variant="contained"
            onClick={handelVerfyOtp}
            disabled={loading || otp.length !== 6}
            sx={{
              backgroundColor: "primary.main",
              fontSize: "19px",
              fontWeight: "400",
              width: "90%",
              height: "52px",
              color: "white",
              textTransform: "none",
              borderRadius: "12px",
              margin: "20px 0",
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
              "Verify Code"
            )}
          </Button>

          {error && (
            <Typography
              sx={{
                color: "error.main",
                fontSize: "14px",
                textAlign: "center",
                width: "90%",
                marginBottom: "10px",
              }}
            >
              {error}
            </Typography>
          )}

          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "400",
              marginTop: "20px",
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
