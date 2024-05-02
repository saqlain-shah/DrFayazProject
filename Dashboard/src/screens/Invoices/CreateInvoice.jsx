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
import pic from '../../build/images/upLogo.jpg';
//import { v4 as uuidv4 } from 'uuid';

function CreateInvoice() {
  const [dateRange, setDateRange] = useState([
    new Date(),
    new Date(new Date().setDate(new Date().getDate() + 7)),
  ]);
  const [currency, setCurrency] = useState(sortsDatas.currency[0]);
  const [startDate, endDate] = dateRange;
  const [isOpen, setIsOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(sortsDatas.currency[0]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [notes, setNotes] = useState("Thank you for your business. We hope to work with you again soon.");
  const onChangeDates = (update) => {
    setDateRange(update);
  };

  const handleAddItemClick = () => {
    setItemOpen(true);
  };


  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const handleAddItem = (service, quantity) => {
    const newItem = {
      _id: service._id,
      name: service.name,
      price: service.price,
      quantity: parseInt(quantity),
      subtotal: calculateSubtotal(service.price, quantity) // Calculate subtotal in selected currency basis
    };

    // Add the new item to the invoice items
    const updatedInvoiceItems = [...invoiceItems, newItem];
    setInvoiceItems(updatedInvoiceItems);

    // Calculate the new subtotal by summing up the subtotal of all items
    const newSubtotal = updatedInvoiceItems.reduce((acc, item) => acc + item.subtotal, 0);
    setSubtotal(newSubtotal); // Update the subtotal for the entire invoice

    // Update grand total with new subtotal, discount, and tax
    calculateGrandTotal(newSubtotal, discount, tax);

    setSelectedService(service);
  };

  // Function to calculate subtotal in selected currency basis
  const calculateSubtotal = (price, quantity) => {
    // Assuming currency conversion logic is implemented here based on selectedCurrency
    // Return the subtotal calculated in the selected currency
    return price * quantity; // Modify this based on your currency conversion logic
  };


  // components/CreateInvoice.js

  const handleSaveAndSend = async () => {
    try {
      // Calculate grand total based on selected currency
      let selectedCurrency = currency.name.split(' ')[0]; // Extract currency code (USD, PKR, EUR, etc.)
      let grandTotalInSelectedCurrency = grandTotal;
      if (selectedCurrency !== "USD") {
        grandTotalInSelectedCurrency = grandTotal * 1.17; // Assuming conversion rate of 1 USD = 0.85 EUR
      }

      // Check if selectedPatient is defined
      if (!selectedPatient || !selectedPatient._id) {
        toast.error("Please select a patient");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await axios.post('https://server-yvzt.onrender.com/api/invoices', {
        selectedPatient,
        invoiceItems,
        tax,
        discount,
        grandTotal: grandTotalInSelectedCurrency,
        currency: selectedCurrency
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Reset states after successful submission
      setSelectedPatient(null);
      setInvoiceItems([]);
      setSubtotal(0);
      setDiscount(0);
      setTax(0);
      setGrandTotal(0);
      setNotes("Thank you for your business. We hope to work with you again soon.");

      console.log('Invoice sent successfully:', response.data);
      toast.success('Invoice saved and sent successfully');
    } catch (error) {
      console.error('Error sending invoice:', error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error occurred while sending the invoice');
      }
    }
  };

  const handleCurrencyChange = (selectedCurrency) => {
    setCurrency(selectedCurrency);
    setSelectedCurrency(selectedCurrency);

    const exchangeRates = {
      USD: 1,   // Assuming 1 USD = 1 USD
      EUR: 0.66,   // Assuming 1 EUR = 0.66 USD
      PKR: 278.96   // Assuming 1 PKR = 278.96 USD
      // Add more currencies and their conversion rates as needed
    };

    // Calculate subtotal and update invoice items with the new currency
    const updatedItems = invoiceItems.map(item => {
      const price = typeof item.price === 'number' ? item.price : 0;
      const convertedPrice = price * exchangeRates[selectedCurrency.name.split(' ')[0]]; // Multiply by the exchange rate
      const subtotal = convertedPrice * item.quantity; // Calculate subtotal based on converted price
      return {
        ...item,
        subtotal: subtotal
      };
    });

    // Update invoice items with the new subtotal
    setInvoiceItems(updatedItems);

    // Calculate new subtotal
    const newSubtotal = updatedItems.reduce((acc, item) => acc + item.subtotal, 0);
    setSubtotal(newSubtotal);

    // Recalculate grand total with new subtotal, tax, and discount
    calculateGrandTotal(newSubtotal, discount, tax);
  };









  const deleteItem = (itemId) => {
    // Filter out the deleted item
    const updatedItems = invoiceItems.filter((item) => item._id !== itemId);
    setInvoiceItems(updatedItems);

    // Calculate the new subtotal after removing the deleted item
    const newSubtotal = updatedItems.reduce((acc, item) => acc + item.subtotal, 0);
    setSubtotal(newSubtotal);

    // Recalculate the grand total with the new subtotal, discount, and tax
    calculateGrandTotal(newSubtotal, discount, tax);

    toast.success('Item deleted successfully');
  };

  const handleSubtotalChange = (event) => {
    const newSubtotal = parseFloat(event.target.value) || 0;
    setSubtotal(newSubtotal);
    calculateGrandTotal(newSubtotal, discount, tax);
  };

  const handleDiscountChange = (event) => {
    const newDiscount = parseFloat(event.target.value) || 0;
    setDiscount(newDiscount);
    calculateGrandTotal(subtotal, newDiscount, tax); // Update grand total with new discount
  };

  const handleTaxChange = (event) => {
    const newTax = parseFloat(event.target.value) || 0;
    setTax(newTax);
    calculateGrandTotal(subtotal, discount, newTax); // Update grand total with new tax
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  const calculateGrandTotal = (subTotal, discount, tax) => {
    const total = subTotal - discount + tax;
    setGrandTotal(total);
  };

  return (
    <Layout>
      {itemOpen && (
        <AddItemModal
          closeModal={() => setItemOpen(false)}
          isOpen={itemOpen}
          handleAddItem={handleAddItem}
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
      <div className="bg-white my-8 rounded-xl border-[1px] border-border p-5">
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2 items-center">
          <div className="lg:col-span-3">
            <img
              src={pic}
              alt="logo"
              className=" w-36 object-contain"
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
              selectedCurrency={selectedCurrency}
              discount={discount}
              tax={tax}
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
              setSelectedPerson={handleCurrencyChange}
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
                value={discount.toString()} // Update value prop to display discount
                onChange={handleDiscountChange} // Add onChange handler
                placeholder={'3000'}
              />
              <Input
                label="Tax(%)"
                color={true}
                type="number"
                value={tax.toString()} // Update value prop to display tax
                onChange={handleTaxChange} // Add onChange handler
                placeholder={'3'}
              />
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Sub Total:</p>
              <Input
                type="number"
                color={true}
                value={subtotal.toString()} // Update value prop to display subtotal
                onChange={handleSubtotalChange} // Add onChange handler
              />
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Discount:</p>
              <Input
                type="number"
                color={true}
                value={discount.toString()} // Update value prop to display discount
                onChange={handleDiscountChange} // Add onChange handler
              />
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Tax:</p>
              <Input
                type="number"
                color={true}
                value={tax.toString()} // Update value prop to display tax
                onChange={handleTaxChange} // Add onChange handler
              />
            </div>
            <div className="flex-btn gap-4">
              <p className="text-sm font-extralight">Grand Total:</p>
              <h6 className="text-sm font-medium text-green-600">{grandTotal.toString()}</h6>
            </div>
            <Textarea
              label="Notes"
              value={notes}
              onChange={handleNotesChange}
              rows={3}
            />
            <Button
              label="Save"
              onClick={handleSaveAndSend}
              Icon={BsSend}
            />
          </div>
        </div>
      </div>
    </Layout >
  );
}

export default CreateInvoice;
