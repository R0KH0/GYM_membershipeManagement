import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/",
  withCredentials: true, // VERY IMPORTANT for HttpOnly cookies
});