import React from 'react';
import { Image } from 'antd';
import { useTable } from 'react-table';
import jsPDF from 'jspdf';

const PatientDetails = ({ medicalRecords, profileData, webPatientData }) => {

  const generatePDF = () => {
    const doc = new jsPDF();
    const content = document.getElementById('patientDetails');
    doc.html(content, {
      callback: function (doc) {
        doc.save('patient_details.pdf');
      }
    });
  };

  const MedicalRecordsTable = ({ medicalRecords }) => {
    const data = React.useMemo(
      () =>
        medicalRecords && medicalRecords.success && medicalRecords.data && medicalRecords.data.length > 0
          ? medicalRecords.data.flatMap(record => {
              return record.prescription && record.prescription.medicines
                ? record.prescription.medicines.map(medicine => ({
                    id: record._id,
                    complaints: record.complaints.join(', '),
                    diagnosis: record.diagnosis,
                    treatment: record.treatment.map(item => item.name).join(', '),
                    vitalSigns: record.vitalSigns.join(', '),
                    prescriptionName: medicine.name,
                    dosage: medicine.dosage,
                    instructions: medicine.instructions,
                    amount: medicine.amount,
                    attachments: record.attachments
                  }))
                : [];
            })
          : [],
      [medicalRecords]
    );

    const columns = React.useMemo(
      () => [
        {
          Header: 'Complaints',
          accessor: 'complaints',
        },
        {
          Header: 'Diagnosis',
          accessor: 'diagnosis',
        },
        {
          Header: 'Treatment',
          accessor: 'treatment',
        },
        {
          Header: 'Vital Signs',
          accessor: 'vitalSigns',
        },
        {
          Header: 'Prescription Name',
          accessor: 'prescriptionName',
        },
        {
          Header: 'Dosage',
          accessor: 'dosage',
        },
        {
          Header: 'Instructions',
          accessor: 'instructions',
        },
        {
          Header: 'Amount',
          accessor: 'amount',
        },
      ],
      []
    );

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable({ columns, data });

    return (
      <table {...getTableProps()} className="table-auto w-full">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} className="px-4 py-2 text-left font-semibold">
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="border-b border-gray-300 hover:bg-gray-100">
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()} className="px-4 py-2">
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <button onClick={generatePDF} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-4">
        Generate PDF
      </button>
      {/* Render medical records */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <MedicalRecordsTable medicalRecords={medicalRecords} />
      </div>
    </div>
  );
};

export default PatientDetails;
