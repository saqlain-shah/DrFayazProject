import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { Button, Card, Typography, Space } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SelectAppointment = ({ handleSelectAppointment, patientId }) => {
    const [appointmentSlots, setAppointmentSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axios.get('https://server-yvzt.onrender.com/api/schedule');
                const filteredSlots = response.data.filter(slot => moment(slot.endDateTime).isAfter(moment()));
                setAppointmentSlots(filteredSlots);

                filteredSlots.forEach(slot => {
                    if (moment(slot.endDateTime).isBefore(moment())) {
                        deleteExpiredSlot(slot._id);
                    }
                });
            } catch (error) {
                console.error('Error fetching schedule:', error);
            }
        };

        fetchSchedule();
    }, []);

    const handleSlotSelection = (slotId) => {
        const selectedSlot = appointmentSlots.find(slot => slot._id === slotId);
        if (selectedSlot) {
            setSelectedSlot(selectedSlot);
            handleSelectAppointment(selectedSlot, patientId);
        }
    };

    if (!appointmentSlots || appointmentSlots.length === 0) {
        return <div>No appointments available at this time.</div>;
    }

    return (
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '1200px' }}>
                <Title level={4}>Select Appointment</Title>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}>
                    {appointmentSlots.slice(0, 3).map((slot) => (
                        <Card
                            key={slot._id}
                            bordered
                            style={{
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                backgroundColor: selectedSlot && selectedSlot._id === slot._id ? '#d1fae5' : '#ffffff',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                flex: '1 1 calc(33.333% - 1rem)',
                                marginBottom: '1rem',
                            }}
                            onClick={() => handleSlotSelection(slot._id)}
                        >
                            <div style={{ marginBottom: '1rem' }}>
                                <Text strong>{moment(slot.startDateTime).format('YYYY-MM-DD')}</Text>
                                <br />
                                <Text>{moment(slot.startDateTime).format('hh:mm A')} - {moment(slot.endDateTime).format('hh:mm A')}</Text>
                            </div>
                            <Button
                                type={selectedSlot && selectedSlot._id === slot._id ? 'primary' : 'default'}
                                icon={<CalendarOutlined />}
                                size="small"
                                style={{
                                    transition: 'background-color 0.3s, color 0.3s',
                                }}
                            >
                                {selectedSlot && selectedSlot._id === slot._id ? 'Selected' : 'Select'}
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SelectAppointment;
