import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './index.css';
import useAuthCheck from '../../../redux/hooks/useAuthCheck';
import TopHeader from '../TopHeader/TopHeader';
import { Link, NavLink } from 'react-router-dom';
import img from '../../../images/logo.png';
import avatar from '../../../images/avatar.jpg';
import { Button, Popover, message } from 'antd';
import { loggedOut } from '../../../service/auth.service';

const Header = () => {
    const params = useParams();
    const { authChecked, data } = useAuthCheck();
    console.log("useAuthCheck", authChecked, data)
    const [isLoggedIn, setIsLogged] = useState(false);
    const [show, setShow] = useState(true);
    const Navigate = useNavigate();
    console.log("Param", params.clientId)
    const clientId = params.clientId;
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
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (authChecked) setIsLogged(true);
    }, [authChecked]);

    const hanldeSignOut = () => {
        loggedOut();
        message.success("Successfully Logged Out")
        setIsLogged(false)
    }

    const handleMakeAppointment = () => {
        if (isLoggedIn) {
            Navigate(`/dashboard/${clientId}`);
        } else {
            Navigate('/login');
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
                                <Popover >
                                    <div className='profileImage'>
                                        <img src={data?.img ? data?.img : avatar} alt="" className="profileImage shadow img-fluid" />
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
    )
}

export default Header;
