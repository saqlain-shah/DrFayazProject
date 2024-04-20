import mongoose from 'mongoose';

// Define schema for Web
const WebPatientSchema = new mongoose.Schema({
  // Define your Web schema here
  patientInfo: {
    name: { type: String, required: true },
    gender: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  selectedSlot: { type: mongoose.Schema.Types.Mixed, required: true },
  selectedService: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create Web model
const WebPatient = mongoose.model('WebPatient', WebPatientSchema);

export default WebPatient;
