import React, { useState } from 'react';
import { Button, Input } from '../Form';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import BASE_URL from '../../baseUrl.jsx';

function ChangePassword() {
  const { user, updateUser } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!user) {
      console.log('User is not logged in');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }
    if (oldPassword === newPassword) {
      toast.error('New password must be different from old password');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/auth/change-password`,
        {
          userId: user.id,
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex-col gap-4">
      <Input
        label="Old Password"
        color={true}
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <Input
        label="New Password"
        color={true}
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Input
        label="Confirm Password"
        color={true}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button
        label={'Save Changes'}
        Icon={HiOutlineCheckCircle}
        onClick={handleChangePassword}
      />
    </div>
  );
}

export default ChangePassword;
