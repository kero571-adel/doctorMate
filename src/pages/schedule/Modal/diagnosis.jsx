import { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import {
  Stack,
  Divider,
  Box,
  Button,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  Grid,
} from "@mui/material";
import { Alert } from "@mui/material";
import { Snackbar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { addDiagnoses } from "../../../redux/schedule/addDiagnoses";
import { getAppDetById } from "../../../redux/schedule/appoinmantDetals";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: { xs: "90%", md: "600px" },
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  height: "90vh",
  overflowY: "auto",
  borderRadius: "10px",
  border: "none",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
};
export default function AddDiagnosis({ openDiagnosis, setopenDiagnosis }) {
  const [showAlert, setShowAlert] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const selectedPatient = useSelector(
    (state) => state.schedule.selectedPatient
  );
  const medicalRecordId = useSelector((state) => state.medical.data);
  const dispatch = useDispatch();
  const [description, setDescription] = useState("");
  const [icdCode, setIcdCode] = useState("");
  const [severity, setSeverity] = useState("moderate");
  //const handleOpen = () => setOpen(true);
  const handleClose = () => setopenDiagnosis(false);
  const handleSave = async () => {
    if (!medicalRecordId?.data?.id) {
      alert("You must add a medical record first.");
      return;
    }
    try {
      await dispatch(
        addDiagnoses({
          medicalRecordId: medicalRecordId.data.id,
          appointmentId: selectedPatient.id,
          description,
          icdCode,
          severity,
        })
      ).unwrap();
      // Refresh appointment details
      await dispatch(getAppDetById({ id: selectedPatient?.id }));
      setOpenSnack(true);
      setopenDiagnosis(false);
      // Reset form
      setDescription("");
      setIcdCode("");
      setSeverity("moderate");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (openDiagnosis && !medicalRecordId?.data?.id) {
      setShowAlert(true);
      setopenDiagnosis(false);
    }
  }, [openDiagnosis, medicalRecordId]);
  return (
    <div>
      {showAlert && (
        <Alert
          severity="warning"
          onClose={() => setShowAlert(false)}
          sx={{ mb: 2 }}
        >
          You must add a medical record before adding a diagnosis.
        </Alert>
      )}
      <Modal
        open={openDiagnosis}
        onClose={handleClose}
        sx={{
          borderRadius: "10px",
          boxShadow: "2px 1px 2px 1 px #00000040",
          border: "none",
        }}
      >
        <Box sx={style}>
          <Stack
            direction={"row"}
            sx={{ alignItems: "center", justifyContent: "space-between", p: 3 }}
          >
            <Stack direction={"row"} spacing={2}>
              <Stack
                sx={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "10px",
                  backgroundColor: "#F5F5F5",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <NoteAddIcon sx={{ fontSize: "40px", color: "primary.main" }} />
              </Stack>
              <Typography sx={{ fontSize: "28px", fontWeight: 700 }}>
                Add Diagnosis
              </Typography>
            </Stack>
            <CloseIcon
              sx={{ fontSize: "50px", cursor: "pointer" }}
              onClick={handleClose}
            />
          </Stack>
          <Divider />
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                p: 2,
              }}
            >
              {/* ICD Code */}
              <Typography sx={{ fontWeight: 600, mb: 1 }}>
                ICD-10 Code / Name
              </Typography>

              <TextField
                onChange={(e) => {
                  setIcdCode(e.target.value);
                }}
                fullWidth
                placeholder="J20.9"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 18, color: "#6B7280" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "#FFFFFF",
                  },
                }}
              />

              {/* Clinical Description */}
              <Typography sx={{ fontWeight: 600, mb: 1 }}>
                Clinical Description
              </Typography>

              <TextField
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                fullWidth
                multiline
                rows={4}
                placeholder="Enter detailed clinical findings, symptoms, and patient observations ..."
                sx={{
                  mb: 4,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "#FFFFFF",
                  },
                }}
              />

              {/* Severity Level */}
              <Typography sx={{ fontWeight: 600, mb: 2 }}>
                Severity Level
              </Typography>

              <ToggleButtonGroup
                fullWidth
                value={severity}
                exclusive
                onChange={(e, val) => val && setSeverity(val)}
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  gap: 1,
                  mb: 4,
                  flexWrap: "wrap",

                  "& .MuiToggleButtonGroup-grouped": {
                    border: "1px solid #E5E7EB !important",
                    borderRadius: "10px !important",
                    margin: "0 !important",
                  },
                }}
              >
                {["mild", "moderate", "severe"].map((level) => (
                  <ToggleButton
                    key={level}
                    value={level}
                    sx={{
                      borderRadius: "10px",
                      border: "1px solid #E5E7EB",
                      textTransform: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      width: "164px",
                      height: "106px",
                      fontWeight: 500,
                      backgroundColor:
                        severity === level ? "#ECFDF5" : "#FFFFFF",
                      borderColor: severity === level ? "#10B981" : "#E5E7EB",
                      color: severity === level ? "#10B981" : "#6B7280",
                      "&.Mui-selected": {
                        backgroundColor: "#ECFDF5",
                      },
                    }}
                  >
                    {level === "moderate" ? (
                      <WarningAmberIcon />
                    ) : (
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          backgroundColor:
                            severity === level ? "#10B981" : "#D1D5DB",
                        }}
                      />
                    )}
                    {level}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>

              {/* Date + Status */}
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography sx={{ fontWeight: 600, mb: 1 }}>
                    Diagnosis Date
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value="02/14/2024"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodayIcon
                            sx={{ fontSize: 18, color: "#6B7280" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#FFFFFF",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Typography sx={{ fontWeight: 600, mb: 1 }}>
                    Status
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value="Active"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#FFFFFF",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
            {/* Buttons */}
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  color: "black",
                  border: "1px solid #E3E3E3",
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  backgroundColor: "#4CAF7A",
                  color: "white",
                  "&:hover": { backgroundColor: "#43a56f" },
                }}
              >
                Save Record
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={openSnack}
        autoHideDuration={3000}
        onClose={() => setOpenSnack(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpenSnack(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Diagnosis added successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}
