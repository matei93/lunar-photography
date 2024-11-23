import { ref, uploadBytes, getDownloadURL, listAll, deleteObject, updateMetadata } from 'firebase/storage';
import { storage } from '../firebase/config';
import imageCompression from 'browser-image-compression';

export const storageUtils = {
  // Upload with compression and metadata
  async uploadImage(file, path, options = {}) {
    try {
      // Image compression
      const compressedFile = await this.compressImage(file);
      
      // Add metadata
      const metadata = {
        contentType: file.type,
        customMetadata: {
          originalName: file.name,
          uploadDate: new Date().toISOString(),
          ...options.metadata
        }
      };

      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, compressedFile, metadata);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  },

  // Image compression
  async compressImage(file, options = {}) {
    const defaultOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.8
    };

    try {
      return await imageCompression(file, { ...defaultOptions, ...options });
    } catch (error) {
      console.error('Compression failed:', error);
      throw error;
    }
  },

  // Batch upload with progress
  async uploadGallery(files, galleryName, progressCallback) {
    const totalFiles = files.length;
    let completed = 0;

    try {
      const uploads = files.map(async (file, index) => {
        const path = `galleries/${galleryName}/${index}-${file.name}`;
        const url = await this.uploadImage(file, path);
        
        completed++;
        if (progressCallback) {
          progressCallback((completed / totalFiles) * 100);
        }

        return url;
      });

      return await Promise.all(uploads);
    } catch (error) {
      console.error('Gallery upload failed:', error);
      throw error;
    }
  },

  // Delete image or gallery
  async deleteImage(path) {
    try {
      const imageRef = ref(storage, path);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Delete failed:', error);
      throw error;
    }
  },

  // Update image metadata
  async updateImageMetadata(path, metadata) {
    try {
      const imageRef = ref(storage, path);
      await updateMetadata(imageRef, metadata);
    } catch (error) {
      console.error('Metadata update failed:', error);
      throw error;
    }
  },

  // List gallery contents with metadata
  async getGalleryContents(galleryPath) {
    try {
      const galleryRef = ref(storage, galleryPath);
      const result = await listAll(galleryRef);
      
      return await Promise.all(
        result.items.map(async (item) => {
          const url = await getDownloadURL(item);
          const metadata = await item.getMetadata();
          return {
            url,
            path: item.fullPath,
            metadata: metadata.customMetadata || {},
            contentType: metadata.contentType,
            size: metadata.size,
            timeCreated: metadata.timeCreated
          };
        })
      );
    } catch (error) {
      console.error('Failed to get gallery contents:', error);
      throw error;
    }
  }
};