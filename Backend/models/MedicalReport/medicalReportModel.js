import mongoose from 'mongoose';

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
        type: [{
            name: String, // Name of the treatment
            checked: Boolean // Whether the treatment is checked or not
        }],
        required: true
    },
    vitalSigns: {
        type: [String]
    },
    // prescription: {
    //     medicines: [{
    //         name: { type: String, required: true },
    //         quantity: { type: Number, required: true },
    //         dosage: { type: String, required: true }
    //     }],
    //     instructions: {
    //         type: String
    //     }
    // },
    // attachments: {
    //     type: [String] // Array of attachment URLs
    // }
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

export default MedicalRecord;
