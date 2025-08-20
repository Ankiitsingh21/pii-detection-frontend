import React from 'react';
import { Download, Share } from 'lucide-react';

const MaskingControls = ({ image, filename, onReset }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `masked_${filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="masking-controls">
      <h3>Masking Complete</h3>
      <p>All sensitive information has been masked. You can now download or share the secure version.</p>
      
      <div className="control-buttons">
        <button onClick={handleDownload} className="download-button">
          <Download size={16} />
          Download Masked Image
        </button>
        
        <button onClick={onReset} className="reset-button">
          <Share size={16} />
          Process Another Image
        </button>
      </div>
    </div>
  );
};

export default MaskingControls;