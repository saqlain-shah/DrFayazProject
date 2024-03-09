import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { FaBriefcase, FaRegClock, FaLocationArrow, FaLink, FaCalendarAlt } from "react-icons/fa";

const SelectAppointment = ({ selectedDate, handleDateChange, selectTime, setSelectTime }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8800/api/schdule');
            setData(response.data);
            console.log('Response data:', response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSelectTime = (date) => { 
        setSelectTime(date);
    };

    return (
        <div style={{ marginTop: '5rem' }}>
            <div className="p-3" style={{ background: '#f8f9fa' }}>
                <div className="row">
                    <div className="col-md-3 col-sm-12 mt-3 info-part border-end">
                        <p className='py-2 border-bottom info-head-date'>Would you like to schedule an Interview? Pick a Date & Time</p>
                        <div className='icon-box'>
                            <div className='d-flex gap-3'>
                                <FaBriefcase className='icon' />
                                <p>With Doctor</p>
                            </div>
                            <div className='d-flex gap-3'>
                                <FaRegClock className='icon' />
                                <p>30 Min</p>
                            </div>
                            <div className='d-flex gap-3'>
                                <FaLocationArrow className='icon' />
                                <p>Sylhet, Bangladesh<br /><span className="form-text">1020BD, Amertam, NorthEast,Srimongol</span></p>
                            </div>
                            <div className='d-flex gap-3'>
                                <FaLink className='icon' />
                                <p>Zoom Meeting</p>
                            </div>
                            <div className='d-flex gap-3'>
                                <FaCalendarAlt className='icon' />
                                <p>{(selectedDate && selectTime) && moment(selectedDate).format('LL') + ' ' + selectTime}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-5 col-sm-12 mt-3 border-end">
                        <p className='py-2 border-bottom info-head-date'>
                            {selectedDate ? `Selected - ${moment(selectedDate).format('LL')}` : 'Pick a Time'}
                        </p>
                        <div className='info-date-card row'>
                            {
                                data.map((appointment, index) => (
                                    <div key={index} className="mb-3 col-md-6" onClick={() => handleDateChange(appointment.startDateTime)}>
                                        <div className={`p-3 mb-3 rounded text-center select-date ${moment(appointment.startDateTime).format('LL') === moment(selectedDate).format('LL') ? 'active' : ''}`}>
                                            <div className='select-month'>{moment(appointment.startDateTime).format('MMMM YYYY')}</div>
                                            <div className='select-day-num'>{moment(appointment.startDateTime).format('D')}</div>
                                            <div className='select-month'>{moment(appointment.startDateTime).format('dddd')}</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className="col-md-4 col-sm-12 mt-3">
                        <p className='py-2 border-bottom info-head-date'>
                            {selectTime ? `Selected -  ${selectTime} To ${moment(selectTime, 'hh:mm A').add(30, 'minutes').format('hh:mm A')}` : 'Pick a Time'}
                        </p>

                        <div className='select-time-div'>
                            <h4>Appointment Time </h4>
                            <div className="row text-center mt-3">
                                {
                                    data.map((appointment, index) => (
                                        <div key={index} className="mb-3 col-md-6" onClick={() => handleDateChange(appointment.startDateTime)}>
                                            <div className='select-time'>{moment(appointment.startDateTime).format('hh:mm A')} - {moment(appointment.endDateTime).format('hh:mm A')}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectAppointment;
