import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';

function ContactPages() {
    const [formData, setFormData] = useState({
        description: '',
        address: '',
        email: '',
        contact: '',
        hours: '',
        image: null,
        preview: '',
      });
      const token = localStorage.getItem("token");
    
      // Handle text input changes
      const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
      };
    
      // Handle image selection
      const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setFormData(prev => ({
            ...prev,
            image: file,
            preview: URL.createObjectURL(file)
          }));
        }
      };
    
      // Submit form to backend
      const handleSubmit = async (e) => {
        
        e.preventDefault();
    
        const data = new FormData();
        data.append('description', formData.description);
        data.append('address', formData.address);
        data.append('email', formData.email);
        data.append('contact', formData.contact);
        data.append('hours', formData.hours);
        if (formData.image) data.append('image', formData.image);
    
        try {
          await axios.post(`${backendUrl}/api/contact/upload-contact`, data, {
            headers: {   Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
          alert('Contact information uploaded successfully!');
          setFormData({
            description: '',
            address: '',
            email: '',
            contact: '',
            hours: '',
            image: null,
            preview: '',
          });
        } catch (err) {
          console.error('Upload failed:', err);
          alert('Failed to upload contact information.');
        }
      };
    
  return (
    <div className="p-8 max-w-4xl mx-auto">
    <h2 className="text-2xl font-bold mb-6">Upload Contact Information</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border rounded p-2"
        rows="3"
        placeholder="Short Description"
      />
      <input
        name="address"
        value={formData.address}
        onChange={handleChange}
        className="w-full border rounded p-2"
        placeholder="Address"
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="w-full border rounded p-2"
        placeholder="Email"
      />
      <input
        name="contact"
        value={formData.contact}
        onChange={handleChange}
        className="w-full border rounded p-2"
        placeholder="Phone Number"
      />
      <input
        name="hours"
        value={formData.hours}
        onChange={handleChange}
        className="w-full border rounded p-2"
        placeholder="Working Hours"
      />
      <div>
        <label className="block mb-1 font-medium">Hero Image</label>
        {formData.preview && (
          <img
            src={formData.preview}
            alt="Preview"
            className="w-40 h-28 object-cover mb-2 rounded shadow"
          />
        )}
        <input type="file" name="image" onChange={handleImageChange} />
      </div>
      <button
        type="submit"
        className="bg-rose-500 text-white px-6 py-2 rounded hover:bg-rose-600 transition"
      >
        Upload Contact
      </button>
    </form>
  </div>
  )
}

export default ContactPages