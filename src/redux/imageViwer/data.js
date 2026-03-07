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
      console.log("setUserInfo", action.payload);
      state.userInfo = action.payload;
    },
    setMediclImage: (state, action) => {
      console.log("setMediclImage", action.payload);
      state.mediclImage = action.payload;
    },
    // updateFirstData: (state, action) => {
    //   state.firstData = { ...state.firstData, ...action.payload };
    // },
    // updateSecondData: (state, action) => {
    //   state.secondData = { ...state.secondData, ...action.payload };
    // },
    clearData: (state) => {
      state.userInfo = null;
      state.mediclImage = null;
    },
  },
});

export const {
  setUserInfo,
  setMediclImage,
  //   updateFirstData,
  //   updateSecondData,
  clearData,
} = dataSliceImgViwer.actions;
export default dataSliceImgViwer.reducer;
