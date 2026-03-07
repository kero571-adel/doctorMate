import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPrescriptions } from "../../../redux/schedule/addpresipration";
import { getAppDetById } from "../../../redux/schedule/appoinmantDetals";
import Modal from "@mui/material/Modal";
import {
  Stack,
  Divider,
  Box,
  Button,
  TextField,
  Typography,
  Card,
  Grid,
} from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import { Snackbar, Alert } from "@mui/material";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: { xs: "90%", md: "60%" },
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  height: "90vh",
  overflowY: "auto",
  borderRadius: "10px",
  border: "none",
  "&::-webkit-scrollbar": { display: "none" },
};

export default function AddPrescription({
  openAddPrescription,
  setopenAddPrescription,
}) {
  const [openSnack, setOpenSnack] = useState(false);
  const [openSuccessSnack, setOpenSuccessSnack] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector((state) => state.prescriptions);
  const diagnosisId = useSelector((state) => state.diagnoses.data);
  const selectedPatient = useSelector((state) => state.schedule.selectedPatient);
  //State for medications
  const [medications, setMedications] = useState([
    {
      drugName: "",
      dosage: "",
      instructions: "",
      frequency: "",
      durationDays: 7,
    },
  ]);
  const handleClose = () => {
    setopenAddPrescription(false);
    setMedications([
      {
        drugName: "",
        dosage: "",
        instructions: "",
        frequency: "",
        durationDays: 7,
      },
    ]);
  };

  // Handle medication field changes
  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...medications];
    updatedMedications[index][field] = value;
    setMedications(updatedMedications);
  };

  // Add new medication field
  const handleAddMedication = () => {
    setMedications([
      ...medications,
      {
        drugName: "",
        dosage: "",
        instructions: "",
        frequency: "",
        durationDays: 7,
      },
    ]);
  };

  // Remove medication field
  const handleRemoveMedication = (index) => {
    if (medications.length > 1) {
      const updatedMedications = medications.filter((_, i) => i !== index);
      setMedications(updatedMedications);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate that all required fields are filled
    const isValid = medications.every((med) => med.drugName && med.dosage);

    if (!isValid) {
      alert("Please fill in all required fields (Drug Name and Dosage)");
      return;
    }

    if (!diagnosisId) {
      alert("Diagnosis ID is required");
      return;
    }
    try {
      await dispatch(
        addPrescriptions({
          diagnosisId: diagnosisId.data.id,
          medications: medications.map((med) => ({
            drugName: med.drugName,
            dosage: med.dosage,
            instructions: med.instructions,
            frequency: med.frequency,
            durationDays: parseInt(med.durationDays),
          })),
        })
      ).unwrap();
      // Refresh appointment details
      await dispatch(getAppDetById({ id: selectedPatient?.id }));
      setOpenSuccessSnack(true);
      handleClose();
    } catch (error) {
      console.log("Error:", error);
    }
  };
  
useEffect(() => {
  if (openAddPrescription && !diagnosisId?.data?.id) {
    setOpenSnack(true);
    setopenAddPrescription(false);
  }
}, [openAddPrescription, diagnosisId]);
  return (
    <div>
      <Modal
        open={openAddPrescription}
        onClose={handleClose}
        sx={{
          borderRadius: "10px",
          boxShadow: "2px 1px 2px 1px #00000040",
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
                Add Prescription
              </Typography>
            </Stack>
            <CloseIcon
              sx={{ fontSize: "50px", cursor: "pointer" }}
              onClick={handleClose}
            />
          </Stack>
          <Divider />

          <Box sx={{ p: 3 }}>
            {/* Show error if exists */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {typeof error === "string" ? error : "An error occurred"}
              </Alert>
            )}

            {/* Show success message */}
            {data && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Prescription saved successfully!
              </Alert>
            )}

            {/* Medication Cards */}
            {medications.map((med, index) => (
              <Card
                key={index}
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: "10px",
                  boxShadow: "none",
                  border: "1px solid #B1B1B1",
                  position: "relative",
                  overflow: "visible",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: -5,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    height: "90%",
                    margin: "auto",
                    backgroundColor: "#1FA97A",
                    borderTopLeftRadius: "10px",
                    borderBottomLeftRadius: "10px",
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    ml: 1,
                  }}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: 16 }}>
                    MEDICATION {index + 1}
                  </Typography>
                  {medications.length > 1 && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemoveMedication(index)}
                    >
                      Remove
                    </Button>
                  )}
                </Box>

                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={6}>
                    <Typography fontSize={13} mb={0.5} fontWeight={500}>
                      Drug Name *
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="e.g. Amoxicillin"
                      value={med.drugName}
                      onChange={(e) =>
                        handleMedicationChange(
                          index,
                          "drugName",
                          e.target.value
                        )
                      }
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Typography fontSize={13} mb={0.5} fontWeight={500}>
                      Dosage *
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="e.g. 500mg"
                      value={med.dosage}
                      onChange={(e) =>
                        handleMedicationChange(index, "dosage", e.target.value)
                      }
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Typography fontSize={13} mb={0.5} fontWeight={500}>
                      Frequency
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Every 6 hours"
                      value={med.frequency}
                      onChange={(e) =>
                        handleMedicationChange(
                          index,
                          "frequency",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography fontSize={13} mb={0.5} fontWeight={500}>
                      Duration (Days)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      placeholder="7"
                      value={med.durationDays}
                      onChange={(e) =>
                        handleMedicationChange(
                          index,
                          "durationDays",
                          e.target.value
                        )
                      }
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography fontSize={13} mb={0.5} fontWeight={500}>
                      Special Instructions
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="e.g. Take after meals, Avoid alcohol"
                      value={med.instructions}
                      onChange={(e) =>
                        handleMedicationChange(
                          index,
                          "instructions",
                          e.target.value
                        )
                      }
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              </Card>
            ))}

            {/* Add Another Drug Button */}
            <Box
              sx={{
                border: "2px dashed #1FA97A",
                borderRadius: "8px",
                p: 2.5,
                textAlign: "center",
                cursor: "pointer",
                color: "#1FA97A",
                fontWeight: 500,
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 3,
                "&:hover": {
                  backgroundColor: "rgba(31, 169, 122, 0.05)",
                },
              }}
              onClick={handleAddMedication}
            >
              <AddIcon fontSize="small" />
              Add Another Drug
            </Box>

            {/* Action Buttons */}
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                onClick={handleClose}
                variant="outlined"
                disabled={loading}
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
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? null : <SaveIcon />}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  backgroundColor: "#4CAF7A",
                  color: "white",
                  "&:hover": { backgroundColor: "#43a56f" },
                  "&:disabled": { backgroundColor: "#a5d6b7" },
                }}
              >
                {loading ? "Saving..." : "Save Prescription"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={openSnack}
        autoHideDuration={4000}
        onClose={() => setOpenSnack(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnack(false)}
          severity="warning"
          variant="filled"
          sx={{ width: "100%" }}
        >
          You must add a diagnosis before adding a prescription.
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSuccessSnack}
        autoHideDuration={3000}
        onClose={() => setOpenSuccessSnack(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpenSuccessSnack(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Prescription added successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}
