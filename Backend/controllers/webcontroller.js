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
    const { id } = req.params; // Extract the ID from the request parameters
    const web = await WebPatient.findById(id); // Assuming you are using Mongoose or similar for database operations
    if (!web) {
      return res.status(404).json({ message: 'Web not found' });
    }
    res.status(200).json(web);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
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


export const getTotalWebPatientCount = async (req, res) => {
  try {
    console.log('Received request for total web patient count');
    const count = await WebPatient.countDocuments();
    console.log('Total web patient count:', count);
    res.status(200).json({ totalCount: count });
  } catch (error) {
    console.error('Error counting web patients:', error);
    res.status(500).json({ message: 'Error counting web patients', error: error.message });
  }
};
export const getTodayWebAppointments = async (req, res) => {
  try {
    // Get today's date
    const today = new Date();
    // Set the time to the beginning of the day (midnight)
    today.setHours(0, 0, 0, 0);
    // Create a query to find appointments of web patients for today
    const todayAppointments = await WebPatient.find({
      createdAt: { $gte: today }, // Find appointments created after or at the beginning of today
    });
    // Send the found appointments as a response
    res.status(200).json(todayAppointments);
  } catch (error) {
    // Handle errors
    console.error('Error fetching today\'s web appointments:', error);
    res.status(500).json({ message: 'Error fetching today\'s web appointments', error: error.message });
  }
};






