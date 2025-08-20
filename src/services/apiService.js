const API_BASE_URL = 'http://localhost:3000/api/v1';

export const uploadImageToBackend = async (imageFile, onProgress) => {
  try {
    // Simulate progress for UI feedback
    if (onProgress) {
      onProgress(10);
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    if (onProgress) {
      onProgress(30);
    }

    const response = await fetch(`${API_BASE_URL}/image`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type - let browser set it with boundary
      }
    });

    if (onProgress) {
      onProgress(70);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (onProgress) {
      onProgress(90);
    }

    if (!result.success) {
      throw new Error(result.message || 'Failed to process image');
    }

    if (onProgress) {
      onProgress(100);
    }

    return {
      maskedImageUrl: result.data.maskedImage,
      detectedPII: result.data.detectedPII || [],
      originalImageUrl: result.data.originalImage
    };

  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.message || 'Failed to upload image to server');
  }
};