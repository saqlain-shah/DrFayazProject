// controllers/webAppointmentController.js

import WebAppointment from '../models/webAppoint.js';

export const createWebAppointmentByUnauthenticatedUser = async (req, res) => {
    try {
        const webAppointment = await WebAppointment.create(req.body);
        res.status(201).json({ success: true, data: webAppointment });
    } catch (error) {
        console.error('Error creating web appointment:', error);
        res.status(500).json({ success: false, error: 'Web appointment creation failed' });
    }
};
export const getWebAppointments = async (req, res) => {
    try {
        const appointments = await WebAppointment.find();
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        console.error('Error fetching web appointments:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch web appointments' });
    }
};
export const deleteWebAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAppointment = await WebAppointment.findByIdAndDelete(id);
        if (!deletedAppointment) {
            return res.status(404).json({ success: false, error: 'Appointment not found' });
        }
        res.status(200).json({ success: true, message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting web appointment:', error);
        res.status(500).json({ success: false, error: 'Failed to delete web appointment' });
    }
};
export const getWebAppointment = async (req, res) => {
    try {
        const count = await WebAppointment.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error counting webs:', error);
        res.status(500).json({ message: 'Error counting webs', error: error.message });
    }
};
