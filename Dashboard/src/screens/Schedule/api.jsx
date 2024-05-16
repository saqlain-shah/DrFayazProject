import axios from 'axios';

export const fetchAppointmentData = async () => {
    try {
        const response = await axios.get('http://localhost:8800/api/appointments');
        return response.data; // Assuming the response contains appointment data in an array format
    } catch (error) {
        console.error('Error fetching appointment data:', error);
        throw error;
    }
};
