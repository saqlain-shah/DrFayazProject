import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import register from '../../images/doc/dr.jpg';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { useNavigate } from 'react-router-dom';
const SignInForm = () => {
    const [isSignUp, setSignUp] = useState(false);
    const Navigate = useNavigate();
    const handleSignUpSuccess = () => {
        console.log('Switching to Sign In mode...');
        setSignUp(false); // Change the mode to sign-in
        Navigate(`/dashboard/${clientId}`);
    };

    const handleSignInMode = () => {
        console.log('Switching to Sign Up mode...');
        setSignUp(true); // Change the mode to sign-up
    };
    useEffect(() => {
        console.log('Component rendered with sign-in mode:', isSignUp);
    }, [isSignUp]);

    return (
        <div className={`${isSignUp ? "signin-signup-container sign-up-mode" : "signin-signup-container"}`}>
            <Link to='/'>
                <span className="pageCloseBtn"><FaTimes /></span>
            </Link>
            <div className="forms-container">
                <div className="signIn-singUp">
                    <SignIn handleResponse={handleSignInMode} />
                    <SignUp onSignUpSuccess={handleSignUpSuccess} />
                </div>
            </div>

            <div className="panels-container">
                <div className="panel left-panel">
                    <div className="content">
                        <h3 className='text-white'>New here ?</h3>
                        <p><b>Note:</b><br />
                            New User please first registration then go to Login Page !
                        </p>
                        <button className="iBtn transparent" onClick={() => setSignUp(true)}>Sign Up</button>
                    </div>
                    <img src={`${register}`} alt=""  className="pImg rounded-circle shadow-lg"  style={{ width: '50%', height: '40%', objectFit: 'cover', marginRight:'30%' }}/>
                </div>

                <div className="panel right-panel">
                    <div className="content">
                        <h3 className='text-white'>One of us ?</h3>
                        <p> New User please first registration then  Login !</p>
                        <button className="iBtn transparent" onClick={() => setSignUp(false)}>Sign In</button>
                    </div>
                    <img src={`${register}`} alt=""  className="pImg rounded-circle shadow-lg"  style={{ width: '50%', height: '40%', objectFit: 'cover' }}/>
                </div>
            </div>
        </div>
    );
};

export default SignInForm;