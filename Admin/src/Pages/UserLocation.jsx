import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { backendUrl } from '../App';
import 'leaflet/dist/leaflet.css';

// Correct way to handle Leaflet marker icons in ES modules
const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

// Create custom icon
const customIcon = new L.Icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const CustomerMap = () => {
  const [customers, setCustomers] = useState([]);
  const [center, setCenter] = useState([20.5937, 78.9629]); // Default to India
  const [zoom, setZoom] = useState(5);
  const [radius, setRadius] = useState(100000); // 100km
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    // Fix for default marker icons
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl
    });

    const fetchCustomerLocations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/map/customer-locations`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setCustomers(response.data.data);
          if (response.data.data.length > 0) {
            const firstLocation = response.data.data[0].location.coordinates;
            setCenter([firstLocation[1], firstLocation[0]]);
          }
        }
      } catch (error) {
        console.error('Error fetching customer locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerLocations();
  }, []);

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    setSelectedLocation({ lat, lng });
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/api/map/geo-data`, {
        params: { lat, lng, radius },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCustomers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching geospatial data:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Customer Locations</h2>
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="radius" className="block text-sm font-medium text-gray-700">
              Radius: {radius / 1000} km
            </label>
            <input
              id="radius"
              type="range"
              min="1000"
              max="500000"
              step="1000"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-48"
            />
          </div>
          {selectedLocation && (
            <button
              onClick={() => setSelectedLocation(null)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >
              Reset View
            </button>
          )}
        </div>
      </div>

      <div className="h-[500px] relative z-0">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          onClick={handleMapClick}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {customers.map((customer) => (
            <Marker
              key={customer._id}
              position={[
                customer.location.coordinates[1],
                customer.location.coordinates[0]
              ]}
              icon={customIcon}
            >
              <Popup>
                <div className="space-y-1">
                  <h3 className="font-bold">{customer.name}</h3>
                  <p>{customer.email}</p>
                  <p>
                    {customer.address.city}, {customer.address.state}
                  </p>
                  <p>{customer.address.country}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {selectedLocation && (
            <Circle
              center={[selectedLocation.lat, selectedLocation.lng]}
              radius={radius}
              color="blue"
              fillColor="blue"
              fillOpacity={0.1}
            />
          )}
        </MapContainer>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        {customers.length} customers found. Click on the map to search in a specific area.
      </div>
    </div>
  );
};

export default CustomerMap;