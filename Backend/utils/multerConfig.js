// utils/multerConfig.js
import multer from 'multer';

// Set up Multer storage options
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the destination directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Specify the filename for the uploaded file
    }
});

// Create Multer instance with configured storage options
const upload = multer({ storage: storage });

export default upload;
