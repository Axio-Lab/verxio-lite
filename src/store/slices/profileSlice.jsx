import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { PURGE } from "redux-persist";

const apiBaseURL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  profile: {
    status: "idle",
    error: null,
    data: {},
  }
};

export const createProfile = createAsyncThunk(
  "profile/newProfile",
  async ({ id }) => {
    try {
      const response = await axios.post(`${apiBaseURL}/profile/${id}`);
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

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //add Profile
      .addCase(createProfile.pending, (state) => {
        state.profile.status = "loading";
        state.profile.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        if (
          // action.payload === "Success" ||
          action.payload.success === true
        ) {
          state.profile.data = action.payload;
          state.profile.status = "succeeded";
        } else {
          state.profile.status = "failed";
          state.profile.error = action.payload;
        }
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.profile.error = action.payload;
        state.profile.status = "failed";
      })

     
      //purge all state
      .addCase(PURGE, () => {
        return initialState;
      });
  },
});

export const profileActions = profileSlice.actions;
export const {} = profileSlice.actions;
export default profileSlice.reducer;
