import { useState, useEffect } from "react";
import { storage } from "../firebase/config";

export const useImageLoader = (path) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const url = await storage.ref(path).getDownloadURL();
        setImageUrl(url);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    loadImage();
  }, [path]);

  return { imageUrl, loading, error };
};
