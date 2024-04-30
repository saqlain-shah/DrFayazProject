import MedicalRecord from '../../models/MedicalReport/medicalReportModel.js';
import multer from 'multer';
import { upload } from '../../utils/multerConfig.js';

const uploadMiddleware = upload.array('attachments', 5);

export const createMedicalRecord = async (req, res) => {
    try {
        uploadMiddleware(req, res, async function (err) {
            if (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(500).json({ message: 'Failed to upload files', error: err.message });
                } else {
                    return res.status(500).json({ message: 'Unknown error occurred', error: err.message });
                }
            }
            console.log('Request Body:', req.body);
            console.log('Request Files:', req.files)
            const { complaints, diagnosis, treatment, vitalSigns } = req.body;

            const parsedTreatment = JSON.parse(treatment);
            const attachments = req.files ? req.files.map(file => file.filename) : [];
            const medicalRecord = new MedicalRecord({
                complaints,
                diagnosis,
                treatment: parsedTreatment,
                vitalSigns,
                attachments
            });

            await medicalRecord.save();
            const responseData = {
                message: 'Medical record created successfully',
                data: { ...medicalRecord.toObject(), attachments }
            };

            res.status(201).json(responseData);
        });
    } catch (error) {
        console.error('Validation Error:', error.message);
        res.status(500).json({ message: 'Failed to create medical record', error: error.message });
    }
};


export const getAllMedicalRecords = async (req, res) => {
    try {
        const medicalRecords = await MedicalRecord.find();
        res.status(200).json({ data: medicalRecords });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch medical records', error: error.message });
    }
};

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

export const getMedicalRecordsByPatientId = async (req, res) => {
    try {
        const patientId = req.params.id;
        const medicalRecords = await MedicalRecord.find({ patient: patientId });
        res.status(200).json({ success: true, data: medicalRecords });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

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
