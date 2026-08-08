import axios from "axios";


const REST_API_BASE_URL =
  `${import.meta.env.VITE_API_URL}/ownerExchangeTransaction`;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};


export const ownerExchangeTransaction = (data) => {
    return axios.post(REST_API_BASE_URL+"/createOwnerExchangeTransaction", data, getAuthHeader())
}

export const ownerTransactions = () => {
    return axios.get(REST_API_BASE_URL+"/ownerTransactions", getAuthHeader())
}