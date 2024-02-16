import multer from 'multer';

// Set up Multer storage options
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the destination directory where uploaded files will be stored
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Specify the filename for the uploaded file
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Create Multer instance with configured storage options
const upload = multer({ storage: storage });

export default upload;
