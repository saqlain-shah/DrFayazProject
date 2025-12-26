import React, { useState } from 'react';
import { FaCheck, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
// import SocialSignUp from './SocialSignUp';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import log from '../../images/doc/dr.png';
import BASE_URL from '../../baseUrl';

import './SignInForm.css';

const SignUp = ({ onSignUpSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [infoError, setInfoError] = useState('');
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        isAdmin: false
    });
    const [passwordValidation, setPasswordValidation] = useState({
        carLength: false,
        specialChar: false,
        upperLowerCase: false,
        numeric: false
    });
    const [emailError, setEmailError] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
        if (name === 'email') {
            setEmailError(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
        }
        if (name === 'password') {
            setPasswordValidation({
                carLength: value.length >= 8,
                specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
                upperLowerCase: /[a-z]/.test(value) && /[A-Z]/.test(value),
                numeric: /\d/.test(value)
            });
        }
    };

    const handleSignUpSuccess = () => {
       
        toast.success('Registration successful');
        onSignUpSuccess();  // Invoke the callback function passed as prop
    };

    const registerUser = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/api/userauth/register`, user);
            if (response.data.message === 'Registration successful') {
                handleSignUpSuccess();
            } else {
                setLoading(false);
            }

        } catch (error) {
            setLoading(false);
            if (error.response) {
                console.error('Gmail already exist:', error.response.data);
                setInfoError('Email already exists');
            } else if (error.request) {
                console.error('Network error:', error.request);
                setInfoError('Network error. Please check your connection.');
            }

        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await registerUser();
    };

    return (
        <form className="sign-up-form" onSubmit={handleSubmit}>
             <img src={`${log}`} alt=""    style={{ width: '30%', height: '30%', objectFit: 'cover' }}/>
            <h2 className="title">Sign Up</h2>
            <div className="input-field">
                <span className="fIcon"><FaUser /></span>
                <input placeholder="Full Name" name="name" type="text" onChange={handleChange} value={user.name} />
            </div>
            <div className="input-field">
                <span className="fIcon"><FaEnvelope /></span>
                <input placeholder="Email" name="email" type="email" onChange={handleChange} value={user.email} />
                {emailError && <span className="error">Invalid email format</span>}
            </div>
            <div className="input-field">
                <span className="fIcon"><FaLock /></span>
                <input type="password" name="password" placeholder="Password" onChange={handleChange} value={user.password} />
            </div>
            {infoError && <h6 className="text-danger text-center">{infoError}</h6>}
            <button type="submit" className="btn btn-primary btn-block mt-2 iBtn" disabled={
                !passwordValidation.carLength || !passwordValidation.numeric || !passwordValidation.upperLowerCase || !passwordValidation.specialChar || emailError
            }>
                {loading ? <Spinner animation="border" variant="info" /> : "Sign Up"}
            </button>
            <div className="password-validatity mx-auto">
                <p><FaCheck style={{ color: passwordValidation.numeric ? "green" : "red" }} /> Must have a number</p>
                <p><FaCheck style={{ color: passwordValidation.upperLowerCase ? "green" : "red" }} /> Must have uppercase and lowercase letters</p>
                <p><FaCheck style={{ color: passwordValidation.specialChar ? "green" : "red" }} /> Must have a special character</p>
                <p><FaCheck style={{ color: passwordValidation.carLength ? "green" : "red" }} /> Must have at least 8 characters</p>
            </div>
            {/* <p className="social-text">Or sign up with a social account</p> */}
            {/* <SocialSignUp onSignUpSuccess={handleSignUpSuccess} /> */}
        </form>
    );
};

export default SignUp;