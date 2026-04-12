import React, { useState, useEffect } from "react";
import styles from "../Add/Add.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import DraggableMapPicker from "../../components/DraggableMapPicker/DraggableMapPicker.jsx";

const Edit = ({ url }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [coverImage, setCoverImage] = useState(null);
  const [otherImages, setOtherImages] = useState(Array(4).fill(null));
  const [coverPreview, setCoverPreview] = useState(null);
  const [otherPreviews, setOtherPreviews] = useState(Array(4).fill(null));
  
  const [rulebook, setRulebook] = useState(null);
  const [existingRulebook, setExistingRulebook] = useState(null);
  const [removeRulebook, setRemoveRulebook] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverDragActive, setCoverDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    isPaid: true,
    organizerContact: "",
    teamSizeLimit: 10,
    teamSizeMinLimit: 1,
    memberWisePayment: false,
    date: "",
    time: "",
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
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${url}/api/event/${id}`);
        if (res.data.success) {
          const eventData = res.data.data;
          // Format date for <input type="date"> which needs YYYY-MM-DD
          let formattedDate = "";
          if (eventData.date) {
             formattedDate = new Date(eventData.date).toISOString().split('T')[0];
          }

          setData({
            name: eventData.name,
            description: eventData.description,
            price: eventData.price,
            isPaid: eventData.isPaid !== undefined ? eventData.isPaid : true,
            organizerContact: eventData.organizerContact || "",
            teamSizeLimit: eventData.teamSizeLimit || 10,
            teamSizeMinLimit: eventData.teamSizeMinLimit || 1,
            memberWisePayment: eventData.memberWisePayment || false,
            date: formattedDate,
            time: eventData.time || "",
            category: eventData.category,
            totalTickets: eventData.totalTickets,
            highlights: eventData.highlights || [],
            location: {
              city: eventData.location?.city || "",
              state: eventData.location?.state || "",
              country: eventData.location?.country || "India",
              latitude: eventData.location?.latitude || "",
              longitude: eventData.location?.longitude || "",
              address: eventData.location?.address || "",
            },
          });
          
          if (eventData.coverImage?.url) {
            setCoverPreview(eventData.coverImage.url);
            setCoverImage(eventData.coverImage.url);
          }
          
          if (eventData.rulebook?.url) {
            setExistingRulebook(eventData.rulebook);
          }

          if (eventData.otherImages && eventData.otherImages.length > 0) {
            const previews = Array(4).fill(null);
            const items = Array(4).fill(null);
            eventData.otherImages.forEach((img, idx) => {
              if (idx < 4) {
                previews[idx] = img.url;
                items[idx] = img.url;
              }
            });
            setOtherPreviews(previews);
            setOtherImages(items);
          }
        } else {
          toast.error("Event not found");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load event data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id, url]);

  // Handle URL creation for newly uploaded File objects only
  useEffect(() => {
    if (coverImage instanceof File) {
      const imgUrl = URL.createObjectURL(coverImage);
      setCoverPreview(imgUrl);
      return () => URL.revokeObjectURL(imgUrl);
    }
  }, [coverImage]);

  useEffect(() => {
    const urlsToRevoke = [];
    const previews = otherImages.map((item, index) => {
      if (item instanceof File) {
        const imgUrl = URL.createObjectURL(item);
        urlsToRevoke.push(imgUrl);
        return imgUrl;
      }
      if (typeof item === 'string') {
        return item; // existing url
      }
      return null;
    });
    
    // Only update previews if we have loaded the data to avoid overwriting existing data unexpectedly
    if(!isLoading) {
       setOtherPreviews(previews);
    }
    
    return () => urlsToRevoke.forEach((imgUrl) => URL.revokeObjectURL(imgUrl));
  }, [otherImages, isLoading]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    if (
      ["city", "state", "country", "latitude", "longitude", "address"].includes(
        name
      )
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
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
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
      (data.isPaid && !data.price && data.price !== 0) ||
      !data.totalTickets ||
      !data.location.city ||
      !coverImage
    ) {
      toast.error("Please fill all required fields and upload a cover image");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("isPaid", data.isPaid);
      formData.append("price", data.isPaid ? Number(data.price) : 0);
      formData.append("organizerContact", data.organizerContact);
      formData.append("teamSizeLimit", Number(data.teamSizeLimit));
      formData.append("teamSizeMinLimit", Number(data.teamSizeMinLimit));
      formData.append("memberWisePayment", data.memberWisePayment);
      if (data.date) {
        formData.append("date", data.date);
      }
      if (data.time) {
        formData.append("time", data.time);
      }
      formData.append("category", data.category);
      formData.append("totalTickets", Number(data.totalTickets));

      if (coverImage instanceof File) {
        formData.append("coverImage", coverImage);
      }

      const retainedUrls = [];
      otherImages.forEach((img) => {
        if (img instanceof File) {
           formData.append("otherImages", img);
        } else if (typeof img === 'string') {
           retainedUrls.push(img);
        }
      });
      formData.append("retainedOtherImages", JSON.stringify(retainedUrls));

      if (rulebook) {
        formData.append("rulebook", rulebook);
      } else if (removeRulebook) {
        formData.append("removeRulebook", "true");
      }

      formData.append("highlights", JSON.stringify(data.highlights));

      formData.append(
        "location",
        JSON.stringify({
          city: data.location.city,
          state: data.location.state,
          country: data.location.country,
          latitude: parseFloat(data.location.latitude) || 0,
          longitude: parseFloat(data.location.longitude) || 0,
          address: data.location.address,
        })
      );

      const response = await axios.post(`${url}/api/event/edit/${id}`, formData);

      if (response.data.success) {
        toast.success("Event updated successfully");
        navigate("/event/list");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to update event");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleThumbDrop = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = [...otherImages];
      files[index] = e.dataTransfer.files[0];
      setOtherImages(files);
    }
  };

  if (isLoading) {
    return <div style={{ padding: "2rem" }}>Loading event details...</div>;
  }

  return (
    <div className={styles.add}>
      <div className={styles.addHeader}>
        <h1>Edit Event</h1>
        <p>Update your event details</p>
      </div>
      <form
        className={styles.flexCol}
        onSubmit={onSubmitHandler}
        autoComplete="off"
      >
        <div className={styles.formSection}>
          <h3>Event Images</h3>
          <div className={styles.imageUploadGrid}>
            <div className={styles.coverImageUpload}>
              <p>Cover Image *</p>
              <label
                htmlFor="coverImage"
                className={`${styles.imageUploadLabel}${
                  coverDragActive ? " " + styles.dragover : ""
                }`}
                onDragEnter={handleCoverDrag}
                onDragOver={handleCoverDrag}
                onDragLeave={handleCoverDrag}
                onDrop={handleCoverDrop}
                tabIndex={0}
              >
                {coverPreview ? (
                  <div className={styles.coverImageWrapper}>
                    <img
                      className={styles.coverImagePreview}
                      src={coverPreview}
                      alt="Cover Preview"
                    />
                    <button
                      type="button"
                      className={styles.removeImageBtn}
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
                  <div className={styles.uploadPlaceholder}>
                    <div className={styles.uploadIcon}></div>
                    <div className={styles.uploadText}>
                      <span className={styles.uploadTitle}>
                        Upload Cover Image
                      </span>
                      <span className={styles.uploadSubtitle}>
                        Click, drag & drop or paste
                      </span>
                      <span className={styles.uploadRequirements}>
                        JPG, PNG • Recommended: 1200×600px
                      </span>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  id="coverImage"
                  accept="image/*"
                  hidden
                  onChange={(e) => setCoverImage(e.target.files[0])}
                />
              </label>
            </div>
            <div className={styles.otherImagesUpload}>
              <p>Additional Images (3-4 recommended)</p>
              <div className={styles.otherImagesGrid}>
                {Array(4)
                  .fill(null)
                  .map((_, index) => (
                    <label
                      key={index}
                      className={styles.imageThumbWrapper}
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
                        }}
                      />
                      {otherPreviews[index] ? (
                        <div className={styles.thumbImageWrapper}>
                          <img
                            src={otherPreviews[index]}
                            alt={`Preview ${index + 1}`}
                            className={styles.imageThumb}
                          />
                          <button
                            type="button"
                            className={styles.removeThumbBtn}
                            aria-label={`Remove image ${index + 1}`}
                            onClick={() => {
                              const files = [...otherImages];
                              files[index] = null;
                              setOtherImages(files);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className={styles.thumbPlaceholder}>
                          <div className={styles.thumbIcon}>+</div>
                          <span>Image {index + 1}</span>
                        </div>
                      )}
                    </label>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Event Details</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Event Name *</label>
              <input
                onChange={onChangeHandler}
                value={data.name}
                type="text"
                name="name"
                placeholder="Enter event name"
                required
                className={styles.groovitiInput}
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Event Description *</label>
              <textarea
                onChange={onChangeHandler}
                value={data.description}
                name="description"
                rows="6"
                placeholder="Describe the event, include key attractions, schedule, and what attendees can expect..."
                required
                className={styles.groovitiTextarea}
              ></textarea>
            </div>
            <div className={styles.formGroup}>
              <label>Event Category *</label>
              <select
                onChange={onChangeHandler}
                name="category"
                value={data.category}
                className={styles.groovitiSelect}
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
            <div className={styles.formGroup}>
              <label>Event Date *</label>
              <input
                onChange={onChangeHandler}
                value={data.date}
                type="date"
                name="date"
                required
                className={styles.groovitiInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Event Time *</label>
              <input
                onChange={onChangeHandler}
                value={data.time}
                type="time"
                name="time"
                required
                className={styles.groovitiInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Event Type *</label>
              <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="isPaid"
                    checked={data.isPaid === true}
                    onChange={() => setData((prev) => ({ ...prev, isPaid: true }))}
                  />
                  Paid
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="isPaid"
                    checked={data.isPaid === false}
                    onChange={() => setData((prev) => ({ ...prev, isPaid: false }))}
                  />
                  Free
                </label>
              </div>
            </div>
            {data.isPaid && (
              <div className={styles.formGroup}>
                <label>Event Price (₹) *</label>
                <input
                  onChange={onChangeHandler}
                  value={data.price}
                  type="number"
                  name="price"
                  placeholder="Example: 100"
                  required
                  className={styles.groovitiInput}
                  min="0"
                />
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginTop: "10px", fontSize: "14px", color: "#555" }}>
                  <input
                    type="checkbox"
                    checked={data.memberWisePayment === true}
                    onChange={(e) => setData((prev) => ({ ...prev, memberWisePayment: e.target.checked }))}
                  />
                  Charge this price per Team Member (Instead of flat fee per Team)
                </label>
              </div>
            )}
            <div className={styles.formGroup}>
              <label>Total Tickets *</label>
              <input
                onChange={onChangeHandler}
                value={data.totalTickets}
                type="number"
                name="totalTickets"
                placeholder="Enter total tickets available"
                required
                className={styles.groovitiInput}
                min="1"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Min Team Size *</label>
              <input
                onChange={onChangeHandler}
                value={data.teamSizeMinLimit}
                type="number"
                name="teamSizeMinLimit"
                placeholder="Example: 1"
                required
                className={styles.groovitiInput}
                min="1"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Max Team Size *</label>
              <input
                onChange={onChangeHandler}
                value={data.teamSizeLimit}
                type="number"
                name="teamSizeLimit"
                placeholder="Example: 10"
                required
                className={styles.groovitiInput}
                min={data.teamSizeMinLimit}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Organizer Contact Number</label>
              <input
                onChange={onChangeHandler}
                value={data.organizerContact}
                type="tel"
                name="organizerContact"
                placeholder="Example: +91 9876543210"
                className={styles.groovitiInput}
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Event Features</h3>
          <div className={styles.highlightsGrid}>
            {[
              "Live Music",
              "Seating Available",
              "Washrooms",
              "Parking",
              "Food Stalls",
            ].map((highlight) => (
              <label
                key={highlight}
                className={`${styles.highlightOption} ${
                  data.highlights?.includes(highlight) ? styles.active : ""
                }`}
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
                <span className={styles.checkmark}></span>
                {highlight}
              </label>
            ))}
          </div>
        </div>

        {/* Rulebook Section */}
        <div className={styles.formSection}>
          <h3>Event Rulebook</h3>
          <div className={styles.formGroup}>
            <label>Upload Rulebook (PDF/DOC)</label>
            {existingRulebook && !removeRulebook ? (
               <div style={{ padding: "10px", background: "#f9f9f9", borderRadius: "8px", marginBottom: "10px" }}>
                 <p style={{ margin: "0 0 10px 0" }}>Current Rulebook attached.</p>
                 <a href={existingRulebook.url} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", textDecoration: "underline", marginRight: "15px" }}>View Current</a>
                 <button type="button" onClick={() => { setRemoveRulebook(true); setRulebook(null); }} style={{ background: "#ef4444", color: "white", border: "none", borderRadius: "5px", padding: "4px 8px", cursor: "pointer" }}>Remove</button>
               </div>
            ) : (
              <>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => { setRulebook(e.target.files[0]); setRemoveRulebook(false); }}
                  className={styles.groovitiInput}
                  style={{ paddingTop: "10px" }}
                />
                {rulebook && <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>Selected: {rulebook.name}</p>}
                {removeRulebook && existingRulebook && <p style={{ fontSize: "0.9rem", color: "#eab308", marginTop: "5px" }}>Current rulebook will be deleted upon save. <button type="button" onClick={() => {setRemoveRulebook(false); setRulebook(null);}} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", textDecoration: "underline" }}>Cancel</button></p>}
              </>
            )}
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Event Location</h3>
          <div className={styles.locationGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
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
                className={styles.groovitiInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>City *</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={data.location.city}
                onChange={onChangeHandler}
                required
                className={styles.groovitiInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>State</label>
              <input
                type="text"
                name="state"
                placeholder="State"
                value={data.location.state}
                onChange={onChangeHandler}
                className={styles.groovitiInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Country</label>
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={data.location.country}
                onChange={onChangeHandler}
                className={styles.groovitiInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Latitude</label>
              <input
                type="number"
                step="any"
                name="latitude"
                placeholder="Latitude coordinates"
                value={data.location.latitude || ""}
                onChange={onChangeHandler}
                className={styles.groovitiInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Longitude</label>
              <input
                type="number"
                step="any"
                name="longitude"
                placeholder="Longitude coordinates"
                value={data.location.longitude || ""}
                onChange={onChangeHandler}
                className={styles.groovitiInput}
              />
            </div>
          </div>
          <div className={styles.locationActions}>
            <button
              type="button"
              onClick={fetchUserLocation}
              className={styles.locationBtn}
            >
              Detect Current Location
            </button>
          </div>
        </div>
        
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
        
        <div className={styles.formActions}>
          <button
            type="submit"
            className={`${styles.submitBtn} ${
              isSubmitting ? styles.submitting : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className={styles.spinner}></div>
                Updating Event...
              </>
            ) : (
              "Update Event"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;
