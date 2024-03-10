// scheduleController.js

import Schedule from '../../models/schdule/schdule.js';

// Fetch all schedules
export const getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find();
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new schedule
export const createSchedule = async (req, res) => {
    const schedule = req.body;

    try {
        const newSchedule = await Schedule.create(schedule);
        res.status(201).json(newSchedule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
