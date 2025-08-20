import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ImagePreview from './components/ImagePreview';
import MaskingControls from './components/MaskingControls';
import OCRProgress from './components/OCRProgress';
import { detectAndMaskPII } from './utils/ocrMaskingService';
import './App.css';

function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [maskedImage, setMaskedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [detectedPII, setDetectedPII] = useState([]);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState('');

  const handleImageUpload = (file) => {
    setError(null);
    setOriginalImage(file);
    setMaskedImage(null);
    setDetectedPII([]);
    setOcrProgress(0);
    setOcrStatus('');
  };

  const handleMaskImage = async () => {
    if (!originalImage) return;
    
    setIsProcessing(true);
    setError(null);
    setMaskedImage(null);
    setDetectedPII([]);
    
    try {
      const result = await detectAndMaskPII(originalImage, (progress) => {
        setOcrProgress(progress);
        setOcrProgress(`Processing: ${Math.round(progress)}%`);
      });
      
      setMaskedImage(result.maskedImageUrl);
      setDetectedPII(result.detectedPII);
    } catch (err) {
      setError(err.message || 'Failed to process image. Please try again with a clearer image.');
      console.error('OCR Processing error:', err);
    } finally {
      setIsProcessing(false);
      setOcrProgress(0);
      setOcrStatus('');
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setMaskedImage(null);
    setError(null);
    setDetectedPII([]);
    setOcrProgress(0);
    setOcrStatus('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>PII Masking Tool</h1>
        <p>Upload an ID document to automatically detect and mask sensitive information</p>
      </header>
      
      <main className="app-main">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {!originalImage ? (
          <FileUpload onFileSelect={handleImageUpload} />
        ) : (
          <>
            <div className="processing-section">
              <button 
                onClick={handleMaskImage} 
                disabled={isProcessing}
                className="process-button"
              >
                {isProcessing ? 'Processing...' : 'Mask PII Information'}
              </button>
              
              <button 
                onClick={handleReset}
                className="reset-button"
              >
                Upload Different Image
              </button>
            </div>
            
            {isProcessing && (
              <OCRProgress progress={ocrProgress} status={ocrStatus} />
            )}
            
            <div className="preview-container">
              <ImagePreview 
                image={originalImage} 
                title="Original Document" 
              />
              
              {maskedImage && (
                <ImagePreview 
                  image={maskedImage} 
                  title="Masked Document" 
                />
              )}
            </div>
            
            {detectedPII.length > 0 && (
              <div className="pii-results">
                <h3>Detected PII</h3>
                <div className="pii-list">
                  {detectedPII.map((pii, index) => (
                    <div key={index} className={`pii-tag pii-${pii.type.toLowerCase()}`}>
                      {pii.type}: {pii.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {maskedImage && (
              <MaskingControls 
                image={maskedImage}
                filename={originalImage.name}
                onReset={handleReset}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;