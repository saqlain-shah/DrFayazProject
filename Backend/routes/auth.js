// // auth.js
// import express from "express";
// import { login } from "../controllers/auth.js";
// const router = express.Router();
// // Google authentication rout
// // router.post("/register", register);
// router.post("/login", login);


// export default router;
import express from "express";
const router = express.Router();
import { login } from "../controllers/auth.js";

// POST route for user login
router.post('/login', login);

export default router;

