import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import { Card, Typography, Button, Badge } from 'antd';
import { CalendarOutlined, CheckOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SelectAppointment = ({ handleSelectAppointment, patientId }) => {
    const [appointmentSlots, setAppointmentSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    // Convert time from UTC to Pakistan Standard Time (PKT)
    const convertToLocalTime = (startTime, endTime) => {
        const timeZone = 'Asia/Karachi'; // PKT Time Zone
        const start = moment.utc(startTime).tz(timeZone);
        const end = moment.utc(endTime).tz(timeZone);
        return { start, end, timeZone };
    };

    // Fetch slots and update state
    const fetchAndUpdateSlots = async () => {
        try {
            console.log('Fetching slots...');
            const response = await axios.get('https://server-yvzt.onrender.com/api/schedule');
            const allSlots = response.data;
    
            console.log('Fetched Slots Data:', allSlots);
    
            if (!Array.isArray(allSlots)) {
                console.error('Unexpected data format:', allSlots);
                return;
            }
    
            const convertedSlots = allSlots.map(slot => {
                const { startDateTime, endDateTime, timeZone } = slot;
                const start = moment.tz(startDateTime, timeZone);
                const end = moment.tz(endDateTime, timeZone);
                return {
                    ...slot,
                    startDateTime: start,
                    endDateTime: end,
                    timeZone
                };
            });
    
            console.log('Converted Slots:', convertedSlots);
    
            const nowUTC = moment.utc();
            let futureSlots = convertedSlots.filter(slot => moment.utc(slot.startDateTime).isAfter(nowUTC));
            
            // Check if futureSlots is empty
            if (futureSlots.length === 0) {
                console.log('No slots available for today, generating slots for the next day...');
                futureSlots = generateNextDaySlots();
                console.log('Generated Next Day Slots:', futureSlots);
            }
    
            // Convert startDateTime and endDateTime back to moment objects for sorting
            futureSlots = futureSlots.map(slot => ({
                ...slot,
                startDateTime: moment(slot.startDateTime),
                endDateTime: moment(slot.endDateTime)
            }));
    
            // Sort and limit the slots
            futureSlots.sort((a, b) => a.startDateTime.diff(b.startDateTime));
            setAppointmentSlots(futureSlots.slice(0, 11));
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };
    
    

    // Generate slots for the next day
    const generateNextDaySlots = () => {
        // Get the current local time zone dynamically
        const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Use moment to handle current system time
        const now = moment(); // Current local time
        const nowUTC = now.clone().utc(); // Current UTC time
    
        // Calculate the start and end of the next day in local time
        const nextDayStartLocal = now.clone().add(1, 'days').startOf('day').set({ hour: 13, minute: 0, second: 0 });
        const nextDayEndLocal = now.clone().add(1, 'days').startOf('day').set({ hour: 17, minute: 0, second: 0 });
    
        // Convert start and end times to UTC for consistent comparison
        const nextDayStartUTC = moment.tz(nextDayStartLocal, localTimeZone).utc();
        const nextDayEndUTC = moment.tz(nextDayEndLocal, localTimeZone).utc();
    
        // Check if the times are correctly set
        console.log('Next Day Start Time (Local TZ):', nextDayStartLocal.format());
        console.log('Next Day End Time (Local TZ):', nextDayEndLocal.format());
        console.log('Next Day Start Time (UTC):', nextDayStartUTC.format());
        console.log('Next Day End Time (UTC):', nextDayEndUTC.format());
    
        // Generate slots between nextDayStartUTC and nextDayEndUTC
        const nextDaySlots = [];
        let start = nextDayStartUTC.clone();
        while (start.isBefore(nextDayEndUTC)) {
            const end = start.clone().add(30, 'minutes');
            nextDaySlots.push({
                _id: `nextDaySlot${nextDaySlots.length}`,
                startDateTime: start,
                endDateTime: end,
                timeZone: localTimeZone
            });
            start = end; // Move to the next slot
        }
    
        return nextDaySlots;
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
