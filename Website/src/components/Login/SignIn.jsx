import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useForm } from "react-hook-form";
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';

const SignIn = ({ handleResponse }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [infoError, setInfoError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8800/api/userauth/login', data);
            const { token, _id } = response.data; // Assuming token and _id are returned from the API
            if (token && _id) {
                localStorage.setItem('token', token); // Store token in local storage
                localStorage.setItem('clientId', _id); // Store clientId in local storage
                navigate(`/dashboard/${_id}`);
                message.success('Successfully Logged in');
            } else {
                throw new Error('Token or ClientId not found in response data');
            }
        } catch (error) {
            setInfoError('An error occurred while logging in');
            console.error('Error signing in:', error);
        } finally {
            setLoading(false);
        }
    };


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
            <button className="iBtn" type="submit" value="sign In" disabled={loading}>
                {loading ? <Spinner animation="border" variant="info" /> : "Sign In"}
            </button>
            {/* <p className="social-text">Or Sign in with social platforms</p> */}
            {/* <div onClick={handleResponse} className="socialBtn">Sign Up</div> */}
        </form>
    );
};

export default SignIn;
