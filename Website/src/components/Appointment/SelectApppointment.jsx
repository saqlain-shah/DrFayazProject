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
    
            // Convert slots to the user's local time zone and filter future slots
            const futureSlots = allSlots
                .map(slot => {
                    const { start, end, timeZone } = convertToLocalTime(slot.startDateTime, slot.endDateTime);
                    return {
                        ...slot,
                        startDateTime: start,
                        endDateTime: end,
                        timeZone
                    };
                })
                .filter(slot => moment.utc(slot.startDateTime).isAfter(nowUTC));
    
            console.log('Future Slots Data:', futureSlots);
    
            // Sort the future slots by start time
            futureSlots.sort((a, b) => a.startDateTime.diff(b.startDateTime));
    
            // Remove duplicate slots based on start and end time
            const uniqueSlots = futureSlots.filter((slot, index, self) =>
                index === self.findIndex(s => 
                    s.startDateTime.isSame(slot.startDateTime) && 
                    s.endDateTime.isSame(slot.endDateTime)
                )
            );
    
            // Check if there are any unique slots available
            if (uniqueSlots.length > 0) {
                // Get the first (earliest) unique slot
                const earliestSlot = uniqueSlots[0];
                
                // Find all slots for the same day as the earliest unique slot
                const sameDaySlots = uniqueSlots.filter(slot =>
                    moment(slot.startDateTime).isSame(earliestSlot.startDateTime, 'day')
                );
    
                // Set all unique slots of the same day
                setAppointmentSlots(sameDaySlots);
                console.log('Unique Same Day Slots:', sameDaySlots);
            } else {
                setAppointmentSlots([]); // No slots available
                console.log('No slots available.');
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
