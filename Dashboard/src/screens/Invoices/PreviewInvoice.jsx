import React, { useState } from 'react';
import Layout from '../../Layout';
import { invoicesData } from '../../components/Datas';
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
  const [isOpen, setIsoOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [loader, setLoader] = useState(false)

  const convertToPDF = (fileName) => {
    const capture = document.querySelector('.actual-receipt');
    if (!capture) {
      console.error(`Element with selector not found.`);
      return;
    }
    setLoader(true);
    html2canvas(capture).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('p', 'mm', 'a4');
      const componentWidth = doc.internal.pageSize.getWidth();
      const componentHeight = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
      setLoader(false);
      return doc
    });
  };

  const buttonClass = 'bg-subMain flex-rows gap-3 bg-opacity-5 text-subMain rounded-lg border border-subMain border-dashed px-4 py-3 text-sm';

  const invoice = invoicesData.find((invoice) => invoice.id.toString() === id);



  const downloadPDF = () => {
    const capture = document.querySelector('.actual-receipt');
    if (!capture) {
      console.error("Element with class 'actual-receipt' not found.");
      return;
    }
    setLoader(true);
    html2canvas(capture).then((canvas) => {
      const imgData = canvas.toDataURL(' img/png');
      const doc = new jsPDF('p', 'mm', 'legal')
      const componentWidth = doc.internal.pageSize.getWidth();
      const componentHeight = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, ' PNG', 0, 0, componentWidth, componentHeight);
      setLoader(false);
      doc.save(' receipt. pdf');
    })
  }

  const shareViaEmail = (emailAddress, subject, body, attachmentFileName, containerSelector) => {
    const attachmentDataURL = convertToPDF(attachmentFileName);
    // Here you can implement the functionality to share via email using the fetched email address, subject, body, and attachment data
    // Example:
    window.open(`mailto:${emailAddress}?subject=${subject}&body=${body}`);
  };

  const shareViaWhatsApp = (phoneNumber, message, attachmentFileName, containerSelector) => {
    const attachmentDataURL = convertToPDF(attachmentFileName);
    // Here you can implement the functionality to share via WhatsApp using the fetched phone number, message, and attachment data
    // Example:
    window.open(`https://wa.me/+923554472161?text=${message}`);
  };

  const printPDF = () => {
    // const doc = convertToPDF('receipt');
    // Here you can implement the functionality to print the PDF document
    // Example:
    var prtContent = document.querySelector('.actual-receipt');
    var WinPrint = window.open();
    WinPrint.document.write(prtContent.innerHTML);
    WinPrint.print();
    // const capture = document.querySelector('.actual-receipt');
    // capture.window.print()
    // window.print(capture);
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
          {/* button */}
          <button
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
            Whatsapp 
          </button>


          <button
            className={buttonClass}
            onClick={downloadPDF}
            disabled={!(loader === false)}
          >
            {loader ? (
              <span>Downloading</span>
            ) : (
              <span className={`flex items-center justify-between gap-4`}> Download <MdOutlineCloudDownload /></span>
            )}
          </button>
          <button
            onClick={() => printPDF()}
            className={buttonClass}
          >
            Print <AiOutlinePrinter />
          </button>
          <Link to={`/invoices/edit/` + invoice?.id} className={buttonClass}>
            Edit <FiEdit />
          </Link>
        </div>
      </div>
      <div className='actual-receipt'>
        <div
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="100"
          data-aos-offset="200"
          className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
        >
          {/* header */}
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2 items-center">
            <div className="lg:col-span-3">
              <img
                src="/images/logo.png"
                alt="logo"
                className=" w-32 object-contain"
              />
            </div>

            <div className="flex flex-col gap-4 sm:items-end">
              <h6 className="text-xs font-medium">#{invoice?.id}</h6>

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
          {/* sender and recever */}
          <SenderReceverComp item={invoice.to} functions={{}} button={false} />
          {/* products */}
          <div className="grid grid-cols-6 gap-6 mt-8">
            <div className="lg:col-span-4 col-span-6 p-6 border border-border rounded-xl overflow-hidden">
              <InvoiceProductsTable
                data={invoice?.items}
                functions={{}}
                button={false}
              />
            </div>
            <div className="col-span-6 lg:col-span-2 flex flex-col gap-6">
              <div className="flex-btn gap-4">
                <p className="text-sm font-extralight">Currency:</p>
                <h6 className="text-sm font-medium">USD ($)</h6>
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
              {/* notes */}
              <div className="w-full p-4 border border-border rounded-lg">
                <h1 className="text-sm font-medium">Notes</h1>
                <p className="text-xs mt-2 font-light leading-5">
                  Thank you for your business. We hope to work with you again
                  soon. You can pay your invoice online at
                  www.example.com/payments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PreviewInvoice;
