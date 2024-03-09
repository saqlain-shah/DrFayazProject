import React, { useState, useEffect } from 'react';
import Layout from '../Layout';
import { Button, Select } from '../components/Form';
import { ServiceTable } from '../components/Tables'; // Import the ServiceTable component
import { MdOutlineCloudDownload } from 'react-icons/md';
import { BiChevronDown, BiPlus } from 'react-icons/bi';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { sortsDatas } from '../components/Datas';
import AddEditServiceModal from '../components/Modals/AddEditServiceModal'; // Import the AddEditServiceModal component

function Services() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({});
  const [status, setStatus] = useState(sortsDatas.service[0]);
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch token from wherever you store it (e.g., localStorage)
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8800/api/services', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setServicesData(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Handle error
      }
    }
    fetchData();
  }, []);

  const onCloseModal = () => {
    setIsOpen(false);
    setData({});
  };

  const onEdit = (datas) => {
    setIsOpen(true);
    setData(datas);
  };

  const onDelete = async (item) => {
    try {
      // Perform delete request
      await axios.delete(`http://localhost:8800/api/services/${item._id}`);
      // Update servicesData state after successful deletion
      const updatedServicesData = servicesData.filter((service) => service._id !== item._id);
      setServicesData(updatedServicesData);
      // Show success message
      toast.success('Service deleted successfully.');
    } catch (error) {
      console.error('Error deleting service:', error);
      // Show error message
      toast.error('Failed to delete service. Please try again.');
    }
  };

  const handleStatusToggle = async (item) => {
    try {
      const updatedItem = { ...item, status: !item.status };
      await axios.put(`http://localhost:8800/api/services/${item._id}`, updatedItem);
      const updatedResponse = await axios.get('http://localhost:8800/api/services');
      setServicesData(updatedResponse.data);
      toast.success('Service status updated successfully.');
    } catch (error) {
      console.error('Error updating service status:', error);
      toast.error('Failed to update service status. Please try again.');
    }
  };

  const createService = async (serviceData) => {
    try {
      const response = await axios.post('http://localhost:8800/api/services', serviceData);
      console.log('Service created:', response.data);
      onCloseModal();
      toast.success('Service created successfully.');

      const updatedResponse = await axios.get('http://localhost:8800/api/services');
      setServicesData(updatedResponse.data);
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Failed to create service. Please try again.');
    }
  };

  // Filter services based on status
  const filteredServicesData = status.value === 'all' ? servicesData :
    status.value === 'enabled' ? servicesData.filter(service => service.status === true) :
      servicesData.filter(service => service.status === false);

  return (
    <Layout>
      {isOpen && (
        <AddEditServiceModal
          datas={data}
          isOpen={isOpen}
          closeModal={onCloseModal}
          onCreate={createService}
        />
      )}

      <button
        onClick={() => setIsOpen(true)}
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button>

      <h1 className="text-xl font-semibold">Services</h1>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        <div className="grid md:grid-cols-6 grid-cols-1 gap-2">
          <div className="md:col-span-5 grid lg:grid-cols-4 xs:grid-cols-2 items-center gap-2">
            <input
              type="text"
              placeholder='Search "teeth cleaning"'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
            />
            <Select
              selectedPerson={status}
              setSelectedPerson={setStatus}
              datas={[
                { name: 'All', value: 'all' },
                { name: 'Enabled', value: 'enabled' },
                { name: 'Disabled', value: 'disabled' },
              ]}
              onChange={(selected) => setStatus(selected)}
            >
              <div className="w-full flex-btn text-main text-sm p-4 border bg-dry border-border font-light rounded-lg focus:border focus:border-subMain">
                {status.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>

          <Button
            label="Export"
            Icon={MdOutlineCloudDownload}
            onClick={() => {
              toast.error('Exporting is not available yet');
            }}
          />
        </div>

        <div className="mt-8 w-full overflow-x-scroll">
          {/* Pass the filtered servicesData, onEdit, onDelete, and handleStatusToggle functions to ServiceTable */}
          <ServiceTable data={filteredServicesData} onEdit={onEdit} onDelete={onDelete} handleStatusToggle={handleStatusToggle} />
        </div>
      </div>
    </Layout>
  );
}

export default Services;
