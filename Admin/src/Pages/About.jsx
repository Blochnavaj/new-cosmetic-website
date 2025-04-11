 import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';

function About() {
  const [description, setDescription] = useState('');
 
  const [image, setImage] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/about/get-about`);
        setDescription(data.description || '');
       
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('description', description);
   
    if (image) formData.append('image', image);

    try {
      await axios.put(`${backendUrl}/api/about/update-about`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('About page updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update. Check console for details.');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit About Page</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full border rounded p-2 mb-4"
          rows="4"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Enter page description"
        />
        <div className="mb-4">
          <label className="block mb-2">Upload New Hero Image:</label>
          <input 
            type="file" 
            onChange={e => setImage(e.target.files[0])} 
            accept="image/*"
          />
        </div>
       
      
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default About;