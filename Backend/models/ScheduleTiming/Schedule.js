import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    shares: {
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: false },
        whatsapp: { type: Boolean, default: false }
    }
});

// Corrected the model name to 'Schedule' and corrected the export statement
const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;
