import React, { useState, useEffect } from 'react';
import { Button, Input } from '../components/Form';
import { BiLogInCircle } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../AuthContext';
import pic from '/images/dr.jpg';

function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
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
      const response = await axios.post('https://server-yvzt.onrender.com/api/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, id, name } = response.data;
        login({ id, name });
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        document.cookie = `token=${token}; path=/; SameSite=Strict; Secure`;
        toast.success('Login successful');
        navigate('/');
      } else {
        console.error('Login failed:', response.data);
        toast.error('Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Error logging in');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="w-full h-screen flex-colo bg-dry">
      <form className="w-2/5 p-8 rounded-2xl mx-auto bg-white flex-colo" onSubmit={handleSubmit}>
        <img
          src={pic}
          alt="logo"
          className="w-48 h-26 object-contain mb-4"
        />
        <div className="flex flex-col gap-4 w-full mb-6">
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
            label={loading ? 'Logging in...' : 'Login'}
            Icon={BiLogInCircle}
            disabled={loading}
            type="submit"
          />
        </div>
        <div className="text-center mt-4">
                    <span>Create an account? </span>
                    <button className="text-blue-500" onClick={handleRegisterClick}>
                    Register
                    </button>
                </div>
      </form>
    </div>
  );
}

export default Login;
