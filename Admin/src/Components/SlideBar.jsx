 import React from 'react'
import { NavLink } from 'react-router-dom'
import assets from '../assets/admin_assets/assets'
import { FaHome } from "react-icons/fa";

 
 function SlideBar() {
   return (
     <div className='w-[18%] min-h-screen border-r-2'> 
        <div className='flex flex-col gap-3 pt-6 pl-[20%] text-[15px]'>

        <NavLink className='flex items-center gap-3 text-center border border-r-0 px-3 py-3 rounded-md' to='/dashboard'>
               <p className='w-7 h-5 mt-1'><FaHome /> </p>
              <p className='hidden md:block'>Dashboard</p>
            </NavLink>


            <NavLink className='flex items-center gap-3 border border-r-0 px-3 py-3 rounded-md' to='/add'>
              <img className='w-5 h-5 ' src={assets.add_icon} alt="" />
              <p className='hidden md:block'>Add Items</p>
            </NavLink>

            <NavLink className='flex items-center gap-3 border border-r-0 px-3 py-3 rounded-md' to='/list'>
              <img className='w-5 h-5 ' src={assets.order_icon} alt="" />
              <p className='hidden md:block'>Product List</p>
            </NavLink>

            <NavLink className='flex items-center gap-3 border border-r-0 px-3 py-3 rounded-md' to='/orders'>
              <img className='w-5 h-5 ' src={assets.order_icon} alt="" />
              <p className='hidden md:block'>Order Items</p>
            </NavLink>


              <hr className='border-t-2  border-black mt-3 w-full' />

                <NavLink className='flex items-center gap-3 border border-r-0 px-3 py-3 rounded-md' to='/total-users-list'>
              <img className='w-5 h-5 ' src={assets.order_icon} alt="" />
              <p className='hidden md:block'>Users Data </p>
            </NavLink>

            

 
<NavLink className='flex items-center gap-3 border border-r-0 px-3 py-3 rounded-md' to='/user-location'>
<img className='w-5 h-5 ' src={assets.order_icon} alt="" />
<p className='hidden md:block'>Users Location </p>
</NavLink>
         
        </div>
     </div>
   )
 }
 
 export default SlideBar