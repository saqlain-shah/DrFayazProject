import WebPatient from '../models/webModels.js'
import mongoose from 'mongoose';

export const createWeb = async (req, res) => {
  try {
    const WebData = req.body;
    const Web = await WebPatient.create(WebData);
    res.status(201).json(Web);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTotalWebCount = async (req, res) => {
  try {
    const totalCount = await WebPatient.countDocuments();
    console.log("totalCount", totalCount)
    res.json({ totalCount });
  } catch (error) {
    console.error('Error fetching total Web count:', error);
    res.status(500).json({ error: 'Error fetching total Web count' });
  }
};

export const getAllWebs = async (req, res) => {
  try {
    const Webs = await WebPatient.find();
    res.status(200).json(Webs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWebById = async (req, res) => {
  try {
    const WebId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(WebId)) {
      return res.status(400).json({ message: 'Invalid Web ID' });
    }
    const Web = await WebPatient.findById(WebId);
    if (!Web) {
      return res.status(404).json({ message: 'Web not found' });
    }
    res.status(200).json(Web);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateWeb = async (req, res) => {
  try {
    const WebId = req.params.id;
    const updatedData = req.body;
    if (!mongoose.Types.ObjectId.isValid(WebId)) {
      return res.status(400).json({ message: 'Invalid Web ID' });
    }
    const updatedWeb = await WebPatient.findByIdAndUpdate(WebId, updatedData, { new: true });
    if (!updatedWeb) {
      return res.status(404).json({ message: 'Web not found' });
    }
    res.status(200).json(updatedWeb);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteWeb = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the web patient by ID and delete it
    await WebPatient.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Web patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting web patient:', error);
    res.status(500).json({ success: false, message: 'Failed to delete web patient' });
  }
};

