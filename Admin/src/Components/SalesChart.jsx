import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { backendUrl } from '../App';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SalesChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [timeRange, setTimeRange] = useState(6); // Default 6 months
  const [isLoading, setIsLoading] = useState(false);

  const fetchSalesData = async (months) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/api/order/sales-data?months=${months}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response?.data?.success) {
        const sales = response.data.sales;
        
        const labels = sales.map(sale => 
          `${sale.monthName} ${sale.year}`
        );
        const salesData = sales.map(sale => sale.totalSales);
        const orderCounts = sales.map(sale => sale.count);
        const averages = sales.map(sale => sale.averageOrder);

        setChartData({
          labels,
          datasets: [
            {
              type: 'bar',
              label: 'Total Revenue ($)',
              data: salesData,
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              yAxisID: 'y',
            },
            {
              type: 'line',
              label: 'Number of Orders',
              data: orderCounts,
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              yAxisID: 'y1',
              tension: 0.1,
            },
            {
              type: 'line',
              label: 'Average Order Value ($)',
              data: averages,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              yAxisID: 'y',
              borderDash: [5, 5],
              pointRadius: 3
            }
          ],
        });
      }
    } catch (error) {
      console.error('Failed to fetch sales data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData(timeRange);
  }, [timeRange]);

  const handleTimeRangeChange = (e) => {
    setTimeRange(Number(e.target.value));
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Monthly Sales Overview
        </h2>
        <select 
          value={timeRange}
          onChange={handleTimeRangeChange}
          className="border rounded px-3 py-1 text-sm"
          disabled={isLoading}
        >
          <option value="3">Last 3 Months</option>
          <option value="6">Last 6 Months</option>
          <option value="12">Last 12 Months</option>
          <option value="24">Last 2 Years</option>
        </select>
      </div>
      
      <div className="h-80 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { 
                  position: 'top',
                  labels: {
                    boxWidth: 12
                  }
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                  callbacks: {
                    label: function(context) {
                      let label = context.dataset.label || '';
                      if (label) {
                        label += ': ';
                      }
                      if (context.dataset.label.includes('$')) {
                        label += '$' + context.raw.toFixed(2);
                      } else {
                        label += context.raw;
                      }
                      return label;
                    }
                  }
                }
              },
              scales: {
                x: { 
                  grid: { display: false },
                  ticks: {
                    maxRotation: 45,
                    minRotation: 45
                  }
                },
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  title: {
                    display: true,
                    text: 'Amount ($)'
                  }
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  grid: {
                    drawOnChartArea: false,
                  },
                  title: {
                    display: true,
                    text: 'Number of Orders'
                  }
                }
              }
            }}
          />
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        Showing data for last {timeRange} months
      </div>
    </div>
  );
}

export default SalesChart;