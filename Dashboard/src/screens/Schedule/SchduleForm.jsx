
import React from 'react';
import { BiLoaderCircle } from 'react-icons/bi';
import DatePicker from 'react-datepicker';




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

// select








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

export function TimePickerComp({ label, startDate, onChange }) {
  return (
    <div className="text-sm w-full">
      <label className={'text-black text-sm'}>{label}</label>
      <DatePicker
        selected={startDate}
        onChange={onChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={30}
        timeCaption="Time"
        dateFormat="h:mm aa"
        className="w-full bg-transparent text-sm mt-3 p-4 border border-border font-light rounded-lg focus:border focus:border-subMain"
      />
    </div>
  );
}



export function FromToDate({ label, startDate, onChange, endDate, bg }) {
  return (
    <div className="text-sm w-full flex flex-col gap-2">
      {label && <label className={'text-black text-sm'}>{label}</label>}
      <DatePicker
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={onChange}
        className={`w-full ${
          bg ? bg : 'bg-transparent'
        }  text-xs px-4 h-14 border border-border text-main font-normal rounded-lg focus:border focus:border-subMain`}
      />
    </div>
  );
}
