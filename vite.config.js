import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    target: "es2020",
    rollupOptions: {
      output: {

        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("firebase"))         return "firebase-vendor";
            if (id.includes("@mui/icons-material")) return "mui-icons";
            if (id.includes("@mui/material") ||
                id.includes("@emotion"))         return "mui-core";
            if (id.includes("@reduxjs") ||
                id.includes("react-redux") ||
                id.includes("redux-persist"))    return "redux";
            if (id.includes("recharts") ||
                id.includes("@mui/x-charts"))   return "charts";
            if (id.includes("cornerstone") ||
                id.includes("dicom-parser"))     return "dicom";
            if (id.includes("agora"))            return "agora";
            if (id.includes("react-router") ||
                id.includes("react-dom") ||
                id.includes("/react/"))          return "react-vendor";
          }
        },
      },
    },
  },
});