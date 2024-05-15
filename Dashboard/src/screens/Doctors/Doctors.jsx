import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Layout from '../../Layout';
import AddDoctorModal from '../../components/Modals/AddDoctorModal';
import { DoctorsTable } from '../../components/Tables';
import { MdOutlineCloudDownload } from 'react-icons/md';
import { BiPlus } from 'react-icons/bi';
import { Button } from '../../components/Form';

function Doctors() {
  const [isOpen, setIsOpen] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState([]);
  const navigate = useNavigate();

  const onCloseModal = () => {
    setIsOpen(false);
  };

  const preview = (data) => {
    navigate(`/doctors/preview/${data._id}`, { state: { doctorData: data } });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8800/api/doctors/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Doctor deleted successfully');
      // Fetch updated doctor list
      fetchDoctorInfo();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast.error('Failed to delete doctor');
    }
  };

  const fetchDoctorInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8800/api/doctors', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctorInfo(response.data);
    } catch (error) {
      console.error('Error fetching doctorInfo:', error);
      toast.error('Failed to fetch doctorInfo');
    }
  };

  useEffect(() => {
    fetchDoctorInfo();
  }, []);

  return (
    <Layout>
      {isOpen && (
        <AddDoctorModal
          closeModal={onCloseModal}
          isOpen={isOpen}
          doctor={true}
          datas={null}
        />
      )}
      <button
        onClick={() => setIsOpen(true)}
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button>
      <h1 className="text-xl font-semibold">Doctors</h1>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        <div className="grid md:grid-cols-6 sm:grid-cols-2 grid-cols-1 gap-2">
          <div className="md:col-span-5 grid lg:grid-cols-4 items-center gap-6">
            {/* <input
              type="text"
              placeholder='Search "daudi mburuge"'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
            /> */}
          </div>
          {/* <Button
            label="Export"
            Icon={MdOutlineCloudDownload}
            onClick={() => {
              toast.error('Exporting is not available yet');
            }}
          /> */}
        </div>
        <div className="mt-8 w-full overflow-x-hidden">
          <DoctorsTable
            doctor={true}
            data={doctorInfo.map((item) => ({
              ...item,
              id: item._id,
              user: {
                title: item.fullName,
                phone: item.phone,
                email: item.email,
                image: item.profileImage,
              },
            }))}
            functions={{
              preview: preview,
              delete: handleDelete, // Passing the delete function
            }}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Doctors;
