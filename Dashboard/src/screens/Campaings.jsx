import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../Layout';
import { Button, MenuSelect } from '../components/Form';
import { BiDotsVerticalRounded, BiPlus } from 'react-icons/bi';
import { HiOutlineMail } from 'react-icons/hi';
import { FaShare, FaEdit } from "react-icons/fa";
import axios from 'axios';
import ContactSelectionDialog from './ContactSelectionDialog';
import CampaignModal from '../components/Modals/AddCampagnModal';
import { FiTrash } from 'react-icons/fi';

function Campaigns() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({});
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setShowShareOptions(false);
  };

  const closeModal = () => {
    setIsOpen(false);
    setData({});
  };

  const updateCampaignsState = (newCampaign) => {
    setCampaigns(prevCampaigns => [...prevCampaigns, newCampaign]);
  };

  const editCampaign = (campaign) => {
    setIsOpen(true);
    setData(campaign);
  };


  const shareViaWhatsApp = async (campaign) => {
    setMessage(`Title: ${campaign.title}\nSend To: ${campaign.sendTo}\nMessage: ${campaign.action.message}`)
    const token = localStorage.getItem('token');
    await axios.get('http://localhost:8800/api/patients/', {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      res.data.forEach((patient) => {
        if (!contacts.some(contact => contact.phoneNumber === patient.emergencyContact)) {
          setContacts(prevContacts => [...prevContacts, { name: patient.fullName, phoneNumber: patient.emergencyContact }]);
        }
      });
      setIsDialogOpen(true);
      handleCloseDialog();
    });
  };

  const shareViaEmail = async (campaign) => {
    setMessage(`Title: ${campaign.title}\nSend To: ${campaign.sendTo}\nMessage: ${campaign.action.message}`)
    const token = localStorage.getItem('token');
    await axios.get('http://localhost:8800/api/patients/', {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      res.data.forEach((patient) => {
        if (!contacts.some(contact => contact.email === patient.email)) {
          setContacts(prevContacts => [...prevContacts, { name: patient.fullName, email: patient.email }]);
        }
      });
      setIsDialogOpen(true);
      setShowShareOptions(false);
      handleCloseDialog();
    });
  };

  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };


  const actions = [
    {
      title: "Share",
      icon: FaShare,
      onClick: toggleShareOptions,
    },
  
    {
      title: "Delete",
      icon: FiTrash,
      onClick: (campaign) => deleteCampaign(campaign._id),
    }
  ];

  useEffect(() => {
    const fetchEmailCampaigns = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8800/api/email-campaigns', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCampaigns(response.data);
      } catch (error) {
        console.error('Error fetching email campaigns:', error);
      }
    };

    fetchEmailCampaigns();
  }, []);

  const deleteCampaign = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8800/api/email-campaigns/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampaigns(prevCampaigns => prevCampaigns.filter(campaign => campaign._id !== id));
      toast.success('Campaign deleted successfully');
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  return (
    <Layout>
      <ToastContainer />
      {isOpen && (
        <CampaignModal
          isOpen={isOpen} closeModal={closeModal} data={data}
          updateCampaignsState={updateCampaignsState} />
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

      <div className="grid lg:grid-cols-3 sm:grid-cols-2 my-8 gap-4">
        {campaigns.map((campaign, index) => (
          <div
            key={index}
            className="bg-white border-[1px] border-border rounded-xl p-5"
          >
            <div className="grid grid-cols-12 gap-4 items-center border-b border-border pb-4">
              <div className="col-span-2">
                <div
                  className={`
            ${campaign.type === 'email' && 'bg-orange-500 text-orange-500'}
            w-full h-12 text-lg rounded flex-colo bg-opacity-10`}
                >
                  {campaign.type === 'email' && <HiOutlineMail />}
                </div>
              </div>
              <div className="col-span-8">
                <h1 className="text-sm font-light">{campaign.title}</h1>
                {campaign.image && (
                  <img src={`http://localhost:8800/${campaign.image}`} alt="Campaign" className="mt-2 w-full h-auto rounded" />
                )}
              </div>
              <div className="col-span-2">
                <MenuSelect datas={actions} item={campaign}>
                  <div className="w-12 h-12 text-lg rounded hover:bg-subMain hover:text-subMain flex-colo hover:bg-opacity-10">
                    <BiDotsVerticalRounded />
                  </div>
                </MenuSelect>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <h4 className="text-sm font-medium">Message</h4>
              <p className="text-xs leading-5 text-textGray">
                {campaign.message}
              </p>

              <div className="flex gap-2">
                <span className="text-xs bg-dry text-textGray rounded-xl border py-2 px-4 border-border">
                  {campaign.createdAt}
                </span>
              </div>
            </div>
            {showShareOptions && (
              <div className="mt-4 flex gap-4">
                <Button label="Share via Email" onClick={() => shareViaEmail(campaign)} />
              </div>
            )}
          </div>
        ))}
      </div>
      <ContactSelectionDialog
        contacts={contacts}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        message={message}
      />
    </Layout>
  );
}

export default Campaigns;
