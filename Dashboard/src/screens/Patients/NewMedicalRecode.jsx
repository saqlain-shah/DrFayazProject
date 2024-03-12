import React, { useState, useEffect } from 'react';
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
import { useParams } from 'react-router-dom';
function NewMedicalRecord() {
  const { id } = useParams();
  const [patientData, setPatientData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [complaints, setComplaints] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [vitalSigns, setVitalSigns] = useState('');
  const [error, setError] = useState('');
  const [prescription, setPrescription] = useState([]);
  const [medicineDosages, setMedicineDosages] = useState([]);
  const [treatments, setTreatments] = useState(
    servicesData.map((item) => ({
      name: item.name,
      checked: false, // Ensure checked is set to a Boolean value
      price: item.price,
    }))
  );



  const addMedicineDosage = (medicineDosage) => {
    // Add the new medicine dosage to the medicine dosages state
    setMedicineDosages(prevMedicineDosages => [...prevMedicineDosages, medicineDosage]);
    console.log('Medicine Dosage:', medicineDosage);
  };

  const onChangeTreatments = (name, checked) => {
    const updatedTreatments = treatments.map((item) =>
      item.name === name ? { ...item, checked: !!checked } : item // Convert checked to Boolean
    );
    setTreatments(updatedTreatments);
  };



  // const onChangeMedicine = (name, checked) => {
  //   const updatedMedicineData = medicineData.map(item => {
  //     if (item && item.name === name) {
  //       return {
  //         ...item,
  //         checked: checked
  //       };
  //     }
  //     return item;
  //   });
  //   setMedicine(updatedMedicineData); // Update the medicineData state
  // };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the authentication token from storage
        const response = await axios.get(`http://localhost:8800/api/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` } // Include the token in the request headers
        });
        setPatientData(response.data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };
    fetchPatientData();
  }, [id]);


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

    // Initialize prescription array
    const prescriptionArray = prescription.map((name) => ({
      name,
    }));

    // Include medicine dosages in prescription array
    medicineDosages.forEach((medicineDosage) => {
      prescriptionArray.push({
        name: medicineDosage.item,
        quantity: medicineDosage.quantity,
        dosage: medicineDosage.dosageQuantity,
        instructions: medicineDosage.instructions,
        itemPrice: medicineDosage.itemPrice, // Include itemPrice
        amount: medicineDosage.amount // Include amount
      });
    });


    // Filter checked treatments for prescription
    const prescriptionTreatment = treatments
      .filter((item) => item.checked)
      .map((item) => ({
        name: item.name,
        checked: item.checked,
      }));

    const formData = new FormData();
    formData.append('complaints', complaints);
    formData.append('diagnosis', diagnosis);
    formData.append('vitalSigns', vitalSigns);
    // Append all uploaded files
    uploadedFiles.forEach((file, index) => {
      formData.append(`attachment`, file); // Use the same field name 'attachment'
    });
    // Convert prescription and medicine arrays to JSON strings
    formData.append(
      'prescription',
      JSON.stringify({
        medicines: prescriptionArray,
      })
    );
    // Append the prescription treatment
    formData.append('treatment', JSON.stringify(prescriptionTreatment));

    console.log('FormData:', formData); // Log the FormData object before sending the request
    const token = localStorage.getItem('token');
    axios
      .post('http://localhost:8800/api/medical-records', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          console.log(
            'Upload Progress:',
            Math.round((progressEvent.loaded / progressEvent.total) * 100) + '%'
          );
        },
      })
      .then((response) => {
        toast.success(response.data.message);
        setComplaints('');
        setDiagnosis('');
        setVitalSigns('');
        setUploadedFiles([]); // Clear uploaded files
        setTreatments((prevTreatments) =>
          prevTreatments.map((item) => ({ ...item, checked: false }))
        );
        setMedicineDosages([]); // Clear medicine dosages after saving
      })
      .catch((error) => {
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
        />
      )}
      <div className="flex items-center gap-4">
        <Link
          to={`/patients/preview/${id}`}

          className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md"
        >
          <IoArrowBackOutline />
        </Link>
        <h1 className="text-xl font-semibold">New Medical Record</h1>
      </div>
      <div className="grid grid-cols-12 gap-6 my-8 items-start">
        <div className="col-span-12 flex-colo gap-6 lg:col-span-4 bg-white rounded-xl border-[1px] border-border p-6 lg:sticky top-28">
          <img
            src={`http://localhost:8800/${patientData.profilePicture}`}
            alt="profile"
            className="w-40 h-40 rounded-full object-cover border border-dashed border-subMain"
          />
          <div className="gap-2 flex-colo">
            <h2 className="text-sm font-semibold">{patientData.fullName}</h2>
            <p className="text-xs text-textGray">{patientData.email}</p>
            <p className="text-xs">{patientData.emergencyContact}</p>
            <p className="text-xs text-subMain bg-text font-medium py-1 px-4 rounded-full border-[0.5px] border-subMain">
              {patientData.age} yrs
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
                <MedicineDosageTable data={medicineDosages} />
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
                    checked={treatments.find((i) => i.name === item.name).checked}
                    onChange={(checked) => onChangeTreatments(item.name, checked)} // Call onChangeTreatments with the treatment name and checked value
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



