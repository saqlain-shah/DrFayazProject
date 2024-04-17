import React, { useEffect, useState } from 'react';
import { Button, Tag, message } from 'antd';
import { FaRegEye, FaEdit, FaRegTimesCircle } from "react-icons/fa";
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import CustomTable from '../../UI/component/CustomTable';
import { useDeletePrescriptionMutation } from '../../../redux/api/prescriptionApi';

const Prescription = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteBlog] = useDeletePrescriptionMutation();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get("http://localhost:8800/api/web/", config);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            // Handle error, e.g., show an error message to the user
        } finally {
            setLoading(false);
        }
    };

    const deleteHandler = async (id) => {
        message.loading("Deleting ...");
        try {
            const res = await deleteBlog(id);
            if (res) {
                message.success("Successfully Deleted !!");
                fetchData(); // Fetch data again after deletion
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    const columns = [
        {
            title: 'Patient Name',
            dataIndex: 'patientInfo',
            key: 'patientName',
            render: patientInfo => patientInfo.name
        },
        {
            title: 'Service Name',
            dataIndex: 'selectedService',
            key: 'selectedService',
            render: selectedService => selectedService.name
        },
        {
            title: 'Patient Price',
            dataIndex: 'selectedService',
            key: 'selectedService',
            render: selectedService => selectedService.price
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: createdAt => dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')
        }
    ];

    return (
        <DashboardLayout>
            <div className="w-100 mb-3 rounded" style={{ background: '#f8f9fa' }}>
                <CustomTable
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    showPagination={true}
                    pageSize={20}
                    showSizeChanger={true}
                />
            </div>
        </DashboardLayout>
    );
};

export default Prescription;
