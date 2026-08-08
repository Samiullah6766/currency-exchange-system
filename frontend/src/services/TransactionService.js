import axios from "axios";


const REST_API_BASE_URL =
  `${import.meta.env.VITE_API_URL}/customers`;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const AddTransaction = (transaction) => {
    return axios.post(REST_API_BASE_URL+"/transaction", transaction, getAuthHeader());
}

export const getAllTransactions = () => {
    return axios.get(REST_API_BASE_URL+"/getAllTransactions", getAuthHeader());
}

export const getAllCustomerTransactions = (id) =>{
    return axios.get(REST_API_BASE_URL+"/customerTransactions/"+id, getAuthHeader());
}

export const getCustomerSummery = (id) =>{
    return axios.get(REST_API_BASE_URL+"/transactionSummery/"+id, getAuthHeader());
}

export const updateTransaction = (id, transaction) =>{
    return axios.put(REST_API_BASE_URL+"/update-transaction/"+id, transaction, getAuthHeader());
}

export const getTransaction = (id) => {
    return axios.get(REST_API_BASE_URL+"/transaction/"+id, getAuthHeader())
}

export const deleteTransaction = (id) => {
    return axios.delete(REST_API_BASE_URL+"/delete-transaction/"+id, getAuthHeader());
}

export const numOfTransactions = () => axios.get(REST_API_BASE_URL+"/numtransactions", getAuthHeader());
export const getAllBorrowed = () => axios.get(REST_API_BASE_URL+"/allBorrowed", getAuthHeader());
