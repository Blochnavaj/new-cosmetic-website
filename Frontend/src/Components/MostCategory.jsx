import React, { useEffect, useContext, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";

function MostCategory() {
  const { backendUrl, token } = useContext(ShopContext);
  const [banner, setBanner] = useState(null);

  const fetchBanner = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/banner/get-banner`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Update state correctly
      setBanner(res.data.banner);
    } catch (error) {
      console.log("error fetching banner", error.message);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full py-10 mt-3">
      <div className="grid md:flex justify-center gap-6 w-full max-w-screen-xl">
        {/* First Category */}
        <div className="w-full sm:w-[40%] lg:w-[50%] relative flex flex-col items-center">
          <div className="overflow-hidden group w-full">
            {banner && (
              <img
                src={banner.imageUrl}
                alt="Summer Collection"
                className="w-full h-auto object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">
            {banner?.title || "Summer Collection"}
          </h2>
          <button className="mt-2 px-6 py-3 text-white bg-pink-500 rounded-lg flex items-center gap-2 transition-all hover:bg-pink-600">
            Shop Now <FaArrowRight />
          </button>
        </div>

        {/* Second Category */}
        <div className="w-full sm:w-[40%] lg:w-[50%] relative flex flex-col items-center">
          <div className="overflow-hidden group w-full">
            {banner && (
              <img
                src={banner.imageUrl}
                alt="Winter Collection"
                className="w-full h-auto object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">
            {banner?.title || "Winter Collection"}
          </h2>
          <button className="mt-2 px-6 py-3 text-white bg-blue-500 rounded-lg flex items-center gap-2 transition-all hover:bg-blue-600">
            Shop Now <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MostCategory;
