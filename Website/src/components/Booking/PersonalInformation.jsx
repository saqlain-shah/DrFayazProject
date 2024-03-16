import React from 'react';

const PersonalInformation = ({ handleChange, selectValue }) => {
    const { firstName, lastName, email, phone, reasonForVisit, description, address } = selectValue;

    return (
        <form className="rounded p-3 mt-5" style={{ background: "#f8f9fa" }}>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>First Name</label>
                        <input onChange={(e) => handleChange(e)} name='firstName' value={firstName || ''} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Last Name</label>
                        <input onChange={(e) => handleChange(e)} name='lastName' value={lastName || ''} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Email</label>
                        <input onChange={(e) => handleChange(e)} name='email' value={email || ''} className="form-control" type="email" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Phone</label>
                        <input onChange={(e) => handleChange(e)} name='phone' value={phone || ''} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-12 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Reason For Visit</label>
                        <textarea rows={8} onChange={(e) => handleChange(e)} name='reasonForVisit' value={reasonForVisit || ''} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-12 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Description</label>
                        <textarea rows={8} onChange={(e) => handleChange(e)} name='description' value={description || ''} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-12 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Address</label>
                        <input onChange={(e) => handleChange(e)} name='address' value={address || ''} className="form-control" type="text" />
                    </div>
                </div>
            </div>

        </form>
    );
};

export default PersonalInformation;
