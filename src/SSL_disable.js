import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: 'https://172.235.16.92:8000',
    httpsAgent: {
      rejectUnauthorized: false
    }
  });