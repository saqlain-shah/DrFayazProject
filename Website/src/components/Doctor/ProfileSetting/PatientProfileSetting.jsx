import React, { useEffect, useRef, useState } from 'react'
//import Calendar from 'react-calendar';
//import 'react-calendar/dist/Calendar.css';
//import moment from 'moment';
import { useForm } from 'react-hook-form';
import { Await, Link, useParams } from 'react-router-dom';
import { useUpdatePatientMutation } from '../../../redux/api/patientApi';
//import useAuthCheck from '../../../redux/hooks/useAuthCheck';
import { message } from 'antd';
import ImageUpload from '../../UI/form/ImageUpload';
import pImage from '../../../images/avatar.jpg'
import axios from 'axios';

const PatientProfileSetting = () => {
    const params = useParams();
    // const { data } = useAuthCheck();
    const [data, setData] = useState();
    // const { register, handleSubmit } = useForm({});
    const [userId, setUserId] = useState('');
    const [selectBloodGroup, setSelectBloodGroup] = useState('');
    const [selectValue, setSelectValue] = useState({})
    const [value, setValue] = useState(undefined);
    const [showCalendar, setShowCalendar] = useState(false);
    const buttonRef = useRef(null);
    const [updatePatient, { isSuccess, isError, error, isLoading }] = useUpdatePatientMutation();

    const [selectedImage, setSelectedImage] = useState(null);
    const [file, setFile] = useState(null);

    const handleDateChange = (date) => {
        setValue(date);
    };
    const handleButtonClick = () => {
        setShowCalendar(!showCalendar);
    };
    const handleClickOutside = (event) => {
        if (buttonRef.current && !buttonRef.current.contains(event.target)) {
            setShowCalendar(false);
        }
    };
    const fetchData = async (params) => {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        const config = {
            headers: {
                'Authorization': `Bearer ${token}` // Include token in the Authorization header
            }
        };
        await axios.get(`http://localhost:8800/api/userauth/${params.clientId}`, config)
            .then(response => {
                console.log(response)
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });

    }

    useEffect(() => {
        fetchData(params);
        if (data) {
            setUserId(data.id);
            setSelectBloodGroup(data?.bloodGroup);
            // Set selectValue for bloodGroup and gender based on fetched data
            setSelectValue({
                bloodGroup: data?.bloodGroup || '', // Ensure it's set to empty string if data not available
                gender: data?.gender || '' // Ensure it's set to empty string if data not available
            });
        }
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!isLoading && isError) {
            message.error(error?.data?.message)
        }
        if (isSuccess) {
            message.success('Successfully Profile Updated')
        }
    }, [isLoading, isError, error, isSuccess])

    const handleChange = (e) => {
        const { name, value } = e.target;

        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };




    const handleSubmit = async () => {
        console.log("dATA", data)
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            const response = await axios.put(`http://localhost:8800/api/userauth/${params.clientId}`, data, config);
            console.log('Response:', response);
            message.success('Successfully Profile Updated');
            // Refetch data after successful update
            fetchData(params);
        } catch (error) {
            console.error('Error updating profile:', error);
            message.error(error?.response?.data?.message || 'Failed to update profile');
        }
    };





    return (
        <div style={{ marginBottom: '10rem' }}>
            <div className="w-100 rounded mb-5 p-2" style={{ background: '#f8f9fa' }}>
                <h5 className="text-title mb-2 mt-3">Update Your Information</h5>
                <div className="row form-row" >
                    <div className="col-md-12">
                        <div className="form-group">
                            <div className='change-avatar d-flex gap-2 align-items-center'>
                                <img
                                    src={selectedImage ? selectedImage : (data?.img || pImage)}
                                    alt=""
                                    style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }} // Set width, height, and styling
                                />
                                <div>
                                    <ImageUpload setSelectedImage={setSelectedImage} setFile={setFile} />
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Full Name <span className="text-danger">*</span></label>
                            <input defaultValue={data?.name} className="form-control" disabled />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Email <span className="text-danger">*</span></label>
                            <input defaultValue={data?.email} className="form-control" disabled />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Emergency Contact</label>
                            <input defaultValue={data?.emergencyContact}
                                type='number'
                                name='emergencyContact'
                                value={data?.emergencyContact}
                                onChange={handleChange}
                                // {...register("emergencyContact")} 
                                className="form-control" />

                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-2">
                            <label>Gender</label>
                            <select
                                className="form-control select"
                                onChange={handleChange}
                                name='gender'
                                value={data?.gender} // Update value to reflect selectValue state
                            >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Blood Group</label>
                            <select
                                className="form-control select"
                                onChange={handleChange}
                                name='bloodGroup'
                                value={data?.bloodGroup} // Update value to reflect selectValue state
                            >
                                <option value="">Select</option>
                                <option value="AB+ve">AB+ve</option>
                                <option value="AB-ve">AB-ve</option>
                                <option value="A+ve">A+ve</option>
                                <option value="A-ve">A-ve</option>
                                <option value="B+ve">B+ve</option>
                                <option value="B-ve">B-ve</option>
                                <option value="O+ve">O+ve</option>
                                <option value="O-ve">O-ve</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Address</label>
                            <input defaultValue={data?.address}
                                name='address'
                                value={data?.address}
                                onChange={handleChange}
                                //  {...register("address")}
                                className="form-control" />
                        </div>
                    </div>
                    <div className='text-center'>
                        <button onClick={handleSubmit} className="btn btn-primary my-3" disabled={isLoading ? true : false}>{isLoading ? 'Updating..' : 'Save Changes'}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PatientProfileSetting