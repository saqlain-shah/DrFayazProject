import Appointment from '../models/webModels.js';

// Controller functions
export const createAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;
    const appointment = await Appointment.create(appointmentData);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
    try {
      // Extract the appointment ID from the request parameters
      const appointmentId = req.params.id;
      
      // Fetch the appointment from the database based on the ID
      const appointment = await Appointment.findById(appointmentId);
      
      // Check if the appointment exists
      if (!appointment) {
        // If the appointment does not exist, return a 404 Not Found response
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      // If the appointment exists, return it as a JSON response
      res.status(200).json(appointment);
    } catch (error) {
      // If an error occurs, return a 500 Internal Server Error response
      res.status(500).json({ message: error.message });
    }
  };
