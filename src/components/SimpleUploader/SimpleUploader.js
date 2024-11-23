import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, LIMITS } from '../../firebase/config';
import './SimpleUploader.css';

const SimpleUploader = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    setError('');

    if (!selected) return;

    // Check file size
    if (selected.size > LIMITS.MAX_FILE_SIZE) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    // Check file type
    if (!selected.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setError('');

      // Create a reference
      const fileRef = ref(storage, `images/${Date.now()}-${file.name}`);

      // Upload file
      await uploadBytes(fileRef, file);

      // Get download URL
      const url = await getDownloadURL(fileRef);
      console.log('Upload successful:', url);

      // Clear form
      setFile(null);
      document.getElementById('file-input').value = '';

    } catch (error) {
      console.error('Upload error:', error);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="simple-uploader">
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
      />

      {error && <div className="error-message">{error}</div>}

      {file && (
        <div className="file-preview">
          <img src={URL.createObjectURL(file)} alt="Preview" />
          <button 
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleUploader;