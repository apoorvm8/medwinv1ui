import axios from 'axios';

// This instance attaches the token for all the apis and also the base url
export const authInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

// This is a guest instance without token but with a defined base url
export const guestInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

authInstance.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('token');
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);
