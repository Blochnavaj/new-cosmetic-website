import React from 'react'
import TotalUsers from '../Components/TotalUsers'
import TotalRevenue from '../Components/TotalRevenue'
import SalesChart from '../Components/SalesChart'

function Dashboard() {
  return (
<>
<div className='md:flex md:gap-3 md:mb-8 grid grid-cols-1 gap-3' > 
       <TotalUsers/>
       <TotalRevenue/>
    </div>
    <SalesChart/>
</>
  )
}

export default Dashboard