// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";

// ✅ Redux & Persist
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";

// 🩻 Cornerstone Initialization (  DICOM)
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

cornerstoneWADOImageLoader.configure({
  useWebWorkers: true,  
  decodeConfig: {
    convertFloatPixelDataToInt: true,  
  },
  
  beforeSend: function(xhr) {
    const token = localStorage.getItem("token");
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }
  }
});

// ✅ 3. تسجيل الـ image loaders عشان Cornerstone يفهم روابط الـ DICOM
cornerstone.registerImageLoader("wadouri", cornerstoneWADOImageLoader.loadImage);
cornerstone.registerImageLoader("dicomweb", cornerstoneWADOImageLoader.loadImage);

// 🚀 Render the App
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);