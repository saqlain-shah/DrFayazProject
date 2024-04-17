import HealthInformation from '../../models/HealthInfo/healthInfo.js';

export const createHealthInformation = async (req, res) => {
    try {
        const { bloodType, weight, height, allergies, habits, medicalHistory } = req.body;

        const newHealthInformation = new HealthInformation({
            bloodType,
            weight,
            height,
            allergies,
            habits,
            medicalHistory
        });

        const savedHealthInformation = await newHealthInformation.save();

        res.status(201).json(savedHealthInformation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllHealthInformation = async (req, res) => {
    try {
        const healthInformation = await HealthInformation.find();
        res.status(200).json(healthInformation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add controller methods for getting, updating, and deleting health information by ID if needed
