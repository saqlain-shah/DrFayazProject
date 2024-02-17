import mongoose from 'mongoose';

const healthInfoSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    bloodType: { type: String },
    allergies: [{ type: String }],
    medications: [{ type: String }],
    medicalConditions: [{ type: String }],
    surgeries: [{ type: String }],
});

const HealthInfo = mongoose.model('HealthInfo', healthInfoSchema);

export default HealthInfo;
