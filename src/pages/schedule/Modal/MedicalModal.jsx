import { useState } from "react";
import Modal from "@mui/material/Modal";
import {
  Stack,
  Divider,
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { addmedical } from "../../../redux/schedule/addMedicaql";
import { getAppDetById } from "../../../redux/schedule/appoinmantDetals";
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
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
};
export default function BasicModal({
  openMedicalModal,
  SetopenMedicalModal,
  id,
}) {
  const selectedPatient = useSelector(
    (state) => state.schedule.selectedPatient
  );
  const dispatch = useDispatch();
  const [openSnack, setOpenSnack] = useState(false);
  const handleClose = () => SetopenMedicalModal(false);
  const [recordType, setRecordType] = useState("diagnosis");
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  const handleSave = async () => {
    const patientId = id ? id : selectedPatient?.patient?.id;
    try {
      await dispatch(
        addmedical({
          title,
          description,
          recordType,
          patientId,
        })
      ).unwrap();
      // Refresh appointment details
      await dispatch(getAppDetById({ id: selectedPatient?.id }));
      setOpenSnack(true);
      SetopenMedicalModal(false);
      // Reset form
      setTitle("");
      setDescription("");
      setRecordType("diagnosis");
      setSelectedFile(null);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <div>
      <Modal
        open={openMedicalModal}
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
                Add Medical Record
              </Typography>
            </Stack>
            <CloseIcon
              sx={{ fontSize: "50px", cursor: "pointer" }}
              onClick={handleClose}
            />
          </Stack>
          <Divider />
          <Box sx={{ p: 3 }}>
            {/* Record Type */}
            <Typography fontWeight={600} mb={1}>
              Record Type
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <Select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                sx={{ backgroundColor: "#fff", borderRadius: 2 }}
              >
                <MenuItem value="diagnosis">diagnosis</MenuItem>
                <MenuItem value="lab_result">lab_result</MenuItem>
                <MenuItem value="imaging">imaging</MenuItem>
              </Select>
            </FormControl>
            {/* Title */}
            <Typography fontWeight={600} mb={1}>
              Title <span style={{ color: "red" }}>*</span>
            </Typography>

            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              placeholder="e.g, seasonal Allergy Assessment"
              variant="outlined"
              sx={{ mb: 3, backgroundColor: "#fff", borderRadius: 2 }}
            />

            {/* Description */}
            <Typography fontWeight={600} mb={1}>
              Description <span style={{ color: "red" }}>*</span>
            </Typography>

            <TextField
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
              placeholder="Provide detailed clinical notes, observations, or instructions"
              variant="outlined"
              sx={{ mb: 3, backgroundColor: "#fff", borderRadius: 2 }}
            />

            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              hidden
              id="upload-image"
              onChange={handleFileChange}
            />

            {/* Upload Box */}
            <label htmlFor="upload-image">
              <Box
                sx={{
                  border: "2px dashed #d6d6d6",
                  borderRadius: 3,
                  p: 4,
                  textAlign: "center",
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                  mb: 3,
                }}
              >
                <UploadFileIcon sx={{ fontSize: 32, color: "#9e9e9e" }} />

                <Typography mt={1} color="text.secondary">
                  Click to upload attachments (optional)
                </Typography>

                {selectedFile && (
                  <Typography mt={1} color="primary" fontSize={14}>
                    {selectedFile.name}
                  </Typography>
                )}
              </Box>
            </label>

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
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnack(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Medical record added successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}
