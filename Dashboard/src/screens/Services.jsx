import React, { useState, useEffect } from 'react';
import Layout from '../Layout';
import { Button } from '../components/Form';
import { ServiceTable } from '../components/Tables';
import { MdOutlineCloudDownload } from 'react-icons/md';
import { BiChevronDown, BiPlus } from 'react-icons/bi';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AddEditServiceModal from '../components/Modals/AddEditServiceModal';

function Services() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({});
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://server-yvzt.onrender.com/api/services', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setServicesData(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    }
    fetchData();
  }, []);

  const onCloseModal = () => {
    setIsOpen(false);
    setData({});
  };


  const onEdit = (data) => {
    setIsOpen(true);
    setData(data);
  };



  const onDelete = async (item) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://server-yvzt.onrender.com/api/services/${item._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Filter out the deleted service using its ID
      setServicesData(prevServicesData => prevServicesData.filter(service => service._id !== item._id));
      toast.success('Service deleted successfully.');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service. Please try again.');
    }
  };




  const handleStatusToggle = async (item) => {
    try {
      const updatedItem = { ...item, status: !item.status };
      await axios.put(`https://server-yvzt.onrender.com/api/services/${item._id}`, updatedItem);
      const updatedResponse = await axios.get('https://server-yvzt.onrender.com/api/services');
      setServicesData(updatedResponse.data);
      toast.success('Service status updated successfully.');
    } catch (error) {
      console.error('Error updating service status:', error);
      toast.error('Failed to update service status. Please try again.');
    }
  };

  const createService = async (serviceData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://server-yvzt.onrender.com/api/services', serviceData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Service created:', response.data);
      onCloseModal();
      toast.success('Service created successfully.');

      setServicesData(prevData => [...prevData, response.data]);

    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Failed to create service. Please try again.');
    }
  };

  return (
    <Layout>
      {isOpen && (
        <AddEditServiceModal
          datas={data}
          isOpen={isOpen}
          closeModal={onCloseModal}
          onCreate={createService}
          setServicesData={setServicesData}
        />
      )}

      <button
        onClick={() => setIsOpen(true)}
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button>

      <h1 className="text-xl font-semibold">Services</h1>
      <div className="bg-white my-8 rounded-xl border-[1px] border-border p-5">


        <div className="mt-8 w-full overflow-x-scroll">
          <ServiceTable
            data={servicesData}
            onEdit={onEdit}
            onDelete={onDelete}
            handleStatusToggle={handleStatusToggle}
            setServicesData={setServicesData}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Services;
