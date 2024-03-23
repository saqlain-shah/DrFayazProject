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

const Header = () => {
    const { authChecked, data } = useAuthCheck();
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

    // const handleMakeAppointment = () => {
    //     if (!isLoggedIn) {
    //         navigate('/login'); // Navigate to the login page using navigate
    //     } else {
    //         // Handle appointment logic if user is logged in
    //     }
    // }

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

                    <Link to={'/appointment'} className="appointment-btn scrollto"><span className="d-none d-md-inline">Make an</span> Appointment</Link>
                </div>
            </header>
        </>
    )
}

export default Header;
