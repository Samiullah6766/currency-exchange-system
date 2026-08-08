import axios from "axios";
import { data } from "react-router-dom";


const REST_API_BASE_URL =
  `${import.meta.env.VITE_API_URL}/wallet`;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

           

export const createWallet = (wallet) =>{
    return axios.post(REST_API_BASE_URL+"/createwallet", wallet, getAuthHeader())
}

export const getWallet = () => {
    return axios.get(REST_API_BASE_URL+"/getwallet", getAuthHeader())
}

// export const deleteWallet = (data) => {
//     return axios.delete(
//         REST_API_BASE_URL + "/deletewallet",
//         {
//             ...getAuthHeader(),
//             data: data,
//         }
//     );
// };
export const updateWallet = (request) => {
    return axios.put(REST_API_BASE_URL + "/updateWallet",request,
        getAuthHeader()
    );
}
export const walletTransaction = (data) => {
    return axios.post(REST_API_BASE_URL+"/transaction", data, getAuthHeader())
}
export const getAllWalletTransactions = () => {
    return axios.get(REST_API_BASE_URL+"/getWalletTransactions", getAuthHeader())
}

export const authenticateUser = (request) => {
    return axios.post(REST_API_BASE_URL+"/validateUser", request, getAuthHeader())
}