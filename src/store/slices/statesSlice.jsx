import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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
  tokenMintAddress: "",
  tokenAmount: "",
};

const statesSlice = createSlice({
  name: "generalState",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setTokenMintAddress: (state, action) => {
      state.tokenMintAddress = action.payload;
    },
    setTokenAmount: (state, action) => {
      state.tokenAmount = action.payload;
    },
    setActionType: (state, action) => {
      state.actionType = action.payload;
    },
    setUserApiKey: (state, action) => {
      state.userApiKey = action.payload;
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
  setUserApiKey,
  setActionType,
  setUserProfile,
  setSelectedProductImage,
  setTokenMintAddress,
  setTokenAmount,
} = statesSlice.actions;
export default statesSlice.reducer;
