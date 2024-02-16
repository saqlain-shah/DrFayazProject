import Patient from '../../models/PatientModel/patient.js';
export const createPatient = async (req, res, next) => {
    try {
        const { firstName, lastName, age, email, gender, phone } = req.body;
        const { path } = req.file;
        const newPatient = new Patient({ firstName, lastName, age, email, gender, phone, profileImage: path });
        const savedPatient = await newPatient.save();
        res.status(201).json({ message: 'Patient created successfully', patient: savedPatient });
    } catch (err) {
        next(err);
    }
};


export const getAllPatients = async (req, res, next) => {
    try {
        const patients = await Patient.find();
        res.status(200).json(patients);
    } catch (err) {
        next(err);
    }
};

export const getPatientById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (err) {
        next(err);
    }
};

export const updatePatient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedFields = req.body;
        const updatedPatient = await Patient.findByIdAndUpdate(id, updatedFields, { new: true });
        if (!updatedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json({ message: 'Patient updated successfully', patient: updatedPatient });
    } catch (err) {
        next(err);
    }
};

export const deletePatient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedPatient = await Patient.findByIdAndDelete(id);
        if (!deletedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (err) {
        next(err);
    }
};
