import React, { useState, useEffect } from "react";
import "./Add.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DraggableMapPicker from "../../components/DraggableMapPicker/DraggableMapPicker.jsx";

const Add = ({ url }) => {
  const [coverImage, setCoverImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [coverPreview, setCoverPreview] = useState(null);
  const navigate = useNavigate();
  const [otherPreviews, setOtherPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Cultural",
    totalTickets: "",
    highlights: [],
    location: {
      city: "",
      state: "",
      country: "India",
      latitude: "",
      longitude: "",
      address: "",
    },
  });

  useEffect(() => {
    if (coverImage) {
      const url = URL.createObjectURL(coverImage);
      setCoverPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [coverImage]);

  useEffect(() => {
    if (otherImages.length > 0) {
      const urls = otherImages.map((img) =>
        img ? URL.createObjectURL(img) : null
      );
      setOtherPreviews(urls);
      return () => urls.forEach((url) => url && URL.revokeObjectURL(url));
    }
  }, [otherImages]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    if (
      [
        "city",
        "state",
        "country",
        "latitude",
        "longitude",
        "address",
      ].includes(name)
    ) {
      setData((prevData) => ({
        ...prevData,
        location: { ...prevData.location, [name]: value },
      }));
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const fetchUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    toast.info("Detecting your current location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setData((prev) => ({
          ...prev,
          location: { ...prev.location, latitude, longitude },
        }));

        try {
          const res = await axios.get(
            `${url}/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
          );
          const addr = res.data.address;
          const fullAddress = res.data.display_name;
          const cityName =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.county ||
            addr.region ||
            addr.state ||
            "";

          setData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              city: cityName,
              state: addr.state || "",
              country: addr.country || "India",
              address: fullAddress,
              latitude,
              longitude,
            },
          }));

          if (cityName) {
            toast.success(`Location detected: ${cityName}`);
          } else {
            toast.warn("City name not found in location data");
          }
        } catch (err) {
          console.error("Error in reverse geocoding:", err);
          toast.error("Failed to retrieve address from coordinates");
        }
      },
      (error) => {
        toast.error("Location access denied or unavailable");
      }
    );
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (
      !data.name ||
      !data.description ||
      !data.price ||
      !data.totalTickets ||
      !data.location.city ||
      !coverImage
    ) {
      toast.error("Please fill all required fields and upload a cover image");
      setIsSubmitting(false);
      return;
    }
    if (Number(data.price) <= 0) {
      toast.error("Price must be greater than zero");
      setIsSubmitting(false);
      return;
    }
    if (Number(data.totalTickets) <= 0) {
      toast.error("Total tickets must be a positive number");
      setIsSubmitting(false);
      return;
    }
    try {
      const organizerEmail = localStorage.getItem("eventHost");
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      formData.append("highlights", JSON.stringify(data.highlights));
      formData.append("coverImage", coverImage);
      formData.append("organizerEmail", organizerEmail);
      otherImages.forEach((img) => {
        if (img) formData.append("otherImages", img);
      });
      formData.append("totalTickets", data.totalTickets);
      formData.append(
        "location",
        JSON.stringify({
          city: data.location.city,
          state: data.location.state,
          country: data.location.country,
          latitude: parseFloat(data.location.latitude),
          longitude: parseFloat(data.location.longitude),
          address: data.location.address,
        })
      );

      const response = await axios.post(`${url}/api/event/add`, formData);

      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Cultural",
          totalTickets: "",
          highlights: [],
          location: {
            city: "",
            state: "",
            country: "India",
            latitude: "",
            longitude: "",
            address: "",
          },
        });
        setCoverImage(null);
        setCoverPreview(null);
        setOtherImages([]);
        setOtherPreviews([]);

        toast.success("Event created successfully");
        setTimeout(() => {
          navigate("/list");
        }, 1500);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to create event. Please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Drag-and-drop for cover image (basic implementation)
  const [coverDragActive, setCoverDragActive] = useState(false);
  const handleCoverDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setCoverDragActive(true);
    } else if (e.type === "dragleave") {
      setCoverDragActive(false);
    }
  };
  const handleCoverDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCoverDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCoverImage(e.dataTransfer.files[0]);
    }
  };

  // Drag-and-drop for additional images (basic implementation)
  const handleThumbDrop = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = [...otherImages];
      files[index] = e.dataTransfer.files[0];
      setOtherImages(files);

      const previews = [...otherPreviews];
      previews[index] = URL.createObjectURL(e.dataTransfer.files[0]);
      setOtherPreviews(previews);
    }
  };

  return (
    <div className="add">
      <div className="add-header">
        <h1>Create New Event</h1>
        <p>Complete the form below to list your event on Grooviti</p>
      </div>

      <form className="flex-col" onSubmit={onSubmitHandler} autoComplete="off">
        {/* Image Upload Section */}
        <div className="form-section">
          <h3>Event Images</h3>
          <div className="image-upload-grid">
            {/* Cover Image */}
            <div className="cover-image-upload">
              <p>Cover Image *</p>
              <label
                htmlFor="coverImage"
                className={`image-upload-label${coverDragActive ? " dragover" : ""}`}
                onDragEnter={handleCoverDrag}
                onDragOver={handleCoverDrag}
                onDragLeave={handleCoverDrag}
                onDrop={handleCoverDrop}
                tabIndex={0}
              >
                {coverPreview ? (
                  <div className="cover-image-wrapper">
                    <img
                      className="cover-image-preview"
                      src={coverPreview}
                      alt="Cover Preview"
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      aria-label="Remove cover image"
                      onClick={() => {
                        setCoverImage(null);
                        setCoverPreview(null);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon"></div>
                    <div className="upload-text">
                      <span className="upload-title">Upload Cover Image</span>
                      <span className="upload-subtitle">Click, drag & drop or paste</span>
                      <span className="upload-requirements">JPG, PNG • Recommended: 1200×600px</span>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  id="coverImage"
                  accept="image/*"
                  hidden
                  required
                  onChange={(e) => setCoverImage(e.target.files[0])}
                />
              </label>
            </div>

            {/* Other Images */}
            <div className="other-images-upload">
              <p>Additional Images (3-4 recommended)</p>
              <div className="other-images-grid">
                {Array(4)
                  .fill(null)
                  .map((_, index) => (
                    <label
                      key={index}
                      className="image-thumb-wrapper"
                      onDrop={(e) => handleThumbDrop(index, e)}
                      onDragOver={(e) => e.preventDefault()}
                      tabIndex={0}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const files = [...otherImages];
                          files[index] = e.target.files[0];
                          setOtherImages(files);

                          const previews = [...otherPreviews];
                          previews[index] = URL.createObjectURL(e.target.files[0]);
                          setOtherPreviews(previews);
                        }}
                      />
                      {otherPreviews[index] ? (
                        <div className="thumb-image-wrapper">
                          <img
                            src={otherPreviews[index]}
                            alt={`Preview ${index + 1}`}
                            className="image-thumb"
                          />
                          <button
                            type="button"
                            className="remove-thumb-btn"
                            aria-label={`Remove image ${index + 1}`}
                            onClick={() => {
                              const files = [...otherImages];
                              files[index] = null;
                              setOtherImages(files);

                              const previews = [...otherPreviews];
                              previews[index] = null;
                              setOtherPreviews(previews);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="thumb-placeholder">
                          <div className="thumb-icon">+</div>
                          <span>Image {index + 1}</span>
                        </div>
                      )}
                    </label>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="form-section">
          <h3>Event Details</h3>
          <div className="form-grid">
            {/* Event Name */}
            <div className="form-group">
              <label>Event Name *</label>
              <input
                onChange={onChangeHandler}
                value={data.name}
                type="text"
                name="name"
                placeholder="Enter event name"
                required
                className="grooviti-input"
              />
            </div>
            {/* Description */}
            <div className="form-group full-width">
              <label>Event Description *</label>
              <textarea
                onChange={onChangeHandler}
                value={data.description}
                name="description"
                rows="6"
                placeholder="Describe the event, include key attractions, schedule, and what attendees can expect..."
                required
                className="grooviti-textarea"
              ></textarea>
            </div>
            {/* Category and Price */}
            <div className="form-group">
              <label>Event Category *</label>
              <select
                onChange={onChangeHandler}
                name="category"
                value={data.category}
                className="grooviti-select"
              >
                {[
                  "Cultural",
                  "Club",
                  "Sports",
                  "Tech",
                  "Drama",
                  "Open-mic",
                  "Stand-up",
                  "Conference",
                ].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Event Price (₹) *</label>
              <input
                onChange={onChangeHandler}
                value={data.price}
                type="number"
                name="price"
                placeholder="Example: 100"
                required
                className="grooviti-input"
                min="0"
              />
            </div>
            {/* Total Tickets */}
            <div className="form-group">
              <label>Total Tickets *</label>
              <input
                onChange={onChangeHandler}
                value={data.totalTickets}
                type="number"
                name="totalTickets"
                placeholder="Enter total tickets available"
                required
                className="grooviti-input"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Highlights Section */}
        <div className="form-section">
          <h3>Event Features</h3>
          <div className="highlights-grid">
            {[
              "Live Music",
              "Seating Available",
              "Washrooms",
              "Parking",
              "Food Stalls",
            ].map((highlight) => (
              <label
                key={highlight}
                className={`highlight-option ${data.highlights?.includes(highlight) ? "active" : ""}`}
              >
                <input
                  type="checkbox"
                  value={highlight}
                  checked={data.highlights?.includes(highlight)}
                  onChange={() => {
                    const updated = data.highlights?.includes(highlight)
                      ? data.highlights.filter((h) => h !== highlight)
                      : [...(data.highlights || []), highlight];

                    setData((prev) => ({
                      ...prev,
                      highlights: updated,
                    }));
                  }}
                />
                <span className="checkmark"></span>
                {highlight}
              </label>
            ))}
          </div>
        </div>

        {/* Location Section */}
        <div className="form-section">
          <h3>Event Location</h3>
          <div className="location-grid">
            <div className="form-group full-width">
              <label>Full Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter complete venue address"
                value={data.location.address || ""}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    location: { ...prev.location, address: e.target.value },
                  }))
                }
                className="grooviti-input"
              />
            </div>

            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={data.location.city}
                onChange={onChangeHandler}
                required
                className="grooviti-input"
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                placeholder="State"
                value={data.location.state}
                onChange={onChangeHandler}
                className="grooviti-input"
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={data.location.country}
                onChange={onChangeHandler}
                className="grooviti-input"
              />
            </div>

            <div className="form-group">
              <label>Latitude</label>
              <input
                type="number"
                step="any"
                name="latitude"
                placeholder="Latitude coordinates"
                value={data.location.latitude || ""}
                onChange={onChangeHandler}
                className="grooviti-input"
              />
            </div>

            <div className="form-group">
              <label>Longitude</label>
              <input
                type="number"
                step="any"
                name="longitude"
                placeholder="Longitude coordinates"
                value={data.location.longitude || ""}
                onChange={onChangeHandler}
                className="grooviti-input"
              />
            </div>
          </div>

          <div className="location-actions">
            <button
              type="button"
              onClick={fetchUserLocation}
              className="location-btn"
            >
              Detect Current Location
            </button>
          </div>
        </div>

        {/* Map Picker */}
        <DraggableMapPicker
          lat={data.location.latitude}
          lng={data.location.longitude}
          setLatLng={(latlng) =>
            setData((prev) => ({
              ...prev,
              location: {
                ...prev.location,
                latitude: latlng.lat,
                longitude: latlng.lng,
              },
            }))
          }
          setAddress={(addr) =>
            setData((prev) => ({
              ...prev,
              location: {
                ...prev.location,
                ...addr,
              },
            }))
          }
          url={url}
        />

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            className={`submit-btn ${isSubmitting ? "submitting" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Creating Event...
              </>
            ) : (
              "Create Event"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;
