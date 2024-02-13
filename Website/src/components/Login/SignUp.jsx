import React, { useEffect, useState } from 'react';
import { FaCheck, FaEnvelope, FaLock, FaTimes, FaUser } from 'react-icons/fa';
import SocialSignUp from './SocialSignUp';
import Spinner from 'react-bootstrap/Spinner';
import { useDoctorSignUpMutation, usePatientSignUpMutation } from '../../redux/api/authApi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignInForm.css'
const SignUp = ({ setSignUp }) => {
    const [infoError, setInfoError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const formField = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    };
    const [user, setUser] = useState(formField);
    const [passwordValidation, setPasswordValidation] = useState({
        carLength: false,
        specailChar: false,
        upperLowerCase: false,
        numeric: false
    });
    const [doctorSignUp, { isSuccess: dIsSuccess, isError: dIsError, error: dError, isLoading: dIsLoading }] = useDoctorSignUpMutation();
    const [patientSignUp, { isSuccess: pIsSuccess, isError: pIsError, error: pError, isLoading: pIsLoading }] = usePatientSignUpMutation();

    const handleSignUpSuccess = () => {
        console.log('Sign-up successful!');
        navigate("/login"); // Navigate to login page after successful registration
    };

    useEffect(() => {
        if (dIsError && dError) {
            setLoading(false);
            setInfoError(dError.data.message);
        }
        if (!dIsError && dIsSuccess) {
            handleSignUpSuccess();
        }
        if (pIsError && pError) {
            setLoading(false);
            setInfoError(pError.data.message);
        }
        if (!pIsError && pIsSuccess) {
            handleSignUpSuccess();
        }
    }, [dIsError, dError, pError, pIsError, pIsLoading, dIsLoading, setSignUp, setLoading, dIsSuccess]);

    const [emailError, setEmailError] = useState({
        emailError: false
    })

    const handleEmailError = (name, value) => {
        if (name === 'email') {
            setEmailError({
                emailError: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            })
        }
    }

    const handleValidation = (name, value) => {
        if (name === 'password') {
            setPasswordValidation({
                carLength: (value.length > 8),
                specailChar: /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(value),
                upperLowerCase: /^(?=.*[a-z])(?=.*[A-Z])/.test(value),
                numeric: /^(?=.*\d)/.test(value),
            })
        }
    }

    const handleChange = (e) => {
        let { name, value } = e.target;
        handleValidation(name, value);
        handleEmailError(name, value);

        // Update user state for all input fields
        const newUser = { ...user, [name]: value };
        setUser(newUser);
    }


    const registerUser = async () => {
        try {
            const response = await axios.post('http://localhost:8800/api/auth/register', user);
            if (response.data.success) {
                console.log(response.data);
                handleSignUpSuccess();
                navigate("/login"); // Call handleSignUpSuccess on successful registration
            } else {
                setLoading(false);
                setInfoError(response.data.message);
            }
        } catch (error) {
            setLoading(false);
            setInfoError('An error occurred while signing up.');
            console.error('Error signing up:', error);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        registerUser();
    }

    return (
        <form className="sign-up-form" onSubmit={handleSubmit}>
            <h2 className="title">Sign Up</h2>
            <div className="input-field">
                <span className="fIcon"><FaUser /></span>
                <input placeholder="Name" name="firstName" type="text" onChange={(e) => handleChange(e)} value={user.firstName} />
            </div>
            <div className="input-field">
                <span className="fIcon"><FaUser /></span>
                <input placeholder="Name" name="lastName" type="text" onChange={(e) => handleChange(e)} value={user.lastName} />
            </div>
            <div className="input-field">
                <span className="fIcon"><FaEnvelope /></span>
                <input placeholder="Email" name="email" type="email" onChange={(e) => handleChange(e)} value={user.email} />
            </div>
            <div className="input-field">
                <span className="fIcon"><FaLock /></span>
                <input type="password" name="password" placeholder="password" onChange={(e) => handleChange(e)} value={user.password} />
            </div>
            {infoError && <h6 className="text-danger text-center">{infoError}</h6>}
            <button type="submit"
                className="btn btn-primary btn-block mt-2 iBtn"
                disabled={
                    passwordValidation.carLength && passwordValidation.numeric && passwordValidation.upperLowerCase && passwordValidation.specailChar && emailError.emailError ? "" : true
                }
            >
                {loading ? <Spinner animation="border" variant="info" /> : "Sign Up"}
            </button>

            <div className="password-validatity mx-auto">
                <div style={emailError.emailError ? { color: "green" } : { color: "red" }}>
                    <p>{passwordValidation.numeric ? <FaCheck /> : <FaTimes />}
                        <span className="ms-2">Must Have Valid Email.</span></p>
                </div>

                <div style={passwordValidation.carLength ? { color: "green" } : { color: "red" }}>
                    <p>{passwordValidation.numeric ? <FaCheck /> : <FaTimes />}
                        <span className="ms-2">Password Must Have at least 8 characters.</span></p>
                </div>

                <div style={passwordValidation.specailChar ? { color: "green" } : { color: "red" }}>
                    <p>{passwordValidation.numeric ? <FaCheck /> : <FaTimes />}
                        <span className="ms-2">Password Must Have a special character.</span></p>
                </div>

                <div style={passwordValidation.upperLowerCase ? { color: "green" } : { color: "red" }}>
                    <p>{passwordValidation.numeric ? <FaCheck /> : <FaTimes />}
                        <span className="ms-2">Password Must Have uppercase and lowercase letters.</span></p>
                </div>

                <div style={passwordValidation.numeric ? { color: "green" } : { color: "red" }}>
                    <p>{passwordValidation.numeric ? <FaCheck /> : <FaTimes />}
                        <span className="ms-2">Password Must Have a Number.</span></p>
                </div>
            </div>

            <p className="social-text">Or Sign up with a social account</p>
            <SocialSignUp />
        </form>
    );
};

export default SignUp;
