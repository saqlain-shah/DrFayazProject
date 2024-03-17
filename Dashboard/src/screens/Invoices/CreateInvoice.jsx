import React, { useState } from 'react';
import Layout from '../../Layout';
import axios from 'axios';
import { Button, FromToDate, Input, Select, Textarea } from '../../components/Form';
import { BiChevronDown, BiPlus } from 'react-icons/bi';
import AddItemModal from '../../components/Modals/AddItemInvoiceModal';
import { invoicesData, sortsDatas } from '../../components/Datas';
import { toast } from 'react-hot-toast';
import { BsSend } from 'react-icons/bs';
import { IoArrowBackOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { InvoiceProductsTable } from '../../components/Tables';
import SenderReceverComp from '../../components/SenderReceverComp';
//import { v4 as uuidv4 } from 'uuid';

function CreateInvoice() {
  const [dateRange, setDateRange] = useState([
    new Date(),
    new Date(new Date().setDate(new Date().getDate() + 7)),
  ]);
  const [startDate, endDate] = dateRange;
  const [isOpen, setIsOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);
  const [currency, setCurrency] = useState(sortsDatas.currency[0]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedService, setSelectedService] = useState(null); // Add selectedService to state
  const [invoiceItems, setInvoiceItems] = useState([]);

  // date picker
  const onChangeDates = (update) => {
    setDateRange(update);
  };

  const handleAddItemClick = () => {
    setItemOpen(true); // Open the modal
  };

  const handleSelectPatient = (patient) => {
    console.log('Selected patient:', patient);
    setSelectedPatient(patient);
  };

  const handleAddItem = (service, quantity) => {
    const newItem = {
      _id: service._id, // Use _id instead of id
      name: service.name,
      price: service.price,
      quantity: parseInt(quantity),
    };
    setInvoiceItems([...invoiceItems, newItem]); // Add selected service to invoice items
    setSelectedService(service); // Update selectedService state
  };

  const handleSaveAndSend = async () => {
    console.log("Selected patient:", selectedPatient);
    console.log("Selected service:", selectedService);
    console.log("Invoice items:", invoiceItems);

    try {
      // Check if selectedPatient is valid
      if (!selectedPatient || !selectedPatient._id || !selectedPatient.fullName) {
        console.error("Selected patient object is missing required fields");
        // Display an error message to the user
        toast.error("Selected patient is missing required fields");
        return; // Exit function
      }

      // Check if invoiceItems is empty
      if (invoiceItems.length === 0) {
        console.error("Invoice items are required");
        // Display an error message to the user
        toast.error("Please add items to the invoice");
        return; // Exit function
      }

      // Simulate sending the invoice by making an API call
      const token = localStorage.getItem("token");
      const response = await axios.post('http://localhost:8800/api/invoices', {
        selectedPatient,
        selectedService,
        invoiceItems
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Invoice sent successfully:', response.data);

      // You can perform further actions here based on the response, such as showing a success message
      toast.success('Invoice saved and sent successfully');
    } catch (error) {
      console.error('Error sending invoice:', error);
      // Handle error, show error message, etc.
      if (error.response) {
        // The request was made and the server responded with a status code
        // Display server error message to the user
        toast.error(error.response.data.message);
      } else {
        // Display generic error message to the user
        toast.error('Error occurred while sending the invoice');
      }
    }
  };





  const deleteItem = (itemId) => {
    const updatedItems = invoiceItems.filter((item) => item._id !== itemId);
    setInvoiceItems(updatedItems);
    toast.success('Item deleted successfully');
  };


  return (
    <Layout>
      {itemOpen && (
        <AddItemModal
          closeModal={() => setItemOpen(false)}
          isOpen={itemOpen}
          handleAddItem={handleAddItem} // Pass handleAddItem function
        />
      )}
      <div className="flex items-center gap-4">
        <Link
          to="/invoices"
          className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md"
        >
          <IoArrowBackOutline />
        </Link>
        <h1 className="text-xl font-semibold">Create Invoice</h1>
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2 items-center">
          <div className="lg:col-span-3">
            <img
              src="/images/logo.png"
              alt="logo"
              className=" w-32 object-contain"
            />
          </div>

          <div className="flex flex-col gap-4">
            <FromToDate
              startDate={startDate}
              endDate={endDate}
              label="Dates"
              onChange={onChangeDates}
            />
          </div>
        </div>
        <SenderReceverComp
          item={invoicesData?.[1].to}
          functions={{
            openModal: () => {
              setIsOpen(!isOpen);
            },
          }}
          button={true}
          selectedPatient={selectedPatient}
          handleSelectPatient={handleSelectPatient}
        />

        <div className="grid grid-cols-6 gap-6 mt-8">
          <div className="col-span-6 lg:col-span-4 p-6 border border-border rounded-xl overflow-hidden">
            <InvoiceProductsTable
              data={invoiceItems}
              functions={{ deleteItem }}
              button={true}
            />

            <button
              onClick={handleAddItemClick}
              className=" text-subMain flex-rows gap-2 rounded-lg border border-subMain border-dashed py-4 w-full text-sm mt-4"
            >
              <BiPlus /> Add Item
            </button>
          </div>
          <div className="lg:col-span-2 col-span-6 flex flex-col gap-6">
            <Select
              selectedPerson={currency}
              setSelectedPerson={setCurrency}
              datas={sortsDatas?.currency}
            >
              <div className="h-14 w-full text-xs text-main rounded-md border border-border px-4 flex items-center justify-between">
                <p>{currency?.name}</p>
                <BiChevronDown className="text-xl" />
              </div>
            </Select>
            <div className="grid sm:grid-cols-2 gap-6">
              <Input
                label="Discount"
                color={true}
                type="number"
                placeholder={'3000'}
              />
              <Input
                label="Tax(%)"
                color={true}
                type="number"
                placeholder={'3'}
              />
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Sub Total:</p>
              <h6 className="text-sm font-medium">$459</h6>
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Discount:</p>
              <h6 className="text-sm font-medium">$49</h6>
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Tax:</p>
              <h6 className="text-sm font-medium">$4.90</h6>
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Grand Total:</p>
              <h6 className="text-sm font-medium text-green-600">$6000</h6>
            </div>
            <Textarea
              label="Notes"
              placeholder="Thank you for your business. We hope to work with you again soon!"
              color={true}
              rows={3}
            />
            <Button
              label="Save & Send"
              onClick={handleSaveAndSend}
              Icon={BsSend}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateInvoice;
