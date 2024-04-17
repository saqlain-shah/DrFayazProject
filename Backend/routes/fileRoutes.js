// routes/fileRoutes.js

import express from "express";
import * as fileShare from "../controllers/FlieShare/FileShare.js";
import multer from 'multer';


const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/share/email',fileShare.shareViaEmail);
router.post('/share/whatsapp', fileShare.shareViaWhatsApp);

export default router;



