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
    console.log('Requested Web ID:', WebId); // Add logging statement to log the requested Web ID

    if (!mongoose.Types.ObjectId.isValid(WebId)) {
      console.log('Invalid Web ID format:', WebId); // Log if the Web ID format is invalid
      return res.status(400).json({ message: 'Invalid Web ID' });
    }

    const Web = await WebPatient.findById(WebId);
    if (!Web) {
      console.log('Web not found for ID:', WebId); // Log if the Web with the given ID is not found
      return res.status(404).json({ message: 'Web not found' });
    }

    // Counting logic
    const count = await WebPatient.countDocuments();

    res.status(200).json({ Web, count });
  } catch (error) {
    console.error('Error fetching Web by ID:', error); // Log any error that occurs during the process
    res.status(500).json({ message: 'Error fetching Web by ID', error: error.message });
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

export const getTotalWebCount = async (req, res) => {
  try {
    // Count the total number of documents in the WebPatient collection
    const totalCount = await WebPatient.countDocuments();

    // Log the total count to the console
    console.log("Total count of web patients:", totalCount);

    // Send the total count as JSON response
    res.json({ totalCount });
  } catch (error) {
    // If an error occurs, log the error and send a 500 status code with an error message
    console.error('Error fetching total web patient count:', error);
    res.status(500).json({ error: 'Error fetching total web patient count' });
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

