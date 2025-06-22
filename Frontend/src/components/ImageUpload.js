// ImageUpload.js

import React, { useState } from 'react';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      alert('Please select an image first!');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/classify/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.classification);
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      setResult('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow w-96">
      <h2 className="text-xl font-bold mb-2">Upload Image for Classification</h2>
      <input type="file" onChange={handleImageChange} className="mb-2" />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {loading ? 'Classifying...' : 'Upload & Classify'}
      </button>
      {result && (
        <div className="mt-4 p-2 bg-gray-100 border rounded">
          <strong>Result:</strong> {result}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
