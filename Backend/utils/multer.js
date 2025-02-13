import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(`Uploading file to "uploads/" folder:`, file.originalname);
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        console.log(`File Type: ${file.mimetype}`);  // Logs the MIME type of the file
        console.log(`Original File Name: ${file.originalname}`);  // Logs the original file name
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

export default upload;
