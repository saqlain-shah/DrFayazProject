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
  const exchangeRates = {
    USD: 1, // 1 USD = 1 USD
    PKR: 177.5, // 1 USD = 177.5 PKR (for example)
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
      subtotal: service.price * parseInt(quantity) // Calculate subtotal for the item
    };

    // Add the new item to the invoice items
    const updatedInvoiceItems = [...invoiceItems, newItem];
    setInvoiceItems(updatedInvoiceItems);

    // Calculate the new subtotal by summing up the subtotal of all items
    const newSubtotal = updatedInvoiceItems.reduce((acc, item) => acc + item.subtotal, 0);
    setSubtotal(newSubtotal);

    // Update grand total with new subtotal, discount, and tax
    calculateGrandTotal(newSubtotal, discount, tax);

    setSelectedService(service);
  };

  const handleSaveAndSend = async () => {
    try {
      // Check if selectedPatient is defined
      if (!selectedPatient || !selectedPatient._id) {
        toast.error("Please select a patient");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await axios.post('http://localhost:8800/api/invoices', {
        selectedPatient: selectedPatient, // Include selectedPatient object
        selectedService,
        invoiceItems
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSelectedPatient(null);
      setSelectedService(null);
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
    if (!selectedCurrency || !selectedCurrency.name) {
      console.error("Invalid currency object:", selectedCurrency);
      return;
    }

    const currencyCode = selectedCurrency.code || selectedCurrency.id;
    console.log(`Currency changed to: ${selectedCurrency.name} (${currencyCode})`);

    // Retrieve the exchange rate for the selected currency
    const newExchangeRate = exchangeRates[currencyCode];

    if (!newExchangeRate) {
      console.error("Exchange rate not found for currency:", currencyCode);
      return;
    }

    // Calculate new amounts based on selected currency
    const newSubtotal = subtotal / exchangeRates[currency.code] * newExchangeRate;
    const newDiscount = discount / exchangeRates[currency.code] * newExchangeRate;
    const newTax = tax / exchangeRates[currency.code] * newExchangeRate;
    const newGrandTotal = newSubtotal - newDiscount + newTax; // Recalculate grand total

    // Check for NaN or undefined values
    if (isNaN(newSubtotal) || isNaN(newDiscount) || isNaN(newTax) || isNaN(newGrandTotal)) {
      console.error("Invalid calculation result. Check exchange rates and input values.");
      return;
    }

    // Update currency and amounts
    setCurrency(selectedCurrency);
    setSubtotal(newSubtotal);
    setDiscount(newDiscount);
    setTax(newTax);
    setGrandTotal(newGrandTotal);
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
    calculateGrandTotal(subtotal, newDiscount, tax);
  };

  const handleTaxChange = (event) => {
    const newTax = parseFloat(event.target.value) || 0;
    setTax(newTax);
    calculateGrandTotal(subtotal, discount, newTax);
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
              label="Save & Send"
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
