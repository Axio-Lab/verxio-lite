import axios from "axios";

let headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: localStorage.getItem(TOKEN_KEY), // Set token directly here
};

const Endpoint = {
  init: () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.defaults.baseURL = "https://backendcbt.lloydant.com/api";

    // Set up axios interceptors for error handling
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error.response) {
          // Handle offline or network error
        } else if (
          error.response &&
          error.response.status === 401 &&
          error.response.config.url !== "/"
        ) {
          return;
          // logOutUser();
        }

        return Promise.reject(error.response);
      }
    );
  },

  login: (data) => {
    return axios.post("/Authentication/Login", data, { headers });
  },
};

export default Endpoint;
