import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { backendUrl } from '../App';

function TotalRevenue() {
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchTotalRevenue = async () => {
      const token = localStorage.getItem('token');  

      if (!token) return;

      try {
        const response = await axios.post(
          `${backendUrl}/api/order/total-revenue`,
          {},  
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

         
        if (response.data.success) {
          setTotalRevenue(response.data.totalRevenue);
        }
      } catch (error) {
        console.error('Failed to fetch total revenue:', error);
      }
    };

    fetchTotalRevenue();

     
    const interval = setInterval(fetchTotalRevenue, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
      <div className="flex items-center justify-between mt-4">
        <span className="text-3xl font-bold text-gray-900">
          ${totalRevenue.toFixed(2)}
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-2">Revenue from completed orders</p>
    </div>
  );
}

export default TotalRevenue;
