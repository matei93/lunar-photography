import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { database, storage } from "../../../firebase/config";
import "./NestedGallery.css";

const NestedGallery = () => {
  const [galleryData, setGalleryData] = useState([]);
  const [activeGallery, setActiveGallery] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const snapshot = await database.collection("galleries").get();
        const data = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const galleryData = doc.data();
            const coverImageURL = await storage
              .ref(`galleries/${galleryData.folder}/${galleryData.coverImage}`)
              .getDownloadURL();

            const imageReferences = await storage
              .ref(`galleries/${galleryData.folder}`)
              .listAll()
              .then((res) => res.items.map((item) => item.name));

            const imageUrls = await Promise.all(
              imageReferences.map(async (imageName) => {
                const imageUrl = await storage
                  .ref(`galleries/${galleryData.folder}/${imageName}`)
                  .getDownloadURL();
                return imageUrl;
              })
            );

            return { ...galleryData, coverImageURL, imageUrls };
          })
        );
        setGalleryData(data);
      } catch (error) {
        console.error("Error fetching gallery data:", error);
      }
    };

    fetchGalleryData();
  }, []);

  const handleGalleryClick = (galleryIndex) => {
    setActiveImageIndex(null);
    setActiveGallery(activeGallery === galleryIndex ? null : galleryIndex);
  };

  const handleImageClick = (imageIndex) => {
    setActiveImageIndex(imageIndex);
  };

  return (
    <Container>
      {galleryData.map((gallery, index) => (
        <div
          key={index}
          className={`gallery-container ${
            activeGallery === index ? "active" : ""
          }`}
        >
          <h2 onClick={() => handleGalleryClick(index)}>{gallery.title}</h2>
          {activeGallery === index && (
            <>
              <img
                src={gallery.coverImageURL}
                alt={`Gallery ${index + 1} Cover`}
                className="gallery-cover img-fluid"
                onClick={() => handleGalleryClick(null)}
              />
              <Row>
                {gallery.imageUrls.map((imageUrl, imageIndex) => (
                  <Col key={imageIndex} md={4}>
                    <img
                      src={imageUrl}
                      alt={`Gallery ${index + 1} Image ${imageIndex + 1}`}
                      className="img-fluid"
                      onClick={() => handleImageClick(imageIndex)}
                    />
                  </Col>
                ))}
              </Row>
            </>
          )}
        </div>
      ))}
    </Container>
  );
};

export default NestedGallery;
