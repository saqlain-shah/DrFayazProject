import { DentalChart } from '../models/DentalChart.js';
import mongoose from 'mongoose';

export const create = async (req, res) => {
  try {
    const {  seriousDisease, dentalConditions, mentalHealthIssues, allergies, medications } = req.body;
    const dentalChart = new DentalChart({
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

export const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const dentalChart = await DentalChart.findById(id);
    if (!dentalChart) {
      return res.status(404).json({ message: 'Dental chart not found' });
    }
    res.status(200).json(dentalChart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
