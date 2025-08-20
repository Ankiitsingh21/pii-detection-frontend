import Tesseract from 'tesseract.js';

// Regex patterns for PII detection (supports Hindi and English)
const PII_PATTERNS = {
  NAME: /[\u0900-\u097F]{2,}\s+[\u0900-\u097F]{2,}|[A-Z][a-z]+\s+[A-Z][a-z]+/i,
  AADHAAR: /\b[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}\b/,
  DOB: /\b(0[1-9]|[12][0-9]|3[01])[-/.](0[1-9]|1[012])[-/.](19|20)\d\d\b/,
  PHONE: /\b[6-9][0-9]{9}\b/,
  EMAIL: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
};

export const detectAndMaskPII = async (imageFile, onProgress) => {
  console.log('Starting OCR processing...');

  try {
    // Step 1: Perform OCR on the image with Hindi and English
    const { data } = await Tesseract.recognize(
      imageFile,
      'hin+eng', // Hindi and English
      {
        logger: message => {
          if (onProgress && message.status === 'recognizing text') {
            onProgress(message.progress * 100); // Progress from 0 to 100
          }
        }
      }
    );

    console.log('OCR Result:', data.text);

    // Step 2: Extract words with their bounding boxes
    const words = data.words || [];
    const piiWords = [];

    // Step 3: Identify PII using regex patterns
    words.forEach(word => {
      const text = word.text?.trim();
      if (!text) return;

      // Check against all PII patterns
      for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
        if (pattern.test(text)) {
          piiWords.push({
            text: text,
            bbox: word.bbox, // {x0, y0, x1, y1} coordinates
            type: type
          });
          console.log(`Detected ${type}: ${text}`);
          break;
        }
      }
    });

    // Step 4: Create masked image
    const img = new Image();
    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Mask detected PII
        if (piiWords.length > 0) {
          ctx.fillStyle = 'black';
          piiWords.forEach(word => {
            const { x0, y0, x1, y1 } = word.bbox;
            const width = x1 - x0;
            const height = y1 - y0;
            
            // Add some padding around the text
            const padding = 5;
            ctx.fillRect(
              x0 - padding, 
              y0 - padding, 
              width + (padding * 2), 
              height + (padding * 2)
            );
          });
        } else {
          // Fallback: if no PII detected, use smart mock masking
          applySmartMockMasking(ctx, img.width, img.height);
        }

        // Convert to blob
        canvas.toBlob(blob => {
          resolve({
            maskedImageUrl: URL.createObjectURL(blob),
            detectedPII: piiWords,
            ocrText: data.text
          });
        }, 'image/jpeg', 0.9);
      };

      img.src = URL.createObjectURL(imageFile);
    });

  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to process image with OCR. Please ensure the image is clear and try again.');
  }
};

// Fallback function if OCR doesn't detect PII
const applySmartMockMasking = (ctx, width, height) => {
  ctx.fillStyle = 'black';
  const masks = [
    { x: 0.25, y: 0.22, width: 0.4, height: 0.05 }, // Name
    { x: 0.25, y: 0.32, width: 0.5, height: 0.05 }, // Aadhaar
    { x: 0.25, y: 0.42, width: 0.3, height: 0.05 }, // DOB
    { x: 0.15, y: 0.52, width: 0.6, height: 0.08 }, // Address
    { x: 0.25, y: 0.65, width: 0.45, height: 0.05 } // Contact
  ];

  masks.forEach(mask => {
    const x = mask.x * width;
    const y = mask.y * height;
    const w = mask.width * width;
    const h = mask.height * height;
    
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 4); // Rounded corners
    ctx.fill();
  });
};