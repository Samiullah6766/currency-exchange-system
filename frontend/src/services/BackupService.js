import axios from "axios";

const REST_API_BASE_URL = `${import.meta.env.VITE_API_URL}/backup`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createBackup = () => {
  return axios.post(
    `${REST_API_BASE_URL}/create`,
    {},
    getAuthHeader()
  );
};

export const getBackups = () => {
  return axios.get(
    `${REST_API_BASE_URL}/list`,
    getAuthHeader()
  );
};

export const restoreBackup = (backupFile) => {
  return axios.post(
    `${REST_API_BASE_URL}/restore`,
    {
      backupFile,
    },
    getAuthHeader()
  );
};