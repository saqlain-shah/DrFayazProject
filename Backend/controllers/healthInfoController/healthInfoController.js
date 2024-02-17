import HealthInfo from '../../models/HealthInfo/healthInfo.js';

export const createHealthInfo = async (req, res) => {
    try {
        // Create health information document
        const healthInfo = new HealthInfo(req.body);
        await healthInfo.save();
        res.status(201).json({ message: 'Health information created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getHealthInfoById = async (req, res) => {
    try {
        const { id } = req.params;
        const healthInfo = await HealthInfo.findById(id);
        if (!healthInfo) {
            return res.status(404).json({ message: 'Health information not found' });
        }
        res.status(200).json(healthInfo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateHealthInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedHealthInfo = await HealthInfo.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedHealthInfo) {
            return res.status(404).json({ message: 'Health information not found' });
        }
        res.status(200).json({ message: 'Health information updated successfully', healthInfo: updatedHealthInfo });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteHealthInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHealthInfo = await HealthInfo.findByIdAndDelete(id);
        if (!deletedHealthInfo) {
            return res.status(404).json({ message: 'Health information not found' });
        }
        res.status(200).json({ message: 'Health information deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAllHealthInfo = async (req, res) => {
    try {
        const healthInfos = await HealthInfo.find();
        res.status(200).json(healthInfos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
