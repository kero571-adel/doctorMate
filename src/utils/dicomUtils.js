// src/utils/dicomUtils.js
import cornerstone from "cornerstone-core";
//import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";

export const isDicomFile = (fileType, fileName) => {
  const type = fileType?.toLowerCase();
  const name = fileName?.toLowerCase();
  return (
    type === ".dcm" ||
    type === "dcm" || 
    type === ".dicom" ||
    type === "dicom" || 
    name?.endsWith(".dcm") ||
    name?.endsWith(".dicom") 
  );
};

export const buildDicomImageUrl = (
  viewerUrl,
  baseUrl = "http://localhost:8042"
) => {
  if (!viewerUrl) return null;
  if (viewerUrl.startsWith("wadouri:")) return viewerUrl;
  const normalized = viewerUrl.replace(/\\/g, "/");
  const fullPath = normalized.startsWith("http")
    ? normalized
    : `${baseUrl.replace(/\/$/, "")}/${normalized.replace(/^\//, "")}`;
  return `wadouri:${fullPath}`;
};

export const loadDicomOnElement = async (element, viewerUrl, options = {}) => {
  const {
    baseUrl = "http://localhost:8042",
    onLoading = null,
    onSuccess = null,
    onError = null,
    fitToWindow = true,
  } = options;

  if (!element || !viewerUrl) {
    onError?.(new Error("Missing element or viewerUrl"));
    return;
  }
  element._isUnmounted = false;
  try {
    try {
      cornerstone.getEnabledElement(element);
    } catch {
      cornerstone.enable(element);
    }
    onLoading?.();

    const imageId = buildDicomImageUrl(viewerUrl, baseUrl);

    if (!imageId) throw new Error("Failed to build image URL");

    const image = await cornerstone.loadAndCacheImage(imageId);

    if (element && !element._isUnmounted) {
      cornerstone.displayImage(element, image);
      if (fitToWindow) cornerstone.fitToWindow(element);
    }

    onSuccess?.(image);
    return image;
  } catch (error) {
    if (element && !element._isUnmounted) {
      element.innerHTML = `
        <div style="color:#fff;text-align:center;padding:20px;font-size:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;background:#000;">
          <div style="font-size:24px;margin-bottom:8px;">⚠️</div>
          <div>${
            error?.message?.includes("404")
              ? "Image not found"
              : "Failed to load DICOM"
          }</div>
        </div>
      `;
    }
    onError?.(error);

    return null;
  }
};

export const cleanupDicomElement = (element) => {
  if (!element) return;
  element._isUnmounted = true;
  try {
    cornerstone.disable(element);
  } catch (error) {
    console.warn("⚠️ Cornerstone cleanup warning:", error);
  }
};

export const useDicomLoader = (elementRef, viewerUrl, options = {}) => {
  const { baseUrl, onLoading, onSuccess, onError } = options;
  return {
    load: () => {
      if (elementRef.current) {
        return loadDicomOnElement(elementRef.current, viewerUrl, {
          baseUrl,
          onLoading,
          onSuccess,
          onError,
        });
      }
      return Promise.reject(new Error("Element ref not available"));
    },
    cleanup: () => {
      if (elementRef.current) cleanupDicomElement(elementRef.current);
    },
  };
};

export const getDisplayImageUrl = (
  viewerUrl,
  baseUrl = "http://localhost:8042"
) => {
  if (!viewerUrl) return null;
  const normalized = viewerUrl.replace(/\\/g, "/");
  return normalized.startsWith("http")
    ? normalized
    : `${baseUrl}/${normalized}`;
};
