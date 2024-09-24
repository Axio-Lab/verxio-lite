import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { PURGE } from "redux-persist";
const apiBaseURL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  createkey: {
    status: "idle",
    error: null,
    data: {},
  },
  invalidateKey: {
    status: "idle",
    error: null,
    data: {},
  },
  verify: {
    status: "idle",
    error: null,
    data: {},
  },
};

export const createAPIKey = createAsyncThunk(
  "apiKey/createAPIKey",
  async ({ id }) => {
    try {
      const response = await axios.post(`${apiBaseURL}/api-key/${id}`);
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

export const invalidateAPIKey = createAsyncThunk(
  "apiKey/invalidateAPIKey",
  async ({ id }) => {
    try {
      const response = await axios.patch(`${apiBaseURL}/api-key/${id}`);
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

export const verifyUser = createAsyncThunk(
  "profile/verifyProfile",
  async ({ data }) => {
    try {
      const response = await axios.post(
        `${apiBaseURL}/profile/verify-user`,
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
  name: "apiKey",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAPIKey.pending, (state) => {
        state.createkey.status = "loading";
        state.createkey.error = null;
      })
      .addCase(createAPIKey.fulfilled, (state, action) => {
        if (
          // action.payload === "Success" ||
          action.payload.success === true
        ) {
          state.createkey.data = action.payload;
          state.createkey.status = "succeeded";
        } else {
          state.createkey.status = "failed";
          state.createkey.error = action.payload;
        }
      })
      .addCase(createAPIKey.rejected, (state, action) => {
        state.createkey.error = action.payload;
        state.createkey.status = "failed";
      })

      // Invalidate apiKey
      .addCase(invalidateAPIKey.pending, (state) => {
        state.invalidateKey.status = "loading";
        state.invalidateKey.error = null;
      })
      .addCase(invalidateAPIKey.fulfilled, (state, action) => {
        if (
          // action.payload === "Success" ||
          action.payload.success === true
        ) {
          state.invalidateKey.data = action.payload;
          state.invalidateKey.status = "succeeded";
        } else {
          state.invalidateKey.status = "failed";
          state.invalidateKey.error = action.payload;
        }
      })
      .addCase(invalidateAPIKey.rejected, (state, action) => {
        state.invalidateKey.error = action.payload;
        state.invalidateKey.status = "failed";
      })

      // Verify a new user
      .addCase(verifyUser.pending, (state) => {
        state.verify.status = "loading";
        state.verify.error = null;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        if (
          // action.payload === "Success" ||
          action.payload.success === true
        ) {
          state.verify.data = action.payload;
          state.verify.status = "succeeded";
        } else {
          state.verify.status = "failed";
          state.verify.error = action.payload;
        }
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.verify.error = action.payload;
        state.verify.status = "failed";
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
