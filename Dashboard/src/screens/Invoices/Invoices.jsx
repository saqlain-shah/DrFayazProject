import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { Link } from 'react-router-dom';
import { BiPlus } from 'react-icons/bi';
import { InvoiceTable } from '../../components/Tables';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function Invoices() {
  const [invoicesData, setInvoicesData] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // Retrieve token from local storage
        const token = localStorage.getItem('token');

        // Make an HTTP GET request to fetch invoice data from the API
        const response = await axios.get('http://localhost:8800/api/invoices', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request headers
          },
        });

        setInvoicesData(response.data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        // Handle error, show error message, etc.
        toast.error('Error fetching invoices');
      }
    };

    fetchInvoices();
  }, []);

  // Function to delete an invoice
  const deleteInvoice = async (id) => {
    try {
      // Make an HTTP DELETE request to delete the invoice
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8800/api/invoices/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update state to remove the deleted invoice
      setInvoicesData(invoicesData.filter((invoice) => invoice._id !== id));

      toast.success('Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      // Handle error, show error message, etc.
      toast.error('Error deleting invoice');
    }
  };

  return (
    <Layout>
      <Link
        to="/invoices/create"
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </Link>
      <h1 className="text-xl font-semibold">Invoices</h1>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        <div className="grid md:grid-cols-6 sm:grid-cols-2 grid-cols-1 gap-2">
          <div className="md:col-span-5 grid lg:grid-cols-4 items-center gap-6">
            <input
              type="text"
              placeholder='Search "patient name"'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
            />
          </div>
        </div>
        <div className="mt-8 w-full overflow-x-scroll">
          <InvoiceTable data={invoicesData} deleteInvoice={deleteInvoice} />
        </div>
      </div>
    </Layout>
  );
}

export default Invoices;
