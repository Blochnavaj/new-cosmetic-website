import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import Add from "./Pages/Add";
import List from './Pages/List'
import Orders from "./Pages/Orders";
import Navbar from "./Components/Navbar";
import SlideBar from "./Components/SlideBar";
import Login from "./Components/Login";
import Dashboard from "./Pages/Dashboard";
import TotalUsersList from "./Pages/TotalUsersList";
import UserLocation from "./Pages/UserLocation";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token])

  return (
    <BrowserRouter  >
      <div className="bg-gray-100 min-h-screen">
        <ToastContainer />
        {token === "" ? (
          <Login setToken={setToken} />
        ) : (
          <>
            <Navbar setToken={setToken} />
            <div className="flex">
              <SlideBar />
              <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-500 text-base">
                <Routes>
                  <Route path="/" element={<Orders token={token} />} /> {/* ✅ Default Route */}
                  <Route path="/add" element={<Add token={token} />} />
                  <Route path="/list" element={<List token={token} />} />
                  <Route path="/orders" element={<Orders token={token} />} />
                  <Route path="/dashboard" element={<Dashboard token={token}/>} />
                  <Route path="/total-users-list" element={<TotalUsersList token={token}/>} />
                  <Route path="/user-location" element={<UserLocation/>} />
                  <Route path="*" element={<div>Page Not Found</div>} /> {/* ✅ Fallback Route */}
                </Routes>
              </div>
            </div>
          </>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
