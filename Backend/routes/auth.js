// auth.js
import express from "express";
import { login, register } from "../controllers/auth.js";
const router = express.Router();
// Google authentication rout
router.post("/register", register);
router.post("/login", login);


export default router;
