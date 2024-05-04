import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    fullName: {
        type: String,
        
    },

    phone: {
        type: String,
       
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
      
    },

    profileImage: {
        type: String,
    },
}, { timestamps: true }); // Add timestamps option

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
