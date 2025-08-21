import React, { useState, useCallback, useMemo } from 'react';
import { AlertCircle, Shield } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ImagePreview from './components/ImagePreview';
import MaskingControls from './components/MaskingControls';
import OCRProgress from './components/OCRProgress';
import { detectAndMaskPII } from './utils/backendMaskingService';
import './App.css';

// Constants for better maintainability
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SUPPORTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

function App() {
  // State management with better organization
  const [state, setState] = useState({
    originalImage: null,
    maskedImage: null,
    isProcessing: false,
    error: null,
    detectedPII: [],
    ocrProgress: 0,
    ocrStatus: ''
  });

  // Destructure for cleaner code
  const {
    originalImage,
    maskedImage,
    isProcessing,
    error,
    detectedPII,
    ocrProgress,
    ocrStatus
  } = state;

  // Memoized validation function
  const validateFile = useMemo(() => (file) => {
    if (!file) return { valid: false, error: 'No file selected' };
    
    if (file.size > MAX_FILE_SIZE) {
      return { 
        valid: false, 
        error: 'File size exceeds 10MB limit. Please choose a smaller image.' 
      };
    }
    
    if (!SUPPORTED_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Unsupported file format. Please use JPG, PNG, or WebP.' 
      };
    }
    
    return { valid: true, error: null };
  }, []);

  // Optimized file upload handler with validation
  const handleImageUpload = useCallback((file) => {
    const validation = validateFile(file);
    
    if (!validation.valid) {
      setState(prev => ({
        ...prev,
        error: validation.error,
        originalImage: null,
        maskedImage: null,
        detectedPII: [],
        ocrProgress: 0,
        ocrStatus: ''
      }));
      return;
    }
    
    setState(prev => ({
      ...prev,
      originalImage: file,
      maskedImage: null,
      detectedPII: [],
      error: null,
      ocrProgress: 0,
      ocrStatus: ''
    }));
  }, [validateFile]);

  // Optimized progress handler
  const handleProgress = useCallback((progress, status) => {
    setState(prev => ({
      ...prev,
      ocrProgress: progress,
      ocrStatus: status || `Processing: ${Math.round(progress)}%`
    }));
  }, []);

  // Enhanced mask image handler with better error handling
  const handleMaskImage = useCallback(async () => {
    if (!originalImage) return;
    
    setState(prev => ({
      ...prev,
      isProcessing: true,
      error: null,
      maskedImage: null,
      detectedPII: [],
      ocrProgress: 0,
      ocrStatus: 'Initializing...'
    }));
    
    try {
      const result = await detectAndMaskPII(originalImage, handleProgress);
      
      setState(prev => ({
        ...prev,
        maskedImage: result.maskedImageUrl,
        detectedPII: result.detectedPII || [],
        isProcessing: false,
        ocrProgress: 100,
        ocrStatus: 'Complete!'
      }));
      
      // Clear progress after a delay for better UX
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          ocrProgress: 0,
          ocrStatus: ''
        }));
      }, 2000);
      
    } catch (err) {
      console.error('Processing error:', err);
      setState(prev => ({
        ...prev,
        error: err.message || 'Failed to process image. Please try again.',
        isProcessing: false,
        ocrProgress: 0,
        ocrStatus: ''
      }));
    }
  }, [originalImage, handleProgress]);

  // Reset function with complete state cleanup
  const handleReset = useCallback(() => {
    setState({
      originalImage: null,
      maskedImage: null,
      error: null,
      detectedPII: [],
      ocrProgress: 0,
      ocrStatus: '',
      isProcessing: false
    });
  }, []);

  // Memoized computed values
  const showPreview = useMemo(() => Boolean(originalImage), [originalImage]);
  const showResults = useMemo(() => Boolean(maskedImage), [maskedImage]);
  const hasPII = useMemo(() => detectedPII.length > 0, [detectedPII.length]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <Shield size={48} style={{ 
            display: 'inline-block', 
            marginRight: '1rem',
            filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))'
          }} />
          PII Guardian
        </h1>
        <p>
          Advanced AI-powered document privacy protection. 
          Automatically detect and mask sensitive personal information 
          from your ID documents with enterprise-grade security.
        </p>
      </header>
      
      <main className="app-main">
        {error && (
          <div className="error-message">
            <AlertCircle size={24} />
            <span>{error}</span>
          </div>
        )}
        
        {!showPreview ? (
          <FileUpload onFileSelect={handleImageUpload} />
        ) : (
          <>
            <div className="processing-section">
              <button 
                onClick={handleMaskImage} 
                disabled={isProcessing}
                className="process-button"
                aria-label={isProcessing ? 'Processing image...' : 'Start PII masking process'}
              >
                <Shield size={20} />
                {isProcessing ? 'Processing...' : 'Mask PII Information'}
              </button>
              
              <button 
                onClick={handleReset}
                className="reset-button"
                aria-label="Upload a different image"
              >
                Upload Different Image
              </button>
            </div>
            
            {isProcessing && (
              <OCRProgress 
                progress={ocrProgress} 
                status={ocrStatus}
              />
            )}
            
            <div className="preview-container">
              <ImagePreview 
                image={originalImage} 
                title="Original Document" 
              />
              
              {showResults && (
                <ImagePreview 
                  image={maskedImage} 
                  title="Protected Document" 
                />
              )}
            </div>
            
            {hasPII && (
              <div className="pii-results">
                <h3>
                  <Shield size={24} />
                  Detected & Masked Information
                </h3>
                <p style={{ 
                  color: 'var(--gray-600)', 
                  marginBottom: 'var(--space-lg)', 
                  fontSize: '0.95rem' 
                }}>
                  The following sensitive information was automatically detected and protected:
                </p>
                <div className="pii-list">
                  {detectedPII.map((pii, index) => (
                    <div key={`${pii.type}-${index}`} className={`pii-tag pii-${pii.type.toLowerCase()}`}>
                      {pii.type.replace('_', ' ')}: {pii.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {showResults && (
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