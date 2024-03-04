import React, { useState } from 'react';
import { Button, Input } from '../Form';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function ChangePassword({ userId }) {
  console.log("ChangePassword component received userId:", userId);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    try {
      // Check if new password matches confirmation
      if (newPassword !== confirmPassword) {
        return toast.error('New password and confirm password do not match');
      }

      // Make API request to change password
      await axios.put(`http://localhost:8800/api/patients/${userId}/change-password`, {
        oldPassword,
        newPassword,
      });

      toast.success('Password changed successfully');
      // Clear input fields
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    }
  };


  return (
    <div className="flex-colo gap-4">
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
