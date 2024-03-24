// api/patients.js

export const fetchTotalPatientCount = async () => {
    try {
        // Get token from local storage
        const token = localStorage.getItem('token');

        // Fetch total patient count with token included in the request header
        const response = await fetch('http://localhost:8800/api/patients/total-count', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Check if the response is okay
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        // Parse the JSON response and return the total patient count
        const data = await response.json();
        const totalPatients = data.totalCount;

        // Calculate totalPatientsPercentage
        const totalPatientsTarget = 100;
        const totalPatientsPercentage = ((totalPatients / totalPatientsTarget) * 100).toFixed(2);

        return {
            totalCount: totalPatients,
            percentage: totalPatientsPercentage
        };
    } catch (error) {
        // Throw error if there's any issue
        throw new Error('Error fetching total patient count:', error);
    }
};
