import axios from 'axios';

const axiosBaseQuery = axios.create({
    baseURL: 'http://localhost:8800/api/v1', // Update the base URL to reflect your backend server's port and endpoint
});

export default axiosBaseQuery;

