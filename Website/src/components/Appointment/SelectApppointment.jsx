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
        console.log('User Time Zone:', userTimeZone);
        const start = moment.utc(startTime).tz(userTimeZone);
        const end = moment.utc(endTime).tz(userTimeZone);
        const timeZone = moment.tz(userTimeZone).format('z'); // Get time zone abbreviation
        
        console.log('Converted Start Time:', start.format());
        console.log('Converted End Time:', end.format());
    
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
    
            const nowUTC = moment.utc(); // Current time in UTC
    
            // Convert slots
            const convertedSlots = allSlots.map(slot => {
                const { start, end, timeZone } = convertToLocalTime(slot.startDateTime, slot.endDateTime);
                return {
                    ...slot,
                    startDateTime: start,
                    endDateTime: end,
                    timeZone
                };
            });
    
            console.log('Converted Slots Data:', convertedSlots);
    
            // Filter future slots
            const futureSlots = convertedSlots.filter(slot => {
                return moment.utc(slot.startDateTime).isAfter(nowUTC);
            });
    
            console.log('Future Slots Data:', futureSlots);
    
            // Sort future slots
            futureSlots.sort((a, b) => a.startDateTime.diff(b.startDateTime));
    
            // Check for slots for today
            const todayStart = nowUTC.clone().startOf('day');
            const todayEnd = nowUTC.clone().endOf('day');
    
            const todaySlots = futureSlots.filter(slot => {
                const slotTime = moment.utc(slot.startDateTime);
                return slotTime.isSameOrAfter(todayStart) && slotTime.isSameOrBefore(todayEnd);
            });
    
            console.log('Today Slots Data:', todaySlots);
    
            // If no slots available for today, show slots for the next day
            if (todaySlots.length === 0) {
                const nextDayStart = nowUTC.clone().add(1, 'days').startOf('day');
                const nextDayEnd = nextDayStart.clone().endOf('day');
    
                console.log('Checking Next Day Slots...');
                console.log('Next Day Start:', nextDayStart.toISOString());
                console.log('Next Day End:', nextDayEnd.toISOString());
    
                const nextDaySlots = futureSlots.filter(slot => {
                    const slotTime = moment.utc(slot.startDateTime);
                    return slotTime.isAfter(nextDayStart) && slotTime.isBefore(nextDayEnd);
                });
    
                console.log('Next Day Slots Data:', nextDaySlots);
    
                if (nextDaySlots.length > 0) {
                    const convertedNextDaySlots = nextDaySlots.map(slot => {
                        const { start, end, timeZone } = convertToLocalTime(slot.startDateTime, slot.endDateTime);
                        return {
                            ...slot,
                            startDateTime: start,
                            endDateTime: end,
                            timeZone
                        };
                    });
    
                    convertedNextDaySlots.sort((a, b) => a.startDateTime.diff(b.startDateTime));
                    setAppointmentSlots(convertedNextDaySlots.slice(0, 11));
    
                    console.log('Next Day Converted Slots Data:', convertedNextDaySlots.slice(0, 11));
                } else {
                    setAppointmentSlots([]); // No slots available for today or the next day
                    console.log('No slots available for today or the next day.');
                }
            } else {
                const slotsToShow = todaySlots.slice(0, 11);
                setAppointmentSlots(slotsToShow);
                console.log('Today Slots to Show:', slotsToShow);
            }
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
        return <div>No appointments available for today. Please check for the next day slots.</div>;
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
