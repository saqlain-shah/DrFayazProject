import Patient from '../../models/PatientModel/patient.js';
import mongoose from 'mongoose';


export const createPatient = async (req, res) => {
    try {
        // Extracting necessary fields from the request body
        const { firstName, email, phone, gender, dateOfBirth, emergencyContact, address, bloodGroup } = req.body;

        // Check if all required fields are present
        if (!firstName || !email || !phone || !gender || !dateOfBirth || !emergencyContact || !address || !bloodGroup) {
            return res.status(400).json({ message: "Please provide all necessary fields" });
        }

        // Get profile picture from the request file (assuming multer is used for file upload)
        const profilePicture = req.file;

        // Create the patient object
        const patient = new Patient({
            fullName: firstName,
            email,
            phone,
            gender,
            dateOfBirth,
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

// Existing imports and code...

export const getAllPatients = async (req, res, next) => {
    try {
        const { search, gender, sortBy } = req.query;
        let patients = [];
        let query = {};

        if (search) {
            query.fullName = { $regex: search, $options: 'i' };
        }

        if (gender && gender !== 'All') { // Only filter if gender is selected and not 'All'
            const genderMap = {
                male: 'Male',
                female: 'Female',
            };
            query.gender = genderMap[gender];
        }

        let sortOption = {};
        if (sortBy === 'new') {
            sortOption = { createdAt: -1 };
        } else if (sortBy === 'old') {
            sortOption = { createdAt: 1 };
        }

        patients = await Patient.find(query).sort(sortOption);
        res.status(200).json(patients);
    } catch (err) {
        next(err);
    }
};

// Other controllers...




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


export default Patient;
