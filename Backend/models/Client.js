// models/Client.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bloodGroup: {
    type: String, enum: ['AB+ve', 'AB-ve', 'A+ve', 'A-ve', 'B+ve', 'B-ve', 'O+ve', 'O-ve']
  },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  emergencyContact: { type: Number, default: 0 },
  address: { type: String, default: "" },
  image: { type: String, default: "" },
  isAdmin: { type: Boolean, default: false } // Adding isAdmin field with default value false
}, {
  timestamps: true 
});

// Hash password before saving to the database
clientSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

// Method to compare password
clientSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('Client', clientSchema);
export default User;
