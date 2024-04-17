import mongoose from 'mongoose';

// Define schema for Web
const WebSchema = new mongoose.Schema({
  // Define your Web schema here
  patientInfo: { type: mongoose.Schema.Types.Mixed, required: true },
  selectedSlot: { type: mongoose.Schema.Types.Mixed, required: true },
  selectedService: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create Web model
const Web = mongoose.model('Web', WebSchema);

export default Web;
