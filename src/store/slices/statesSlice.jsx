import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
  userId: "",
  userApiKey: "",
  details: {},
  actionType: {},
  rewards: {},
  preview: {},
  userProfile: {},
  selectedProductImage: {},
  tokenMint: {},
  digitalProduct: {},
  pollsOption: [],
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
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setTokenMint: (state, action) => {
      state.tokenMint = action.payload;
    },
    setActionType: (state, action) => {
      state.actionType = action.payload;
    },
    setUserApiKey: (state, action) => {
      state.userApiKey = action.payload;
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
      state.actionType = initialState.actionType;
      state.rewards = initialState.rewards;
      state.preview = initialState.preview;
      state.tokenMint = initialState.tokenMint;
      state.digitalProduct = initialState.digitalProduct;
      state.pollsOption = initialState.pollsOption;
    },
    resetApiKey: (state) => {
      state.userApiKey = initialState.userApiKey;
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
  setDigitalProduct,
  setSelectedProductImage,
  resetCreateCampaignFormData,
  resetApiKey,
} = statesSlice.actions;
export default statesSlice.reducer;
