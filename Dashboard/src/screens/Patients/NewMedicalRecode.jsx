import React, { useState } from 'react';
import Layout from '../../Layout';
import { Link } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import { Button, Textarea, Checkboxe } from '../../components/Form';
import { FaTimes } from 'react-icons/fa';
import { BiChevronDown, BiPlus } from 'react-icons/bi';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import axios from 'axios';
import { MedicineDosageTable } from '../../components/Tables';
import Uploader from '../../components/Uploader';
import { servicesData, medicineData } from '../../components/Datas';
import { toast } from 'react-hot-toast';
import MedicineDosageModal from '../../components/Modals/MedicineDosage';

function NewMedicalRecord() {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [complaints, setComplaints] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [vitalSigns, setVitalSigns] = useState('');
  const [error, setError] = useState('');
  const [prescription, setPrescription] = useState([]);
  const [medicine, setMedicine] = useState([]);
  const [treatments, setTreatments] = useState(
    servicesData.map((item) => ({
      name: item.name,
      checked: false,
      price: item.price,
    }))
  );


  const addMedicineDosage = (medicineDosage) => {
    console.log('Medicinee Dosage:', medicineDosage);
  };

  const onChangeTreatments = (name, checked) => {
    const updatedTreatments = treatments.map((item) =>
      item.name === name ? { ...item, checked: checked } : item
    );
    setTreatments(updatedTreatments);
  };


  const onChangeMedicine = (name, checked) => {
    const updatedMedicineData = medicineData.map(item => {
      if (item && item.name === name) {
        return {
          ...item,
          checked: checked
        };
      }
      return item;
    });
    setMedicine(updatedMedicineData); // Update the medicineData state
  };


  const onChangePrescription = (name, checked) => {
    const updatedPrescription = [...prescription];
    if (checked) {
      updatedPrescription.push(name);
    } else {
      const index = updatedPrescription.indexOf(name);
      if (index !== -1) {
        updatedPrescription.splice(index, 1);
      }
    }
    setPrescription(updatedPrescription);
  };

  const saveMedicalRecord = () => {
    if (!complaints || !diagnosis || !vitalSigns) {
      setError('All fields except treatment and attachments are required');
      return;
    }

    // Initialize prescription and medicine arrays
    let prescription = [];
    let selectedMedicine = []; // Updated to store selected medicine from state

    // Filter checked treatments for prescription
    prescription = treatments
      .filter(item => item.checked)
      .map(item => item.name);

    // Filter checked medicine for selected medicine
    selectedMedicine = medicine
      .filter(item => item.checked)
      .map(item => item.name);

    console.log('Prescription:', prescription);
    console.log('Selected Medicine:', selectedMedicine); // Log selected medicine

    const formData = new FormData();
    formData.append('complaints', complaints);
    formData.append('diagnosis', diagnosis);
    formData.append('vitalSigns', vitalSigns);
    // Append all uploaded files
    uploadedFiles.forEach((file, index) => {
      formData.append(`attachment`, file); // Use the same field name 'attachment'
    });
    // Convert prescription and selected medicine arrays to JSON strings
    formData.append('prescription', JSON.stringify(prescription));
    formData.append('medicine', JSON.stringify(selectedMedicine)); // Append the selected medicine array


    axios.post('http://localhost:8800/api/medical-records', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: progressEvent => {
        console.log('Upload Progress:', Math.round((progressEvent.loaded / progressEvent.total) * 100) + '%');
      }
    })
      .then(response => {
        toast.success(response.data.message);
        setComplaints('');
        setDiagnosis('');
        setVitalSigns('');
        setUploadedFiles([]); // Clear uploaded files
        setTreatments(prevTreatments => (
          prevTreatments.map(item => ({ ...item, checked: false }))
        ));
        // Clear selected medicine after successful submission
        setMedicine(prevMedicine => (
          prevMedicine.map(item => ({ ...item, checked: false }))
        ));
      })
      .catch(error => {
        if (error.response) {
          // Server responded with a status code outside of 2xx
          setError('Server Error: ' + error.response.data.message);
        } else if (error.request) {
          // The request was made but no response was received
          setError('Network Error: Unable to connect to the server.');
        } else {
          // Something happened in setting up the request that triggered an Error
          setError('Error: ' + error.message);
        }
      });
  };

  return (
    <Layout>
      {isOpen && (
        <MedicineDosageModal
          isOpen={isOpen}
          closeModal={() => setIsOpen(false)}
          addMedicineDosage={addMedicineDosage}
          onChangeMedicine={onChangeMedicine}
          medicine={medicine}
        />
      )}
      <div className="flex items-center gap-4">
        <Link
          to={`/patients/preview/1`}
          className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md"
        >
          <IoArrowBackOutline />
        </Link>
        <h1 className="text-xl font-semibold">New Medical Record</h1>
      </div>
      <div className="grid grid-cols-12 gap-6 my-8 items-start">
        <div className="col-span-12 flex-colo gap-6 lg:col-span-4 bg-white rounded-xl border-[1px] border-border p-6 lg:sticky top-28">
          <img
            src="/images/user7.png"
            alt="setting"
            className="w-40 h-40 rounded-full object-cover border border-dashed border-subMain"
          />
          <div className="gap-2 flex-colo">
            <h2 className="text-sm font-semibold">Saqlain Shah</h2>
            <p className="text-xs text-textGray">shah@gmail.com</p>
            <p className="text-xs">+923 412 345 678</p>
            <p className="text-xs text-subMain bg-text font-medium py-1 px-4 rounded-full border-[0.5px] border-subMain">
              45 yrs{' '}
            </p>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border-[1px] border-border p-6">
          <div className="flex w-full flex-col gap-5">
            <div className="flex w-full flex-col gap-3">
              <p className="text-black text-sm">Doctor</p>
              {/* <Select
                 selectedPerson={doctors}
                 setSelectedPerson={setDoctors}
                 datas={doctorsData}
               >
                 <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                   {doctors.name} <BiChevronDown className="text-xl" />
                 </div>
               </Select> */}
            </div>
            <Textarea
              label="Complains"
              color={true}
              rows={3}
              placeholder={'Bad breath, toothache, ....'}
              value={complaints}
              onChange={(e) => setComplaints(e.target.value)}
            />
            <Textarea
              label="Diagnosis"
              color={true}
              rows={3}
              placeholder={'Gingivitis, Periodontitis, ....'}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
            <Textarea
              label="Vital Signs"
              color={true}
              rows={3}
              placeholder={'Blood pressure, Pulse, ....'}
              value={vitalSigns}
              onChange={(e) => setVitalSigns(e.target.value)}
            />
            {/* medicine */}
            <div className="flex w-full flex-col gap-4 mb-6">
              <p className="text-black text-sm">Medicine</p>
              <div className="w-full overflow-x-scroll">
                <MedicineDosageTable
                  data={medicineData.slice(0, 3)} // Ensure medicineData is properly initialized
                  functions={{
                    delete: (id) => {
                      toast.error('This feature is not available yet');
                    },
                  }}
                  button={true}
                />
              </div>
              <button
                onClick={() => setIsOpen(true)}
                className="text-subMain flex-rows gap-2 rounded-lg border border-subMain border-dashed py-4 w-full text-sm"
              >
                <BiPlus /> Add Medicine
              </button>
            </div>

            <div className="flex w-full flex-col gap-4">
              <p className="text-black text-sm">Treatment</p>
              <div className="grid xs:grid-cols-2 md:grid-cols-3 gap-6 pb-6">
                {servicesData?.slice(1, 100).map((item) => (
                  <Checkboxe
                    label={item.name}
                    checked={
                      treatments.find((i) => i.name === item.name).checked
                    }
                    onChange={onChangeTreatments}
                    name={item.name}
                    key={item.id}
                  />
                ))}
              </div>
            </div>
            <div className="flex w-full flex-col gap-4">
              <p className="text-black text-sm">Attachments</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div className="relative w-full" key={index}>
                    {/* Render the uploaded image */}
                    <img
                      src={URL.createObjectURL(file)}
                      // alt={`Attachment ${index + 1}`}
                      className="w-full h-40 rounded-lg object-cover"
                    />
                    {/* Render a button for deletion (if needed) */}
                    <button
                      onClick={() => handleDeleteAttachment(index)}
                      className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center"
                    >
                      <FaTimes className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Uploader setUploadedFiles={setUploadedFiles} />
            <Button
              label={'Save'}
              Icon={HiOutlineCheckCircle}
              onClick={saveMedicalRecord}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default NewMedicalRecord;



// import React, { useState } from 'react';
// import Layout from '../../Layout';
// import { Link } from 'react-router-dom';
// import { IoArrowBackOutline } from 'react-icons/io5';
// import { Button, Checkbox, Select, Textarea } from '../../components/Form';
// import { BiChevronDown, BiPlus } from 'react-icons/bi';
// import { medicineData, memberData, servicesData } from '../../components/Datas';
// import { MedicineDosageTable } from '../../components/Tables';
// import { toast } from 'react-hot-toast';
// import MedicineDosageModal from '../../components/Modals/MedicineDosage';
// import { FaTimes } from 'react-icons/fa';
// import Uploader from '../../components/Uploader';
// import { HiOutlineCheckCircle } from 'react-icons/hi';

// const doctorsData = memberData.map((item) => {
//   return {
//     id: item.id,
//     name: item.title,
//   };
// });

// function NewMedicalRecode() {
//   const [doctors, setDoctors] = useState(doctorsData[0]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [treatmeants, setTreatmeants] = useState(
//     servicesData.map((item) => {
//       return {
//         name: item.name,
//         checked: false,
//         price: item.price,
//       };
//     })
//   );

//   // on change treatmeants
//   const onChangeTreatmeants = (e) => {
//     const { name, checked } = e.target;
//     const newTreatmeants = treatmeants.map((item) => {
//       if (item.name === name) {
//         return {
//           ...item,
//           checked: checked,
//         };
//       }
//       return item;
//     });
//     setTreatmeants(newTreatmeants);
//   };

//   return (
//     <Layout>
//       {
//         // modal
//         isOpen && (
//           <MedicineDosageModal
//             isOpen={isOpen}
//             closeModal={() => {
//               setIsOpen(false);
//             }}
//           />
//         )
//       }
//       <div className="flex items-center gap-4">
//         <Link
//           to={`/patients/preview/1`}
//           className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md"
//         >
//           <IoArrowBackOutline />
//         </Link>
//         <h1 className="text-xl font-semibold">New Medical Record</h1>
//       </div>
//       <div className=" grid grid-cols-12 gap-6 my-8 items-start">
//         <div
//           data-aos="fade-right"
//           data-aos-duration="1000"
//           data-aos-delay="100"
//           data-aos-offset="200"
//           className="col-span-12 flex-colo gap-6 lg:col-span-4 bg-white rounded-xl border-[1px] border-border p-6 lg:sticky top-28"
//         >
//           <img
//             src="/images/user7.png"
//             alt="setting"
//             className="w-40 h-40 rounded-full object-cover border border-dashed border-subMain"
//           />
//           <div className="gap-2 flex-colo">
//             <h2 className="text-sm font-semibold">Saqlain Shah</h2>
//             <p className="text-xs text-textGray">shah@gmail.com</p>
//             <p className="text-xs">+923 412 345 678</p>
//             <p className="text-xs text-subMain bg-text font-medium py-1 px-4 rounded-full border-[0.5px] border-subMain">
//               45 yrs{' '}
//             </p>
//           </div>
//         </div>
//         {/* tab panel */}
//         <div
//           data-aos="fade-left"
//           data-aos-duration="1000"
//           data-aos-delay="100"
//           data-aos-offset="200"
//           className="col-span-12 lg:col-span-8 bg-white rounded-xl border-[1px] border-border p-6"
//         >
//           <div className="flex w-full flex-col gap-5">
//             {/* doctor */}
//             <div className="flex w-full flex-col gap-3">
//               <p className="text-black text-sm">Doctor</p>
//               <Select
//                 selectedPerson={doctors}
//                 setSelectedPerson={setDoctors}
//                 datas={doctorsData}
//               >
//                 <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
//                   {doctors.name} <BiChevronDown className="text-xl" />
//                 </div>
//               </Select>
//             </div>
//             {/* complains */}
//             <Textarea
//               label="Complains"
//               color={true}
//               rows={3}
//               placeholder={'Bad breath, toothache, ....'}
//             />
//             {/* Diagnosis */}
//             <Textarea
//               label="Diagnosis"
//               color={true}
//               rows={3}
//               placeholder={'Gingivitis, Periodontitis, ....'}
//             />
//             {/* Vital Signs */}
//             <Textarea
//               label="Vital Signs"
//               color={true}
//               rows={3}
//               placeholder={'Blood pressure, Pulse, ....'}
//             />
//             {/* Treatment */}
//             <div className="flex w-full flex-col gap-4">
//               <p className="text-black text-sm">Treatment</p>
//               <div className="grid xs:grid-cols-2 md:grid-cols-3 gap-6 pb-6">
//                 {servicesData?.slice(1, 100).map((item) => (
//                   <Checkbox
//                     label={item.name}
//                     checked={
//                       treatmeants.find((i) => i.name === item.name).checked
//                     }
//                     onChange={onChangeTreatmeants}
//                     name={item.name}
//                     key={item.id}
//                   />
//                 ))}
//               </div>
//             </div>
//             {/* medicine */}
//             <div className="flex w-full flex-col gap-4 mb-6">
//               <p className="text-black text-sm">Medicine</p>
//               <div className="w-full overflow-x-scroll">
//                 <MedicineDosageTable
//                   data={medicineData?.slice(0, 3)}
//                   functions={{
//                     delete: (id) => {
//                       toast.error('This feature is not available yet');
//                     },
//                   }}
//                   button={true}
//                 />
//               </div>
//               <button
//                 onClick={() => {
//                   setIsOpen(true);
//                 }}
//                 className=" text-subMain flex-rows gap-2 rounded-lg border border-subMain border-dashed py-4 w-full text-sm"
//               >
//                 <BiPlus /> Add Medicine
//               </button>
//             </div>
//             {/* attachment */}
//             <div className="flex w-full flex-col gap-4">
//               <p className="text-black text-sm">Attachments</p>
//               <div className="grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
//                 {[1, 2, 3, 4].map((_, i) => (
//                   <div className="relative w-full">
//                     <img
//                       src={`https://placehold.it/300x300?text=${i}`}
//                       alt="patient"
//                       className="w-full  md:h-40 rounded-lg object-cover"
//                     />
//                     <button
//                       onClick={() =>
//                         toast.error('This feature is not available yet.')
//                       }
//                       className="bg-white rounded-full w-8 h-8 flex-colo absolute -top-1 -right-1"
//                     >
//                       <FaTimes className="text-red-500" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <Uploader setImage={{}} />
//             </div>
//             {/* submit */}
//             <Button
//               label={'Save'}
//               Icon={HiOutlineCheckCircle}
//               onClick={() => {
//                 toast.error('This feature is not available yet');
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }

// export default NewMedicalRecode;
