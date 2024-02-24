import cors from "cors";
import session from "express-session";
import passport from "passport";
import passportGoogleOAuth2 from 'passport-google-oauth2';
import express from 'express';

const app = express();

const setupMiddleware = () => {
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
    }));
    app.use(session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.json());
};

export default setupMiddleware;
