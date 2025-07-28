import React, { useState, useCallback } from "react";
import styles from "./AddTurf.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import DraggableMapPicker from "../../components/DraggableMapPicker/DraggableMapPicker";
import { FiUpload, FiX, FiCheck, FiMapPin, FiNavigation } from "react-icons/fi";

const AddTurf = ({ url }) => {
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
  });

  const [coverImage, setCoverImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [geolocationError, setGeolocationError] = useState(null);

  const turfTypes = ["5-a-side", "7-a-side", "Cricket", "Box Turf"];
  const featureOptions = [
    "Floodlights",
    "Washroom",
    "Drinking Water",
    "Parking",
    "Cafeteria",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFeatureChange = (feature) => {
    setFormData((prev) => {
      const isSelected = prev.features.includes(feature);
      const newFeatures = isSelected
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature];
      return { ...prev, features: newFeatures };
    });
  };

  const onDropCover = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setCoverImage(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps } =
    useDropzone({
      onDrop: onDropCover,
      accept: "image/*",
      maxFiles: 1,
    });

  const onDropGallery = useCallback((acceptedFiles) => {
    setGalleryImages((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const {
    getRootProps: getGalleryRootProps,
    getInputProps: getGalleryInputProps,
  } = useDropzone({
    onDrop: onDropGallery,
    accept: "image/*",
    multiple: true,
  });

  const removeGalleryImage = (index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMapUpdate = ({ lat, lng, address, city, state }) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
      address: address || prev.address,
      city: city || prev.city,
      state: state || prev.state,
    }));
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const addr = data.address || {};
      return {
        address: data.display_name || "",
        city: addr.city || addr.town || addr.village || "",
        state: addr.state || "",
      };
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return { address: "", city: "", state: "" };
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setGeolocationError("browser-not-supported");
      return;
    }

    setIsLocating(true);
    setGeolocationError(null);
    toast.info("Please allow location access when prompted...", {
      autoClose: 5000,
      closeButton: true,
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const { address, city, state } = await reverseGeocode(
            latitude,
            longitude
          );
          setFormData((prev) => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            address,
            city,
            state,
          }));
          toast.success("Location obtained and address filled!");
        } catch (error) {
          toast.error("Failed to process your location");
          console.error("Geolocation processing error:", error);
          setGeolocationError("processing-error");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        let errorMessage = "Unable to retrieve your location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access was denied. Please enable permissions in your browser settings.";
            setGeolocationError("permission-denied");
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            setGeolocationError("position-unavailable");
            break;
          case error.TIMEOUT:
            errorMessage =
              "The request to get location timed out. Please try again.";
            setGeolocationError("timeout");
            break;
          default:
            setGeolocationError("unknown-error");
            break;
        }

        toast.error(errorMessage, { autoClose: 8000 });
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coverImage) return toast.error("Please upload a cover image");
    if (!formData.name) return toast.error("Please enter a turf name");
    if (!formData.address) return toast.error("Please enter an address");
    if (!formData.latitude || !formData.longitude)
      return toast.error("Please set a location on the map");

    const data = new FormData();
    data.append("coverImage", coverImage);
    galleryImages.forEach((img) => data.append("galleryImages", img));
    data.append("data", JSON.stringify(formData));

    const token = localStorage.getItem("adminToken");

    try {
      setLoading(true);
      await axios.post(`${url}/api/turfs`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Turf added successfully!");

      // Reset form
      setFormData({
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
      });
      setCoverImage(null);
      setGalleryImages([]);
      setGeolocationError(null);
    } catch (error) {
      console.error("Error adding turf:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to add turf";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.addTurfPage}>
      <div className={styles.addTurfContainer}>
        <div className={styles.header}>
          <h2>Add New Turf</h2>
          <p>Fill in the details to list a new turf</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            {/* Turf Name */}
            <div className={styles.formGroup}>
              <label>Turf Name *</label>
              <input
                name="name"
                placeholder="Turf Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Turf Type */}
            <div className={styles.formGroup}>
              <label>Turf Type</label>
              <select
                name="turfType"
                value={formData.turfType}
                onChange={handleChange}
              >
                <option value="">Select Turf Type</option>
                {turfTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className={styles.formGroup}>
              <label>Price per Hour (₹)</label>
              <input
                type="number"
                name="pricePerHour"
                placeholder="Price per Hour"
                value={formData.pricePerHour}
                onChange={handleChange}
                min="0"
              />
            </div>

            {/* Description */}
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Describe your turf (facilities, rules, etc.)"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>

            {/* Features */}
            <div className={`${styles.formGroup} ${styles.featuresGroup}`}>
              <label>Features</label>
              <div className={styles.featuresBox}>
                {featureOptions.map((f) => (
                  <div
                    key={f}
                    className={`${styles.featureTag} ${
                      formData.features.includes(f) ? styles.active : ""
                    }`}
                    onClick={() => handleFeatureChange(f)}
                  >
                    {formData.features.includes(f) && (
                      <FiCheck className={styles.checkIcon} />
                    )}
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className={styles.formGroup}>
              <label>Address *</label>
              <div className={styles.addressInputContainer}>
                <FiMapPin className={styles.addressIcon} />
                <input
                  name="address"
                  placeholder="Full address of the turf"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Cover Image */}
            <div className={styles.formGroup}>
              <label>Cover Image *</label>
              <div
                {...getCoverRootProps()}
                className={`${styles.dropzone} ${
                  coverImage ? styles.hasImage : ""
                }`}
              >
                <input {...getCoverInputProps()} />
                {coverImage ? (
                  <div className={styles.imagePreview}>
                    <img
                      src={URL.createObjectURL(coverImage)}
                      alt="Cover preview"
                    />
                    <button
                      type="button"
                      className={styles.removeImage}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCoverImage(null);
                      }}
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <>
                    <FiUpload className={styles.uploadIcon} />
                    <p>Drag & drop cover image here, or click to select</p>
                    <em>(Only one image, will be used as cover)</em>
                  </>
                )}
              </div>
            </div>

            {/* Gallery Images */}
            <div className={styles.formGroup}>
              <label>Gallery Images</label>
              <div {...getGalleryRootProps()} className={styles.dropzone}>
                <input {...getGalleryInputProps()} />
                <FiUpload className={styles.uploadIcon} />
                <p>Drag & drop gallery images here, or click to select</p>
                <em>(Multiple images allowed)</em>
              </div>
              {galleryImages.length > 0 && (
                <div className={styles.galleryPreview}>
                  {galleryImages.map((img, index) => (
                    <div key={index} className={styles.galleryThumbnail}>
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${index}`}
                      />
                      <button
                        type="button"
                        className={styles.removeImage}
                        onClick={() => removeGalleryImage(index)}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location */}
            <div className={styles.formGroup}>
              <div className={styles.locationHeader}>
                <label>Location *</label>
                <div className={styles.locationActions}>
                  <button
                    type="button"
                    className={`${styles.useLocationButton} ${
                      geolocationError ? styles.error : ""
                    }`}
                    onClick={handleUseMyLocation}
                    disabled={isLocating}
                  >
                    <FiNavigation />
                    {isLocating ? "Locating..." : "Use My Location"}
                  </button>
                  {geolocationError && (
                    <span className={styles.locationErrorHint}>
                      {geolocationError === "permission-denied" &&
                        "Permission denied"}
                      {geolocationError === "timeout" && "Timeout occurred"}
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.mapContainer}>
                <DraggableMapPicker
                  onLocationSelect={handleMapUpdate}
                  initialPosition={
                    formData.latitude && formData.longitude
                      ? {
                          lat: parseFloat(formData.latitude),
                          lng: parseFloat(formData.longitude),
                        }
                      : null
                  }
                />
              </div>
              {(formData.address ||
                formData.city ||
                formData.state ||
                formData.latitude) && (
                <div className={styles.locationDetails}>
                  {formData.address && (
                    <p>
                      <strong>Address:</strong> {formData.address}
                    </p>
                  )}
                  {(formData.city || formData.state) && (
                    <p>
                      <strong>Location:</strong>{" "}
                      {[formData.city, formData.state]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  {formData.latitude && formData.longitude && (
                    <p>
                      <strong>Coordinates:</strong> {formData.latitude},{" "}
                      {formData.longitude}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={styles.formFooter}>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? (
                <span className={styles.buttonLoader}></span>
              ) : (
                "Add Turf"
              )}
            </button>
            <p className={styles.requiredHint}>* Required fields</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTurf;
