// src/store/slices/deviceSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DeviceState {
  isMobile: boolean;
  isPC: boolean;
}

const initialState: DeviceState = {
  isMobile: window.innerWidth < 768,
  isPC: window.innerWidth >= 768,
};

const deviceSlice = createSlice({
  name: "device",
  initialState,

  reducers: {
    setDeviceType: (
      state,
      action: PayloadAction<{
        isMobile: boolean;
        isPC: boolean;
      }>,
    ) => {
      state.isMobile = action.payload.isMobile;
      state.isPC = action.payload.isPC;
    },

    setMobile: (state) => {
      state.isMobile = true;
      state.isPC = false;
    },

    setPC: (state) => {
      state.isMobile = false;
      state.isPC = true;
    },
  },
});

export const { setDeviceType, setMobile, setPC } = deviceSlice.actions;

export default deviceSlice.reducer;
