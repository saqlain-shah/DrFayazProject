import Schedule from '../../models/ScheduleTiming/Schedule.js';

const scheduleController = {
    saveSchedule: async (req, res) => {
        try {
            const { startDateTime, endDateTime, ...appointmentData } = req.body;
            const schedule = new Schedule({
                startDateTime,
                endDateTime,
                ...appointmentData
            });
            await schedule.save();
            res.status(201).json({ message: 'Schedule saved successfully' });
        } catch (error) {
            console.error('Error saving schedule:', error);
            res.status(500).json({ error: 'Failed to save schedule' });
        }
    },

    getSchedule: async (req, res) => {
        try {
            const schedules = await Schedule.find();
            res.status(200).json(schedules);
        } catch (error) {
            console.error('Error fetching schedules:', error);
            res.status(500).json({ error: 'Failed to fetch schedules' });
        }
    }
};

export default scheduleController;
