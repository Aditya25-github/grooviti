import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AddTurfForm.module.css";
import {
  FaTimes,
  FaUpload,
  FaMapMarkerAlt,
  FaTag,
  FaImage,
  FaTrash,
} from "react-icons/fa";

const initialState = {
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
};

const turfTypes = ["Football", "Cricket", "Multi-Sport", "Basketball", "Other"];
const featureOptions = [
  "Floodlights",
  "Indoor",
  "Parking",
  "Shower",
  "Changing Room",
  "Spectator Seating",
];

const AddTurfForm = ({ url, onClose, onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (coverImagePreview) {
        URL.revokeObjectURL(coverImagePreview);
      }
      galleryPreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [coverImagePreview, galleryPreviews]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (feature) => {
    setForm((prev) => {
      const features = prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature];
      return { ...prev, features };
    });
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Cleanup previous preview
      if (coverImagePreview) {
        URL.revokeObjectURL(coverImagePreview);
      }

      setCoverImage(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverImagePreview(previewUrl);
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Cleanup previous previews
      galleryPreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });

      setGalleryImages(files);
      const previews = files.map((file, index) => ({
        id: index,
        file,
        url: URL.createObjectURL(file),
        name: file.name,
      }));
      setGalleryPreviews(previews);
    }
  };

  const removeCoverImage = () => {
    if (coverImagePreview) {
      URL.revokeObjectURL(coverImagePreview);
    }
    setCoverImage(null);
    setCoverImagePreview(null);
    // Clear the input
    document.getElementById("coverImage").value = "";
  };

  const removeGalleryImage = (indexToRemove) => {
    const updatedPreviews = galleryPreviews.filter(
      (_, index) => index !== indexToRemove
    );
    const updatedFiles = galleryImages.filter(
      (_, index) => index !== indexToRemove
    );

    // Cleanup the removed preview URL
    URL.revokeObjectURL(galleryPreviews[indexToRemove].url);

    setGalleryPreviews(updatedPreviews);
    setGalleryImages(updatedFiles);
  };

  const handleBackdropClick = (e) => {
    // Close modal only if clicking on the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.pricePerHour || isNaN(form.pricePerHour))
      return "Valid price is required";
    if (!form.turfType) return "Turf type is required";
    if (!form.address.trim()) return "Address is required";
    if (!coverImage) return "Cover image is required";
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

      const formData = new FormData();
      formData.append("data", JSON.stringify(form));
      formData.append("coverImage", coverImage);

      galleryImages.forEach((file, i) => {
        formData.append("galleryImages", file);
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("turfOwnerToken")}`,
        },
      };

      const res = await axios.post(`${url}/api/turfs`, formData, config);

      if (res.data.success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add turf");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add New Turf</h2>
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
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Enter turf name"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
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
                    name="pricePerHour"
                    type="number"
                    min="0"
                    value={form.pricePerHour}
                    onChange={handleInputChange}
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
                    value={form.turfType}
                    onChange={handleInputChange}
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
            </div>

            {/* Location Information Section */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <FaMapMarkerAlt className={styles.sectionIcon} />
                Location Details
              </h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Address <span className={styles.required}>*</span>
                </label>
                <input
                  name="address"
                  type="text"
                  value={form.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>City</label>
                  <input
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>State</label>
                  <input
                    name="state"
                    type="text"
                    value={form.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Latitude</label>
                  <input
                    name="latitude"
                    type="text"
                    value={form.latitude}
                    onChange={handleInputChange}
                    placeholder="19.0760"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Longitude</label>
                  <input
                    name="longitude"
                    type="text"
                    value={form.longitude}
                    onChange={handleInputChange}
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
                      checked={form.features.includes(feature)}
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

              {/* Cover Image */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Cover Image <span className={styles.required}>*</span>
                </label>
                <div className={styles.fileInputWrapper}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className={styles.fileInput}
                    id="coverImage"
                  />
                  {!coverImagePreview && (
                    <label
                      htmlFor="coverImage"
                      className={styles.fileInputLabel}
                    >
                      <FaUpload className={styles.uploadIcon} />
                      Choose cover image
                    </label>
                  )}
                </div>

                {/* Cover Image Preview */}
                {coverImagePreview && (
                  <div className={styles.imagePreview}>
                    <div className={styles.previewItem}>
                      <img
                        src={coverImagePreview}
                        alt="Cover preview"
                        className={styles.previewImage}
                      />
                      <button
                        type="button"
                        onClick={removeCoverImage}
                        className={styles.removeImageBtn}
                      >
                        <FaTimes />
                      </button>
                      <div className={styles.imageInfo}>
                        <span className={styles.imageName}>
                          {coverImage.name}
                        </span>
                        <span className={styles.imageSize}>
                          {(coverImage.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Gallery Images */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Gallery Images (Multiple)
                </label>
                <div className={styles.fileInputWrapper}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryChange}
                    className={styles.fileInput}
                    id="galleryImages"
                  />
                  <label
                    htmlFor="galleryImages"
                    className={styles.fileInputLabel}
                  >
                    <FaUpload className={styles.uploadIcon} />
                    {galleryImages.length > 0
                      ? `${galleryImages.length} files selected`
                      : "Choose gallery images"}
                  </label>
                </div>

                {/* Gallery Images Preview */}
                {galleryPreviews.length > 0 && (
                  <div className={styles.galleryPreview}>
                    {galleryPreviews.map((preview, index) => (
                      <div
                        key={preview.id}
                        className={styles.galleryPreviewItem}
                      >
                        <img
                          src={preview.url}
                          alt={`Gallery preview ${index + 1}`}
                          className={styles.galleryPreviewImage}
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
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
                  Adding Turf...
                </>
              ) : (
                "Add Turf"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTurfForm;
