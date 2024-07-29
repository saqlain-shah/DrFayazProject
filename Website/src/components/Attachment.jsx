import React from 'react';
import Dropzone from './DropZone.jsx'
import DashboardLayout from './Doctor/DashboardLayout/DashboardLayout.jsx';
const Attachments = ({ attachments, handleFileChange }) => {
    return (
        <DashboardLayout>
        <div className="col-md-12 col-sm-12">
            <div className="form-group card-label mb-3">
                <label>Attachments</label>
                <Dropzone
                    handleChange={handleFileChange}
                    files={attachments}
                />
            </div>
        </div>
        </DashboardLayout>
    );
};

export default Attachments;
