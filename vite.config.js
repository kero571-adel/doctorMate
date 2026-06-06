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
        manualChunks: {
          "react-vendor": [
            "react",
            "react-dom",
            "react-router",
            "react-router-dom",
          ],
          "mui-core": ["@mui/material", "@emotion/react", "@emotion/styled"],
          "mui-icons": ["@mui/icons-material"],
          redux: ["@reduxjs/toolkit", "react-redux", "redux-persist"],
          charts: ["recharts", "@mui/x-charts"],
          dicom: [
            "cornerstone-core",
            "cornerstone-wado-image-loader",
            "dicom-parser",
          ],
          firebase: ["firebase"],
          agora: ["agora-rtc-react", "agora-rtc-sdk-ng"],
        },
      },
    },
  },
});
