import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useParams } from 'react-router-dom';
import useAuthCheck from '../../redux/hooks/useAuthCheck';
import { FaTable, FaUserInjured, FaUserCog, FaLock, FaHouseUser, FaSignOutAlt } from "react-icons/fa";
import img from '../../images/doc/doc4.jpg';
import './DashboardSidebar.css';

const DashboardSidebar = () => {
    const { data, role } = useAuthCheck()
    const params = useParams()
    const [userData, setUserData] = useState(null);
    const clientId = params.clientId
    console.log("id", clientId);
    // console.log("data", data)

    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        const config = {
            headers: {
                'Authorization': `Bearer ${token}` // Include token in the Authorization header
            }
        };
        axios.get(`http://localhost:8800/api/userauth/${params.clientId}`, config)
            .then(response => {
                console.log(response)
                setUserData(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    return (
        <div className="profile-sidebar p-3 rounded">
            <div className="p-2 text-center border-bottom">
                <div className="profile-info text-center">
                    <img src={userData ? userData.image || img : img} alt="Profile" className="profile-image" />
                    <div className='profile-details'>
                        <h5 className='mb-0'>{userData ? userData.name : 'Loading...'}</h5>
                        <div className='mt-2'>
                            <p className='form-text m-0'>{userData ? userData.address : ''}</p>
                            <p className='form-text m-0'>{userData ? userData.email : ''}</p>
                        </div>
                    </div>
                </div>
            </div>
            <nav className="dashboard-menu">
                <ul>
                    <li>
                        <NavLink to={`/dashboard/${clientId}`} activeClassName="active" end>
                            <FaTable className="icon" />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={role === 'patient' ? '/dashboard/favourite' : '/dashboard/prescription'} activeClassName="active">
                            <FaHouseUser className="icon" />
                            <span>{role === 'patient' ? 'Favourites' : 'Booking History'}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={`/dashboard/profile-setting/${clientId}`} activeClassName="active">
                            <FaUserCog className="icon" />
                            <span>Profile Settings</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/dashboard/change-password'} activeClassName="active">
                            <FaLock className="icon" />
                            <span>Change Password</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/'}>
                            <FaSignOutAlt className="icon" />
                            <span>Logout</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default DashboardSidebar;
