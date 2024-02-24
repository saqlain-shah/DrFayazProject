import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// HealthInfo Schema
const HealthInfoSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    complaint: {
        type: String,
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    treatment: {
        type: [String], // Assuming treatment is an array of strings
        required: true
    },
    vitalSigns: {
        type: String, // You can adjust this according to your data structure for vital signs
        required: true
    },
    prescription: {
        type: String,
        required: true
    },
    medicine: [{
        type: Schema.Types.ObjectId,
        ref: 'Medicine'
    }],
    dosage: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    // Add more fields as needed
}, { timestamps: true }); // Add timestamps option here

const HealthInfo = mongoose.model('HealthInfo', HealthInfoSchema);
export default HealthInfo;
