// Fetch total patient count
export const fetchTotalPatientCount = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://server-yvzt.onrender.com/api/patients/total-count', {
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
        const response = await fetch('https://server-yvzt.onrender.com/api/web/', {
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
        const response = await fetch('https://server-yvzt.onrender.com/api/patients/recent', {
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

export const fetchWebPatientCount = async () => {
    try {
        const token = localStorage.getItem('token');
        console.log('Fetching total web patient count...');
        console.log('Authorization token:', token); // Add this log statement
        const response = await fetch('https://server-yvzt.onrender.com/api/web/count', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        // Add these log statements to log request headers
        console.log('Request headers:', response.headers);
        console.log('Request body:', response.body);

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log('Data received:', data);
        return data;
    } catch (error) {
        console.error('Error fetching total web patient count:', error);
        throw new Error('Error fetching total web patient count:', error);
    }
};





// Fetch today's appointments
export const fetchTodayAppointments = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://server-yvzt.onrender.com/api/v1', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch today\'s appointments');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching today\'s appointments:', error);
    }
};

