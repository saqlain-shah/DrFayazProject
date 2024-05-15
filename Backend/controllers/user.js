import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';
import User from '../models/Client.js'; // Import your User model
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

export const login = async (req, res, next) => {
  try {

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
  const { userId, oldPassword, newPassword } = req.body;

  try {


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

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
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




const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'appointment@avicenahealthcare.com', // Replace with your email address
    pass: 'Godaay2024' // Replace with your password
  }
});

export const sendEmail = (req, res) => {
  const { email, subject, body } = req.body;

  // Add <br> tags to preserve line breaks
  const formattedBody = body.replace(/\n/g, '<br>');

  // Create email body
  const emailBody = `
    <div class="bg-gray-100 p-6 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">Message from Patient</h2>
      <div class="border-t border-gray-300 pt-4">
        <p class="text-gray-700 font-semibold">Sender's Email:</p>
        <p class="mt-2 text-gray-600">${email}</p>
      </div>
      <div class="border-t border-gray-300 pt-4 mt-4">
        <p class="text-gray-700 font-semibold">Message:</p>
        <p class="mt-2 text-gray-600 whitespace-pre-line">${formattedBody}</p>
      </div>
    </div>
  `;

  // Create email options
  const mailOptions = {
    from: 'appointment@avicenahealthcare.com', // Use the email address you have permission to send from
    to: 'appointment@avicenahealthcare.com', // Change this to your recipient email address
    subject: subject,
    html: emailBody // Use HTML for formatted email body
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


