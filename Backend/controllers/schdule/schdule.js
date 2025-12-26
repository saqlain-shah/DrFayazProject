import Schedule from '../../models/schdule/schdule.js';
import moment from 'moment-timezone';

export const getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find();
        console.log('Fetched Slots from DB:', schedules); 

        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const createSchedule = async (req, res) => {
    const schedule = req.body;

    try {
        const newSchedule = await Schedule.create(schedule);
        res.status(201).json(newSchedule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const deleteSchedule = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSchedule = await Schedule.findByIdAndDelete(id);
        res.status(200).json(deletedSchedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const deletePastSchedules = async (req, res) => {
    try {
        const now = moment().utc().toDate();

        const result = await Schedule.deleteMany({
            endDateTime: { $lt: now } // Deletes only if endDateTime is before now
        });

        res.status(200).json({ message: 'Past schedules removed successfully', removedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


