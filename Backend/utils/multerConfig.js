import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    cb(null, true);
};


export const upload = multer({ storage: storage, fileFilter: fileFilter });
export const uploads = multer({ storage: storage, fileFilter: fileFilter }).array('attachment', 10);
