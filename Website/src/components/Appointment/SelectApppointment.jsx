import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Card, Button, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SelectAppointment = ({ handleSelectAppointment, patientId }) => {
    const [appointmentSlots, setAppointmentSlots] = useState([]);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axios.get('https://server-yvzt.onrender.com/api/schedule');
                // No filtering on the slots here
                const filteredSlots = response.data.filter(slot => moment(slot.endDateTime).isAfter(moment()));
                setAppointmentSlots(filteredSlots);
            } catch (error) {
                console.error('Error fetching schedule:', error);
            }
        };

        fetchSchedule();
    }, []);

    const handleSlotSelection = (slotId) => {
        const selectedSlot = appointmentSlots.find(slot => slot._id === slotId);
        if (selectedSlot) {
            handleSelectAppointment(selectedSlot, patientId);
        }
    };

    if (appointmentSlots.length === 0) {
        return <div>No appointments available at this time.</div>;
    }

    return (
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Title level={4}>Select Appointment</Title>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                justifyContent: 'center',
            }}>
                {appointmentSlots.map(slot => (
                    <Card
                        key={slot._id}
                        bordered
                        style={{
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            backgroundColor: '#d1fae5',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            flex: '1 1 calc(25% - 1rem)', // Adjusted for 4 items per row
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
                            type='primary'
                            icon={<CalendarOutlined />}
                            size="small"
                        >
                            Select
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SelectAppointment;
