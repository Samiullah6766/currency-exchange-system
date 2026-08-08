import axios from 'axios';

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

export const CustomersList = () => {
    return axios.get(REST_API_BASE_URL, getAuthHeader());
}

export const AddNewCustomer = (customer) => {
    return axios.post(REST_API_BASE_URL + "/customerRegistration", customer, getAuthHeader());
}

export const updateCustomer = (customer, id) =>{
    return axios.put(REST_API_BASE_URL+"/"+id, customer, getAuthHeader())
} 

export const getCustomer = (id) => {
    return axios.get(REST_API_BASE_URL+"/"+id, getAuthHeader());
}

export const deleteCustomer = (id) => {
    return axios.delete(REST_API_BASE_URL+"/"+id, getAuthHeader())
}

export const getByCustomerName = (customerFirstName) => {
    return axios.get(`${REST_API_BASE_URL}/search?customerfirstName=${customerFirstName}`, getAuthHeader())
}

export const numberofCustomers = () => {
    return axios.get(REST_API_BASE_URL+"/numberofcustomers", getAuthHeader())
}