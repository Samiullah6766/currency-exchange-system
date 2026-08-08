import axios from "axios";



const REST_API_BASE_URL =
  `${import.meta.env.VITE_API_URL}/exchangetransaction`;
const getAuthHeader = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const createExchangeTransaction = (data) => {
    return axios.post(REST_API_BASE_URL+"/createtransaction", data, getAuthHeader())
}

export const getExchangeTransactions = () => {
    return axios.get(REST_API_BASE_URL+"/getAllExchangeTransactions", getAuthHeader())
}
export const getNumberOfExchangeTransactions = () => {
    return axios.get(REST_API_BASE_URL+"/numberOfExchangeTransactions", getAuthHeader())
}
export const getInterest = (data) => {
    return axios.post(REST_API_BASE_URL+"/getMonthInterest", data, getAuthHeader())
}

export const customerExchanges = (id) => {
    return axios.get(REST_API_BASE_URL+"/customerExchanges/"+id, getAuthHeader())
}
export const todayInterest = () => {
    return axios.get(REST_API_BASE_URL+"/todayInterest", getAuthHeader())
}

