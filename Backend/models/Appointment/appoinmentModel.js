import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
    patientName: { type: String },
    purposeOfVisit: { type: String },
    dateOfVisit: { type: Date, },
    startTime: { type: Date },
    endTime: { type: String },
    doctor: { type: String },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Approved'], // Add 'Pending' to the enum values
        required: true
    },
    description: { type: String },
    share: {
        sms: { type: Boolean, default: false },
        email: { type: Boolean, default: false },
        whatsapp: { type: Boolean, default: false }
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
