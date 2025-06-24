import React, { useState, useEffect } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
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
      const urls = otherImages.map((img) => URL.createObjectURL(img));
      setOtherPreviews(urls);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }
  }, [otherImages]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    if (
      ["city", "state", "country", "latitude", "longitude", "address"].includes(
        name
      )
    ) {
      setData((prevData) => ({
        ...prevData,
        location: {
          ...prevData.location,
          [name]: value,
        },
      }));
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const fetchUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        setData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            latitude,
            longitude,
          },
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
            toast.warn("City not found, but coordinates and address set");
          }
        } catch (err) {
          console.error("Error in reverse geocoding:", err);
          toast.error("Failed to get address from coordinates.");
        }
      },
      (error) => {
        toast.error("Permission denied or location unavailable.");
      }
    );
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (
      !data.name ||
      !data.description ||
      !data.price ||
      !data.totalTickets ||
      !data.location.city
    ) {
      toast.error(
        "Please fill all required fields including city and upload an image."
      );
      return;
    }

    if (Number(data.price) <= 0) {
      toast.error("Price must be greater than zero.");
      return;
    }

    if (Number(data.totalTickets) <= 0) {
      toast.error("Total Tickets must be a positive number.");
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
        formData.append("otherImages", img);
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

        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/list");
        }, 200);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to add event. Please try again.");
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        {/* Cover Image */}
        <div className="add-img-upload flex-col">
          <p>Upload Cover Image</p>
          <label htmlFor="coverImage">
            <img
              className="image"
              src={coverPreview || assets.upload_area}
              alt="Cover Preview"
            />
          </label>
          <input
            type="file"
            id="coverImage"
            accept="image/*"
            hidden
            required
            onChange={(e) => setCoverImage(e.target.files[0])}
          />
        </div>
        {/* Other Images Upload with Preview Click */}
        <div className="add-img-upload flex-col">
          <p>Upload Other Event Images (3-4)</p>
          <div className="other-images-wrapper">
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <label key={index} className="image-thumb-wrapper">
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
                  <img
                    src={
                      otherPreviews[index]
                        ? otherPreviews[index]
                        : assets.upload_area
                    }
                    alt={`preview-${index}`}
                    className="image-thumb"
                  />
                </label>
              ))}
          </div>
        </div>

        {/* Event Name */}
        <div className="add-product-name flex-col">
          <p>Event Name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Enter event name"
            required
          />
        </div>
        {/* Description */}
        <div className="add-product-description flex-col">
          <p>Event Description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Describe the event"
            required
          ></textarea>
        </div>
        {/* Category and Price */}
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Event Category</p>
            <select
              className="selectt"
              onChange={onChangeHandler}
              name="category"
              value={data.category}
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
          <div className="add-price flex-col">
            <p>Event Price (Rs)</p>
            <input
              className="inputclasa"
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="ex : 100"
              required
            />
          </div>
        </div>
        {/* Total Tickets */}
        <div className="add-total-tickets flex-col">
          <p>Total Tickets</p>
          <input
            className="inputclasa"
            onChange={onChangeHandler}
            value={data.totalTickets}
            type="number"
            name="totalTickets"
            placeholder="Enter total tickets"
            required
          />
        </div>
        {/* Event highlight */}
        <div className="highlights-selection">
          <h4>Event Highlights</h4>
          {[
            "Live Music",
            "Seating Available",
            "Washrooms",
            "Parking",
            "Food Stalls",
          ].map((highlight) => (
            <label key={highlight} className="highlight-option">
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
              {highlight}
            </label>
          ))}
        </div>

        {/* Location inputs */}
        <div className="add-location">
          <p>Event Location</p>
          <input
            type="text"
            name="address"
            placeholder="Full address (optional)"
            value={data.location.address || ""}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                location: { ...prev.location, address: e.target.value },
              }))
            }
          />
          <input
            type="text"
            name="city"
            placeholder="City (required)"
            value={data.location.city}
            onChange={onChangeHandler}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={data.location.state}
            onChange={onChangeHandler}
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={data.location.country}
            onChange={onChangeHandler}
          />
          <input
            type="number"
            step="any"
            name="latitude"
            placeholder="Latitude"
            value={data.location.latitude || ""}
            onChange={onChangeHandler}
          />
          <input
            type="number"
            step="any"
            name="longitude"
            placeholder="Longitude"
            value={data.location.longitude || ""}
            onChange={onChangeHandler}
          />
          <button
            type="button"
            onClick={fetchUserLocation}
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              backgroundColor: "#ff6000",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Use My Current Location
          </button>
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
                ...addr, // { address, city, state, country }
              },
            }))
          }
          url={url}
        />
        <button type="submit" className="add-btn">
          ADD EVENT
        </button>
      </form>
    </div>
  );
};

export default Add;
