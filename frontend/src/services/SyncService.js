import axios from "axios";

const REST_API_BASE_URL = `${import.meta.env.VITE_API_URL}/sync`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const sendDataToServer = () => {
  return axios.post(
    `${REST_API_BASE_URL}/send`,
    {},
    getAuthHeader()
  );
};