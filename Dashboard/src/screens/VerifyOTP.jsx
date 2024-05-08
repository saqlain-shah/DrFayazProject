// VerifyOTP.js
import React, { useState } from 'react';
import { Button, Input } from '../components/Form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function VerifyOTP() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('https://server-yvzt.onrender.com /api/auth/verifyotp', {
                otp,
            });
            if (response.status === 200) {
                toast.success('OTP verified successfully');
                navigate('/login');
            } else {
                setError('Invalid OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setError('Error verifying OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-screen flex-colo bg-dry">
            <form className="w-2/5 p-8 rounded-2xl mx-auto bg-white flex-colo" onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
                <Input
                    label="Enter OTP"
                    type="text"
                    color={true}
                    placeholder={'Enter OTP'}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                {error && <span className="text-red-500">{error}</span>}
                <div className="flex justify-between items-center mt-4">
                    <Button
                        label={loading ? 'Verifying...' : 'Verify'}
                        disabled={loading}
                        type="submit"
                    />
                </div>
            </form>
        </div>
    );
}

export default VerifyOTP;
