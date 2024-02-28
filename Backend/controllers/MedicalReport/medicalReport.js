import MedicalRecord from '../../models/MedicalReport/medicalReportModel.js';
// import Doctor from '../../models/Doctor/doctorModel.js';

// export const createMedicalRecord = async (req, res) => {
//     try {
//         const { complaints, diagnosis, treatment, vitalSigns, } = req.body;
//         // doctor, medicineDosage, attachments //
//         // Check if the doctor exists
//         // const doctorInfo = await Doctor.findById(doctor);
//         // if (!doctorInfo) {
//         //     return res.status(404).json({ message: 'Doctor not found' });
//         // }

//         const medicalRecord = new MedicalRecord({
//             complaints,
//             diagnosis,
//             treatment,
//             vitalSigns,
//             // doctor: doctorInfo,
//             // medicineDosage,
//             // attachments
//         });

//         await medicalRecord.save();

//         res.status(201).json({ message: 'Medical record created successfully', data: medicalRecord });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to create medical record', error: error.message });
//     }
// };
export const createMedicalRecord = async (req, res) => {
    try {
        const { complaints, diagnosis, treatment, vitalSigns } = req.body;

        // Parse the treatment string back to an array of objects
        const parsedTreatment = JSON.parse(treatment);

        // Map over the files array to extract the file paths
        const attachments = req.files.map(file => file.path);

        // Create a new medical record instance
        const medicalRecord = new MedicalRecord({
            complaints,
            diagnosis,
            treatment: parsedTreatment, // Assign the parsed treatment array
            vitalSigns,
            attachments // Attach the file paths to the medical record
        });

        // Save the medical record to the database
        await medicalRecord.save();

        // Include the attachment data in the response
        const responseData = {
            message: 'Medical record created successfully',
            data: { ...medicalRecord.toObject(), attachments }
        };

        // Send a success response
        res.status(201).json(responseData);
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ message: 'Failed to create medical record', error: error.message });
    }
};




export const getAllMedicalRecords = async (req, res) => {
    try {
        const medicalRecords = await MedicalRecord.find();
        res.status(200).json({ data: medicalRecords });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch medical records', error: error.message });
    }
};

export const getMedicalRecordById = async (req, res) => {
    try {
        const medicalRecord = await MedicalRecord.findById(req.params.id);
        if (!medicalRecord) {
            return res.status(404).json({ message: 'Medical record not found' });
        }
        res.status(200).json({ data: medicalRecord });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch medical record', error: error.message });
    }
};

export const updateMedicalRecord = async (req, res) => {
    try {
        const medicalRecord = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!medicalRecord) {
            return res.status(404).json({ message: 'Medical record not found' });
        }
        res.status(200).json({ message: 'Medical record updated successfully', data: medicalRecord });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update medical record', error: error.message });
    }
};

export const deleteMedicalRecord = async (req, res) => {
    try {
        const medicalRecord = await MedicalRecord.findByIdAndDelete(req.params.id);
        if (!medicalRecord) {
            return res.status(404).json({ message: 'Medical record not found' });
        }
        res.status(200).json({ message: 'Medical record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete medical record', error: error.message });
    }
};
