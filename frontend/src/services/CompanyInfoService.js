import axios from "axios";


const REST_API_BASE_URL =
  `${import.meta.env.VITE_API_URL}/companyInfo`;


export const isInitialized = () => {
    return axios.get(
        REST_API_BASE_URL + "/isInitialized"
    );
};

const getAuthHeader = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};


export const saveInfo = (formData) => {
    return axios.post(
        REST_API_BASE_URL + "/saveInfo",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
};


export const getCompanyInfo = () => {
    return axios.get(
        REST_API_BASE_URL + "/getCompanyInfo",
        getAuthHeader()
    );
};

export const updateCompanyInfo = (data) => {
    return axios.put(REST_API_BASE_URL+"/updateCompanyInfo", data, getAuthHeader())
}