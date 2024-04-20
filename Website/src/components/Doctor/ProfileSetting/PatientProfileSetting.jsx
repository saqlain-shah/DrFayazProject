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

    const [selectedImage, setSelectedImage] = useState('');
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
        await axios.get(`https://server-yvzt.onrender.com/api/userauth/${params.clientId}`, config)
            .then(response => {
                console.log(response)
                const imagePath = `https://server-yvzt.onrender.com/${response.data.image}`
                response.data.image = imagePath;
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

    const handleFileChange = (e) => {
        console.log('File input changed');
        console.log('Event object:', e);
        const selectedFile = e.target.files[0];
        console.log('Selected File:', selectedFile); // Log the selected file
        setSelectedImage(URL.createObjectURL(selectedFile)); // Update the preview of the selected image
        setFile(selectedFile); // Set the file state with the selected file
    };


    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                // Do not set content type here, let FormData handle it automatically
            }
        };

        const formData = new FormData();

        // Append the image file to FormData only if it exists
        if (file) {
            formData.append('image', file);
        }

        // Append other data fields to FormData
        for (const key in data) {
            formData.append(key, data[key]);
        }

        console.log('FormData:', formData);

        try {
            // Send PUT request with FormData
            const response = await axios.put(`https://server-yvzt.onrender.com/api/userauth/${params.clientId}`, formData, config);
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
                                    src={selectedImage ? selectedImage : (data?.image || pImage)}
                                    alt=""
                                    style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
                                />
                                <div>
                                    <input type="file"  onChange={handleFileChange} />
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
                    <div className='text-end'>
                        <button onClick={handleSubmit} className="btn btn-primary my-3" disabled={isLoading ? true : false}>{isLoading ? 'Updating..' : 'Save Changes'}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PatientProfileSetting