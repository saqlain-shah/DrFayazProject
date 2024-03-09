import { useEffect, useState } from 'react';
import axios from 'axios';

const PersonalInformation = ({ handleChange, selectValue }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage

            const response = await axios.post('http://localhost:8800/api/appointment', selectValue, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in request headers
                },
            });
            setData(response.data);
            console.log('Response data:', response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const { firstName, lastName, email, phone, reasonForVisit, description, address } = selectValue;

    return (
        <form className="rounded p-3 mt-5" style={{ background: "#f8f9fa" }}>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>First Name</label>
                        <input onChange={(e) => handleChange(e)} name='firstName' value={firstName && firstName} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Last Name</label>
                        <input onChange={(e) => handleChange(e)} name='lastName' value={lastName && lastName} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Email</label>
                        <input onChange={(e) => handleChange(e)} name='email' value={email && email} className="form-control" type="email" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Phone</label>
                        <input onChange={(e) => handleChange(e)} name='phone' value={phone && phone} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Reason For Visit</label>
                        <textarea rows={8} onChange={(e) => handleChange(e)} name='reasonForVisit' value={reasonForVisit && reasonForVisit} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Description</label>
                        <textarea rows={8} onChange={(e) => handleChange(e)} name='description' value={description && description} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Address</label>
                        <input onChange={(e) => handleChange(e)} name='address' value={address && address} className="form-control" type="text" />
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PersonalInformation;
