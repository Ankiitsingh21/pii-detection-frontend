import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <Loader size={32} className="spinner-icon" />
      <p>Processing image and detecting PII...</p>
    </div>
  );
};

export default LoadingSpinner;