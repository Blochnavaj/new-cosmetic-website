import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';

function TotalUsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async (req,res) => {
      const token = localStorage.getItem('token');

      if (!token) return;

      try {
        const response = await axios.get(`${backendUrl}/api/user/all-users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response?.data?.success && Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        } else {
          setUsers([]); // ✅ Default to empty array if no valid data
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setUsers([]); // ✅ Reset to empty array on error
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Total Users</h2>
      <table className="w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">#</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
           </tr>
        </thead>
        <tbody>
          {users?.length > 0 ? (
            users.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2 capitalize">
                  {user.role || 'User'}
                </td>
                
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="border border-gray-300 px-4 py-2 text-center"
                colSpan="5"
              >
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TotalUsersList;
