import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './index.css';
import { Link } from 'react-router-dom';

const HeroSection = ({clientId }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const Navigate = useNavigate();

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
        <section id="hero" class="d-flex align-items-center">
            <div className="container">
                <div>
                    <small>TOTAL HEALTH CARE SOLUTION</small>
                    <h1>Your Most Trusted <br />Health Partner</h1>
                    <small>Take care of your health by staying connected with us..</small>
                </div><br/>
                {/* <div className="d-flex justify-content-start gap-2">
                    <Link to={'/doctors'} className="btn-get-started scrollto">Get Started</Link>
                    <Link to={'/track-appointment'} className="btn-get-started scrollto">Track Appointment</Link>
                </div> */}
                {/* Right side button for small screens */}
                <button className="appointment-btn  d-lg-none " style={{ float: 'right', marginRight: '50%' }}
                        onClick={handleMakeAppointment}>
                        <span className="d-none d-md-inline">Make an</span> Make an Appointment
                    </button>
            </div>
        </section>
    )
}
export default HeroSection;