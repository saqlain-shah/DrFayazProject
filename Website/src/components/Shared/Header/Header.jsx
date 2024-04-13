import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './index.css';
import TopHeader from '../TopHeader/TopHeader';
import { Link, NavLink } from 'react-router-dom';
import img from '../../../images/dr.jpg';
import avatar from '../../../images/avatar.jpg';
import { Button, Popover, message } from 'antd';


const Header = ({ clientId }) => {
    const params = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [show, setShow] = useState(true);
    const Navigate = useNavigate();

    // This effect will run only once on component mount
    useEffect(() => {
        const authToken = localStorage.getItem('token');
        setIsLoggedIn(!!authToken); // Convert authToken to a boolean
    }, []);

    const handleMakeAppointment = () => {
        if (!isLoggedIn) {
            Navigate('/login');
        } else {
            Navigate(`/dashboard/${clientId}`);
        }
    };

    return (
        <>
            <div className={`navbar navbar-expand-lg navbar-light ${!show && "hideTopHeader"}`} expand="lg">
                <TopHeader />
            </div>
            <header id="header" className={`fixed-top ${!show && "stickyHeader"}`}>
                <div className="container d-flex align-items-center">
                    <Link to={'/'} className="logo me-auto">
                        <img src={img} alt="" className="img-fluid" />
                    </Link>
                    <nav id="navbar" className="navbar order-last order-lg-0">
                        <ul>
                            <li><NavLink to={'/'} className={({ isActive }) => isActive ? "nav-link scrollto active" : ""}>Home</NavLink></li>
                            <li><NavLink to={'/contact'} className={({ isActive }) => isActive ? "nav-link scrollto active" : ""}>Contact</NavLink></li>
                            {!isLoggedIn && <li><Link to={'/login'} className="nav-link scrollto">Login</Link></li>}
                        </ul>
                        {isLoggedIn &&
                            <div>
                                <Popover>
                                    <div className='profileImage'>
                                     
                                    </div>
                                </Popover>
                            </div>
                        }
                    </nav>
                    <button className="appointment-btn scrollto" onClick={handleMakeAppointment}>
                        <span className="d-none d-md-inline">Make an</span> Appointment
                    </button>
                </div>
            </header>
        </>
    );
};

export default Header;
