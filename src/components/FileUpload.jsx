import React, { useRef } from 'react';
import { Upload, File } from 'lucide-react';

const FileUpload = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      onFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div 
      className="file-upload-container"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="file-upload-content">
        <Upload size={48} className="upload-icon" />
        <h2>Upload ID Document</h2>
        <p>Drag & drop your image here or click to browse</p>
        <p className="file-types">Supported formats: JPG, PNG, WebP</p>
        
        <button 
          onClick={() => fileInputRef.current.click()}
          className="browse-button"
        >
          <File size={16} />
          Select File
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />
      </div>
    </div>
  );
};

export default FileUpload;