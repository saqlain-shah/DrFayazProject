import React, { useState, useEffect } from 'react';
import { BiTrash } from 'react-icons/bi';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DentalChartTable({ data, onDelete }) {
  const thClass = 'text-start text-xs font-medium py-3 px-2 whitespace-nowrap';
  const tdClass = 'text-start text-xs py-4 px-2 whitespace-nowrap';

  const handleDelete = async () => {
    try {
      await onDelete(data._id);
      toast.success('Record deleted successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete record');
    }
  };

  return (
    <tr className="border-b border-border hover:bg-greyed transitions">
      <td className={tdClass}>{data.seriousDisease || "N/A"}</td>
      <td className={tdClass}>
        <ul>
          {(data.dentalConditions || []).map((condition, index) => (
            <li key={index}>{condition}</li>
          ))}
        </ul>
      </td>
      <td className={tdClass}>
        <ul>
          {(data.mentalHealthIssues || []).map((issue, index) => (
            <li key={index}>{issue}</li>
          ))}
        </ul>
      </td>
      <td className={tdClass}>{data.allergies || "N/A"}</td>
      <td className={tdClass}>{data.medications || "N/A"}</td>
      <td className={tdClass}>
        <button
          onClick={handleDelete}
          className="bg-red-600 bg-opacity-5 text-red-600 rounded-lg border border-red-100 py-3 px-4 text-sm"
        >
          <BiTrash />
        </button>
      </td>
    </tr>
  );
}


export default DentalChartTable;
