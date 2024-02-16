import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
    recordDate: { type: Date, required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    data: [
        {
            title: { type: String, required: true },
            value: { type: String, required: true }
        }
    ],
    vitalSigns: [{
        temperature: { type: Number },
        bloodPressure: { type: String },
        heartRate: { type: Number }
    }],
    // This should be an array of objects, not strings
    prescriptions: [
        {
            medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
            dosage: { type: String, required: true }
        }
    ],
    attachments: [{ type: String }],
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

export default MedicalRecord;
