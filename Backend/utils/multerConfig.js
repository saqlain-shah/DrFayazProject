// multerConfig.js
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const __dirname = dirname(fileURLToPath(import.meta.url));

export const upload = multer({ storage: storage });
