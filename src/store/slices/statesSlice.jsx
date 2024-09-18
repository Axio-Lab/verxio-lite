import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
  userId: "",
  userApiKey: "",
  rewards: {},
  details: {},
  preview: {},
  userProfile: {},
  selectedProductImage: {},
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
  setUserApiKey,
  setUserProfile,
  setRewards,
  setPreview,
  setSelectedProductImage,
} = statesSlice.actions;
export default statesSlice.reducer;
