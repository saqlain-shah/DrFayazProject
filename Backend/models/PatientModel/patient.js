import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    profileImage: { type: String }, // Assuming you'll store the URL/path to the image
    dateOfBirth: { type: Date },
    phone: { type: String },
    email: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    emergencyContact: {
        name: { type: String },
        phone: { type: String },
        relationship: { type: String }
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String }
    }
    // Add more fields as needed
});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
