import React from 'react';
import './InfoPage.css';
import { FaClock, FaHeadset, FaHouseUser } from "react-icons/fa";
import { Link } from 'react-router-dom';

const InfoPage = () => {
    return (
        <section id="why-us" className="why-us">
            <div className="container">

                <div className="row">
                    <div className="col-lg-4 d-flex align-items-stretch">
                        <div className="content">
                            <h3>About Us</h3>
                            <p>
                               <b>Dr Fayaz Sarwar</b> 
                                MBBS, MRCGP Int.
                                Trained and working in UK
                                Founder of Healthline
                                Your health, our responsibility<br/>

                               <b>Expertise:</b> <br/>
                                To make it simple “I am your family doctor and will look after each member of your family from even before birth till death”
                                I am a consultant in family health. I have distinct expertise and experience in providing whole person medical care whilst managing the complexity, uncertainty and risk associated with the continuous care. I strive to provide comprehensive and equitable care for everyone, taking into account their health care needs, stage of life and background. I work in, connect with and lead multidisciplinary teams that care for people and their families, respecting the context in which they live, aiming to ensure all of their physical and mental health needs are met.

                            </p>
                            <div className="text-center">
                                <Link href="/" className="more-btn">Learn More <i className="bx bx-chevron-right"></i></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8 d-flex align-items-stretch">
                        <div className="icon-boxes d-flex flex-column justify-content-center">
                            <div className="row">
                                <div className="col-xl-4 d-flex align-items-stretch">
                                    <div className="icon-box mt-4 mt-xl-0">
                                        <FaHouseUser className="icon" />
                                        <h4>Appointment</h4>
                                        <small className='text-secondary'>24 Hours Service</small>
                                        <p>Consequuntur sunt aut quasi enim aliquam quae harum pariatur laboris nisi ut aliquip</p>
                                    </div>
                                </div>
                                <div className="col-xl-4 d-flex align-items-stretch">
                                    <div className="icon-box mt-4 mt-xl-0">
                                        <FaHeadset className="icon" />
                                        <h4>Emegency Cases</h4>
                                        <h6 className='text-secondary'>+88 01751 040425</h6>
                                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui facilis perferendis quia maxime. Laborum excepturi pariatur laboriosam nihil, dolor molestias.</p>
                                    </div>
                                </div>
                                <div className="col-xl-4 d-flex align-items-stretch">
                                    <div className="icon-box mt-4 mt-xl-0">
                                        <FaClock className="icon" />
                                        <h4>Working Hours</h4>
                                        <small className='text-secondary'>Timing schedule</small>
                                        <ul className='list-group list-group-flush'>
                                            <li class="list-group-item d-flex justify-content-between text-nowrap" ><p>Sun - Wed : </p> <p>8:00 - 17: 00</p></li>
                                            <li class="list-group-item d-flex justify-content-between text-nowrap" ><p>Thus - Fri : </p> <p>9:00 - 17: 00</p></li>
                                            <li class="list-group-item d-flex justify-content-between text-nowrap" ><p>Sat - Sun : </p> <p>10:00 - 17: 00</p></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default InfoPage