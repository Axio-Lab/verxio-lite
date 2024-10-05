import axios from "axios";
import { PURGE } from "redux-persist";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const apiBaseURL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  campaign: {
    status: "idle",
    error: null,
    data: {},
  },
};

export const createCampaign = createAsyncThunk(
  "campaign/createNewCampaign",
  async ({ campaignType, data, userApiKey }) => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-API-Key": `${userApiKey}`,
    };

    try {
      const response = await axios.post(
        `${apiBaseURL}/campaign?campaignType=${campaignType}`,
        data,
        { headers }
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

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //create campaign
      .addCase(createCampaign.pending, (state) => {
        state.campaign.status = "loading";
        state.campaign.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        if (
          // action.payload === "Success" ||
          action.payload.success === true
        ) {
          state.campaign.data = action.payload;
          state.campaign.status = "succeeded";
        } else {
          state.campaign.status = "failed";
          state.campaign.error = action.payload;
        }
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.campaign.error = action.payload;
        state.campaign.status = "failed";
      })

      //purge all state
      .addCase(PURGE, () => {
        return initialState;
      });
  },
});

export const campaignActions = campaignSlice.actions;
export const {} = campaignSlice.actions;
export default campaignSlice.reducer;
