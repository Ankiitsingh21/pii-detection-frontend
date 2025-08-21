import React from 'react';
import { Loader } from 'lucide-react';

const OCRProgress = ({ progress, status }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1.5rem',
      background: 'white',
      borderRadius: '12px',
      margin: '1rem 0',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)'
    }}>
      <Loader size={32} style={{ color: '#3498db', animation: 'spin 1.5s linear infinite' }} />
      
      <div style={{ flex: 1 }}>
        <p style={{ margin: '0 0 0.5rem 0', color: '#2c3e50', fontWeight: 500 }}>
          {status || 'Processing image...'}
        </p>
        
        {progress > 0 && (
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#ecf0f1',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '0.5rem'
          }}>
            <div 
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #3498db, #2980b9)',
                borderRadius: '4px',
                transition: 'width 0.3s ease',
                width: `${progress}%`
              }}
            />
          </div>
        )}
        
        <p style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>
          {Math.round(progress)}% complete
        </p>
      </div>
    </div>
  );
};

export default OCRProgress;