import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './index.css';
import useAuthCheck from '../../../redux/hooks/useAuthCheck';
import TopHeader from '../TopHeader/TopHeader';
import { Link, NavLink } from 'react-router-dom';
import img from '../../../images/logo.png';
import avatar from '../../../images/avatar.jpg';
import { Button, Popover, message } from 'antd';
import { loggedOut } from '../../../service/auth.service';
import { toast } from 'react-hot-toast';
const Header = () => {
    const { authChecked, data } = useAuthCheck();
    console.log("data in header", data)
    const [isLoggedIn, setIsLogged] = useState(false);
    const [show, setShow] = useState(true);
    const navigate = useNavigate(); // Initialize useNavigate


    const handleScroll = () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            setShow(false);
        } else {
            setShow(true);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return (() => window.removeEventListener('scroll', handleScroll));
    }, [])

    useEffect(() => { authChecked && setIsLogged(true) }, [authChecked]);

    const hanldeSignOut = () => {
        loggedOut();
        message.success("Successfully Logged Out")
        setIsLogged(false)
    }

    const content = (
        <div className='nav-popover'>
            <div className='my-2'>
                <h5 className='text-capitalize'>{data?.firstName + ' ' + data?.lastName}</h5>
                <p className='my-0'>{data?.email}</p>
                <Link to="/dashboard">Dashboard</Link>
            </div>
            <Button variant="outline-danger" className='w-100' size="sm" onClick={hanldeSignOut}>
                Logged Out
            </Button>
        </div >
    );

    const handleMakeAppointment = () => {
        const token = localStorage.getItem('token');
        console.log("Token in header", token) // Check if token exists in local storage

        if (token) {
            const clientId = data?._id; // Assuming _id is the client ID
            if (clientId) {
                navigate(`/dashboard/${clientId}`);
            } else {
                // Handle the case where the client ID is not available
                console.error("Client ID is not available");
                // Optionally, you can navigate to a default dashboard or display an error message
            }
        } else {
            toast.error("You need to login to make an appointment", {
                position: 'bottom-right'
            });
            navigate('/login'); // Navigate to login page if token doesn't exist
        }
    }





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
                            <li><NavLink to={'/'} className={({ isActive }) => isActive ? "nav-link scrollto active" : ""} >Home</NavLink></li>
                            <li><NavLink to={'/contact'} className={({ isActive }) => isActive ? "nav-link scrollto active" : ""}>Contact</NavLink></li>
                            {!isLoggedIn && <li><Link to={'/login'} className="nav-link scrollto">Login</Link></li>}
                        </ul>
                        {isLoggedIn &&
                            <div>
                                <Popover content={content}>
                                    <div className='profileImage'>
                                        <img src={data?.img ? data?.img : avatar} alt="" className="profileImage shadow img-fluid" />
                                    </div>
                                </Popover>
                            </div>
                        }
                        {/* Include mobile nav toggle component here */}
                    </nav>

                    <button onClick={handleMakeAppointment} className="appointment-btn scrollto"><span className="d-none d-md-inline">Make an</span>Make Appointment</button>
                </div>
            </header>
        </>
    )
}

export default Header;
