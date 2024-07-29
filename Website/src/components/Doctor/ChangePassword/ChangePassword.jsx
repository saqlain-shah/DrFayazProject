import React, { useState, useEffect } from 'react';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import { Button, message } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';


const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const { clientId } = useParams();

    useEffect(() => {
        // Fetch user ID from localStorage
        const userId = localStorage.getItem('clientId');
        setUserId(userId);
    }, []);

    const handleChangePassword = async () => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=.*[^\w\d]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            setPasswordError('Password must have at least one number, one uppercase and lowercase letter, one special character, and be at least 8 characters long');
            return;
        }

        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        setLoading(true);
           
        try {
            const response = await axios.put(`http://localhost:8800/api/userauth/change-password/${clientId}`, { userId, oldPassword, newPassword }, config);
            message.success(response.data.message);
            setOldPassword('');
            setNewPassword('');
            setPasswordError('');
        } catch (error) {
            console.error('Error changing password:', error);
            message.error('Failed to change password');
        }finally {
            // Set loading back to false after the API call completes
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="w-100 mb-3 rounded p-2" style={{ background: '#f8f9fa' }}>
                <h5 className='text-title mt-3'>Change Your Password</h5>
                <form className='container row form-row px-5 mx-auto my-5'>
                    <div className="col-md-12">
                        <div className="form-group mb-3 card-label">
                            <label>Old Password</label>
                            <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder='Old Password' className="form-control" />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group mb-3 card-label">
                            <label>New Password</label>
                            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder='New Password' className="form-control" />
                            {passwordError && <p className="text-danger">{passwordError}</p>}
                        </div>
                    </div>
                    <div className='mt-5 text-end'>
                    <Button
                  type="primary"
                  size="large"
                  style={{ marginRight: "8px" }}
                  onClick={() => handleChangePassword()}
                >
                  {loading ? (
                    <LoadingOutlined style={{ fontSize: '24px' }} />
                  ) : (
                    <span>Save</span>
                  )}
                </Button>
                        {/* <Button onClick={handleChangePassword} type="primary" size='large'>Save Changes</Button> */}
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default ChangePassword;
