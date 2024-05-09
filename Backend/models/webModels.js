import mongoose, { Schema } from 'mongoose';

// Define schema for Web
const WebPatientSchema = new mongoose.Schema({
  // Define your Web schema here
  patientInfo: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    attachment: { type: Array },
    image: { type: String },
    createdAt: { type: Date, default: Date.now }
  },
  medicalRecords: [{
    type: Schema.Types.ObjectId,
    ref: 'HealthInfo'
  }],
  selectedSlot: { type: mongoose.Schema.Types.Mixed, required: true },
  selectedService: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Approved', 'Cancelled'], default: 'Pending' },
  method: { type: String, enum: ['Online', 'Cash'], default: 'Online' },
  message: { type: String }
});

// Create Web model
const WebPatient = mongoose.model('WebPatient', WebPatientSchema);

export default WebPatient;
