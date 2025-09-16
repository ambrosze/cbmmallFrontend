import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAffiliateGlobalModal: false,
  isOpenSideNavBar: false,
};

const openGlobalModalSlice = createSlice({
  name: "openGlobalModal",
  initialState,
  reducers: {
    toggleOpenGlobalModal: (state) => {
      state.isOpenSideNavBar = !state.isOpenSideNavBar;
    },
    toggleLargeOpenGlobalModal: (state) => {
      state.isAffiliateGlobalModal = !state.isAffiliateGlobalModal;
    },
    toggleCloseGlobalModal: (state) => {
      state.isOpenSideNavBar = false; // Explicitly set to false for closing
    },
    toggleLargeCloseGlobalModal: (state) => {
      state.isAffiliateGlobalModal = false;
    },
    // Enhanced mobile sidebar toggle
    toggleMobileSidebar: (state) => {
      console.log(
        "Redux: toggling sidebar from",
        state.isOpenSideNavBar,
        "to",
        !state.isOpenSideNavBar
      );
      state.isOpenSideNavBar = !state.isOpenSideNavBar;
    },
  },
});

export const {
  toggleOpenGlobalModal,
  toggleCloseGlobalModal,
  toggleLargeOpenGlobalModal,
  toggleLargeCloseGlobalModal,
  toggleMobileSidebar,
} = openGlobalModalSlice.actions;
export default openGlobalModalSlice.reducer;
