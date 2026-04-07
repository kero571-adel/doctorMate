// src/index.js أو src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";

// ✅ Redux & Persist
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store"; // ← ✅ استيراد واحد بس فيه الاتنين

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {/* ✅ PersistGate بيخلي الـ app يستنى لحد ما الـ state يتحمّل من localStorage */}
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);