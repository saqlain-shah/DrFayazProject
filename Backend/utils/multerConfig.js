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
    if (file.fieldname === 'attachment') {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Only JPEG and PNG files are allowed!'), false);
        }
    }
    cb(null, true);
};

export const upload = multer({ storage: storage, fileFilter: fileFilter });
export const uploads = multer({ storage: storage, fileFilter: fileFilter }).array('attachment', 10);
