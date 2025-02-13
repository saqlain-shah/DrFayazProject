import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { Link } from 'react-router-dom';
import { BiPlus } from 'react-icons/bi';
import { InvoiceTable } from '../../components/Tables';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import BASE_URL from '../../baseUrl.jsx';

function Invoices() {
  const [invoicesData, setInvoicesData] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/invoices`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInvoicesData(response.data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        toast.error('Error fetching invoices');
      }
    };

    fetchInvoices();
  }, []);

  const deleteInvoice = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/invoices/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInvoicesData(invoicesData.filter((invoice) => invoice._id !== id));
      toast.success('Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Error deleting invoice');
    }
  };
  const updateInvoiceData = (updatedInvoice) => {
    setInvoicesData(invoicesData.map((invoice) => {
      if (invoice._id === updatedInvoice._id) {
        return updatedInvoice;
      }
      return invoice;
    }));
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
            {/* <input
              type="text"
              placeholder='Search "patient name"'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
            /> */}
          </div>
        </div>
        <div className="mt-8 w-full overflow-x-hidden">
          <InvoiceTable data={invoicesData} deleteInvoice={deleteInvoice} updateInvoiceData={updateInvoiceData} />
        </div>
      </div>
    </Layout>
  );
}

export default Invoices;
