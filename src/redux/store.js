import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import overViewReducer from "./overViews/overView";
import schuduleReducer from "./schedule/schedule";
import profileManagementrReducer from "./doctor/profileMangment";
import doctorReducer from "./doctor/doctor";
import patientsListReducer from "./patientList/patientList";
import medicalReducer from "./schedule/addMedicaql";
import diagnosesReducer from "./schedule/addDiagnoses";
import prescriptionsReducer from "./schedule/addpresipration";
import patientdetReducer from "./schedule/appoinmantDetals";
import getRportReducer from "./doctor/report";
import addMedicalImgReducer from "./schedule/addMedicalImg";
import dataSliceImgViwerReucer from "./imageViwer/data";
export const store = configureStore({
  reducer: {
    overView: overViewReducer,
    auth: authSlice,
    schedule: schuduleReducer,
    profile: profileManagementrReducer,
    doctor: doctorReducer,
    patients: patientsListReducer,
    medical: medicalReducer,
    diagnoses: diagnosesReducer,
    prescriptions: prescriptionsReducer,
    patientdet: patientdetReducer,
    report: getRportReducer,
    MedicalImg: addMedicalImgReducer,
    dataSliceImgViwer: dataSliceImgViwerReucer,
  },
});
