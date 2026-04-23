// src/redux/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit"; // ← ✅ أضف combineReducers
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Import your reducers
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
import communicationReducer from "./communication/communicationSlice";

// ✅ Config for redux-persist
const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: [
    "auth",
    "communication",
    "doctor",
    "schedule",
    "patientdet",
    "medical",
    "diagnoses",
    "dataSliceImgViwer",
  ],
  blacklist: [
    "overView",
    "patients",
    "prescriptions",
    "report",
    "profile",
  ],
};

// ✅ 1. اجمع الـ reducers في دالة واحدة باستخدام combineReducers
const rootReducer = combineReducers({
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
  communication: communicationReducer,
});

// ✅ 2. طبق persistReducer على الـ rootReducer (اللي دلوقتي دالة)
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);