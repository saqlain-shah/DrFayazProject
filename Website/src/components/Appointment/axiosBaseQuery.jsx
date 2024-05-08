import axios from 'axios';

const axiosBaseQuery = axios.create({
    baseURL: 'https://server-yvzt.onrender.com /api/v1', // Update the base URL to reflect your backend server's port and endpoint
});

export default axiosBaseQuery;

