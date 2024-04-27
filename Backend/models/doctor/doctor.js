import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },

    profileImage: {
        type: String,
    },
}, { timestamps: true }); // Add timestamps option

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
