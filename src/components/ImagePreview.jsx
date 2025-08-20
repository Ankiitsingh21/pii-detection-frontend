import React from 'react';

const ImagePreview = ({ image, title }) => {
  const imageUrl = typeof image === 'string' 
    ? image 
    : URL.createObjectURL(image);

  return (
    <div className="image-preview">
      <h3>{title}</h3>
      <div className="image-container">
        <img 
          src={imageUrl} 
          alt={title} 
          onLoad={() => {
            if (typeof image !== 'string') {
              URL.revokeObjectURL(imageUrl);
            }
          }}
        />
      </div>
    </div>
  );
};

export default ImagePreview;