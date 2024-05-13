import mongoose from 'mongoose';

const dentalChartSchema = new mongoose.Schema({
  seriousDisease: String,
  dentalConditions: [String],
  mentalHealthIssues: [String],
  allergies: String,
  medications: String
});

const DentalChart = mongoose.model('DentalChart', dentalChartSchema);

export { DentalChart }; // Correct export
