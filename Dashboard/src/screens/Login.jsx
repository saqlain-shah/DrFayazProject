import React, { useState } from 'react';
import { Button, Input } from '../components/Form';
import { BiLogInCircle } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send a POST request to your authentication endpoint
      const response = await axios.post('http://localhost:8800/api/auth/login', {
        email,
        password,
      });
      if (response.status === 200) {
        toast.success('Login successful');
        navigate('/');
      } else {
        // Handle other status codes if needed
        console.error('Login failed:', response.data);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Error logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex-colo bg-dry">
      <form className="w-2/5 p-8 rounded-2xl mx-auto bg-white flex-colo" onSubmit={handleSubmit}>
        <img
          src="/images/logo.png"
          alt="logo"
          className="w-48 h-16 object-contain"
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
        <Button
          label={loading ? 'Logging in...' : 'Login'}
          Icon={BiLogInCircle}
          disabled={loading}
          type="submit"
        />
      </form>
    </div>
  );
}

export default Login;
