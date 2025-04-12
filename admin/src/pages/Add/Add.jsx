import React, { useState, useEffect } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ url }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Cultural",
    totalTickets: "", // Add totalTickets in the data state
  });

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Validation checks
    if (
      !data.name ||
      !data.description ||
      !data.price ||
      !data.totalTickets ||
      !image
    ) {
      toast.error("Please fill all fields and upload an image.");
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
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      formData.append("image", image);
      formData.append("totalTickets", data.totalTickets); // Include totalTickets

      const response = await axios.post(`${url}/api/event/add`, formData);

      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Cultural",
          totalTickets: "", // Reset totalTickets after successful form submission
        });
        setImage(null);
        setPreview(null);
        toast.success(response.data.message);
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
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              className="image"
              src={preview || assets.upload_area}
              alt="Upload preview"
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Event Name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Enter event name"
          />
        </div>
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
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Event Category</p>
            <select
              className="selectt"
              onChange={onChangeHandler}
              name="category"
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
            />
          </div>
        </div>
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
        <button type="submit" className="add-btn">
          ADD EVENT
        </button>
      </form>
    </div>
  );
};

export default Add;
