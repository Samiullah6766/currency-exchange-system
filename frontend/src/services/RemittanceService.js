import axios from "axios";
import { data } from "react-router-dom";

const REST_API_BASE_URL =
  `${import.meta.env.VITE_API_URL}/remittances`;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const createRemittance = (data) => {
    return axios.post(REST_API_BASE_URL+"/createRemittance", data, getAuthHeader())
}

export const getRemittances = (data) => {
    return axios.get(REST_API_BASE_URL+"/getAllRemittances", getAuthHeader())
}

export const getRemittance = (id) => {
    return axios.get(REST_API_BASE_URL+"/remittance/"+id, getAuthHeader())
}

export const updateRemittance = (id, data) => {
    return axios.put(REST_API_BASE_URL+"/updateRemittance/"+id, data, getAuthHeader())
}