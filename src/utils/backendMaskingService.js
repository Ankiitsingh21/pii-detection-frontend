import { uploadImageToBackend } from '../services/apiService';

export const detectAndMaskPII = async (imageFile, onProgress) => {
  console.log('Sending image to backend for processing...');
  
  try {
    // Update progress callback to show status
    const progressCallback = (progress) => {
      if (onProgress) {
        let status = 'Uploading image...';
        if (progress >= 30) status = 'Processing image on server...';
        if (progress >= 70) status = 'Finalizing results...';
        if (progress >= 100) status = 'Complete!';
        
        onProgress(progress, status);
      }
    };

    const result = await uploadImageToBackend(imageFile, progressCallback);
    
    console.log('Backend processing complete:', result);
    
    return result;
    
  } catch (error) {
    console.error('Backend processing error:', error);
    throw new Error(error.message || 'Failed to process image on server. Please try again.');
  }
};