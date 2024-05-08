import React from 'react';
import './index.css';
import img from '../../../images/features/15.jpeg'
import img2 from '../../../images/features/11.jpeg'
import img3 from '../../../images/features/12.jpeg'
import { Link } from 'react-router-dom';

const Service = () => {
    return (
        <section className="container" style={{marginTop: 200, marginBottom:200}}>
            <div className='mb-5 section-title text-center'>
                <h2>Services</h2>
                <p className='m-0'>24 Hours Service
Available round the clock, we're here whenever you need us. Our services are accessible 24/7, ensuring assistance is always at your fingertips..</p>
            </div>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-4 col-sm-6">
                        <div className="service-img">
                            <img src={img} alt="" className="img-fluid" />
                            <img src={img2} alt="" className="img-fluid mt-4" />
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6">
                        <div className="service-img mt-4 mt-lg-0">
                            <img src={img3} alt="" className="img-fluid" />
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="service-content ps-4 mt-4 mt-lg-0">
                            <h2>Holistic  care <br />of Whole Family </h2>
                            <p className="mt-4 mb-5 text-secondary form-text">Providing top-tier healthcare services tailored to meet your needs, ensuring your well-being and peace of mind .</p>
                           
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Service