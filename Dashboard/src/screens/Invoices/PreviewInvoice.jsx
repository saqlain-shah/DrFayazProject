import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
// import { invoicesData } from '../../components/Datas';
import { toast } from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import { FiEdit } from 'react-icons/fi';
import { MdOutlineCloudDownload } from 'react-icons/md';
import { AiOutlinePrinter } from 'react-icons/ai';
import PaymentModal from '../../components/Modals/PaymentModal';
import { RiShareBoxLine } from 'react-icons/ri';
import ShareModal from '../../components/Modals/ShareModal';
import SenderReceverComp from '../../components/SenderReceverComp';
import { InvoiceProductsTable } from '../../components/Tables';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function PreviewInvoice() {
  const { id } = useParams();
  console.log("id", id)
  const [isOpen, setIsoOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [loader, setLoader] = useState(false)
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    console.log("Fetching invoice with ID:", id);
    if (!id) {
      console.error("ID parameter is undefined");
      return;
    }

    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8800/api/invoices/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch invoice');
        }

        const invoiceData = await response.json();
        console.log("Fetched invoice data:", invoiceData);
        setInvoice(invoiceData);
      } catch (error) {
        console.error('Error fetching invoice:', error);
        toast.error('Failed to fetch invoice');
      }
    };

    fetchInvoice();
  }, [id]);

  const calculateSubtotal = (items) => {
    let subtotal = 0;
    items.forEach((item) => {
      subtotal += item.price * item.quantity;
    });
    return subtotal;
  };
  const calculateGrandTotal = (subtotal, discount, tax) => {
    const discountedAmount = subtotal - (subtotal * discount) / 100;
    const totalWithTax = discountedAmount + (discountedAmount * tax) / 100;
    return totalWithTax;
  };

  // Inside the PreviewInvoice component
  console.log("Invoice data:", invoice);
  console.log("Discount:", invoice?.discount);
  console.log("Tax:", invoice?.tax);

  const subtotal = calculateSubtotal(invoice?.invoiceItems || []);
  const grandTotal = calculateGrandTotal(subtotal, invoice?.discount || 0, invoice?.tax || 0);

  console.log("Subtotal:", subtotal);
  console.log("Grand Total:", grandTotal);



  const convertToPDF = () => {
    return new Promise((resolve, reject) => {
      const capture = document.querySelector('.actual-receipt');
      if (!capture) {
        const error = new Error("Element with class 'actual-receipt' not found.");
        console.error(error);
        reject(error);
        return;
      }

      // Generate the PDF
      html2canvas(capture)
        .then((canvas) => {
          // Create a new jsPDF instance
          const doc = new jsPDF('p', 'mm', 'a4');

          // Calculate the width and height of the canvas
          const width = canvas.width * 0.264583;
          const height = canvas.height * 0.264583;

          // Add image data to the PDF
          doc.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, width, height);

          // Generate Blob object from the PDF document
          const pdfBlob = doc.output('blob');

          // Resolve the promise with the Blob object
          resolve(pdfBlob);
        })
        .catch((error) => {
          console.error('Error converting to PDF:', error);
          reject(error);
        });
    });
  };

  const buttonClass = 'bg-subMain flex-rows gap-3 bg-opacity-5 text-subMain rounded-lg border border-subMain border-dashed px-4 py-3 text-sm';

  const downloadPDF = () => {
    const capture = document.querySelector('.actual-receipt');
    if (!capture) {
      console.error("Element with class 'actual-receipt' not found.");
      return;
    }

    setLoader(true);
    html2canvas(capture, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('p', 'mm', 'legal');
      const aspectRatio = canvas.width / canvas.height;
      const width = doc.internal.pageSize.getWidth() - 20; // Adjust margins
      const height = width / aspectRatio;

      doc.addImage(imgData, 'PNG', 10, 10, width, height);
      setLoader(false);
      doc.save('receipt.pdf');
    });
  };


  const shareViaEmail = async () => {
    try {
      // Convert content to PDF
      const doc = await convertToPDF();

      // Convert PDF blob to URL
      const attachmentURL = doc.output('blob');

      // Construct the mailto link with pre-filled data
      const gmailURL = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&attachment=${attachmentURL}`;

      // Open mailto link in a new tab
      window.open(gmailURL, '_blank');
    } catch (error) {
      console.error('Error sharing via email:', error);
    }
  };

  const shareViaWhatsApp = async (phoneNumber) => {
    try {
      // Convert content to PDF
      const doc = await convertToPDF();

      // Check if doc is a Blob object
      if (!(doc instanceof Blob)) {
        throw new Error('PDF conversion failed: Invalid Blob object');
      }

      // Generate a message with the PDF file
      const message = 'Here is the invoice';

      // Create an object representing the PDF file
      const pdfFile = new File([doc], 'invoice.pdf', { type: 'application/pdf' });

      // Construct the WhatsApp message with the PDF file
      const whatsappMessage = `https://wa.me/${1234567890}?text=${encodeURIComponent(message)}`;

      // Open WhatsApp with pre-filled message and PDF file
      window.open(whatsappMessage, '_blank');
    } catch (error) {
      console.error('Error sharing via WhatsApp:', error);
    }
  };

  const printPDF = () => {
    const prtContent = document.querySelector('.actual-receipt').innerHTML;
    const originalBodyContent = document.body.innerHTML;

    // Replace the entire body content with the content of .actual-receipt
    document.body.innerHTML = prtContent;

    // Trigger the print dialog
    window.print();

    // Restore the original body content
    document.body.innerHTML = originalBodyContent;
  };



  return (
    <Layout>
      {isOpen && (
        <PaymentModal
          isOpen={isOpen}
          closeModal={() => {
            setIsoOpen(false);
          }}
        />
      )}
      {isShareOpen && (
        <ShareModal
          isOpen={isShareOpen}
          closeModal={() => {
            setIsShareOpen(false);
          }}
        />
      )}
      <div className="flex-btn flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/invoices"
            className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md"
          >
            <IoArrowBackOutline />
          </Link>
          <h1 className="text-xl font-semibold">Preview Invoice</h1>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {/* <button
            onClick={() => {
              setIsShareOpen(true);
            }}
            className={buttonClass}
          >
            Share <RiShareBoxLine />
          </button>
          <button
            className={buttonClass}
            onClick={shareViaWhatsApp}
          >
            WhatsApp
          </button> */}
          {/* <button
            className={buttonClass}
            onClick={shareViaEmail}
          >
            Email
          </button> */}
          <button
            className={buttonClass}
            onClick={downloadPDF}
            disabled={loader}
          >
            {loader ? (
              <span>Downloading</span>
            ) : (
              <span className={`flex items-center justify-between gap-4`}> Download <MdOutlineCloudDownload /></span>
            )}
          </button>
          <button
            onClick={printPDF}
            className={buttonClass}
          >
            Print <AiOutlinePrinter />
          </button>
          {/* <Link to={`/invoices/edit/${invoice?._id}`} className={buttonClass}>
            Editt <FiEdit />
          </Link> */}

        </div>
      </div>
      <div className='actual-receipt'>
        {invoice && (
          <div className="bg-white my-8 rounded-xl border-[1px] border-border p-5">
            <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2 items-center">
              <div className="lg:col-span-3">
                <img
                  src="/images/logo.png"
                  alt="logo"
                  className="w-32 object-contain"
                />
              </div>
              <div className="flex flex-col gap-4 sm:items-end">
                {/* <h6 className="text-xs font-medium">#{invoice?.id}</h6> */}
                <div className="flex gap-4">
                  <p className="text-sm font-extralight">Date:</p>
                  <h6 className="text-xs font-medium">{invoice?.createdDate}</h6>
                </div>
                <div className="flex gap-4">
                  <p className="text-sm font-extralight">Due Date:</p>
                  <h6 className="text-xs font-medium">{invoice?.dueDate}</h6>
                </div>
              </div>
            </div>
            {invoice.to && (
              <SenderReceverComp item={invoice.to} functions={{}} button={false} />
            )}
            <div className="grid grid-cols-6 gap-6 mt-8">
              <div className="lg:col-span-4 col-span-6 p-6 border border-border rounded-xl overflow-hidden">
                <InvoiceProductsTable
                  data={invoice?.invoiceItems}
                  discount={invoice?.discount || 0} // Provide a default value if discount is not provided
                  tax={invoice?.tax || 0}
                  total={invoice?.total}
                />
              </div>
              {/* <div className="col-span-6 lg:col-span-2 flex flex-col gap-6">
                <div className="flex-btn gap-4">
                  <p className="text-sm font-extralight">Currency:</p>
                  <h6 className="text-sm font-medium">USD ($)</h6>
                </div>
                <div className="flex-btn gap-4">
                  <p className="text-sm font-extralight">Sub Total:</p>
                  <h6 className="text-sm font-medium">${subtotal}</h6>
                </div>
                <div className="flex-btn gap-4">
                  <p className="text-sm font-extralight">Discount:</p>
                  <h6 className="text-sm font-medium">${invoice?.discount || 0}</h6>
                </div>
                <div className="flex-btn gap-4">
                  <p className="text-sm font-extralight">Tax:</p>
                  <h6 className="text-sm font-medium">${invoice?.tax || 0}</h6>
                </div>
                <div className="flex-btn gap-4">
                  <p className="text-sm font-extralight">Grand Total:</p>
                  <h6 className="text-sm font-medium text-green-600">${grandTotal}</h6>
                </div>
                <div className="w-full p-4 border border-border rounded-lg">
                  <h1 className="text-sm font-medium">Notes</h1>
                  <p className="text-xs mt-2 font-light leading-5">
                    Thank you for your business. We hope to work with you again soon. You can pay your invoice online at
                    www.example.com/payments
                  </p>
                </div>
              </div> */}

            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default PreviewInvoice;
