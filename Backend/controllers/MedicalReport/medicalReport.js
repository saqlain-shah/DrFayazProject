import MedicalRecord from '../../models/MedicalReport/medicalReportModel.js'

// Controller functions for CRUD operations

// Create a new medical record
export const createMedicalRecord = async (req, res) => {
    try {
        const { complaints, diagnosis, treatment, vitalSigns, doctor } = req.body;

        // Assuming 'doctor' contains the ID of the selected doctor
        const doctorInfo = await Doctor.findById(doctor);
        if (!doctorInfo) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const medicalRecord = new MedicalRecord({
            complaints,
            diagnosis,
            treatment,
            vitalSigns,
            doctor: doctorInfo // Saving doctor information as a reference
        });

        await medicalRecord.save();
        res.status(201).json({ message: 'Medical record created successfully', data: medicalRecord });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create medical record', error: error.message });
    }
};


// Get all medical records
export const getAllMedicalRecords = async (req, res) => {
    try {
        const medicalRecords = await MedicalRecord.find();
        res.status(200).json({ data: medicalRecords });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch medical records', error: error.message });
    }
};

// Get a single medical record by ID
export const getMedicalRecordById = async (req, res) => {
    try {
        const medicalRecord = await MedicalRecord.findById(req.params.id);
        if (!medicalRecord) {
            return res.status(404).json({ message: 'Medical record not found' });
        }
        res.status(200).json({ data: medicalRecord });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch medical record', error: error.message });
    }
};

// Update a medical record by ID
export const updateMedicalRecord = async (req, res) => {
    try {
        const medicalRecord = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!medicalRecord) {
            return res.status(404).json({ message: 'Medical record not found' });
        }
        res.status(200).json({ message: 'Medical record updated successfully', data: medicalRecord });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update medical record', error: error.message });
    }
};

// Delete a medical record by ID
export const deleteMedicalRecord = async (req, res) => {
    try {
        const medicalRecord = await MedicalRecord.findByIdAndDelete(req.params.id);
        if (!medicalRecord) {
            return res.status(404).json({ message: 'Medical record not found' });
        }
        res.status(200).json({ message: 'Medical record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete medical record', error: error.message });
    }
};
