// api.js

import axios from 'axios';

const fetchData = async (clientId) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    const response = await axios.get(`http://localhost:8800/api/userauth/${clientId}`, config);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error; // Throw the error to handle it in the calling component
  }
};

export default fetchData;
