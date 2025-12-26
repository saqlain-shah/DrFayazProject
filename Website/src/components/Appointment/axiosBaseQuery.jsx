import axios from 'axios';
import BASE_URL from '../../baseUrl';

const axiosBaseQuery = axios.create({
    baseURL: `${BASE_URL}/api/v1`,
});

export default axiosBaseQuery;

