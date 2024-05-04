import WebPatient from '../models/webModels.js'
import mongoose from 'mongoose';

// export const createWeb = async (req, res) => {
//   const WebData = req.body;
//   // const files = req.files;
//   // const images = files.map(file => file.path)
//   // console.log("data",WebData, images);
//   try {
//     const Web = await WebPatient.create(WebData );
//     res.status(201).json(Web);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const createWeb = async (req, res) => {

  const { name, email, emergencyContact, reasonForVisit, gender, address, bloodGroup, endDateTime, startDateTime, serviceName, image, price } = req.body;
  let patientInfo = { name, image, email, emergencyContact, reasonForVisit, gender, address, bloodGroup }
  const selectedSlot = { endDateTime, startDateTime }
  const selectedService = { serviceName, price }
  const files = req.files;
  // let images = []
  // console.log("files", files)
  // console.log("data", patientInfo, selectedSlot, selectedService, images);
  try {
    if (!files || files.length === 0) {
      return res.status(400).send('file upload failed')
    }
    else {
      const images = files.map(file => file.path)
      patientInfo = { ...patientInfo, attachment: images }
      console.log("patient", patientInfo)
    }
    const Web = await WebPatient.create({ patientInfo: patientInfo, selectedSlot: selectedSlot, selectedService: selectedService });
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
    const { id } = req.params;
    const web = await WebPatient.findById(id);
    if (!web) {
      console.log('Web not found for ID:', id);
      return res.status(404).json({ message: 'Web not found' });
    }
    console.log('Web found by ID:', web);
    res.status(200).json(web);
  } catch (error) {
    console.error('Error fetching Web by ID:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


export const updateWeb = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Params:', req.params);
    const { status, method } = req.body; // Extract updated status and method
    console.log('Received request to update web with ID:', id);

    // Update the web patient record with the new status and method
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
    const totalCount = await WebPatient.countDocuments();
    const targetCount = 100; // Update this with your target value
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



// webcontroller.js

// Controller method for fetching notifications
export const getNotifications = async (req, res) => {
  try {
    // Fetch notifications data from your database or any other source
    // For example, you can retrieve notifications from a MongoDB collection
    const notifications = await WebPatient.find();

    // Send the notifications data as a response
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    // Update all notifications to mark them as read
    await WebPatient.updateMany({}, { status: 'Read' });

    // Send a success response
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    // Handle errors
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark all notifications as read' });
  }
};