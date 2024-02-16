import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import passportGoogleOAuth2 from 'passport-google-oauth2';
import cors from "cors";
import userdb from './models/google.js'
import authRoute from './routes/auth.js'
import patientRoute from './routes/patientRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js';
import medicalRecordRoutes from './routes/medicalReport.js'
const app = express();
dotenv.config();

// Initialize Google OAuth 2.0 client
const clientId = "189136548267-ab89fcn628lcgjjm1dljdu7bc2gpbknb.apps.googleusercontent.com";
const clientSecret = "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";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB.");
  } catch (error) {
    throw error;
  }
};
mongoose.set('strictQuery', false);

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});
app.use(cors({
  origin: "http://localhost:5173", // Allow requests from this origin
  credentials: true // Allow cookies to be sent back and forth
}));
app.use(session({
  secret: "127838ajjsakkanksnsjjd",
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

passport.use(
  new passportGoogleOAuth2.Strategy({
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: "/api/auth/google/callback",
    passReqToCallback: true
  },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        let user = await userdb.findOne({ googleId: profile.id });
        if (!user) {
          user = new userdb({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Authentication Routes
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/api/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  // Successful authentication, redirect home.
  res.redirect('http://localhost:5173/');
});
app.use('/api/auth', authRoute)
app.use('/api/', patientRoute)
app.use('/api/', appointmentRoutes)
app.use('/api/', medicalRecordRoutes)
app.listen(8800, async () => {
  await connect();
  console.log("Server is running on port 8800");
});
