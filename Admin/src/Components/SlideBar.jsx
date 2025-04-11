import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import assets from '../assets/admin_assets/assets';
import { FaHome } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";

function SlideBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newDropdownOpen, setNewDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleDropdown2 = () => setNewDropdownOpen(!newDropdownOpen);

  return (
    <div className='w-[18%] min-h-screen border-r-2'>
      <div className='flex flex-col gap-3 pt-6 pl-[20%] text-[15px]'>

        <NavLink className='flex items-center gap-3 text-center border border-r-0 px-3 py-3 rounded-md' to='/dashboard'>
          <p className='w-7 h-5 mt-1'><FaHome /></p>
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>

        <NavLink className='flex items-center gap-3 border border-r-0 px-3 py-3 rounded-md' to='/add'>
          <img className='w-5 h-5' src={assets.add_icon} alt="" />
          <p className='hidden md:block'>Add Items</p>
        </NavLink>

        <NavLink className='flex items-center gap-3 border border-r-0 px-3 py-3 rounded-md' to='/list'>
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className='hidden md:block'>Product List</p>
        </NavLink>

        <NavLink className='flex items-center gap-3 border border-r-0 px-3 py-3 rounded-md' to='/orders'>
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className='hidden md:block'>Order Items</p>
        </NavLink>

        <hr className='border-t-2 border-black mt-3 w-full' />

        <NavLink className='flex items-center gap-3 border border-r-0 px-3 py-3 rounded-md' to='/total-users-list'>
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className='hidden md:block'>Users Data</p>
        </NavLink>

        <NavLink className='flex items-center gap-3 border border-r-0 px-3 py-3 rounded-md' to='/user-location'>
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className='hidden md:block'>Users Location</p>
        </NavLink>

        <hr className='border-t-2 border-black mt-3 w-full' />

        {/* Dropdown Section */}
        <div>
          <button
            onClick={toggleDropdown}
            className='flex items-center justify-between w-full border px-3 py-3 rounded-md'
          >
            <div className='flex items-center gap-3'>
              <img className='w-5 h-5' src={assets.order_icon} alt="" />
              <span className='hidden md:block'>Website Content</span>
            </div>
            <FaChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className='ml-8 mt-2 flex flex-col gap-2'>
              <NavLink to='/hero-image' className='text-sm hover:underline'>Hero Image</NavLink>
              {/* <NavLink to='/Banner-image' className='text-sm hover:underline'>Slider Section</NavLink> */}
              {/* <NavLink to='/homepage-banner' className='text-sm hover:underline'>Homepage Banner</NavLink> */}
            </div>
          )}
        </div>

          {/* Dropdown Section */}
          <div>
          <button
            onClick={toggleDropdown2}
            className='flex items-center justify-between w-full border px-3 py-3 rounded-md'
          >
            <div className='flex items-center gap-3'>
              <img className='w-5 h-5' src={assets.order_icon} alt="" />
              <span className='hidden md:block'>Pages Content</span>
            </div>
            <FaChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {newDropdownOpen && (
            <div className='ml-8 mt-2 flex flex-col gap-2'>
              <NavLink to='/about' className='text-sm hover:underline'>About Page</NavLink>
              <NavLink to='/Banner-image' className='text-sm hover:underline'>Contact Pages</NavLink>
              {/* <NavLink to='/homepage-banner' className='text-sm hover:underline'>Homepage Banner</NavLink> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideBar;
