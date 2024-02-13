import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { GoogleLogin } from 'react-google-login';

const SocialSignUp = () => {
    const [error, setError] = useState(null);

    const handleGoogleSuccess = (response) => {
        // Handle successful login
        console.log('Google login successful!', response);
    };

    const handleGoogleFailure = (error) => {
        // Handle login failure
        console.error('Google login failed!', error);
        setError('Google login failed. Please try again.');
    };

    return (
        <div>
            <div className="social-media">
                <GoogleLogin
                    clientId="829022394676-7rokhfab9hup5u1j18u9psk55ididhas.apps.googleusercontent.com"
                    buttonText="Sign in with GoogleS"
                    onSuccess={handleGoogleSuccess}
                    onFailure={handleGoogleFailure}
                    cookiePolicy={'single_host_origin'}
                    render={renderProps => (
                        <div className="social-icon" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                            <FaGoogle />
                        </div>
                    )}
                />
            </div>
            {error && <h6 className="text-danger text-center p-2">{error}</h6>}
        </div>
    );
};

export default SocialSignUp;
