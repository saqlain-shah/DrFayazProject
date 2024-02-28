

// Importing required modules
import Medicine from '../../models/Medicine/medicine.js';

// Controller functions
// Get all medicines
const getAllMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find();
        res.status(200).json(medicines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createMedicine = async (req, res) => {
    const { medicineName, measure, price, inStock, description } = req.body;

    // Validate inStock field
    if (typeof inStock !== 'boolean') {
        return res.status(400).json({ message: 'Invalid value for inStock field' });
    }

    const medicine = new Medicine({
        medicineName,
        measure,
        price,
        inStock,
        description
    });

    try {
        const newMedicine = await medicine.save();
        res.status(201).json(newMedicine);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Get medicine by ID
const getMedicineById = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (medicine) {
            // Populate the measure field with its name
            medicine.populate('measure').execPopulate();
            res.json(medicine);
        } else {
            res.status(404).json({ message: 'Medicine not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (medicine) {
            // Delete the previous medicine entry
            await medicine.remove();

            // Create a new medicine entry with the updated information
            const updatedMedicine = new Medicine({
                _id: req.params.id, // Use the same ID for the updated medicine
                medicineName: req.body.medicineName || medicine.medicineName,
                measure: req.body.measure || medicine.measure,
                price: req.body.price || medicine.price,
                inStock: req.body.inStock !== undefined ? req.body.inStock : medicine.inStock,
                description: req.body.description || medicine.description
            });

            // Save the updated medicine
            const savedMedicine = await updatedMedicine.save();
            res.json(savedMedicine);
        } else {
            res.status(404).json({ message: 'Medicine not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete medicine by ID
const deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (medicine) {
            await medicine.remove();
            res.json({ message: 'Medicine deleted' });
        } else {
            res.status(404).json({ message: 'Medicine not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Exporting controller functions
export { getAllMedicines, createMedicine, getMedicineById, updateMedicine, deleteMedicine };
