import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// Patient Schema
const PatientSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true
    },
    emergencyContact: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    medicalRecords: [{
        type: Schema.Types.ObjectId,
        ref: 'HealthInfo'
    }],
    appointments: [{
        type: Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    invoices: [{
        type: Schema.Types.ObjectId,
        ref: 'Invoice'
    }],
    payments: [{
        type: Schema.Types.ObjectId,
        ref: 'Payment'
    }],
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'Image'
    }],
    mentalHealth: {
        type: Schema.Types.ObjectId,
        ref: 'MentalHealth'
    }
}, { timestamps: true }); // Add timestamps option here

const Patient = mongoose.model('Patient', PatientSchema);
export default Patient;
