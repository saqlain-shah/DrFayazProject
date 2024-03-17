import React, { useState } from 'react';
import Layout from '../Layout';
import { Button, MenuSelect } from '../components/Form';
import { BiDotsVerticalRounded, BiPlus } from 'react-icons/bi';
import { HiOutlineMail } from 'react-icons/hi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FaShare } from "react-icons/fa";
import { toast } from 'react-hot-toast';
import { campaignData } from '../components/Datas';
import { TbBrandWhatsapp, TbMessage } from 'react-icons/tb';
import CampaignModal from '../components/Modals/AddCampagnModal';
import { FiEye } from 'react-icons/fi';
import axios from 'axios';
import ContactSelectionDialog from './ContactSelectionDialog'; 

function Campaings() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [data, setData] = React.useState({});
  const [showShareOptions, setShowShareOptions] = React.useState(false);
  const [contacts, setContacts] = useState([
    {
      name: '',
      phoneNumber: 0
    }
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // Function to open the dialog
  const openDialog = () => {
    setIsDialogOpen(true);
  };

  // Function to close the dialog and handle selected contact
  const handleCloseDialog = (contact) => {
    setIsDialogOpen(false);
    if (contact) {
      setSelectedContact(contact);
    }
  };

  const closeModal = () => {
    setIsOpen(!isOpen);
    setData({});
  };

  const shareViaWhatsApp = async (item) => {

    const token = localStorage.getItem('token');
    await axios.get('http://localhost:8800/api/patients/', {
      headers: { Authorization: `Bearer ${token}` }
    }
    )
      .then((res) => {
        console.log("patients", res.data)
        res.data.map((patient) => {
          setContacts((prevContacts) => [...prevContacts, { name: patient.fullName, phoneNumber: patient.emergencyContact }]);
          console.log("contact", contacts)
          setIsDialogOpen(true)
          handleCloseDialog
        })
      })
      .then(() => {
        if (selectedContact) {
          const message = `Title: ${item.title}\nSend To: ${item.sendTo}\nMessage: ${item.action.message}`;
          const whatsappUrl = `https://wa.me/${selectedContact}?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
          setShowShareOptions(false);
        }
      })
    // const message = `Title: ${item.title}\nSend To: ${item.sendTo}\nMessage: ${item.action.message}`;
    // const whatsappUrl = `https://wa.me/+923000000000?text=${encodeURIComponent(message)}`;
    // window.open(whatsappUrl, '_blank');
    // setShowShareOptions(false);
  };

  const shareViaEmail = (item) => {
    const subject = encodeURIComponent("Check out this campaign");
    const body = encodeURIComponent(`Title: ${item.title}\nSend To: ${item.sendTo}\nMessage: ${item.action.message}`);
    const gmailUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=&su=${subject}&body=${body}`;

    window.open(gmailUrl, '_blank');
    setShowShareOptions(false);
  };

  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  const actions = [
    {
      title: "View",
      icon: FiEye,
      onClick: (data) => {
        setIsOpen(true);
        setData(data);
      },
    },
    {
      title: "Delete",
      icon: RiDeleteBinLine,
      onClick: () => {
        toast.error("This feature is not available yet");
      },
    },
    {
      title: "Share",
      icon: FaShare,
      onClick: toggleShareOptions,
    },
  ];

  return (
    <Layout>
      {isOpen && (
        <CampaignModal isOpen={isOpen} closeModal={closeModal} data={data} />
      )}
      <div className="flex-btn flex-wrap gap-4 items-center">
        <h1 className="text-xl font-semibold">Library</h1>
        <div className="xs:w-56">
          <Button
            label="Add New"
            Icon={BiPlus}
            onClick={() => {
              closeModal();
            }}
          />
        </div>
      </div>

      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="grid lg:grid-cols-3 sm:grid-cols-2 my-8 gap-4"
      >
        {campaignData.map((item, index) => (
          <div
            key={index}
            className="bg-white border-[1px] border-border rounded-xl p-5"
          >
            <div className="grid grid-cols-12 gap-4 items-center border-b border-border pb-4">
              <div className="col-span-2">
                <div
                  className={`
                  ${item.type === 'sms' && 'bg-blue-500 text-blue-500'}
                  ${item.type === 'email' && 'bg-orange-500 text-orange-500'}
                  ${item.type === 'whatsapp' && 'bg-green-500 text-green-500'}
                  w-full h-12 text-lg rounded flex-colo bg-opacity-10`}
                >
                  {item.type === 'email' && <HiOutlineMail />}
                  {item.type === 'sms' && <TbMessage />}
                  {item.type === 'whatsapp' && <TbBrandWhatsapp />}
                </div>
              </div>
              <div className="col-span-8">
                <h1 className="text-sm font-light">{item.title}</h1>
                <p className="text-xs font-medium mt-1">{item.sendTo}</p>
              </div>
              <div className="col-span-2">
                <MenuSelect datas={actions} item={item}>
                  <div className="w-12 h-12 text-lg rounded hover:bg-subMain hover:text-subMain flex-colo hover:bg-opacity-10">
                    <BiDotsVerticalRounded />
                  </div>
                </MenuSelect>
              </div>
            </div>
            {/* message */}
            <div className="mt-4 flex flex-col gap-3">
              <h4 className="text-sm font-medium">Message</h4>
              <p className="text-xs leading-5 text-textGray">
                {item.action.message}....
              </p>
              <div className="flex gap-2">
                <span className="text-xs bg-dry text-textGray rounded-xl border py-2 px-4 border-border">
                  {item.date}
                </span>
              </div>
            </div>
            {/* Share options */}
            {showShareOptions && (
              <div className="mt-4 flex gap-4">
                <Button label="Share via WhatsApp" onClick={() => shareViaWhatsApp(item)} />
                <Button label="Share via Email" onClick={() => shareViaEmail(item)} />
              </div>
            )}

            <div>
              Selected Contact:{selectedContact}
            </div>

          </div>
        ))}
      </div>
      <ContactSelectionDialog
        contacts={contacts} // Pass your contacts array here
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />

    </Layout>
  );
}

export default Campaings;
