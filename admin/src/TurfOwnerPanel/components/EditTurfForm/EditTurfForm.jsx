import React, { useState, useEffect } from "react";
import styles from "./EditTurfForm.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaTimes,
  FaUpload,
  FaMapMarkerAlt,
  FaTag,
  FaImage,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

const turfTypes = [
  "5-a-side",
  "7-a-side",
  "Cricket",
  "Multi-sport",
  "Football",
  "Basketball",
  "Other",
];
const featureOptions = [
  "Floodlights",
  "Indoor",
  "Parking",
  "Shower",
  "Changing Room",
  "Spectator Seating",
  "Air Conditioning",
  "Cafeteria",
  "First Aid",
  "CCTV",
];

const EditTurfForm = ({ url, turfData, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerHour: "",
    turfType: "",
    features: [],
    address: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
    status: "active",
    image: "",
    galleryImages: [],
  });

  const [newImage, setNewImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [newGallery, setNewGallery] = useState([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (turfData) {
      setFormData({
        name: turfData.name || "",
        description: turfData.description || "",
        pricePerHour: turfData.pricePerHour || "",
        turfType: turfData.turfType || "",
        features: turfData.features || [],
        address: turfData.address || "",
        city: turfData.city || "",
        state: turfData.state || "",
        latitude: turfData.latitude || "",
        longitude: turfData.longitude || "",
        status: turfData.status || "active",
        image: turfData.image || "",
        galleryImages: turfData.galleryImages || [],
      });
    }
  }, [turfData]);
  useEffect(() => {
    return () => {
      if (newImagePreview) {
        URL.revokeObjectURL(newImagePreview);
      }
      newGalleryPreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [newImagePreview, newGalleryPreviews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (feature) => {
    setFormData((prev) => {
      const features = prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature];
      return { ...prev, features };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Cleanup previous preview
      if (newImagePreview) {
        URL.revokeObjectURL(newImagePreview);
      }

      setNewImage(file);
      const previewUrl = URL.createObjectURL(file);
      setNewImagePreview(previewUrl);
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Cleanup previous previews
      newGalleryPreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });

      setNewGallery(files);
      const previews = files.map((file, index) => ({
        id: index,
        file,
        url: URL.createObjectURL(file),
        name: file.name,
      }));
      setNewGalleryPreviews(previews);
    }
  };

  const removeNewImage = () => {
    if (newImagePreview) {
      URL.revokeObjectURL(newImagePreview);
    }
    setNewImage(null);
    setNewImagePreview(null);
    document.getElementById("newImage").value = "";
  };

  const removeNewGalleryImage = (indexToRemove) => {
    const updatedPreviews = newGalleryPreviews.filter(
      (_, index) => index !== indexToRemove
    );
    const updatedFiles = newGallery.filter(
      (_, index) => index !== indexToRemove
    );

    URL.revokeObjectURL(newGalleryPreviews[indexToRemove].url);

    setNewGalleryPreviews(updatedPreviews);
    setNewGallery(updatedFiles);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const validate = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.pricePerHour || isNaN(formData.pricePerHour))
      return "Valid price is required";
    if (!formData.turfType) return "Turf type is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const updatedData = new FormData();
      updatedData.append("name", formData.name);
      updatedData.append("description", formData.description);
      updatedData.append("pricePerHour", formData.pricePerHour);
      updatedData.append("turfType", formData.turfType);
      updatedData.append("status", formData.status);
      updatedData.append("features", JSON.stringify(formData.features));
      updatedData.append("address", formData.address);
      updatedData.append("city", formData.city);
      updatedData.append("state", formData.state);
      updatedData.append("latitude", formData.latitude);
      updatedData.append("longitude", formData.longitude);

      if (newImage) {
        updatedData.append("image", newImage);
      }

      newGallery.forEach((file) => {
        updatedData.append("galleryImages", file);
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("turfOwnerToken")}`,
        },
      };
      const token = localStorage.getItem("turfOwnerToken");
      await axios.put(`${url}/api/turfs/${turfData._id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Turf updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      setError(error.response?.data?.message || "Failed to update turf");
      toast.error("Failed to update turf.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <FaEdit className={styles.titleIcon} />
            Edit Turf
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={loading}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Error Message */}
          {error && (
            <div className={styles.errorAlert}>
              <span className={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          <div className={styles.formGrid}>
            {/* Basic Information Section */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <FaTag className={styles.sectionIcon} />
                Basic Information
              </h3>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Turf Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter turf name"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of your turf"
                  rows={3}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Price Per Hour (₹){" "}
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    name="pricePerHour"
                    min="0"
                    value={formData.pricePerHour}
                    onChange={handleChange}
                    placeholder="1200"
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Turf Type <span className={styles.required}>*</span>
                  </label>
                  <select
                    name="turfType"
                    value={formData.turfType}
                    onChange={handleChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Select type</option>
                    {turfTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={styles.select}
                  required
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Under Maintenance</option>
                </select>
              </div>
            </div>

            {/* Location Information Section */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <FaMapMarkerAlt className={styles.sectionIcon} />
                Location Details
              </h3>

              <div className={styles.formGroup}>
                <label className={styles.label}>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address"
                  className={styles.input}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Latitude</label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="19.0760"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Longitude</label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="72.8777"
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <FaUpload className={styles.sectionIcon} />
                Features & Amenities
              </h3>
              <div className={styles.featuresGrid}>
                {featureOptions.map((feature) => (
                  <label key={feature} className={styles.featureCheckbox}>
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureChange(feature)}
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxLabel}>{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Images Section */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <FaImage className={styles.sectionIcon} />
                Images
              </h3>

              {/* Current Cover Image */}
              {formData.image && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Current Cover Image</label>
                  <div className={styles.currentImagePreview}>
                    <img
                      src={`${formData.image}`}
                      alt="Current cover"
                      className={styles.currentImage}
                    />
                    <div className={styles.currentImageOverlay}>
                      <span>Current Cover</span>
                    </div>
                  </div>
                </div>
              )}

              {/* New Cover Image */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Change Cover Image</label>
                <div className={styles.fileInputWrapper}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.fileInput}
                    id="newImage"
                  />
                  {!newImagePreview && (
                    <label htmlFor="newImage" className={styles.fileInputLabel}>
                      <FaUpload className={styles.uploadIcon} />
                      Choose new cover image
                    </label>
                  )}
                </div>

                {/* New Cover Image Preview */}
                {newImagePreview && (
                  <div className={styles.imagePreview}>
                    <div className={styles.previewItem}>
                      <img
                        src={newImagePreview}
                        alt="New cover preview"
                        className={styles.previewImage}
                      />
                      <button
                        type="button"
                        onClick={removeNewImage}
                        className={styles.removeImageBtn}
                      >
                        <FaTimes />
                      </button>
                      <div className={styles.imageInfo}>
                        <span className={styles.imageName}>
                          {newImage?.name}
                        </span>
                        <span className={styles.imageSize}>
                          {newImage
                            ? (newImage.size / 1024 / 1024).toFixed(2)
                            : 0}{" "}
                          MB
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Current Gallery Images */}
              {formData.galleryImages && formData.galleryImages.length > 0 && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Current Gallery Images</label>
                  <div className={styles.currentGalleryPreview}>
                    {formData.galleryImages.map((imagePath, index) => (
                      <div key={index} className={styles.currentGalleryItem}>
                        <img
                          src={`${url}${imagePath}`}
                          alt={`Gallery ${index + 1}`}
                          className={styles.currentGalleryImage}
                        />
                        <div className={styles.currentGalleryOverlay}>
                          <span>Gallery {index + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Gallery Images */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Add New Gallery Images</label>
                <div className={styles.fileInputWrapper}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryChange}
                    className={styles.fileInput}
                    id="newGallery"
                  />
                  <label htmlFor="newGallery" className={styles.fileInputLabel}>
                    <FaUpload className={styles.uploadIcon} />
                    {newGallery.length > 0
                      ? `${newGallery.length} new files selected`
                      : "Choose new gallery images"}
                  </label>
                </div>

                {/* New Gallery Images Preview */}
                {newGalleryPreviews.length > 0 && (
                  <div className={styles.galleryPreview}>
                    {newGalleryPreviews.map((preview, index) => (
                      <div
                        key={preview.id}
                        className={styles.galleryPreviewItem}
                      >
                        <img
                          src={preview.url}
                          alt={`New gallery preview ${index + 1}`}
                          className={styles.galleryPreviewImage}
                        />
                        <button
                          type="button"
                          onClick={() => removeNewGalleryImage(index)}
                          className={styles.removeGalleryBtn}
                        >
                          <FaTrash />
                        </button>
                        <div className={styles.galleryImageInfo}>
                          <span className={styles.galleryImageName}>
                            {preview.name.length > 15
                              ? `${preview.name.substring(0, 15)}...`
                              : preview.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Updating...
                </>
              ) : (
                "Update Turf"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTurfForm;
