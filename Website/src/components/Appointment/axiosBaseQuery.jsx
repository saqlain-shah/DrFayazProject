import axios from 'axios';
import BASE_URL from '../../baseUrl';

const axiosBaseQuery = axios.create({
    baseURL: `${BASE_URL}/api/v1`, // Update the base URL to reflect your backend server's port and endpoint
});

export default axiosBaseQuery;

