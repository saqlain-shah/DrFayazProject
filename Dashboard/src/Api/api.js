// Fetch total patient count
import BASE_URL from '../baseUrl.jsx';

export const fetchTotalPatientCount = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/patients/total-count`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const totalPatients = data.totalCount;
        const totalPatientsTarget = 100;
        const totalPatientsPercentage = ((totalPatients / totalPatientsTarget) * 100).toFixed(2);
        return {
            totalCount: totalPatients,
            percentage: totalPatientsPercentage
        };
    } catch (error) {
        throw new Error('Error fetching total patient count:', error);
    }
};

export const fetchwebsitePatient = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/web/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch recent transactions');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching recent transactions:', error);
    }
};

// api.js

export const fetchRecentPatients = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/patients/recent`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch recent patients');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching recent patients:', error);
    }
};
export const fetchWebPatientTodayAppointments = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/web/today-appointments`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch today\'s web appointments');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching today\'s web appointments:', error);
    }
};
// api.js

export const fetchTotalWebPatientCount = async () => {
    try {
        const token = localStorage.getItem('token');
        console.log('Fetching total web patient count...');
        const response = await fetch(`${BASE_URL}/api/web/total-count`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch total web patient count');
        }
        const data = await response.json();
        console.log('Total web patient count data:', data);
        const totalCount = data.totalCount;
        const percentage = data.percentage;
        console.log('Total Count:', totalCount);
        console.log('Percentage:', percentage);
        return { totalCount, percentage };
    } catch (error) {
        console.error('Error fetching total web patient count:', error);
        throw new Error('Error fetching total web patient count:', error);
    }
};



export const fetchTotalEarnings = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/web/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch web patients');
        }
        const data = await response.json();
        // Calculate total earnings by summing up the prices of all services
        const totalEarnings = data.reduce((total, patient) => {
            return total + parseFloat(patient.selectedService.price);
        }, 0);

        // Assuming totalEarningsTarget is a fixed value
        const totalEarningsTarget = 10000; // Update this with your target value

        // Calculate the percentage
        const percent = (totalEarnings / totalEarningsTarget) * 100;

        return { totalEarnings, percent };
    } catch (error) {
        throw new Error('Error fetching total earnings:', error);
    }
};






