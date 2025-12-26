import axios from 'axios';
import BASE_URL from '../../baseUrl.jsx';

export const fetchAppointmentData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/appointments`);
        return response.data;
    } catch (error) {
        console.error('Error fetching appointment data:', error);
        throw error;
    }
};
