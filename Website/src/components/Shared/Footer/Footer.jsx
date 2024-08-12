import React from 'react';
import log from '../../../images/doc/dr.png';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faYoutube, faLinkedin} from '@fortawesome/free-brands-svg-icons';
import { faMapMarkerAlt, faPhone ,faEnvelope} from '@fortawesome/free-solid-svg-icons'; // Importing solid icons

export default function App() {
    return (
        <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>
            <section className='d-flex justify-content-center justify-content-lg-between'>

            </section>

            <section className='mt-5'>
                <MDBContainer className='text-center text-md-start mt-150'>
                    <MDBRow className='mt-5'>
                        <MDBCol md='3' lg='4' xl='3' className='mx-auto mb-100'>
                            <h4 className='text-uppercase fw-bold mt-5'>
                                <MDBIcon color='secondary' icon='gem' className='me-3' />
                                Avicena Health Care
                            </h4>
                           

                        </MDBCol>

                        <MDBCol md='3' lg='2' xl='2' className='mx-auto '>
                            <h6 className='text-uppercase fw-bold mb-2'>Useful links</h6>
                            <p>
                                <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FontAwesomeIcon icon={faFacebook} /></a>
                                <span>Facebook</span>
                            </p>
                            <p>
                                <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FontAwesomeIcon icon={faInstagram} /></a>
                                <span>Instagram</span>
                            </p>
                            <p>
                                <a href="https://www.youtube.com/shorts/x7ltw4erzwM" className="text-gray-400 hover:text-white transition duration-300"><FontAwesomeIcon icon={faYoutube} /></a>
                                <span>You Tube</span>
                            </p>
                            <p>
                                <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FontAwesomeIcon icon={faLinkedin} /></a>
                                <span>Linkedin</span>
                            </p>
                            <p>
                                <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FontAwesomeIcon icon={faTwitter} /></a>
                                <span>Twitter</span>
                            </p>
                        </MDBCol>

                        <MDBCol md='4' lg='3' xl='3' className='mx-auto mb-md-0 mb-4'>
                            <h6 className='text-uppercase fw-bold mb-2'>Contact</h6>
                            <p><FontAwesomeIcon icon={faMapMarkerAlt} /> 123 Street Name, City</p>
                            <p><FontAwesomeIcon icon={faEnvelope} /> appointment@avicenahealthcare.com</p>
                            <p><FontAwesomeIcon icon={faPhone} /> +44 7579 389649</p>

                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </section>
            
            <div className=' p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)',display: 'flex', justifyContent: 'space-between'}}>
               <span>
               © 2024 Copyright: 
                <a className='text-reset fw-bold ' href='https://www.avicenahealthcare.com/'>
               Avicena Health Care
                </a>
                </span>
               <span>
               Developed By :  
                <a className='text-reset fw-bold ' style={{marginRight:"30px"}} href='https://netbots.tech/'>
               NetBots
                </a>
                </span>
               
            </div>
        </MDBFooter>
    );
}