///////////////////////For refrence
// import React, { useState, useEffect } from 'react';
// import Layout from '../../Layout';
// import { Link } from 'react-router-dom';
// import { IoArrowBackOutline } from 'react-icons/io5';
// import { Button, Textarea, Checkboxe } from '../../components/Form';
// import { FaTimes } from 'react-icons/fa';
// import { BiChevronDown, BiPlus } from 'react-icons/bi';
// import { HiOutlineCheckCircle } from 'react-icons/hi';
// import axios from 'axios';
// import { MedicineDosageTable } from '../../components/Tables';
// import Uploader from '../../components/Uploader';
// import { servicesData, medicineData } from '../../components/Datas';
// import { toast } from 'react-hot-toast';
// import MedicineDosageModal from '../../components/Modals/MedicineDosage';
// import { useParams } from 'react-router-dom';
// function NewMedicalRecord() {
//   const { id } = useParams();
//   const [patientData, setPatientData] = useState({});
//   const [isOpen, setIsOpen] = useState(false);
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [complaints, setComplaints] = useState('');
//   const [diagnosis, setDiagnosis] = useState('');
//   const [vitalSigns, setVitalSigns] = useState('');
//   const [error, setError] = useState('');
//   const [prescription, setPrescription] = useState([]);
//   const [medicineDosages, setMedicineDosages] = useState([]);
//   const [treatments, setTreatments] = useState(
//     servicesData.map((item) => ({
//       name: item.name,
//       checked: false, // Ensure checked is set to a Boolean value
//       price: item.price,
//     }))
//   );



//   const addMedicineDosage = (medicineDosage) => {
//     // Add the new medicine dosage to the medicine dosages state
//     setMedicineDosages(prevMedicineDosages => [...prevMedicineDosages, medicineDosage]);
//     console.log('Medicine Dosage:', medicineDosage);
//   };

//   const onChangeTreatments = (name, checked) => {
//     const updatedTreatments = treatments.map((item) =>
//       item.name === name ? { ...item, checked: !!checked } : item // Convert checked to Boolean
//     );
//     setTreatments(updatedTreatments);
//   };



//   // const onChangeMedicine = (name, checked) => {
//   //   const updatedMedicineData = medicineData.map(item => {
//   //     if (item && item.name === name) {
//   //       return {
//   //         ...item,
//   //         checked: checked
//   //       };
//   //     }
//   //     return item;
//   //   });
//   //   setMedicine(updatedMedicineData); // Update the medicineData state
//   // };

//   useEffect(() => {
//     const fetchPatientData = async () => {
//       try {
//         const token = localStorage.getItem('token'); // Retrieve the authentication token from storage
//         const response = await axios.get(`http://localhost:8800/api/patients/${id}`, {
//           headers: { Authorization: `Bearer ${token}` } // Include the token in the request headers
//         });
//         setPatientData(response.data);
//       } catch (error) {
//         console.error('Error fetching patient data:', error);
//       }
//     };
//     fetchPatientData();
//   }, [id]);


