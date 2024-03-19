import Appointment from '../../models/Appointment/appoinmentModel.js'


export const createAppointment = async (req, res, next) => {
    try {
        const { patientId, patientName, purposeOfVisit, dateOfVisit, startTime, endTime, doctor, status, description, share } = req.body;


        if (!startTime || !endTime || !patientId) {
            return res.status(400).json({ error: 'Patient ID, start time, and end time are required fields.' });
        }

        const newAppointment = new Appointment({
            patient: patientId, // Set the patient ID here
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


export const getAppointmentsByPatientId = async (req, res) => {
    try {
        const { patientId } = req.params;
        console.log("Fetching appointments for patientId:", patientId);
        // Find appointments where the patient field matches the provided patientId
        const appointments = await Appointment.find({ patient: patientId });
        console.log("Appointments fetched:", appointments);
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

