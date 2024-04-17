// models/WebAppointment.js

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const webAppointmentSchema = new Schema({
    patientInfo: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        patientId: { type: Schema.Types.ObjectId, ref: 'User' },
        scheduleDate: Date,
        scheduleTime: String
    },
    payment: {
        paymentType: String,
        paymentMethod: String,
        cardNumber: String,
        cardExpiredYear: String,
        cvv: String,
        expiredMonth: String,
        nameOnCard: String
    }
});

const WebAppointment = model('WebAppointment', webAppointmentSchema);

export default WebAppointment;
