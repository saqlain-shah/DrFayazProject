// api.js
import Patient from '../../models/PatientModel/patient.js';

// Log the imported Patient model
console.log('Imported Patient model:', Patient);

export const getTotalPatientsCountFromMongoDB = async () => {
    try {
        console.log('Fetching total patients count...');
        const patients = await Patient.find({});
        const count = patients.length;
        console.log('Total patients count:', count);
        return count;
    } catch (error) {
        console.error('Error fetching total patients count:', error.message);
        throw new Error(`Error fetching total patients count: ${error.message}`);
    }
};
