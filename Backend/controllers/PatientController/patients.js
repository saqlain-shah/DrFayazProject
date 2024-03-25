import Patient from '../../models/PatientModel/patient.js';
import mongoose from 'mongoose';
import MedicalRecord from '../../models/MedicalReport/medicalReportModel.js';

export const createPatient = async (req, res) => {
    try {
        // Extracting necessary fields from the request body
        const { firstName, email, gender, emergencyContact, address, bloodGroup } = req.body;

        // Check if all required fields are present
        if (!firstName || !email || !gender || !emergencyContact || !address || !bloodGroup) {
            return res.status(400).json({ message: "Please provide all necessary fields" });
        }

        // Get profile picture from the request file (assuming multer is used for file upload)
        const profilePicture = req.file;

        // Create the patient object
        const patient = new Patient({
            fullName: firstName,
            email,

            gender,

            emergencyContact,
            address,
            bloodGroup,
            profilePicture: profilePicture ? profilePicture.path : null // Assign profile picture path if available
        });

        // Save the patient to the database
        await patient.save();

        // Respond with the created patient object
        res.status(201).json(patient);
    } catch (error) {
        // If an error occurs, return an error response
        res.status(400).json({ message: error.message });
    }
};

export const getAllPatients = async (req, res, next) => {
    try {
        const { search, gender, startDate } = req.query;
        let patients = [];
        let query = {};

        if (search) {
            query.fullName = { $regex: search, $options: 'i' };
        }

        // Modify the query to include gender filter
        if (gender && gender !== 'all') { // Check if gender is provided and not 'all'
            let genderValue = gender.toLowerCase(); // Convert to lowercase for consistency
            // If the selected gender is 'male', directly set the query field to 'Male'
            // Otherwise, use a case-insensitive regular expression to match any case of the provided gender value
            query.gender = (genderValue === 'male') ? 'Male' : { $regex: new RegExp(genderValue, 'i') };
        }

        if (startDate) {
            const selectedDate = new Date(startDate);
            selectedDate.setHours(0, 0, 0, 0);
            const nextDay = new Date(selectedDate);
            nextDay.setDate(nextDay.getDate() + 1);
            query.createdAt = { $gte: selectedDate, $lt: nextDay };
        }

        console.log('Generated MongoDB query:', query); // Add this line to log the query

        patients = await Patient.find(query);
        res.status(200).json(patients);
    } catch (err) {
        next(err);
    }
};
export const getMedicalRecordsByPatientId = async (req, res) => {
    try {
        const patientId = req.params.id;
        const medicalRecords = await MedicalRecord.find({ patientId });
        res.status(200).json({ data: medicalRecords });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch medical records for the patient', error: error.message });
    }
};

// Controller to get a patient by ID
export const getPatientById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if the ID is valid ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid patient ID' });
        }

        const patient = await Patient.findById(id);

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (err) {
        next(err);
    }
};
export const getTotalPatientCount = async (req, res) => {
    try {
        const totalCount = await Patient.countDocuments();
        res.json({ totalCount });
    } catch (err) {
        console.error('Error getting total patient count:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const fetchRecentPatients = async (req, res) => {
    try {
        // Fetch patients sorted by creation timestamp in descending order (most recent first)
        const recentPatients = await Patient.find().sort({ createdAt: -1 }).limit(5); // Adjust limit according to your requirement
        res.status(200).json(recentPatients);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch recent patients', error: error.message });
    }
};
// Controller to update a patient by ID
export const updatePatient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedFields = req.body;
        const updatedPatient = await Patient.findByIdAndUpdate(id, updatedFields, { new: true });
        if (!updatedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json({ message: 'Patient updated successfully', patient: updatedPatient });
    } catch (err) {
        next(err);
    }
};

// Controller to delete a patient by ID
export const deletePatient = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if the ID is valid ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid patient ID' });
        }

        const deletedPatient = await Patient.findByIdAndDelete(id);
        if (!deletedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (err) {
        next(err);
    }
};

export const changePassword = async (req, res) => {
    const { id: patientId, oldPassword, newPassword } = req.body;

    try {
        // Find the patient by ID
        const patient = await Patient.findById(patientId);

        // Log the received patient ID
        console.log('Received patient ID:', patientId);

        // Check if the patient exists
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Check if the old password matches
        const isMatch = await bcrypt.compare(oldPassword, patient.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid old password' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the patient's password
        patient.password = hashedPassword;
        await patient.save();

        // Send a success response
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


export default Patient;
