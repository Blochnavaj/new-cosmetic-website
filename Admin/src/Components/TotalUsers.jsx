import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { backendUrl } from '../App';

function TotalUsers() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [prevUsers, setPrevUsers] = useState(0);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await fetch(backendUrl + '/api/user/total-users');
        const data = await response.json();
        if (data.success) {
          setPrevUsers((prev) => totalUsers);  
          setTotalUsers(data.totalUsers);
        }
      } catch (error) {
        console.error("Failed to fetch total users:", error);
      }
    };

    fetchTotalUsers();

    
    const interval = setInterval(fetchTotalUsers, 5000);

    return () => clearInterval(interval);
  }, []);  
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
      <div className="flex items-center justify-between mt-4">
        <span className="text-3xl font-bold text-gray-900">
          {totalUsers}
        </span>
        <div className="flex items-center">
          {totalUsers > prevUsers ? (
            <ArrowUp className="text-green-500 w-6 h-6" />
          ) : totalUsers < prevUsers ? (
            <ArrowDown className="text-red-500 w-6 h-6" />
          ) : (
            <span className="text-gray-400 text-sm">No change</span>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        {totalUsers > prevUsers ? 'Increased' : totalUsers < prevUsers ? 'Decreased' : 'Stable'}
      </p>
    </div>
  );
}

export default TotalUsers;
