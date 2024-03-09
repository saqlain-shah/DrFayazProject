import React, { useState } from 'react';
import { Button, Input } from '../Form';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

function ChangePassword() {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!user) {
      console.log('User is not logged in');
      // Handle the case where the user is not logged in
      return;
    }

    // Log user ID to ensure it's correctly retrieved from authentication context
    console.log('User ID:', user.id);

    setLoading(true);
    try {
      // Validate passwords
      if (newPassword !== confirmPassword) {
        throw new Error('New password and confirm password do not match');
      }

      // Get the token from local storage
      const token = localStorage.getItem('token');

      // Make API request to change password with authorization header
      const response = await axios.put(
        'http://localhost:8800/api/auth/change-password',
        {
          userId: user.id,
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      toast.success('Password changed successfully');
      // Clear input fields
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
      {/* old password */}
      <Input
        label="Old Password"
        color={true}
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      {/* new password */}
      <Input
        label="New Password"
        color={true}
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      {/* confirm password */}
      <Input
        label="Confirm Password"
        color={true}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {/* submit */}
      <Button
        label={'Save Changes'}
        Icon={HiOutlineCheckCircle}
        onClick={handleChangePassword}
      />
    </div>
  );
}

export default ChangePassword;

