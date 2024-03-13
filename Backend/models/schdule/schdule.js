// scheduleModel.js

import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    // Other fields you may want to include
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;
