import axios from "axios";

const BASE_URL =
  `${import.meta.env.VITE_API_URL}/auth`;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const loginUser = (data) => {
    return axios.post(BASE_URL + "/login", data);
};

export const registerUser = (data) => {
    return axios.post(BASE_URL+"/registerUser", data)
}

export const allUsers = () => {
    return axios.get(BASE_URL+"/users", getAuthHeader());
}