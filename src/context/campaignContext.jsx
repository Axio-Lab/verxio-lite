import axios from "axios";
import { toast } from "react-toastify";
import React, { createContext, useEffect, useReducer } from "react";

const CampaignContext = createContext();
const CampaignProvider = ({ children }) => {
  const initialState = {
    loading: false,
    allCampaigns: [],
  };

  const apiBaseURL = process.env.NEXT_PUBLIC_API_URL;
  const SET_LOADING = "SET_LOADING";
  const GET_ALL_CAMPAIGNS = "GET_ALL_CAMPAIGNS";

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

      default:
        return state;
    }
  };

  const createANewCampaign = async () => {
    try {
      dispatch({ type: SET_LOADING, payload: true });

      const response = await axios.get(`${apiBaseURL}/campaign/all`);
      console.log(response?.data?.campaigns);
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
      console.error("Error creating campaign:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    createANewCampaign();
    // eslint-disable-next-line
  }, []);

  const [state, dispatch] = useReducer(campaignReducer, initialState);

  return (
    <CampaignContext.Provider
      value={{
        state,
        dispatch,
        createANewCampaign,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export { CampaignProvider, CampaignContext };
