import { Menu, Switch } from '@headlessui/react';
import React, { useState } from 'react';
import { BiLoaderCircle } from 'react-icons/bi';
import DatePicker from 'react-datepicker';
import { FaCheck } from 'react-icons/fa';

import Datetime from 'react-datetime';
import { Listbox } from '@headlessui/react';
import { BiChevronDown } from 'react-icons/bi';
import 'react-datetime/css/react-datetime.css';
export function Input({ label, name, type, color, placeholder, onChange, value }) {
  return (
    <div className="text-sm w-full">
      <label
        className={`${color ? 'text-black text-sm' : 'text-white font-semibold'
          } `}
      >
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-transparent text-sm mt-3 p-4 border ${color ? 'border-border font-light' : 'border-white text-white'
          } rounded-lg focus:border focus:border-subMain`}
      />
    </div>
  );
}



export function Button({ label, onClick, loading, Icon }) {
  return (
    <button
      disabled={loading}
      onClick={onClick}
      className={`w-full flex-rows gap-4 hover:opacity-80 transitions bg-subMain text-white text-sm font-medium px-2 py-4 rounded`}
    >
      {loading ? (
        <BiLoaderCircle className="animate-spin text-white text-2xl" />
      ) : (
        <>
          {label}
          {Icon && <Icon className="text-white text-xl" />}
        </>
      )}
    </button>
  );
}


export function MenuSelect({ children, datas, item: data }) {
  return (
    <div className="text-sm w-full relative">
      <Menu>
        <Menu.Button>{children}</Menu.Button>
        <Menu.Items className="flex flex-col z-50 gap-4 absolute right-0  bg-white rounded-md shadow-lg py-4 px-6 ring-1 ring-border focus:outline-none">
          {datas.map((item, index) => (
            <button
              onClick={() => item.onClick(data)}
              key={index}
              className={`flex gap-4 items-center hover:text-subMain`}
            >
              {item.icon && <item.icon className="text-md text-subMain" />}
              {item.title}
            </button>
          ))}
        </Menu.Items>
      </Menu>
    </div>
  );
}

export function MenuSelectss({ children, datas, item: data }) {
  return (
    <div className="text-sm w-full relative">
      <Menu>
        <Menu.Button>{children}</Menu.Button>
        <Menu.Items className="flex flex-col z-50 gap-4 fixed right-10 top-24.5 bg-white rounded-md shadow-lg py-4 px-6 ring-1 ring-border focus:outline-none">

          {datas.map((item, index) => (
            <button
              onClick={() => item.onClick(data)}
              key={index}
              className={`flex gap-4 items-center hover:text-subMain`}
            >
              {item.icon && <item.icon className="text-md text-subMain" />}
              {item.title}
            </button>
          ))}
        </Menu.Items>
      </Menu>
    </div>
  );
}


export function Select({ selectedPerson, setSelectedPerson, datas }) {
  console.log("Datas structure:", datas.map(item => ({ value: item.value, name: item.name })));
  // Ensure selectedPerson is not undefined
  const defaultSelectedPerson = selectedPerson || datas[0]; // Use the first item as default if selectedPerson is undefined

  const filteredDatas = datas.filter(person => {
    return person.value === '' || person.value === defaultSelectedPerson.value;
  });

  return (
    <div className="text-sm relative w-full">
      <div className="w-full">
        <Listbox value={defaultSelectedPerson} onChange={setSelectedPerson}>
          <Listbox.Button className="h-14 text-sm text-main rounded-md bg-dry border border-border px-4 w-full flex justify-between items-center focus:outline-none focus:border-subMain">
            {defaultSelectedPerson.name} <BiChevronDown className="text-xl" />
          </Listbox.Button>
          <Listbox.Options className="flex flex-col gap-2 top-14 z-50 absolute left-0 w-full bg-white rounded-md shadow-lg py-1 ring-1 ring-border focus:outline-none">
            {filteredDatas.map((person) => (
              <Listbox.Option
                key={person.value} // Use a unique key for each option
                value={person} // Pass the entire object as the value
                disabled={person.unavailable}
              >
                {person.name}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>
    </div>
  );
}

export function Selectt({ selectedPerson, setSelectedPerson, datas }) {
  const [active, setActive] = useState(null);

  console.log("Selected Person:", selectedPerson);
  console.log("Datas:", datas);

  return (
    <>
      {Array.isArray(datas) && datas.length > 0 ? (
        <div className="relative w-full">
          <Listbox value={selectedPerson} onChange={setSelectedPerson}>
            {({ open }) => (
              <>
                <Listbox.Button className="h-14 text-sm text-main rounded-md bg-dry border border-border px-4 w-full flex justify-between items-center focus:outline-none focus:border-subMain">
                  <span>{selectedPerson}</span>
                  <BiChevronDown className={`text-xl ${open ? 'transform rotate-180' : ''}`} />
                </Listbox.Button>
                {open && (
                  <Listbox.Options className="flex flex-col gap-2 top-14 z-50 absolute left-0 w-full bg-white rounded-md shadow-lg py-1 ring-1 ring-border focus:outline-none">
                    {datas.map((doctor, index) => (
                      <Listbox.Option
                        key={index}
                        value={doctor}
                        className={({ active, selected }) =>
                          `cursor-pointer px-4 py-2 hover:text-subMain hover:bg-subMain hover:bg-opacity-10 ${selected ? 'font-bold' : ''}`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span className={`${selected ? 'font-semibold' : 'font-normal'}`}>
                              {doctor}
                            </span>
                            {selected && (
                              <span className={`${active ? 'text-subMain' : 'text-subMain'} absolute inset-y-0 right-0 flex items-center pr-3`}>
                                ✓
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                )}
              </>
            )}
          </Listbox>
        </div>
      ) : (
        <p>No doctors available</p>
      )}
    </>
  );
}



// switch

export function Switchi({ checked, onChange }) {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className={`${checked ? 'bg-subMain' : 'bg-border'}
        relative inline-flex p-[2px] w-12 cursor-pointer rounded-full transitions`}
    >
      <span
        aria-hidden="true"
        className={`${checked ? 'translate-x-5' : 'translate-x-0'}
          pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg  transitions`}
      />
    </Switch>
  );
}

// textarea

export function Textarea({ label, name, value, onChange, placeholder, rows }) {
  const handleChange = (e) => {
    // Log the event and updated value
    console.log('Textarea onChange event:', e);
    console.log('Textarea value:', e.target.value);

    // Call the provided onChange function to update the state in the parent component
    onChange(e);
  };

  return (
    <div className="text-sm w-full">
      <label className={'text-black text-sm'}>{label}</label>
      <textarea
        name={name}
        rows={rows}
        value={value}
        onChange={handleChange} // Use the handleChange function
        placeholder={placeholder}
        className={`focus:border-subMain w-full bg-transparent text-sm mt-3 p-4 border border-border rounded font-light`}
      />
    </div>
  );
}



// date picker

export function DatePickerComp({ label, startDate, onChange }) {
  return (
    <div className="text-sm w-full">
      <label className={'text-black text-sm'}>{label}</label>
      <DatePicker
        selected={startDate}
        onChange={onChange}
        className="w-full bg-transparent text-sm mt-3 p-4 border border-border font-light rounded-lg focus:border focus:border-subMain"
      />
    </div>
  );
}

// time picker
export function TimePickerComp({ label, time, onChange }) {
  return (
    <div className="text-sm w-full">
      <label className={'text-black text-sm'}>{label}</label>
      <Datetime
        value={time}
        onChange={(date) => onChange(date.toDate())}
        inputProps={{ className: 'w-full bg-transparent text-sm mt-3 p-4 border border-border font-light rounded-lg focus:border focus:border-subMain' }}
        dateFormat={false}
        timeFormat="h:mm A"
      />
    </div>
  );
}
export function Checkbox({ label, name, onChange, checked }) {
  return (
    <div className="text-sm w-full flex flex-row items-center">
      {/* design checkbox */}
      <label className="flex-colo cursor-pointer relative">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={() => onChange(!checked)} // Toggle checked value
          className="absolute opacity-0 w-0 h-0"
        />
        <span
          className={`border rounded w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${checked ? 'border-subMain bg-subMain' : 'border-gray-300 bg-white'
            }`}
        >
          {checked && <FaCheck className="text-[10px] block text-white" />}
        </span>
      </label>

      {label && <p className={'text-black text-xs ml-2'}>{label}</p>}
    </div>
  );
}
export function Checkboxe({ label, name, onChange, checked }) {
  const handleCheckboxChange = () => {
    console.log(`Checkbox "${name}" clicked. Current state: ${checked}`);
    onChange(!checked); // Toggle the checked state
  };

  return (
    <div className="text-sm w-full flex flex-row items-center">
      <label className="flex-colo cursor-pointer relative">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={handleCheckboxChange}
          className="absolute opacity-0 w-0 h-0"
        />
        <span
          className={`border rounded w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${checked ? 'border-subMain bg-subMain' : 'border-gray-300 bg-white'
            }`}
        >
          {checked && <FaCheck className="text-[10px] block text-white" />}
        </span>
      </label>

      {label && <p className={'text-black text-xs ml-2'}>{label}</p>}
    </div>
  );
}








// from to date picker
export function FromToDate({ label, startDate, onChange, endDate, bg }) {
  return (
    <div className="text-sm w-full flex flex-col gap-2">
      {label && <label className={'text-black text-sm'}>{label}</label>}
      <DatePicker
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={onChange}
        className={`w-full ${bg ? bg : 'bg-transparent'
          }  text-xs px-4 h-14 border border-border text-main font-normal rounded-lg focus:border focus:border-subMain`}
      />
    </div>
  );
}
