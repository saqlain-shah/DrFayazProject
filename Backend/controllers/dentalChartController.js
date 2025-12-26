import { DentalChart } from '../models/DentalChart.js';
import mongoose from 'mongoose';

export const create = async (req, res) => {
  try {
    const { patientId, seriousDisease, dentalConditions, mentalHealthIssues, allergies, medications } = req.body;

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const dentalChart = new DentalChart({
      patientId, // Store the patient ID
      seriousDisease,
      dentalConditions,
      mentalHealthIssues,
      allergies,
      medications
    });

    const savedChart = await dentalChart.save();
    res.status(201).json(savedChart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const remove = async (req, res) => {
  const { id } = req.params;
  try {
    await DentalChart.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Dental chart data deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const list = async (req, res) => {
  try {
    const dentalCharts = await DentalChart.find();
    res.status(200).json(dentalCharts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;

    console.log("Received patientId:", patientId); // Debugging log

    // Find the records using `patientId` (not `_id`)
    const dentalCharts = await DentalChart.find({ patientId });

    console.log("Fetched Dental Charts:", dentalCharts); // Debugging log

    res.status(200).json(dentalCharts);
  } catch (error) {
    console.error("Error fetching dental charts:", error);
    res.status(500).json({ message: error.message });
  }
};

