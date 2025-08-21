import React from "react";
import { Download, RotateCcw } from "lucide-react";

const MaskingControls = ({ image, filename, onReset }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image;
    link.download = `masked_${filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "1.5rem",
        textAlign: "center",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
        marginTop: "2rem",
        borderLeft: "4px solid #27ae60",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          color: "#27ae60",
          fontWeight: 600,
          fontSize: "1.25rem",
        }}
      >
        Processing Complete
      </h3>
      <p
        style={{
          color: "#7f8c8d",
          marginBottom: "1.5rem",
          lineHeight: 1.5,
          fontSize: "0.95rem",
        }}
      >
        Your document has been processed. You can now download the result or
        process another image.
      </p>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleDownload}
          style={{
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "6px",
            fontWeight: 500,
            cursor: "pointer",
            backgroundColor: "#27ae60",
            color: "white",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          <Download size={16} />
          Download Result
        </button>

        <button
          onClick={onReset}
          style={{
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "6px",
            fontWeight: 500,
            cursor: "pointer",
            backgroundColor: "#e74c3c",
            color: "white",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          <RotateCcw size={16} />
          Process Another Image
        </button>
      </div>
    </div>
  );
};

export default MaskingControls;
