import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import SocialSignUp from './SocialSignUp';
import { useForm } from "react-hook-form";
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'react-bootstrap';
import { useUserLoginMutation } from '../../redux/api/authApi';
import { message } from 'antd';
import './SignInForm.css'
import axios from 'axios'

const SignIn = ({ handleResponse }) => {
    const [infoError, setInfoError] = useState('');
    const [show, setShow] = useState(true);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const Navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            setShow(false);
        }, 10000);
    }, []);

    const [userLogin, { isError, isLoading, isSuccess, error }] = useUserLoginMutation();

    const onSubmit = async (data, params) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve token from localStorage
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}` // Include token in the Authorization header
                }
            };

            const response = await axios.post('http://localhost:8800/api/userauth/login', data, config);
            console.log(response.data)
            if (response.data) {
                const clientId=response.data._id
                Navigate(`/dashboard/${clientId}`); // Navigate to home page
            } else {
                setInfoError(response.data.message);
            }
        } catch (error) {
            setInfoError('An error occurred while logging in');
            console.error('Error signing in:', error);
        }
    };

    useEffect(() => {
        if (isError) {
            setInfoError(error?.data?.message)
        }
        if (isSuccess) {
            message.success('Successfully Logged in');
            Navigate('/dashboard')
        }
    }, [isError, error, isSuccess, Navigate])

    return (
        <form className="sign-in-form" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="title">Sign in</h2>
            <div className="input-field">
                <span className="fIcon"><FaEnvelope /></span>
                <input {...register("email", { required: true })} placeholder="Enter Your Email" type="email" />
            </div>
            {errors.email && <span className="text-danger">This field is required</span>}
            <div className="input-field">
                <span className="fIcon"><FaLock /></span>
                <input {...register("password", { required: true })} type="password" placeholder="Enter Your Password" />
            </div>
            {errors.password && <span className="text-danger">This field is required</span>}
            {infoError && <p className="text-danger">{infoError}</p>}
            <button className="iBtn" type="submit" value="sign In" >
                {isLoading ? <Spinner animation="border" variant="info" /> : "Sign In"}
            </button>
            <p className="social-text">Or Sign in with social platformssss</p>
            <SocialSignUp onSignUpSuccess={handleResponse} />
        </form>
    );
};

export default SignIn;
