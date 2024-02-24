import Appointment from '../../models/Appointment/appoinmentModel.js'

export const createAppointment = async (req, res, next) => {
    try {
        // Assuming `req.body` contains the appointment data sent from the client
        const { patientName, purposeOfVisit, dateOfVisit, startTime, endTime, doctor, status, description, share } = req.body;

        // Validate required fields
        if (!patientName || !purposeOfVisit || !dateOfVisit || !startTime || !endTime) {
            return res.status(400).json({ error: 'Patient name, purpose of visit, date of visit, start time, and end time are required.' });
        }

        // Create a new appointment instance
        const newAppointment = new Appointment({
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

        // Save the appointment to the database
        const savedAppointment = await newAppointment.save();

        // Respond with the saved appointment
        res.status(201).json({ message: 'Appointment created successfully', appointment: savedAppointment });
    } catch (error) {
        // Handle errors
        next(error);
    }
};
;

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
