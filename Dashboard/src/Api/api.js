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
export const fetchWebPatientTodayAppointments = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://server-yvzt.onrender.com/api/web/today-appointments', {
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
        const response = await fetch('https://server-yvzt.onrender.com/api/web/total-count', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch total web patient count');
        }
        const data = await response.json();
        console.log('Total web patient count data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching total web patient count:', error);
        throw new Error('Error fetching total web patient count:', error);
    }
};




