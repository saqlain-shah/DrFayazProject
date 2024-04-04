// Fetch total patient count
export const fetchTotalPatientCount = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://drfayazproject.onrender.com/api/patients/total-count', {
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

// Fetch total appointment count
export const fetchTotalAppointmentCount = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://drfayazproject.onrender.com/api/appointments/total-count', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const totalAppointments = data.totalCount;
        const totalAppointmentsTarget = 100;
        const totalAppointmentsPercentage = ((totalAppointments / totalAppointmentsTarget) * 100).toFixed(2);
        return {
            totalCount: totalAppointments,
            percentage: totalAppointmentsPercentage
        };
    } catch (error) {
        throw new Error('Error fetching total appointment count:', error);
    }
};

// api.js

export const fetchRecentPatients = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://drfayazproject.onrender.com/api/patients/recent', {
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

// api.js

// Fetch today's appointments
export const fetchTodayAppointments = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://drfayazproject.onrender.com/api/v1', {
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

