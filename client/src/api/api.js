import axios from 'axios';
import { resetAuthState, updateAccessToken } from '../redux/slices/auth/authSlice';
import {logOutUser} from '../redux/slices/auth/authSlice';


const API = axios.create({
  baseURL: process.env.API_URL, // Your API base URL
  withCredentials: true,
});

// Add a request interceptor to add the token to the headers for each api calls
API.interceptors.request.use(
  (config) => {
    // Read token from localStorage
    const token = localStorage.getItem("token");
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add an interceptor to refresh token on 401 errors
export const setupResponseInterceptor = (store) => {
  API.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Prevent infinite loops

        try {
          // Request a new access token using the refresh token
          console.log("JWT access token expired. Trying to refresh...");

          //print token from cookie
          const refreshResponse = await API.post("/api/v1/auth/regenerate-access-token");

          // const refreshResponse = await axios.post("http://localhost:5000/api/v1/auth/regenerate-access-token", {}, { withCredentials: true });
          // console.log("New access token:", refreshResponse.data.accessToken);

          const newAccessToken = refreshResponse.data.token;

          //remove old token from local storage
          localStorage.removeItem("token");

          // Dispatch Redux action to update token in state
          store.dispatch(updateAccessToken(newAccessToken))

          //update token in local storage
          localStorage.setItem("token", newAccessToken);

          // Update Axios headers for retrying the original request
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return axios(originalRequest); // Retry the failed request
        } catch (refreshError) {
          console.error("Refresh token expired. Logging out...");
          const userData = JSON.parse(localStorage.getItem('user'));
          store.dispatch(logOutUser(userData)) // Dispatch logout action for server db cleanup
          store.dispatch(resetAuthState()); // Dispatch reset auth state action for client cleanup
          window.location.href = '/auth'; // Redirect to login
        }
      }

      return Promise.reject(error);
    }
  )
};

export default API;