//   const onChangePrescription = (name, checked) => {
//     const updatedPrescription = [...prescription];
//     if (checked) {
//       updatedPrescription.push(name);
//     } else {
//       const index = updatedPrescription.indexOf(name);
//       if (index !== -1) {
//         updatedPrescription.splice(index, 1);
//       }
//     }
//     setPrescription(updatedPrescription);
//   };



//   const saveMedicalRecord = () => {
//     if (!complaints || !diagnosis || !vitalSigns) {
//       setError('All fields except treatment and attachments are required');
//       return;
//     }

//     // Initialize prescription array
//     const prescriptionArray = prescription.map((medicineDosages) => ({
//       name: medicineDosages.name,
//       quantity: medicineDosages.quantity,
//       dosage: medicineDosages.dosage,
//       instructions:medicineDosages.instructions
//     }));

//     // Filter checked treatments for prescription
//     const prescriptionTreatment = treatments
//       .filter((item) => item.checked)
//       .map((item) => ({
//         name: item.name,
//         checked: item.checked,
//       }));

//     const formData = new FormData();
//     formData.append('complaints', complaints);
//     formData.append('diagnosis', diagnosis);
//     formData.append('vitalSigns', vitalSigns);
//     // Append all uploaded files
//     uploadedFiles.forEach((file, index) => {
//       formData.append(`attachment`, file); // Use the same field name 'attachment'
//     });
//     // Convert prescription and medicine arrays to JSON strings
//     formData.append('prescription', JSON.stringify({
//       medicines: prescriptionArray,
//       instructions: medicineDosages.instructions, // You need to define prescriptionInstruction
//     }));
//     // Append the prescription treatment
//     formData.append('treatment', JSON.stringify(prescriptionTreatment));

//     console.log('FormData:', formData); // Log the FormData object before sending the request

//     axios
//       .post('http://localhost:8800/api/medical-records', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         onUploadProgress: (progressEvent) => {
//           console.log(
//             'Upload Progress:',
//             Math.round((progressEvent.loaded / progressEvent.total) * 100) + '%'
//           );
//         },
//       })
//       .then((response) => {
//         toast.success(response.data.message);
//         setComplaints('');
//         setDiagnosis('');
//         setVitalSigns('');
//         setUploadedFiles([]); // Clear uploaded files
//         setTreatments((prevTreatments) =>
//           prevTreatments.map((item) => ({ ...item, checked: false }))
//         );
//       })
//       .catch((error) => {
//         if (error.response) {
//           // Server responded with a status code outside of 2xx
//           setError('Server Error: ' + error.response.data.message);
//         } else if (error.request) {
//           // The request was made but no response was received
//           setError('Network Error: Unable to connect to the server.');
//         } else {
//           // Something happened in setting up the request that triggered an Error
//           setError('Error: ' + error.message);
//         }
//       });
//   };





//   return (
//     <Layout>
//       {isOpen && (
//         <MedicineDosageModal
//           isOpen={isOpen}
//           closeModal={() => setIsOpen(false)}
//           addMedicineDosage={addMedicineDosage}
//         />
//       )}
//       <div className="flex items-center gap-4">
//         <Link
//           to={`/patients/preview/${id}`}

//           className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md"
//         >
//           <IoArrowBackOutline />
//         </Link>
//         <h1 className="text-xl font-semibold">New Medical Record</h1>
//       </div>
//       <div className="grid grid-cols-12 gap-6 my-8 items-start">
//         <div className="col-span-12 flex-colo gap-6 lg:col-span-4 bg-white rounded-xl border-[1px] border-border p-6 lg:sticky top-28">
//           <img
//             src={`http://localhost:8800/${patientData.profilePicture}`}
//             alt="profile"
//             className="w-40 h-40 rounded-full object-cover border border-dashed border-subMain"
//           />
//           <div className="gap-2 flex-colo">
//             <h2 className="text-sm font-semibold">{patientData.fullName}</h2>
//             <p className="text-xs text-textGray">{patientData.email}</p>
//             <p className="text-xs">{patientData.emergencyContact}</p>
//             <p className="text-xs text-subMain bg-text font-medium py-1 px-4 rounded-full border-[0.5px] border-subMain">
//               {patientData.age} yrs
//             </p>
//           </div>
//         </div>

