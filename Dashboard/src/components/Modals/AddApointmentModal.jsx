import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import { servicesData } from '../Datas'; // Adjust the import path as per your project structure
import { sortsDatas } from '../Datas'; // Adjust the import path as per your project structure
import { memberData } from '../Datas'; // Adjust the import path as per your project structure
import { Button, Checkbox, DatePickerComp, Input, Select, Textarea, TimePickerComp } from '../Form';
import { BiChevronDown, BiPlus } from 'react-icons/bi';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import PatientMedicineServiceModal from './PatientMedicineServiceModal';

const doctorsData = memberData.map((item) => {
  return {
    id: item.id,
    name: item.title,
  };
});

function AddAppointmentModal({ closeModal, isOpen, datas, handleNewAppointment }) {
  const [patientName, setPatientName] = useState(''); // Receive handleNewAppointment function
  const [services, setServices] = useState(servicesData[0]);
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [status, setStatus] = useState(sortsDatas.status[0]);
  const [doctors, setDoctors] = useState(doctorsData[0]);
  const [shares, setShares] = useState({
    email: false,
    sms: false,
    whatsapp: false,
  });
  const [open, setOpen] = useState(false);

  const onChangeShare = (e) => {
    setShares({ ...shares, [e.target.name]: e.target.checked });
  };
  const handlePatientNameChange = (event) => {
    setPatientName(event.target.value);
  };
  const handleSelectPatient = (selectedPatient) => {
    setPatientName(selectedPatient);
  };
  const saveAppointment = () => {
    const apiUrl = 'http://localhost:8800/api/appointments';
    const data = {
      patientName: patientName,
      purposeOfVisit: services.name,
      dateOfVisit: startDate,
      startTime: startTime,
      endTime: endTime,
      doctor: doctors.name,
      status: status.name,
      description: datas?.message,
      share: shares,
    };

    axios.post(apiUrl, data)
      .then(response => {
        console.log('Appointment saved successfully:', response.data);
        toast.success('Appointment saved successfully');
        closeModal();
        handleNewAppointment(response.data); // Pass the new appointment data to the parent component
      })
      .catch(error => {
        console.error('Error saving appointment:', error);
        toast.error('Error saving appointment. Please try again later.');
      });
  };
  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={datas?.title ? 'Edit Appointment' : 'New Appointment'}
      width={'max-w-3xl'}
    >
      {open && (
        <PatientMedicineServiceModal
          closeModal={() => setOpen(!isOpen)}
          isOpen={open}
          patient={true}
        />
      )}
      <div className="flex-colo gap-6">
        <div className="grid sm:grid-cols-12 gap-4 w-full items-center">
          <div className="sm:col-span-10">
            <Input
              label="Patient Name"
              value={patientName}
              onChange={handlePatientNameChange}
              color={true}
              placeholder={
                datas?.title
                  ? datas.title
                  : 'Select Patient and patient name will appear here'
              }
            />
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="text-subMain flex-rows border border-dashed border-subMain text-sm py-3.5 sm:mt-6 sm:col-span-2 rounded"
          >
            <BiPlus /> Add
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <div className="flex w-full flex-col gap-3">
            <p className="text-black text-sm">Purpose of visit</p>
            <Select
              selectedPerson={services}
              setSelectedPerson={setServices}
              datas={servicesData}
            >
              <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                {services.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>
          {/* date */}
          <DatePickerComp
            label="Date of visit"
            startDate={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <TimePickerComp
            label="Start time"
            time={startTime}
            onChange={(time) => setStartTime(time)}
          />
          <TimePickerComp
            label="End time"
            time={endTime}
            onChange={(time) => setEndTime(time)}
          />
        </div>

        {/* status && doctor */}
        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <div className="flex w-full flex-col gap-3">
            <p className="text-black text-sm">Doctor</p>
            <Select
              selectedPerson={doctors}
              setSelectedPerson={setDoctors}
              datas={doctorsData}
            >
              <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                {doctors.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>
          <div className="flex w-full flex-col gap-3">
            <p className="text-black text-sm">Status</p>
            <Select
              selectedPerson={status}
              setSelectedPerson={setStatus}
              datas={sortsDatas.status}
            >
              <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                {status.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>
        </div>

        {/* des */}
        <Textarea
          label="Description"
          placeholder={
            datas?.message
              ? datas.message
              : 'She will be coming for a checkup.....'
          }
          color={true}
          rows={5}
        />

        {/* share */}
        <div className="flex-col flex gap-8 w-full">
          <p className="text-black text-sm">Share with patient via</p>
          <div className="flex flex-wrap sm:flex-nowrap gap-4">
            <Checkbox
              name="email"
              checked={shares.email}
              onChange={onChangeShare}
              label="Email"
            />
            <Checkbox
              name="sms"
              checked={shares.sms}
              onChange={onChangeShare}
              label="SMS"
            />
            <Checkbox
              checked={shares.whatsapp}
              name="whatsapp"
              onChange={onChangeShare}
              label="WhatsApp"
            />
          </div>
        </div>
        {/* buttones */}
        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={closeModal}
            className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
          >
            {datas?.title ? 'Discard' : 'Cancel'}
          </button>
          <Button
            label="Save"
            Icon={HiOutlineCheckCircle}
            onClick={saveAppointment}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AddAppointmentModal;
