// Inside webController.js

import Appointment from '../models/webModels.js';
import mongoose from 'mongoose';

export const createAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;
    const appointment = await Appointment.create(appointmentData);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getTotalAppointmentCount = async (req, res) => {
  try {
    const totalCount = await Appointment.countDocuments();
    console.log("totalCount", totalCount)
    res.json({ totalCount });
  } catch (error) {
    console.error('Error fetching total appointment count:', error);
    res.status(500).json({ error: 'Error fetching total appointment count' });
  }
};
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const updatedData = req.body;
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }
    const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, updatedData, { new: true });
    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }
    const deletedAppointment = await Appointment.findByIdAndRemove(appointmentId);
    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
