import React, { useState, useEffect } from 'react';
import { InvoiceUsedTable } from '../Tables';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function InvoiceUsed({ token, patientId }) {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        if (patientId) { // Check if patientId is defined
          const response = await axios.get(`http://localhost:8800/api/invoices/patient/${patientId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setInvoices(response.data);
        }
      } catch (error) {
        console.error('Error fetching invoice data:', error);
      }
    };

    fetchInvoices();
  }, [patientId, token]);


  // Function to preview invoice
  const previewInvoice = (id) => {
    if (id !== undefined) {
      navigate(`/invoices/preview/${id}`);
    } else {
      console.error('Error: Invalid invoice ID');
    }
  };


  return (
    <div className="w-full">
      <h1 className="text-sm font-medium mb-6">Invoices</h1>
      <div className="w-full overflow-x-hidden">
        <InvoiceUsedTable
          data={invoices}
          functions={{
            preview: previewInvoice,
          }}
        />
      </div>
    </div>
  );
}

export default InvoiceUsed;
