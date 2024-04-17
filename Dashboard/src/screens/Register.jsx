import React, { useState, useEffect } from 'react';
import { Button, Input } from '../components/Form';
import { BiLogInCircle } from 'react-icons/bi';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import pic from '../build/images/logo.jpg'
function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('https://server-yvzt.onrender.com/api/auth/register', {
                name,
                email,
                password,
            });
            if (response.status === 201) {
                const token = response.data.token;

                // Store the token, name, and email in local storage
                localStorage.setItem('token', token);
                localStorage.setItem('name', name);
                localStorage.setItem('email', email);

                document.cookie = `token=${token}; path=/; SameSite=Strict; Secure`;
                toast.success('Registration successful');
                navigate('/login');
            } else {
                console.error('Registration failed:', response.data);
            }
        } catch (error) {
            console.error('Error registering:', error);
            toast.error('Error registering');
        } finally {
            setLoading(false);
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    if (isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="w-full h-screen flex-colo bg-dry">
            <form className="w-2/5 p-8 rounded-2xl mx-auto bg-white flex-colo" onSubmit={handleSubmit}>
                <img
                    src={pic}
                    alt="logo"
                    className="w-48 h-16 object-contain"
                />
                <div className="flex flex-col gap-4 w-full mb-6">
                    <Input
                        label="Name"
                        type="text"
                        color={true}
                        placeholder={'John Doe'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        label="Email"
                        type="email"
                        color={true}
                        placeholder={'admin@gmail.com'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        label="Password"
                        type="password"
                        color={true}
                        placeholder={'*********'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <Button
                        label={loading ? 'Registering...' : 'Register'}
                        Icon={BiLogInCircle}
                        disabled={loading}
                        type="submit"
                    />
                    <div style={{ marginLeft: '10px' }}>
                        <Button
                            label="Login"
                            onClick={handleLoginClick}
                            color="primary"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Register;
