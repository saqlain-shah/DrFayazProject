import MedicalRecord from '../../models/MedicalReport/medicalReportModel.js';

// Controller to create a new medical record
export const createMedicalRecord = async (req, res, next) => {
    try {
        const { recordDate, patientId, data, vitalSigns, prescriptions, attachments, invoiceId } = req.body;
        const newMedicalRecord = new MedicalRecord({ recordDate, patientId, data, vitalSigns, prescriptions, attachments, invoiceId });
        const savedMedicalRecord = await newMedicalRecord.save();
        res.status(201).json({ message: 'Medical record created successfully', medicalRecord: savedMedicalRecord });
    } catch (error) {
        next(error);
    }
};

// Controller to get all medical records
export const getAllMedicalRecords = async (req, res, next) => {
    try {
        const medicalRecords = await MedicalRecord.find();
        res.status(200).json(medicalRecords);
    } catch (error) {
        next(error);
    }
};

// Controller to get a medical record by ID
export const getMedicalRecordById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const medicalRecord = await MedicalRecord.findById(id);
        if (!medicalRecord) {
            return res.status(404).json({ message: 'Medical record not found' });
        }
        res.status(200).json(medicalRecord);
    } catch (error) {
        next(error);
    }
};

// Controller to update a medical record by ID
export const updateMedicalRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedFields = req.body;
        const updatedMedicalRecord = await MedicalRecord.findByIdAndUpdate(id, updatedFields, { new: true });
        if (!updatedMedicalRecord) {
            return res.status(404).json({ message: 'Medical record not found' });
        }
        res.status(200).json({ message: 'Medical record updated successfully', medicalRecord: updatedMedicalRecord });
    } catch (error) {
        next(error);
    }
};

// Controller to delete a medical record by ID
export const deleteMedicalRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedMedicalRecord = await MedicalRecord.findByIdAndDelete(id);
        if (!deletedMedicalRecord) {
            return res.status(404).json({ message: 'Medical record not found' });
        }
        res.status(200).json({ message: 'Medical record deleted successfully' });
    } catch (error) {
        next(error);
    }
};
