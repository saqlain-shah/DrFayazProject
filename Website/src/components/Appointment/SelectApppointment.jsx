import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import { Card, Typography, Button, Badge } from 'antd';
import { CalendarOutlined, CheckOutlined } from '@ant-design/icons';
import BASE_URL from '../../baseUrl';

const { Title, Text } = Typography;

const SelectAppointment = ({ handleSelectAppointment, patientId }) => {
    const [appointmentSlots, setAppointmentSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
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
    const getCurrentTimeZone = () => {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    };
    const fetchAndUpdateSlots = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/schedule`);
            const allSlots = response.data;
    
            console.log('Fetched Slots Data:', allSlots);
    
            const nowLocal = moment().tz("Asia/Karachi"); // Current time in Pakistan Time
            const uniqueSlotsMap = {};
            const uniqueSlotSet = new Set();
    
            allSlots.forEach(slot => {
                const { start, end, timeZone } = convertToLocalTime(slot.startDateTime, slot.endDateTime);
                const slotKey = `${start.format('YYYY-MM-DD HH:mm')} - ${end.format('HH:mm')} (${timeZone})`;
    
                if (!uniqueSlotSet.has(slotKey)) {
                    uniqueSlotSet.add(slotKey);
                    uniqueSlotsMap[slot._id] = { ...slot, startDateTime: start, endDateTime: end, timeZone };
                }
            });
    
            console.log('Unique Converted Slots Data:', Object.values(uniqueSlotsMap));
            const futureSlots = Object.values(uniqueSlotsMap).filter(slot => {
                return moment(slot.startDateTime).isAfter(nowLocal);
            });
    
            console.log('Future Slots Data:', futureSlots);
            futureSlots.sort((a, b) => a.startDateTime.diff(b.startDateTime));
            const todayStart = nowLocal.clone().startOf('day');
            const todayEnd = nowLocal.clone().endOf('day');
    
            console.log('Today Start:', todayStart.format());
            console.log('Today End:', todayEnd.format());
            const todaySlots = futureSlots.filter(slot => {
                const slotTime = moment(slot.startDateTime);
                return slotTime.isBetween(todayStart, todayEnd, null, '[]');
            });
    
            console.log('Today Slots Data:', todaySlots);
            if (todaySlots.length === 0) {
                const nextDayStart = nowLocal.clone().add(1, 'days').startOf('day');
                const nextDayEnd = nextDayStart.clone().endOf('day');
    
                console.log('Checking Next Day Slots...');
                console.log('Next Day Start:', nextDayStart.format());
                console.log('Next Day End:', nextDayEnd.format());
    
                const nextDaySlots = futureSlots.filter(slot => {
                    const slotTime = moment(slot.startDateTime);
                    return slotTime.isBetween(nextDayStart, nextDayEnd, null, '[]');
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
                    setAppointmentSlots([]); // No slots available
                    console.log('No slots available for today or the next day.');
                }
            } else {
                setAppointmentSlots(todaySlots.slice(0, 11));
                console.log('Today Slots to Show:', todaySlots.slice(0, 11));
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