import mongoose from 'mongoose';

const healthInformationSchema = new mongoose.Schema({
    bloodType: String,
    weight: String,
    height: String,
    allergies: String,
    habits: String,
    medicalHistory: String
});

const HealthInformation = mongoose.model('HealthInformation', healthInformationSchema);

export default HealthInformation;
