import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import { Card, Typography, Button, Badge } from 'antd';
import { CalendarOutlined, CheckOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SelectAppointment = ({ handleSelectAppointment, patientId }) => {
    const [appointmentSlots, setAppointmentSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    // Convert time from UTC to user's local time zone
    const convertToLocalTime = (startTime, endTime) => {
        const userTimeZone = getCurrentTimeZone(); // Get the user's time zone
        const start = moment.utc(startTime).tz(userTimeZone);
        const end = moment.utc(endTime).tz(userTimeZone);
        const timeZone = moment.tz(userTimeZone).format('z'); // Get time zone abbreviation
    
        console.log(`System Time Zone: ${userTimeZone}`);
        console.log(`Converted Slot Time - Start: ${start.format('YYYY-MM-DDTHH:mm:ss.SSSZ')}, End: ${end.format('YYYY-MM-DDTHH:mm:ss.SSSZ')}`);
    
        return { start, end, timeZone };
    };
    
    // Get the current time zone using Intl.DateTimeFormat
    const getCurrentTimeZone = () => {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    };

    // Fetch slots and update state
    const fetchAndUpdateSlots = async () => {
        try {
            const response = await axios.get('https://server-yvzt.onrender.com/api/schedule');
            const allSlots = response.data;
    
            console.log('Fetched Slots Data:', allSlots);
    
            const convertedSlots = allSlots.map(slot => {
                const { start, end, timeZone } = convertToLocalTime(slot.startDateTime, slot.endDateTime);
                console.log('Converted Slot Time - Start:', start.format(), 'End:', end.format());
                return {
                    ...slot,
                    startDateTime: start,
                    endDateTime: end,
                    timeZone
                };
            });
    
            const nowUTC = moment.utc(); // Ensure current time is in UTC
            console.log('Current UTC Time:', nowUTC.format());
    
            const futureSlots = convertedSlots.filter(slot => {
                console.log('Slot Start Time (UTC):', moment.utc(slot.startDateTime).format());
                return moment.utc(slot.startDateTime).isAfter(nowUTC);
            });
    
            console.log('Future Slots:', futureSlots);
    
            futureSlots.sort((a, b) => a.startDateTime.diff(b.startDateTime));
            const slotsToShow = futureSlots.slice(0, 11);
    
            setAppointmentSlots(slotsToShow);
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

    if (appointmentSlots.length === 0) {
        return <div>No appointments available.</div>;
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
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = selectedSlot === slot._id ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.2)';
                            e.currentTarget.style.backgroundColor = selectedSlot === slot._id ? '#e6f7ff' : '#f0f0f0';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = selectedSlot === slot._id ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)';
                            e.currentTarget.style.backgroundColor = selectedSlot === slot._id ? '#e6f7ff' : '#fff';
                        }}
                    >
                        {selectedSlot === slot._id && (
                            <Badge
                                count={<CheckOutlined style={{ color: '#fff', fontSize: '1.5rem' }} />}
                                style={{ position: 'absolute', top: '90px', right: '-90px', backgroundColor: '#1890ff', borderRadius: '50%' }}
                            />
                        )}
                        <div style={{ marginBottom: '1rem' }}>
                            <Text strong style={{ display: 'block' }}>{slot.startDateTime.format('YYYY-MM-DD')}</Text>
                            <Text>{slot.startDateTime.format('hh:mm A')} - {slot.endDateTime.format('hh:mm A')} ({slot.timeZone})</Text>
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
