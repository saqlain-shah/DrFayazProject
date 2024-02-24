// itemController.js

import Item from "../../models/Invoice/invoiceModel.js";

export const createItem = async (req, res) => {
    try {
        // Create the item
        const newItem = new Item(req.body.itemData);
        const savedItem = await newItem.save();

        // Return the saved item data
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Controller to get all items
export const getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to get a single item by ID
export const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (item === null) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to update an item by ID
export const updateItem = async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedItem === null) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller to delete an item by ID
export const deleteItem = async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (deletedItem === null) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
