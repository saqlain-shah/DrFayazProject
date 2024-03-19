import React, { useState, useEffect } from 'react';
import { MenuSelect } from './Form';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { v4 as uuidv4 } from 'uuid';
import { FiEye, FiEdit } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { RiDeleteBin6Line, RiEditLine } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const thclass = 'text-start text-sm font-medium py-3 px-2 whitespace-nowrap';
const tdclass = 'text-start text-sm py-4 px-2 whitespace-nowrap';
import axios from 'axios';
import { sortsDatas } from './Datas';
export function Transactiontable({ data, action, functions }) {
  const DropDown1 = [
    {
      title: 'Edit',
      icon: FiEdit,
      onClick: (data) => {
        functions.edit(data.id);
      },
    },
    {
      title: 'View',
      icon: FiEye,
      onClick: (data) => {
        functions.preview(data.id);
      },
    },
    {
      title: 'Delete',
      icon: RiDeleteBin6Line,
      onClick: () => {
        toast.error('This feature is not available yet');
      },
    },
  ];
  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>#</th>
          <th className={thclass}>Patient</th>
          <th className={thclass}>Date</th>
          <th className={thclass}>Status</th>
          <th className={thclass}>
            Amout <span className="text-xs font-light">(Tsh)</span>
          </th>
          <th className={thclass}>Method</th>
          {action && <th className={thclass}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={item.id}
            className="border-b border-border hover:bg-greyed transitions"
          >
            <td className={tdclass}>{index + 1}</td>
            <td className={tdclass}>
              <div className="flex gap-4 items-center">
                <span className="w-12">
                  <img
                    src={item.user.image}
                    alt={item.user.title}
                    className="w-full h-12 rounded-full object-cover border border-border"
                  />
                </span>

                <div>
                  <h4 className="text-sm font-medium">{item.user.title}</h4>
                  <p className="text-xs mt-1 text-textGray">
                    {item.user.phone}
                  </p>
                </div>
              </div>
            </td>
            <td className={tdclass}>{item.date}</td>
            <td className={tdclass}>
              <span
                className={`py-1 px-4 ${item.status === 'Paid'
                  ? 'bg-subMain text-subMain'
                  : item.status === 'Pending'
                    ? 'bg-orange-500 text-orange-500'
                    : item.status === 'Cancel' && 'bg-red-600 text-red-600'
                  } bg-opacity-10 text-xs rounded-xl`}
              >
                {item.status}
              </span>
            </td>
            <td className={`${tdclass} font-semibold`}>{item.amount}</td>
            <td className={tdclass}>{item.method}</td>
            {action && (
              <td className={tdclass}>
                <MenuSelect datas={DropDown1} item={item}>
                  <div className="bg-dry border text-main text-xl py-2 px-4 rounded-lg">
                    <BiDotsHorizontalRounded />
                  </div>
                </MenuSelect>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}



export function InvoiceTable({ data, deleteInvoice }) {
  const navigate = useNavigate();
  const [idCounter, setIdCounter] = useState(2623); // Initialize the ID counter

  const DropDown1 = [
    {
      title: 'Edit',
      icon: FiEdit,
      onClick: (item) => {
        navigate(`/invoices/edit/${item.id}`);
      },
    },
    {
      title: 'View',
      icon: FiEye,
      onClick: (item) => {
        navigate(`/invoices/preview/${item.id}`);
      },

    },
    {
      title: 'Delete',
      icon: RiDeleteBin6Line,
      onClick: (item) => {
        deleteInvoice(item._id);
      },
    },
  ];

  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>Invoice ID</th>
          <th className={thclass}>Patient</th>
          <th className={thclass}>Created Date</th>
          <th className={thclass}>Due Date</th>
          <th className={thclass}>
            Amount <span className="text-xs font-light">(Tsh)</span>
          </th>
          <th className={thclass}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={item._id}
            className="border-b border-border hover:bg-greyed transitions"
          >
            <td className={tdclass}>#{idCounter + index}</td>
            <td className={tdclass}>
              <div className="flex gap-4 items-center">
                <span className="w-12">
                  <img
                    src={`http://localhost:8800/${item?.patient?.profilePicture}`} // Adjust the base URL as needed
                    alt={item?.patient?.fullName}
                    className="w-full h-12 rounded-full object-cover border border-border"
                  />
                </span>
                <div>
                  <h4 className="text-sm font-medium">{item?.patient?.fullName}</h4>
                  <p className="text-xs mt-1 text-textGray">
                    {item?.patient?.email}
                  </p>
                </div>
              </div>
            </td>
            <td className={tdclass}>{new Date(item?.createdDate).toLocaleString()}</td>
            <td className={tdclass}>{new Date(item?.dueDate).toLocaleString()}</td>
            <td className={`${tdclass} font-semibold`}>{item?.total}</td>
            <td className={tdclass}>
              <MenuSelect datas={DropDown1} item={item}>
                <div className="bg-dry border text-main text-xl py-2 px-4 rounded-lg">
                  <BiDotsHorizontalRounded />
                </div>
              </MenuSelect>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}



// MedicineTable component
export function MedicineTable({ data, onEdit, onDelete }) {
  console.log("responsive", data)
  const thclass = "border-b border-border py-2 px-4 text-left text-sm font-medium text-main";
  const tdclass = "border-b border-border py-2 px-4 text-sm text-main";

  const DropDown1 = [
    {
      title: 'Edit',
      icon: FiEdit,
      onClick: (item) => {
        onEdit(item);
      },
    },
    {
      title: 'Delete',
      icon: RiDeleteBin6Line,
      onClick: (item) => {
        onDelete(item);
      },
    },
  ];

  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>Name</th>
          <th className={thclass}>
            Price <span className="text-xs font-light">(Tsh)</span>
          </th>
          <th className={thclass}>InStock</th>
          <th className={thclass}>Measure</th>
          <th className={thclass}>Description</th>
          <th className={thclass}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(data) && data.map((item, index) => (
          <tr
            key={item._id} // Assuming _id is the unique identifier
            className="border-b border-border hover:bg-greyed transitions"
          >
            <td className={tdclass}>
              <h4 className="text-sm font-medium">{item?.medicineName}</h4>
            </td>
            <td className={`${tdclass} font-semibold`}>{item?.price}</td>
            <td className={tdclass}>
              <span
                className={`text-xs font-medium ${item?.inStock ? 'text-green-600' : 'text-red-600'}`}
              >
                {item?.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </td>
            <td className={tdclass}>{item?.measure}</td>
            <td className={tdclass}>{item?.description}</td>
            <td className={tdclass}>
              <MenuSelect datas={DropDown1} item={item}>
                <div className="bg-dry border text-main text-xl py-2 px-4 rounded-lg">
                  <BiDotsHorizontalRounded />
                </div>
              </MenuSelect>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}


export function ServiceTable({ data, onEdit, onDelete, setServicesData }) {
  const DropDown1 = [
    {
      title: 'Edit',
      icon: FiEdit,
      onClick: (item) => {
        onEdit(item);
      },
    },
    {
      title: 'Delete',
      icon: RiDeleteBin6Line,
      onClick: (item) => {
        onDelete(item);
      },
    },
  ];

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

  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>Service Name</th>
          <th className={thclass}>Created At</th>
          <th className={thclass}>
            Service  Price <span className="text-xs font-light">(Tsh)</span>
          </th>
          <th className={thclass}>Status</th>
          <th className={thclass}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={item._id} className="border-b border-border hover:bg-greyed transitions">
            <td className={tdclass}>
              <h4 className="text-sm font-medium">{item?.name}</h4>
            </td>
            <td className={tdclass}>{new Date(item?.createdAt).toLocaleString()}</td>
            <td className={`${tdclass} font-semibold`}>{item?.price}</td>
            <td className={tdclass}>
              <span
                className={`text-xs font-medium cursor-pointer ${!item?.status ? 'text-red-600' : 'text-green-600'
                  }`}
                onClick={() => handleStatusToggle(item)}
              >
                {item?.status ? 'Enable Patient' : 'Disable Patient'}
              </span>
            </td>
            <td className={tdclass}>
              <MenuSelect datas={DropDown1} item={item}>
                <div className="bg-dry border text-main text-xl py-2 px-4 rounded-lg">
                  <BiDotsHorizontalRounded />
                </div>
              </MenuSelect>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// patient table
export function PatientTable({ data, functions, onEdit }) {
  const navigate = useNavigate();
  const DropDown1 = [
    {
      title: 'Edit',
      icon: FiEdit,
      onClick: (item) => {
        onEdit(item);
      },
    },
    {
      title: 'View',
      icon: FiEye,
      onClick: (item) => {
        // Navigate to patient profile with additional data
        navigate(`/patients/preview/${item._id}`, { state: { profileData: item } });
      },
    },
    {
      title: 'Delete',
      icon: RiDeleteBin6Line,
      onClick: (data) => {
        console.log('Patient data:', data); // Log the data object
        functions.delete(data._id); // Access _id instead of id
      },
    },
  ];

  const thClass = 'text-start text-sm font-medium py-3 px-1 whitespace-nowrap';
  const tdClass = 'text-start text-xs py-4 px-2 whitespace-nowrap';

  return (
    <div className="overflow-x-auto">
      <table className="table-auto">
        <thead className="bg-dry rounded-md overflow-hidden">
          <tr>
            <th className={thClass} style={{ width: '2%' }}>#</th>
            <th className={thClass} style={{ width: '1%' }}>Image</th>
            <th className={thClass} style={{ width: '5%' }}>Full Name</th>
            <th className={thClass} style={{ width: '5%' }}>Gender</th>
            <th className={thClass} style={{ width: '3%' }}>Blood Group</th>
            <th className={thClass} style={{ width: '5%' }}>Address</th>
            <th className={thClass} style={{ width: '5%' }}>Email</th>
            <th className={thClass} style={{ width: '5%' }}>Emergency Contact</th>
            <th className={thClass} style={{ width: '5%' }}>Created At</th>
            <th className={thClass} style={{ width: '5%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item._id} className="border-b border-border hover:bg-greyed transitions">
              <td className={tdClass}>{index + 1}</td>
              <td className={tdClass}>
                {item.profilePicture && (
                  <img
                    src={`http://localhost:8800/${item.profilePicture}`}
                    alt={item.fullName}
                    className="w-full h-11 rounded-full object-cover border border-border"
                  />
                )}
              </td>
              <td className={tdClass}>{item.fullName}</td>
              <td className={tdClass}>
                <span
                  className={`py-1 px-2 ${item.gender === 'Male' ? 'bg-subMain text-subMain' : 'bg-orange-500 text-orange-500'
                    } bg-opacity-10 text-xs rounded-xl`}
                >
                  {item.gender}
                </span>
              </td>
              <td className={tdClass}>{item.bloodGroup}</td>
              <td className={tdClass}>{item.address}</td>
              <td className={tdClass}>{item.email}</td>
              <td className={tdClass}>{item.emergencyContact}</td>
              <td className={tdClass}>{new Date(item.createdAt).toLocaleString()}</td>
              <td className={tdClass} style={{ position: 'relative' }}>
                <MenuSelect datas={DropDown1} item={item}>
                  <div className="bg-dry border text-main text-xl py-2 px-4 rounded-lg">
                    <BiDotsHorizontalRounded />
                  </div>
                </MenuSelect>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function PatientTableArray({ data, onEdit }) {

  if (!Array.isArray(data)) {
    console.error('Data is not an array:', data);
    return <div>Error: Data is not an array</div>;
  }

  const thClass = 'text-start text-sm font-medium py-3 px-1 whitespace-nowrap';
  const tdClass = 'text-start text-xs py-4 px-2 whitespace-nowrap';

  return (
    <div className="overflow-x-auto">
      <table className="table-auto">
        <thead className="bg-dry rounded-md overflow-hidden">
          <tr>
            <th className={thClass} style={{ width: '2%' }}>#</th>
            <th className={thClass} style={{ width: '10%' }}>Image</th>
            <th className={thClass} style={{ width: '15%' }}>Full Name</th>
            <th className={thClass} style={{ width: '10%' }}>Gender</th>
            <th className={thClass} style={{ width: '5%' }}>Blood Group</th>
            <th className={thClass} style={{ width: '20%' }}>Address</th>
            <th className={thClass} style={{ width: '15%' }}>Email</th>
            <th className={thClass} style={{ width: '15%' }}>Emergency Contact</th>
            <th className={thClass} style={{ width: '10%' }}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item._id || index} className="border-b border-border hover:bg-greyed transitions">
              {/* Table cells */}
              <td className={tdClass}>{index + 1}</td>
              <td className={tdClass}>
                {item.profilePicture && (
                  <img
                    src={`http://localhost:8800/${item.profilePicture}`}
                    alt={item.fullName}
                    className="w-full h-11 rounded-full object-cover border border-border"
                  />
                )}
              </td>
              <td className={tdClass}>{item.fullName}</td>
              <td className={tdClass}>{item.gender}</td>
              <td className={tdClass}>{item.bloodGroup}</td>
              <td className={tdClass}>{item.address}</td>
              <td className={tdClass}>{item.email}</td>
              <td className={tdClass}>{item.emergencyContact}</td>
              <td className={tdClass}>{new Date(item.createdAt).toLocaleString()}</td>

            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );
}



export function DoctorsTable({ data, functions, doctor }) {
  const thclass = 'py-3 px-4 text-left font-semibold';
  const tdclass = 'py-3 px-4';

  const DropDown1 = [
    {
      title: 'View',
      icon: FiEye,
      onClick: (data) => {
        functions.preview(data);
      },
    },
    {
      title: 'Delete',
      icon: RiDeleteBin6Line,
      onClick: (data) => {
        functions.delete(data.id); // Call the delete function with the doctor's id
      },
    },
  ];

  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>#</th>
          <th className={thclass}>{doctor ? 'Doctor' : 'Receptionist'}</th>
          <th className={thclass}>FullName</th>
          <th className={thclass}>Created At</th>
          <th className={thclass}>Phone</th>
          <th className={thclass}>Email</th>
          <th className={thclass}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={item._id} className="border-b border-border hover:bg-greyed transitions">
            <td className={tdclass}>{index + 1}</td>
            <td className={tdclass}>
              <div className="flex gap-4 items-center">
                <span className="w-12">
                  <img
                    src={`http://localhost:8800/${item.profileImage}`}
                    className="w-full h-12 rounded-full object-cover border border-border"
                  />
                </span>
              </div>
            </td>
            <td className={tdclass}>{item.fullName}</td>
            <td className={tdclass}>{item.createdAt}</td>
            <td className={tdclass}>{item.phone}</td>
            <td className={tdclass}>{item.email}</td>
            <td className={tdclass}>
              <MenuSelect datas={DropDown1} item={item}>
                <div className="bg-dry border text-main text-xl py-2 px-4 rounded-lg">
                  <BiDotsHorizontalRounded />
                </div>
              </MenuSelect>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function AppointmentTable({ functions, token }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8800/api/appointments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchData();
  }, [token]);

  const getStatusClass = (status) => {
    if (status === 'Pending') {
      return 'bg-yellow-500';
    } else if (status === 'Completed') {
      return 'bg-green-500';
    } else {
      return 'bg-blue-500';
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8800/api/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        // Remove the deleted appointment from the state
        setAppointments(appointments.filter(appointment => appointment._id !== id));
        // Display success toast message
        toast.success('Appointment deleted successfully!', {
          position: 'bottom-right',
        });
      } else {
        console.error('Failed to delete appointment');
        // Display error toast message if deletion fails
        toast.error('Failed to delete appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      // Display error toast message if an error occurs during deletion
      toast.error('Error deleting appointment');
    }
  };

  const handleEdit = (item) => {
    // Call the edit function passed as a prop
    functions.edit(item);
  };

  const DropDown1 = [
    {
      title: 'Edit',
      icon: FiEdit,
      onClick: (item) => {
        // Call the handleEdit function
        handleEdit(item);
      },
    },
    {
      title: 'Delete',
      icon: RiDeleteBin6Line,
      onClick: (item) => {
        // Call the delete function
        handleDelete(item._id);
      },
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead className="bg-dry rounded-md overflow-hidden">
          <tr>
            <th className="py-3 px-4 text-left font-semibold">Date of Visit</th>
            <th className="py-3 px-4 text-left font-semibold">Doctor</th>
            <th className="py-3 px-4 text-left font-semibold">Start Time</th>
            <th className="py-3 px-4 text-left font-semibold">End Time</th>
            <th className="py-3 px-4 text-left font-semibold">Patient Name</th>
            <th className="py-3 px-4 text-left font-semibold">Purpose of Visit</th>
            <th className="py-3 px-4 text-left font-semibold">Status</th>
            <th className="py-3 px-4 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((item) => (
            <tr key={item._id} className="border-b border-border hover:bg-greyed transitions">
              <td className="py-3 px-4">{new Date(item.dateOfVisit).toLocaleDateString()}</td>
              <td className="py-3 px-4">{item.doctor}</td>
              <td className="py-3 px-4">{new Date(item.startTime).toLocaleTimeString()}</td>
              <td className="py-3 px-4">{new Date(item.endTime).toLocaleTimeString()}</td>
              <td className="py-3 px-4">{item.patientName}</td>
              <td className="py-3 px-4">{item.purposeOfVisit}</td>
              <td className="py-3 px-4">
                <span className={`py-1 px-4 ${getStatusClass(item.status)} bg-opacity-10 text-xs rounded-xl`}>
                  {item.status}
                </span>
              </td>
              <td className="py-3 px-4" style={{ position: 'relative' }}>
                <MenuSelect datas={DropDown1} item={item}>
                  <div className="bg-dry border text-main text-xl py-2 px-4 rounded-lg">
                    <BiDotsHorizontalRounded />
                  </div>
                </MenuSelect>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



// payment table
export function PaymentTable({ data, functions, doctor }) {
  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>Date</th>
          <th className={thclass}>{doctor ? 'Patient' : 'Doctor'}</th>
          <th className={thclass}>Status</th>
          <th className={thclass}>Amount</th>
          <th className={thclass}>Method</th>
          <th className={thclass}>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            key={item.id}
            className="border-b border-border hover:bg-greyed transitions"
          >
            <td className={tdclass}>
              <p className="text-xs">{item.date}</p>
            </td>
            <td className={tdclass}>
              <h4 className="text-xs font-medium">
                {doctor ? item.user.title : item.doctor.title}
              </h4>
              <p className="text-xs mt-1 text-textGray">
                {doctor ? item.user.phone : item.doctor.phone}
              </p>
            </td>
            <td className={tdclass}>
              <span
                className={`py-1  px-4 ${item.status === 'Paid'
                  ? 'bg-subMain text-subMain'
                  : item.status === 'Pending'
                    ? 'bg-orange-500 text-orange-500'
                    : item.status === 'Cancel' && 'bg-red-600 text-red-600'
                  } bg-opacity-10 text-xs rounded-xl`}
              >
                {item.status}
              </span>
            </td>
            <td className={tdclass}>
              <p className="text-xs font-semibold">{`$${item.amount}`}</p>
            </td>
            <td className={tdclass}>
              <p className="text-xs">{item.method}</p>
            </td>

            <td className={tdclass}>
              <button
                onClick={() => functions.preview(item.id)}
                className="text-sm flex-colo bg-white text-subMain border rounded-md w-10 h-10"
              >
                <FiEye />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// invoice used table
export function InvoiceUsedTable({ data, functions }) {
  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>Invoice ID</th>
          <th className={thclass}>Create Date</th>
          <th className={thclass}>Due Date</th>
          <th className={thclass}>Amount</th>
          <th className={thclass}>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            key={item.id}
            className="border-b border-border hover:bg-greyed transitions"
          >
            <td className={tdclass}>
              <p className="text-xs">#{item.id}</p>
            </td>
            <td className={tdclass}>
              <p className="text-xs">{item.createdDate}</p>
            </td>
            <td className={tdclass}>
              <p className="text-xs">{item.dueDate}</p>
            </td>

            <td className={tdclass}>
              <p className="text-xs font-semibold">{`$${item.total}`}</p>
            </td>

            <td className={tdclass}>
              <button
                onClick={() => functions.preview(item.id)}
                className="text-sm flex-colo bg-white text-subMain border rounded-md w-10 h-10"
              >
                <FiEye />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// invoice table
export function InvoiceProductsTable({ data, functions, button }) {
  const thclass = "p-3 text-left font-medium text-gray-700 border-b border-gray-200";
  const tdclass = "p-3 text-left text-gray-700 border-b border-gray-200";

  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thclass}>Item</th>
          <th className={thclass}>
            Item Price
            <span className="text-xs font-light ml-1">(Tsh)</span>
          </th>
          <th className={thclass}>Quantity</th>
          <th className={thclass}>
            Amount
            <span className="text-xs font-light ml-1">(Tsh)</span>
          </th>
          {button && <th className={thclass}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {/* Check if data is not empty and map over it */}
        {data?.map((item) => (
          <tr key={item._id} className="border-b border-border hover:bg-greyed transitions">
            <td className={`${tdclass}  font-medium`}>{item.name}</td>
            <td className={`${tdclass} text-xs`}>{item.price}</td>
            <td className={tdclass}>{item.quantity}</td> {/* Display quantity */}
            <td className={tdclass}>{item.price * item.quantity}</td> {/* Calculate and display amount */}
            {button && (
              <td className={tdclass}>
                <button
                  onClick={() => functions.deleteItem(item._id)}
                  className="bg-red-600 bg-opacity-5 text-red-600 rounded-lg border border-red-100 py-3 px-4 text-sm"
                >
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}


// medicine Dosage table

export function MedicineDosageTable({ data, functions, button }) {
  console.log("MedicineDosageTable data:", data);
  const thClass = 'text-start text-xs font-medium py-3 px-2 whitespace-nowrap';
  const tdClass = 'text-start text-xs py-4 px-2 whitespace-nowrap';

  return (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thClass}>Name</th>
          <th className={thClass}>Quantity</th>
          <th className={thClass}>Dosage</th>
          <th className={thClass}>Instruction</th>
          <th className={thClass}>Item Price (Tsh)</th>
          <th className={thClass}>Amount (Tsh)</th>
          {button && <th className={thClass}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data?.map((medicine) => (
          <tr key={medicine._id} className="border-b border-border hover:bg-greyed transitions">
            <td className={tdClass}>{medicine.name}</td>
            <td className={tdClass}>{medicine.quantity}</td>
            <td className={tdClass}>{medicine.dosage}</td>
            <td className={tdClass}>{medicine.instructions}</td>
            <td className={tdClass}>{medicine.itemPrice}</td>
            <td className={tdClass}>{medicine.amount}</td>
            {button && (
              <td className={tdClass}>
                <button
                  onClick={() => functions.delete(medicine._id)}
                  className="bg-red-600 bg-opacity-5 text-red-600 rounded-lg border border-red-100 py-3 px-4 text-sm"
                >
                  <RiDeleteBinLine />
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

