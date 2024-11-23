import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storageUtils } from '../../utils/storageUtils';
import ImageProcessor from '../ImageProcessor/ImageProcessor';
import UploadTracker from '../UploadTracker/UploadTracker';
import './GalleryManager.css';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const GalleryManager = () => {
  const [galleries, setGalleries] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [optimizationSettings, setOptimizationSettings] = useState({
    quality: 0.8,
    maxWidth: 1920,
    format: 'webp',
    createThumbnails: true
  });

  // Fetch galleries with retry logic
  const fetchGalleries = async (retries = MAX_RETRIES) => {
    try {
      const galleryList = await storageUtils.listGalleries();
      setGalleries(galleryList);
    } catch (error) {
      if (retries > 0) {
        setTimeout(() => {
          fetchGalleries(retries - 1);
        }, RETRY_DELAY);
      } else {
        handleError('Failed to fetch galleries', error);
      }
    }
  };

  // Error handling
  const handleError = (message, error) => {
    const errorId = Date.now();
    setErrors(prev => [...prev, { id: errorId, message, error }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setErrors(prev => prev.filter(e => e.id !== errorId));
    }, 5000);
  };

  // Real-time upload tracking
  const updateUploadProgress = (uploadId, progress, status) => {
    setUploads(prev => 
      prev.map(upload => 
        upload.id === uploadId 
          ? { ...upload, progress, status }
          : upload
      )
    );
  };

  // Image optimization and upload
  const handleImageUpload = async (files, galleryId) => {
    const uploadPromises = files.map(async (file) => {
      const uploadId = Date.now() + Math.random();
      
      // Add to uploads tracking
      setUploads(prev => [...prev, {
        id: uploadId,
        filename: file.name,
        progress: 0,
        status: 'Starting...'
      }]);

      try {
        // Optimize image
        updateUploadProgress(uploadId, 10, 'Optimizing...');
        const optimizedImage = await optimizeImage(file);

        // Upload with progress tracking
        updateUploadProgress(uploadId, 30, 'Uploading...');
        const url = await uploadWithRetry(optimizedImage, galleryId, (progress) => {
          updateUploadProgress(uploadId, 30 + (progress * 0.7), 'Uploading...');
        });

        // Generate and upload thumbnail
        if (optimizationSettings.createThumbnails) {
          updateUploadProgress(uploadId, 90, 'Creating thumbnail...');
          await generateAndUploadThumbnail(file, galleryId);
        }

        updateUploadProgress(uploadId, 100, 'Complete');
        
        // Remove from tracking after delay
        setTimeout(() => {
          setUploads(prev => prev.filter(u => u.id !== uploadId));
        }, 2000);

        return url;
      } catch (error) {
        handleError(`Failed to upload ${file.name}`, error);
        updateUploadProgress(uploadId, 0, 'Failed');
        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);
      fetchGalleries(); // Refresh gallery list
    } catch (error) {
      handleError('Some uploads failed', error);
    }
  };

  // Image optimization function
  const optimizeImage = async (file) => {
    const { quality, maxWidth, format } = optimizationSettings;
    
    try {
      // Basic compression
      const compressed = await storageUtils.compressImage(file, {
        maxSizeMB: 2,
        maxWidthOrHeight: maxWidth,
        initialQuality: quality,
        useWebWorker: true
      });

      // Convert to WebP if selected
      if (format === 'webp' && compressed.type !== 'image/webp') {
        return await convertToWebP(compressed, quality);
      }

      return compressed;
    } catch (error) {
      throw new Error(`Optimization failed: ${error.message}`);
    }
  };

  // Retry logic for uploads
  const uploadWithRetry = async (file, galleryId, progressCallback, retries = MAX_RETRIES) => {
    try {
      return await storageUtils.uploadImage(file, `galleries/${galleryId}`, {
        onProgress: progressCallback,
        metadata: {
          optimized: 'true',
          originalName: file.name
        }
      });
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return uploadWithRetry(file, galleryId, progressCallback, retries - 1);
      }
      throw error;
    }
  };

  // Component JSX
  return (
    <div className="gallery-manager">
      {/* Error Display */}
      <AnimatePresence>
        {errors.map(error => (
          <motion.div
            key={error.id}
            className="error-message"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {error.message}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Optimization Settings */}
      <div className="optimization-settings">
        <h3>Image Optimization</h3>
        <div className="settings-grid">
          <div className="setting-item">
            <label>Quality</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={optimizationSettings.quality}
              onChange={(e) => setOptimizationSettings(prev => ({
                ...prev,
                quality: parseFloat(e.target.value)
              }))}
            />
            <span>{Math.round(optimizationSettings.quality * 100)}%</span>
          </div>
          
          <div className="setting-item">
            <label>Max Width</label>
            <select
              value={optimizationSettings.maxWidth}
              onChange={(e) => setOptimizationSettings(prev => ({
                ...prev,
                maxWidth: parseInt(e.target.value)
              }))}
            >
              <option value="1280">1280px</option>
              <option value="1920">1920px</option>
              <option value="2560">2560px</option>
            </select>
          </div>

          <div className="setting-item">
            <label>Format</label>
            <select
              value={optimizationSettings.format}
              onChange={(e) => setOptimizationSettings(prev => ({
                ...prev,
                format: e.target.value
              }))}
            >
              <option value="original">Original</option>
              <option value="webp">WebP</option>
              <option value="jpeg">JPEG</option>
            </select>
          </div>

          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={optimizationSettings.createThumbnails}
                onChange={(e) => setOptimizationSettings(prev => ({
                  ...prev,
                  createThumbnails: e.target.checked
                }))}
              />
              Create Thumbnails
            </label>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <ImageProcessor
        onProcessComplete={(files) => handleImageUpload(files, selectedGallery)}
        optimizationSettings={optimizationSettings}
      />

      {/* Upload Progress */}
      <UploadTracker uploads={uploads} />

      {/* Galleries List */}
      <div className="galleries-list">
        {galleries.map(gallery => (
          <div
            key={gallery.id}
            className={`gallery-item ${selectedGallery === gallery.id ? 'selected' : ''}`}
            onClick={() => setSelectedGallery(gallery.id)}
          >
            <h4>{gallery.name}</h4>
            <p>{gallery.imageCount} images</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryManager;