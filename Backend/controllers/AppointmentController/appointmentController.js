import Appointment from '../../models/Appointment/appoinmentModel.js'
import mongoose from 'mongoose';


export const createAppointment = async (req, res, next) => {
    try {
        const { patientId, patientName, purposeOfVisit, dateOfVisit, startTime, endTime, doctor, status, description, share } = req.body;

        if (!startTime || !endTime || !patientId || !purposeOfVisit) {
            return res.status(400).json({ error: 'Patient ID, purpose of visit, start time, and end time are required fields.' });
        }

        const newAppointment = new Appointment({
            patient: patientId,
            patientName,
            purposeOfVisit,
            dateOfVisit,
            startTime,
            endTime,
            doctor,
            status,
            description,
            share
        });

        const savedAppointment = await newAppointment.save();

        res.status(201).json({ message: 'Appointment created successfully', appointment: savedAppointment });
    } catch (error) {
        next(error);
    }
};

export const getTotalAppointmentCount = async (req, res) => {
    try {
        const totalCount = await Appointment.countDocuments();
        res.json({ totalCount });
    } catch (error) {
        console.error('Error fetching total appointment count:', error);
        res.status(500).json({ error: 'Error fetching total appointment count' });
    }
};
export const getAppointmentsForToday = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Get tomorrow's date

        // Query appointments for today
        const appointments = await Appointment.find({
            start: {
                $gte: today,
                $lt: tomorrow
            }
        }).populate('patient');

        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching today\'s appointments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const getAppointmentsByPatientId = async (req, res) => {
    try {
        const { patientId } = req.params;

        if (!patientId) {
            return res.status(400).json({ message: 'Patient ID is required' });
        }

        if (!mongoose.isValidObjectId(patientId)) {
            return res.status(400).json({ message: 'Invalid Patient ID' });
        }

        const appointments = await Appointment.find({ patient: patientId });

        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments by patient ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};








export const getAllAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        next(error);
    }
};

export const getAppointmentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        next(error);
    }
};

export const updateAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedFields = req.body;
        const updatedAppointment = await Appointment.findByIdAndUpdate(id, updatedFields, { new: true });
        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json({ message: 'Appointment updated successfully', appointment: updatedAppointment });
    } catch (error) {
        next(error);
    }
};

export const deleteAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedAppointment = await Appointment.findByIdAndDelete(id);
        if (!deletedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        next(error);
    }
};