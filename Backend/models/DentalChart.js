import mongoose from 'mongoose';

const dentalChartSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  seriousDisease: String,
  dentalConditions: [String],
  mentalHealthIssues: [String],
  allergies: String,
  medications: String
});

const DentalChart = mongoose.model('DentalChart', dentalChartSchema);

export default DentalChart;
