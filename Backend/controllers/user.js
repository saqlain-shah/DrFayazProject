import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';
import User from '../models/Client.js'; // Import your User model
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import { transporter } from '../routes/transporter.js'

export const login = async (req, res, next) => {
  try {
    console.log('Request Body:', req.body); // Log request body

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare trimmed password using bcrypt
    const isValidPassword = await bcrypt.compare(req.body.password.trim(), user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate token upon successful login
    const token = jwt.sign({ email: req.body.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '90d' });

    const { password, ...details } = user._doc;

    // Set token in cookie
    res.cookie('access_token', token, { httpOnly: true });

    // Send token and id in response
    return res.status(200).json({ message: 'Login successful', token, ...details });
  } catch (error) {
    console.error('Error logging in:', error); // Log any errors
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

    const newUser = new User({ name, email, password });
    const hash = await bcrypt.hash(password, 10); // Hash the password
    newUser.password = hash; // Set the hashed password
    await newUser.save();

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '90d' });
    res.cookie('access_token', token, { httpOnly: true }).status(201).json({ message: 'Registration successful', token });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const getClientById = async (req, res, next) => {
  const { clientId } = req.params;
  try {
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    return res.status(200).json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateClientById = async (req, res, next) => {
  const { clientId } = req.params;
  const { name, email, gender, bloodGroup, emergencyContact, address } = req.body;
  const image = req.file.path;

  try {
    const updatedClient = await User.findByIdAndUpdate(clientId, { name, image, email, gender, bloodGroup, emergencyContact, address });
    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }
    const { password: omit, ...clientData } = updatedClient._doc;
    return res.status(200).json(clientData);
  } catch (error) {
    console.error('Error updating client:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const changePassword = async (req, res, next) => {
  const { clientId } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    console.log('Request body:', req.body);

    if (!clientId) {
      return res.status(400).json({ message: 'User ID is missing' });
    }

    const user = await User.findById(clientId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid old password' });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    console.log('hash', hash, user.password);
    await user.save();


    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const logout = async (req, res, next) => {
  try {
    // Clear the token from local storage
    localStorage.removeItem('token');

    // Respond with a success message
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




export const sendEmail = (req, res) => {
  const { email, subject, body } = req.body;

  // Extract sender name and email from the provided email address
  const senderName = email.substring(0, email.indexOf('@'));
  const senderEmail = email;

  // Create email options
  const mailOptions = {
    from: `${senderName} <${senderEmail}>`,
    to: 'davbabu1122@gmail.com', // Change this to your recipient email address
    subject: subject,
    text: body // Use the email body received from the client
  };

  // Send email using transporter
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      // If there's an error sending the email, send error response
      console.error('Error sending email:', error);
      res.status(500).send({ success: false, error: 'Error sending email' });
    } else {
      // If email sent successfully, send success response
      console.log('Email sent:', info.response);
      res.status(200).send({ success: true, message: 'Email sent successfully' });
    }
  });
};

