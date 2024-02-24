import mongoose from 'mongoose'

const medicalRecordSchema = new mongoose.Schema({
    complaints: {
        type: [String],
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    treatment: {
        type: [String], // Changed to an array of strings
        required: true
    },
    vitalSigns: {
        type: [String] // You can define a separate schema for vital signs if necessary
    },
    prescription: {
        medicines: [{
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            dosage: { type: String, required: true }
        }],
        instructions: {
            type: String
        }
    }
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

export default MedicalRecord;
