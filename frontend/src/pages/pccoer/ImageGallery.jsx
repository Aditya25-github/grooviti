import React, { useState } from 'react';
import './imagegallery.css';
import { FaCloudUploadAlt, FaSpinner, FaTrash, FaDownload } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CLOUDINARY_UPLOAD_PRESET = 'your_upload_preset';
const CLOUDINARY_CLOUD_NAME = 'your_cloud_name';
const CLOUDINARY_API = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

const ImageGallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.match('image.*|video.*')) {
        toast.error(`Unsupported file type: ${file.name}`);
        return false;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error(`File too large (max 50MB): ${file.name}`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setLoading(true);

    for (const file of validFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      try {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: Math.round((e.loaded * 100) / e.total)
            }));
          }
        });

        const data = await new Promise((resolve, reject) => {
          xhr.open('POST', CLOUDINARY_API);
          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error('Upload failed'));
            }
          };
          xhr.onerror = () => reject(new Error('Upload error'));
          xhr.send(formData);
        });

        setMedia(prev => [{ ...data, originalName: file.name }, ...prev]);
        toast.success(`${file.name} uploaded successfully!`);
      } catch (err) {
        console.error('Upload error:', err);
        toast.error(`Failed to upload ${file.name}`);
      } finally {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }
    }

    setLoading(false);
    e.target.value = ''; // Reset input
  };

  const handleDelete = (index) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
    toast.info('Media removed from gallery');
  };

  const handleDownload = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name || `pccoer-gallery-${Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderMedia = (item, index) => {
    return (
      <div key={index} className="gallery-item-container">
        {item.resource_type === 'video' ? (
          <video controls className="gallery-item">
            <source src={item.secure_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img 
            src={item.secure_url} 
            alt={item.originalName || `media-${index}`} 
            className="gallery-item" 
            loading="lazy"
          />
        )}
        
        <div className="media-actions">
          <button 
            onClick={() => handleDownload(item.secure_url, item.originalName)}
            className="action-btn download-btn"
            title="Download"
          >
            <FaDownload />
          </button>
          <button 
            onClick={() => handleDelete(index)}
            className="action-btn delete-btn"
            title="Remove"
          >
            <FaTrash />
          </button>
        </div>
        
        {uploadProgress[item.originalName] && (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${uploadProgress[item.originalName]}%` }}
            ></div>
          </div>
        )}
        
        <div className="media-info">
          <span className="media-name">{item.originalName || 'Untitled'}</span>
          <span className="media-size">{formatFileSize(item.bytes)}</span>
        </div>
      </div>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="gallery-container">
      <ToastContainer position="bottom-right" autoClose={3000} />
      
      <header className="gallery-header">
        <h2>PCCoER Event Gallery</h2>
        <p>Share and view photos & videos from the event</p>
      </header>

      <div className="upload-section">
        <label className="upload-btn">
          {loading ? (
            <FaSpinner className="spin" />
          ) : (
            <>
              <FaCloudUploadAlt /> Upload Media
            </>
          )}
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleUpload}
            disabled={loading}
            className="upload-input"
          />
        </label>
        <p className="upload-hint">Supports JPG, PNG, GIF, MP4 (Max 50MB each)</p>
      </div>

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">{media.length}</span>
          <span className="stat-label">Total Items</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {media.filter(m => m.resource_type === 'video').length}
          </span>
          <span className="stat-label">Videos</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {media.filter(m => m.resource_type === 'image').length}
          </span>
          <span className="stat-label">Photos</span>
        </div>
      </div>

      {media.length === 0 && !loading ? (
        <div className="empty-state">
          <p>No media yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {media.map((item, index) => renderMedia(item, index))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;