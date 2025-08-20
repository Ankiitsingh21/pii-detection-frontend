import React from 'react';
import { Loader } from 'lucide-react';

const OCRProgress = ({ progress, status }) => {
  return (
    <div className="ocr-progress">
      <Loader size={32} className="spinner-icon" />
      <div className="progress-content">
        <p className="status-text">{status || 'Processing image...'}</p>
        {progress > 0 && (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        <p className="progress-text">{progress}% complete</p>
      </div>
    </div>
  );
};

export default OCRProgress;