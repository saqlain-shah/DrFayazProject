import Appointment from '../../models/Appointment/appoinmentModel.js'

// Controller to create a new appointment
export const createAppointment = async (req, res, next) => {
    try {
        const { patientName, purposeOfVisit, dateOfVisit, startTime, endTime, doctor, status, description, sharePatient } = req.body;
        // Construct the appointment object
        const newAppointment = new Appointment({ patientName, purposeOfVisit, dateOfVisit, startTime, endTime, doctor, status, description, sharePatient });
        // Save the appointment
        const savedAppointment = await newAppointment.save();
        res.status(201).json({ message: 'Appointment created successfully', appointment: savedAppointment });
    } catch (error) {
        next(error);
    }
};

// Controller to get all appointments
export const getAllAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        next(error);
    }
};

// Controller to get an appointment by ID
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

// Controller to update an appointment by ID
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

// Controller to delete an appointment by ID
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
