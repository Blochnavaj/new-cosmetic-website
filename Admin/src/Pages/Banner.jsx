import React,{useState} from 'react'
import axios from 'axios';
import { backendUrl } from '../App';

function Banner() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  const token = localStorage.getItem("token");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', category);

    try {
      const res = await axios.post(`${backendUrl}/api/banner/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Banner Uploaded Successfully");
    } catch (err) {
      alert("Upload failed");
    }
  };
  return (
    <div className="max-w-md mx-auto mt-6 p-4 border rounded-lg shadow">
    <input
      type="text"
      placeholder="Banner Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="mb-2 w-full border p-2"
    />
    <input
      type="text"
      placeholder="Category (e.g., summer, winter)"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="mb-2 w-full border p-2"
    />
    <input
      type="file"
      onChange={(e) => setFile(e.target.files[0])}
      className="mb-2"
    />
    <button
      onClick={handleUpload}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Upload Banner
    </button>
  </div>
  )
}

export default Banner