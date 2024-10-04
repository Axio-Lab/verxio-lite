import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import React, { createContext, useEffect, useReducer } from "react";

const CampaignContext = createContext();
const CampaignProvider = ({ children }) => {
  const initialState = {
    loading: false,
    myCampaigns: [],
    campaignWinners: [],
    campaignParticipants: [],
  };

  const SET_LOADING = "SET_LOADING";
  const GET_MY_CAMPAIGNS = "GET_MY_CAMPAIGNS";
  const GET_ALL_CAMPAIGNS = "GET_ALL_CAMPAIGNS";
  const GET_ALL_CAMPAIGN_WINNERS = "GET_ALL_CAMPAIGN_WINNERS";
  const GET_CAMPAIGN_PARTICIPANTS = "GET_CAMPAIGN_PARTICIPANTS";

  const apiBaseURL = process.env.NEXT_PUBLIC_API_URL;
  const userApiKey = useSelector(
    (state) => state.generalStates.userProfile.key
  );

  const headers = {
    "X-API-Key": userApiKey,
    "Content-Type": "application/json",
  };

  const campaignReducer = (state, action) => {
    switch (action.type) {
      case SET_LOADING:
        return {
          ...state,
          loading: action.payload,
        };

      case GET_ALL_CAMPAIGNS:
        return {
          ...state,
          allCampaigns: action.payload,
        };

      case GET_MY_CAMPAIGNS:
        return {
          ...state,
          myCampaigns: action.payload,
        };
      case GET_CAMPAIGN_PARTICIPANTS:
        return {
          ...state,
          campaignParticipants: action.payload,
        };
      case GET_ALL_CAMPAIGN_WINNERS:
        return {
          ...state,
          campaignWinners: action.payload,
        };

      default:
        return state;
    }
  };

  const getAllCampaigns = async () => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      const response = await axios.get(`${apiBaseURL}/campaign/all`);
      // console.log(response?.data?.campaigns, "All Campaigns");
      if (response.data.success === true) {
        dispatch({
          type: "GET_ALL_CAMPAIGNS",
          payload: response?.data?.campaigns,
        });
        dispatch({ type: SET_LOADING, payload: false });
      } else {
        toast.error(response.data.message);
      }
      dispatch({ type: SET_LOADING, payload: false });
    } catch (error) {
      console.error("Error fetching all campaign:", error);
      toast.error(error.message);
    }
  };

  const getMyCampaigns = async () => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      const response = await axios.get(`${apiBaseURL}/campaign`, { headers });
      // console.log(response?.data?.campaigns, "My campaigns");
      if (response.data.success === true) {
        dispatch({
          type: "GET_MY_CAMPAIGNS",
          payload: response?.data?.campaigns,
        });
        dispatch({ type: SET_LOADING, payload: false });
      } else {
        toast.error(response.data.message);
      }
      dispatch({ type: SET_LOADING, payload: false });
    } catch (error) {
      console.error("Error fetching user campaign:", error);
      toast.error(error.message);
    }
  };

  const getAllParticipants = async (campaignId) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      const response = await axios.get(
        `${apiBaseURL}/participation/${campaignId}`
      );
      // console.log(response?.data?.data?.submissions, "Participants");
      if (response.data.success === true) {
        dispatch({
          type: "GET_CAMPAIGN_PARTICIPANTS",
          payload: response?.data?.data?.submissions,
        });
        dispatch({ type: SET_LOADING, payload: false });
      } else {
        toast.error(response.data.message);
      }
      dispatch({ type: SET_LOADING, payload: false });
    } catch (error) {
      console.error("Error fetching campaign participants:", error);
      toast.error(error.message);
    }
  };

  const getAllWinners = async (campaignId) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      const response = await axios.get(`${apiBaseURL}/winner/${campaignId}`);
      // console.log(response?.data?.data, "winners");
      if (response.data.success === true) {
        dispatch({
          type: "GET_ALL_CAMPAIGN_WINNERS",
          payload: response?.data?.data,
        });
        dispatch({ type: SET_LOADING, payload: false });
      } else {
        toast.error(response.data.message);
      }
      dispatch({ type: SET_LOADING, payload: false });
    } catch (error) {
      console.error("Error fetching campaign winners:", error);
      toast.error(error.message);
    }
  };

  const payWinners = async (campaignId) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      const response = await axios.post(
        `${apiBaseURL}/campaign/pay/${campaignId}`,
        { headers }
      );
      console.log(response, "paid winners response");
      if (response.data.success === true) {
        toast.success(response.data.message);
        dispatch({ type: SET_LOADING, payload: false });
      } else {
        toast.error(response.data.message);
      }
      dispatch({ type: SET_LOADING, payload: false });
    } catch (error) {
      console.error("Error paying campaign winners:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAllCampaigns();
    // eslint-disable-next-line
  }, []);

  const [state, dispatch] = useReducer(campaignReducer, initialState);

  return (
    <CampaignContext.Provider
      value={{
        state,
        dispatch,
        payWinners,
        getAllWinners,
        getMyCampaigns,
        getAllCampaigns,
        getAllParticipants,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export { CampaignProvider, CampaignContext };
