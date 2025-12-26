import mongoose from 'mongoose';

const dentalChartSchema = new mongoose.Schema({
  seriousDisease: String,
  dentalConditions: [String],
  mentalHealthIssues: [String],
  allergies: String,
  medications: String,
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient', // Assuming you have a Patient model
    required: true,
  },
});

const DentalChart = mongoose.model('DentalChart', dentalChartSchema);

export { DentalChart }; // Correct export
