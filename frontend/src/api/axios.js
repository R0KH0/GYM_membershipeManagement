import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/",
  withCredentials: true, // VERY IMPORTANT for HttpOnly cookies
});

// Handle 401 errors (redirect to login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);