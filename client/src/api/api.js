import axios from 'axios';


const API = axios.create({
  baseURL: 'http://localhost:5000', // Your API base URL
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
        console.log("New access token:", refreshResponse.data.accessToken);

        // const refreshResponse = await axios.post("http://localhost:5000/api/v1/auth/regenerate-access-token", {}, { withCredentials: true });
        console.log("New access token:", refreshResponse.data.accessToken);

        const newAccessToken = refreshResponse.data.token;
        // Dispatch Redux action to update token in state (if using Redux)
        // useDispatch(updateAccessToken(newAccessToken)) // Update token in Redux store

        // Update Axios headers for retrying the original request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axios(originalRequest); // Retry the failed request
      } catch (refreshError) {
        console.error("Refresh token expired. Logging out...");
        // useDispatch(logOutUser()) // Dispatch logout action
      }
    }

    return Promise.reject(error);
  }
)

export default API;
