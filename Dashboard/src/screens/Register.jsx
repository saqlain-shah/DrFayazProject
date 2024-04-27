import React, { useState, useEffect } from 'react';
import { Button, Input } from '../components/Form';
import { BiLogInCircle } from 'react-icons/bi';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import pic from '../build/images/logo.jpg';

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const validateForm = () => {
        const errors = {};

        if (!name.trim()) {
            errors.name = 'Name is required';
        } else if (name.length < 4) {
            errors.name = 'Name must be at least 4 characters long';
        }

        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
        }

        if (!password.trim()) {
            errors.password = 'Password is required';
        } else if (password.length < 8) {
            errors.password = 'Password must be at least 8 characters long';
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8800/api/auth/register', {
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
                    {errors.name && <span className="text-red-500">{errors.name}</span>}
                    <Input
                        label="Email"
                        type="email"
                        color={true}
                        placeholder={'admin@gmail.com'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <span className="text-red-500">{errors.email}</span>}
                    <Input
                        label="Password"
                        type="password"
                        color={true}
                        placeholder={'*********'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <span className="text-red-500">{errors.password}</span>}
                </div>
                <div className="flex justify-between items-center">
                    <Button
                        label={loading ? 'Registering...' : 'Register'}
                        Icon={BiLogInCircle}
                        disabled={loading}
                        type="submit"
                    />
                    
                </div>
                <div className="text-center mt-4">
                    <span>Already have an account? </span>
                    <button className="text-blue-500" onClick={handleLoginClick}>
                        Login
                    </button>
                </div>
            </form>
        </div>
        
    );
}

export default Register;

function Modal({ closeModal, isOpen, width, children, title }) {
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
  
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-300"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`w-full ${width ? width : 'max-w-4xl'
                    } transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}
                >
                  <div className="w-full flex-btn gap-2 mb-8">
                    <h1 className="text-md font-semibold">{title}</h1>
                    <button
                      onClick={closeModal}
                      className="w-14 h-12 bg-dry text-red-600 rounded-md flex-colo"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }
