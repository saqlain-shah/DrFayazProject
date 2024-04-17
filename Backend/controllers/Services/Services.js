// Importing required modules
import Service from '../../models/Services/Service.js';

// Controller functions
// Get all services
const getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createService = async (req, res) => {
    const service = new Service({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        status: req.body.status // Assuming status is sent in the request body
    });

    try {
        const newService = await service.save();
        res.status(201).json(newService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get service by ID
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (service) {
            res.json(service);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (service) {
            service.name = req.body.name || service.name;
            service.price = req.body.price || service.price;
            service.description = req.body.description || service.description;
            service.status = req.body.status !== undefined ? req.body.status : service.status; // Update status if provided

            const updatedService = await service.save();
            res.json(updatedService);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (service) {
            await Service.deleteOne({ _id: service._id });
            res.json({ message: 'Service deleted' });
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Exporting controller functions
export { getAllServices, createService, getServiceById, updateService, deleteService };
