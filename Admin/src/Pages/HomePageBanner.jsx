import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';

function HomePageBanner() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem('token');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    setMessage('');

    try {
      const res = await axios.post(`${backendUrl}/api/hero/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(res.data.message || "Upload successful!");
    } catch (error) {
      console.error(error);
      setMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg border">
      <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">Upload Hero Banner</h2>

      <label className="block mb-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-lg file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
        />
      </label>

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full h-64 object-cover rounded-md border mb-4"
        />
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`w-full py-2 rounded-md text-white font-semibold transition ${
          uploading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
}

export default HomePageBanner;
