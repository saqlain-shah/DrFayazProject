import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    patientName: { type: String },
    purposeOfVisit: { type: String },
    dateOfVisit: { type: Date },
    startTime: { type: Date },
    endTime: { type: Date },
    doctor: { type: String },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Approved'],
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
