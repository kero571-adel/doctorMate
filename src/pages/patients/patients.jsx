import { Box, Stack, Typography, Grid, Card, Button, Tab } from "@mui/material";
import NavBar from "../../components/navBar";
import WestIcon from "@mui/icons-material/West";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData(
    "Vitamin D Deficiency",
    "Aug 20, 2025",
    "Dr. Ahmed Nour",
    "Active"
  ),
  createData(" Hypertension", "Aug 25, 2025", "Dr. Sara Nour", "Offline"),
  createData("Food Allergy", "Aug 15, 2025", "Dr. Aser Hazem", "Active"),
];

export default function Patients() {
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
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "30px",
            marginBottom: "20px",
          }}
        >
          <Stack
            direction={"row"}
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Stack direction={"row"} spacing={2}>
              <Box
                sx={{
                  cursor: "pointer",
                  width: "fit-content",
                  height: "fit-content",
                  padding: "5px 5px 0",
                  color: "white",
                  backgroundColor: "primary.main",
                  borderRadius: "10px",
                }}
              >
                <WestIcon sx={{ margin: "0" }} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: "16px", md: "24px" },
                    fontWeight: "400",
                  }}
                >
                  Patient record
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "12px", md: "16px" },
                    fontWeight: "400",
                  }}
                >
                  Manage and view patient records
                </Typography>
              </Box>
            </Stack>

            <img src="/assets/patitient/Ellipse 146 (1).png" alt="" />
          </Stack>
        </Box>
        <Grid container spacing={3}>
          <Grid
            size={{ xs: 12, lg: 2 }}
            sx={{
              borderRadius: "20px",
              padding: "30px",
              backgroundColor: "white",
            }}
          >
            <Stack
              sx={{
                flexDirection: { xs: "column", md: "row", lg: "column" },
                justifyContent: {
                  xs: "center",
                  md: "space-between",
                  lg: "center",
                },
                alignItems: "center",
              }}
            >
              <Stack
                direction={"column"}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                <img
                  src="/assets/patitient/Ellipse 168.png"
                  alt=""
                  style={{ width: "120px", height: "120px" }}
                />
                <Typography sx={{ fontSize: "20px", fontWeight: "400" }}>
                  {" "}
                  Sara Ahmed
                </Typography>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: "400",
                    color: "#00000099",
                  }}
                >
                  35 Male
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "12px", md: "16px", lg: "12px" },
                    fontWeight: "400",
                    color: "#00000099",
                  }}
                >
                  Patient ID: 12345
                </Typography>
              </Stack>
              <Box>
                <Stack
                  direction={"row"}
                  sx={{
                    alignItems: "center",
                    marginBottom: "30px",
                    justifyContent: {
                      xs: "center",
                      md: "flex-start",
                    },
                  }}
                  spacing={1}
                >
                  <MarkunreadIcon
                    sx={{
                      color: "primary.main",
                      width: { xs: "15px", md: "20px", lg: "15px" },
                      height: { xs: "12px", md: "20px", lg: "12px" },
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: { xs: "12px", md: "16px", lg: "12px" },
                      fontWeight: "400",
                      color: "#000000",
                    }}
                  >
                    sara.ahmed@email.com
                  </Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  sx={{
                    alignItems: "center",
                    marginBottom: "30px",
                    justifyContent: {
                      xs: "center",
                      md: "flex-start",
                    },
                  }}
                  spacing={1}
                >
                  <PhoneIcon
                    sx={{
                      color: "primary.main",
                      width: { xs: "15px", md: "20px", lg: "15px" },
                      height: { xs: "12px", md: "20px", lg: "12px" },
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: { xs: "12px", md: "16px", lg: "12px" },
                      fontWeight: "400",
                      color: "#000000",
                    }}
                  >
                    +966 50 123 4567
                  </Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  sx={{
                    alignItems: "center",
                    marginBottom: "30px",
                    justifyContent: {
                      xs: "center",
                      md: "flex-start",
                    },
                  }}
                  spacing={1}
                >
                  <LocationOnIcon
                    sx={{
                      color: "primary.main",
                      width: { xs: "15px", md: "20px", lg: "15px" },
                      height: { xs: "12px", md: "20px", lg: "12px" },
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: { xs: "12px", md: "16px", lg: "12px" },
                      fontWeight: "400",
                      color: "#000000",
                    }}
                  >
                    King Fahd Road, Al Narjis District, Riyadh
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Grid>
          <Grid
            size={{ xs: 12, lg: 7.5 }}
            sx={{
              borderRadius: "20px",
              backgroundColor: "white",
              padding: "30px",
            }}
          >
            <Typography
              sx={{ fontSize: "20px", fontWeight: "400", margin: "20px 0" }}
            >
              Vital signs
            </Typography>
            <Grid container spacing={3}>
              <Grid
                size={{ xs: 12, md: 4 }}
                sx={{
                  borderRadius: "20px",
                  padding: "30px 10px",
                  boxShadow: "0px 4px 4px #00000040",
                }}
              >
                <Stack
                  direction={"column"}
                  spacing={1}
                  sx={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Typography sx={{ fontSize: "16px", fontWeight: "400" }}>
                    Blood pressure ❤
                  </Typography>
                  <Typography
                    sx={{ fontSize: "18px", fontWeight: "400", color: "red" }}
                  >
                    120/80
                  </Typography>
                  <Typography sx={{ fontSize: "10px", fontWeight: "400" }}>
                    Last measurement: Today
                  </Typography>
                </Stack>
              </Grid>
              <Grid
                size={{ xs: 12, md: 4 }}
                sx={{
                  borderRadius: "20px",
                  padding: "30px 10px",
                  boxShadow: "0px 4px 4px #00000040",
                }}
              >
                <Stack
                  direction={"column"}
                  spacing={1}
                  sx={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Typography sx={{ fontSize: "16px", fontWeight: "400" }}>
                    Pulse Rate
                    <img
                      src="/assets/patitient/Group (1).png"
                      alt=""
                      style={{ marginLeft: "10px" }}
                    />
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: "400",
                      color: "#4DC6FD",
                    }}
                  >
                    72 beats/min
                  </Typography>
                  <Typography sx={{ fontSize: "10px", fontWeight: "400" }}>
                    Last measurement: Yesterday
                  </Typography>
                </Stack>
              </Grid>
              <Grid
                size={{ xs: 12, md: 4 }}
                sx={{
                  borderRadius: "20px",
                  padding: "30px 10px",
                  boxShadow: "0px 4px 4px #00000040",
                }}
              >
                <Stack
                  direction={"column"}
                  spacing={1}
                  sx={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Typography sx={{ fontSize: "16px", fontWeight: "400" }}>
                    Temperature{" "}
                    <img
                      src="/assets/patitient/Vector (10).png"
                      alt=""
                      style={{ marginLeft: "10px" }}
                    />
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: "400",
                      color: "#D7BD2E",
                    }}
                  >
                    36.5
                  </Typography>
                  <Typography sx={{ fontSize: "10px", fontWeight: "400" }}>
                    Last measurement: Yesterday
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            <Typography
              sx={{ fontSize: "20px", fontWeight: "400", margin: "20px 0" }}
            >
              Diagnoses
            </Typography>
            <TableContainer
              component={Paper}
              sx={{ minWidth: "100%", borderRadius: "20px" }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ backgroundColor: "primary.main" }}>
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{
                        color: "white",
                        padding: "4px",
                        fontWeight: "400",
                        fontSize: "21px",
                      }}
                    >
                      Diagnoses
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "white",
                        padding: "4px",
                        fontWeight: "400",
                        fontSize: "21px",
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "white",
                        padding: "4px",
                        fontWeight: "400",
                        fontSize: "21px",
                      }}
                    >
                      Doctor
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "white",
                        padding: "4px",
                        fontWeight: "400",
                        fontSize: "21px",
                      }}
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        align="center"
                        sx={{
                          padding: "20px 4px",
                          fontWeight: "400",
                          fontSize: "14px",
                        }}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: "20px 4px",
                          fontWeight: "400",
                          fontSize: "14px",
                        }}
                      >
                        {row.calories}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: "20px 4px",
                          fontWeight: "400",
                          fontSize: "14px",
                        }}
                      >
                        {row.fat}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: "20px 4px",
                          fontWeight: "400",
                          fontSize: "14px",
                          color: "white",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "white",
                            backgroundColor:
                              row.protein === "Active" ? "primary.main" : "red",
                            width: "fit-content",
                            borderRadius: "20px",
                            padding: "2px",
                          }}
                        >
                          {row.carbs}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid
            size={{ xs: 12, lg: 2.5 }}
            sx={{
              borderRadius: "20px",
              padding: "30px 10px",
              backgroundColor: "white",
            }}
          >
            <Stack
              sx={{
                flexDirection: { xs: "column", md: "row", lg: "column" },
                justifyContent: {
                  xs: "center",
                  md: "space-between",
                  lg: "center",
                },
                alignItems: "center",
              }}
            >
              <Stack
                direction={"column"}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                <Typography
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "start",
                    margin: "20px 0",
                    fontSize: "20px",
                    fontWeight: "400",
                  }}
                >
                  Actions
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    fontSize: { xs: "12px", md: "16px", lg: "12px" },
                    fontWeight: "400",
                    padding: "10px 5px",
                    borderRadius: "15px",
                    boxShadow: "0px 4px 4px #00000040",
                    marginBottom: "20px",
                    width: { xs: "205px", md: "199px" },
                    textTransform: "none",
                  }}
                >
                  <img
                    src="/assets/patitient/Vector (11).png"
                    alt=""
                    style={{
                      width: "20px",
                      height: "17px",
                      marginRight: "5px",
                    }}
                  />
                  Chat with patient
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    fontSize: { xs: "12px", md: "16px", lg: "12px" },
                    fontWeight: "400",
                    padding: "10px 5px",
                    borderRadius: "15px",
                    boxShadow: "0px 4px 4px #00000040",
                    marginBottom: "20px",
                    width: { xs: "205px", md: "199px" },
                    textTransform: "none",
                  }}
                >
                  <img
                    src="/assets/patitient/Vector (12).png"
                    alt=""
                    style={{
                      width: "20px",
                      height: "17px",
                      marginRight: "5px",
                    }}
                  />
                  Add Medical Report
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    fontSize: { xs: "12px", md: "16px", lg: "12px" },
                    fontWeight: "400",
                    padding: "10px 5px",
                    borderRadius: "15px",
                    boxShadow: "0px 4px 4px #00000040",
                    marginBottom: "20px",
                    width: { xs: "205px", md: "199px" },
                    textTransform: "none",
                  }}
                >
                  <img
                    src="/assets/patitient/Vector (13).png"
                    alt=""
                    style={{
                      width: "20px",
                      height: "17px",
                      marginRight: "5px",
                    }}
                  />
                  DISCOM Scans List
                </Button>
              </Stack>
              <Box>
                <Typography
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "start",
                    margin: "20px 0",
                    fontSize: "20px",
                    fontWeight: "400",
                  }}
                >
                  Timeline
                </Typography>
                <Timeline
                  sx={{
                    padding: 0,
                    "& .MuiTimelineItem-root:before": {
                      flex: 0,
                      padding: 0,
                    },
                  }}
                >
                  {/* Item 1 */}
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot sx={{ bgcolor: "primary.main" }} />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                        Aug 20, 2025
                      </Typography>
                      <Typography sx={{ fontSize: "14px", color: "#555" }}>
                        Surgery
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>

                  {/* Item 2 */}
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot sx={{ bgcolor: "primary.main" }} />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                        Aug 25, 2025
                      </Typography>
                      <Typography sx={{ fontSize: "14px", color: "#555" }}>
                        Blood test
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>

                  {/* Item 3 */}
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot sx={{ bgcolor: "primary.main" }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                        Aug 15, 2025
                      </Typography>
                      <Typography sx={{ fontSize: "14px", color: "#555" }}>
                        Treatment change
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
}
