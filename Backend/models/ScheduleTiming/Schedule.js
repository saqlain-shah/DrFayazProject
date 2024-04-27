// import mongoose from 'mongoose';

// const scheduleSchema = new mongoose.Schema(
//     {
//         startDateTime: { type: Date, required: true },
//         endDateTime: { type: Date, required: true },
//         shares: {
//             email: { type: Boolean, default: false },
//             sms: { type: Boolean, default: false },
//             whatsapp: { type: Boolean, default: false }
//         },
//         // Include appointment-related fields
//         firstName: { type: String, required: true },
//         lastName: { type: String, required: true },
//         email: { type: String, required: true },
//         phone: { type: String, required: true },
//         reasonForVisit: { type: String, required: true },
//         selectedDate: { type: Date, required: true },
//         selectTime: { type: Date, required: true },
//         paymentMethod: { type: String, required: true },
//         paymentType: { type: String, required: true },
//         paymentDetails: { type: mongoose.Schema.Types.Mixed } // You can adjust this according to your payment details schema
//     },
//     { timestamps: true } // Add timestamps option
// );

// // Corrected the model name to 'Schedule' and corrected the export statement
// const Schedule = mongoose.model('Schedule', scheduleSchema);

// export default Schedule;
