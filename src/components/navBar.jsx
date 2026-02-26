import {
  Box,
  Divider,
  Stack,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GroupIcon from "@mui/icons-material/Group";
import { useDispatch } from "react-redux";
import { logout } from "../redux/auth/authSlice";
import { useState } from "react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(true);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/logIn");
  };

  // Common styles for menu items
  const menuItemStyles = (isActive) => ({
    backgroundColor: isActive ? "white" : "transparent",
    padding: isOpen ? "10px 15px" : "10px",
    borderRadius: "20px",
    width: isOpen ? "183px" : "50px",
    alignItems: "center",
    justifyContent: isOpen ? "flex-start" : "center",
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: isActive ? "white" : "rgba(255, 255, 255, 0.1)",
      transform: isOpen ? "translateX(5px)" : "scale(1.1)",
    },
  });

  const activeIndicatorStyles = (isActive) => ({
    display: isActive ? "block" : "none",
    position: "absolute",
    left: "-57px",
    width: "50px",
    background: "white",
    borderRadius: "20px",
    height: "67px",
  });

  return (
    <Box
      sx={{
        width: isOpen ? "210px" : "70px",
        height: "100vh",
        backgroundColor: "primary.main",
        // position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        transition: "width 0.3s ease",
        overflow: "hidden",
      }}
    >
      <Stack
        direction={"row"}
        spacing={1}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "primary.main",
          height: "80px",
          position: "relative",
        }}
      >
        {isOpen && (
          <Box
            sx={{
              width: "80px",
              height: "70px",
              position: "absolute",
              left: "-10px",
              backgroundImage: "url(/assets/navBar/L-Logo.png)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></Box>
        )}
        {isOpen && (
          <Typography
            sx={{ color: "#FFFFFF", fontSize: "20px", fontWeight: "500" }}
          >
            Doctor Mate
          </Typography>
        )}
        <Tooltip title={isOpen ? "Collapse" : "Expand"} placement="right">
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            sx={{
              position: "absolute",
              right: isOpen ? "8px" : "13px",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            {isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Tooltip>
      </Stack>
      <Divider sx={{ backgroundColor: "white", height: "2px", opacity: 0.3 }} />
      <Stack
        direction={"column"}
        sx={{
          justifyContent: "flex-start",
          alignItems: "center",
          marginTop: "20px",
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          paddingBottom: "20px",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.3)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "rgba(255, 255, 255, 0.5)",
          },
        }}
      >
        <Tooltip title={!isOpen ? "Dashboard" : ""} placement="right">
          <Link to="/" style={{ textDecoration: "none", width: "100%" }}>
            <Stack
              direction={"row"}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                margin: "10px 0",
                position: "relative",
              }}
            >
              <Box sx={activeIndicatorStyles(pathname === "/")}></Box>
              <Stack
                direction={"row"}
                spacing={1}
                sx={menuItemStyles(pathname === "/")}
              >
                <img
                  src={
                    pathname === "/"
                      ? "/assets/navBar/Vector (14).png"
                      : "/assets/navBar/Vector (15).png"
                  }
                  alt=""
                  style={{ width: "24px", height: "24px" }}
                />

                {isOpen && (
                  <Typography
                    sx={{
                      color: pathname === "/" ? "primary.main" : "white",
                      fontSize: "22.27px",
                      fontWeight: "400",
                    }}
                  >
                    Dashboard
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Link>
        </Tooltip>
        <Tooltip title={!isOpen ? "Patients" : ""} placement="right">
          <Link
            to="/patients/patientlist"
            style={{ textDecoration: "none", width: "100%" }}
          >
            <Stack
              direction={"row"}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "5px",
                position: "relative",
              }}
            >
              <Box
                sx={activeIndicatorStyles(pathname === "/patients/patientlist")}
              />

              <Stack
                direction={"row"}
                spacing={1}
                sx={menuItemStyles(pathname === "/patients/patientlist")}
              >
                <img
                  src={
                    pathname === "/patients/patientlist"
                      ? "/assets/navBar/Group (4).png"
                      : "/assets/navBar/Group (3).png"
                  }
                  alt=""
                  style={{ width: "24px", height: "24px" }}
                />
                {isOpen && (
                  <Typography
                    sx={{
                      color:
                        pathname === "/patients/patientlist"
                          ? "primary.main"
                          : "white",
                      fontSize: "22.27px",
                      fontWeight: "400",
                    }}
                  >
                    Patients
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Link>
        </Tooltip>
        <Tooltip title={!isOpen ? "Appointments" : ""} placement="right">
          <Link
            to="/schedule"
            style={{ textDecoration: "none", width: "100%" }}
          >
            <Stack
              direction={"row"}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                margin: "10px 0",
                position: "relative",
              }}
            >
              <Box sx={activeIndicatorStyles(pathname.includes("/schedule"))} />

              <Stack
                direction={"row"}
                spacing={1}
                sx={menuItemStyles(pathname.includes("/schedule"))}
              >
                <img
                  src={
                    pathname.includes("/schedule")
                      ? "/assets/navBar/carbon_event-schedule (2).png"
                      : "/assets/navBar/carbon_event-schedule (1).png"
                  }
                  alt=""
                  style={{ width: "24px", height: "24px" }}
                />
                {isOpen && (
                  <Typography
                    sx={{
                      color: pathname.includes("/schedule")
                        ? "primary.main"
                        : "white",
                      fontSize: "19.27px",
                      fontWeight: "400",
                    }}
                  >
                    Appointments
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Link>
        </Tooltip>
        {/* <Link to="/dicom" style={{ textDecoration: "none" }}>
          <Stack
            direction={"row"}
            sx={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "5px",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: pathname === "/dicom" ? "block" : "none",
                position: "absolute",
                left: "-57px",
                width: "50px",
                background: "white",
                borderRadius: "20px",
                height: "67px",
              }}
            />

            <Stack
              direction={"row"}
              spacing={1}
              sx={{
                backgroundColor:
                  pathname === "/dicom" ? "white" : "transparent",
                padding: "10px 15px",
                borderRadius: "20px",
                width: "183px",
                alignItems: "center",
              }}
            >
              <img
                src={
                  pathname === "/dicom"
                    ? "/assets/navBar/Vector (17).png"
                    : "/assets/navBar/Vector (16).png"
                }
                alt=""
                style={{ width: "24px", height: "24px" }}
              />
              <Typography
                sx={{
                  color: pathname === "/dicom" ? "primary.main" : "white",
                  fontSize: "19.27px",
                  fontWeight: "400",
                }}
              >
                DICOM
              </Typography>
            </Stack>
          </Stack>
        </Link>
        <Link to="/message" style={{ textDecoration: "none" }}>
          <Stack
            direction={"row"}
            sx={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "5px",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: pathname === "/message" ? "block" : "none",
                position: "absolute",
                left: "-57px",
                width: "50px",
                background: "white",
                borderRadius: "20px",
                height: "67px",
              }}
            />

            <Stack
              direction={"row"}
              spacing={1}
              sx={{
                backgroundColor:
                  pathname === "/message" ? "white" : "transparent",
                padding: "10px 15px",
                borderRadius: "20px",
                width: "183px",
                alignItems: "center",
              }}
            >
              <img
                src={
                  pathname === "/message"
                    ? "/assets/navBar/Vector (19).png"
                    : "/assets/navBar/Vector (18).png"
                }
                alt=""
                style={{ width: "24px", height: "24px" }}
              />
              <Typography
                sx={{
                  color: pathname === "/message" ? "primary.main" : "white",
                  fontSize: "19.27px",
                  fontWeight: "400",
                }}
              >
                Messages
              </Typography>
            </Stack>
          </Stack>
        </Link> */}
        <Tooltip title={!isOpen ? "Reports" : ""} placement="right">
          <Link to="/reports" style={{ textDecoration: "none", width: "100%" }}>
            <Stack
              direction={"row"}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                margin: "10px 0",
                position: "relative",
              }}
            >
              <Box sx={activeIndicatorStyles(pathname === "/reports")} />

              <Stack
                direction={"row"}
                spacing={1}
                sx={menuItemStyles(pathname === "/reports")}
              >
                <img
                  src={
                    pathname === "/reports"
                      ? "/assets/navBar/Vector (21).png"
                      : "/assets/navBar/Vector (20).png"
                  }
                  alt=""
                  style={{ width: "32px", height: "32px" }}
                />
                {isOpen && (
                  <Typography
                    sx={{
                      color: pathname === "/reports" ? "primary.main" : "white",
                      fontSize: "22.27px",
                      fontWeight: "400",
                    }}
                  >
                    Reports
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Link>
        </Tooltip>
      </Stack>
      <Box
        sx={{
          width: "100%",
          paddingBottom: "10px",
        }}
      >
        <Divider
          sx={{ backgroundColor: "white", height: "2px", opacity: 0.3, mb: 1 }}
        />
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box>
            <Tooltip title={!isOpen ? "Profile" : ""} placement="right">
              <Link
                to="/doctorprofile"
                style={{ textDecoration: "none", width: "100%" }}
              >
                <Stack
                  direction={"row"}
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    mt: 1,
                  }}
                >
                  <Box
                    sx={activeIndicatorStyles(pathname === "/doctorprofile")}
                  />

                  <Stack
                    direction={"row"}
                    spacing={1}
                    sx={menuItemStyles(pathname === "/doctorprofile")}
                  >
                    <GroupIcon
                      sx={{
                        width: "24px",
                        height: "24px",
                        color:
                          pathname === "/doctorprofile"
                            ? "primary.main"
                            : "white",
                      }}
                    />
                    {isOpen && (
                      <Typography
                        sx={{
                          color:
                            pathname === "/doctorprofile"
                              ? "primary.main"
                              : "white",
                          fontSize: "19.27px",
                          fontWeight: "400",
                        }}
                      >
                        Profile
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Link>
            </Tooltip>
            <Tooltip title={!isOpen ? "Settings" : ""} placement="right">
              <Link
                to="/settings"
                style={{ textDecoration: "none", width: "100%" }}
              >
                <Stack
                  direction={"row"}
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <Box sx={activeIndicatorStyles(pathname === "/settings")} />

                  <Stack
                    direction={"row"}
                    spacing={1}
                    sx={menuItemStyles(pathname === "/settings")}
                  >
                    <SettingsIcon
                      sx={{
                        width: "23px",
                        height: "23px",
                        color:
                          pathname === "/settings" ? "primary.main" : "#FFFFFF",
                      }}
                    />
                    {isOpen && (
                      <Typography
                        sx={{
                          color:
                            pathname === "/settings"
                              ? "primary.main"
                              : "#FFFFFF",
                          fontSize: "16.87px",
                          fontWeight: "400",
                        }}
                      >
                        Settings
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Link>
            </Tooltip>
            <Tooltip title={!isOpen ? "Help & Support" : ""} placement="right">
              <Link
                to="/helpsupport"
                style={{ textDecoration: "none", width: "100%" }}
              >
                <Stack
                  direction={"row"}
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={activeIndicatorStyles(pathname === "/helpsupport")}
                  />

                  <Stack
                    direction={"row"}
                    spacing={1}
                    sx={menuItemStyles(pathname === "/helpsupport")}
                  >
                    <HelpOutlineIcon
                      sx={{
                        width: "23px",
                        height: "23px",
                        color:
                          pathname === "/helpsupport"
                            ? "primary.main"
                            : "#FFFFFF",
                      }}
                    />
                    {isOpen && (
                      <Typography
                        sx={{
                          color:
                            pathname === "/helpsupport"
                              ? "primary.main"
                              : "#FFFFFF",
                          fontSize: "16.87px",
                          fontWeight: "400",
                        }}
                      >
                        Help & Support
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Link>
            </Tooltip>

            {/* Logout Button */}
            <Stack
              direction={"row"}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                mt: 1,
              }}
            >
              <Tooltip title={!isOpen ? "Logout" : "Logout"} placement="right">
                <Stack
                  direction={"row"}
                  spacing={1}
                  onClick={handleLogout}
                  sx={{
                    backgroundColor: "transparent",
                    padding: isOpen ? "15px" : "10px",
                    borderRadius: "20px",
                    width: isOpen ? "183px" : "50px",
                    alignItems: "center",
                    justifyContent: isOpen ? "flex-start" : "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      transform: isOpen ? "translateX(5px)" : "scale(1.1)",
                      border: "1px solid rgba(255, 255, 255, 0.6)",
                    },
                  }}
                >
                  <LogoutIcon
                    sx={{
                      width: "23px",
                      height: "23px",
                      color: "#FFFFFF",
                    }}
                  />
                  {isOpen && (
                    <Typography
                      sx={{
                        color: "#FFFFFF",
                        fontSize: "16.87px",
                        fontWeight: "400",
                      }}
                    >
                      Logout
                    </Typography>
                  )}
                </Stack>
              </Tooltip>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
