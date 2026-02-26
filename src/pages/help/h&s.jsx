import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Stack,
} from "@mui/material";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import HelpIcon from "@mui/icons-material/Help";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//import ChatIcon from "@mui/icons-material/Chat";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import NavBar from "../../components/navBar";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
export default function HelpSupport() {
  return (
    <Stack direction="row">
      <NavBar />
      <Box
        sx={{
          backgroundColor: "#F5F7FA",
          padding: "20px",
          height: "100vh",
          overflowY: "auto",
          flex: 1,
        }}
      >
        <Paper sx={{ p: "13px", mb: 1, borderRadius: "10px" }}>
          <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
            Help & Support
          </Typography>
          <Typography sx={{ color: "#777" }}>
            Get help with using the DoctorMate system effectively
          </Typography>
        </Paper>
        <Box sx={{ backgroundColor: "white", p: "13px", borderRadius: "10px" }}>
          {/* Main Content */}
          <Grid container spacing={2}>
            {/* How to use */}
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                p: 3,

                borderRadius: "10px",
                border: "3px solid #D9D9D9",
              }}
            >
              <Stack
                direction={"row"}
                spacing={1}
                sx={{ alignItems: "center", marginBottom: "20px" }}
              >
                <img
                  src="/assets/H&S/Vector (22).png"
                  alt=""
                  style={{
                    width: "30px",
                    height: "25px",
                  }}
                />
                <Typography
                  sx={{ fontSize: "23.27px", fontWeight: 600, mb: 1 }}
                >
                  How to Use the System
                </Typography>
              </Stack>
              <Box
                sx={{ paddingLeft: 2, borderLeft: "3px solid #D9D9D9", mb: 5 }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "16px",
                    mb: 1,
                    color: "#616161",
                  }}
                >
                  Managing Appointments
                </Typography>
                <Stack
                  direction={"row"}
                  spacing={1}
                  sx={{ mb: 2, alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "23px",
                      height: "23px",
                      borderRadius: "50%",
                      backgroundColor: "#D9D9D9",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#8C8C8C",
                    }}
                  >
                    1
                  </div>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#616161",
                      fontWeight: 400,
                    }}
                  >
                    Navigate to the Appointments tab
                  </Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  spacing={1}
                  sx={{ mb: 2, alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "23px",
                      height: "23px",
                      borderRadius: "50%",
                      backgroundColor: "#D9D9D9",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#8C8C8C",
                    }}
                  >
                    2
                  </div>
                  <Typography
                    sx={{ fontSize: 11, color: "#616161", fontWeight: 400 }}
                  >
                    Click "New Appointment"
                  </Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  spacing={1}
                  sx={{ mb: 2, alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "23px",
                      height: "23px",
                      borderRadius: "50%",
                      backgroundColor: "#D9D9D9",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#8C8C8C",
                    }}
                  >
                    3
                  </div>
                  <Typography
                    sx={{ fontSize: 11, color: "#616161", fontWeight: 400 }}
                  >
                    Select patient, date, time
                  </Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  spacing={1}
                  sx={{ mb: 2, alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "23px",
                      height: "23px",
                      borderRadius: "50%",
                      backgroundColor: "#D9D9D9",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#8C8C8C",
                    }}
                  >
                    4
                  </div>
                  <Typography
                    sx={{ fontSize: 11, color: "#616161", fontWeight: 400 }}
                  >
                    Save and send confirmation
                  </Typography>
                </Stack>
              </Box>

              <Box
                sx={{ paddingLeft: 2, borderLeft: "3px solid #D9D9D9", mb: 5 }}
              >
                <Typography sx={{ fontWeight: 500, fontSize: "16px", mb: 1 }}>
                  Managing Clinics
                </Typography>
                <Stack
                  direction={"row"}
                  spacing={1}
                  sx={{ mb: 2, alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "23px",
                      height: "23px",
                      borderRadius: "50%",
                      backgroundColor: "#D9D9D9",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#8C8C8C",
                    }}
                  >
                    1
                  </div>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#616161",
                      fontWeight: 400,
                    }}
                  >
                    Go to Settings {">"} Clinic Management
                  </Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  spacing={1}
                  sx={{ mb: 2, alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "23px",
                      height: "23px",
                      borderRadius: "50%",
                      backgroundColor: "#D9D9D9",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#8C8C8C",
                    }}
                  >
                    2
                  </div>
                  <Typography
                    sx={{ fontSize: 11, color: "#616161", fontWeight: 400 }}
                  >
                    Add clinic locations, operating hours, and staff
                  </Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  spacing={1}
                  sx={{ mb: 2, alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "23px",
                      height: "23px",
                      borderRadius: "50%",
                      backgroundColor: "#D9D9D9",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#8C8C8C",
                    }}
                  >
                    3
                  </div>
                  <Typography
                    sx={{ fontSize: 11, color: "#616161", fontWeight: 400 }}
                  >
                    Configure appointment slots and availability
                  </Typography>
                </Stack>
              </Box>

              <Box
                sx={{ paddingLeft: 2, borderLeft: "3px solid #D9D9D9", mb: 5 }}
              >
                <Typography sx={{ fontWeight: 500, fontSize: "16px", mb: 1 }}>
                  Viewing Patient History
                </Typography>
                <Stack
                  direction={"row"}
                  spacing={1}
                  sx={{ mb: 2, alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "23px",
                      height: "23px",
                      borderRadius: "50%",
                      backgroundColor: "#D9D9D9",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#8C8C8C",
                    }}
                  >
                    1
                  </div>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#616161",
                      fontWeight: 400,
                    }}
                  >
                    Click on any patient name from the dashboard or patient list
                  </Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  spacing={1}
                  sx={{ mb: 2, alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "23px",
                      height: "23px",
                      borderRadius: "50%",
                      backgroundColor: "#D9D9D9",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#8C8C8C",
                    }}
                  >
                    2
                  </div>
                  <Typography
                    sx={{ fontSize: 11, color: "#616161", fontWeight: 400 }}
                  >
                    Review medical history, previous visits, and notes
                  </Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  spacing={1}
                  sx={{ mb: 2, alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "23px",
                      height: "23px",
                      borderRadius: "50%",
                      backgroundColor: "#D9D9D9",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#8C8C8C",
                    }}
                  >
                    3
                  </div>
                  <Typography
                    sx={{ fontSize: 11, color: "#616161", fontWeight: 400 }}
                  >
                    Add new notes or update patient information as needed
                  </Typography>
                </Stack>
              </Box>
            </Grid>
            {/* FAQ */}
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                p: 3,

                borderRadius: "10px",
                border: "3px solid #D9D9D9",
              }}
            >
              <Stack
                direction={"row"}
                spacing={1}
                sx={{ alignItems: "center", mb: 5 }}
              >
                <HelpIcon
                  sx={{
                    color: "primary.main",
                    width: "30.83333396911621",
                    height: "30.83333396911621",
                  }}
                />
                <Typography sx={{ fontSize: 18, fontWeight: 500 }}>
                  Frequently Asked Questions
                </Typography>
              </Stack>

              {[
                {
                  q: (
                    <>
                      <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                        How do I change my password?
                      </Typography>
                      <Typography
                        sx={{ fontSize: 10, color: "#616161", fontWeight: 400 }}
                      >
                        Click on your profile in the top right corner, select
                        "Account Settings", then "Change Password". Enter your
                        current password and new password to update.
                      </Typography>
                    </>
                  ),
                  a: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, quos.",
                },
                {
                  q: (
                    <>
                      <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                        Can I export patient data?
                      </Typography>
                      <Typography
                        sx={{ fontSize: 10, color: "#616161", fontWeight: 400 }}
                      >
                        Yes, go to Patients {">"} Export Data. Select the date
                        range and data types you need. The export will be sent
                        to your registered email address.
                      </Typography>
                    </>
                  ),
                  a: "Yes, from Patients → Export Data.",
                },
                {
                  q: (
                    <>
                      <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                        How do I add multiple clinic locations?
                      </Typography>
                      <Typography
                        sx={{ fontSize: 10, color: "#616161", fontWeight: 400 }}
                      >
                        Navigate to Settings {">"} Clinic Management and click
                        "Add New Location". Enter the clinic details, address,
                        and operating hours for each location.
                      </Typography>
                    </>
                  ),
                  a: "Navigate to Settings → Clinic Management.",
                },
                {
                  q: (
                    <>
                      <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                        What browsers are supported?
                      </Typography>
                      <Typography
                        sx={{ fontSize: 10, color: "#616161", fontWeight: 400 }}
                      >
                        MedDash works best on Chrome, Firefox, Safari, and Edge.
                        We recommend keeping your browser updated to the latest
                        version for optimal performance.
                      </Typography>
                    </>
                  ),
                  a: "Chrome, Firefox, Safari, Edge.",
                },
                {
                  q: (
                    <>
                      <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                        Is my patient data secure?
                      </Typography>
                      <Typography
                        sx={{ fontSize: 10, color: "#616161", fontWeight: 400 }}
                      >
                        Yes, all data is encrypted and stored securely. We
                        comply with HIPAA regulations and use industry-standard
                        security measures to protect patient information.
                      </Typography>
                    </>
                  ),
                  a: "Yes, all data is encrypted and secure.",
                },
              ].map((item, index) => (
                <Accordion
                  key={index}
                  sx={{
                    mb: 6,
                    borderRadius: "10px",
                    border: "1px solid #D9D9D9",
                    p: 0.5,
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box>{item.q}</Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ fontSize: 14, color: "#555" }}>
                      {item.a}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          </Grid>
          {/* Contact Support */}
          <Paper
            sx={{
              p: 4,
              mt: 2,
              borderRadius: "10px",
              border: "3px solid #D9D9D9",
            }}
          >
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: 23.27,
                fontWeight: 600,
                mb: 2,
              }}
            >
              <HeadsetMicOutlinedIcon sx={{ mr: 0.5, color: "primary.main" }} />{" "}
              Contact Support
            </Typography>
            <Stack
              direction={"row"}
              sx={{
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {[
                {
                  icon: (
                    <ForumOutlinedIcon
                      sx={{ color: "primary.main", fontSize: "40px" }}
                    />
                  ),
                  title: "Live Chat",
                  dec: "Get instant help from our support team",
                },
                {
                  icon: (
                    <EmailIcon
                      sx={{ color: "primary.main", fontSize: "40px" }}
                    />
                  ),
                  title: "Email Support",
                  dec: "Send us a detailed message",
                },
                {
                  icon: (
                    <PhoneIcon
                      sx={{ color: "primary.main", fontSize: "40px" }}
                    />
                  ),
                  title: "Phone Support",
                  dec: "Call us during business hours",
                },
              ].map((item, index) => (
                <Stack
                  sx={{
                    p: 3,
                    mt: 2,
                    textAlign: "center",
                    border: "1.38px solid #D9D9D9",
                    borderRadius: "5px",
                    width: "286px",
                    height: "326px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  key={index}
                >
                  <Stack spacing={2} alignItems="center">
                    <Stack
                      sx={{
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "13.77px",
                        width: "63.32503128051758px",
                        height: "63.32503128051758px",
                        backgroundColor: "#E8E8E8",
                      }}
                    >
                      {item.icon}
                    </Stack>
                    <Typography
                      sx={{
                        fontWeight: 400,
                        fontSize: 20,
                        color: "primary.main",
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontSize: 13.77, fontWeight: 400 }}>
                      {item.dec}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "primary.main",
                        textTransform: "none",
                        color: "white",
                        fontSize: "22.03px",
                        fontWeight: "400",
                      }}
                    >
                      Start Chat
                    </Button>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Paper>
          <Typography sx={{ mt: 2, fontSize: 20 }}>
            <p>
              <strong style={{ fontWeight: "600", marginRight: "10px" }}>
                Support Hours:
              </strong>
              <span style={{ fontWeight: "400" }}>
                Monday - Friday, 8:00 AM - 6:00 PM
              </span>
            </p>
            <p>
              <strong style={{ fontWeight: "600", marginRight: "10px" }}>
                Emergency Support:
              </strong>
              <span style={{ fontWeight: "400" }}>
                Available 24/7 for critical system issues
              </span>
            </p>
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
}
