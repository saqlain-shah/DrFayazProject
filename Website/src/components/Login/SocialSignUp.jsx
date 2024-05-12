import React from 'react';
import { FaGoogle } from 'react-icons/fa';

const SocialSignUp = () => {
    const handleGoogleSignIn = () => {
        try {
            // Redirect the user to Google OAuth authentication
            window.location.href = 'https://server-yvzt.onrender.com/api/auth/google';
        } catch (error) {
            console.error('Failed to initiate Google sign-in:', error);
            // Handle error
        }
    };

    return (
        <div>
            <div className="social-media">
                <div className="social-icon" onClick={handleGoogleSignIn}>
                    <FaGoogle />
                </div>
            </div>
        </div>
    );
};

export default SocialSignUp;
