import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    purposeOfVisit: { type: String, required: true },
    dateOfVisit: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    doctor: { type: String },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
    description: { type: String },
    share: {
        sms: { type: Boolean, default: false },
        email: { type: Boolean, default: false },
        whatsapp: { type: Boolean, default: false }
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
