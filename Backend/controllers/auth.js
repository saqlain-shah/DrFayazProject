import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';
import User from '../models/User.js'; // Import your User model
import mongoose from 'mongoose';

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or ' });
    }
    console.log("user", user)
    // Compare trimmed password using bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log("vlidate", isValidPassword)
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid  or password' });
    }

    // Generate token upon successful login
    const token = jwt.sign({ email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '2d' });

    // Set token as an HTTP cookie
    res.cookie('access_token', token, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
  });
  // Expires in 90 days

    // Set token in response body
    res.status(200).json({ message: 'Login successful', token, id: user._id });

  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = new User(req.body);
    await newUser.save();

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '90d' });
    res.cookie('access_token', token, { httpOnly: true }).status(201).json({ message: 'Registration successful', token });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateDoctorById = async (req, res, next) => {
  const { doctorId } = req.params;
  const { fullName, email, phone, address, profileImage } = req.body;

  try {
    const updatedDoctor = await User.findByIdAndUpdate(doctorId, { fullName, email, phone, address, profileImage }, { new: true });
    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    return res.status(200).json(updatedDoctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



export const changePassword = async (req, res, next) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    console.log('Change Password Request Body:', req.body);

    if (!userId) {
      console.log('User ID is missing');
      return res.status(400).json({ message: 'User ID is missing' });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // console.log('User found:', user);

    const isPasswordValid = await bcrypt.compare(oldPassword.trim(), user.password.trim());

    if (!isPasswordValid) {
      console.log('Invalid old password');
      return res.status(400).json({ message: 'Invalid old password' });
    }

    // console.log('Old password is valid');

    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    // console.log('New hashed password:', hash);
    // 
    user.password = newPassword;
    await user.save();

    console.log('Password changed successfully');
    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


