import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  mediclImage: null,
};

const dataSliceImgViwer = createSlice({
  name: "dataSliceImgViwer",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setMediclImage: (state, action) => {
      state.mediclImage = action.payload;
    },
    clearData: (state) => {
      state.userInfo = null;
      state.mediclImage = null;
    },
  },
});

export const {
  setUserInfo,
  setMediclImage,
  clearData,
} = dataSliceImgViwer.actions;
export default dataSliceImgViwer.reducer;
