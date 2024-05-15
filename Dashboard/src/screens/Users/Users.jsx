import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://server-yvzt.onrender.com/api/userauth/users', {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  const thClass = 'text-start text-sm font-medium py-3 px-1 whitespace-nowrap';
  const tdClass = 'text-start text-xs py-4 px-2 whitespace-nowrap';

  return (
    <Layout>
      <div className="overflow-x-auto border rounded-md border-gray-200 mt-20">
        <table className="table-auto">
          <thead className="bg-dry rounded-md overflow-hidden">
            <tr>
              <th className={thClass} style={{ width: '15%',fontSize:'bold' }}>#</th>
              <th className={thClass} style={{ width: '15%' }}>Name</th>
              <th className={thClass} style={{ width: '15%' }}>Email</th>
              <th className={thClass} style={{ width: '15%' }}>Updated At</th>
              {/* Add more table headings as needed */}
             
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="border-b border-border hover:bg-greyed transitions">
                <td className={tdClass}>{index + 1}</td>
                <td className={tdClass}>{user.name}</td>
                <td className={tdClass}>{user.email}</td>
                <td className={tdClass}>{user.updatedAt}</td> 
                {/* Render more user data as needed */}
                <td className={tdClass} style={{ position: 'relative' }}>
                  {/* You can add action buttons or menu similar to the patient table */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Users;




// import React, { useState, useEffect } from 'react';
// import Layout from '../../Layout';

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch('https://server-yvzt.onrender.com/api/userauth/users', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         if (!response.ok) {
//           throw new Error('Failed to fetch users');
//         }
//         const data = await response.json();
//         setUsers(data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   const thClass = 'text-start text-sm font-bold py-3 px-1 whitespace-nowrap';
//   const tdClass = 'text-start text-xs py-4 px-2 whitespace-nowrap';

//   return (
//     <Layout>
//       <div className="overflow-x-auto" >
//         <table className="table-auto rounded-md"> {/* Added rounded-md class here */}
//         <thead className="bg-dry rounded-md overflow-hidden">
//             <tr>
//               <th className={thClass} style={{ width: '2%' }}>#</th>
//               <th className={thClass} style={{ width: '1%' }}>Name</th>
//               <th className={thClass} style={{ width: '5%' }}>Email</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user, index) => (
//               <React.Fragment key={user._id}>
//                 <tr className="border-b border-border hover:bg-greyed transitions">
//                   <td className={tdClass}>{index + 1}</td>
//                   <td className={tdClass}>{user.name}</td>
//                   <td className={tdClass}>{user.email}</td>
//                 </tr>
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </Layout>
//   );
// };

// export default Users;





