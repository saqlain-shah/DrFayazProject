import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Card, Typography, Button, Badge } from 'antd';
import { CalendarOutlined, CheckOutlined } from '@ant-design/icons';
import BASE_URL from '../../baseUrl.jsx';
const { Title, Text } = Typography;
const SelectAppointment = ({ handleSelectAppointment, patientId }) => {
    const [appointmentSlots, setAppointmentSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [viewNextDay, setViewNextDay] = useState(false);
    const fetchAndUpdateSlots = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/schedule`);
            const allSlots = response.data;
            const nowUTC = moment.utc();
            const uniqueSlotSet = new Set();
            const processedSlots = [];
            allSlots.forEach(slot => {
                const start = moment.utc(slot.startDateTime);
                const end = moment.utc(slot.endDateTime);
                const slotKey = `${start.unix()}-${end.unix()}`;

                if (!uniqueSlotSet.has(slotKey)) {
                    uniqueSlotSet.add(slotKey);
                    processedSlots.push({
                        ...slot,
                        startDateTime: start,
                        endDateTime: end,
                    });
                }
            });
            const futureSlots = processedSlots.filter(slot => moment(slot.startDateTime).isAfter(nowUTC));
            setAppointmentSlots(futureSlots);

        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };
    useEffect(() => {
        fetchAndUpdateSlots();
        const interval = setInterval(fetchAndUpdateSlots, 60000); // Check for updates every minute
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    const handleSlotSelection = (slot) => {
        setSelectedSlot(slot._id);
        handleSelectAppointment(slot, patientId);
    };
    const toggleViewDay = () => {
        setViewNextDay(prevState => !prevState);
    };
    const filteredSlots = appointmentSlots.filter(slot => {
        const slotDate = moment(slot.startDateTime).format('YYYY-MM-DD');
        const today = moment().format('YYYY-MM-DD');
        const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');
        return viewNextDay ? slotDate === tomorrow : slotDate === today;
    });
    if (filteredSlots.length === 0) {
        return <div>No appointments available. Please check again later.</div>;
    }
    return (
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Title level={4}>Select Appointment</Title>
            <Button 
                onClick={toggleViewDay} 
                style={{ 
                    marginBottom: '1rem',
                    alignSelf: 'flex-start', // Moves the button to the left
                    backgroundColor: '#1890ff', // Blue color for the button
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    fontWeight: 'bold',
                    borderRadius: '5px',
                    transition: 'background-color 0.3s',
                }}
                hoverable
            >
                {viewNextDay ? 'View Today Slots' : 'View Next Day Slots'}
            </Button>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                justifyContent: 'center',
            }}>
                {filteredSlots.map(slot => (
                    <Card
                        key={slot._id}
                        bordered={false}
                        style={{
                            position: 'relative',
                            borderRadius: '8px',
                            boxShadow: selectedSlot === slot._id ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s',
                            flex: '1 1 calc(25% - 1rem)',
                            marginBottom: '1rem',
                            padding: '1rem',
                            textAlign: 'center',
                            backgroundColor: selectedSlot === slot._id ? '#e6f7ff' : '#fff',
                            border: selectedSlot === slot._id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                        }}
                        hoverable
                        bodyStyle={{
                            padding: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                        onClick={() => handleSlotSelection(slot)}
                    >
                        {selectedSlot === slot._id && (
                            <Badge
                                count={<CheckOutlined style={{ color: '#fff', fontSize: '1.5rem' }} />}
                                style={{ position: 'absolute', top: '90px', right: '-90px', backgroundColor: '#1890ff', borderRadius: '50%' }}
                            />
                        )}
                        <div style={{ marginBottom: '1rem' }}>
                            <Text strong style={{ display: 'block' }}>{slot.startDateTime.format('YYYY-MM-DD')}</Text>
                            <Text>{slot.startDateTime.utc().format('hh:mm A')} - {slot.endDateTime.utc().format('hh:mm A')} (GMT)</Text>
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
