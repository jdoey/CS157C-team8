import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/",
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    // Resolve the promise for successful responses
    return response;
  },
  (error) => {
    // For responses with status code 400-499, resolve the promise with the response
    // This means that requests that return 4xx status code won't get caught by a `catch` block
    if (error.response && error.response.status === 401) {
      console.log("Redirecting to login page");
      window.location.href = "/";
      return;
    }
    console.log("Error in axiosInstance", error);
    // For other errors, reject the promise with the error
    return Promise.reject(error);
  }
);

export default axiosInstance;
