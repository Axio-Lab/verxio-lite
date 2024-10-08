import { PURGE } from "redux-persist";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  details: {},
  actionType: {},
  rewards: {},
  preview: {},
  tokenMint: {},
  userProfile: {},
  pollsOption: {},
  digitalProduct: {},
  allCampaigns: [],
  selectedProductImage: {},
};

const statesSlice = createSlice({
  name: "generalState",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setDigitalProduct: (state, action) => {
      state.digitalProduct = action.payload;
    },
    setAllCampaigns: (state, action) => {
      state.allCampaigns = action.payload;
    },
    setTokenMint: (state, action) => {
      state.tokenMint = action.payload;
    },
    setActionType: (state, action) => {
      state.actionType = action.payload;
    },
    setPollsOption: (state, action) => {
      state.pollsOption = action.payload;
    },
    setRewards: (state, action) => {
      state.rewards = action.payload;
    },
    setDetails: (state, action) => {
      state.details = action.payload;
    },
    setPreview: (state, action) => {
      state.preview = action.payload;
    },
    setSelectedProductImage: (state, action) => {
      state.selectedProductImage = action.payload;
    },

    // Action for reseting the redux state after create campaign submission
    resetCreateCampaignFormData: (state) => {
      state.details = initialState.details;
      state.rewards = initialState.rewards;
      state.preview = initialState.preview;
      state.tokenMint = initialState.tokenMint;
      state.actionType = initialState.actionType;
      state.pollsOption = initialState.pollsOption;
      state.digitalProduct = initialState.digitalProduct;
    },
    resetActionType: (state) => {
      state.tokenMint = initialState.tokenMint;
      state.digitalProduct = initialState.digitalProduct;
      state.pollsOption = initialState.pollsOption;
    },
    resetUserProfile: (state) => {
      state.userProfile = initialState.userProfile;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const statesActions = statesSlice.actions;
export const {
  setUserId,
  setDetails,
  setRewards,
  setPreview,
  setTokenMint,
  setActionType,
  setUserApiKey,
  setUserProfile,
  setPollsOption,
  setAllCampaigns,
  resetActionType,
  resetUserProfile,
  setDigitalProduct,
  setSelectedProductImage,
  resetCreateCampaignFormData,
} = statesSlice.actions;
export default statesSlice.reducer;
