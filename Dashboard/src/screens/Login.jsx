import React, { useState, useEffect } from 'react';
import { Button, Input } from '../components/Form';
import { BiLogInCircle } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../AuthContext';

function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8800/api/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, id } = response.data; // Extract token and id from the response data
        login({ id }); // Update authentication state with the user's ID

        // Store the token in local storage
        localStorage.setItem('token', token);
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
          src="/images/logo.png"
          alt="logo"
          className="w-48 h-16 object-contain mb-4"
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
            label={loading ? 'Logging in...' : 'Login'}
            Icon={BiLogInCircle}
            disabled={loading}
            type="submit"
          />
          <div style={{ marginLeft: '10px' }}>
            <Button
              label="Register"
              onClick={handleRegisterClick}
              color="primary"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
