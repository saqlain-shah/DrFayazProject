import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import dayjs from 'dayjs';
import { CircularProgress } from '@mui/material';
import BASE_URL from '../../baseUrl.jsx';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/userauth/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columnDefs = [
    { headerName: '#', valueGetter: 'node.rowIndex + 1', sortable: true },
    { headerName: 'Name', field: 'name', sortable: true },
    { headerName: 'Email', field: 'email', sortable: true },
    { 
      headerName: 'Is Admin', 
      field: 'isAdmin', 
      sortable: true, 
      cellRenderer: params => params.value ? 'Yes' : 'No' 
    },
    { 
      headerName: 'Updated At', 
      field: 'updatedAt', 
      sortable: true, 
      valueFormatter: dateFormatter 
    }
  ];
  

  function dateFormatter(params) {
    return dayjs(params.value).format('YYYY-MM-DD hh:mm A');
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Users</h1>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
          <AgGridReact
            rowData={users}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
            suppressCellSelection={true}
          />
        </div>
      )}
    </Layout>
  );
};

export default Users;
