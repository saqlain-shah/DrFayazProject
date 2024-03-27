import React, { useEffect } from 'react';
import { Button } from 'antd';

const PersonalInformation = ({ handleChange, selectValue, onNext, onPrev, selectedSlot }) => {
    const { firstName, dateOfVisit, reasonForVisit, bloodGroup, gender } = selectValue;

    useEffect(() => {
        if (selectedSlot) {
            // Extract user data from the selected slot
            const { patientName, dateOfVisit, reasonForVisit } = selectedSlot;
            console.log('Populating User Data:', { patientName, dateOfVisit, reasonForVisit }); // Log user data
            // Set the user data in the state
            handleChange({ target: { name: 'firstName', value: patientName } });
            handleChange({ target: { name: 'dateOfVisit', value: dateOfVisit } });
            handleChange({ target: { name: 'reasonForVisit', value: reasonForVisit } });
        }
    }, [selectedSlot]);

    const handleNext = () => {
        // Call the onNext function passed from the parent component to move to the next step
        onNext();
    };

    const handlePrev = () => {
        // Call the onPrev function passed from the parent component
        onPrev();
    };

    return (
        <form className="rounded p-3 mt-5" style={{ background: "#f8f9fa" }}>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Full Name</label>
                        <input onChange={(e) => handleChange(e)} name='firstName' value={firstName || ''} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Date of Visit</label>
                        <input onChange={(e) => handleChange(e)} name='dateOfVisit' value={dateOfVisit || ''} className="form-control" type="date" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Blood Group</label>
                        <input onChange={(e) => handleChange(e)} name='bloodGroup' value={bloodGroup || ''} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Gender</label>
                        <input onChange={(e) => handleChange(e)} name='gender' value={gender || ''} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-12 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Reason For Visit</label>
                        <textarea rows={8} onChange={(e) => handleChange(e)} name='reasonForVisit' value={reasonForVisit || ''} className="form-control" type="text" />
                    </div>
                </div>
            </div>
            <div className="text-end">
                <Button
                    type="primary"
                    size="large"
                    style={{ marginRight: '8px' }}
                    onClick={handleNext}
                    disabled={!firstName || !dateOfVisit || !bloodGroup || !gender || !reasonForVisit}
                >
                    Next
                </Button>
                <Button
                    size="large"
                    onClick={handlePrev}
                >
                    Previous
                </Button>
            </div>
        </form>
    );
};

export default PersonalInformation;
