import axios from 'axios';

export const fetchMedicalRecords = async (id, setMedicalRecords, toast) => {
    try {
        const token = localStorage.getItem('token');
        console.log('Fetching medical records for patient ID:', id);
        const response = await axios.get(`https://drfayazproject.onrender.com/api/medical-records/preview/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Response from medical records API:', response.data);
        setMedicalRecords(response.data.data.map(record => ({
            ...record,
            treatment: record.treatment.map(t => t.name)
        })));
    } catch (error) {
        console.error('Error fetching medical records:', error);
        toast.error('Failed to fetch medical records');
    }
};
