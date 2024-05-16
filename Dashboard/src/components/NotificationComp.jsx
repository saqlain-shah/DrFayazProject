import React, { useState, useEffect } from 'react';
import { Menu } from '@headlessui/react';
import { FaBirthdayCake } from 'react-icons/fa';
import { BiCalendar } from 'react-icons/bi';
import axios from 'axios';

function NotificationComp({ children,unreadCount }) {
 const [notificationsData, setNotificationsData] = useState([]);
 const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

 

 useEffect(() => {
 const fetchNotifications = async () => {
 try {
 const token = localStorage.getItem('token');
 const response = await axios.get('https://server-yvzt.onrender.com/api/web/notifications', {
 headers: {
 Authorization: `Bearer ${token}`
 }
 });
 
 // Sort the notifications by createdAt in descending order
 const sortedNotifications = response.data.sort((a, b) => {
 return new Date(b.createdAt) - new Date(a.createdAt);
 });
 
 setNotificationsData(sortedNotifications);
 
 // Count unread notifications
 const unreadCount = sortedNotifications.filter(item => !item.read).length;
 setUnreadNotificationsCount(unreadCount);
 } catch (error) {
 console.error('Error fetching notifications:', error);
 }
 };
 
 fetchNotifications();
 }, []);
 

 const handleMarkAllRead = async () => {
 try {
 const token = localStorage.getItem('token');
 await axios.put('https://server-yvzt.onrender.com/api/web/notifications/mark-all-read', null, {
 headers: {
 Authorization: `Bearer ${token}`
 }
 });
 // Update the notifications data after marking all read
 setNotificationsData([]);
 // Set unreadNotificationsCount to 0
 setUnreadNotificationsCount(0);
 } catch (error) {
 console.error('Error marking all notifications as read:', error);
 }
 };
 return (
 <Menu>
 <Menu.Button>{children}</Menu.Button>
 <Menu.Items className="flex flex-col w-full sm:w-8/12 md:w-6/12 xl:w-2/6 top-20 right-0 gap-4 absolute bg-white rounded-md shadow-lg py-4 px-6 ring-1 ring-border focus:outline-none z-50">
 <div className="flex-btn flex-wrap gap-4">
 <h2 className="text-md font-medium text-main">Notifications</h2>
 <button className="px-4 py-2 hover:bg-text rounded-md text-subMain text-sm" onClick={handleMarkAllRead}>
 Mark all read
 </button>
 </div>
 <div className="flex flex-col gap-4 overflow-y-scroll max-h-[500px]">
 {notificationsData.map((item) => (
 <div
 key={item._id}
 className="w-full p-4 border border-border rounded-lg"
 >
 <div className="grid xs:grid-cols-12 gap-4 items-center">
 <div className="xs:col-span-2">
 <div
 className={`${
 item.action === 1
 ? 'bg-subMain text-white'
 : 'bg-text text-subMain'
 } w-12 h-12 rounded-full text-md flex-colo border-[.5px] border-subMain`}
 >
 {item.action === 1 ? <FaBirthdayCake /> : <BiCalendar />}
 </div>
 </div>
 <div className="xs:col-span-10 ">
 {item.action === 1 ? (
 <p className="text-sm text-textGray">
 It's{' '}
 <span className="text-main font-medium">
 {item.patientInfo.name}
 </span>'s birthday today
 </p>
 ) : (
 <p className="text-sm text-textGray">
 Recent appointment with{' '}
 <span className="text-main font-medium">
 {item.patientInfo.name}
 </span> at {new Date(item.selectedSlot.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
 </p>
 )}
 <div className="flex-btn gap-4">
 <p className="text-xs text-textGray mt-2 font-light">
 {new Date(item.createdAt).toLocaleDateString()} 
 </p>
 <p className="text-xs text-textGray">
 {new Date(item.selectedSlot.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
 </p>
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 </Menu.Items>
 </Menu>
 );
}

export default NotificationComp;