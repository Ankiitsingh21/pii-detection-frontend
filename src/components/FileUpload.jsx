import React, { useRef, useState, useCallback } from "react";
import { Upload, File, Image, CheckCircle, AlertTriangle } from "lucide-react";

const SUPPORTED_FORMATS = ["JPG", "PNG", "WebP"];
const MAX_FILE_SIZE_MB = 10;

const FileUpload = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  // Enhanced file validation
  const validateFile = useCallback((file) => {
    if (!file.type.startsWith("image/")) {
      return { valid: false, error: "Please select a valid image file" };
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return {
        valid: false,
        error: `File size must be less than ${MAX_FILE_SIZE_MB}MB`,
      };
    }

    return { valid: true, error: null };
  }, []);

  // File selection handler
  const handleFileSelection = useCallback(
    (file) => {
      const validation = validateFile(file);

      if (!validation.valid) {
        // You could add a toast notification here
        console.error(validation.error);
        return;
      }

      onFileSelect(file);
    },
    [onFileSelect, validateFile],
  );

  // Input change handler
  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelection(file);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    },
    [handleFileSelection],
  );

  // Drag and drop handlers with counter to handle nested elements
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragging(false);
      }
      return newCounter;
    });
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setDragCounter(0);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        handleFileSelection(file);
      }
    },
    [handleFileSelection],
  );

  // Click handler for the upload area
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Keyboard handler for accessibility
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  return (
    <div
      className={`file-upload-container ${isDragging ? "drag-over" : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Upload image file by clicking or dragging"
    >
      <div className="file-upload-content">
        <div className="upload-icon-container">
          {isDragging ? (
            <CheckCircle
              size={64}
              className="upload-icon upload-icon-active"
              style={{
                color: "#10b981",
                filter: "drop-shadow(0 0 20px rgba(16, 185, 129, 0.5))",
              }}
            />
          ) : (
            <Upload size={64} className="upload-icon" />
          )}
        </div>

        <div className="upload-text-content">
          <h2>{isDragging ? "Drop your image here" : "Upload ID Document"}</h2>

          <p className="upload-description">
            {isDragging
              ? "Release to upload your document"
              : "Drag & drop your image here or click to browse"}
          </p>

          <div className="file-info">
            <div className="supported-formats">
              <Image size={16} />
              <span>Supported: {SUPPORTED_FORMATS.join(", ")}</span>
            </div>

            <div className="file-size-limit">
              <AlertTriangle size={16} />
              <span>Max size: {MAX_FILE_SIZE_MB}MB</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="browse-button"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          aria-label="Browse for image file"
        >
          <File size={18} />
          Choose File
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
          aria-hidden="true"
        />
      </div>

      {/* Animated background elements */}
      <div className="upload-bg-elements">
        <div className="bg-element bg-element-1"></div>
        <div className="bg-element bg-element-2"></div>
        <div className="bg-element bg-element-3"></div>
      </div>
    </div>
  );
};

export default FileUpload;
