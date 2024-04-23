import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { MdOutlineTextsms } from 'react-icons/md';
import EmailComp from '../Campaign/EmailComp';

function CampaignModal({ closeModal, isOpen, data }) {
  const [indexs, setIndexs] = useState(0);

  // change tab
  const changeTab = (value) => {
    setIndexs(value);
  };

  // tabs data
  const tabs = [
    { title: 'Email', icon: MdOutlineTextsms, value: 'email' },
  ];

  // edit
  useEffect(() => {
    if (data?.id) {
      if (data?.type === 'email') {
        setIndexs(0);
      }
    }
  }, [data]);

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={data?.id ? 'View Campaign' : 'Create Campaign'}
      width={'max-w-3xl'}
    >
      <div className="flex flex-col gap-6">
        {/* radio */}
        {!data?.id && (
          <div className="grid grid-cols-3 gap-4 w-full bg-dry rounded-md sm:rounded-full overflow-hidden">
            {tabs.map((item, index) => (
              <button
                onClick={() => changeTab(index)}
                key={index}
                className={`flex gap-4 items-center p-2 rounded-full ${indexs === index ? 'bg-white text-black' : ''
                  }`}
              >
                <div className="w-10 h-10 text-md rounded-full flex items-center justify-center">
                  <item.icon />
                </div>
                <h5 className="text-xs font-medium">{item.title}</h5>
              </button>
            ))}
          </div>
        )}

        {/* compo */}
        {indexs === 0 && <EmailComp data={data} />}
      </div>
    </Modal>
  );
}

export default CampaignModal;