//         <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border-[1px] border-border p-6">
//           <div className="flex w-full flex-col gap-5">
//             <div className="flex w-full flex-col gap-3">
//               <p className="text-black text-sm">Doctor</p>
//               {/* <Select
//                  selectedPerson={doctors}
//                  setSelectedPerson={setDoctors}
//                  datas={doctorsData}
//                >
//                  <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
//                    {doctors.name} <BiChevronDown className="text-xl" />
//                  </div>
//                </Select> */}
//             </div>
//             <Textarea
//               label="Complains"
//               color={true}
//               rows={3}
//               placeholder={'Bad breath, toothache, ....'}
//               value={complaints}
//               onChange={(e) => setComplaints(e.target.value)}
//             />
//             <Textarea
//               label="Diagnosis"
//               color={true}
//               rows={3}
//               placeholder={'Gingivitis, Periodontitis, ....'}
//               value={diagnosis}
//               onChange={(e) => setDiagnosis(e.target.value)}
//             />
//             <Textarea
//               label="Vital Signs"
//               color={true}
//               rows={3}
//               placeholder={'Blood pressure, Pulse, ....'}
//               value={vitalSigns}
//               onChange={(e) => setVitalSigns(e.target.value)}
//             />
//             {/* medicine */}
//             <div className="flex w-full flex-col gap-4 mb-6">
//               <p className="text-black text-sm">Medicine</p>
//               <div className="w-full overflow-x-scroll">
//                 <MedicineDosageTable data={medicineDosages} />
//               </div>
//               <button
//                 onClick={() => setIsOpen(true)}
//                 className="text-subMain flex-rows gap-2 rounded-lg border border-subMain border-dashed py-4 w-full text-sm"
//               >
//                 <BiPlus /> Add Medicine
//               </button>
//             </div>

//             <div className="flex w-full flex-col gap-4">
//               <p className="text-black text-sm">Treatment</p>
//               <div className="grid xs:grid-cols-2 md:grid-cols-3 gap-6 pb-6">
//                 {servicesData?.slice(1, 100).map((item) => (
//                   <Checkboxe
//                     label={item.name}
//                     checked={treatments.find((i) => i.name === item.name).checked}
//                     onChange={(checked) => onChangeTreatments(item.name, checked)} // Call onChangeTreatments with the treatment name and checked value
//                     name={item.name}
//                     key={item.id}
//                   />
//                 ))}

//               </div>
//             </div>
//             <div className="flex w-full flex-col gap-4">
//               <p className="text-black text-sm">Attachments</p>
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                 {uploadedFiles.map((file, index) => (
//                   <div className="relative w-full" key={index}>
//                     {/* Render the uploaded image */}
//                     <img
//                       src={URL.createObjectURL(file)}
//                       // alt={`Attachment ${index + 1}`}
//                       className="w-full h-40 rounded-lg object-cover"
//                     />
//                     {/* Render a button for deletion (if needed) */}
//                     <button
//                       onClick={() => handleDeleteAttachment(index)}
//                       className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center"
//                     >
//                       <FaTimes className="text-red-500" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             {error && <p className="text-red-500">{error}</p>}
//             <Uploader setUploadedFiles={setUploadedFiles} />
//             <Button
//               label={'Save'}
//               Icon={HiOutlineCheckCircle}
//               onClick={saveMedicalRecord}
//             />
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }

// export default NewMedicalRecord;
//  it show here in clonsloe Medicine Dosage: {instruction: 'asd', quantity: 23456, dosageQuantity: 32456, itemPrice: 234562, item: '34', …} but
// const addMedicineDosage = (medicineDosage) => {
//     // Add the new medicine dosage to the medicine dosages state
//     setMedicineDosages(prevMedicineDosages => [...prevMedicineDosages, medicineDosage]);
//     console.log('Medicine Dosage:', medicineDosage);
//   }; but int not attached with save button  in payload the medicine in empty deeply check and write update code 