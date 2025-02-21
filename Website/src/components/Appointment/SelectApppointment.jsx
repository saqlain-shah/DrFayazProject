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

            const futureSlots = processedSlots.filter(slot =>
                moment(slot.endDateTime).isAfter(nowUTC)
            );
            setAppointmentSlots(futureSlots);
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };

    useEffect(() => {
        fetchAndUpdateSlots();
        const interval = setInterval(fetchAndUpdateSlots, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    const handleSlotSelection = (slot) => {
        setSelectedSlot(slot._id);
        handleSelectAppointment(slot, patientId);
    };

    const today = moment().format('YYYY-MM-DD');
    const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');

    const todaySlots = appointmentSlots.filter(
        slot => slot.startDateTime.format('YYYY-MM-DD') === today
    );
    const tomorrowSlots = appointmentSlots.filter(
        slot => slot.startDateTime.format('YYYY-MM-DD') === tomorrow
    );

    const filteredSlots = viewNextDay ? tomorrowSlots : todaySlots;

    const renderNoSlotsMessage = () => {
        if (!viewNextDay && todaySlots.length === 0) {
            return (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Text>No time slots for today. You can check tomorrow's slots.</Text>
                    <br />
                    <Button
                        onClick={() => setViewNextDay(true)}
                        style={{
                            marginTop: '1rem',
                            backgroundColor: '#1890ff',
                            color: '#fff',
                            border: 'none',
                            fontWeight: 'bold',
                            borderRadius: '5px',
                        }}
                    >
                        View Tomorrow's Slots
                    </Button>
                </div>
            );
        }

        if (viewNextDay && tomorrowSlots.length === 0) {
            return (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Text>No time slots for tomorrow. Please check again later.</Text>
                </div>
            );
        }

        return null;
    };

    return (
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Title level={4}>Select Appointment</Title>
            <div style={{ marginBottom: '1rem' }}>
                <Button
                    onClick={() => setViewNextDay(false)}
                    style={{
                        marginRight: '1rem',
                        backgroundColor: !viewNextDay ? '#1890ff' : '#f0f0f0',
                        color: !viewNextDay ? '#fff' : '#000',
                        border: 'none',
                        fontWeight: 'bold',
                        borderRadius: '5px',
                    }}
                >
                    Today Slots
                </Button>
                <Button
                    onClick={() => setViewNextDay(true)}
                    style={{
                        backgroundColor: viewNextDay ? '#1890ff' : '#f0f0f0',
                        color: viewNextDay ? '#fff' : '#000',
                        border: 'none',
                        fontWeight: 'bold',
                        borderRadius: '5px',
                    }}
                >
                    Tomorrow Slots
                </Button>
            </div>

            {filteredSlots.length === 0 ? (
                renderNoSlotsMessage()
            ) : (
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
                                boxShadow: selectedSlot === slot._id
                                    ? '0 4px 16px rgba(0,0,0,0.3)'
                                    : '0 2px 8px rgba(0,0,0,0.1)',
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
                                    style={{
                                        position: 'absolute',
                                        top: '90px',
                                        right: '-90px',
                                        backgroundColor: '#1890ff',
                                        borderRadius: '50%'
                                    }}
                                />
                            )}
                            <div style={{ marginBottom: '1rem' }}>
                                <Text strong style={{ display: 'block' }}>
                                    {slot.startDateTime.format('YYYY-MM-DD')}
                                </Text>
                                <Text>
                                    {slot.startDateTime.utc().format('hh:mm A')} - {slot.endDateTime.utc().format('hh:mm A')} (GMT)
                                </Text>
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
            )}
        </div>
    );
};

export default SelectAppointment;
