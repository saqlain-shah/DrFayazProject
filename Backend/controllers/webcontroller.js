import WebPatient from '../models/webModels.js'
import mongoose from 'mongoose';

export const createWeb = async (req, res) => {
  const { id } = req.params; // Get the ID from the route parameters
  const { name, email, emergencyContact, reasonForVisit, gender, address, bloodGroup, endDateTime, startDateTime, serviceName, price } = req.body;
  let patientInfo = { name, email, emergencyContact, reasonForVisit, gender, address, bloodGroup }
  const selectedSlot = { endDateTime, startDateTime }
  const selectedService = { serviceName, price }
  const files = req.files;
  try {
    if (!files || files.length === 0) {
      return res.status(400).send('file upload failed')
    }
    else {
      const images = files.map(file => file.path)
      patientInfo = { ...patientInfo, attachment: images }
    }
    const Web = await WebPatient.create({ id: id, patientInfo: patientInfo, selectedSlot: selectedSlot, selectedService: selectedService });
    res.status(201).json(Web);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllWebs = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the route parameters
    const Webs = await WebPatient.find({ id: id }); // Change this line

    res.status(200).json(Webs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getWebById = async (req, res) => {
  try {
    const { id } = req.params; 
    console.log("Fetching web with ID:", id); // Log the id here
    const web = await WebPatient.findById(id);
    console.log('Web found by ID:', web);
    if (!web) {
      return res.status(404).json({ message: 'Web not found' });
    }
    res.status(200).json(web);
  } catch (error) {
    console.error('Error fetching Web by id:', error); // Log the error here
    res.status(500).json({ message: 'Server Error' });
  }
};


export const updateWeb = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Params:', req.params);
    const { status, method } = req.body;
    console.log('Received request to update web with ID:', id);

    const updatedWeb = await WebPatient.findByIdAndUpdate(id, { status, method }, { new: true });

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
    const totalCount = await WebPatient.countDocuments();
    const targetCount = 100;
    const percentage = (totalCount / targetCount) * 100;
    console.log('Total web patient count:', totalCount);
    console.log('Percentage:', percentage);
    res.status(200).json({ totalCount, percentage });
  } catch (error) {
    console.error('Error counting web patients:', error);
    res.status(500).json({ message: 'Error counting web patients', error: error.message });
  }
};

export const getTodayWebAppointments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAppointments = await WebPatient.find({
      createdAt: { $gte: today },
    });
    res.status(200).json(todayAppointments);
  } catch (error) {
    console.error('Error fetching today\'s web appointments:', error);
    res.status(500).json({ message: 'Error fetching today\'s web appointments', error: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await WebPatient.find();
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await WebPatient.updateMany({}, { status: 'Read' });
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark all notifications as read' });
  }
};
