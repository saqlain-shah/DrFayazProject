import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './index.css';
import TopHeader from '../TopHeader/TopHeader';
import { Link, NavLink } from 'react-router-dom';
import img from '../../../images/dr1.jpg';
import avatar from '../../../images/avatar.jpg';
import { Button, Popover, message } from 'antd';


const Header = ({ clientId }) => {
    const params = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [show, setShow] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false); // State to control the dropdown
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
                        <img src={img} alt="" className="img-fluid w-32 h-20" />
                    </Link>

                    {/* Render different elements based on screen size */}
                    <nav id="navbar" className="navbar order-last order-lg-0">
                        <ul className="d-none d-lg-flex">
                            <li><NavLink to={'/'} className={({ isActive }) => isActive ? "nav-link scrollto active" : ""}>Home</NavLink></li>
                            <li><NavLink to={'/contact'} className={({ isActive }) => isActive ? "nav-link scrollto active" : ""}>Contact</NavLink></li>
                            {!isLoggedIn && <li><Link to={'/login'} className="nav-link scrollto">Login</Link></li>}
                        </ul>
                        {isLoggedIn &&
                            <div className='profileImage'>
                                {/* Profile Image */}
                            </div>
                        }
                    </nav>

                    {/* Button for making an appointment */}
                    <button className="appointment-btn scrollto d-none d-lg-block" onClick={handleMakeAppointment}>
                        <span className="d-none d-md-inline">Make an</span> Appointment
                    </button>

                    {/* Dropdown Menu for Small Screens */}
                    <div className="dropdown d-lg-none ml-auto">
                        <button className="btn btn-secondary dropdown-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)}>
                            Menu
                        </button>
                        <div className={`dropdown-menu ${menuOpen ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
                            <NavLink to={'/'} className="dropdown-item">Home</NavLink>
                            <NavLink to={'/contact'} className="dropdown-item">Contact</NavLink>
                            {!isLoggedIn && <Link to={'/login'} className="dropdown-item">Login</Link>}
                            <button className="dropdown-item" onClick={handleMakeAppointment}>Make an Appointment</button>
                        </div>
                    </div>
                </div>
            </header>
            {/* CSS styles */}
            <style>
                {`
                /* Style for dropdown menu */
                .dropdown-menu {
                    border: none;
                    background-color: #fff;
                    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
                    padding: 10px 0;
                    transition: all 0.3s ease;
                    z-index: 999;
                }

                .dropdown-menu a {
                    color: #333;
                    text-decoration: none;
                    display: block;
                    padding: 10px 20px;
                    transition: all 0.3s ease;
                }

                .dropdown-menu a:hover {
                    background-color: #f5f5f5;
                    color: #555;
                }

                .dropdown-toggle:hover + .dropdown-menu {
                    display: block;
                }

                .dropdown-menu.show {
                    display: block;
                }

                .dropdown-menu .dropdown-item {
                    font-size: 16px;
                    line-height: 24px;
                }
                `}
            </style>
        </>
    );
};

export default Header;
