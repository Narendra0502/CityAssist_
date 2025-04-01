import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Camera from './Camera';
// import nsfwjs from "nsfwjs";
// import axios from "axios";


const DEPARTMENTS = [
  { value: '', label: 'Select Department' },
  { value: 'MCD', label: 'MCD' },
  { value: 'Water Department', label: 'Water Supply Department' },
  { value: 'Electricity Department', label: 'Electricity Department' },
  { value: 'Health Department', label: 'Health Department' },
  { value: 'Education Department', label: 'Education Department' },
  { value: 'Transport Department', label: 'Transport Department' },
  { value: 'pwd', label: 'Public Works Department' }
];

const Issues = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    description: '',
    address: '',
    city: '',
    title: '',
    department: '',
    image: null,
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const fetchUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString()
          }));
        },
        (error) => console.error("Location Error:", error)
      );
    }
  };

  const handleImageUpload = (file) => {
    if (!file) return;
    
    if (file instanceof File) {
      // Handle file upload
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        console.log('Image loaded successfully');
      };
      reader.readAsDataURL(file);
    }
    else if (typeof file === 'string' && file.startsWith('data:image')) {
      // Handle base64 image from camera
      setImagePreview(file);
      // Convert base64 to File object
      fetch(file)
        .then(res => res.blob())
        .then(blob => {
          const imageFile = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          // Create object URL for the file input
          const fileUrl = URL.createObjectURL(imageFile);
          // Set the file input value using a ref
          const fileInput = document.querySelector('input[type="file"]');
          if (fileInput) {
            // Create a new DataTransfer object
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(imageFile);
            fileInput.files = dataTransfer.files;
          }
          setFormData(prev => ({
            ...prev,
            image: imageFile
          }));
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        if (key === 'image' && value instanceof File) {
          submissionData.append('image', value, value.name);
        } else {
          submissionData.append(key, String(value));
        }
      }
    });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to submit an issue');
        return;
      }
      const response = await fetch('http://localhost:5000/auth/Issues', {
        method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}` // Add the authorization header
      },
      body: submissionData
      });
      if (!response.ok) throw new Error('Failed to submit issue');
      const result = await response.json();
      if (result.success) {
        toast.success('Complaint registered successfully');
        navigate('/status');
      } else {
        toast.error(result.message || 'Failed to register complaint');
      }
     
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong! Data not stored.');
    }
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden md:flex">
        <div className="md:w-1/2 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'Name', type: 'text' },
              { key: 'contact', label: 'Phone Number', type: 'tel' },
              { key: 'email', label: 'Email Address', type: 'email' },
              { key: 'address', label: 'Address', type: 'text' },
              { key: 'city', label: 'City', type: 'text' },
              { key: 'title', label: 'Title', type: 'text' }
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  required
                  type={type}
                  name={key}
                  placeholder={`Enter ${label}`}
                  value={formData[key]}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                required
                name="description"
                placeholder="Enter your description..."
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <select
                required
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept.value} value={dept.value}>{dept.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Image</label>
              <input
                required
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files?.[0])}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-indigo-100"
              />
                    {imagePreview && (
        <div className="mt-2">
          <img
            src={imagePreview}
            alt="Preview"
            className="h-32 w-32 object-cover rounded-lg"
          />
        </div>
      )}
            </div>


            <button 
              type="submit" 
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Submit Complaint
            </button>
          </form>
        </div>

        <div className="md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-xs bg-white rounded-xl shadow-md p-6">
            <h3 className="text-center text-lg font-semibold text-gray-700 mb-4">Capture Image</h3>
            <div className="flex justify-center">
              <Camera imagehandler={handleImageUpload} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Issues;

