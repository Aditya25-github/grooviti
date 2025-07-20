import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaImages, FaSearchPlus } from "react-icons/fa";
import "./FresherGalleryPage.css";

const FresherGalleryPage = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // This would fetch from your backend in a real implementation
    // For now, we'll use mock data
    const mockImages = [
      {
        id: 1,
        url: "/images/fresher-gallery1.jpg",
        caption: "Welcome Session",
        category: "Opening",
      },
      {
        id: 2,
        url: "/images/fresher-gallery2.jpg",
        caption: "Cultural Performance",
        category: "Performances",
      },
      {
        id: 3,
        url: "/images/fresher-gallery3.jpg",
        caption: "Award Ceremony",
        category: "Awards",
      },
      {
        id: 4,
        url: "/images/fresher-gallery4.jpg",
        caption: "Group Photo",
        category: "Memories",
      },
      {
        id: 5,
        url: "/images/fresher-gallery5.jpg",
        caption: "Dance Competition",
        category: "Performances",
      },
      {
        id: 6,
        url: "/images/fresher-gallery6.jpg",
        caption: "Guest Lecture",
        category: "Speeches",
      },
    ];
    setImages(mockImages);
  }, []);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="gallery-page" style={{ paddingTop: "95px" }}>
      {/* Hero Section */}
      <section className="gallery-hero">
        <div className="hero-content">
          <FaImages className="hero-icon" />
          <h1>Fresher Party Gallery</h1>
          <p>Relive the memorable moments from our fresher's party</p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="gallery-container">
          {images.map((image) => (
            <div
              className="gallery-card"
              key={image.id}
              onClick={() => openModal(image)}
            >
              <div className="image-container">
                <img src={image.url} alt={image.caption} />
                <div className="image-overlay">
                  <FaSearchPlus className="zoom-icon" />
                </div>
              </div>
              <div className="image-info">
                <h3>{image.caption}</h3>
                <span className="category">{image.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={closeModal}>
              &times;
            </span>
            <img src={selectedImage.url} alt={selectedImage.caption} />
            <div className="modal-caption">
              <h3>{selectedImage.caption}</h3>
              <p>{selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FresherGalleryPage;
