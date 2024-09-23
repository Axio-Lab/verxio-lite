import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { PURGE } from "redux-persist";
const apiBaseURL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  newCampaign: {
    status: "idle",
    error: null,
    data: {},
  },
};

export const createCampaign = createAsyncThunk(
  "campaign/createNewCampaign",
  async ({ campaignType, data }) => {
    try {
      const response = await axios.post(
        `${apiBaseURL}/campaign?campaignType=${campaignType}`,
        data
      );
      return response.data;
    } catch (err) {
      console.log(err.response.data);
      if (!err.response) {
        throw err.message;
      }
      return err.response.data;
    }
  }
);

const apiKeySlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCampaign.pending, (state) => {
        state.newCampaign.status = "loading";
        state.newCampaign.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        if (
          // action.payload === "Success" ||
          action.payload.success === true
        ) {
          state.newCampaign.data = action.payload;
          state.newCampaign.status = "succeeded";
        } else {
          state.newCampaign.status = "failed";
          state.newCampaign.error = action.payload;
        }
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.newCampaign.error = action.payload;
        state.newCampaign.status = "failed";
      })

      //purge all state
      .addCase(PURGE, () => {
        return initialState;
      });
  },
});

export const productActions = apiKeySlice.actions;
export const {} = apiKeySlice.actions;
export default apiKeySlice.reducer;
