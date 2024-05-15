// healthInfoController.js

import HealthInformation from '../../models/HealthInfo/healthInfo.js';

export const createHealthInformation = async (req, res) => {
    try {
        const { patientId } = req.body; // Extract patientId from request body
        const { bloodType, weight, height, allergies, habits, medicalHistory } = req.body;

        const newHealthInformation = new HealthInformation({
            patientId, // Assign patientId
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

export const getHealthInformationByPatientId = async (req, res) => {
    try {
        const { patientId } = req.params;
        const healthInformation = await HealthInformation.find({ patientId });
        if (!healthInformation) {
            return res.status(404).json({ message: "Health information not found for the specified patient ID" });
        }
        res.status(200).json(healthInformation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateHealthInformationByPatientId = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { bloodType, weight, height, allergies, habits, medicalHistory } = req.body;

        const updatedHealthInformation = await HealthInformation.findOneAndUpdate({ patientId }, {
            bloodType,
            weight,
            height,
            allergies,
            habits,
            medicalHistory
        }, { new: true });

        if (!updatedHealthInformation) {
            return res.status(404).json({ message: "Health information not found for the specified patient ID" });
        }

        res.status(200).json(updatedHealthInformation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteHealthInformationByPatientId = async (req, res) => {
    try {
        const { patientId } = req.params;
        const deletedHealthInformation = await HealthInformation.findOneAndDelete({ patientId });
        if (!deletedHealthInformation) {
            return res.status(404).json({ message: "Health information not found for the specified patient ID" });
        }
        res.status(200).json({ message: "Health information deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
