import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import passportGoogleOAuth2 from 'passport-google-oauth2';
import cors from "cors";
import userdb from './models/google.js';
import authRoute from './routes/auth.js';
import patientRoute from './routes/patientRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import medicalRecordRoutes from './routes/medicalReport.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import healthInfoRoutes from './routes/healthInfoRoutes.js'
const app = express();
dotenv.config();

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

// Handle MongoDB disconnection
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Allow requests from this origin
  credentials: true // Allow cookies to be sent back and forth
}));
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Google OAuth 2.0 configuration
passport.use(new passportGoogleOAuth2.Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
  }));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Authentication Routes
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/api/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('http://localhost:5173/');
});

// API Routes
app.use('/api/auth', authRoute);
app.use('/api/patients', patientRoute);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/healthInfo', healthInfoRoutes)

// Start the server
const PORT = process.env.PORT || 8800;
app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Server is running on port ${PORT}`);
});
