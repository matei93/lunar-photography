import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../firebase/config';

export const uploadImage = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const getGalleryImages = async (galleryPath) => {
  try {
    const galleryRef = ref(storage, galleryPath);
    const result = await listAll(galleryRef);
    const urls = await Promise.all(
      result.items.map(item => getDownloadURL(item))
    );
    return urls;
  } catch (error) {
    console.error('Error getting gallery images:', error);
    throw error;
  }
};

export const uploadGallery = async (files, galleryName) => {
  try {
    const uploads = files.map((file, index) => {
      const path = `galleries/${galleryName}/${index}-${file.name}`;
      return uploadImage(file, path);
    });
    return await Promise.all(uploads);
  } catch (error) {
    console.error('Error uploading gallery:', error);
    throw error;
  }
};