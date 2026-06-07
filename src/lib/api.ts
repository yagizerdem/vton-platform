// apiService.js
import axios from "axios";

const defaultHeaders = {
  // Specifies the format of the data being sent in the request body
  "Content-Type": "application/json",
  // Indicates the client's preferred response data format from the server
  Accept: "application/json",
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 5000, // Timeout in milliseconds
  headers: defaultHeaders,
  validateStatus: () => true, // Allow handling of all HTTP status codes in the response
});
