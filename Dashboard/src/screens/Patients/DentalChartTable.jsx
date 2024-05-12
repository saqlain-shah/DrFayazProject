import React, { useState, useEffect } from 'react';
import { BiTrash } from 'react-icons/bi';
import axios from 'axios';

function DentalChartTable({ id }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://server-yvzt.onrender.com/api/dental-chart/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setData(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [id]);

  const thClass = 'text-start text-xs font-medium py-3 px-2 whitespace-nowrap';
  const tdClass = 'text-start text-xs py-4 px-2 whitespace-nowrap';

  const handleDelete = async () => {
    try {
      await axios.delete(`https://server-yvzt.onrender.com/api/dental-chart/${id}`);
      setData(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return data ? (
    <table className="table-auto w-full">
      <thead className="bg-dry rounded-md overflow-hidden">
        <tr>
          <th className={thClass}>Serious Disease</th>
          <th className={thClass}>Dental Conditions</th>
          <th className={thClass}>Mental Health Issues</th>
          <th className={thClass}>Allergies</th>
          <th className={thClass}>Medications</th>
          {/* <th className={thClass}>Actions</th> */}
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-border hover:bg-greyed transitions">
          <td className={tdClass}>{data.seriousDisease}</td>
          <td className={tdClass}>
            <ul>
              {data.dentalConditions.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ul>
          </td>
          <td className={tdClass}>
            <ul>
              {data.mentalHealthIssues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </td>
          <td className={tdClass}>{data.allergies}</td>
          <td className={tdClass}>{data.medications}</td>
          <td className={tdClass}>
            {/* <button
              onClick={handleDelete}
              className="bg-red-600 bg-opacity-5 text-red-600 rounded-lg border border-red-100 py-3 px-4 text-sm"
            >
              <BiTrash />
            </button> */}
          </td>
        </tr>
      </tbody>
    </table>
  ) : (
    <p>Loading...</p>
  );
}

export default DentalChartTable;
