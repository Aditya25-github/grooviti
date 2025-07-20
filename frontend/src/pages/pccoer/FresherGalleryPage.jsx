import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaImages, FaSearchPlus, FaFolder, FaArrowLeft, FaCloudUploadAlt, FaTrash, FaDownload } from "react-icons/fa";
import { MdClose, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./FresherGalleryPage.css";

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
  image: { cloudName: "djpkvmqtz", uploadPreset: "fresher_gallery_images" },
  video: { cloudName: "dkbn1i1gb", uploadPreset: "fresher_gallery_videos" }
};

// Initial Gallery Content with a more realistic author data structure
const initialMedia = [];

const galleryCategories = [
    "Welcome Session", "Cultural Performance", "Award Ceremony",
    "Group Photo", "Dance Competition", "Guest Lecture", "Test"
];

const FresherGalleryPage = () => {
  const [mediaItems, setMediaItems] = useState(initialMedia);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [sortOption, setSortOption] = useState('newest');
  const [captionEdit, setCaptionEdit] = useState({ id: null, value: '' });
  const fileInputRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      setCurrentUser(JSON.parse(userJson));
    }
  }, []);


  const sortMedia = (items, option) => {
    const sorted = [...items];
    switch (option) {
      case 'newest': return sorted.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      case 'oldest': return sorted.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
      case 'name-asc': return sorted.sort((a, b) => a.caption.localeCompare(b.caption));
      case 'name-desc': return sorted.sort((a, b) => b.caption.localeCompare(a.caption));
      default: return sorted;
    }
  };

  const handleUpload = async (fileToUpload) => {
    if (!currentUser) return alert("You must be logged in to upload.");
    if (!fileToUpload || !activeCategory) return alert("Please select a category before uploading.");
    
    const isImage = fileToUpload.type.startsWith("image/");
    const isVideo = fileToUpload.type.startsWith("video/");
    const config = isImage ? CLOUDINARY_CONFIG.image : isVideo ? CLOUDINARY_CONFIG.video : null;
    if (!config) return alert("Unsupported file type.");
    
    setUploading(true);
    const apiUrl = `https://api.cloudinary.com/v1_1/${config.cloudName}/${isImage ? 'image' : 'video'}/upload`;
    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("upload_preset", config.uploadPreset);
    formData.append("folder", `fresher-party/${activeCategory.replace(/\s+/g, '_')}`);
    
    try {
      const response = await axios.post(apiUrl, formData);
      const newMedia = {
        id: response.data.public_id,
        url: response.data.secure_url,
        caption: fileToUpload.name.split('.')[0] || "New Upload",
        category: activeCategory,
        resource_type: response.data.resource_type,
        uploadDate: new Date().toISOString().split('T')[0],
        author: {
            _id: currentUser._id,
            name: currentUser.name
        }
      };
      setMediaItems(prev => sortMedia([newMedia, ...prev], sortOption));
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) handleUpload(file);
  };

  const openModal = (media) => setSelectedMedia(media);
  const closeModal = () => {
    setSelectedMedia(null);
    setCaptionEdit({ id: null, value: '' });
  };

  const handleCaptionUpdate = () => {
    if (captionEdit.id && captionEdit.value) {
      setMediaItems(prev => prev.map(item => item.id === captionEdit.id ? { ...item, caption: captionEdit.value } : item));
      setCaptionEdit({ id: null, value: '' });
    }
  };

  const handleDelete = (mediaIdToDelete, event) => {
    event.stopPropagation();
    if (window.confirm("Are you sure you want to remove this item from the gallery?")) {
      setMediaItems(prevItems => prevItems.filter(item => item.id !== mediaIdToDelete));
    }
  };

  const getDownloadUrl = (media) => {
    const urlParts = media.url.split('/upload/');
    if (urlParts.length !== 2) return media.url;
    return `${urlParts[0]}/upload/fl_attachment/${urlParts[1]}`;
  };

  const renderMediaElement = (media) => {
    if (media.resource_type === "video") {
      return <video src={media.url} autoPlay loop muted playsInline className="gallery-video" controls={selectedMedia === media} />;
    }
    return <img src={media.url} alt={media.caption} loading="lazy" />;
  };
  
  const renderMediaView = () => {
    const filteredMedia = mediaItems.filter(item => item.category === activeCategory);
    const sortedMedia = sortMedia(filteredMedia, sortOption);
    
    return (
      <div className="media-view-container">
        <div className="media-view-header">
          <button className="back-button" onClick={() => setActiveCategory(null)}>
            <FaArrowLeft /> Back to Folders
          </button>
          <h2>{activeCategory}</h2>
          <div className="sort-controls">
            <label>Sort by:</label>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="sort-select">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>
        
        <div className="gallery-container">
          {sortedMedia.map((media) => (
            <div className="gallery-card" key={media.id}>
              <div className="image-container" onClick={() => openModal(media)}>
                {renderMediaElement(media)}
                <div className="image-overlay">
                  <FaSearchPlus className="zoom-icon" />
                  <span className="media-date">{media.uploadDate}</span>
                </div>
                <div className="card-actions">
                    <a href={getDownloadUrl(media)} download={media.caption} className="action-btn download-btn" onClick={(e) => e.stopPropagation()} aria-label="Download">
                        <FaDownload />
                    </a>
                    {currentUser && currentUser._id === media.author?._id && (
                        <button className="action-btn delete-btn" onClick={(e) => handleDelete(media.id, e)} aria-label="Delete">
                            <FaTrash />
                        </button>
                    )}
                </div>
              </div>
              <div className="image-info">
                <h3 onClick={() => setCaptionEdit({ id: media.id, value: media.caption })}>
                  {media.caption} <MdEdit className="edit-icon" />
                </h3>
                <p className="uploader-name">by {media.author?.name || 'Unknown User'}</p>
              </div>
            </div>
          ))}
        </div>
        
        {sortedMedia.length === 0 && !uploading && (
          <div className="empty-gallery-message">
            <FaImages className="empty-icon" />
            <p>This folder is empty. Be the first to add a memory!</p>
          </div>
        )}
        
        {currentUser && (
            <section className="upload-section">
                <div className="upload-area" onClick={() => fileInputRef.current.click()}>
                    <div className={`upload-content ${uploading ? 'uploading' : ''}`}>
                    {uploading ? <div className="loader"></div> : <>
                        <FaCloudUploadAlt className="upload-icon" />
                        <p>Click to upload or drag & drop</p>
                        <small>Supports images and videos</small>
                    </>}
                    </div>
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} accept="image/*,video/*" />
                </div>
            </section>
        )}
      </div>
    );
  };
  
  const renderFolderView = () => {
    return (
      <div className="folder-grid">
        {galleryCategories.map(category => {
          const itemsInCategory = mediaItems.filter(item => item.category === category);
          const previewItem = itemsInCategory[0];
          return (
            <div className="folder-card" key={category} onClick={() => setActiveCategory(category)}>
              <div className="folder-preview">
                {previewItem ? renderMediaElement(previewItem) : <div className="folder-icon-placeholder"><FaFolder /></div>}
              </div>
              <div className="folder-info">
                <h3>{category}</h3>
                <span>{itemsInCategory.length} {itemsInCategory.length === 1 ? 'item' : 'items'}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="gallery-page">
      {/* --- NEW: Global Back Button --- */}
      <button className="global-back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <section className="gallery-section">
        {activeCategory ? renderMediaView() : renderFolderView()}
      </section>

      {selectedMedia && (
        <div className="image-modal active" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}><MdClose /></button>
            <div className="modal-media-container">{renderMediaElement(selectedMedia)}</div>
            <div className="modal-caption">
              {captionEdit.id === selectedMedia.id ? (
                <div className="caption-edit">
                  <input type="text" value={captionEdit.value} onChange={(e) => setCaptionEdit({...captionEdit, value: e.target.value})} autoFocus />
                  <button onClick={handleCaptionUpdate}>Save</button>
                </div>
              ) : (
                <h3 onClick={() => setCaptionEdit({ id: selectedMedia.id, value: selectedMedia.caption })}>
                  {selectedMedia.caption}
                </h3>
              )}
              <p>{selectedMedia.category} • {selectedMedia.uploadDate} • by {selectedMedia.author?.name || 'Unknown User'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FresherGalleryPage;
