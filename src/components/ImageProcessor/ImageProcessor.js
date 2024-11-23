import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { storageUtils } from '../../utils/storageUtils';
import './ImageProcessor.css';

const ImageProcessor = ({ onProcessComplete }) => {
  const [images, setImages] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const processImage = async (file) => {
    try {
      // Generate thumbnail
      const thumbnailOptions = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 200,
        useWebWorker: true
      };
      const thumbnail = await storageUtils.compressImage(file, thumbnailOptions);

      // Generate web-optimized version
      const webOptions = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };
      const webVersion = await storageUtils.compressImage(file, webOptions);

      return {
        original: file,
        thumbnail,
        webVersion,
        name: file.name,
        id: Math.random().toString(36).substr(2, 9)
      };
    } catch (error) {
      console.error('Image processing failed:', error);
      throw error;
    }
  };

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files);
    setProcessing(true);
    setProgress(0);

    try {
      const processedImages = await Promise.all(
        files.map(async (file, index) => {
          const processed = await processImage(file);
          setProgress((index + 1) / files.length * 100);
          return processed;
        })
      );

      setImages(prev => [...prev, ...processedImages]);
      if (onProcessComplete) {
        onProcessComplete(processedImages);
      }
    } catch (error) {
      console.error('Failed to process images:', error);
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="image-processor">
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        onChange={handleFiles}
        className="hidden"
      />

      <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
        <div className="upload-content">
          {processing ? (
            <div className="processing">
              <div className="spinner"></div>
              <p>Processing images... {Math.round(progress)}%</p>
            </div>
          ) : (
            <>
              <i className="upload-icon">📁</i>
              <p>Click or drop images here</p>
            </>
          )}
        </div>
      </div>

      {images.length > 0 && (
        <motion.div className="image-grid" layout>
          {images.map(image => (
            <motion.div
              key={image.id}
              className="image-item"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <img src={URL.createObjectURL(image.webVersion)} alt={image.name} />
              <button 
                className="remove-btn"
                onClick={() => removeImage(image.id)}
              >
                ×
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ImageProcessor;